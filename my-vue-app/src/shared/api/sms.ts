import request from './request'

// ==================== 客户端 SMS 接口 ====================

/** 算式验证码响应 */
export interface CaptchaResponse {
  token: string
  svg: string
}

/** 短信发送响应 */
export interface SmsSendResponse {
  expireSeconds: number
}

/** 短信验证响应 */
export interface SmsVerifyResponse {
  verified: boolean
}

/** 获取算式验证码 */
export const getCaptcha = async (): Promise<CaptchaResponse> => {
  return request.get('/v1/client/sms/captcha')
}

/** 发送短信验证码 */
export const sendSms = async (data: {
  tel: string
  captcha: string
  token: string
}): Promise<SmsSendResponse> => {
  return request.post('/v1/client/sms/send', data)
}

/** 校验短信验证码 */
export const verifySms = async (data: {
  tel: string
  code: string
}): Promise<SmsVerifyResponse> => {
  return request.post('/v1/client/sms/verify', data)
}

// ==================== 管理端 SMS 接口 ====================

/** 短信日志查询参数 */
export interface SmsLogQueryParams {
  page?: number
  limit?: number
  phone?: string
  status?: string
  start_date?: string
  end_date?: string
  sortBy?: string
}

/** 短信日志列表响应 */
export interface SmsLogListResponse {
  list: SmsLogItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** 短信日志条目 */
export interface SmsLogItem {
  id: number
  phone: string
  ip: string
  status: string
  code: string
  errorMsg: string
  userAgent: string
  created_at: string
}

/** 获取短信发送日志（管理端） */
export const getSmsLogs = async (params: SmsLogQueryParams): Promise<SmsLogListResponse> => {
  return request.get('/v1/admin/sms/logs', { params })
}

export default {
  getCaptcha,
  sendSms,
  verifySms,
  getSmsLogs,
}
