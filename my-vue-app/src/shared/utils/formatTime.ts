/** Unix 时间戳转中文日期时间字符串 */
export const formatTime = (ts: number): string => {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString('zh-CN', { hour12: false })
}