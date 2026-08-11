import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 统一环境变量配置服务
 *
 * 替代散落在各处的 process.env 直接调用，提供：
 * - 类型安全的 getter
 * - 启动时必填变量校验
 * - 默认值集中管理
 */
@Injectable()
export class EnvConfig implements OnModuleInit {
  private readonly logger = new Logger(EnvConfig.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.validate();
  }

  // ===== 运行环境 =====
  get port(): number {
    return parseInt(this.config.get('PORT', '3000'), 10);
  }

  // ===== 数据库 =====
  get dbHost(): string {
    return this.getRequired('DB_HOST');
  }
  get dbPort(): number {
    return parseInt(this.config.get('DB_PORT', '3306'), 10);
  }
  get dbUsername(): string {
    return this.getRequired('DB_USERNAME');
  }
  get dbPassword(): string {
    return this.getRequired('DB_PASSWORD');
  }
  get dbDatabase(): string {
    return this.getRequired('DB_DATABASE');
  }

  // ===== JWT =====
  get jwtSecret(): string {
    return this.getRequired('JWT_SECRET');
  }
  get jwtExpiresIn(): string {
    return this.config.get('JWT_EXPIRES_IN', '7d') as string;
  }

  // ===== CORS =====
  get corsOrigins(): string[] {
    const origins = this.config.get('CORS_ORIGINS');
    return origins
      ? (origins as string).split(',').map((s) => s.trim())
      : [];
  }

  // ===== 阿里云 OSS（可选，未配置时上传功能不可用但不会阻止启动）=====
  get ossRegion(): string {
    return (this.config.get('OSS_REGION') as string) || '';
  }
  get ossBucket(): string {
    return (this.config.get('OSS_BUCKET') as string) || '';
  }
  get ossAccessKeyId(): string {
    return (this.config.get('OSS_ACCESS_KEY_ID') as string) || '';
  }
  get ossAccessKeySecret(): string {
    return (this.config.get('OSS_ACCESS_KEY_SECRET') as string) || '';
  }
  get ossBaseUrl(): string {
    return (this.config.get('OSS_BASE_URL') as string) || '';
  }
  /** 是否已配置完整的 OSS 凭证 */
  get ossConfigured(): boolean {
    return !!(this.ossRegion && this.ossBucket && this.ossAccessKeyId && this.ossAccessKeySecret);
  }

  // ===== 短信服务 =====
  get smsApiUrl(): string {
    return (this.config.get('SMS_API_URL') as string) || 'https://api.mix2.zthysms.com/v2/sendSmsTp';
  }
  get smsUsername(): string {
    return this.getRequired('SMS_USERNAME');
  }
  get smsPassword(): string {
    return this.getRequired('SMS_PASSWORD');
  }
  get smsTemplateId(): string {
    return (this.config.get('SMS_TEMPLATE_ID') as string) || '44556';
  }
  get smsSignature(): string {
    return (this.config.get('SMS_SIGNATURE') as string) || '【销帮帮】';
  }

  // ===== 验证码 =====
  get captchaJwtSecret(): string {
    return this.getRequired('CAPTCHA_JWT_SECRET');
  }

  // ===== 合作伙伴 API =====
  get partnerApiToken(): string {
    return this.getRequired('PARTNER_API_TOKEN');
  }

  // ===== 数据中心 =====
  get datacenterToken(): string {
    return this.getRequired('DATACENTER_TOKEN');
  }
  get datacenterCorpid(): string {
    return (this.config.get('DATACENTER_CORPID') as string) || 'dinge3fa697f86d461d2';
  }
  get datacenterUserId(): string {
    return (this.config.get('DATACENTER_USER_ID') as string) || '02415643151585';
  }
  get datacenterFormId(): string {
    return (this.config.get('DATACENTER_FORM_ID') as string) || '2795678';
  }

  // ===== 内部方法 =====
  private getRequired(key: string): string {
    const value = this.config.get(key);
    if (!value) {
      throw new Error(`缺少必需的环境变量: ${key}。请在 .env 文件中配置。`);
    }
    return value as string;
  }

  /**
   * 启动时校验所有必填变量，缺失的以 WARN 级别列出
   */
  private validate(): void {
    const required = [
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'JWT_SECRET',
      'OSS_REGION',
      'OSS_BUCKET',
      'OSS_ACCESS_KEY_ID',
      'OSS_ACCESS_KEY_SECRET',
      'SMS_USERNAME',
      'SMS_PASSWORD',
      'CAPTCHA_JWT_SECRET',
      'PARTNER_API_TOKEN',
      'DATACENTER_TOKEN',
    ];

    const missing = required.filter((k) => !this.config.get(k));
    if (missing.length > 0) {
      this.logger.warn(
        `以下环境变量未配置，相关功能可能不可用: ${missing.join(', ')}`,
      );
    }
  }
}