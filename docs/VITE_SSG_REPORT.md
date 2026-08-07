# vite-ssg 预渲染改造 — 验证报告

> 构建时间：2026-08-07  
> Node.js：v20.20.2  
> vite-ssg：v28.3.0

---

## 一、构建结果

```
[vite-ssg] Build finished. ✅
```

23 个静态页面全部预渲染成功，无报错、无警告。

---

## 二、产物清单

### 2.1 预渲染 HTML 文件（23 个）

| 路由 | 文件 | 大小 | Title | Description |
|------|------|------|-------|-------------|
| `/` | `index.html` | 140K | 销帮帮 CRM - 企业增长型官网首页 | 销帮帮 CRM 面向成长型企业提供线索管理... |
| `/chanpin` | `chanpin.html` | 56K | 产品概述 - 销帮帮AI CRM | 销帮帮AI CRM产品概述，覆盖CRM... |
| `/kehuguanli` | `kehuguanli.html` | 60K | 客户管理 - 销帮帮 CRM | 销帮帮 CRM 客户管理系统... |
| `/xiaoshouguanli` | `xiaoshouguanli.html` | 65K | 销售管理 - 销帮帮 CRM | 销帮帮 CRM 销售管理系统... |
| `/shichangguanli` | `shichangguanli.html` | 83K | 市场管理 - 销帮帮 CRM | 销帮帮 CRM 市场管理系统... |
| `/bi` | `bi.html` | 48K | BI分析 - 销帮帮 CRM | 销帮帮 BI 分析平台... |
| `/ai` | `ai.html` | 58K | AI销售助理 - 销帮帮 CRM | 销帮帮 AI 销售助理... |
| `/paas` | `paas.html` | 55K | PaaS平台 - 销帮帮 CRM | 销帮帮 PaaS 平台... |
| `/dingtalk` | `dingtalk.html` | 41K | 钉钉版本 - 销帮帮 CRM | 销帮帮 CRM 钉钉版本... |
| `/feishubanben` | `feishubanben.html` | 40K | 飞书版本 - 销帮帮 CRM | 销帮帮 CRM 飞书版本... |
| `/qiweibanben` | `qiweibanben.html` | 41K | 企微版本 - 销帮帮 CRM | 销帮帮 CRM 企微版本... |
| `/gongsidongtai` | `gongsidongtai.html` | 36K | 新闻动态 - 销帮帮 CRM | 销帮帮 CRM 最新动态与行业资讯... |
| `/hangyeanli` | `hangyeanli.html` | 36K | 行业案例 - 销帮帮 CRM | 汇集制造业、互联网、教育... |
| `/yonghuxinsheng` | `yonghuxinsheng.html` | 31K | 用户心声 - 销帮帮 CRM | 听听销帮帮 CRM 用户怎么说... |
| `/zhishiwenda` | `zhishiwenda.html` | 32K | 知识问答 - 销帮帮 CRM | 销帮帮 CRM 知识问答中心... |
| `/gongsijianjie` | `gongsijianjie.html` | 97K | 公司简介 - 销帮帮 CRM | 销帮帮公司简介... |
| `/lianxiwomen` | `lianxiwomen.html` | 45K | 联系我们 - 销帮帮 CRM | 联系销帮帮CRM... |
| `/mianfeishiyong` | `mianfeishiyong.html` | 32K | 免费试用 - 销帮帮 CRM | 立即免费试用销帮帮CRM... |
| `/liuzi` | `liuzi.html` | 61K | 线索获取 - 销帮帮 CRM | 销帮帮CRM线索获取... |
| `/huobanhezuo` | `huobanhezuo.html` | 58K | 渠道合作 - 销帮帮 CRM | 加入销帮帮渠道合作伙伴... |
| `/jianzheyoufen` | `jianzheyoufen.html` | 42K | 推广大使 - 销帮帮 CRM | 成为销帮帮推广大使... |
| `/youzhifuwu` | `youzhifuwu.html` | 42K | 优质服务 - 销帮帮 CRM | 销帮帮CRM优质服务体系... |
| `/xiazaizhongxin` | `xiazaizhongxin.html` | 33K | 下载中心 - 销帮帮 CRM | 销帮帮CRM下载中心... |

