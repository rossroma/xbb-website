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
  await store.fetch()

  // 注入统计代码
  if (store.headScript) {
    document.head.insertAdjacentHTML('beforeend', store.headScript)
  }
  if (store.bodyScript) {
    // bodyScript 在 mount 之后注入，确保 #app 已存在
    document.body.insertAdjacentHTML('beforeend', store.bodyScript)
  }

  // 动态设置 favicon
  const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null
  if (faviconLink && store.icoLogo) {
    faviconLink.href = store.icoLogo
  }

  app.mount('#app')
})()
