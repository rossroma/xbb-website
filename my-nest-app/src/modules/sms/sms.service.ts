import { Injectable, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomInt } from 'crypto';
import * as path from 'path';
import * as svgCaptcha from 'svg-captcha';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import { SmsCode } from './entities/sms-code.entity';
import { SmsLog } from './entities/sms-log.entity';
import { smsConfig } from './config/sms.config';
import { QuerySmsLogDto } from './dto/query-sms-log.dto';

// 加载自定义字体（Arial Bold），替换默认的 Comic Sans 风格字体
// 使用粗体提升验证码可读性，Arial 字体更加专业整洁
try {
  const fontPath = path.join(process.cwd(), 'assets/fonts/Arial-Bold.ttf');
  svgCaptcha.loadFont(fontPath);
} catch {
  // 字体加载失败时使用默认字体，不影响服务启动
  console.warn('自定义验证码字体加载失败，使用默认字体');
}

/**
 * 短信服务
 *
 * 核心功能：
 * - 算式验证码生成与校验
 * - 短信验证码发送（助通科技平台）
 * - 短信验证码校验
 * - 频率限制（手机号 + IP）
 * - 发送日志记录
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  /** 手机号级别的发送锁，防止并发请求绕过频率限制 */
  private readonly phoneLocks = new Map<string, Promise<void>>();

  constructor(
    @InjectRepository(SmsCode)
    private readonly smsCodeRepository: Repository<SmsCode>,
    @InjectRepository(SmsLog)
    private readonly smsLogRepository: Repository<SmsLog>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  // ==================== 算式验证码 ====================

  /**
   * 生成算式验证码
   * @returns SVG 字符串和算式结果
   */
  generateCaptcha(): { svg: string; text: string } {
    // 使用数学算式验证码（如 "3+5=?"），text 为算式结果
    const captcha = svgCaptcha.createMathExpr({
      noise: 2,             // 干扰线条数
      color: true,          // 彩色字符
      background: '#f8f9fa', // 浅灰色背景
      width: 100,           // 宽度
      height: 40,           // 高度
      fontSize: 34,         // 字号
      mathMin: 1,           // 算式最小值
      mathMax: 9,           // 算式最大值
      mathOperator: '+',    // 仅使用加法，简单友好
    });

    return { svg: captcha.data, text: captcha.text };
  }

  /**
   * 将算式结果打包为 JWT Token（5 分钟有效）
   * 无状态，不依赖数据库或缓存
   */
  createCaptchaToken(captchaText: string): string {
    return this.jwtService.sign(
      { code: captchaText },
      {
        secret: smsConfig.captchaJwtSecret,
        expiresIn: smsConfig.codeExpireSeconds,
      },
    );
  }

  /**
   * 校验算式验证码 Token，返回算式结果
   *
   * 区分 JWT 过期和签名无效错误：
   * - TokenExpiredError → 提示刷新
   * - JsonWebTokenError（签名无效/篡改）→ 记录告警日志
   */
  verifyCaptchaToken(token: string): string {
    try {
      const payload = this.jwtService.verify<{ code: string }>(token, {
        secret: smsConfig.captchaJwtSecret,
      });
      return payload.code;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('算式已过期，请刷新后重试');
      }
      if (error?.name === 'JsonWebTokenError') {
        this.logger.warn(`算式验证码 Token 签名无效（可能被篡改）: ${error.message}`);
        throw new BadRequestException('验证码校验失败，请刷新后重试');
      }
      this.logger.error(`算式验证码 Token 校验异常: ${error?.message || error}`);
      throw new BadRequestException('算式已过期，请刷新后重试');
    }
  }

  // ==================== 短信发送 ====================

  /**
   * 发送短信验证码
   *
   * 流程：校验算式验证码 → 频率限制 → 生成验证码 → 调用助通科技 API → 存储验证码 → 记录日志
   */
  async sendSms(tel: string, captcha: string, token: string, clientIp: string, userAgent?: string): Promise<{ expireSeconds: number }> {
    // 1. 校验算式验证码：从 JWT 中取出算式结果，与用户输入比对
    const correctCode = this.verifyCaptchaToken(token);
    if (correctCode.toLowerCase() !== captcha.toLowerCase()) {
      throw new BadRequestException('算式结果错误');
    }

    // 2. 获取手机号级别的锁，防止并发请求绕过频率限制
    await this.acquirePhoneLock(tel);

    try {
      // 3. 频率限制检查
      await this.checkRateLimit(tel, clientIp);

      // 4. 生成 6 位数字验证码
      const code = this.generateSmsCode();

      // 5. 调用助通科技 API 发送短信
      const result = await this.callSmsApi(tel, code);

      // 6. 记录发送日志
      await this.recordSmsLog(tel, clientIp, result.success ? 'success' : 'failed', code, userAgent, result.errorMsg);

      if (!result.success) {
        throw new ServiceUnavailableException(result.errorMsg || '短信发送失败，请稍后重试');
      }

      // 7. 存储验证码到数据库
      await this.storeSmsCode(tel, code, clientIp);

      // 8. 清理同手机号的旧验证码
      await this.cleanOldCodes(tel);

      return { expireSeconds: smsConfig.minSendInterval };
    } finally {
      this.releasePhoneLock(tel);
    }
  }

  /**
   * 获取手机号级别的发送锁（串行化同一手机号的请求）
   * 防止并发请求绕过频率限制检查
   */
  private async acquirePhoneLock(phone: string): Promise<void> {
    const existing = this.phoneLocks.get(phone);
    if (existing) {
      await existing;
    }
    // 创建新的锁 Promise，在 releasePhoneLock 中 resolve
    let resolve: () => void;
    const lock = new Promise<void>((r) => { resolve = r; });
    this.phoneLocks.set(phone, lock);
    // 存储 resolve 回调到锁对象上
    (lock as any)._resolve = resolve!;
  }

  /**
   * 释放手机号级别的发送锁
   */
  private releasePhoneLock(phone: string): void {
    const lock = this.phoneLocks.get(phone);
    if (lock && (lock as any)._resolve) {
      (lock as any)._resolve();
      this.phoneLocks.delete(phone);
    }
  }

  /**
   * 频率限制检查
   *
   * 注意：在 phoneLocks 保护下执行，同一手机号的请求已串行化。
   * 跨实例部署时仍需 Redis（INCR + EXPIRE）实现原子化频率限制。
   *
   * - 同一手机号最小发送间隔 60 秒
   * - 同一手机号每小时最多 5 次
   * - 同一 IP 每小时最多 10 次
   */
  private async checkRateLimit(phone: string, ip: string): Promise<void> {
    const now = new Date();
    const minIntervalAgo = new Date(now.getTime() - smsConfig.minSendInterval * 1000);
    const windowAgo = new Date(now.getTime() - smsConfig.rateLimitWindow * 1000);

    // 1. 最小发送间隔（60 秒）
    const recentLog = await this.smsLogRepository.findOne({
      where: {
        phone,
        status: 'success',
      },
      order: { created_at: 'DESC' },
    });

    if (recentLog && recentLog.created_at > minIntervalAgo) {
      const waitSeconds = smsConfig.minSendInterval -
        Math.floor((now.getTime() - recentLog.created_at.getTime()) / 1000);
      throw new BadRequestException(`发送过于频繁，请${waitSeconds}秒后再试`);
    }

    // 2. 手机号频率限制（窗口内成功发送次数）
    const phoneLogs = await this.smsLogRepository.find({
      where: { phone, status: 'success' },
      order: { created_at: 'DESC' },
      take: smsConfig.rateLimitPerPhone + 1,
    });
    const phoneWindowCount = phoneLogs.filter(l => l.created_at > windowAgo).length;

    if (phoneWindowCount >= smsConfig.rateLimitPerPhone) {
      throw new BadRequestException('该手机号今日发送次数已达上限');
    }

    // 3. IP 频率限制（窗口内成功发送次数）
    const ipLogs = await this.smsLogRepository.find({
      where: { ip, status: 'success' },
      order: { created_at: 'DESC' },
      take: smsConfig.rateLimitPerIp + 1,
    });
    const ipWindowCount = ipLogs.filter(l => l.created_at > windowAgo).length;

    if (ipWindowCount >= smsConfig.rateLimitPerIp) {
      throw new BadRequestException('发送次数过多，请稍后再试');
    }
  }

  /**
   * 生成 6 位数字验证码
   */
  private generateSmsCode(): string {
    const max = Math.pow(10, smsConfig.codeLength) - 1;
    const min = Math.pow(10, smsConfig.codeLength - 1);
    return String(randomInt(min, max + 1));
  }

  /**
   * 调用助通科技短信 API
   */
  private async callSmsApi(tel: string, code: string): Promise<{ success: boolean; errorMsg?: string }> {
    const tKey = Math.floor(Date.now() / 1000);
    const passwordHash = createHash('md5')
      .update(createHash('md5').update(smsConfig.password).digest('hex') + tKey)
      .digest('hex');

    const body = {
      username: smsConfig.username,
      password: passwordHash,
      tKey,
      tpId: smsConfig.templateId,
      signature: smsConfig.signature,
      records: [
        {
          mobile: tel,
          tpContent: {
            valid_code: code,
          },
        },
      ],
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(smsConfig.apiUrl, body, {
          timeout: 10000,
          proxy: false, // 绕过系统代理，直连短信 API
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const data = response.data;
      if (data?.code === 200) {
        return { success: true };
      }
      return { success: false, errorMsg: data?.msg || '短信发送失败' };
    } catch (error) {
      const msg = error?.response?.data?.msg || error?.message || '短信服务暂时不可用';
      return { success: false, errorMsg: msg };
    }
  }

  /**
   * 存储短信验证码到数据库（bcrypt 哈希存储，不可逆）
   */
  private async storeSmsCode(phone: string, code: string, ip: string): Promise<void> {
    const hashedCode = await bcrypt.hash(code, 10);
    const smsCode = this.smsCodeRepository.create({
      phone,
      code: hashedCode,
      verified: 0,
      ip,
      created_at: new Date(),
    });
    await this.smsCodeRepository.save(smsCode);
  }

  /**
   * 清理同手机号的旧验证码（保留最新一条）
   */
  private async cleanOldCodes(phone: string): Promise<void> {
    const codes = await this.smsCodeRepository.find({
      where: { phone },
      order: { created_at: 'DESC' },
    });

    // 保留最新一条，删除其余
    if (codes.length > 1) {
      const toDelete = codes.slice(1);
      await this.smsCodeRepository.remove(toDelete);
    }
  }

  /**
   * 记录短信发送日志
   *
   * 注意：验证码存储为 SHA256 哈希值（非明文），仅用于审计去重，不可逆。
   */
  private async recordSmsLog(
    phone: string,
    ip: string,
    status: string,
    code: string,
    userAgent?: string,
    errorMsg?: string,
  ): Promise<void> {
    const log = this.smsLogRepository.create({
      phone,
      ip,
      status,
      code: createHash('sha256').update(code).digest('hex'),
      errorMsg: errorMsg || '',
      userAgent: userAgent || '',
      created_at: new Date(), // 显式设置时间
    });
    await this.smsLogRepository.save(log);
  }

  // ==================== 短信验证 ====================

  /**
   * 验证短信验证码
   *
   * 使用 bcrypt 比对 + 原子 UPDATE 防止并发重用（TOCTOU 竞态条件）：
   * 先原子标记 verified=1，再检查 affected rows，确保同一条记录不会被两个请求同时通过。
   *
   * @returns verified: true 表示验证成功
   */
  async verifyCode(tel: string, code: string): Promise<{ verified: boolean }> {
    // 查找该手机号全部未验证的验证码（按时间倒序，逐个 bcrypt 比对）
    const records = await this.smsCodeRepository.find({
      where: { phone: tel, verified: 0 },
      order: { created_at: 'DESC' },
      take: 3,
    });

    if (records.length === 0) {
      // 检查是否已有已验证的记录（如：上一次提交时验证码已使用，但后续提交失败）
      const verified = await this.isPhoneVerified(tel);
      if (verified) {
        return { verified: true };
      }
      throw new BadRequestException('请先获取验证码');
    }

    // 逐个比对 bcrypt 哈希（取最新 3 条，避免过期记录干扰）
    let matchedRecord: (typeof records)[0] | null = null;
    for (const record of records) {
      const age = (Date.now() - record.created_at.getTime()) / 1000;
      if (age > smsConfig.codeExpireSeconds) {
        continue; // 过期记录跳过
      }
      const isMatch = await bcrypt.compare(code, record.code);
      if (isMatch) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      // 清理过期记录
      const expiredRecords = records.filter(
        (r) => (Date.now() - r.created_at.getTime()) / 1000 > smsConfig.codeExpireSeconds,
      );
      if (expiredRecords.length > 0) {
        await this.smsCodeRepository.remove(expiredRecords);
      }
      throw new BadRequestException('验证码错误或已过期，请重新获取');
    }

    // 原子标记为已验证（WHERE id=? AND verified=0 确保只生效一次）
    const result = await this.smsCodeRepository.update(
      { id: matchedRecord.id, verified: 0 },
      { verified: 1 },
    );

    if (result.affected === 0) {
      throw new BadRequestException('验证码已使用，请重新获取');
    }

    return { verified: true };
  }

  /**
   * 检查手机号是否已通过短信验证
   * 供 Message 模块提交时调用
   */
  async isPhoneVerified(tel: string): Promise<boolean> {
    const record = await this.smsCodeRepository.findOne({
      where: { phone: tel, verified: 1 },
      order: { created_at: 'DESC' },
    });

    if (!record) return false;

    // 验证状态有效期为 10 分钟
    const age = (Date.now() - record.created_at.getTime()) / 1000;
    return age <= 600; // 10 分钟
  }

  // ==================== 日志查询（管理端） ====================

  /**
   * 查询短信发送日志（分页）
   *
   * 支持按手机号、发送状态、日期范围筛选
   */
  async findLogs(query: QuerySmsLogDto) {
    const { page = 1, limit = 10, phone, status, start_date, end_date, sortBy = 'created_at_desc' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.smsLogRepository.createQueryBuilder('sms_logs');

    // 手机号模糊搜索
    if (phone) {
      queryBuilder.andWhere('sms_logs.phone LIKE :phone', { phone: `%${phone}%` });
    }

    // 发送状态筛选
    if (status) {
      queryBuilder.andWhere('sms_logs.status = :status', { status });
    }

    // 日期范围筛选
    if (start_date && end_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('sms_logs.created_at BETWEEN :start AND :end', { start, end });
    } else if (start_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('sms_logs.created_at >= :start', { start });
    } else if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('sms_logs.created_at <= :end', { end });
    }

    // 排序：格式如 "created_at_desc"，取最后一个 _ 分隔
    const lastUnderscoreIndex = sortBy.lastIndexOf('_');
    const sortField = sortBy.substring(0, lastUnderscoreIndex);
    const sortOrder = sortBy.substring(lastUnderscoreIndex + 1);
    queryBuilder.orderBy(`sms_logs.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // 分页
    const [list, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      list,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}