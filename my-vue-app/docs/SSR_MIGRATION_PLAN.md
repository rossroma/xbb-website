# SSR 改造方案：动静分离 — 预渲染 + 运行时 SSR

## 一、方案概述

**核心思路**：静态页面构建时预渲染为 HTML，动态页面运行时 SSR 渲染，Nginx 按路由分流。

```
                     ┌──────────────┐
                     │    Nginx     │
                     └──┬───┬───┬──┘
                        │   │   │
           ┌────────────┘   │   └────────────┐
           ▼                ▼                ▼
    ┌─────────────┐  ┌───────────┐  ┌──────────────┐
    │ 静态 HTML    │  │  静态资源  │  │ NestJS SSR    │
    │ (构建时生成)  │  │ JS/CSS/图  │  │ (运行时渲染)  │
    │             │  │           │  │              │
    │ /           │  │ /assets/* │  │ /gongsidongtai│
    │ /chanpin    │  │           │  │ /hangyeanli   │
    │ /ai         │  │           │  │ /yonghuxinsheng│
    │ ... 15 个   │  │           │  │ /gongsidongtai/│
    │             │  │           │  │   :id         │
    └─────────────┘  └───────────┘  │ /hangyeanli/  │
                                    │   :id         │
                                    └──────────────┘
```

### 1.1 为什么选择这个方案

| 对比维度 | 纯预渲染 | 纯 SSR | 动静分离（本方案） |
|---------|---------|--------|-------------------|
| 静态页面性能 | ✅ 极致 | 🟡 需缓存 | ✅ 极致 |
| 动态页面实时性 | ❌ 需重建部署 | ✅ 实时 | ✅ 实时 |
| 服务器负载 | ✅ 零 | ❌ 每请求渲染 | ✅ 仅 5 条路由走 SSR |
| 改造成本 | 1-2 天 | 16-23 天 | **5-7 人天** |
| 内容更新 | 改版时部署 | 零操作 | 零操作 |
| 运维复杂度 | 低 | 中 | 中 |

### 1.2 页面分类

**静态页面（15 个，构建时预渲染）**：

| 路由 | 页面 | 数据来源 |
|------|------|---------|
| `/` | 首页 | `homeData.ts` 常量 |
| `/chanpin` | 产品概述 | `productOverviewData.ts` 常量 |
| `/kehuguanli` | 客户管理 | 静态内容 |
| `/xiaoshouguanli` | 销售管理 | 静态内容 |
| `/shichangguanli` | 市场管理 | `marketManagementData.ts` 常量 |
| `/bi` | BI 分析 | `biAnalysisData.ts` 常量 |
| `/paas` | PaaS | 静态内容 |
| `/ai` | AI 销售助手 | `aiSalesAssistantData.ts` 常量 |
| `/dingtalk` | 钉钉版 | 静态内容 |
| `/feishubanben` | 飞书版 | 静态内容 |
| `/qiweibanben` | 企微版 | 静态内容 |
| `/gongsijianjie` | 公司简介 | `companyIntroData.ts` 常量 |
| `/youzhifuwu` | 服务中心 | `servicePageData.ts` 常量 |
| `/xiazaizhongxin` | 下载中心 | 静态内容 |
| `/jianzheyoufen` | 品牌大使 | `ambassadorPageData.ts` 常量 |

**动态页面（5 个，运行时 SSR）**：

| 路由 | 页面 | API 数据源 |
|------|------|-----------|
| `/gongsidongtai` | 新闻列表 | `getClientCategories()` + `getClientArticles()` |
| `/gongsidongtai/:id` | 新闻详情 | `getClientArticleDetail(id)` |
| `/hangyeanli` | 案例列表 | `getClientCategories()` + `getClientCases()` |
| `/hangyeanli/:id` | 案例详情 | `getClientCaseDetail(id)` |
| `/yonghuxinsheng` | 用户心声 | `getClientCategories()` + `getClientCases()` |

**CSR 页面（2 个，不预渲染也不 SSR）**：

