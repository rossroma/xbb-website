import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './client/App.vue'
import { routes } from './client/router'
import './client/styles/tailwind.css'
import './client/styles/global.css'
import './client/styles/rich-text.css'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient }) => {
    const pinia = createPinia()

    app.use(pinia)
    app.use(router)
    app.use(ElementPlus)

    // 仅客户端执行的初始化逻辑（统计代码注入、favicon 设置等）
    if (isClient) {
      import('./client/setup').then((m) => m.setupClient(app))
    }
  },
)