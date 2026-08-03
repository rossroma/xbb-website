# SEO 优化方案：预渲染解决客户端动态注入问题

## 问题诊断

### 当前状态

项目是纯 CSR（客户端渲染）SPA，使用 Vue 3 + Vite + `createWebHistory`。SEO 相关字段（`title`、`keyword`、`descs`）存储在数据库 `web_base` 表中，通过后台「SEO 设置」tab 编辑，但：

1. **`index.html` 中 title 是硬编码的**：`<title>销帮帮CRM — 一站式企业数字化管理平台</title>`
2. **keywords / description 未注入**：`index.html` 中没有 `<meta name="keywords">` 和 `<meta name="description">`
3. **各页面使用 `useHead` 动态写入**：每个页面在 `onMounted` 时通过 JS 修改 `<head>` 内容
4. **SEO 设置与前端完全脱节**：数据库中配置的 SEO 信息从未被注入到 HTML 中

### 核心问题：搜索引擎能否爬取 JS 动态写入的 SEO 信息？

| 搜索引擎 | JS 渲染能力 | 对销帮帮的影响 |
|----------|:---:|------|
| **百度** | ❌ 很弱 | **核心流量入口，几乎不执行 JS** |
| **360 / 搜狗** | ❌ 不支持 | 完全不执行 JS |
| **微信爬虫** | ❌ 不支持 | 分享卡片、搜一搜依赖静态 meta |
| **微博爬虫** | ❌ 不支持 | 同上 |
| Google | ✅ 支持 | 有渲染延迟（数小时到数天），首屏排名仍依赖静态 HTML |
| Bing | ⚠️ 部分 | 弱于 Google，不稳定 |

**结论**：对于销帮帮（面向国内客户），依赖客户端 JS 动态写入 SEO 信息 = **搜索引擎基本看不到**。必须将 SEO 信息写入 HTML 源码。

## 解决方案：构建时预渲染（Prerendering）

### 原理

一图胜千言：

```
vite build → 生成 dist/ → Puppeteer 逐个路由渲染 → 输出静态 HTML

/home              →  dist/index.html
/chanpin           →  dist/chanpin/index.html
/hangyeanli        →  dist/hangyeanli/index.html
...
```

每个输出的 HTML 文件都包含完整的 SEO 元数据，搜索引擎直接读取源码即可获取。

### 技术选型

| 方案 | 适用场景 | 改动量 | 推荐 |
|------|---------|:---:|:---:|
| **vite-plugin-prerender** | 纯 CSR 项目，不改架构 | 小 | ✅ |
| Nuxt SSR | 新项目或大盘重构 | 大 | ❌ 过度 |
| Astro / VitePress | 内容型站点 | 中 | ❌ 不适用 |
| @vueuse/head（纯 CSR） | 仅 Google 场景 | 无 | ❌ 百度不认 |

### 实施步骤

#### 1. 安装依赖

```bash
pnpm add -D vite-plugin-prerender
```

#### 2. 配置 `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePrerenderPlugin } from 'vite-plugin-prerender'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

export default defineConfig({
  plugins: [
    vue(),
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
        // 移除预渲染标记，避免用户看到
        renderedRoute.html = renderedRoute.html.replace(
          /<script[^>]*data-prerender[^>]*><\/script>/g,
          '',
        )
        return renderedRoute
      },
    }),
  ],
})
```

#### 3. 在 `main.ts` 中触发渲染就绪事件

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

#### 4. 各页面 SEO 统一规范

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

#### 5. 构建命令

```bash
# 1. 确保后端 API 可访问
cd my-nest-app && pnpm start:dev &

# 2. 预渲染构建
cd my-vue-app && pnpm build
```

构建产物：
```
dist/
├── index.html                # 首页（预渲染，含 SEO 元数据）
├── chanpin/
│   └── index.html            # 产品页（预渲染）
├── hangyeanli/
│   └── index.html            # 案例页（预渲染）
├── assets/                   # SPA 资源（JS/CSS）
└── ...                       # 其他预渲染页面
```

### 动态路由处理

文章详情页（如 `/gongsidongtai/:id`）无法在构建时预渲染（因为不知道有哪些文章 ID）。处理方式：

1. **列表页预渲染**：`/gongsidongtai` 预渲染，包含文章列表
2. **详情页按需 SSR**：通过 Nginx 配置，对爬虫 UA 走 SSR 代理，普通用户走 SPA
3. **或使用 `prerender.io` 等服务**：第三方爬虫渲染服务

### 部署适配

当前 Nginx 配置需确保预渲染的 HTML 文件能被正确路由：

```nginx
location / {
    try_files $uri $uri/index.html $uri/ /index.html;
}
```

### 验证方法

构建完成后，用 curl 模拟百度爬虫请求：

```bash
curl -H "User-Agent: Baiduspider/2.0" https://www.xbongbong.com/chanpin
```

检查返回的 HTML 源码中是否包含正确的 `<title>` 和 `<meta>` 标签。

## 实施优先级

| 优先级 | 任务 | 工作量 |
|:---:|------|:---:|
| P0 | 安装 `vite-plugin-prerender` + 基础配置 | 0.5h |
| P0 | 全局 SiteStore 预加载 + `prerender-ready` 事件 | 1h |
| P1 | 各页面统一 `usePageSEO` 替代分散的 `useHead` | 2h |
| P1 | 静态路由预渲染验证 | 0.5h |
| P2 | 动态路由（文章详情）处理 | 2h |
| P2 | CI/CD 构建流程适配 | 1h |

## 参考

- [vite-plugin-prerender](https://github.com/JoshuaAmaju/vite-plugin-prerender)
- [百度搜索优化指南](https://ziyuan.baidu.com/college/courseinfo?id=267)
- [Google 渲染指南](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)