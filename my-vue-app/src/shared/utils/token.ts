import type { InternalAxiosRequestConfig } from 'axios'

const TOKEN_KEY = 'admin_token'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getAuthHeaders = (): { Authorization: string } | Record<string, never> => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * 创建 axios 请求拦截器 — 自动注入 Bearer token
 * 供 request.ts 共享使用，避免 token 注入逻辑重复
 */
export function createAuthInterceptor() {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
}
