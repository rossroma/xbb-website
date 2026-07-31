# my-vue-app — 官网前端（CMS 管理后台 + 客户端前台）

基于 Vue 3 + TypeScript 构建的官网前端项目，包含面向访客的**客户端前台**和面向管理员的**后台管理系统**。

## 技术栈

| 分类         | 技术                                                     |
| ------------ | -------------------------------------------------------- |
| 框架         | Vue 3 + TypeScript（Composition API + `<script setup>`） |
| 构建工具     | Vite                                                     |
| UI 组件库    | Element Plus（仅后台使用）+ 自研 UI Kit（前台）          |
| 样式方案     | Tailwind CSS v4（`@theme` 设计令牌）                     |
| 图标         | @icon-park/vue-next（字节跳动 IconPark，按需导入）       |
| 状态管理     | Pinia                                                    |
| 路由         | Vue Router                                               |
| HTTP 客户端  | Axios                                                    |
| 富文本编辑器 | WangEditor 5                                             |
| 代码编辑器   | CodeMirror 6                                             |
| 安全过滤     | DOMPurify（仅后台使用）                                  |
| 包管理器     | pnpm                                                     |
| 单元测试     | Vitest                                                   |
| E2E 测试     | Cypress                                                  |

## 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 后端服务 `my-nest-app` 已启动（默认端口 3000）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:5173）
pnpm dev
```

访问地址：

- **客户端前台（首页）**：`http://localhost:5173/`
- **UI Kit 展示页**：`http://localhost:5173/ui-kit`
- **管理后台登录**：`http://localhost:5173/login`

## 构建与预览

```bash
# 类型检查 + 生产构建
pnpm build

# 预览生产包
pnpm preview
```

## 目录结构

```
src/
├── client/                     # 客户端前台
│   ├── App.vue                 # 前台根组件
│   ├── router.ts               # 前台路由
│   ├── components/             # 前台组件
│   │   ├── ui/                 # UI Kit 组件（Button, Card, Badge, Skeleton, FormInput, …）
│   │   ├── business/           # 业务组件（HeroBanner, FinalCTA, FeatureCardGrid, …）
│   │   ├── layout/             # 布局组件（SiteHeader, SiteFooter, FloatingToolbar, StickyFormBar）
│   ├── views/                  # 前台页面
│   │   ├── Home.vue            # 首页（/）
│   │   ├── ClientLayout.vue    # 前台布局壳
│   │   ├── NotFound.vue        # 404 页面
│   │   ├── ui-kit/             # UI Kit 展示页（多页面 + 注册表驱动）
│   │   ├── customer/           # 客户管理页面
│   │   └── contact/            # 联系表单
│   ├── data/                   # 页面数据（homeData.ts, siteNavData.ts, routePaths.ts 等）
│   └── styles/                 # 前台样式
│       ├── tailwind.css        # Tailwind v4 设计令牌
│       └── global.css          # 全局样式
├── admin/                      # 管理后台
│   ├── AdminApp.vue            # 后台根组件
│   ├── router.ts               # 后台路由
│   ├── views/                  # 后台页面（login, dashboard, article, category, …）
│   ├── layout/                 # 后台布局（侧边栏、Header）
│   ├── stores/                 # Pinia Store（auth.ts）
│   └── styles/                 # 后台样式
├── shared/                     # 前后台共享
│   └── api/                    # Axios 接口封装（request.ts + 业务模块）
└── utils/                      # 共享工具函数
index.html / admin.html         # 双入口 HTML
```

## 路由结构

### 客户端前台（公开访问）

- `/` — 首页
- `/ui-kit` — UI Kit 组件展示
- `/message` — 联系表单
- 其他路由待重构后重新注册

### 管理后台（需登录）

- `/login` — 登录页
- `/admin/dashboard` — 仪表盘
- `/admin/article/list` — 文章管理
- `/admin/category/list` — 分类管理
- `/admin/ads` — 广告位管理
- `/admin/gallery` — 图库管理
- `/admin/template` — 模板管理
- `/admin/message` — 留言管理
- `/admin/settings` — 网站设置
- `/admin/logs` — 操作日志

## 测试

```bash
# 单元测试
pnpm test:unit

# E2E 测试（Cypress，需先构建）
pnpm test:e2e

# E2E 测试（Cypress，开发模式，可视化）
pnpm test:e2e:dev
```

## 代码规范

```bash
# ESLint + oxlint 检查并修复
pnpm lint

# Prettier 格式化
pnpm format

# TypeScript 类型检查
pnpm type-check
```

## 开发规范

- 使用 TypeScript + Vue 3 Composition API (`<script setup>`)
- 组件文件命名使用 `PascalCase`，页面视图按功能分目录
- API 调用统一放在 `src/shared/api/` 目录下，通过 `request.ts` 的 axios 实例发起
- 状态管理使用 Pinia，Store 放在 `src/admin/stores/`
- 新组件禁止 `<style scoped>`，全部使用 Tailwind 工具类
- 设计令牌优先：颜色、间距、圆角、阴影使用 `@theme` 令牌
- 图标统一使用 `@icon-park/vue-next`（按需导入）
- 详细规范见 `CLAUDE.md` 和 `.claude/memory/` 目录
