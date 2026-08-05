# 部署方案设计：双环境自动化部署（测试 + 生产）

## Context

当前项目是 pnpm monorepo（NestJS 后端 + Vue 前端），代码托管在**内网 GitLab**，需要实现：

- **`dev` 分支** → 自动部署到公网测试服务器（Docker MySQL + SSH 管道传输镜像）
- **`main` 分支** → 手动触发部署到公网生产服务器（阿里云 RDS + ACR 镜像分发）

核心约束与已知信息：
- 外部服务器已有 Docker + Docker Compose
- 内网 GitLab 已有可用的 GitLab Runner
- 内网 GitLab Runner 可出站访问公网（ACR、SSH），但**公网无法反向访问内网 GitLab**
- 生产环境使用阿里云 RDS（MySQL），测试环境使用 Docker MySQL 容器
- 生产环境使用阿里云 ACR 分发镜像，测试环境通过 SSH 管道直接传输镜像（不走任何 Registry）

## 整体架构

### 测试环境（dev 分支 → 自动触发）

```
内网 GitLab Runner                              测试服务器（公网）
┌──────────────────────┐    SSH 管道传输镜像     ┌──────────────────────────┐
│ 1. docker build      │ ────────────────────→  │ docker compose up -d      │
│ 2. docker save | gzip│                        │  backend:3000             │
│ 3. scp tar.gz        │                        │  frontend:80              │
│ 4. SSH 远程执行部署   │                        │  mysql:3306 ← Docker 容器  │
└──────────────────────┘                        └──────────────────────────┘
```

### 生产环境（main 分支 → 手动触发）

```
内网 GitLab Runner        阿里云 ACR           外部生产服务器（公网）
┌──────────────────┐ push ┌──────────────┐ pull ┌──────────────────┐
│ build-backend    │ ────→│ xbb-backend  │ ←─── │ docker compose   │
│ build-frontend   │ ────→│ xbb-frontend │ ←─── │  backend:3000    │
│ (Docker Build)   │      │              │      │  frontend:80     │
└────────┬─────────┘      └──────────────┘      │  MySQL → 阿里云RDS│
         │                                      └──────────────────┘
         │            SSH: scp compose + deploy.sh
         └─────────────────────────────────────────→
```

**关键设计决策**：内网 GitLab Runner 构建镜像后推送到阿里云 ACR（公网可达），外部服务器从 ACR 拉取镜像。外部服务器永远不需要访问内网 GitLab。

## 新增文件清单

| 文件 | 用途 |
|------|------|
| `.gitlab-ci.yml` | GitLab CI/CD 流水线定义（根目录） |
| `my-nest-app/Dockerfile` | 后端多阶段构建（含 tini + 非 root 用户） |
| `my-nest-app/.dockerignore` | 后端构建忽略文件 |
| `my-vue-app/Dockerfile` | 前端多阶段构建（含 nginx） |
| `my-vue-app/nginx.conf` | nginx 配置：双 SPA 路由 + API 反向代理 + gzip + 安全头 |
| `my-vue-app/.dockerignore` | 前端构建忽略文件 |
| `docker-compose.yml` | 生产环境服务编排（无 MySQL，使用阿里云 RDS） |
| `docker-compose.test.yml` | 测试环境服务编排（含 MySQL 容器） |
| `deploy.sh` | 生产环境部署脚本（ACR 拉取镜像、滚动重启、验证） |
| `deploy.test.sh` | 测试环境部署脚本（加载本地镜像、启动 MySQL、验证） |

**已修改的代码**：在 `my-nest-app/src/app.controller.ts` 中新增了 `/v1/health` 健康检查端点。

## 详细设计

### 1. `.gitlab-ci.yml`（根目录）

四个阶段：`build` → `deploy-test` | `deploy-prod`

| Job | 触发分支 | 说明 |
|-----|----------|------|
| `build-backend` | `main` | 构建后端镜像 → 推送 ACR |
| `build-frontend` | `main` | 构建前端镜像 → 推送 ACR |
| `build-test` | `dev` | 构建前后端镜像 → `docker save \| gzip` → 上传为 artifact |
| `deploy-test` | `dev` | 下载 artifact → `scp` 上传到测试服务器 → SSH 远程执行 `deploy.test.sh` |
| `deploy-prod` | `main` | 手动触发 → `scp` 上传 compose 文件 → SSH 远程执行 `deploy.sh` |

