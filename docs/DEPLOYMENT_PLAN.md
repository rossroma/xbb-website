# 部署方案设计：内网 GitLab → 外部服务器自动化部署

## Context

当前项目是 pnpm monorepo（NestJS 后端 + Vue 前端），代码托管在**内网 GitLab**，需要实现：**代码合并到 `main` 分支后，自动部署到外部服务器**。

核心约束与已知信息：
- 外部服务器已有 Docker + Docker Compose
- 内网 GitLab 已有可用的 GitLab Runner
- MySQL 使用云数据库（阿里云 RDS）
- 当前项目**没有任何部署基础设施**（无 Dockerfile、无 docker-compose、无 .gitlab-ci.yml）
- 现有 `deploy.yml` 是 GitHub Actions 模板（Python 后端），不适用于当前项目

## 整体架构

```
内网 GitLab Runner                 阿里云 ACR                    外部服务器
┌──────────────────┐    push     ┌──────────────┐    pull      ┌──────────────────┐
│ build-backend    │ ─────────→  │ xbb-backend  │ ←─────────  │ docker compose   │
│ build-frontend   │ ─────────→  │ xbb-frontend │ ←─────────  │   backend:3000   │
│ (Docker Build)   │             │              │             │   frontend:80     │
└────────┬─────────┘             └──────────────┘             └────────┬─────────┘
         │                                                             │
         │                  SSH: scp compose + deploy.sh               │
         └─────────────────────────────────────────────────────────────┘
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
| `docker-compose.yml` | 生产环境服务编排（网络、卷、健康检查、资源限制） |
| `deploy.sh` | 远程部署脚本（生成 .env、拉取镜像、滚动重启、验证） |

**需要伴随的代码改动**：在 NestJS 后端添加 `/v1/health` 健康检查端点（`src/app.controller.ts` 中新增一个方法）。

## 详细设计

### 1. `.gitlab-ci.yml`（根目录）

三个阶段：`build-backend` → `build-frontend` → `deploy`

- **build-backend / build-frontend**：使用 `docker:27-dind` 构建镜像，推送到 ACR，两个 Job 可并行
- **deploy**：SSH 到外部服务器，上传 `docker-compose.yml` 和 `deploy.sh`，远程执行部署
- 触发条件：仅 `main` 分支
- deploy 阶段默认 `when: manual`（手动触发，首次验证后可改为自动）

### 2. 后端 Dockerfile（`my-nest-app/Dockerfile`）

多阶段构建：
- **Stage 1 (builder)**：`node:22-alpine`，安装 `python3 make g++`（bcrypt 需要），安装 pnpm，复制 workspace 根文件 + 后端源码，`pnpm install --filter` + `nest build`
- **Stage 2 (production)**：`node:22-alpine`，安装 `tini`（信号处理），重新 `pnpm install --prod`，复制 `dist/`，创建 `uploads/` 目录，切换到非 root 用户 `node`，暴露 3000，健康检查 `curl localhost:3000/v1/health`

### 3. 前端 Dockerfile（`my-vue-app/Dockerfile`）

多阶段构建：
- **Stage 1 (builder)**：`node:22-alpine`，安装 pnpm，复制 workspace 根文件 + 前端源码，`VITE_API_BASE_URL` 作为 `ARG` 传入，`pnpm install --filter` + `vite build`
- **Stage 2 (production)**：`nginx:1.27-alpine`，复制 `dist/` 到 `/usr/share/nginx/html`，复制自定义 `nginx.conf`，暴露 80

### 4. nginx 配置（`my-vue-app/nginx.conf`）

核心功能：
- **双 SPA 路由**：`/` → `index.html`，`/admin` → 301 重定向到 `/admin/`，`/admin/` → `try_files ... /admin.html`
- **API 反向代理**：`/v1/` 和 `/uploads/` → `proxy_pass http://backend:3000`
- **静态资源缓存**：`/assets/` 设置 `Cache-Control: public, immutable`（Vite 打包带哈希）
- **HTML 不缓存**：`index.html` 和 `admin.html` 设置 `no-cache`，确保新版本立即生效
- **gzip 压缩** + 安全头（`X-Frame-Options`、`X-Content-Type-Options`）

### 5. docker-compose.yml（根目录）

两个服务：
- **backend**：端口 `127.0.0.1:3000:3000`（仅本地访问），`env_file: .env`，挂载命名卷 `uploads_data`，资源限制 512M，日志轮转
- **frontend**：端口 `80:80`，`depends_on backend (condition: service_healthy)`，资源限制 128M

### 6. deploy.sh（根目录）

远程执行流程：
1. 生成 `.env` 文件（从环境变量写入敏感配置）
2. 登录 ACR
3. 拉取最新镜像
4. `docker compose down` 优雅停止
5. `docker compose up -d --wait` 启动并等待健康检查
6. 验证后端和前端是否正常响应
7. 清理旧镜像

## 需要配置的 GitLab CI/CD Variables

在 GitLab 项目 `Settings → CI/CD → Variables` 中配置：

| 变量名 | 说明 | 类型 |
|--------|------|------|
| `ACR_REGISTRY` | 阿里云 ACR 地址（如 `registry.cn-shenzhen.aliyuncs.com`） | Variable |
| `ACR_NAMESPACE` | ACR 命名空间（如 `xbb-fe`） | Variable |
| `ACR_USERNAME` | ACR 用户名 | Variable |
| `ACR_PASSWORD` | ACR 密码 | Masked |
| `VITE_API_BASE_URL` | 前端 API 地址（生产环境留空，由 nginx 反向代理） | Variable |
| `SSH_PRIVATE_KEY` | 部署服务器 SSH 私钥 | Masked |
| `SSH_KNOWN_HOSTS` | 服务器 SSH known_hosts（`ssh-keyscan` 输出） | File |
| `DEPLOY_HOST` | 外部服务器 IP/域名 | Variable |
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

## 外部服务器前置准备（一次性）

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

## 需要伴随的代码改动

在 `my-nest-app/src/app.controller.ts` 中添加健康检查端点：

```typescript
@Controller('v1')
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

## 部署流程

```
git push/merge to main
        │
        ▼
┌──────────────────┐
│  build-backend    │  docker build → push ACR (xbb-backend)
│  build-frontend   │  docker build → push ACR (xbb-frontend)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  deploy           │  SSH → scp 文件 → docker pull → docker compose up -d
└──────────────────┘
```

## 验证方案

1. **CI 流水线验证**：合并到 main 后，检查 GitLab CI/CD Pipeline 每个阶段是否通过
2. **镜像推送验证**：检查 ACR 控制台是否出现新的镜像版本
3. **服务器部署验证**：
   ```bash
   ssh user@server
   cd /opt/xbb-website
   docker compose ps          # 两个容器都在运行
   docker compose logs --tail 20  # 无异常日志
   curl -s http://localhost/v1/health  # API 健康检查
   curl -s http://localhost/          # 前端页面
   curl -s http://localhost/admin/    # 管理后台
   ```
4. **端到端验证**：浏览器访问外部服务器域名，确认页面正常加载、API 调用正常