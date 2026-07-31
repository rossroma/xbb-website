# CLAUDE.md

## 项目概述

销帮帮 CRM 官网前端 — 基于 Vue 3 + TypeScript 构建，包含面向访客的**客户端前台**和面向管理员的**CMS 管理后台**。

- **框架**: Vue 3 + TypeScript（Composition API + `<script setup>`）+ Vite + Pinia
- **样式方案**: Tailwind CSS v4 + 设计令牌（`src/client/styles/tailwind.css`）
- **UI 组件库**: Element Plus（仅后台使用，逐步迁移中）+ 自研 UI Kit（前台）
- **图标**: @icon-park/vue-next（字节跳动 IconPark，按需导入）
- **测试**: Vitest（单元）+ Cypress（E2E）
- **包管理器**: pnpm
- **后端依赖**: NestJS REST API（`http://localhost:3000`）— 纯数据 JSON API

## 目录结构

```
src/
├── client/                     # 客户端前台
│   ├── App.vue                 # 前台根组件
│   ├── router.ts               # 前台路由
│   ├── components/
│   │   ├── ui/                 # UI Kit 组件
│   │   ├── business/           # 业务组件
│   │   └── layout/             # 布局组件
│   ├── views/                  # 前台页面
│   │   ├── Home.vue            # 首页
│   │   ├── ClientLayout.vue    # 前台布局壳
│   │   ├── NotFound.vue        # 404 页面
│   │   ├── ui-kit/             # UI Kit 展示（多页面 + 注册表驱动）
│   │   ├── customer/           # 客户管理（含页面专属数据）
│   │   ├── sales/              # 销售管理（含页面专属数据）
│   │   └── contact/            # 联系表单
│   ├── data/                   # 跨页面共享数据（页面专属数据就近放在 views/<page>/ 下）
│   └── styles/
│       ├── tailwind.css        # Tailwind v4 设计令牌
│       └── global.css          # 全局样式
├── admin/                      # 管理后台
├── shared/                     # 前后台共享
│   └── api/                    # Axios 接口封装
└── utils/                      # 共享工具函数
index.html / admin.html         # 双入口
```

完整架构见 `.claude/memory/architecture.md`。

## 核心规则

- **中文输出**：所有对话、代码注释、文档内容均使用中文。
- **优先复用**：实现新功能前，先检查现有组件、工具函数、API 接口是否已有类似实现。
- **设计令牌优先**：禁止硬编码颜色、间距、圆角、阴影值，必须使用 `tailwind.css` 中定义的 `@theme` 令牌。详见 `DESIGN.md`。
- **Tailwind 优先**：新组件禁止 `<style scoped>`，一律使用 Tailwind 工具类。
- **TypeScript 严格模式**：所有新组件使用 `<script setup lang="ts">`，Props/Emits 使用 `defineProps<T>()` / `defineEmits<T>()`。
- **令牌新增需审批**：新增设计令牌必须经用户确认。流程：提案 → 审批 → 同步更新 `tailwind.css` + `DESIGN.md`。
- **文档同步检查**：每次代码改动结束前，检查相关文档是否需要同步更新。

## 组件开发

组件分层、文件结构、通用约束详见 `docs/UI_KIT_SPEC.md`。组件注册表见 `src/client/views/ui-kit/registry.ts`。

## 流程规范

所有开发任务遵循标准化流程，**根据任务类型自动调用对应 Skill**。核心铁律见 `.claude/memory/rules.md`。

### 核心原则

**先组件，后页面 — 严格顺序，不可颠倒。** `/component` 负责组件精细打磨，`/page` 负责将已有组件组装为页面。组件未完成，页面不开始。

### 自动触发规则

| 用户输入特征  | 自动调用     | 关键词                   |
| ------------- | ------------ | ------------------------ |
| 新增/创建组件 | `/component` | 组件、创建组件、封装一个 |
| 新增/创建页面 | `/page`      | 页面、新增页面、创建页面 |
| Bug/功能异常  | `/fix`       | bug、报错、异常、不工作  |
| 代码审查      | `/review`    | 审查、review、检查代码   |
| 发布上线      | `/release`   | 发布、发版、上线、部署   |

### 流程命令

| 命令         | 流程                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/component` | 参考图门禁 → 需求澄清 → 层级判定 → 设计参考 → 规格设计 → 用户确认 → 实施编码 → UiKit 注册 → 测试验证 → 可视化验证 → 文档同步              |
| `/page`      | 页面参考图 → 板块→组件映射 → 组件存在性验证 → 路由设计 → 数据绑定+SEO → 用户确认 → 页面编排 → 路由注册 → 测试验证 → 可视化验证 → 文档同步 |
| `/fix`       | 复现确认 → 根因分析 → 修复方案 → 实施修复 → 回归验证 → 修复报告                                                                           |
| `/review`    | 变更扫描 → 正确性 → 架构 → 复用 → 规范 → SEO → 文档一致性 → 审查报告                                                                      |
| `/release`   | 工作区检查 → 门禁检查 → 代码审查 → 变更日志 → 构建验证 → Go/No-Go                                                                         |

## 常用命令

```bash
pnpm dev                  # 开发服务器（localhost:5173）
pnpm build                # 类型检查 + 生产构建
pnpm test:unit            # Vitest 单元测试
pnpm test:e2e             # Cypress E2E 测试
pnpm lint                 # ESLint + oxlint 检查
pnpm format               # Prettier 格式化
pnpm type-check           # TypeScript 类型检查
pnpm check-docs           # 文档一致性检查
```

## 自动化验证

- **CI 流水线**：`.github/workflows/ci.yml` — push/PR 自动运行类型检查、lint、文档一致性、单元测试、构建
- **Pre-commit**：Husky + lint-staged 自动执行 ESLint 修复 + Prettier 格式化

## 访问地址

- 客户端前台：`http://localhost:5173/`
- UI Kit 展示：`http://localhost:5173/ui-kit`
- 管理后台：`http://localhost:5173/login`

## 参考文档

| 文档                             | 内容                                   |
| -------------------------------- | -------------------------------------- |
| `.claude/memory/architecture.md` | 架构详情、组件清单、路由结构、迁移状态 |
| `.claude/memory/rules.md`        | 核心铁律（硬约束）                     |
| `.claude/memory/seo.md`          | SEO/GEO 技术规范                       |
| `DESIGN.md`                      | 设计令牌、排版、布局、响应式规范       |
| `docs/UI_KIT_SPEC.md`            | 组件开发通用约束                       |
| `docs/NAVIGATION_ROUTES.md`      | 导航菜单与路由映射                     |
| `src/client/styles/tailwind.css` | Tailwind v4 设计令牌定义               |
