# 部署体系改造方案

> ⚠️ 本文档部分已实施。当前状态：
> - ✅ `.gitlab-ci.yml` 已删除（GitHub Actions 为主力）
> - ✅ `.github/workflows/deploy.yml` 已包含测试 + 生产部署
> - ✅ 数据库迁移脚本（`migrate.sh` + `migrations/`）已移除
> - ✅ `verify-deploy.sh` 已集成到 CI 流水线
> - ✅ 变量名统一：测试环境不再使用 `TEST_` 前缀，通过 GitHub Environments 隔离
> - ⏳ 待实施：统一 docker-compose 文件结构（基础 + 覆盖文件）

---

## 一、现状分析

### 1.1 当前文件清单

```
├── .github/workflows/deploy.yml      # GitHub Actions（仅 deploy-test job）
├── .gitlab-ci.yml                     # GitLab CI（build + deploy-test + deploy-prod）
├── docker-compose.yml                 # 生产环境 compose（67 行）
├── docker-compose.test.yml            # 测试环境 compose（107 行，含 MySQL）
├── deploy.sh                          # 生产环境部署脚本
├── deploy.test.sh                     # 测试环境部署脚本
├── my-nest-app/.env                   # 后端开发环境变量（含真实密钥，安全风险）
├── my-vue-app/.env                    # 前端开发环境变量
└── my-vue-app/.env.production         # 前端生产构建变量
```

### 1.2 当前问题

| 问题 | 影响 |
|---|---|
| 两套 CI 系统（GitHub Actions + GitLab CI） | 维护成本翻倍，不确定哪个是主力 |
| 两套 docker-compose 文件，70% 重复 | 改一个环境容易忘记同步另一个 |
| 两套部署脚本，逻辑几乎一样 | 同上 |
| 变量命名使用 `TEST_` 前缀区分环境 | 变量名冗余，同一个变量有两个名字 |
| 变量散落在 CI Secrets、脚本内、docker-compose 内 | 难以追溯「某个环境用了什么值」 |
| `my-nest-app/.env` 包含真实密钥 | 安全风险（虽然 .gitignore 了，但无 .env.example 模板） |
| GitHub Actions 的 deploy.yml 只有测试环境 | 生产部署依赖 GitLab CI，不统一 |

### 1.3 变量命名对照

> ✅ 已修复：测试环境与生产环境统一使用相同变量名，通过 GitHub Environments 隔离。

| 实际含义 | 旧测试环境变量名 | 旧生产环境变量名 | 问题 |
|---|---|---|---|
| 服务器地址 | `TEST_SSH_HOST` | `SSH_HOST`（GitLab） | 同一含义，不同名字 |
| 部署路径 | `TEST_DEPLOY_PATH` | `DEPLOY_PATH` | 同上 |
| 数据库密码 | `TEST_DB_PASSWORD` | `DB_PASSWORD` | 同上 |
| JWT 密钥 | `TEST_JWT_SECRET` | `JWT_SECRET` | 同上 |
| SSH 端口 | `TEST_SSH_PORT` | `DEPLOY_PORT` | 命名不一致 |

---

## 二、目标架构

### 2.1 改造后的文件结构

```
├── .github/workflows/
│   └── deploy.yml                    # 唯一的 CI 文件，支持 test + prod
├── docker-compose.yml                 # 基础定义（公共部分，约 85 行）
├── docker-compose.prod.yml            # 生产覆盖（约 15 行）
├── docker-compose.test.yml            # 测试覆盖（约 35 行，仅 MySQL + depends_on）
├── deploy.sh                          # 统一的部署脚本，ENV=test|prod
├── .env.example                       # 变量模板（提交到 git，无敏感值）
├── .gitignore                         # 忽略 .env.test / .env.production
├── my-nest-app/.env.example           # 后端变量模板
└── my-vue-app/.env.example            # 前端变量模板
```

### 2.2 变量分层

| 层级 | 存放位置 | 内容 | 示例 |
|---|---|---|---|
| **Repository Secrets** | GitHub Settings → Secrets and variables → Secrets | 跨环境共享的敏感信息 | `ACR_PASSWORD`、`OSS_ACCESS_KEY_SECRET` |
| **Repository Variables** | GitHub Settings → Secrets and variables → Variables | 跨环境共享的非敏感配置 | `ACR_REGISTRY`、`OSS_REGION` |
| **Environment Secrets** | Settings → Environments → `test` / `production` → Secrets | 环境特定的敏感信息 | `SSH_PRIVATE_KEY`、`DB_PASSWORD`、`JWT_SECRET` |
| **Environment Variables** | Settings → Environments → `test` / `production` → Variables | 环境特定的非敏感配置 | `DEPLOY_PATH`、`DB_HOST` |

