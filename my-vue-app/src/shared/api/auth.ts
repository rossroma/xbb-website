import request from './request'

export interface LoginDto {
  username: string
  password: string
  captchaId: string
  captchaCode: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: number
    username: string
    type: number
    group_id: number
    status: number
  }
}

export interface ProfileResponse {
  id: number
  username: string
  type: number
  group_id: number
  status: number
  group_info?: {
    id: number
    title: string
    rules: string
    rules_category: string
  }
}

// 管理员登录
export const adminLogin = (data: LoginDto): Promise<LoginResponse> => {
  return request.post('/v1/admin/auth/login', data)
}

export const getAdminCaptcha = (): Promise<{ captchaId: string; image: string; expiresIn: number }> => {
  return request.get('/v1/admin/auth/captcha')
}

// 获取管理员信息
export const getAdminProfile = (): Promise<ProfileResponse> => {
  return request.get('/v1/admin/auth/profile')
}
