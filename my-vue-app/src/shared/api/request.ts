import axios, { type AxiosResponse } from 'axios'
import { removeToken, createAuthInterceptor } from '@/shared/utils/token'

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 — 使用共享的 token 注入
instance.interceptors.request.use(createAuthInterceptor())

// 响应拦截器 — 解包 { code, data, message } 通用格式
// 注意：拦截器返回 data.data（解包后的数据），而非 AxiosResponse，
// 与 Axios 期望的类型不兼容，此处通过类型断言告知 TS 实际语义
instance.interceptors.response.use(
  ((response: AxiosResponse<{ code: number; data: unknown; message?: string }>) => {
    const { data } = response
    if (data.code === 200) {
      return data.data
    }
    throw new Error(data.message || '请求失败')
  }) as (response: AxiosResponse<{ code: number; data: unknown; message?: string }>) => never,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data?.message || error.message)
  },
)

// 由于响应拦截器解包了 data.data，实际返回类型是 T 而非 AxiosResponse<T>
// 通过类型断言修正 axios 实例的类型签名，让调用方直接拿到 T
interface RequestInstance {
  get<T = unknown>(url: string, config?: { params?: Record<string, unknown> }): Promise<T>
  post<T = unknown>(url: string, data?: unknown): Promise<T>
  put<T = unknown>(url: string, data?: unknown): Promise<T>
  patch<T = unknown>(url: string, data?: unknown): Promise<T>
  delete<T = unknown>(url: string, config?: { params?: Record<string, unknown>; data?: unknown }): Promise<T>
}

const request = instance as unknown as RequestInstance

export default request
