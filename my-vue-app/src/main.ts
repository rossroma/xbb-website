import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import 'element-plus/dist/index.css'

// IconPark 全局配置：描边宽度改为 2，避免毛边效果
DEFAULT_ICON_CONFIGS.strokeWidth = 2

import App from './client/App.vue'
import router from './client/router'
import { useSiteSettingsStore } from './client/stores/siteSettings'
import './client/styles/tailwind.css'
import './client/styles/global.css'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(head)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 启动时预加载站点设置（Logo、联系方式、SEO 元数据、统计代码等）
// 使用立即调用函数表达式以支持顶层 await
;(async () => {
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
    // 仅允许相对路径、同源 URL 或以 http(s) 开头的已知可信域名
    const isSafe =
      icoUrl.startsWith('/') ||
      icoUrl.startsWith(window.location.origin) ||
      /^https?:\/\//.test(icoUrl)
    if (isSafe) {
      faviconLink.href = icoUrl
    }
  }

  app.mount('#app')
})()
