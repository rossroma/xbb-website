import request from './request'

// ==================== 管理端接口 ====================

/** 获取基础信息 */
export function getBase(): Promise<Record<string, unknown>> {
  return request.get('/v1/admin/settings/base')
}

/** 更新基础信息 */
export function updateBase(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request.put('/v1/admin/settings/base', data)
}

// ==================== 客户端接口 ====================

/** 客户端获取网站信息 */
export function getSiteInfo(): Promise<{
  readonly title?: string
  readonly keyword?: string
  readonly descs?: string
  readonly company?: string
  readonly logo?: string
  readonly wap_logo?: string
  readonly ico_logo?: string
  readonly tel?: string
  readonly phone?: string
  readonly email?: string
  readonly address?: string
  readonly fax?: string
  readonly postcode?: string
  readonly content2?: string
  readonly toolscode_top?: string
  readonly toolscode_bottom?: string
}> {
  return request.get('/v1/client/site-info')
}
