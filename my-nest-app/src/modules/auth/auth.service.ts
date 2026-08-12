import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { RESPONSE_CODE } from '../../common/constants/response-code';
import { JwtPayload } from './strategies/jwt.strategy';
import { Admin } from './entities/admin.entity';
import { AdminGroup } from './entities/admin-group.entity';
import { LogsService } from '../logs/logs.service';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminGroup)
    private adminGroupRepository: Repository<AdminGroup>,
    private logsService: LogsService,
  ) { }

  /**
   * 生成算式验证码（JWT 无状态方案）
   * 算式结果编码为 JWT Token，5 分钟有效，不依赖内存/Redis/数据库
   */
  generateCaptcha(): { captchaId: string; image: string; expiresIn: number } {
    try {
      const captcha = svgCaptcha.createMathExpr({
        noise: 2,
        color: true,
        background: '#f8f9fa',
        width: 100,
        height: 40,
        fontSize: 34,
        mathMin: 1,
        mathMax: 9,
        mathOperator: '+',
      });

      const expiresIn = 5 * 60; // 秒
      const captchaId = this.jwtService.sign(
        { code: captcha.text.toUpperCase() },
        { expiresIn },
      );

      return {
        captchaId,
        image: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
        expiresIn: expiresIn * 1000,
      };
    } catch (error: any) {
      this.logger.error(
        `生成验证码失败: ${error?.message || '未知错误'}`,
        error?.stack,
      );
      throw new BusinessException(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        '验证码生成失败，请稍后重试',
      );
    }
  }

  async login(loginDto: LoginDto, ip: string = '127.0.0.1', userAgent?: string): Promise<LoginResponseDto> {
    const { username, password, captchaId, captchaCode } = loginDto;

    this.validateCaptcha(captchaId, captchaCode);

    // 查找用户（含用户组权限信息，用于嵌入 JWT）
    const admin = await this.adminRepository.findOne({
      where: { username, status: 1 },
      relations: ['adminGroup'],
    });

    if (!admin) {
      // 记录登录失败日志
      await this.logsService.recordLogin(username, ip, 0, userAgent).catch(() => {});
      throw new BusinessException(
        RESPONSE_CODE.AUTH_FAILED,
        '用户名或密码错误',
      );
    }

    // 验证密码
    const isPasswordValid = await this.validatePassword(password, admin.userpwd, admin.salt);

    if (!isPasswordValid) {
      // 记录登录失败日志
      await this.logsService.recordLogin(username, ip, 0, userAgent).catch(() => {});
      throw new BusinessException(
        RESPONSE_CODE.AUTH_FAILED,
        '用户名或密码错误',
      );
    }

    // 记录登录成功日志
    await this.logsService.recordLogin(username, ip, 1, userAgent).catch(() => {});

    // 生成 JWT token（嵌入 group_rules，避免每次请求查库）
    const payload: JwtPayload = {
      sub: admin.id,
      username: admin.username,
      type: admin.type,
      group_id: admin.group_id,
      group_rules: admin.adminGroup?.rules || '',
      group_rules_category: admin.adminGroup?.rules_category || '',
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

  private async validatePassword(password: string, hashedPassword: string, _salt: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private validateCaptcha(captchaId: string, captchaCode: string): void {
    try {
      const payload = this.jwtService.verify<{ code: string }>(captchaId);
      if (payload.code !== captchaCode.trim().toUpperCase()) {
        throw new BusinessException(RESPONSE_CODE.AUTH_FAILED, '算式结果错误');
      }
    } catch (error: any) {
      if (error instanceof BusinessException) throw error;
      if (error?.name === 'TokenExpiredError') {
        throw new BusinessException(RESPONSE_CODE.AUTH_FAILED, '算式已失效，请刷新后重试');
      }
      throw new BusinessException(RESPONSE_CODE.AUTH_FAILED, '算式已失效，请刷新后重试');
    }
  }
}