### 2.3 变量流转示意

```
┌──────────────────────────────────────────────────────────┐
│                    GitHub Actions                         │
│                                                          │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │ Repo Secrets │    │ Env Secrets  │    │ Env Vars   │  │
│  │ (共享敏感)   │    │ (环境敏感)   │    │ (环境配置) │  │
│  └──────┬───────┘    └──────┬───────┘    └─────┬──────┘  │
│         │                   │                  │         │
│         └───────────────────┼──────────────────┘         │
│                             ▼                            │
│                    deploy.yml workflow                   │
│                             │                            │
│              SSH ───────────┘                            │
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│                    远程服务器                             │
│                                                          │
│  ┌──────────────┐     ┌──────────────────────────────┐   │
│  │  deploy.sh   │────▶│  docker compose               │   │
│  │  (统一脚本)   │     │  -f docker-compose.yml        │   │
│  │              │     │  -f docker-compose.{env}.yml  │   │
│  └──────────────┘     │  --env-file /tmp/.env         │   │
│                       └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 三、分步改造指南

### Step 1：GitHub Environments 配置

前往 `https://github.com/<owner>/<repo>/settings/environments`

#### 1.1 创建 test 环境

点击 **New environment** → 输入 `test` → **Configure environment**

**Environment secrets**（敏感信息，写入后不可再查看）：

| Name | 说明 | 示例值 |
|---|---|---|
| `SSH_HOST` | 测试服务器 IP/域名 | `192.168.1.100` |
| `SSH_USER` | SSH 用户名 | `deploy` |
| `SSH_PRIVATE_KEY` | SSH 私钥（完整内容） | `-----BEGIN OPENSSH...` |
| `DB_PASSWORD` | 数据库密码 | `test_db_password` |
| `JWT_SECRET` | JWT 签名密钥 | `test-jwt-secret-xxx` |
| `SMS_PASSWORD` | 短信服务密码 | `test_sms_pwd` |
| `CAPTCHA_JWT_SECRET` | 验证码 JWT 密钥 | `test-captcha-secret` |
| `DATACENTER_TOKEN` | 数据中心 Token | `test-datacenter-token` |
| `PARTNER_API_TOKEN` | 合作伙伴 API Token | `test-partner-token` |

**Environment variables**（非敏感，可随时查看）：

| Name | 说明 | 示例值 |
|---|---|---|
| `SSH_PORT` | SSH 端口 | `22` |
| `DEPLOY_PATH` | 部署目录 | `/opt/xbb-website-test` |
| `DB_HOST` | 数据库地址 | `mysql`（Docker 服务名） |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USERNAME` | 数据库用户名 | `root` |
| `DB_DATABASE` | 数据库名 | `db_xbb_www_test` |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `SMS_USERNAME` | 短信服务用户名 | `xbkjy` |
| `OSS_BASE_URL` | OSS 自定义域名 | `https://xbbwww.xbongbong.com` |

**保护规则**（可选）：

| 配置项 | 建议值 |
|---|---|
| Deployment branches | `develop`（限制只有 develop 分支可以部署到 test） |

#### 1.2 创建 production 环境

点击 **New environment** → 输入 `production` → **Configure environment**

**Environment secrets**（同名不同值）：

| Name | 示例值 |
|---|---|
| `SSH_HOST` | `生产服务器 IP` |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | `生产服务器私钥` |
| `DB_PASSWORD` | `生产数据库密码` |
| `JWT_SECRET` | `生产 JWT 密钥` |
| `SMS_PASSWORD` | `生产短信密码` |
| `CAPTCHA_JWT_SECRET` | `生产验证码密钥` |
| `DATACENTER_TOKEN` | `生产数据中心 Token` |
| `PARTNER_API_TOKEN` | `生产合作伙伴 Token` |

**Environment variables**（同名不同值）：

