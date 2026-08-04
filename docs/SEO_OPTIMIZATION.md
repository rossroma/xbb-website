# SEO 与 GEO 优化方案：预渲染解决客户端动态注入问题

## 问题诊断

### 为什么这是个问题

```
PHP 时代：请求 → 查库 → 拼 HTML → 返回          ← SEO 天然 OK
SPA 时代：请求 → 返回空壳 → JS 加载 → API 调用 → 渲染  ← SEO 不可见
```

PHP 时代，每个页面的 HTML 都在服务端拼接完成，搜索引擎爬虫拿到的就是完整内容。SPA 把渲染从服务端搬到了浏览器，换来了无刷新跳转、即时交互的用户体验，但代价是 HTML 源码里只有一个空的 `<div id="app"></div>`。预渲染本质上是用 Puppeteer 在构建阶段「模拟一次浏览器访问」，把 JS 渲染结果存成静态 HTML——跟 PHP 时代「缓存 PHP 输出为 .html」目的相同，只是多了一个模拟浏览器的环节。

### 当前状态

项目是纯 CSR（客户端渲染）SPA，使用 Vue 3 + Vite + `createWebHistory`。`index.html` 中：

1. **title 硬编码**：`<title>销帮帮CRM — 一站式企业数字化管理平台</title>`
2. **keywords / description 缺失**：没有 `<meta name="keywords">` 和 `<meta name="description">`
3. **各页面使用 `useHead` 动态写入**：在 `onMounted` 时通过 JS 修改 `<head>` 内容
4. **SEO 设置与前端脱节**：数据库中配置的 SEO 信息从未被注入到 HTML 源码中

### 爬虫 JS 渲染能力全景

| 爬虫 | 所属 | JS 渲染 | 对销帮帮的影响 |
|---|---|---|---|
| **Baiduspider** | 百度 | ❌ 几乎不执行 | **核心流量入口，完全依赖静态 HTML** |
| **360Spider / Sogou** | 360 / 搜狗 | ❌ 不支持 | 完全不执行 JS |
| **WeChat** | 微信 | ❌ 不支持 | 分享卡片、搜一搜依赖静态 meta |
| **Weibo** | 微博 | ❌ 不支持 | 同上 |
| Googlebot | Google | ✅ 支持（有延迟） | 渲染延迟数小时到数天，首屏排名仍依赖静态 HTML |
| Bingbot | Bing | ⚠️ 部分 | 弱于 Google，不稳定 |

### AI 爬虫：比传统搜索引擎更弱

**GEO（Generative Engine Optimization）的核心前提是 HTML 源码中有内容。** AI 爬虫不执行 JavaScript，原因非常简单：

- AI 爬虫只需要**纯文本内容**来训练模型或做 RAG 检索
- 执行 JS 对它们来说成本极高（运行 Chromium 实例）且收益极低
- 训练数据管线是离线的，不需要实时渲染

| 爬虫 | 所属 | JS 渲染 | 备注 |
|---|---|---|---|
| **GPTBot** | OpenAI | ❌ 不执行 | 明确声明只抓取原始 HTML |
| **Claude-Web** | Anthropic | ❌ 不执行 | 同上 |
| **CCBot** | Common Crawl | ❌ 不执行 | GPT-4/Claude 等模型的训练数据来源 |
| **PerplexityBot** | Perplexity | ❌ 不执行 | AI 搜索引擎 |
| **Bytespider** | 字节跳动 | ❌ 不执行 | 豆包等模型的训练数据源 |
| Applebot | Apple | ⚠️ 部分 | 比 Googlebot 弱 |

**结论：在你能列出的 AI 爬虫里，没有一个能可靠执行 JavaScript。** 如果 HTML 源码是空的，你的品牌在 AI 时代就是隐形的——用户在 ChatGPT/豆包/Kimi 里问「CRM 系统哪个好」，销帮帮不会出现在答案里。

## 解决方案：构建时预渲染

### 原理

```
vite build → 生成 dist/ → Puppeteer 逐个路由渲染 → 输出静态 HTML

/home              →  dist/index.html
/chanpin           →  dist/chanpin/index.html
/hangyeanli        →  dist/hangyeanli/index.html
...
```

每个输出的 HTML 文件都包含完整的 SEO 元数据和页面内容，所有爬虫直接读取源码即可获取。

### 用户访问流程：预渲染后的 SPA

预渲染**不是**在 SPA 和 MPA 之间二选一，而是把 SPA 的启动过程提前到了构建阶段：

