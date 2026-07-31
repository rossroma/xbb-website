---
name: seo
description: 面向中国大陆市场的 SEO/GEO 技术规范 — 语义化、元数据、结构化数据、百度优化
metadata:
  type: project
  updated: 2026-07-21
  target: 百度、搜狗、360搜索、微信搜一搜、字节跳动搜索
---

# SEO/GEO 技术规范

## 目标搜索引擎

本网站面向中国大陆用户，目标搜索引擎为：
- **百度**（主力，占比 > 70%）
- 搜狗搜索
- 360 搜索
- 微信搜一搜
- 字节跳动搜索（头条搜索）

> **注意**：不涉及 Google Search、Twitter Card、Facebook Open Graph 等海外平台优化。

---

## 一、语义化 HTML 结构

### 1.1 页面级语义标签

```html
<body>
  <header>       <!-- 全局导航、Logo -->
  <nav>          <!-- 主导航菜单 -->
  <main>         <!-- 页面主体内容（每页唯一） -->
    <article>    <!-- 独立内容块（文章、产品介绍） -->
    <section>    <!-- 内容分区 -->
    <aside>      <!-- 侧边栏（相关推荐、联系方式） -->
  </main>
  <footer>       <!-- 页脚、ICP 备案号 -->
</body>
```

### 1.2 标题层级

```
h1 — 页面主标题（每页仅一个，包含核心关键词）
  h2 — 大区块标题
    h3 — 子区块标题
      h4 — 细节标题（尽量不用 h5/h6）
```

**规则**：
- 每页只有一个 `<h1>`
- 标题层级不可跳级（h1 → h3 是禁止的）
- 标题文本包含目标关键词，但避免堆砌

### 1.3 链接规范

- 链接文本使用描述性文字，禁止「点击这里」「了解更多」
- 重要页面之间保持 `<a href>` 真实链接（非 JS 跳转），便于爬虫抓取
- 导航菜单使用 `<nav>` + `<a>` 结构，非 `<div>` + `onClick`

### 1.4 图片规范

- 所有 `<img>` 必须有 `alt` 属性（描述图片内容，含关键词）
- 装饰性图片使用 `alt=""`（空字符串）
- 功能性图片（按钮、图标）必须有描述性 `alt`
- 重要图片（Banner、产品图）文件名使用中文拼音或英文描述

---

## 二、页面元数据

### 2.1 基础 Meta 标签

```html
<!-- 字符编码 -->
<meta charset="utf-8">

<!-- 移动端适配（百度移动优先索引） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 标题（核心 SEO 要素，每页唯一） -->
<title>页面标题 - 销帮帮CRM</title>

<!-- 描述（100-150 字，含核心关键词，百度搜索结果展示） -->
<meta name="description" content="页面描述，包含关键词，吸引点击...">

<!-- 关键词（百度仍参考，但权重降低，3-5 个即可） -->
<meta name="keywords" content="CRM,客户管理,销帮帮,销售管理">

<!-- 禁止百度转码 -->
<meta http-equiv="Cache-Control" content="no-transform">
<meta http-equiv="Cache-Control" content="no-siteapp">

<!-- Canonical URL（防止重复内容） -->
<link rel="canonical" href="https://www.xiaobangbang.com/...">
```

### 2.2 百度站长平台验证

```html
<!-- 百度站长平台验证（选其一） -->
<meta name="baidu-site-verification" content="code-xxxxxxxx">
```

### 2.3 移动端适配声明

```html
<!-- 百度移动适配（PC 端页面声明移动端地址） -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.xiaobangbang.com/...">
```

---

## 三、结构化数据

### 3.1 JSON-LD（百度支持）

百度支持以下结构化数据类型，优先实现：

**组织信息（Organization）**：
```json
{
  "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
  "@type": "Organization",
  "name": "销帮帮CRM",
  "url": "https://www.xiaobangbang.com",
  "logo": "https://www.xiaobangbang.com/logo.png",
  "description": "销帮帮CRM是专业的客户关系管理系统..."
}
```

**产品信息（Product）**：
```json
{
  "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
  "@type": "Product",
  "name": "销帮帮CRM",
  "description": "产品描述...",
  "category": "企业管理软件",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  }
}
```

**面包屑导航（BreadcrumbList）**：
```json
{
  "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://www.xiaobangbang.com/" },
    { "@type": "ListItem", "position": 2, "name": "产品", "item": "https://www.xiaobangbang.com/products" }
  ]
}
```