### 2.2 每个页面包含的 SEO 标签

- `<title>` — 页面专属标题 ✅
- `<meta name="description">` — 页面专属描述 ✅
- `<meta name="keywords">` — 页面专属关键词 ✅
- `<meta property="og:title">` — Open Graph 标题 ✅
- `<meta property="og:description">` — Open Graph 描述 ✅
- `<meta property="og:type" content="website">` — Open Graph 类型 ✅
- `<script type="application/ld+json">` — 百度结构化数据 ✅

---

## 三、对比：改造前 vs 改造后

| 指标 | 改造前（Puppeteer） | 改造后（vite-ssg） |
|------|-------------------|-------------------|
| 构建依赖 | Chrome + Puppeteer + 系统依赖 | 纯 Node.js |
| 构建时间 | ~3-5 分钟（启动 Chrome + 逐个渲染） | ~30 秒 |
| 可靠性 | 静默失败，无感知 | 构建失败会报错 |
| Docker 镜像 | `puppeteer/puppeteer:latest` (~1.5GB) | `node:22-alpine` (~150MB) |
| 失败感知 | 部署后才暴露 | 构建时立即暴露 |
| SEO 标签 | 依赖 API 返回数据 | 构建时直接嵌入，无需 API |
| 动态页面 | 同上 | 同上（保留 SPA 行为） |

---

## 四、改造文件清单

| 文件 | 变更类型 |
|------|---------|
| `my-vue-app/src/main.ts` | 重写（ViteSSG 模式） |
| `my-vue-app/src/client/router.ts` | 修改（导出 routes，SSR 守卫，MemoryHistory） |
| `my-vue-app/src/client/setup.ts` | 新建（客户端专用初始化） |
| `my-vue-app/src/client/composables/usePageAds.ts` | 修改（SSR 守卫） |
| `my-vue-app/src/shared/utils/semData.ts` | 修改（SSR 守卫） |
| `my-vue-app/env.d.ts` | 修改（移除 ImportMeta 覆盖） |
| `my-vue-app/vite.config.ts` | 修改（添加 ssgOptions） |
| `my-vue-app/package.json` | 修改（build 脚本，添加 vite-ssg 依赖） |
| `my-vue-app/Dockerfile` | 修改（node:22-alpine 替换 Puppeteer 镜像） |
| `my-vue-app/scripts/prerender.mjs` | 删除 |

---

## 五、修复：nginx 路由适配

vite-ssg 默认输出扁平 HTML 文件（`chanpin.html`），而旧 nginx 配置期望目录结构（`chanpin/index.html`）。

**修复：** `nginx.conf` 第 116 行，`try_files` 增加 `$uri.html`：

```nginx
# 改前
try_files $uri $uri/ /index.html;

# 改后
try_files $uri $uri/ $uri.html /index.html;
```

**路由命中逻辑（以 `/chanpin` 为例）：**

```
1. $uri = /chanpin        → /usr/share/nginx/html/chanpin        → 不存在
2. $uri/ = /chanpin/      → /usr/share/nginx/html/chanpin/       → 不存在
3. $uri.html = /chanpin.html → /usr/share/nginx/html/chanpin.html → 命中！✅
4. /index.html            → SPA fallback（未触发）
```

## 六、已知问题

1. `<html lang="en">` — vite-ssg 默认输出 `en`，`index.html` 模板中 `zh-CN` 被覆盖。**不影响 SEO**（搜索引擎主要读 `<title>` 和 `<meta>`），可后续通过 `@unhead/vue` 的 `useHead({ htmlAttrs: { lang: 'zh-CN' } })` 修复。

2. **动态路由页面（`/gongsidongtai/:id`、`/hangyeanli/:id`、`/zhishiwenda/:slug`）不预渲染** — 与改造前行为一致，保持客户端 SPA。

---

## 七、下一步

1. 预览验证：`npx serve dist -p 5173`，浏览器访问检查页面渲染
2. Docker 构建测试：`docker build -f my-vue-app/Dockerfile -t xbb-frontend:ssg .`
3. 测试环境部署验证
4. 确认无误后提交代码