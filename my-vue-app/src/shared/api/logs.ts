import request from './request'
import type { PaginatedResult } from './types'

interface LogsStatistics {
  totalOperations: number
  totalLogins: number
  failedLogins: number
  todayOperations: number
}

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

// 获取日志统计数据
export const getLogsStatistics = async (): Promise<LogsStatistics> => {
  return request.get('/v1/admin/logs/statistics')
}

// 导出操作日志
export const exportOperationLogs = async (params?: Record<string, unknown>) => {
  return request.get('/v1/admin/logs/operations/export', { params })
}

// 导出登录日志
export const exportLoginLogs = async (params?: Record<string, unknown>) => {
  return request.get('/v1/admin/logs/logins/export', { params })
}

export default {
  getOperationLogs,
  getLoginLogs,
  getLogsStatistics,
  exportOperationLogs,
  exportLoginLogs,
}
