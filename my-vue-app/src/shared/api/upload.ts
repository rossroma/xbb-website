import axios from 'axios'
import { createAuthInterceptor } from '@/shared/utils/token'

// 上传专用 axios 实例（使用 multipart/form-data，不预设 Content-Type）
const uploadInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
})

uploadInstance.interceptors.request.use(createAuthInterceptor())

export interface UploadResult {
  url: string
  filename: string
  size: number
  thumb_url?: string
}

export interface UploadOptions {
  /** 是否生成缩略图 */
  thumb?: boolean
  /** 最大宽度（默认 1920） */
  maxWidth?: number
  /** 最大高度（默认 1920） */
  maxHeight?: number
}

/**
 * 上传图片文件到后端
 * POST /v1/admin/upload
 */
export async function uploadFile(file: File, options?: UploadOptions): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const params: Record<string, string> = {}
  if (options?.thumb) {
    params.thumb = '1'
  }
  if (options?.maxWidth) {
    params.maxWidth = String(options.maxWidth)
  }
  if (options?.maxHeight) {
    params.maxHeight = String(options.maxHeight)
  }

  const response = await uploadInstance.post<{
    code: number
    data: UploadResult
    message?: string
  }>('/v1/admin/upload', formData, { params })

  if (response.data.code === 200) {
    return response.data.data
  }
  throw new Error(response.data.message || '上传失败')
}

export default { uploadFile }
