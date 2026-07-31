import request from './request'
import type { PaginatedResult } from './types'

/** 图片集创建/更新载荷 */
type GalleryPayload = Record<string, unknown>
/** 图片集查询参数 */
type GalleryQuery = Record<string, unknown>

// ==================== 图片集管理（images） ====================

export const getGalleries = async (
  params?: GalleryQuery,
): Promise<PaginatedResult<Record<string, unknown>>> =>
  request.get('/v1/admin/gallery/images', { params })

export const getGallery = async (id: number): Promise<Record<string, unknown>> =>
  request.get(`/v1/admin/gallery/images/${id}`)

export const createGallery = async (data: GalleryPayload): Promise<Record<string, unknown>> =>
  request.post('/v1/admin/gallery/images', data)

export const updateGallery = async (
  id: number,
  data: GalleryPayload,
): Promise<Record<string, unknown>> => request.patch(`/v1/admin/gallery/images/${id}`, data)

export const deleteGallery = async (id: number): Promise<void> =>
  request.delete(`/v1/admin/gallery/images/${id}`)

// ==================== 图片组2管理（images2） ====================

export const getGallery2List = async (
  params?: GalleryQuery,
): Promise<PaginatedResult<Record<string, unknown>>> =>
  request.get('/v1/admin/gallery/images2', { params })

export const getGallery2 = async (id: number): Promise<Record<string, unknown>> =>
  request.get(`/v1/admin/gallery/images2/${id}`)

export const createGallery2 = async (data: GalleryPayload): Promise<Record<string, unknown>> =>
  request.post('/v1/admin/gallery/images2', data)

export const updateGallery2 = async (
  id: number,
  data: GalleryPayload,
): Promise<Record<string, unknown>> => request.patch(`/v1/admin/gallery/images2/${id}`, data)

export const deleteGallery2 = async (id: number): Promise<void> =>
  request.delete(`/v1/admin/gallery/images2/${id}`)

// ==================== 图片组3管理（images3） ====================

export const getGallery3List = async (
  params?: GalleryQuery,
): Promise<PaginatedResult<Record<string, unknown>>> =>
  request.get('/v1/admin/gallery/images3', { params })

export const getGallery3 = async (id: number): Promise<Record<string, unknown>> =>
  request.get(`/v1/admin/gallery/images3/${id}`)

export const createGallery3 = async (data: GalleryPayload): Promise<Record<string, unknown>> =>
  request.post('/v1/admin/gallery/images3', data)

export const updateGallery3 = async (
  id: number,
  data: GalleryPayload,
): Promise<Record<string, unknown>> => request.patch(`/v1/admin/gallery/images3/${id}`, data)

export const deleteGallery3 = async (id: number): Promise<void> =>
  request.delete(`/v1/admin/gallery/images3/${id}`)

// ==================== 展示信息管理 ====================

export const getShowInfos = async (
  params?: GalleryQuery,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/gallery/show-info', { params })
}

export const getShowInfo = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/gallery/show-info/${id}`)
}

export const createShowInfo = async (data: GalleryPayload): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/gallery/show-info', data)
}

export const updateShowInfo = async (
  id: number,
  data: GalleryPayload,
): Promise<Record<string, unknown>> => {
  return request.patch(`/v1/admin/gallery/show-info/${id}`, data)
}

export const deleteShowInfo = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/gallery/show-info/${id}`)
}

export default {
  getGalleries,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  getShowInfos,
  getShowInfo,
  createShowInfo,
  updateShowInfo,
  deleteShowInfo,
}