- `deploy-test` 为自动触发，代码 push 到 `dev` 分支即自动部署
- `deploy-prod` 默认 `when: manual`（手动触发，首次验证后可改为自动）

### 2. 后端 Dockerfile（`my-nest-app/Dockerfile`）

多阶段构建：
- **Stage 1 (builder)**：`node:22-alpine`，安装 `python3 make g++`（bcrypt 需要），安装 pnpm，复制 workspace 根文件 + 后端源码，`pnpm install --filter` + `nest build`
- **Stage 2 (production)**：`node:22-alpine`，安装 `tini`（信号处理），重新 `pnpm install --prod`，复制 `dist/`，切换到非 root 用户 `node`，暴露 3000，健康检查 `curl localhost:3000/v1/health`（图片上传至阿里云 OSS，不再需要本地 `uploads/` 目录）

### 3. 前端 Dockerfile（`my-vue-app/Dockerfile`）

多阶段构建：
- **Stage 1 (builder)**：`node:22-alpine`，安装 pnpm，复制 workspace 根文件 + 前端源码，`VITE_API_BASE_URL` 作为 `ARG` 传入，`pnpm install --filter` + `vite build`
- **Stage 2 (production)**：`nginx:1.27-alpine`，复制 `dist/` 到 `/usr/share/nginx/html`，复制自定义 `nginx.conf`，暴露 80

### 4. nginx 配置（`my-vue-app/nginx.conf`）

核心功能：
- **双 SPA 路由**：`/` → `index.html`，`/admin` → 301 重定向到 `/admin/`，`/admin/` → `try_files ... /admin.html`
- **API 反向代理**：`/v1/` → `proxy_pass http://backend:3000`（图片已迁移至 OSS，不再需要 `/uploads/` 反向代理）
- **静态资源缓存**：`/assets/` 设置 `Cache-Control: public, immutable`（Vite 打包带哈希）
- **HTML 不缓存**：`index.html` 和 `admin.html` 设置 `no-cache`，确保新版本立即生效
- **gzip 压缩** + 安全头（`X-Frame-Options`、`X-Content-Type-Options`、`X-XSS-Protection`）

### 5. docker-compose.yml（生产环境）

两个服务：
- **backend**：端口 `127.0.0.1:3000:3000`（仅本地访问），环境变量注入（`DB_HOST` 指向 RDS + OSS 配置），健康检查，资源限制 512M，日志轮转（不再需要 `uploads_data` 卷挂载）
- **frontend**：端口 `80:80`，`depends_on backend (condition: service_healthy)`，资源限制 128M

**不含 MySQL 容器** — 数据库使用阿里云 RDS。

### 6. docker-compose.test.yml（测试环境）

三个服务：
- **mysql**：`mysql:8.0` 镜像，端口 `127.0.0.1:3306:3306`，挂载命名卷 `mysql_data`，`character-set-server=utf8mb4`，健康检查
- **backend**：`depends_on mysql (condition: service_healthy)`，`DB_HOST=mysql`（指向 Docker 容器名），其余同生产
- **frontend**：同生产

### 7. deploy.sh（生产环境）

远程执行流程：
1. 登录 ACR（`docker login`）
2. 拉取最新镜像（`docker pull`）
3. `docker compose down` 优雅停止
4. `docker compose up -d --wait` 启动并等待健康检查
5. 验证后端和前端是否正常响应
6. 清理旧镜像

### 8. deploy.test.sh（测试环境）

远程执行流程：
1. 加载传入的镜像 tar（`docker load`）
2. `docker compose -f docker-compose.test.yml down` 优雅停止
3. `docker compose -f docker-compose.test.yml up -d --wait` 启动
4. 验证 MySQL、后端、前端是否正常响应
5. 清理旧镜像

## 需要配置的 GitLab CI/CD Variables

在 GitLab 项目 `Settings → CI/CD → Variables` 中配置：

### 公共变量

| 变量名 | 说明 | 类型 |
|--------|------|------|
| `VITE_API_BASE_URL` | 生产环境前端 API 地址（留空，由 nginx 反向代理） | Variable |

