import request from './request'
import type { PaginatedResult } from './types'

export interface Ads {
  id: number
  title: string
  subtitle?: string
  descs?: string
  bid: number
  url?: string
  ord: number
  simg?: string
  simg2?: string
  wap_simg?: string
  width_height?: string
  hit?: number
  download?: string
  content?: string
  target?: string
}

export interface AdsType {
  id: number
  title: string
  width_height?: string
  wap_width_height?: string
  simg2_width_height?: string
  ord: number
  content?: string
  wap_content?: string
  is_img: number
  is_img2: number
  is_img_wap: number
  is_download: number
  is_descs: number
  is_delete: number
  is_url: number
  is_subtitle: number
  is_content: number
  is_show: number
}

export interface AdsListResponse {
  items: Ads[]
  total: number
  page: number
  limit: number
}

// ==================== 管理端接口 ====================

export function getAdminAds(params?: {
  page?: number
  limit?: number
  title?: string
  bid?: number
}): Promise<AdsListResponse> {
  return request.get('/v1/admin/ads', { params })
}

export function getAdminAdsDetail(id: number): Promise<Ads> {
  return request.get(`/v1/admin/ads/${id}`)
}

export function createAdminAds(data: Partial<Ads>): Promise<Ads> {
  return request.post('/v1/admin/ads', data)
}

export function updateAdminAds(id: number, data: Partial<Ads>): Promise<Ads> {
  return request.put(`/v1/admin/ads/${id}`, data)
}

export function deleteAdminAds(id: number): Promise<void> {
  return request.delete(`/v1/admin/ads/${id}`)
}

// 广告位管理
export function getAdminAdsTypes(params?: {
  page?: number
  limit?: number
  sortBy?: string
}): Promise<PaginatedResult<Record<string, unknown>>> {
  return request.get('/v1/admin/ads-types', { params })
}

export function getAdminAdsTypeDetail(id: number): Promise<AdsType> {
  return request.get(`/v1/admin/ads-types/${id}`)
}

export function createAdminAdsType(data: Partial<AdsType>): Promise<AdsType> {
  return request.post('/v1/admin/ads-types', data)
}

export function updateAdminAdsType(id: number, data: Partial<AdsType>): Promise<AdsType> {
  return request.put(`/v1/admin/ads-types/${id}`, data)
}

export function deleteAdminAdsType(id: number): Promise<void> {
  return request.delete(`/v1/admin/ads-types/${id}`)
}

// ==================== 客户端接口 ====================

export function getClientAds(position: number): Promise<Ads[]> {
  return request.get('/v1/client/ads', { params: { position } })
}