```
用户访问 /chanpin
        │
        ▼
    Nginx 返回 /chanpin/index.html（预渲染，含完整 DOM）
        │
        ▼
    浏览器解析 HTML → 立即渲染页面内容    ← 首屏秒出（PHP 静态 HTML 的速度）
        │
        ▼
    JS 加载完成（app.js）
        │
        ▼
    Vue 应用启动，执行「水合」（Hydration）
    —— Vue 接管 DOM，页面变成响应式 SPA
        │
        ▼
    用户点击导航 → 纯客户端路由，无刷新跳转  ← 完整的 SPA 体验
```

| | PHP 静态 HTML | 纯 SPA（CSR） | 预渲染 SPA |
|---|---|---|---|
| 首次加载 | 快 | 慢（白屏等 JS） | 快 |
| 首次加载后 JS 接管 | 不接管 | 接管 | 接管 |
| 后续页面跳转 | 整页刷新 | 无刷新、流畅 | 无刷新、流畅 |
| 爬虫可见 | ✅ | ❌ | ✅ |

### 技术选型

| 方案 | 适用场景 | 改动量 | 推荐 |
|---|---|---|---|
| **vite-plugin-prerender** | 纯 CSR 项目，不改架构 | 小 | ✅ |
| Nuxt SSR | 新项目或大盘重构 | 大 | ❌ 过度 |
| Dynamic Rendering | 大量动态页面 | 中 | ⚠️ 见下方分析 |
| @vueuse/head（纯 CSR） | 仅 Google 场景 | 无 | ❌ 百度/AI 爬虫不认 |

### 为什么不用 Dynamic Rendering？

Dynamic Rendering（用户走 SPA，爬虫走 SSR）在概念上很吸引人，但维护成本常被低估：

1. **两套渲染路径**：SPA 用 Vue 3 组件在浏览器渲染，SSR 用同样的组件在 Node.js 渲染——运行环境不同，必须保证输出语义等价，否则 Google 判定为 cloaking（伪装），直接降权或除名
2. **基础设施负担**：需要维护一个独立的 SSR Node 服务（健康检查、降级策略、扩容、日志）
3. **延迟风险**：爬虫请求 → SSR 服务 → 请求后端 API → 等数据 → 渲染 → 返回，可能耗时 500ms-2s，爬虫有超时限制

对于销帮帮，绝大多数 SEO 相关页面是**静态页面**（产品页、案例页、合作伙伴页等），动态路由只有文章详情页和案例详情页。预渲染覆盖 90% 的页面，动态路由用列表页内容覆盖即可。

## 实施步骤

### 1. 安装依赖

```bash
pnpm add -D vite-plugin-prerender @prerenderer/renderer-puppeteer
```

