import request from './request'

// ==================== 类型定义 ====================

/** 合作伙伴查询入参 */
export interface PartnerQueryParams {
  /** 企业名称或合作伙伴编号 */
  keyword: string
}

/** 合作伙伴信息 */
export interface PartnerInfo {
  /** 伙伴名称 */
  name: string
  /** 合作开始日期（YYYY-MM-DD） */
  startDate: string
  /** 合作结束日期（YYYY-MM-DD） */
  endDate: string
  /** 状态文本（如：有效、无效） */
  status: string
}

/** 合作伙伴查询响应 */
export interface PartnerQueryResponse {
  /** 合作伙伴列表 */
  list: PartnerInfo[]
  /** 总数量 */
  total: number
}

// ==================== API 函数 ====================

/**
 * 查询合作伙伴信息
 *
 * 通过 NestJS BFF 代理调用三方钉钉云 API，支持按企业名称或编号查询
 */
export const queryPartner = (params: PartnerQueryParams): Promise<PartnerQueryResponse> => {
  return request.post('/v1/client/partner/query', params)
}
