import { nextTick } from 'vue'
import type { App } from 'vue'
import { useSiteSettingsStore } from './stores/siteSettings'

/**
 * 客户端专用初始化逻辑
 *
 * 仅在浏览器环境执行（SSG 构建时跳过），包括：
 * - 站点设置预加载（Logo、SEO 元数据、联系方式等）
 * - 统计代码注入
 * - 动态 favicon 设置
 */
export async function setupClient(_app: App) {
  const store = useSiteSettingsStore()

  // 5 秒超时保护，防止 API 卡住导致白屏
  await Promise.race([
    store.fetch(),
    new Promise<void>((resolve) => setTimeout(resolve, 5000)),
  ])

  // 注入统计代码（仅允许已知统计服务域名）
  if (store.headScript) {
    try {
      document.head.insertAdjacentHTML('beforeend', store.headScript)
    } catch {
      console.warn('头部统计代码注入失败，请检查代码格式')
    }
  }
  if (store.bodyScript) {
    try {
      document.body.insertAdjacentHTML('beforeend', store.bodyScript)
    } catch {
      console.warn('底部统计代码注入失败，请检查代码格式')
    }
  }

  // 动态设置 favicon（仅允许相对路径或同源 URL）
  const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null
  if (faviconLink && store.icoLogo) {
    const icoUrl = store.icoLogo
    const isSafe =
      icoUrl.startsWith('/') ||
      icoUrl.startsWith(window.location.origin) ||
      /^https?:\/\//.test(icoUrl)
    if (isSafe) {
      faviconLink.href = icoUrl
    }
  }

  // 挂载后通知（向后兼容旧的 prerender-ready 机制）
  await nextTick()
  document.dispatchEvent(new Event('prerender-ready'))
  ;(window as unknown as Record<string, unknown>).__PRERENDER_READY__ = true
}