| 路由 | 页面 | 原因 |
|------|------|------|
| `/lianxiwomen` | 联系我们 | 纯交互，SEO 价值低 |
| `/mianfeishiyong` | 免费试用 | 表单提交，SEO 价值低 |
| `/huobanhezuo` | 合作伙伴查询 | 用户输入搜索，SEO 价值低 |

**管理后台（22 个页面，不改造）**：

后台使用 Hash 路由 + Element Plus，纯内部工具，不参与 SSR 改造。

---

## 二、新增与修改文件清单

### 2.1 新增文件

| 文件 | 用途 |
|------|------|
| `src/entry-server.ts` | SSR 服务端入口：创建 App、路由、Pinia，导出渲染函数 |
| `src/entry-client.ts` | SSR 客户端入口：hydration 模式挂载 |
| `src/client/stores/newsPage.ts` | 新闻列表页 Pinia Store（SSR 数据预取 + 客户端共享） |
| `src/client/stores/casesPage.ts` | 案例列表页 Pinia Store |
| `src/client/stores/voicesPage.ts` | 用户心声页 Pinia Store |
| `src/client/stores/articleDetail.ts` | 文章详情页 Pinia Store |
| `src/client/stores/caseDetail.ts` | 案例详情页 Pinia Store |
| `my-nest-app/src/ssr/ssr.module.ts` | NestJS SSR 模块 |
| `my-nest-app/src/ssr/ssr.controller.ts` | NestJS SSR 控制器（路由匹配 + 渲染） |
| `my-nest-app/src/ssr/ssr-renderer.ts` | SSR 渲染核心逻辑 |
| `nginx.conf` | Nginx 配置（路由分流：静态文件 vs SSR 代理） |

### 2.2 修改文件

| 文件 | 改动内容 |
|------|---------|
| `vite.config.ts` | 新增 `vite-plugin-prerender` 插件、SSR 构建配置 |
| `package.json` | 新增依赖：`vite-plugin-prerender`、`puppeteer`；新增 `build:ssr` / `build:client` 脚本 |
| `src/main.ts` | 拆分为 `entry-client.ts` 逻辑；移除顶层 `fetch()` + `document` 操作 |
| `src/client/router.ts` | 路由创建函数化（支持 SSR 的 `createMemoryHistory`）；`document` 操作加 SSR 守卫 |
| `src/client/views/ClientLayout.vue` | `document.querySelector` 操作加 `onMounted` 守卫 |
| `src/shared/utils/token.ts` | `localStorage` 操作加 `typeof window` 守卫 |
| `src/shared/utils/semData.ts` | `captureSemData()` 调用移到 `entry-client.ts` 的 `onMounted` 中 |
| `src/client/views/news/NewsPage.vue` | 新增 `serverPrefetch()` 导出；数据从 Store 读取 |
| `src/client/views/cases/CasesPage.vue` | 同上 |
| `src/client/views/voices/VoicesPage.vue` | 同上 |
| `src/client/views/news/ArticleDetail.vue` | 新增 `serverPrefetch()` 导出 |
| `src/client/views/cases/CaseDetail.vue` | 新增 `serverPrefetch()` 导出 |
| `Dockerfile`（前端） | 构建阶段新增 `vite-plugin-prerender` 所需的 Chromium 依赖 |
| `docker-compose.yml` | 新增 SSR 缓存 Redis 服务（可选） |

---

## 三、详细实现

### 3.1 依赖安装

```bash
cd my-vue-app
pnpm add -D vite-plugin-prerender puppeteer
pnpm add @unhead/vue
pnpm remove @vueuse/head
```

### 3.2 Vite 配置改造