| Name | 示例值 |
|---|---|
| `SSH_PORT` | `22` |
| `DEPLOY_PATH` | `/opt/xbb-website` |
| `DB_HOST` | `生产 RDS 地址` |
| `DB_PORT` | `3306` |
| `DB_USERNAME` | `xbb_admin` |
| `DB_DATABASE` | `db_xbb_www` |
| `JWT_EXPIRES_IN` | `7d` |
| `SMS_USERNAME` | `xbkjy` |
| `OSS_BASE_URL` | `https://xbbwww.xbongbong.com` |

**保护规则**（强烈建议）：

| 配置项 | 建议值 |
|---|---|
| Required reviewers | 至少 1 人审批 |
| Deployment branches | `main` |

#### 1.3 创建 Repository 级别共享变量

前往 `Settings` → `Secrets and variables` → `Actions`

**Repository secrets**（跨环境共享的敏感信息）：

| Name | 说明 |
|---|---|
| `ACR_PASSWORD` | 阿里云 ACR 密码 |
| `OSS_ACCESS_KEY_SECRET` | 阿里云 OSS AccessKey Secret |

**Repository variables**（跨环境共享的非敏感信息）：

| Name | 说明 | 示例值 |
|---|---|---|
| `ACR_REGISTRY` | ACR 注册中心地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `ACR_NAMESPACE` | ACR 命名空间 | `xbb-website` |
| `ACR_USERNAME` | ACR 用户名 | `your-acr-username` |
| `OSS_REGION` | OSS 区域 | `oss-cn-hangzhou` |
| `OSS_BUCKET` | OSS Bucket 名称 | `xbbwww` |
| `OSS_ACCESS_KEY_ID` | OSS AccessKey ID | `LTAI5t...` |

---

### Step 2：合并 docker-compose 文件

#### 2.1 新建 `docker-compose.yml`（基础定义）

```yaml
# ==========================================
# 基础定义 — 测试/生产环境共享
# 用法:
#   测试: docker compose -f docker-compose.yml -f docker-compose.test.yml up -d
#   生产: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# ==========================================

services:
  backend:
    image: ${IMAGE_BACKEND:-xbb-backend:latest}
    container_name: xbb-backend
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT:-3306}
      DB_USERNAME: ${DB_USERNAME:-root}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}
      OSS_REGION: ${OSS_REGION}
      OSS_BUCKET: ${OSS_BUCKET}
      OSS_ACCESS_KEY_ID: ${OSS_ACCESS_KEY_ID}
      OSS_ACCESS_KEY_SECRET: ${OSS_ACCESS_KEY_SECRET}
      OSS_BASE_URL: ${OSS_BASE_URL:-}
      SMS_USERNAME: ${SMS_USERNAME:-}
      SMS_PASSWORD: ${SMS_PASSWORD:-}
      CAPTCHA_JWT_SECRET: ${CAPTCHA_JWT_SECRET:-}
      DATACENTER_TOKEN: ${DATACENTER_TOKEN:-}
      PARTNER_API_TOKEN: ${PARTNER_API_TOKEN:-}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/v1/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    image: ${IMAGE_FRONTEND:-xbb-frontend:latest}
    container_name: xbb-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ${DEPLOY_PATH:-/opt/xbb-website}/Uploads:/usr/share/nginx/html/Uploads:ro
    depends_on:
      backend:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 128M
        reservations:
          memory: 64M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### 2.2 新建 `docker-compose.prod.yml`（生产覆盖）

```yaml
# ==========================================
# 生产环境覆盖 — 使用 ACR 镜像
# ==========================================

