#!/usr/bin/env bash
# ==========================================
# 测试环境部署脚本（手动部署用）
# 从 ACR 拉取镜像 → 启动 Docker MySQL + 应用 → 验证
# ==========================================
# 用法：
#   ACR_REGISTRY=xxx ACR_NAMESPACE=xxx ACR_USERNAME=xxx ACR_PASSWORD=xxx \
#   DB_PASSWORD=xxx DB_DATABASE=xxx JWT_SECRET=xxx \
#   bash deploy.test.sh
# ==========================================

set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website-test}"
COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.test.yml"

echo "🚀 [$(date '+%Y-%m-%d %H:%M:%S')] 开始测试环境部署..."

# ==========================================
# 1. 登录 ACR 并拉取镜像
# ==========================================
echo "📦 拉取 Docker 镜像..."

if [ -n "${ACR_PASSWORD:-}" ]; then
  echo "${ACR_PASSWORD}" | docker login "${ACR_REGISTRY}" -u "${ACR_USERNAME}" --password-stdin
fi

docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-backend:latest"
docker tag "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-backend:latest" xbb-backend:latest
echo "  ✅ 后端镜像"

docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-frontend:latest"
docker tag "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-frontend:latest" xbb-frontend:latest
echo "  ✅ 前端镜像"

# ==========================================
# 2. 停止旧服务
# ==========================================
echo "🛑 停止旧服务..."
cd "${DEPLOY_PATH}"
docker compose -f "${COMPOSE_FILE}" down --timeout 30 || true

# ==========================================
# 3. 启动 MySQL 并运行数据库迁移
# ==========================================
echo "🐬 启动 MySQL..."
DB_PASSWORD="${DB_PASSWORD:-}" \
DB_DATABASE="${DB_DATABASE:-}" \
DEPLOY_PATH="${DEPLOY_PATH}" \
docker compose -f "${COMPOSE_FILE}" up -d --wait mysql

# 运行迁移脚本（使用 docker compose exec 连接已有的 MySQL 容器，无需额外拉镜像）
echo "📦 运行数据库迁移..."
MIGRATE_SCRIPT="${DEPLOY_PATH}/database/migrate.sh"
if [ -f "${MIGRATE_SCRIPT}" ]; then
  cd "${DEPLOY_PATH}"
  MYSQL_USE_COMPOSE=1 \
  DB_HOST=127.0.0.1 \
  DB_PORT=3306 \
  DB_USERNAME=root \
  DB_PASSWORD="${DB_PASSWORD}" \
  DB_DATABASE="${DB_DATABASE}" \
  bash "${MIGRATE_SCRIPT}"
else
  echo "  ⚠️  迁移脚本 ${MIGRATE_SCRIPT} 不存在，跳过迁移"
fi

# ==========================================
# 4. 启动后端和前端服务
# ==========================================
echo "🚀 启动后端和前端服务..."
JWT_SECRET="${JWT_SECRET:-}" \
OSS_REGION="${OSS_REGION:-}" \
OSS_BUCKET="${OSS_BUCKET:-}" \
OSS_ACCESS_KEY_ID="${OSS_ACCESS_KEY_ID:-}" \
OSS_ACCESS_KEY_SECRET="${OSS_ACCESS_KEY_SECRET:-}" \
DEPLOY_PATH="${DEPLOY_PATH}" \
docker compose -f "${COMPOSE_FILE}" up -d --wait

# ==========================================
# 5. 验证
# ==========================================
echo "🔍 验证服务..."

if docker compose -f "${COMPOSE_FILE}" exec -T mysql mysqladmin ping -h localhost -u root -p"${DB_PASSWORD}" > /dev/null 2>&1; then
  echo "  ✅ MySQL"
else
  echo "  ❌ MySQL 启动失败"
  exit 1
fi

for i in $(seq 1 10); do
  if curl -sf http://localhost:3000/v1/health > /dev/null 2>&1; then
    echo "  ✅ 后端"
    break
  fi
  [ "$i" -eq 10 ] && { echo "  ❌ 后端启动超时"; exit 1; }
  sleep 3
done

curl -sf http://localhost/ > /dev/null 2>&1 && echo "  ✅ 前端" || { echo "  ❌ 前端"; exit 1; }

# ==========================================
# 6. 清理
# ==========================================
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] 部署完成"