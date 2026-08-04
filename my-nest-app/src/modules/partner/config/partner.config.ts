/**
 * 合作伙伴查询 — 三方 API 配置
 *
 * 钉钉云外部链接 API 配置，所有敏感信息集中管理，不散落在业务代码中。
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`缺少必需的环境变量: ${key}。请在 .env 文件中配置。`);
  }
  return value;
}

export const partnerApiConfig = {
  /** 三方 API 地址 */
  apiUrl: 'https://app1013.eapps.dingtalkcloud.com/pro/v1/outerLink/list',

  /** 请求超时时间（毫秒） */
  timeout: 10000,

  /** 企业 ID（三方平台固定值） */
  corpid: '1',

  /** 用户 ID（三方平台固定值） */
  userId: '-3',

  /** 请求平台标识 */
  platform: 'web',

  /** API 认证 Token（必须通过环境变量 PARTNER_API_TOKEN 配置） */
  token: requireEnv('PARTNER_API_TOKEN'),

  /** 查询匹配字段名（三方表单字段标识） */
  searchField: 'text_1',

  /** 匹配方式 */
  matchSymbol: 'equal',

  /** 字段类型（1 = 文本） */
  fieldType: 1,
} as const;