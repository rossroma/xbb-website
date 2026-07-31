/**
 * 合作伙伴查询 — 三方 API 配置
 *
 * 钉钉云外部链接 API 配置，所有敏感信息集中管理，不散落在业务代码中。
 * 后续可迁移至环境变量（如 PARTNER_API_TOKEN）以支持多环境部署。
 */
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

  /** API 认证 Token */
  token: '4157f047f99201ce9471bee5972857046',

  /** 查询匹配字段名（三方表单字段标识） */
  searchField: 'text_1',

  /** 匹配方式 */
  matchSymbol: 'equal',

  /** 字段类型（1 = 文本） */
  fieldType: 1,
} as const;