### 生产环境变量

| 变量名 | 说明 | 类型 |
|--------|------|------|
| `ACR_REGISTRY` | 阿里云 ACR 地址（如 `registry.cn-shenzhen.aliyuncs.com`） | Variable |
| `ACR_NAMESPACE` | ACR 命名空间（如 `xbb-fe`） | Variable |
| `ACR_USERNAME` | ACR 用户名 | Variable |
| `ACR_PASSWORD` | ACR 密码 | Masked |
| `SSH_PRIVATE_KEY` | 生产服务器 SSH 私钥 | Masked |
| `SSH_KNOWN_HOSTS` | 生产服务器 SSH known_hosts（`ssh-keyscan` 输出） | File |
| `DEPLOY_HOST` | 生产服务器 IP/域名 | Variable |
| `DEPLOY_PORT` | SSH 端口（默认 22） | Variable |
| `DEPLOY_USER` | SSH 用户名 | Variable |
| `DEPLOY_PATH` | 部署目录（如 `/opt/xbb-website`） | Variable |
| `DB_HOST` | 阿里云 RDS MySQL 地址 | Variable |
| `DB_PORT` | MySQL 端口（默认 3306） | Variable |
| `DB_USERNAME` | 数据库用户名 | Variable |
| `DB_PASSWORD` | 数据库密码 | Masked |
| `DB_DATABASE` | 数据库名 | Variable |
| `JWT_SECRET` | JWT 签名密钥 | Masked |
| `JWT_EXPIRES_IN` | JWT 过期时间（如 `7d`） | Variable |

### 测试环境变量

| 变量名 | 说明 | 类型 |
|--------|------|------|
| `TEST_SSH_PRIVATE_KEY` | 测试服务器 SSH 私钥 | Masked |
| `TEST_SSH_KNOWN_HOSTS` | 测试服务器 SSH known_hosts | File |
| `TEST_DEPLOY_HOST` | 测试服务器 IP/域名 | Variable |
| `TEST_DEPLOY_PORT` | SSH 端口（默认 22） | Variable |
| `TEST_DEPLOY_USER` | SSH 用户名 | Variable |
| `TEST_DEPLOY_PATH` | 部署目录（如 `/opt/xbb-website-test`） | Variable |
| `TEST_DB_PASSWORD` | 测试 MySQL root 密码 | Masked |
| `TEST_DB_DATABASE` | 测试数据库名 | Variable |
| `TEST_JWT_SECRET` | 测试环境 JWT 密钥 | Masked |
| `TEST_VITE_API_BASE_URL` | 测试环境前端 API 地址（如 `https://test.xbongbong.com`） | Variable |

## 外部服务器前置准备（一次性）

### 生产服务器

1. **安装 Docker**
   ```bash
   curl -fsSL https://get.docker.com | bash
   ```

2. **创建部署目录**
   ```bash
   mkdir -p /opt/xbb-website
   ```

3. **配置 SSH 密钥对**
   - 在 GitLab Runner 或本地生成：`ssh-keygen -t ed25519 -f deploy_key`
   - 公钥 `deploy_key.pub` 追加到服务器 `~/.ssh/authorized_keys`
   - 私钥内容配置到 GitLab CI/CD Variable `SSH_PRIVATE_KEY`

4. **获取 SSH known_hosts**
   ```bash
   ssh-keyscan -p <SSH_PORT> <DEPLOY_HOST>
   ```
   输出配置到 GitLab CI/CD Variable `SSH_KNOWN_HOSTS`

5. **创建阿里云 ACR 镜像仓库**
   - 创建命名空间（如 `xbb-fe`）
   - 创建仓库：`xbb-backend`、`xbb-frontend`

### 测试服务器

1. **安装 Docker**
   ```bash
   curl -fsSL https://get.docker.com | bash
   ```

2. **创建部署目录**
   ```bash
   mkdir -p /opt/xbb-website-test/images
   ```

3. **配置 SSH 密钥对**（使用独立的密钥对，与生产环境隔离）
   - 生成：`ssh-keygen -t ed25519 -f deploy_test_key`
   - 公钥追加到服务器 `~/.ssh/authorized_keys`
   - 私钥配置到 GitLab CI/CD Variable `TEST_SSH_PRIVATE_KEY`

