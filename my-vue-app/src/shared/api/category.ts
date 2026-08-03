import request from './request'

export interface Category {
  id: number
  title: string // 后端返回的是 title 字段
  name?: string
  name_en?: string
  english: string // 后端返回的是 english 字段
  description?: string
  descs: string // 后端返回的是 descs 字段作为描述
  sort_order?: number
  ord: number // 后端返回的是 ord 字段作为排序
  /** 父级栏目 ID */
  pid: number
  status: number
  is_nav: number
  created_at?: string
  addtime: number // 后端返回的是 addtime 时间戳
  updated_at?: string
  updatetime: number // 后端返回的是 updatetime 时间戳
}

export interface CategoryListResponse {
  items: Category[]
  total: number
}

// 管理端栏目接口
export const getAdminCategories = (
  params?: Record<string, unknown>,
): Promise<CategoryListResponse> => {
  return request.get('/v1/admin/categories', { params })
}

// ==================== 客户端栏目接口 ====================

/** 客户端栏目列表响应 */
export interface ClientCategoryListResponse {
  items: Category[]
  total: number
}

/** 获取客户端栏目列表（含全部子栏目） */
export const getClientCategories = (includeAll = false): Promise<ClientCategoryListResponse> => {
  return request.get('/v1/client/categories', { params: { all: includeAll ? 'true' : 'false' } })
}
