#!/usr/bin/env bash
# ==========================================
# 生产环境部署脚本
# 从 ACR 拉取镜像 → 启动服务 → 验证
# ==========================================

set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website}"
COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.yml"

echo "🚀 [$(date '+%Y-%m-%d %H:%M:%S')] 开始生产环境部署..."

# ==========================================
# 1. 登录阿里云 ACR
# ==========================================
echo "📦 登录阿里云 ACR..."
echo "${ACR_PASSWORD}" | docker login \
  --username "${ACR_USERNAME}" \
  --password-stdin \
  "${ACR_REGISTRY}"

# ==========================================
# 2. 拉取最新镜像
# ==========================================
echo "📥 拉取最新镜像..."
docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-backend:latest"
docker pull "${ACR_REGISTRY}/${ACR_NAMESPACE}/xbb-frontend:latest"

# ==========================================
# 3. 运行数据库迁移
# ==========================================
echo "📦 运行数据库迁移..."
MIGRATE_SCRIPT="${DEPLOY_PATH}/database/migrate.sh"
if [ -f "${MIGRATE_SCRIPT}" ]; then
  DB_HOST="${DB_HOST}" \
  DB_PORT="${DB_PORT:-3306}" \
  DB_USERNAME="${DB_USERNAME}" \
  DB_PASSWORD="${DB_PASSWORD}" \
  DB_DATABASE="${DB_DATABASE}" \
  bash "${MIGRATE_SCRIPT}"
else
  echo "  ⚠️  迁移脚本 ${MIGRATE_SCRIPT} 不存在，跳过迁移"
  echo "  请确保已通过部署流水线上传 my-nest-app/database/ 目录到服务器"
fi

# ==========================================
# 4. 优雅停止旧服务
# ==========================================
echo "🛑 停止旧服务..."
cd "${DEPLOY_PATH}"
docker compose -f "${COMPOSE_FILE}" down --timeout 30 || true

# ==========================================
# 5. 启动新服务
# ==========================================
echo "🚀 启动新服务..."
docker compose -f "${COMPOSE_FILE}" up -d --wait

# ==========================================
# 6. 验证服务
# ==========================================
echo "🔍 验证服务..."

# 验证后端健康检查
for i in $(seq 1 10); do
  if curl -sf http://localhost:3000/v1/health > /dev/null 2>&1; then
    echo "  ✅ 后端健康检查通过"
    break
  fi
  if [ "$i" -eq 10 ]; then
    echo "  ❌ 后端健康检查失败"
    exit 1
  fi
  sleep 3
done

# 验证前端
if curl -sf http://localhost/ > /dev/null 2>&1; then
  echo "  ✅ 前端响应正常"
else
  echo "  ❌ 前端响应失败"
  exit 1
fi

# ==========================================
# 7. 清理旧镜像
# ==========================================
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] 生产环境部署完成"