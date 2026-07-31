---
name: architecture
description: 前端项目架构视图 — 分层结构、核心模块、组件体系、数据流、关键设计决策
metadata:
  type: project
  updated: 2026-07-28
---

# 前端架构

## 技术栈

- **框架**: Vue 3 + TypeScript（Composition API + `<script setup>`）
- **构建**: Vite 7
- **UI 组件库**: Element Plus（仅后台使用）+ 自研 UI Kit（前台）
- **样式方案**: Tailwind CSS v4（`@theme` 令牌 + 工具类）
- **状态管理**: Pinia（仅后台 auth store）
- **路由**: Vue Router 5（History 模式）
- **HTTP 客户端**: Axios（`src/shared/api/request.ts`）
- **富文本编辑**: WangEditor 5（后台）
- **代码编辑器**: CodeMirror 6（后台）
- **安全过滤**: DOMPurify（仅后台文章内容预览使用）
- **图标**: @icon-park/vue-next（字节跳动 IconPark，按需导入）
- **测试**: Vitest（单元）+ Cypress（E2E）
- **代码规范**: ESLint + oxlint + Prettier

## 双入口架构

```
index.html → src/main.ts → src/App.vue → 客户端前台
admin.html → src/admin.ts → src/AdminApp.vue → 管理后台
```

## 分层架构

```
┌─────────────────────────────────────────────────┐
│  Page Layer (views/)                             │
│  Home.vue, ui-kit/*, CustomerManagement.vue      │
│  组装 Business + Layout 组件，管理页面级状态      │
├─────────────────────────────────────────────────┤
│  Business Layer (components/business/)            │
│  HeroBanner, CTASection, IconCardGrid, …         │
│  业务场景组件，可组合 UI Kit 组件                 │
├─────────────────────────────────────────────────┤
│  Layout Layer (components/layout/)                │
│  SiteHeader, SiteFooter, FloatingToolbar, …      │
│  全局布局组件，跨页面复用                         │
├─────────────────────────────────────────────────┤
│  UI Kit Layer (components/ui/)                    │
│  Button, Card, Badge, Skeleton, FormInput, …     │
│  通用 UI 原子组件，无业务逻辑                     │
├─────────────────────────────────────────────────┤
│  Shared Layer (shared/)                           │
│  Axios 实例、API 模块、工具函数                   │
└─────────────────────────────────────────────────┘
```

## 目录结构