services:
  backend:
    image: ${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-backend:latest

  frontend:
    image: ${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-frontend:latest
```

#### 2.3 重写 `docker-compose.test.yml`（测试覆盖）

```yaml
# ==========================================
# 测试环境覆盖 — Docker MySQL + 本地镜像
# ==========================================

services:
  mysql:
    image: mysql:8.0
    container_name: xbb-mysql
    restart: unless-stopped
    ports:
      - "127.0.0.1:3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --default-authentication-plugin=mysql_native_password

  backend:
    depends_on:
      mysql:
        condition: service_healthy

volumes:
  mysql_data:
    driver: local
```

**关键差异说明**：

| 配置项 | 基础文件 | prod 覆盖 | test 覆盖 |
|---|---|---|---|
| `backend.image` | `xbb-backend:latest`（本地） | `ACR/.../xbb-backend:latest` | 继承基础（本地） |
| `frontend.image` | `xbb-frontend:latest`（本地） | `ACR/.../xbb-frontend:latest` | 继承基础（本地） |
| `mysql` 服务 | 无 | 无 | 新增 Docker MySQL |
| `backend.depends_on` | 无 | 无 | 依赖 mysql |

---

### Step 3：合并部署脚本

#### 3.1 新建 `deploy.sh`（统一脚本）

```bash
#!/usr/bin/env bash
# ==========================================
# 统一部署脚本 — 测试 / 生产环境
# ==========================================
# 用法:
#   ENV=test bash deploy.sh
#   ENV=prod bash deploy.sh
#
# 所需环境变量（由 CI 注入）:
#   ACR_REGISTRY, ACR_NAMESPACE, ACR_USERNAME, ACR_PASSWORD
#   DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
#   JWT_SECRET, JWT_EXPIRES_IN
#   OSS_REGION, OSS_BUCKET, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BASE_URL
#   SMS_USERNAME, SMS_PASSWORD
#   CAPTCHA_JWT_SECRET, DATACENTER_TOKEN, PARTNER_API_TOKEN
#   DEPLOY_PATH
# ==========================================

set -euo pipefail

ENV="${ENV:-prod}"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"

# ---------- 环境差异配置 ----------
case "$ENV" in
  test)
    DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website-test}"
    ENV_OVERRIDE="docker-compose.test.yml"
    HAS_MYSQL=true
    ;;
  prod)
    DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website}"
    ENV_OVERRIDE="docker-compose.prod.yml"
    HAS_MYSQL=false
    ;;
  *)
    echo "❌ 未知环境: $ENV（只支持 test | prod）"
    exit 1
    ;;
esac

COMPOSE_BASE="docker-compose.yml"
COMPOSE_ARGS="-f ${COMPOSE_BASE} -f ${ENV_OVERRIDE}"
ENV_FILE="${DEPLOY_PATH}/.env"

echo "🚀 [${TIMESTAMP}] 开始 ${ENV} 环境部署..."

# ---------- 1. 写入运行时环境变量文件 ----------
echo "📝 生成环境变量文件..."
cat > "${ENV_FILE}" << EOF
# 由 deploy.sh 自动生成，请勿手动编辑
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT:-3306}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_DATABASE}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}
OSS_REGION=${OSS_REGION}
OSS_BUCKET=${OSS_BUCKET}
OSS_ACCESS_KEY_ID=${OSS_ACCESS_KEY_ID}
OSS_ACCESS_KEY_SECRET=${OSS_ACCESS_KEY_SECRET}
OSS_BASE_URL=${OSS_BASE_URL:-}
SMS_USERNAME=${SMS_USERNAME:-}
SMS_PASSWORD=${SMS_PASSWORD:-}
CAPTCHA_JWT_SECRET=${CAPTCHA_JWT_SECRET:-}
DATACENTER_TOKEN=${DATACENTER_TOKEN:-}
PARTNER_API_TOKEN=${PARTNER_API_TOKEN:-}
EOF

# ---------- 2. 拉取镜像（生产环境从 ACR 拉取） ----------
if [ "$ENV" = "prod" ]; then
  echo "📦 登录 ACR 并拉取镜像..."
  echo "${ACR_PASSWORD}" | docker login \
    --username "${ACR_USERNAME}" \
    --password-stdin \
    "${ACR_REGISTRY}"
  docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-backend:latest"
  docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-frontend:latest"
fi

# ---------- 3. 停止旧服务 ----------
echo "🛑 停止旧服务..."
cd "${DEPLOY_PATH}"
docker compose --env-file "${ENV_FILE}" ${COMPOSE_ARGS} down --timeout 30 || true

# ---------- 4. 启动新服务 ----------
echo "🚀 启动新服务..."
docker compose --env-file "${ENV_FILE}" ${COMPOSE_ARGS} up -d --wait

# ---------- 5. 健康检查 ----------
echo "🔍 验证服务..."

# 测试环境额外检查 MySQL
if [ "$HAS_MYSQL" = "true" ]; then
  if docker compose --env-file "${ENV_FILE}" ${COMPOSE_ARGS} exec -T mysql \
    mysqladmin ping -h localhost -u root -p"${DB_PASSWORD}" > /dev/null 2>&1; then
    echo "  ✅ MySQL"
  else
    echo "  ❌ MySQL 启动失败"
    exit 1
  fi
