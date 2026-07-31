import { ElMessage } from 'element-plus'

/**
 * 统一错误处理 composable
 * 封装取消守卫、日志记录和用户提示，消除 4 种不一致的错误处理模式
 */
export function useErrorHandler() {
  /**
   * 处理通用错误 — 显示用户提示并（可选）记录日志
   * @param error 捕获的错误对象
   * @param message 自定义错误消息
   * @param options 配置项
   */
  const handleError = (
    error: unknown,
    message: string,
    options?: { silent?: boolean; logToConsole?: boolean },
  ): void => {
    // 取消守卫：ElMessageBox 取消时抛出 'cancel' 字符串
    if (error === 'cancel' || error === 'close') return

    if (options?.logToConsole !== false) {
      console.error(`${message}:`, error)
    }

    if (!options?.silent) {
      ElMessage.error(message)
    }
  }

  /**
   * 包装异步操作，自动处理错误
   * @param fn 异步函数
   * @param message 错误消息
   * @param options 配置项
   * @returns 成功时返回结果，失败时返回 undefined
   */
  const wrap = async <T>(
    fn: () => Promise<T>,
    message: string,
    options?: { silent?: boolean; logToConsole?: boolean },
  ): Promise<T | undefined> => {
    try {
      return await fn()
    } catch (error: unknown) {
      handleError(error, message, options)
      return undefined
    }
  }

  return { handleError, wrap }
}
