import type { MenuPermissionMeta } from '@/admin/utils/admin-permissions'

/**
 * 管理后台菜单权限令牌 — 单一数据源
 * router.ts 和 Sidebar/index.vue 共享此配置，避免权限令牌重复定义
 *
 * 权限体系：模块 → CRUD 操作（查看/新建/编辑/删除）
 * 菜单可见性使用 OR 逻辑：拥有任一 CRUD 权限即可看到菜单
 */
export const PERMISSION_TOKENS = {
  /** 内容管理 */
  content: { ruleTokens: ['content_manage.view', 'content_manage.create', 'content_manage.edit', 'content_manage.delete'] },
  /** 栏目管理 */
  category: { ruleTokens: ['category_manage.view', 'category_manage.create', 'category_manage.edit', 'category_manage.delete'] },
  /** 广告管理 */
  ads: { ruleTokens: ['ads_manage.view', 'ads_manage.create', 'ads_manage.edit', 'ads_manage.delete'] },
  /** 系统设置 */
  settings: { ruleTokens: ['settings_manage.view', 'settings_manage.edit'] },
  /** 管理员管理 */
  adminManagement: { ruleTokens: ['admin_manage.view', 'admin_manage.create', 'admin_manage.edit', 'admin_manage.delete'] },
  /** 用户组管理 */
  groupManagement: { ruleTokens: ['group_manage.view', 'group_manage.create', 'group_manage.edit', 'group_manage.delete'] },
  /** 操作日志 */
  operationLogs: { ruleTokens: ['operation_logs.view'] },
  /** 登录日志 */
  loginLogs: { ruleTokens: ['login_logs.view'] },
  /** 留言管理 */
  message: {
    1: { ruleTokens: ['message_manage.view', 'message_manage.edit', 'message_manage.delete'] },
    2: { ruleTokens: ['message_manage.view', 'message_manage.edit', 'message_manage.delete'] },
    3: { ruleTokens: ['message_manage.view', 'message_manage.edit', 'message_manage.delete'] },
    4: { ruleTokens: ['message_manage.view', 'message_manage.edit', 'message_manage.delete'] },
  },
  } as const satisfies Record<string, MenuPermissionMeta | Record<number, MenuPermissionMeta>>