fi

# 检查后端
for i in $(seq 1 10); do
  if curl -sf http://localhost:3000/v1/health > /dev/null 2>&1; then
    echo "  ✅ 后端健康检查通过"
    break
  fi
  if [ "$i" -eq 10 ]; then
    echo "  ❌ 后端启动超时"
    exit 1
  fi
  sleep 3
done

# 检查前端
if curl -sf http://localhost/ > /dev/null 2>&1; then
  echo "  ✅ 前端响应正常"
else
  echo "  ❌ 前端响应失败"
  exit 1
fi

# ---------- 6. 清理 ----------
echo "🧹 清理旧镜像..."
docker image prune -f

# 清理临时 env 文件
rm -f "${ENV_FILE}"

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] ${ENV} 环境部署完成"
```

#### 3.2 删除旧脚本

```bash
rm deploy.test.sh
```

> `deploy.sh` 被新脚本覆盖，旧的生产部署逻辑已合并进去。

---

### Step 4：重写 GitHub Actions Workflow

#### 4.1 重写 `.github/workflows/deploy.yml`

```yaml
# ==========================================
# 销帮帮 CRM 官网 — GitHub Actions 部署流水线
# ==========================================
# 触发规则：
#   develop 分支 → 自动构建 + 部署测试环境
#   main 分支   → 手动触发 + 部署生产环境
# ==========================================

name: Deploy

on:
  push:
    branches: [develop, main]
  workflow_dispatch:

env:
  GHCR: ghcr.io
  IMAGE_BACKEND: ${{ github.repository }}/xbb-backend
  IMAGE_FRONTEND: ${{ github.repository }}/xbb-frontend