```typescript
// vite.config.ts
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import prerender from 'vite-plugin-prerender'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 构建时预渲染的静态路由
const STATIC_ROUTES = [
  '/',
  '/chanpin',
  '/kehuguanli',
  '/xiaoshouguanli',
  '/shichangguanli',
  '/bi',
  '/paas',
  '/ai',
  '/dingtalk',
  '/feishubanben',
  '/qiweibanben',
  '/gongsijianjie',
  '/youzhifuwu',
  '/xiazaizhongxin',
  '/jianzheyoufen',
]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
    plugins: [
      vue(),
      tailwindcss(),
      // 仅在生产构建时启用预渲染
      ...(mode === 'production'
        ? [
            prerender({
              staticDir: 'dist',
              routes: STATIC_ROUTES,
              renderer: new PuppeteerRenderer({
                // 等待网络空闲 3 秒（确保 Tailwind 样式计算完毕）
                networkIdleTimeout: 3000,
                // 静态页面无 API 请求，不需要等待额外元素
                renderAfterDocumentEvent: '',
              }),
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/v1': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
  }
})
```

### 3.3 入口文件拆分

#### `src/entry-server.ts`（新建）

```typescript
import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory } from 'vue-router'
import App from './client/App.vue'
import { createRouterInstance } from './client/router'

/**
 * 创建 SSR 应用实例
 * 每次请求调用一次，确保状态隔离
 */
export async function createApp(url: string) {
  const app = createVueApp(App)
  const head = createHead()
  const pinia = createPinia()
  const router = createRouterInstance(createMemoryHistory('/'))

  app.use(head)
  app.use(pinia)
  app.use(router)

  // 导航到请求 URL
  await router.push(url)
  await router.isReady()

  return { app, head, pinia, router }
}

/**
 * 渲染页面为 HTML 字符串
 * 在 NestJS SSR 控制器中调用
 */
export async function render(url: string, template: string): Promise<string> {
  const { app, head, pinia, router } = await createApp(url)

  // 执行组件级数据预取
  const matched = router.currentRoute.value.matched
  const ctx = { route: router.currentRoute.value, pinia }
  await Promise.all(
    matched.map((record) => {
      const comp = record.components?.default
      if (comp && typeof (comp as any).serverPrefetch === 'function') {
        return (comp as any).serverPrefetch(ctx)
      }
    })
  )

  // 渲染为 HTML
  const appHtml = await renderToString(app)
  const headTags = await head.resolveTags()

  // 注入 Pinia 状态（供客户端 hydration）
  const stateScript = `<script>window.__INITIAL_STATE__=${JSON.stringify(pinia.state.value)}</script>`

  // 替换模板占位符
  return template
    .replace('<!--ssr-head-->', headTags)
    .replace('<!--ssr-outlet-->', appHtml)
    .replace('<!--ssr-state-->', stateScript)
}
```

#### `src/entry-client.ts`（新建）

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'
import { createWebHistory } from 'vue-router'
import App from './client/App.vue'
import { createRouterInstance } from './client/router'
import { captureSemData } from './shared/utils/semData'
import './client/styles/tailwind.css'
import './client/styles/global.css'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()
const router = createRouterInstance(createWebHistory(import.meta.env.BASE_URL))

app.use(head)
app.use(pinia)
app.use(router)

// 恢复 SSR 状态
if (window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__
}

// 等待路由就绪后 hydration
router.isReady().then(() => {
  app.mount('#app', true) // true = hydration 模式

  // 仅在客户端执行：SEM 数据捕获
  captureSemData()
})
```

#### `index.html`（修改）

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>销帮帮CRM — 一站式企业数字化管理平台</title>
    <!--ssr-head-->
  </head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <!--ssr-state-->
    <script type="module" src="/src/entry-client.ts"></script>
  </body>
</html>
```

### 3.4 路由适配

#### `src/client/router.ts`（修改）

