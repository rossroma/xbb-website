import { ElMessage } from 'element-plus'

/**
 * 统一 API 错误处理 — 用于组件中需要自定义错误处理逻辑的场景。
 *
 * 注意：全局 API 错误已在 request.ts 的 axios 拦截器中统一展示 ElMessage.error()，
 * 此函数适用于需要额外日志、取消守卫或特殊处理逻辑的场景。
 *
 * @param error 捕获的错误对象
 * @param fallbackMsg 后备错误消息
 */
export function handleApiError(error: unknown, fallbackMsg = '请求失败'): void {
  // 取消守卫：ElMessageBox 取消时抛出 'cancel' / 'close' 字符串
  if (error === 'cancel' || error === 'close') return

  const msg = error instanceof Error ? error.message : String(error || fallbackMsg)
  console.error('[API Error]', error)
  ElMessage.error(msg)
}