```
src/
├── client/                     # 客户端前台
│   ├── App.vue
│   ├── router.ts
│   ├── components/
│   │   ├── ui/                 # UI Kit 组件（21 个）
│   │   │   ├── Badge.vue       # 徽章（5 color variants）
│   │   │   ├── Button.vue      # 多态按钮（8 variants, 4 sizes, 2 color schemes）
│   │   │   ├── Card.vue        # 卡片（3 variants: default/warm/image）
│   │   │   ├── CardGrid.vue    # CSS Grid 响应式布局
│   │   │   ├── Carousel.vue    # 轮播组件
│   │   │   ├── EmptyState.vue  # 空状态（Inbox 图标）
│   │   │   ├── ErrorState.vue  # 错误状态（Caution 图标 + 重试按钮）
│   │   │   ├── Form.vue        # 表单容器
│   │   │   ├── FormCheckbox.vue
│   │   │   ├── FormInput.vue   # 输入框
│   │   │   ├── FormItem.vue    # 表单项包装
│   │   │   ├── FormRadio.vue
│   │   │   ├── FormSelect.vue  # 下拉选择
│   │   │   ├── FormSwitch.vue  # 开关
│   │   │   ├── IconBadge.vue   # 圆形图标徽章
│   │   │   ├── MediaCard.vue   # 媒体卡片
│   │   │   ├── MetricItem.vue  # 渐变数值展示
│   │   │   ├── SectionBlock.vue# 间距/宽度约束容器
│   │   │   ├── SectionHeading.vue # 章节标题（kicker + 标题 + 副标题）
│   │   │   └── Skeleton.vue    # 骨架屏（3 types: text/card/image）
│   │   ├── business/           # Business 组件（19 个）
│   │   │   ├── CTASection.vue         # 行动号召
│   │   │   ├── ContentCardGrid.vue    # 图文卡片网格
│   │   │   ├── ContentList.vue        # 内容列表
│   │   │   ├── FeatureImageCard.vue   # 特色图片卡片
│   │   │   ├── FeatureList.vue        # 功能列表
│   │   │   ├── FlowSteps.vue          # 流程步骤
│   │   │   ├── GradientCardGrid.vue   # 渐变卡片网格
│   │   │   ├── GradientHero.vue       # 渐变 Hero
│   │   │   ├── HeroBanner.vue         # 主 Hero 横幅
│   │   │   ├── IconCardGrid.vue       # 图标卡片网格
│   │   │   ├── IndustryCarousel.vue   # 行业案例轮播
│   │   │   ├── MetricsPanel.vue       # 数据指标面板
│   │   │   ├── PartnerGrid.vue        # 合作伙伴网格
│   │   │   ├── PlatformDownload.vue   # 平台下载
│   │   │   ├── ProcessSteps.vue       # 流程步骤卡片
│   │   │   ├── PromoBanner.vue        # 推广横幅
│   │   │   ├── SplitCardLayout.vue    # 非对称卡片布局
│   │   │   ├── SplitSection.vue       # 图文分栏
│   │   │   └── TabShowcase.vue        # Tab 展示
│   │   ├── layout/             # Layout 组件（4 个）
│   │   │   ├── SiteHeader.vue       # 全局导航（mega menu + 移动端抽屉）
│   │   │   ├── SiteFooter.vue       # 全局页脚（6 列网格 + 渐变背景）
│   │   │   ├── FloatingToolbar.vue  # 右侧悬浮工具栏（hover 展开）
│   │   │   └── StickyFormBar.vue    # 底部试用表单栏
│   ├── views/
│   │   ├── Home.vue            # 首页（/，纯组件组装）
│   │   ├── ClientLayout.vue    # 前台布局壳
│   │   ├── NotFound.vue        # 404 页面
│   │   ├── ui-kit/             # UI Kit 展示页（多页面 + 注册表驱动）
│   │   │   ├── registry.ts     # 组件注册表（唯一数据源）
│   │   │   ├── UiKitLayout.vue # 公共 Sidebar 壳
│   │   │   ├── FoundationsPage.vue  # 基础规范
│   │   │   ├── ComponentsPage.vue   # 基础组件
│   │   │   ├── BusinessPage.vue     # Business 组件
│   │   │   ├── LayoutPage.vue       # Layout 组件
│   │   │   ├── CompositePage.vue    # 组合组件
│   │   │   └── components/    # PlaygroundShell、CodeSnippet
│   │   ├── customer/           # 客户管理页面
│   │   │   ├── CustomerManagement.vue
│   │   │   └── customerManagementData.ts   # 页面专属数据
│   │   ├── sales/               # 销售管理页面
│   │   │   ├── SalesManagement.vue
│   │   │   └── salesManagementData.ts      # 页面专属数据
│   │   └── contact/            # 联系表单（留言）
│   ├── data/
│   │   ├── homeData.ts         # 首页数据（Banner、卡片、指标等）
│   │   ├── routePaths.ts       # 路由 path ↔ pageKey 映射表
│   │   ├── siteConfigData.ts   # 站点配置数据
│   │   ├── siteFooterData.ts   # 页脚导航数据
│   │   └── siteNavData.ts      # 顶部导航数据
│   │   # 注：页面专属数据文件（如 customerManagementData.ts）就近放置
│   │   #     在对应 views/ 子目录下，跨页面共享数据保留在 data/
│   └── styles/
│       ├── tailwind.css        # Tailwind v4 @theme 令牌 + 渐变工具类
│       └── global.css          # 全局样式
├── admin/                      # 管理后台
│   ├── AdminApp.vue
│   ├── router.ts
│   ├── views/                  # 后台页面（login, dashboard, article, category, …）
│   ├── layout/                 # 后台布局
│   ├── stores/                 # Pinia Store（auth.ts）
│   └── styles/
├── shared/                     # 前后台共享
│   └── api/                    # 12 个 API 模块 + request.ts 实例
└── utils/                      # 共享工具函数
index.html / admin.html         # 双入口
```