4. **获取 SSH known_hosts**
   ```bash
   ssh-keyscan -p <SSH_PORT> <TEST_DEPLOY_HOST>
   ```
   输出配置到 GitLab CI/CD Variable `TEST_SSH_KNOWN_HOSTS`

## 部署流程

```
dev 分支 push                    main 分支 merge
     │                                │
     ▼                                ▼
┌──────────────┐              ┌──────────────────┐
│  build-test   │              │  build-backend    │──→ push ACR
│  (构建+导出)  │              │  build-frontend   │──→ push ACR
└──────┬───────┘              └────────┬─────────┘
       │                               │
       ▼                               ▼
┌──────────────┐              ┌──────────────────┐
│  deploy-test  │ 自动触发     │  deploy-prod      │ 手动触发
│  scp + SSH   │              │  scp + SSH        │
└──────────────┘              └──────────────────┘
       │                               │
       ▼                               ▼
  测试服务器                        生产服务器
  Docker MySQL                    阿里云 RDS
```

## SEO 预渲染说明

### 预渲染流程

前端构建分为两步（`vite build && node scripts/prerender.mjs`）：

1. **Vite 构建**：生成 SPA 静态资源（JS/CSS/图片）到 `dist/`
2. **Puppeteer 预渲染**：启动本地静态服务器，使用 Chromium 逐个访问 23 个静态路由，将渲染后的 HTML 写入 `dist/<route>/index.html`

### Docker 构建要求

预渲染脚本需要 Chromium，已在 Dockerfile 的 builder 阶段安装：

```dockerfile
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### 已知限制

| 项目 | 说明 |
|------|------|
| **后端 API 不可达** | Docker 构建时后端不在运行，`main.ts` 中 `siteSettingsStore.fetch()` 会超时（5 秒），预渲染页面使用 `pageSeoConfig.ts` 的静态 SEO 值，而非 CMS 配置的动态值 |
| **影响范围** | 仅 SEO 元数据（title/description/keywords）使用静态 fallback，页面内容本身正常渲染 |
| **后续优化** | 如需 CMS 驱动的 SEO，可在构建阶段启动一个后端容器，或使用构建时环境变量注入 SEO 值 |

## 环境变量管理

- **本地开发**：使用 `.env` 文件（`my-nest-app/.env`、`my-vue-app/.env`）
- **CI/CD 构建**：敏感信息通过 GitLab CI/CD Variables 传入，不落盘
- **生产服务器**：通过 `docker compose` 的 `environment` 字段注入，**不使用 `.env` 文件**
- **测试服务器**：通过 `docker compose` 的 `environment` 字段注入，**不使用 `.env` 文件**

### 为什么不使用 `.env` 文件

| 风险 | 说明 |
|------|------|
| 磁盘泄露 | `.env` 明文落盘，备份/快照/镜像都会带走 |
| 意外提交 | 再多的 `.gitignore` 也防不住人为失误 |
| 审计盲区 | 谁改了、什么时候改的，没有记录 |

## 验证方案

### 测试环境验证

1. push 代码到 `dev` 分支
2. 检查 GitLab CI/CD Pipeline → `build-test` + `deploy-test` 阶段通过
3. 服务器验证：
   ```bash
   ssh test-server
   cd /opt/xbb-website-test
   docker compose -f docker-compose.test.yml ps          # 3 个容器运行
   docker compose -f docker-compose.test.yml logs --tail 20
   curl -s http://localhost/v1/health                     # API 健康检查
   curl -s http://localhost/                               # 前端页面
   curl -s http://localhost/admin/                         # 管理后台
   ```

### 生产环境验证

1. 合并代码到 `main` 分支
2. 在 GitLab CI/CD Pipeline 中手动触发 `deploy-prod`
3. 检查 ACR 控制台是否出现新的镜像版本
4. 服务器验证：
   ```bash
   ssh prod-server
   cd /opt/xbb-website
   docker compose ps
   docker compose logs --tail 20
   curl -s http://localhost/v1/health
   curl -s http://localhost/
   curl -s http://localhost/admin/
   ```

### 端到端验证

浏览器访问测试/生产域名，确认页面正常加载、API 调用正常、管理后台功能正常。