```typescript
// 修改前：
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [...]
// })

// 修改后：导出工厂函数，接受外部传入的 history 实现
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  type RouterHistory,
} from 'vue-router'

const routes = [
  // ... 路由定义不变 ...
]

export function createRouterInstance(history?: RouterHistory) {
  const router = createRouter({
    history: history ?? createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  // 路由守卫：document 操作加 SSR 守卫
  router.beforeEach((to, _from) => {
    if (to.hash) return
    if (typeof document === 'undefined') return // SSR 环境跳过

    const container = document.querySelector('.client-layout')
    if (!(container instanceof HTMLElement)) return

    container.style.scrollBehavior = 'auto'
    container.scrollTop = 0
    void container.offsetHeight
    container.style.scrollBehavior = ''
  })

  return router
}

// 客户端默认导出（兼容旧代码，非 SSR 入口使用）
export default createRouterInstance()
```

### 3.5 浏览器 API 隔离

#### `src/shared/utils/token.ts`（修改）

```typescript
const TOKEN_KEY = 'admin_token'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// getAuthHeaders / createAuthInterceptor 不变
```

#### `src/shared/utils/semData.ts`（修改）

`captureSemData()` 内部已有 `try-catch`，但 `window.location` 在 SSR 中不可用。在 `entry-client.ts` 的 `router.isReady().then()` 中调用即可，无需修改工具函数本身。

#### `src/client/views/ClientLayout.vue`（修改）

```typescript
// 修改前：captureSemData() 在 <script setup> 顶层调用
// 修改后：移除顶层调用，改为在 entry-client.ts 中调用

// scrollToHash / syncRoutePosition 中的 document 操作：
// 已在 onMounted 和 watch 中调用，天然安全，无需改动
```

### 3.6 数据预取 Store

#### `src/client/stores/newsPage.ts`（新建）

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getClientArticles, type ClientArticleListResponse } from '@/shared/api/article'
import { getClientCategories, type ClientCategoryListResponse, type Category } from '@/shared/api/category'

export interface CategoryTab {
  key: string
  label: string
}

export interface CategoryInfo {
  slug: string
  bid: number | null
}

export const useNewsPageStore = defineStore('newsPage', () => {
  // ===== 状态 =====
  const articles = ref<ClientArticleListResponse | null>(null)
  const categories = ref<Category[]>([])
  const activeTabKey = ref('all')
  const currentPage = ref(1)
  const pageSize = ref(12)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const initialized = ref(false)

  // ===== 分类映射 =====
  const categoryMap = ref<Map<string, CategoryInfo>>(new Map())

  // ===== 计算属性 =====
  const total = computed(() => articles.value?.total ?? 0)
  const totalPages = computed(() => articles.value?.totalPages ?? 0)

  function getActiveBid(): number | null {
    const info = categoryMap.value.get(activeTabKey.value)
    return info?.bid ?? null
  }

  // ===== 数据加载 =====
  async function loadArticles() {
    isLoading.value = true
    errorMessage.value = null
    try {
      const bid = getActiveBid()
      const params: { page: number; limit: number; bid?: number } = {
        page: currentPage.value,
        limit: pageSize.value,
      }
      if (bid !== null) params.bid = bid
      articles.value = await getClientArticles(params)
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : '加载失败'
    } finally {
      isLoading.value = false
    }
  }

  async function loadCategories() {
    try {
      const result: ClientCategoryListResponse = await getClientCategories(true)
      categories.value = result.items
    } catch {
      console.warn('加载分类列表失败')
    }
  }

  async function init() {
    if (initialized.value) return
    initialized.value = true
    await loadCategories()
    await loadArticles()
  }

  function setTab(key: string) {
    activeTabKey.value = key
    currentPage.value = 1
  }

  function setPage(page: number) {
    currentPage.value = page
  }

  return {
    articles, categories, activeTabKey, currentPage, pageSize,
    isLoading, errorMessage, initialized,
    categoryMap, total, totalPages,
    loadArticles, loadCategories, init,
    setTab, setPage,
  }
})
```

#### `src/client/stores/articleDetail.ts`（新建）

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getClientArticleDetail,
  type ArticleDetail as ArticleDetailData,
  type ArticleNavInfo,
} from '@/shared/api/article'

export const useArticleDetailStore = defineStore('articleDetail', () => {
  const article = ref<ArticleDetailData | null>(null)
  const prevArticle = ref<ArticleNavInfo | null>(null)
  const nextArticle = ref<ArticleNavInfo | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  const formattedTime = computed(() => {
    const ts = article.value?.addtime
    if (!ts) return ''
    const date = new Date(ts * 1000)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })

  async function loadArticle(id: number) {
    isLoading.value = true
    errorMessage.value = null
    try {
      const result = await getClientArticleDetail(id)
      article.value = result.article
      prevArticle.value = result.prev
      nextArticle.value = result.next
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : '加载文章失败'
    } finally {
      isLoading.value = false
    }
  }

  return {
    article, prevArticle, nextArticle, isLoading, errorMessage,
    formattedTime, loadArticle,
  }
})
```

