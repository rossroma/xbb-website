import request from './request'
import type { PaginatedResult } from './types'

// ==================== 管理端接口 ====================

/** 获取模板列表 */
export const getTemplates = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/templates', { params })
}

/** 获取模板详情 */
export const getTemplate = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/templates/${id}`)
}

/** 创建模板 */
export const createTemplate = async (
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/templates', data)
}

/** 更新模板 */
export const updateTemplate = async (
  id: number,
  data: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.put(`/v1/admin/templates/${id}`, data)
}

/** 删除模板 */
export const deleteTemplate = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/templates/${id}`)
}

/** 获取模板内容 */
export const getTemplateContent = async (id: number): Promise<{ content: string }> => {
  return request.get(`/v1/admin/templates/${id}/content`)
}

/** 获取模板示例数据 */
export const getTemplateSampleData = async (
  id: number,
  params?: {
    mode?: 'global' | 'list' | 'detail' | 'page'
    categoryEnglish?: string
    categoryId?: number
    articleId?: number
  },
): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/templates/${id}/sample-data`, { params })
}

/** 保存模板内容 */
export const saveTemplateContent = async (
  id: number,
  content: string,
): Promise<Record<string, unknown>> => {
  return request.put(`/v1/admin/templates/${id}/content`, { content })
}

/** 预览模板 */
export const previewTemplate = async (
  id: number,
  data?: { content?: string; data?: Record<string, unknown> },
): Promise<{ html: string; variables?: Record<string, unknown>[] }> => {
  return request.post(`/v1/admin/templates/${id}/preview`, data || {})
}

/** 应用模板 */
export const applyTemplate = async (id: number): Promise<Record<string, unknown>> => {
  return request.post(`/v1/admin/templates/${id}/apply`)
}

/** 发布模板 */
export const publishTemplate = async (id: number): Promise<Record<string, unknown>> => {
  return request.post(`/v1/admin/templates/${id}/publish`)
}

// ==================== 客户端接口 ====================

/** 获取当前激活的模板 */
export const getCurrentTemplate = async (): Promise<Record<string, unknown>> => {
  return request.get('/v1/client/templates/current')
}

/** 获取客户端模板 */
export const getClientTemplate = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/client/templates/${id}`)
}

export default {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateContent,
  getTemplateSampleData,
  saveTemplateContent,
  previewTemplate,
  applyTemplate,
  publishTemplate,
  getCurrentTemplate,
  getClientTemplate,
}
