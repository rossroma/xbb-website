import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import ElementPlus from 'element-plus'
import { DEFAULT_ICON_CONFIGS } from '@icon-park/vue-next'
import 'element-plus/dist/index.css'

// IconPark 全局配置：描边宽度改为 2，避免毛边效果
DEFAULT_ICON_CONFIGS.strokeWidth = 2

import App from './client/App.vue'
import router from './client/router'
import './client/styles/tailwind.css'
import './client/styles/global.css'

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