**文章（Article）**：
```json
{
  "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
  "@type": "Article",
  "headline": "文章标题",
  "datePublished": "2026-01-01T00:00:00+08:00",
  "dateModified": "2026-01-01T00:00:00+08:00",
  "author": { "@type": "Organization", "name": "销帮帮CRM" }
}
```

### 3.2 实现方式

在 `src/client/views/` 页面中使用 `useHead` 注入 JSON-LD：

```vue
<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
        '@type': 'Organization',
        name: '销帮帮CRM',
        // ...
      }),
    },
  ],
})
</script>
```

---

## 四、URL 结构规范

### 4.1 URL 设计要求

- 使用短小、语义化的 URL，避免参数过多
- 页面层级不超过 3 层
- 使用连字符 `-` 分隔单词，不使用下划线

```
✅ 推荐： /products/sales-management
❌ 避免： /products?id=123&type=detail
❌ 避免： /products/sales_management
```

### 4.2 中文 URL 处理

- 路由路径使用英文/拼音，不直接使用中文
- 中文标题放在 `<title>` 和 `<h1>` 中，而非 URL 中

```
✅ URL: /products/ai-assistant
✅ Title: AI智能助理 - 销帮帮CRM
❌ URL: /产品/AI智能助理
```

---

## 五、百度爬虫优化

### 5.1 百度 Spider 特性

- 百度 Spider 对 JavaScript 渲染支持有限，关键内容必须服务端渲染或预渲染
- 当前 Vue SPA 需要做 SSR 或预渲染，确保百度能抓取到完整内容
- 重要页面（首页、产品页、文章页）优先做预渲染

### 5.2 Robots.txt

```
User-agent: Baiduspider
Allow: /
Disallow: /admin/
Disallow: /login
Sitemap: https://www.xiaobangbang.com/sitemap.xml

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login
```

### 5.3 Sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.xiaobangbang.com/</loc>
    <lastmod>2026-07-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.xiaobangbang.com/products/ai-assistant</loc>
    <lastmod>2026-07-21</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 5.4 百度主动推送

```bash
# 页面更新后，通过百度站长平台 API 主动推送
curl -H 'Content-Type:text/plain' --data-raw 'https://www.xiaobangbang.com/new-page' \
  'http://data.zz.baidu.com/urls?site=www.xiaobangbang.com&token=YOUR_TOKEN'
```

---

## 六、页面性能要求

百度将页面加载速度作为排名因素：

| 指标 | 目标值 | 说明 |
|------|--------|------|
| FCP (First Contentful Paint) | < 1.8s | 首次内容渲染 |
| LCP (Largest Contentful Paint) | < 2.5s | 最大内容渲染 |
| TTFB (Time to First Byte) | < 800ms | 服务器响应时间（国内机房） |
| 移动端友好 | 通过百度移动友好检测 | 触控元素间距、字体大小 |

---

## 七、合规要求

### 7.1 必须展示的信息

- **ICP 备案号**：页脚必须显示（如「浙ICP备XXXXXXXX号」）
- **公安备案号**（如有）：页脚展示
- **增值电信业务经营许可证**（如有）
- **企业名称**：与营业执照一致

### 7.2 百度统计

```html
<!-- 百度统计代码 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?YOUR_BAIDU_TONGJI_ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

---

## 八、开发检查清单

### 组件开发时（/component）

- [ ] 使用语义化 HTML 标签（不滥用 `<div>`）
- [ ] 图片有 `alt` 属性
- [ ] 链接有描述性文本
- [ ] 标题使用正确的层级（h2/h3/h4）
- [ ] 交互元素可键盘访问（tabindex、focus 样式）

### 页面编排时（/page）

- [ ] `<title>` 唯一且包含关键词（格式：`页面标题 - 销帮帮CRM`）
- [ ] `<meta name="description">` 存在且 100-150 字
- [ ] `<meta name="keywords">` 3-5 个关键词
- [ ] Canonical URL 正确
- [ ] 页面有且仅有一个 `<h1>`
- [ ] 标题层级正确（不跳级）
- [ ] JSON-LD 结构化数据已注入
- [ ] 面包屑导航已实现
- [ ] 图片有 `alt` 属性
- [ ] 链接使用真实 `<a href>`（非 JS 跳转）
- [ ] 页面 `<main>` 标签包裹主体内容
- [ ] 移动端适配正常（viewport + 响应式）

### 上线前检查

- [ ] Sitemap.xml 已生成并提交百度站长平台
- [ ] Robots.txt 正确配置
- [ ] 百度站长平台验证通过
- [ ] 百度统计代码已部署
- [ ] ICP 备案号在页脚显示
- [ ] 关键页面已预渲染（或 SSR）
- [ ] 百度主动推送已配置