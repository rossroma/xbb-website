import type { MenuPermissionMeta } from '@/admin/utils/admin-permissions'

/**
 * 管理后台菜单权限令牌 — 单一数据源
 * router.ts 和 Sidebar/index.vue 共享此配置，避免权限令牌重复定义
 */
export const PERMISSION_TOKENS = {
  /** 栏目管理 */
  category: { ruleTokens: ['types', '35', 'typeList', '50'] },
  /** 广告管理 */
  ads: { ruleTokens: ['adstypes', '37', 'adsType', '51'] },
  /** 系统设置 */
  settings: { ruleTokens: ['setting', '61'] },
  /** 管理员管理 */
  adminManagement: { ruleTokens: ['user', '54'] },
  /** 用户组管理 */
  groupManagement: { ruleTokens: ['admin_groups', '63'] },
  /** 操作日志 */
  operationLogs: { ruleTokens: ['logs', '60'] },
  /** 登录日志 */
  loginLogs: { ruleTokens: ['logins', '59'] },
  /** 图片集管理 */
  gallery: { ruleTokens: ['gallery', 'images'] },
  /** 留言管理 */
  message: {
    1: { ruleTokens: ['message_1', '67'] },
    2: { ruleTokens: ['message_2', '67'] },
    3: { ruleTokens: ['message_3', '67'] },
    4: { ruleTokens: ['message_4', '67'] },
  },
  } as const satisfies Record<string, MenuPermissionMeta | Record<number, MenuPermissionMeta>>
