import request from './request'
import type { PaginatedResult } from './types'

// 获取操作日志列表
export const getOperationLogs = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/logs/operations', { params })
}

// 获取登录日志列表
export const getLoginLogs = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/logs/logins', { params })
}

export default {
  getOperationLogs,
  getLoginLogs,
}
