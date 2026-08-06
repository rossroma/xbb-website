import request from './request'

/** 案例详情 */
export interface CaseDetail {
  id: number
  title: string
  description: string
  image: string
  logo: string
  tags: string[]
  content?: string
  seoTitle: string
  seoKeyword: string
  seoDescription: string
  status: number
  ord: number
  hit?: number
  addtime?: number
  updatetime?: number
}

/** 上一篇/下一篇导航信息 */
export interface CaseNavInfo {
  id: number
  title: string
}

/** 相关案例卡片（用于「更多案例」展示） */
export interface CaseCard {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  addtime?: number
}

/** 案例详情响应（含上下篇导航 + 相关案例） */
export interface CaseDetailResponse {
  case: CaseDetail
  prev: CaseNavInfo | null
  next: CaseNavInfo | null
  relatedCases: CaseCard[]
}

/** 案例列表项 */
export interface CaseListItem {
  id: number
  title: string
  bid?: number
  description: string
  image: string
  tags: string[]
  addtime?: number
}

/** 案例列表响应 */
export interface CaseListResponse {
  items: CaseListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** 获取客户端案例列表 */
export const getClientCases = (params?: {
  page?: number
  limit?: number
  /** 子类目 ID（按行业筛选） */
  bid?: number
  /** 根类目 ID（用于「全部」时确定查询范围，行业案例=18，用户心声=19） */
  rootBid?: number
  tag?: string
  /** 排序方式：'random' 随机排序，不传则按发布时间降序 */
  order?: 'random'
}): Promise<CaseListResponse> => {
  return request.get('/v1/client/cases', { params })
}

/** 获取客户端案例详情（含上一篇/下一篇导航 + 3 个相关案例） */
export const getClientCaseDetail = (id: number): Promise<CaseDetailResponse> => {
  return request.get(`/v1/client/cases/${id}/detail`)
}
