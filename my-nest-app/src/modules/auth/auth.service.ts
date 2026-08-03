import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { RESPONSE_CODE } from '../../common/constants/response-code';
import { JwtPayload } from './strategies/jwt.strategy';
import { Admin } from './entities/admin.entity';
import { AdminGroup } from './entities/admin-group.entity';
import { LogsService } from '../logs/logs.service';
import * as crypto from 'crypto';
import * as svgCaptcha from 'svg-captcha';

interface CaptchaRecord {
  code: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly captchaStore = new Map<string, CaptchaRecord>();

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminGroup)
    private adminGroupRepository: Repository<AdminGroup>,
    private logsService: LogsService,
  ) { }

  generateCaptcha(): { captchaId: string; image: string; expiresIn: number } {
    this.cleanupExpiredCaptchas();

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

    const captchaId = crypto.randomUUID();
    const expiresIn = 5 * 60 * 1000;
    this.captchaStore.set(captchaId, {
      code: captcha.text.toUpperCase(),
      expiresAt: Date.now() + expiresIn,
    });

    return {
      captchaId,
      image: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
      expiresIn,
    };
  }

  async login(loginDto: LoginDto, ip: string = '127.0.0.1', userAgent?: string): Promise<LoginResponseDto> {
    const { username, password, captchaId, captchaCode } = loginDto;

    this.validateCaptcha(captchaId, captchaCode);

    // 查找用户
    const admin = await this.adminRepository.findOne({
      where: { username, status: 1 }, // 只查找状态为1的用户
    });

    if (!admin) {
      throw new BusinessException(
        RESPONSE_CODE.AUTH_FAILED,
        '用户名或密码错误',
      );
    }

    // 验证密码
    const isPasswordValid = await this.validatePassword(password, admin.userpwd, admin.salt);

    if (!isPasswordValid) {
      throw new BusinessException(
        RESPONSE_CODE.AUTH_FAILED,
        '用户名或密码错误',
      );
    }

    // 记录登录日志
    await this.logsService.recordLogin(username, ip, 1, userAgent);

    // 生成 JWT token
    const payload: JwtPayload = {
      sub: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
    };

    const token = this.jwtService.sign(payload);

    return new LoginResponseDto(token, {
      id: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
      status: admin.status,
    });
  }

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    // 查找用户
    const admin = await this.adminRepository.findOne({
      where: { id: userId, status: 1 },
    });

    if (!admin) {
      throw new BusinessException(
        RESPONSE_CODE.AUTH_FAILED,
        '用户不存在',
      );
    }

    // 查找用户组
    let adminGroup: AdminGroup | null = null;
    if (admin.group_id) {
      adminGroup = await this.adminGroupRepository.findOne({
        where: { id: admin.group_id, status: 1 },
      });
    }

    return new ProfileResponseDto({
      id: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
      status: admin.status,
    }, adminGroup);
  }

  async validateUserById(userId: number): Promise<any | null> {
    const admin = await this.adminRepository.findOne({
      where: { id: userId, status: 1 },
    });

    if (!admin) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
      status: admin.status,
    };
  }

  private async validatePassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
    // 优先使用 bcrypt 验证（新密码）
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      // bcrypt 无法解析时，回退兼容旧系统的 MD5 加密方式
    }

    // 兼容旧系统：MD5(password + salt) 或 MD5(salt + password)
    const md5Hash1 = crypto.createHash('md5').update(password + salt).digest('hex');
    const md5Hash2 = crypto.createHash('md5').update(salt + password).digest('hex');

    return hashedPassword === md5Hash1 || hashedPassword === md5Hash2;
  }

  private validateCaptcha(captchaId: string, captchaCode: string): void {
    this.cleanupExpiredCaptchas();

    const record = this.captchaStore.get(captchaId);
    if (!record) {
      throw new BusinessException(RESPONSE_CODE.AUTH_FAILED, '算式已失效，请刷新后重试');
    }

    this.captchaStore.delete(captchaId);

    if (record.code !== captchaCode.trim().toUpperCase()) {
      throw new BusinessException(RESPONSE_CODE.AUTH_FAILED, '算式结果错误');
    }
  }

  private cleanupExpiredCaptchas(): void {
    const now = Date.now();
    for (const [key, record] of this.captchaStore.entries()) {
      if (record.expiresAt <= now) {
        this.captchaStore.delete(key);
      }
    }
  }
}
