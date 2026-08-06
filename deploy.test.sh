#!/usr/bin/env bash
# ==========================================
# 测试环境部署脚本（手动部署用）
# 从 ghcr.io 拉取镜像 → 启动 Docker MySQL + 应用 → 验证
# ==========================================

set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website-test}"
COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.test.yml"
GHCR_TOKEN="${GHCR_TOKEN:-}"
GITHUB_ACTOR="${GITHUB_ACTOR:-rossroma}"

echo "🚀 [$(date '+%Y-%m-%d %H:%M:%S')] 开始测试环境部署..."

# ==========================================
# 1. 拉取镜像（从 ghcr.io）
# ==========================================
echo "📦 拉取 Docker 镜像..."
if [ -n "${GHCR_TOKEN}" ]; then
  echo "${GHCR_TOKEN}" | docker login ghcr.io -u "${GITHUB_ACTOR}" --password-stdin
fi

docker pull ghcr.io/rossroma/xbb-website/xbb-backend:latest
docker tag ghcr.io/rossroma/xbb-website/xbb-backend:latest xbb-backend:latest
echo "  ✅ 后端镜像拉取完成"

docker pull ghcr.io/rossroma/xbb-website/xbb-frontend:latest
docker tag ghcr.io/rossroma/xbb-website/xbb-frontend:latest xbb-frontend:latest
echo "  ✅ 前端镜像拉取完成"

# ==========================================
# 2. 优雅停止旧服务
# ==========================================
echo "🛑 停止旧服务..."
cd "${DEPLOY_PATH}"
docker compose -f "${COMPOSE_FILE}" down --timeout 30 || true

# ==========================================
# 3. 启动新服务
# ==========================================
echo "🚀 启动新服务（含 MySQL 容器）..."
docker compose -f "${COMPOSE_FILE}" up -d --wait

# ==========================================
# 4. 验证服务
# ==========================================
echo "🔍 验证服务..."

# 验证 MySQL
if docker compose -f "${COMPOSE_FILE}" exec -T mysql mysqladmin ping -h localhost -u root -p"${DB_PASSWORD}" > /dev/null 2>&1; then
  echo "  ✅ MySQL 启动正常"
else
  echo "  ❌ MySQL 启动失败"
  exit 1
fi

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
# 5. 清理
# ==========================================
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] 测试环境部署完成"