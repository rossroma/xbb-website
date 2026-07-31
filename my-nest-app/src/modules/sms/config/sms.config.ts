/**
 * 短信服务配置 — 助通科技 SMS 平台
 *
 * 生产环境敏感信息应从环境变量读取，避免硬编码。
 * 当前配置继承自旧版 CodeIgniter 项目 app/config/sms_config.php
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`缺少必需的环境变量: ${key}。请在 .env 文件中配置。`);
  }
  return value;
}

export const smsConfig = {
  /** 助通科技 API 地址 */
  apiUrl: process.env.SMS_API_URL || 'https://api.mix2.zthysms.com/v2/sendSmsTp',
  /** API 用户名（必须通过环境变量 SMS_USERNAME 配置） */
  username: requireEnv('SMS_USERNAME'),
  /** API 密码（必须通过环境变量 SMS_PASSWORD 配置） */
  password: requireEnv('SMS_PASSWORD'),
  /** 短信模板 ID */
  templateId: process.env.SMS_TEMPLATE_ID || '44556',
  /** 短信签名 */
  signature: process.env.SMS_SIGNATURE || '【销帮帮】',

  /** 验证码长度 */
  codeLength: 6,
  /** 验证码有效期（秒） */
  codeExpireSeconds: 300,
  /** 同一手机号最小发送间隔（秒） */
  minSendInterval: 60,
  /** 同一手机号每小时最多发送次数 */
  rateLimitPerPhone: 5,
  /** 同一 IP 每小时最多发送次数 */
  rateLimitPerIp: 10,
  /** 频率限制窗口（秒） */
  rateLimitWindow: 3600,

  /** 算式验证码 JWT 签名密钥（必须通过环境变量 CAPTCHA_JWT_SECRET 配置） */
  captchaJwtSecret: requireEnv('CAPTCHA_JWT_SECRET'),
} as const;

/** 数据中心回调配置 */
export const dataCenterConfig = {
  /** 回调地址 */
  url: 'https://datacenterapi.xbongbong.com/digital/v1/adClue/websiteCallback',
  /** 签名 Token（必须通过环境变量 DATACENTER_TOKEN 配置） */
  token: requireEnv('DATACENTER_TOKEN'),
  /** 钉钉 corpid */
  corpid: process.env.DATACENTER_CORPID || 'dinge3fa697f86d461d2',
  /** 钉钉 userId */
  userId: process.env.DATACENTER_USER_ID || '02415643151585',
  /** 钉钉 formId */
  formId: process.env.DATACENTER_FORM_ID || '2795678',
} as const;