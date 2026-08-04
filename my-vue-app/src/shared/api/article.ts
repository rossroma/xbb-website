import request from './request'

export interface Article {
  id: number
  title: string
  content?: string
  summary?: string
  descs: string // 后端返回的是 descs 字段作为摘要
  simg: string // 缩略图
  category_id?: number
  bid: number // 后端返回的是 bid 字段作为分类ID
  status: number
  is_top?: number
  view_count?: number
  hit: number // 后端返回的是 hit 字段作为浏览量
  created_at?: string
  addtime: number // 后端返回的是 addtime 时间戳
  updated_at?: string
  updatetime: number // 后端返回的是 updatetime 时间戳
}

export interface ArticleListResponse {
  items: Article[]
  total: number
  page: number
  limit: number
}

// 管理端文章接口
export const getAdminArticles = (
  params?: Record<string, unknown>,
): Promise<ArticleListResponse> => {
  return request.get('/v1/admin/articles', { params })
}

export const getAdminArticle = (id: number): Promise<Article> => {
  return request.get(`/v1/admin/articles/${id}`)
}

/** 获取各分类文章数量统计 */
export const getArticleCounts = (): Promise<Record<number, number>> => {
  return request.get('/v1/admin/articles/counts')
}

// ==================== 客户端文章接口 ====================

/** 客户端文章查询参数 */
export interface ClientArticleQuery {
  /** 页码（从 1 开始） */
  page?: number
  /** 每页数量 */
  limit?: number
  /** 栏目 ID（分类过滤） */
  bid?: number
  /** 推荐筛选：1=仅推荐，0=非推荐 */
  isRecommended?: number
  /** 排序方式：addtime_desc（默认）| addtime_asc | hit_desc | hit_asc | ord_asc | ord_desc */
  sortBy?: string
}

/** 客户端文章列表响应 */
export interface ClientArticleListResponse {
  items: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** 获取客户端文章列表 */
export const getClientArticles = (
  params?: ClientArticleQuery,
): Promise<ClientArticleListResponse> => {
  return request.get('/v1/client/articles', {
    params: params as unknown as Record<string, unknown>,
  })
}

// ==================== 客户端文章详情接口 ====================

/** 上一篇/下一篇导航信息 */
export interface ArticleNavInfo {
  id: number
  title: string
}

/** 文章详情数据（含完整字段） */
export interface ArticleDetail {
  id: number
  title: string
  title_en?: string
  subtitle?: string
  bid?: number
  flag?: string
  simg: string
  author: string
  source: string
  descs: string
  content?: string
  seoTitle: string
  seoKeyword: string
  setDescription: string
  status: number
  ord: number
  hit?: number
  addtime?: number
  updatetime?: number
}

/** 客户端文章详情响应（含上下篇导航） */
export interface ArticleDetailResponse {
  article: ArticleDetail
  prev: ArticleNavInfo | null
  next: ArticleNavInfo | null
}

/** 获取客户端文章详情（含上一篇/下一篇导航） */
export const getClientArticleDetail = (id: number): Promise<ArticleDetailResponse> => {
  return request.get(`/v1/client/articles/${id}/detail`)
}

// ==================== 回收站接口 ====================

/** 从回收站恢复文章 */
export const restoreArticle = (id: number): Promise<void> => {
  return request.patch(`/v1/admin/articles/${id}/restore`)
}

/** 彻底删除文章（物理删除） */
export const permanentDeleteArticle = (id: number): Promise<void> => {
  return request.delete(`/v1/admin/articles/${id}/permanent`)
}

/** 批量恢复文章 */
export const batchRestoreArticles = (ids: number[]): Promise<number> => {
  return request.patch('/v1/admin/articles/batch/restore', { ids })
}

/** 批量彻底删除文章 */
export const batchPermanentDeleteArticles = (ids: number[]): Promise<number> => {
  return request.delete('/v1/admin/articles/batch/permanent', { data: { ids } })
}