## 设计系统

- **品牌色**: `#ff6400`（橙）
- **设计令牌**: Tailwind v4 `@theme` 块（`src/client/styles/tailwind.css`），包含品牌色、表面色、文字色、边框色、状态色、渐变、间距、圆角、字号、阴影、断点
- **设计文档**: `DESIGN.md` — 完整视觉模式库
- **组件规范**: `docs/UI_KIT_SPEC.md` — 组件通用约束与开发规范

## 组件架构

### 组件数据流

```
Props (数据入口)
  ↓
<script setup lang="ts">
  defineProps<T>()        ← 类型安全的 Props
  defineEmits<T>()        ← 类型安全的事件
  ↓
<template>
  Tailwind 工具类          ← 样式
  ARIA 属性               ← 无障碍
  motion-reduce           ← 动效关怀
  ↓
Emits (事件出口)
```

### 组件设计原则

1. **单一职责**：每个组件只做一件事
2. **Props 驱动**：数据通过 Props 传入，不硬编码
3. **无样式块**：禁止 `<style scoped>`，全部使用 Tailwind 工具类
4. **类型安全**：Props/Emits 使用 TypeScript 接口声明
5. **无障碍优先**：所有交互元素有 ARIA 属性
6. **动效关怀**：尊重 `prefers-reduced-motion`

## 路由结构

```
/ (ClientLayout)
├── /                         → Home.vue（首页）
├── /message                  → MessageForm.vue（联系表单）
├── /kehuguanli               → CustomerManagement.vue（客户管理）
└── /:pathMatch(.*)*          → NotFound.vue（404 兜底）

/ui-kit (UiKitLayout)
├── /ui-kit                   → redirect → /ui-kit/foundations
├── /ui-kit/foundations       → FoundationsPage.vue
├── /ui-kit/components        → ComponentsPage.vue
├── /ui-kit/business          → BusinessPage.vue
├── /ui-kit/layout            → LayoutPage.vue
└── /ui-kit/composite         → CompositePage.vue
```

## 架构决策：前端与后端模板解耦

**决策日期**: 2026-07-23

**背景**: 旧架构中，前端通过 `ClientDynamicPage.vue` 调用 `/v1/client/pages/render` 接口，后端返回 Handlebars 模板字符串 + 数据，前端在浏览器端编译并渲染到 iframe 中。这种模式下：

- 后端通过 `Category.template_list` / `template_view` 决定使用哪个模板
- 后端在 `renderClientPage()` 中硬编码数据形状
- 前端完全被动，无法自主控制渲染逻辑

**决策**: 前端不再使用后端模板渲染。所有页面由前端 Vue 组件自行决定调用哪个纯数据 API（如 `/v1/client/articles`），后端只返回 JSON 数据。

**影响**:

- `ClientDynamicPage.vue` 已删除
- `src/shared/api/client-page.ts` 已删除
- `handlebars` 依赖已移除
- 旧有 CMS 动态路由已从路由表中移除，待新页面组件创建后重新注册
- `src/client/data/routePaths.ts` 保留作为路径映射工具（供 SiteHeader/SiteFooter/Home 导航使用）
- 后台模板管理（`TemplateManagement.vue`）仍保留，但仅用于 CMS 后台管理，不再影响前端渲染

## 迁移状态

- **Phase 1**: ✅ Tailwind CSS v4 初始化
- **Phase 2**: ✅ UI Kit 组件 + UiKit 展示页（多页面 + 注册表驱动）
- **Phase 3A**: ✅ DESIGN.md 扩展 + tailwind.css 令牌
- **Phase 3B**: ✅ 业务/布局组件（纯 Tailwind）
- **Phase 3C**: ✅ 新首页 Home.vue（/），旧首页已下线
- **Phase 3D**: ✅ 前端与后端模板解耦 — 删除 ClientDynamicPage.vue、client-page.ts、handlebars 依赖
- **Phase 4**: 🔜 重构子页面（案例、新闻、服务、关于等），提取 ListPage 通用列表组件
- **Phase 5**: 🔜 全面清理 Element Plus 依赖，统一组件体系