### 3.7 页面组件改造

#### `src/client/views/news/NewsPage.vue`（修改关键部分）

```typescript
// 新增：SSR 数据预取（在 entry-server.ts 中调用）
export async function serverPrefetch(ctx: { route: any; pinia: any }) {
  const store = useNewsPageStore(ctx.pinia)
  await store.init()
}

// 组件内修改：
// 原来在 onMounted 中调用 loadCategories + loadArticles
// 改为从 Store 读取数据，只在客户端首次挂载时初始化

const store = useNewsPageStore()

// 客户端兜底：如果 SSR 未预取数据（如首次 CSR 访问），则客户端加载
onMounted(async () => {
  if (!store.initialized) {
    await store.init()
  }
})

// 模板中的 articleList → store.articles
// isLoading → store.isLoading
// errorMessage → store.errorMessage
```

#### `src/client/views/news/ArticleDetail.vue`（修改关键部分）

```typescript
export async function serverPrefetch(ctx: { route: any; pinia: any }) {
  const id = Number(ctx.route.params.id)
  if (!id) return
  const store = useArticleDetailStore(ctx.pinia)
  await store.loadArticle(id)
}

// 组件内：watch route.params.id 改为调用 store.loadArticle
// 首次渲染时如果 Store 已有数据（SSR 预取），直接使用
```

### 3.8 NestJS SSR 集成

#### `my-nest-app/src/ssr/ssr-renderer.ts`（新建）

```typescript
import { readFileSync } from 'fs'
import { resolve } from 'path'

// 开发模式：加载 Vite 开发服务器
// 生产模式：加载构建产物
const isDev = process.env.NODE_ENV !== 'production'

let template: string
let render: ((url: string, template: string) => Promise<string>) | null = null

async function loadRenderer() {
  if (isDev) {
    // 开发模式：使用 Vite 开发服务器的 SSR 模块
    const { createServer } = await import('vite')
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    // 通过 Vite 的 SSR 模块加载
    const mod = await vite.ssrLoadModule('/src/entry-server.ts')
    render = mod.render
    template = readFileSync(resolve('index.html'), 'utf-8')
      .replace('</body>', '<!--ssr-outlet--></body>')
    return { vite, render }
  } else {
    // 生产模式：加载预构建的 SSR bundle
    const distPath = resolve(__dirname, '../../dist')
    template = readFileSync(resolve(distPath, 'index.html'), 'utf-8')
    // SSR bundle 在 dist/server/entry-server.js
    const mod = await import(resolve(distPath, 'server/entry-server.js'))
    render = mod.render
    return { render }
  }
}

let rendererPromise: Promise<{ render: any; vite?: any }> | null = null

export async function getRenderer() {
  if (!rendererPromise) {
    rendererPromise = loadRenderer()
  }
  return rendererPromise
}

export async function renderPage(url: string): Promise<string> {
  const { render: renderFn } = await getRenderer()
  return renderFn(url, template)
}
```

#### `my-nest-app/src/ssr/ssr.controller.ts`（新建）

