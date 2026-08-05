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
# 3. 优雅停止旧服务
# ==========================================
echo "🛑 停止旧服务..."
cd "${DEPLOY_PATH}"
docker compose -f "${COMPOSE_FILE}" down --timeout 30 || true

# ==========================================
# 4. 启动新服务
# ==========================================
echo "🚀 启动新服务..."
docker compose -f "${COMPOSE_FILE}" up -d --wait

# ==========================================
# 5. 验证服务
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
# 6. 清理旧镜像
# ==========================================
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] 生产环境部署完成"