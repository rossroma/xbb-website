import request from './request'
import type { PaginatedResult } from './types'

// ==================== 文章管理 ====================

// 获取文章列表
export const getArticles = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/articles', { params })
}

// 获取文章详情
export const getArticle = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/articles/${id}`)
}

// 创建文章
export const createArticle = async (
  articleData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/articles', articleData)
}

// 更新文章
export const updateArticle = async (
  id: number,
  articleData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.patch(`/v1/admin/articles/${id}`, articleData)
}

// 删除文章
export const deleteArticle = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/articles/${id}`)
}

// ==================== 栏目管理 ====================

// 获取栏目列表
export const getCategories = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/categories', { params })
}

// 创建栏目
export const createCategory = async (
  categoryData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/categories', categoryData)
}

// 更新栏目
export const updateCategory = async (
  id: number,
  categoryData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.put(`/v1/admin/categories/${id}`, categoryData)
}

// 删除栏目
export const deleteCategory = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/categories/${id}`)
}

// ==================== 管理员管理 ====================

// 获取管理员列表
export const getAdmins = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/admins', { params })
}

// 获取管理员详情
export const getAdmin = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/admins/${id}`)
}

// 创建管理员
export const createAdmin = async (
  adminData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/admins', adminData)
}

// 更新管理员
export const updateAdmin = async (
  id: number,
  adminData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.patch(`/v1/admin/admins/${id}`, adminData)
}

// 删除管理员
export const deleteAdmin = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/admins/${id}`)
}

// ==================== 用户组管理 ====================

// 获取用户组列表
export const getAdminGroups = async (
  params?: Record<string, unknown>,
): Promise<PaginatedResult<Record<string, unknown>>> => {
  return request.get('/v1/admin/admin-groups', { params })
}

// 获取用户组详情
export const getAdminGroup = async (id: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/admin-groups/${id}`)
}

// 创建用户组
export const createAdminGroup = async (
  groupData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.post('/v1/admin/admin-groups', groupData)
}

// 更新用户组
export const updateAdminGroup = async (
  id: number,
  groupData: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
  return request.patch(`/v1/admin/admin-groups/${id}`, groupData)
}

// 删除用户组
export const deleteAdminGroup = async (id: number): Promise<void> => {
  return request.delete(`/v1/admin/admin-groups/${id}`)
}

// ==================== 权限管理 ====================

// 获取权限列表
export const getAdminActions = async (): Promise<Record<string, unknown>[]> => {
  return request.get('/v1/admin/admin-actions')
}

// 获取管理员权限
export const getAdminPermissions = async (adminId: number): Promise<Record<string, unknown>> => {
  return request.get(`/v1/admin/admin-permissions/${adminId}`)
}