### 2. 配置 `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-plugin-prerender'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      tailwindcss(),
      vitePrerenderPlugin({
        // 静态路由列表（不含动态路由如 /gongsidongtai/:id）
        staticRoutes: [
          '/',
          '/chanpin',
          '/kehuguanli',
          '/xiaoshouguanli',
          '/hangyeanli',
          '/yonghuxinsheng',
          '/gongsijianjie',
          '/gongsidongtai',
          '/lianxiwomen',
          '/huobanhezuo',
          '/shichangguanli',
          '/bi',
          '/ai',
          '/dingtalk',
          '/feishubanben',
          '/qiweibanben',
          '/mianfeishiyong',
          '/xiazaizhongxin',
          '/youzhifuwu',
          '/jianzheyoufen',
          '/paas',
        ],
        renderer: new PuppeteerRenderer({
          // 等待 API 数据加载完成后再截图
          renderAfterDocumentEvent: 'prerender-ready',
          headless: true,
          maxConcurrentRoutes: 4,
        }),
        // 输出到 dist 目录，与 SPA 入口共存
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /<script[^>]*data-prerender[^>]*><\/script>/g,
            '',
          )
          return renderedRoute
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/v1': { target: env.VITE_API_BASE_URL || 'http://localhost:3000', changeOrigin: true },
        '/uploads': { target: env.VITE_API_BASE_URL || 'http://localhost:3000', changeOrigin: true },
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

### 3. 在 `main.ts` 中触发渲染就绪事件

```typescript
// main.ts
const app = createApp(App)
const store = useSiteSettingsStore()

// 预加载站点设置（SEO 元数据 + 全局配置）
await store.fetch()

// 通知预渲染器：页面数据已就绪
document.dispatchEvent(new Event('prerender-ready'))

app.mount('#app')
```

### 4. 各页面 SEO 统一规范

每个页面通过 `useHead` 设置 SEO 信息，全局默认值从 SiteStore 读取，页面级覆盖：

```typescript
// composables/usePageSEO.ts
import { useHead } from '@vueuse/head'
import { useSiteSettingsStore } from '@/stores/siteSettings'

export function usePageSEO(overrides?: {
  title?: string
  description?: string
  keywords?: string
}) {
  const store = useSiteSettingsStore()

  const title = overrides?.title || store.seoTitle || '销帮帮CRM'
  const description = overrides?.description || store.seoDescription || ''
  const keywords = overrides?.keywords || store.seoKeywords || ''

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      // Open Graph（微信分享卡片）
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
    ],
  })
}
```

### 5. 构建命令

```bash
# 1. 确保后端 API 可访问
cd my-nest-app && pnpm start:dev &

# 2. 预渲染构建
cd my-vue-app && pnpm build
```

构建产物：

```
dist/
├── index.html                 # 首页（预渲染，含 SEO 元数据 + 完整 DOM）
├── chanpin/
│   └── index.html             # 产品页（预渲染）
├── hangyeanli/
│   └── index.html             # 案例列表页（预渲染，含案例列表内容）
├── gongsidongtai/
│   └── index.html             # 文章列表页（预渲染，含文章标题和摘要）
├── assets/                    # SPA 资源（JS/CSS）
└── ...                        # 其他预渲染页面
```

## 动态路由处理

文章详情页（`/gongsidongtai/:id`）和案例详情页（`/hangyeanli/:id`）无法在构建时预渲染，因为不知道有哪些 ID。

### 处理策略：列表页覆盖 + 内容降级

**不推荐为动态路由引入 Dynamic Rendering（SSR 代理）**，原因：

- 文章详情页和案例详情页不是 SEO 核心流量入口（没有人会在百度搜「销帮帮公司动态第 37 期」）
- 维护两套渲染路径（SPA + SSR）的隐性成本高于收益
- 构建时预渲染的列表页已经包含了文章标题和摘要，爬虫至少能索引到内容入口

如果未来文章详情页成为 SEO 核心流量来源（例如大篇幅的 SEO 文章），可以考虑以下方案之一：

| 方案 | 实现方式 | 成本 | 适用场景 |
|---|---|---|---|
| 构建时注入文章 ID 列表 | 从后端 API 获取近期文章 ID，构建时逐个预渲染 | 低 | 文章数量可控（< 100 篇） |
| prerender.io 第三方服务 | Nginx 反向代理到 prerender.io | 中（付费） | 不想自己维护 SSR 服务 |
| Nuxt SSR 全量迁移 | 整个项目迁移到 Nuxt | 高 | 大盘重构时考虑 |

## 部署适配

当前 Nginx 配置需确保预渲染的 HTML 文件能被正确路由：

```nginx
location / {
    try_files $uri $uri/index.html $uri/ /index.html;
}
```

## 验证方法

### 传统搜索引擎

```bash
curl -H "User-Agent: Baiduspider/2.0" https://www.xbongbong.com/chanpin
```

### AI 爬虫

```bash
# GPTBot
curl -H "User-Agent: GPTBot/1.0" https://www.xbongbong.com/chanpin

# Claude-Web
curl -H "User-Agent: Claude-Web" https://www.xbongbong.com/chanpin

# Common Crawl
curl -H "User-Agent: CCBot/2.0" https://www.xbongbong.com/chanpin
```

检查返回的 HTML 源码中是否包含完整的 `<title>`、`<meta>` 标签和页面内容（而非空的 `<div id="app"></div>`）。

## 实施优先级

| 优先级 | 任务 | 工作量 | 说明 |
|---|---|---|---|
| P0 | 安装 `vite-plugin-prerender` + 基础配置 | 0.5h | 最核心的改动 |
| P0 | 全局 SiteStore 预加载 + `prerender-ready` 事件 | 1h | 确保 API 数据就绪后再截图 |
| P1 | 各页面统一 `usePageSEO` 替代分散的 `useHead` | 2h | 确保标题/描述/关键词正确写入 |
| P1 | 静态路由预渲染验证 | 0.5h | 用 curl 模拟各爬虫 UA 验证 |
| P2 | 动态路由评估与处理 | 2h | 评估是否需要预渲染文章详情页 |
| P2 | CI/CD 构建流程适配 | 1h | 确保构建时后端 API 可访问 |

## 参考

- [vite-plugin-prerender](https://github.com/JoshuaAmaju/vite-plugin-prerender)
- [百度搜索优化指南](https://ziyuan.baidu.com/college/courseinfo?id=267)
- [Google 动态渲染指南](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [OpenAI GPTBot 文档](https://platform.openai.com/docs/gptbot)
- [Common Crawl 文档](https://commoncrawl.org/)