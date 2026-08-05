import request from './request'
import type { PaginatedResult } from './types'

// ==================== 管理端接口 ====================

/** 获取留言列表 */
export const getMessages = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/messages', { params })
}

/** 获取留言详情 */
export const getMessage = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/messages/${id}`)
}

/** 更新留言状态 */
export const updateMessage = async (
  id: number,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.patch(`/v1/admin/messages/${id}`, data)
}

/** 删除留言 */
export const deleteMessage = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/messages/${id}`)
}

/** 批量更新留言状态 */
export const batchUpdateMessageStatus = async (data: {
  ids: number[]
  status: Record<string, unknown>
}): Promise<Record<string, unknown>> => {
  return request.patch('/v1/admin/messages/batch/status', data)
}

/** 获取留言统计 */
export const getMessageStats = async (): Promise<Record<string, unknown>> => {
  return request.get('/v1/admin/messages/stats/overview')
}

// ==================== 客户端接口 ====================

/** 提交免费试用（含 SEM 数据 + 数据中心推送） */
export const submitTrial = async (
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/client/trials', data)
}

export default {
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  batchUpdateMessageStatus,
  getMessageStats,
  submitTrial,
}
