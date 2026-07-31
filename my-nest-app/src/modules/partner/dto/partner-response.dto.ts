/**
 * 合作伙伴信息（前端展示用，已清洗三方 API 原始字段）
 */
export interface PartnerInfo {
  /** 伙伴名称 */
  name: string;
  /** 合作开始日期（YYYY-MM-DD） */
  startDate: string;
  /** 合作结束日期（YYYY-MM-DD） */
  endDate: string;
  /** 状态文本（如：有效、无效） */
  status: string;
}

/**
 * 合作伙伴查询响应
 */
export interface PartnerQueryResponse {
  /** 合作伙伴列表 */
  list: PartnerInfo[];
  /** 总数量 */
  total: number;
}