```typescript
import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { renderPage } from './ssr-renderer'

// 需要运行时 SSR 的动态路由
const SSR_ROUTES = [
  '/gongsidongtai',
  '/hangyeanli',
  '/yonghuxinsheng',
]

@Controller()
export class SsrController {
  @Get(SSR_ROUTES)
  async renderList(@Req() req: Request, @Res() res: Response) {
    try {
      const html = await renderPage(req.originalUrl)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      // 列表页短缓存（1 分钟），减少重复渲染
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
      res.send(html)
    } catch (err) {
      console.error('SSR render error:', err)
      // 降级：返回 SPA 入口 HTML，客户端接管
      res.sendFile('index.html', { root: 'dist' })
    }
  }

  @Get(['/gongsidongtai/:id', '/hangyeanli/:id'])
  async renderDetail(@Req() req: Request, @Res() res: Response) {
    try {
      const html = await renderPage(req.originalUrl)
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      // 详情页长缓存（10 分钟），内容变化频率低
      res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600')
      res.send(html)
    } catch (err) {
      console.error('SSR render error:', err)
      res.sendFile('index.html', { root: 'dist' })
    }
  }
}
```

#### `my-nest-app/src/ssr/ssr.module.ts`（新建）

```typescript
import { Module } from '@nestjs/common'
import { SsrController } from './ssr.controller'

@Module({
  controllers: [SsrController],
})
export class SsrModule {}
```

在 `my-nest-app/src/app.module.ts` 中导入：

```typescript
import { SsrModule } from './ssr/ssr.module'

@Module({
  imports: [
    // ... 其他模块
    SsrModule,
  ],
})
export class AppModule {}
```

### 3.9 Nginx 配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;

    # gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # ===== 路由分流规则 =====

    # 1. 静态资源（Vite 构建带哈希，长期缓存）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 2. 动态路由 → 代理到 NestJS SSR 服务
    #    列表页和详情页都由 NestJS 运行时渲染
    location ~ ^/(gongsidongtai|hangyeanli|yonghuxinsheng) {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # SSR 渲染超时保护
        proxy_read_timeout 10s;
        # 透传后端缓存头
        proxy_cache_valid 200 1m;
    }

    # 3. API 反向代理
    location /v1/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }

    # 4. 管理后台（Hash 路由，SPA fallback）
    location /admin {
        alias /usr/share/nginx/html;
        try_files $uri $uri/ /admin.html;
    }

    # 5. 静态页面 + 兜底
    #    先尝试匹配预渲染的静态 HTML，再 fallback 到 index.html（SPA）
    location / {
        try_files $uri $uri.html $uri/index.html /index.html;
        # HTML 不缓存，确保新版本立即生效
        add_header Cache-Control "no-cache, must-revalidate";
    }
}
```

### 3.10 构建脚本

```json
// package.json 新增脚本
{
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "build-only": "vite build",
    "build:ssr": "vite build --ssr src/entry-server.ts --outDir dist/server",
    "build:all": "pnpm build-only && pnpm build:ssr",
    "preview": "vite preview",
    // ... 其他脚本不变
  }
}
```

---

## 四、请求生命周期

```
用户请求 GET /gongsidongtai
        │
        ▼
    ┌───────┐
    │ Nginx │
    └───┬───┘
        │ 匹配 location ~ ^/(gongsidongtai|...)
        │ proxy_pass → NestJS:3000
        ▼
    ┌────────────────────────────────────────────┐
    │           NestJS SsrController              │
    │                                            │
    │  1. renderPage('/gongsidongtai')           │
    │     │                                      │
    │     ├─ 2. createSSRApp()                   │
    │     │     ├─ createVueApp(App)             │
    │     │     ├─ createPinia()                 │
    │     │     └─ createRouter(memoryHistory)   │
    │     │                                      │
    │     ├─ 3. router.push('/gongsidongtai')    │
    │     │     └─ 匹配到 NewsPage 组件           │
    │     │                                      │
    │     ├─ 4. NewsPage.serverPrefetch(ctx)     │
    │     │     ├─ getClientCategories(true)     │
    │     │     │     └─ 查询数据库 ──────────────► DB
    │     │     └─ getClientArticles({page:1})    │
    │     │           └─ 查询数据库 ──────────────► DB
    │     │                                      │
    │     ├─ 5. renderToString(app)              │
    │     │     └─ Vue 组件渲染（数据已注入）      │
    │     │                                      │
    │     └─ 6. 拼装完整 HTML                     │
    │           ├─ <div id="app">完整DOM</div>    │
    │           └─ <script>__INITIAL_STATE__</script>
    │                                            │
    │  7. 返回 HTML（Cache-Control: max-age=60） │
    └────────────────────────────────────────────┘
        │
        ▼
    浏览器接收完整 HTML
        │
        ├─ 立即渲染首屏（无需等待 JS）
        └─ 加载 entry-client.ts
              ├─ 恢复 __INITIAL_STATE__ → Pinia
              └─ app.mount('#app', true) → hydration
