import request from './request'

// ==================== 管理端接口 ====================

/** 获取所有配置 */
export function getAllSettings(): Promise<Record<string, unknown>> {
  return request.get('/v1/admin/settings')
}

/** 批量更新配置 */
export function updateAllSettings(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request.put('/v1/admin/settings', data)
}

/** 获取基础信息 */
export function getBase(): Promise<Record<string, unknown>> {
  return request.get('/v1/admin/settings/base')
}

/** 更新基础信息 */
export function updateBase(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request.put('/v1/admin/settings/base', data)
}

/** 获取系统设置 */
export function getSetting(): Promise<Record<string, unknown>> {
  return request.get('/v1/admin/settings/setting')
}

/** 更新系统设置 */
export function updateSetting(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request.put('/v1/admin/settings/setting', data)
}

// ==================== 客户端接口 ====================

/** 客户端获取网站信息 */
export function getSiteInfo(): Promise<{
  readonly data: {
    readonly title?: string
    readonly keyword?: string
    readonly descs?: string
    readonly company?: string
    readonly address?: string
    readonly tel?: string
    readonly phone?: string
    readonly email?: string
    readonly content2?: string
  }
}> {
  return request.get('/v1/client/site-info')
}
