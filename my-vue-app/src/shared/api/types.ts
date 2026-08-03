/**
 * 共享 API 类型定义
 * 集中管理所有 API 模块的通用类型和实体接口
 */

// ==================== 通用类型 ====================

/** 通用分页结果 */
export interface PaginatedResult<T> {
  items: T[]
  total: number
}

/** 通用分页查询参数 */
export interface PaginationQuery {
  page?: number
  limit?: number
  keyword?: string
  sortBy?: string
}

// ==================== 实体类型 ====================

/** 图片集实体 */
export interface GalleryEntity {
  id: number
  title: string
  subtitle?: string
  bid: number
  simg?: string
  simg2?: string
  descs?: string
  url?: string
  ord: number
  content?: string
  addtime?: number
  formatted_addtime?: string
}

/** 日志条目 */
export interface LogEntry {
  id: number
  username: string
  detail?: string
  ip?: string
  userAgent?: string
  createdAt: string
  /** 登录日志专属：登录状态 */
  status?: string
  /** 操作日志专属：操作类型 */
  action?: string
  /** 操作日志专属：操作对象 */
  target?: string
}

/** 留言实体 */
export interface MessageEntity {
  id: number
  bid: number
  title?: string
  mname: string
  tel: string
  email?: string
  address?: string
  content: string
  read_status: number
  check_status: number
  source?: string
  article_id?: number
  article_score?: number
  scale?: string
  industry?: string
  reply_content?: string
  formatted_addtime?: string
  formatted_reply_time?: string
  reply_admin_name?: string
  read_status_text?: string
  check_status_text?: string
}

/** 站点设置实体 */
export interface SiteSettingEntity {
  base?: {
    company?: string
    title?: string
    keyword?: string
    descs?: string
    logo?: string
    wap_logo?: string
    ico_logo?: string
    address?: string
    tel?: string
    phone?: string
    email?: string
    fax?: string
    postcode?: string
    content2?: string
    toolscode_top?: string
    toolscode_bottom?: string
  }
  setting?: Record<string, unknown>
}

/** 管理员实体 */
export interface AdminEntity {
  id: number
  username: string
  type: number
  group_id: number
  status: number
  created_at?: string
  updated_at?: string
}

/** 用户组实体 */
export interface AdminGroupEntity {
  id: number
  title: string
  rules?: string
  rules_category?: string
  created_at?: string
  updated_at?: string
}
