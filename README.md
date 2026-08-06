# 销帮帮 CRM 官网

基于 Vue 3 + NestJS 的全栈企业官网项目，包含面向访客的**客户端前台**、面向管理员的**CMS 管理后台**以及 **REST API 后端服务**。

## 技术架构

```
┌─────────────────────────────────────────────────┐
│                    Nginx (反代)                   │
├──────────────────────┬──────────────────────────┤
│   my-vue-app (前端)   │   my-nest-app (后端)      │
│   Vue 3 + Vite        │   NestJS 10 + TypeORM     │
│   Tailwind CSS v4      │   MySQL 8                 │
│   Pinia + Vue Router   │   JWT + Passport          │
│   端口: 5173           │   端口: 3000              │
└──────────────────────┴──────────────────────────┘
```

| 子项目 | 技术栈 | 说明 |
|--------|--------|------|
| [`my-vue-app/`](./my-vue-app/) | Vue 3 + TypeScript + Vite + Tailwind v4 | 客户端前台 + CMS 管理后台 |
| [`my-nest-app/`](./my-nest-app/) | NestJS 10 + TypeORM + MySQL 8 | REST API 后端服务 |

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- pnpm `>=10`
- MySQL 8（后端需要）

### 一键启动

```bash
# 安装所有依赖
pnpm install

# 同时启动前后端开发服务器
pnpm dev
```

### 分别启动

```bash
# 后端（默认 http://localhost:3000）
cd my-nest-app
pnpm install
pnpm start:dev

# 前端（默认 http://localhost:5173）
cd my-vue-app
pnpm install
pnpm dev
```

### 访问地址

| 地址 | 说明 |
|------|------|
| `http://localhost:5173/` | 客户端前台（首页） |
| `http://localhost:5173/ui-kit` | UI Kit 组件展示 |
| `http://localhost:5173/login` | 管理后台登录 |
| `http://localhost:3000/` | 后端 API 服务 |

## 项目结构

```
xbb-website/
├── my-nest-app/                # 后端服务
│   ├── src/
│   │   ├── common/             # 全局工具（过滤器、拦截器、管道）
│   │   ├── database/           # 数据库配置与迁移
│   │   └── modules/            # 业务模块（12 个）
│   ├── test/                   # 测试文件
│   └── README.md
├── my-vue-app/                 # 前端应用
│   ├── src/
│   │   ├── client/             # 客户端前台
│   │   ├── admin/              # 管理后台
│   │   └── shared/             # 前后台共享（API、工具函数）
│   ├── docs/                   # 前端文档
│   ├── cypress/                # E2E 测试
│   └── README.md
├── pnpm-workspace.yaml         # Monorepo 配置
└── README.md                   # 本文件
```

## 后端模块

| 模块 | 说明 |
|------|------|
| `auth` | 管理员登录、JWT 鉴权、权限管理 |
| `article` | 文章 CRUD（新闻动态） |
| `category` | 文章分类管理 |
| `ads` | 广告位管理 |
| `gallery` | 图库管理（多图库支持） |
| `template` | Handlebars 页面模板管理 |
| `message` | 留言/试用申请管理 |
| `settings` | 网站全局配置 |
| `case` | 客户案例管理 |
| `partner` | 渠道合作伙伴 |
| `sms` | 短信验证码服务 |
| `upload` | 文件上传（sharp 压缩） |

## 文档索引

| 文档 | 位置 | 内容 |
|------|------|------|
| 前端开发规范 | [`my-vue-app/CLAUDE.md`](./my-vue-app/CLAUDE.md) | 组件开发、流程命令、核心铁律 |
| 设计规范 | [`my-vue-app/DESIGN.md`](./my-vue-app/DESIGN.md) | 设计令牌、排版、布局、响应式 |
| UI Kit 规范 | [`my-vue-app/docs/UI_KIT_SPEC.md`](./my-vue-app/docs/UI_KIT_SPEC.md) | 组件分层、通用约束、禁止事项 |
| 导航路由映射 | [`my-vue-app/docs/NAVIGATION_ROUTES.md`](./my-vue-app/docs/NAVIGATION_ROUTES.md) | 导航菜单与页面路由对应关系 |
| 图片资源清单 | [`my-vue-app/docs/IMAGE_INVENTORY.md`](./my-vue-app/docs/IMAGE_INVENTORY.md) | 全站图片资源状态追踪 |
| 后端开发规范 | [`my-nest-app/CLAUDE.md`](./my-nest-app/CLAUDE.md) | 模块开发、API 规范、数据库 |
| 后端 README | [`my-nest-app/README.md`](./my-nest-app/README.md) | 后端技术栈、快速开始 |

## 常用命令

```bash
# 安装所有子项目依赖
pnpm install

# 启动所有开发服务器
pnpm dev

# 构建所有子项目
pnpm build

# 运行所有测试
pnpm test

# 代码检查
pnpm lint
```

## CI/CD 部署

部署流水线由 [GitHub Actions](.github/workflows/deploy.yml) 驱动：

| 分支 | 触发方式 | 行为 |
|------|---------|------|
| `develop` | 自动 | 构建镜像 → 推送 ghcr.io → 部署测试环境 |
| `main` | 手动 | 构建镜像 → 推送 ghcr.io → 部署生产环境 |

**镜像仓库**：`ghcr.io/rossroma/xbb-website`

**测试环境手动部署**（无需 self-hosted runner）：
```bash
docker pull ghcr.io/rossroma/xbb-website/xbb-backend:latest
docker pull ghcr.io/rossroma/xbb-website/xbb-frontend:latest
bash deploy.test.sh
```