jobs:
  # ==========================================
  # 预检
  # ==========================================
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.33.0

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: 缓存 TypeScript 增量构建
        uses: actions/cache@v4
        with:
          path: |
            my-vue-app/.tsbuildinfo
            my-vue-app/tsconfig.tsbuildinfo
            my-nest-app/tsconfig.tsbuildinfo
          key: tsbuildinfo-${{ github.ref_name }}-${{ github.sha }}
          restore-keys: |
            tsbuildinfo-${{ github.ref_name }}-

      - run: pnpm install --frozen-lockfile

      - name: 预检
        run: |
          set +e; FAILED=0
          echo "::group::🔍 后端类型检查"
          pnpm -C my-nest-app exec tsc --noEmit || { FAILED=1; echo "❌ 失败"; }
          echo "::endgroup::"
          echo "::group::🔍 前端类型检查"
          pnpm -C my-vue-app exec vue-tsc --noEmit || { FAILED=1; echo "❌ 失败"; }
          echo "::endgroup::"
          echo "::group::🔍 Lint 检查"
          pnpm -C my-vue-app lint || { FAILED=1; echo "❌ 失败"; }
          echo "::endgroup::"
          echo "::group::🔍 后端单元测试"
          pnpm -C my-nest-app test || { FAILED=1; echo "❌ 失败"; }
          echo "::endgroup::"
          [ $FAILED -ne 0 ] && { echo "❌ 预检未通过"; exit 1; }
          echo "✅ 全部预检通过"

  # ==========================================
  # 构建后端镜像
  # ==========================================
  build-backend:
    needs: check
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: 登录 ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ${{ env.GHCR }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/setup-buildx-action@v3

      - name: 构建并推送 ghcr.io
        uses: docker/build-push-action@v6
        with:
          context: .
          file: my-nest-app/Dockerfile
          push: true
          tags: |
            ${{ env.GHCR }}/${{ env.IMAGE_BACKEND }}:${{ github.sha }}
            ${{ env.GHCR }}/${{ env.IMAGE_BACKEND }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: 同步到 ACR
        continue-on-error: true
        run: |
          echo "${{ secrets.ACR_PASSWORD }}" | docker login "${{ vars.ACR_REGISTRY }}" -u "${{ vars.ACR_USERNAME }}" --password-stdin
          docker pull ${{ env.GHCR }}/${{ env.IMAGE_BACKEND }}:${{ github.sha }}
          docker tag ${{ env.GHCR }}/${{ env.IMAGE_BACKEND }}:${{ github.sha }} ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:${{ github.sha }}
          docker tag ${{ env.GHCR }}/${{ env.IMAGE_BACKEND }}:${{ github.sha }} ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:latest
          docker push ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:${{ github.sha }}
          docker push ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:latest

  # ==========================================
  # 构建前端镜像
  # ==========================================
  build-frontend:
    needs: check
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    strategy:
      matrix:
        environment: [test, production]
    steps:
      - uses: actions/checkout@v4

      - name: 登录 ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ${{ env.GHCR }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/setup-buildx-action@v3

      - name: 构建并推送 ghcr.io
        uses: docker/build-push-action@v6
        with:
          context: .
          file: my-vue-app/Dockerfile
          push: true
          build-args: |
            VITE_API_BASE_URL=${{ vars.VITE_API_BASE_URL }}
          tags: |
            ${{ env.GHCR }}/${{ env.IMAGE_FRONTEND }}:${{ github.sha }}
            ${{ env.GHCR }}/${{ env.IMAGE_FRONTEND }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: 同步到 ACR
        continue-on-error: true
        run: |
          echo "${{ secrets.ACR_PASSWORD }}" | docker login "${{ vars.ACR_REGISTRY }}" -u "${{ vars.ACR_USERNAME }}" --password-stdin
          docker pull ${{ env.GHCR }}/${{ env.IMAGE_FRONTEND }}:${{ github.sha }}
          docker tag ${{ env.GHCR }}/${{ env.IMAGE_FRONTEND }}:${{ github.sha }} ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:${{ github.sha }}
          docker tag ${{ env.GHCR }}/${{ env.IMAGE_FRONTEND }}:${{ github.sha }} ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:latest
          docker push ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:${{ github.sha }}
          docker push ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:latest

  # ==========================================
  # 部署测试环境
  # ==========================================
  deploy-test:
    if: github.ref == 'refs/heads/develop'
    needs: [build-backend, build-frontend]
    runs-on: ubuntu-latest
    environment:
      name: test
    steps:
      - uses: actions/checkout@v4

      - name: SSH 部署
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          port: ${{ vars.SSH_PORT || 22 }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            set -e
            echo "🚀 开始测试环境部署..."

            # 登录 ACR 并拉取镜像
            echo "${{ secrets.ACR_PASSWORD }}" | docker login ${{ vars.ACR_REGISTRY }} -u ${{ vars.ACR_USERNAME }} --password-stdin
            docker pull ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:latest
            docker tag ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:latest xbb-backend:latest
            docker pull ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:latest
            docker tag ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:latest xbb-frontend:latest

            # 上传 compose 文件和部署脚本
            cd ${{ vars.DEPLOY_PATH }}
            cat > docker-compose.yml << 'COMPOSE_EOF'
            $(cat docker-compose.yml)
            COMPOSE_EOF
            cat > docker-compose.test.yml << 'COMPOSE_EOF'
            $(cat docker-compose.test.yml)
            COMPOSE_EOF

            # 停止旧服务
            docker compose -f docker-compose.yml -f docker-compose.test.yml down --timeout 30 || true

            # 生成 env 文件并启动
            cat > .env << EOF
            DB_HOST=${{ vars.DB_HOST }}
            DB_PORT=${{ vars.DB_PORT || 3306 }}
            DB_USERNAME=${{ vars.DB_USERNAME || 'root' }}
            DB_PASSWORD=${{ secrets.DB_PASSWORD }}
            DB_DATABASE=${{ vars.DB_DATABASE }}
            JWT_SECRET=${{ secrets.JWT_SECRET }}
            JWT_EXPIRES_IN=${{ vars.JWT_EXPIRES_IN || '7d' }}
            OSS_REGION=${{ vars.OSS_REGION }}
            OSS_BUCKET=${{ vars.OSS_BUCKET }}
            OSS_ACCESS_KEY_ID=${{ vars.OSS_ACCESS_KEY_ID }}
            OSS_ACCESS_KEY_SECRET=${{ secrets.OSS_ACCESS_KEY_SECRET }}
            OSS_BASE_URL=${{ vars.OSS_BASE_URL || '' }}
            SMS_USERNAME=${{ vars.SMS_USERNAME || '' }}
            SMS_PASSWORD=${{ secrets.SMS_PASSWORD || '' }}
            CAPTCHA_JWT_SECRET=${{ secrets.CAPTCHA_JWT_SECRET || '' }}
            DATACENTER_TOKEN=${{ secrets.DATACENTER_TOKEN || '' }}
            PARTNER_API_TOKEN=${{ secrets.PARTNER_API_TOKEN || '' }}
            EOF

            docker compose --env-file .env -f docker-compose.yml -f docker-compose.test.yml up -d --wait

            # 健康检查
            for i in $(seq 1 10); do
              curl -sf http://localhost:3000/v1/health && break
              [ "$i" -eq 10 ] && { echo "❌ 后端启动超时"; exit 1; }
              sleep 3
            done
            echo "✅ 后端正常"
            curl -sf http://localhost/ && echo "✅ 前端正常" || { echo "❌ 前端异常"; exit 1; }

            docker image prune -f
            rm -f .env
            echo "✅ 测试环境部署完成"

  # ==========================================
  # 部署生产环境
  # ==========================================
  deploy-prod:
    if: github.ref == 'refs/heads/main'
    needs: [build-backend, build-frontend]
    runs-on: ubuntu-latest
    environment:
      name: production
    steps:
      - uses: actions/checkout@v4

      - name: SSH 部署
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          port: ${{ vars.SSH_PORT || 22 }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            set -e
            echo "🚀 开始生产环境部署..."

            # 登录 ACR 并拉取镜像
            echo "${{ secrets.ACR_PASSWORD }}" | docker login ${{ vars.ACR_REGISTRY }} -u ${{ vars.ACR_USERNAME }} --password-stdin
            docker pull ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-backend:latest
            docker pull ${{ vars.ACR_REGISTRY }}/${{ vars.ACR_NAMESPACE }}/xbb-frontend:latest

            # 上传 compose 文件
            cd ${{ vars.DEPLOY_PATH }}
            cat > docker-compose.yml << 'COMPOSE_EOF'
            $(cat docker-compose.yml)
            COMPOSE_EOF
            cat > docker-compose.prod.yml << 'COMPOSE_EOF'
            $(cat docker-compose.prod.yml)
            COMPOSE_EOF

            # 停止旧服务
            docker compose -f docker-compose.yml -f docker-compose.prod.yml down --timeout 30 || true

            # 生成 env 文件并启动
            cat > .env << EOF
            DB_HOST=${{ vars.DB_HOST }}
            DB_PORT=${{ vars.DB_PORT || 3306 }}
            DB_USERNAME=${{ vars.DB_USERNAME || 'root' }}
            DB_PASSWORD=${{ secrets.DB_PASSWORD }}
            DB_DATABASE=${{ vars.DB_DATABASE }}
            JWT_SECRET=${{ secrets.JWT_SECRET }}
            JWT_EXPIRES_IN=${{ vars.JWT_EXPIRES_IN || '7d' }}
            OSS_REGION=${{ vars.OSS_REGION }}
            OSS_BUCKET=${{ vars.OSS_BUCKET }}
            OSS_ACCESS_KEY_ID=${{ vars.OSS_ACCESS_KEY_ID }}
            OSS_ACCESS_KEY_SECRET=${{ secrets.OSS_ACCESS_KEY_SECRET }}
            OSS_BASE_URL=${{ vars.OSS_BASE_URL || '' }}
            SMS_USERNAME=${{ vars.SMS_USERNAME || '' }}
            SMS_PASSWORD=${{ secrets.SMS_PASSWORD || '' }}
            CAPTCHA_JWT_SECRET=${{ secrets.CAPTCHA_JWT_SECRET || '' }}
            DATACENTER_TOKEN=${{ secrets.DATACENTER_TOKEN || '' }}
            PARTNER_API_TOKEN=${{ secrets.PARTNER_API_TOKEN || '' }}
            EOF

            docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d --wait

            # 健康检查
            for i in $(seq 1 10); do
              curl -sf http://localhost:3000/v1/health && break
              [ "$i" -eq 10 ] && { echo "❌ 后端启动超时"; exit 1; }
              sleep 3
            done
            echo "✅ 后端正常"
            curl -sf http://localhost/ && echo "✅ 前端正常" || { echo "❌ 前端异常"; exit 1; }

            docker image prune -f
            rm -f .env
            echo "✅ 生产环境部署完成"
```

---

### Step 5：GitLab CI 处理

两个选择：

**选项 A（推荐）：删除 `.gitlab-ci.yml`**

如果 GitHub Actions 是主力 CI，直接删除 GitLab CI 配置，避免维护两套。

```bash
git rm .gitlab-ci.yml
```

**选项 B：精简保留**

如果需要保留 GitLab CI 作为备份，将其精简为与 GitHub Actions 一致的逻辑，使用相同的变量命名（去掉 `TEST_` 前缀，改用 GitLab 的 environments 功能）。

---

### Step 6：服务器端准备

每台服务器上需要预先执行一次：

```bash
# 1. 创建部署目录
mkdir -p /opt/xbb-website/Uploads         # 生产
mkdir -p /opt/xbb-website-test/Uploads    # 测试

# 2. 确保 docker 和 docker compose 可用
docker --version
docker compose version

# 3. 确保有 ACR 登录权限（首次需要手动登录一次以缓存凭证）
# 或者后续 CI 每次部署时都会自动登录
```

**不需要在服务器上预先放置任何文件** — compose 文件和 env 文件都由 CI 在每次部署时动态写入。

---

### Step 7：验证清单

改造完成后，逐项验证：

- [ ] **Step 1**：GitHub Settings → Environments 能看到 `test` 和 `production`
- [ ] **Step 1**：每个 Environment 的 Secrets 和 Variables 已填入正确值（变量名统一，无 `TEST_` 前缀）
- [ ] **Step 1**：Repository Secrets 中有 `ACR_PASSWORD`、`OSS_ACCESS_KEY_SECRET`
- [ ] **Step 1**：Repository Variables 中有 `ACR_REGISTRY`、`ACR_NAMESPACE`、`ACR_USERNAME`、`OSS_*`
- [ ] **Step 2**：`docker-compose.yml` 包含公共服务定义
- [ ] **Step 2**：`docker-compose.prod.yml` 仅包含 ACR 镜像覆盖
- [ ] **Step 2**：`docker-compose.test.yml` 仅包含 MySQL + depends_on
- [ ] **Step 3**：`deploy.sh` 可以通过 `ENV=test` 和 `ENV=prod` 切换
- [ ] **Step 4**：`.github/workflows/deploy.yml` 包含 `deploy-test` 和 `deploy-prod` 两个 job
- [ ] **Step 4**：每个 job 的 `environment` 字段指向正确的 Environment
- [ ] **Step 5**：决定保留还是删除 `.gitlab-ci.yml`
- [ ] **验证**：push 到 develop → 自动触发测试环境部署
- [ ] **验证**：push 到 main → 手动触发生产环境部署
- [ ] **验证**：部署后 `curl http://test-server/v1/health` 返回 200
- [ ] **验证**：部署后 `curl http://prod-server/v1/health` 返回 200

---

## 四、安全建议

### 4.1 敏感文件清理

`my-nest-app/.env` 包含真实密钥，建议：

```bash
# 创建模板文件（提交到 git）
cp my-nest-app/.env my-nest-app/.env.example

# 将模板中的真实值替换为占位符
# 例如: DB_PASSWORD=your_password_here

# 确保 .env 在 .gitignore 中
echo ".env" >> .gitignore
echo ".env.test" >> .gitignore
echo ".env.production" >> .gitignore
```

### 4.2 生产环境保护

在生产 Environment 设置中开启：

- **Required reviewers**：至少 1 人审批
- **Deployment branches**：仅 `main` 分支
- **Wait timer**（可选）：部署前等待 1 分钟

---

## 五、改造前后对比

| 指标 | 改造前 | 改造后 |
|---|---|---|
| CI 文件 | 2 个（GitHub Actions + GitLab CI） | 1 个 |
| docker-compose 文件 | 2 个独立文件（70% 重复） | 1 基础 + 2 覆盖文件（0 重复） |
| 部署脚本 | 2 个独立脚本 | 1 个统一脚本 |
| 变量命名 | `TEST_XXX` vs `XXX` | 统一命名，通过 Environment 切换值 |
| 变量管理 | 散落在 CI Secrets/Variables/脚本内 | 分层：Repo → Environment → Secrets/Variables |
| 生产部署审批 | 无 | 可配置 Required reviewers |
| 新增第三个环境 | 复制粘贴所有文件 | 新建 Environment + 一个覆盖文件 |