```

---

## 五、实施步骤

### Phase 1：基础设施搭建（2 天）

| 步骤 | 内容 | 验证方式 |
|------|------|---------|
| 1.1 | 安装依赖：`vite-plugin-prerender`、`puppeteer`、`@unhead/vue` | `pnpm install` 无报错 |
| 1.2 | 创建 `entry-server.ts`、`entry-client.ts` | 文件就位 |
| 1.3 | 修改 `index.html` 占位符 | 模板渲染正确 |
| 1.4 | 修改 `router.ts` 为工厂函数 | 开发模式路由正常 |
| 1.5 | 修改 `token.ts`、`semData.ts` 浏览器 API 守卫 | 单元测试通过 |
| 1.6 | 修改 `ClientLayout.vue` 移除顶层 `captureSemData` | 开发模式页面正常 |
| 1.7 | 修改 `vite.config.ts` 加入预渲染插件 | `pnpm build` 成功，`dist/` 有静态 HTML |

### Phase 2：Store 与数据预取（2 天）

| 步骤 | 内容 | 验证方式 |
|------|------|---------|
| 2.1 | 创建 `newsPage` Store | 单元测试：Store 数据加载正确 |
| 2.2 | 创建 `casesPage` Store | 同上 |
| 2.3 | 创建 `voicesPage` Store | 同上 |
| 2.4 | 创建 `articleDetail` Store | 同上 |
| 2.5 | 创建 `caseDetail` Store | 同上 |
| 2.6 | 改造 `NewsPage.vue`：导出 `serverPrefetch`，从 Store 读取 | 页面正常渲染 |
| 2.7 | 改造 `CasesPage.vue` | 同上 |
| 2.8 | 改造 `VoicesPage.vue` | 同上 |
| 2.9 | 改造 `ArticleDetail.vue` | 同上 |
| 2.10 | 改造 `CaseDetail.vue` | 同上 |

### Phase 3：NestJS SSR 集成（1.5 天）

| 步骤 | 内容 | 验证方式 |
|------|------|---------|
| 3.1 | 创建 `ssr-renderer.ts` | 模块可导入 |
| 3.2 | 创建 `ssr.controller.ts` | 路由注册成功 |
| 3.3 | 创建 `ssr.module.ts` 并注册到 `AppModule` | NestJS 启动无报错 |
| 3.4 | 本地联调：`pnpm dev` + `pnpm dev:backend`，访问动态路由 | 页面 SSR 渲染成功 |
| 3.5 | 验证 SSR 降级：后端 API 不可用时返回 CSR 页面 | 不白屏 |

### Phase 4：Nginx 与部署（1 天）

| 步骤 | 内容 | 验证方式 |
|------|------|---------|
| 4.1 | 编写 `nginx.conf` 路由分流规则 | 本地 Docker 测试 |
| 4.2 | 修改 Dockerfile（前端）添加 Chromium 依赖 | 镜像构建成功 |
| 4.3 | 更新 `docker-compose.yml`（如加 Redis 缓存） | `docker compose up` 成功 |
| 4.4 | 端到端验证：Docker 环境完整部署 | 所有页面正常 |

### Phase 5：测试与回归（1 天）

| 步骤 | 内容 | 验证方式 |
|------|------|---------|
| 5.1 | 静态页面：15 个页面检查 HTML 源码含完整内容 | `curl -s` 检查 |
| 5.2 | 动态页面：5 个页面检查 SSR 渲染内容 | `curl -s` 检查 |
| 5.3 | CSR 页面：3 个页面正常加载 | 浏览器验证 |
| 5.4 | 管理后台：22 个页面功能正常 | 浏览器验证 |
| 5.5 | 移动端适配检查 | 响应式断点验证 |
| 5.6 | SEO 标签验证：`<title>`、`<meta description>` 在 HTML 中 | `curl -s` 检查 |

---

## 六、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| `vite-plugin-prerender` Puppeteer 在 CI 中 Chromium 下载失败 | 中 | 中 | Dockerfile 中预装 Chromium；配置 `PUPPETEER_EXECUTABLE_PATH` 指向系统 Chromium |
| `@tailwindcss/vite` v4 与 SSR 构建兼容性 | 低 | 中 | 预渲染阶段使用 Puppeteer 真实渲染，Tailwind 样式已计算完毕 |
| SSR 渲染超时（API 慢） | 低 | 高 | 设置 10 秒超时，超时降级到 CSR；Nginx `proxy_read_timeout` 保护 |
| SSR 内存泄漏 | 低 | 中 | 每次请求创建独立 App 实例；NestJS 进程监控 + 内存限制 |
| 预渲染页面与 SSR 页面样式不一致 | 低 | 低 | 共享同一套 Tailwind 配置；预渲染版已通过 Puppeteer 真实浏览器渲染 |
| Hydration Mismatch | 中 | 中 | 确保服务端和客户端使用相同的数据；Pinia state 序列化传递 |

---

## 七、回滚方案

SSR 改造完全向后兼容，回滚只需两步：

1. **Nginx 层面**：将动态路由的 `proxy_pass` 规则注释掉，所有请求走 `try_files` 静态文件
2. **代码层面**：`entry-client.ts` 中 `app.mount('#app', true)` 改为 `app.mount('#app')` 即退回纯 CSR

不需要回滚数据库、不需要回滚后端代码。

---

## 八、附录

### A. 静态页面预渲染产物

```
dist/
├── index.html                      # 首页
├── admin.html                      # 管理后台
├── assets/                         # JS/CSS/图片
├── chanpin/
│   └── index.html                  # 产品概述
├── kehuguanli/
│   └── index.html                  # 客户管理
├── xiaoshouguanli/
│   └── index.html                  # 销售管理
├── shichangguanli/
│   └── index.html                  # 市场管理
├── bi/
│   └── index.html                  # BI 分析
├── paas/
│   └── index.html                  # PaaS
├── ai/
│   └── index.html                  # AI 销售助手
├── dingtalk/
│   └── index.html                  # 钉钉版
├── feishubanben/
│   └── index.html                  # 飞书版
├── qiweibanben/
│   └── index.html                  # 企微版
├── gongsijianjie/
│   └── index.html                  # 公司简介
├── youzhifuwu/
│   └── index.html                  # 服务中心
├── xiazaizhongxin/
│   └── index.html                  # 下载中心
├── jianzheyoufen/
│   └── index.html                  # 品牌大使
└── server/
    └── entry-server.js             # SSR bundle（NestJS 加载）
```

### B. 关键命令速查

```bash
# 开发
pnpm dev                    # 前端开发服务器
pnpm dev:backend            # 后端开发服务器

# 构建
pnpm build:all              # 完整构建（客户端 + SSR bundle）
pnpm build-only             # 仅客户端构建（含预渲染）
pnpm build:ssr              # 仅 SSR bundle 构建

# 验证
curl -s http://localhost/                    # 首页（静态HTML）
curl -s http://localhost/gongsidongtai       # 新闻列表（SSR）
curl -s http://localhost/gongsidongtai/123   # 新闻详情（SSR）

# Docker
docker compose build --no-cache
docker compose up -d
```