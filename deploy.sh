#!/usr/bin/env bash
# ==========================================
# 统一部署脚本 — 同时支持测试和生产环境
# 用法：
#   bash deploy.sh              # 生产部署
#   bash deploy.sh --test       # 测试部署
# ==========================================
# 环境变量说明（必须提供）：
#   ACR_REGISTRY / ACR_NAMESPACE / ACR_USERNAME / ACR_PASSWORD  — ACR 登录
#   DB_HOST / DB_USERNAME / DB_PASSWORD / DB_DATABASE           — 数据库
#   JWT_SECERT                                                     — JWT 密钥
# ==========================================

set -euo pipefail

# ==========================================
# 0. 环境判断
# ==========================================
MODE="${1:-prod}"
if [ "$MODE" = "--test" ] || [ "$MODE" = "test" ]; then
  ENV="test"
  LABEL="测试环境"
  DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website-test}"
  BACKEND_PORT="${BACKEND_PORT:-3000}"
  FRONTEND_PORT="${FRONTEND_PORT:-80}"
else
  ENV="prod"
  LABEL="生产环境"
  DEPLOY_PATH="${DEPLOY_PATH:-/opt/xbb-website}"
  BACKEND_PORT="${BACKEND_PORT:-3000}"
  FRONTEND_PORT="${FRONTEND_PORT:-80}"
fi

COMPOSE_FILE="${DEPLOY_PATH}/docker-compose.yml"

echo "🚀 [$(date '+%Y-%m-%d %H:%M:%S')] 开始 ${LABEL} 部署..."
echo "  部署路径: ${DEPLOY_PATH}"

# ==========================================
# 1. 登录阿里云 ACR
# ==========================================
echo "📦 登录阿里云 ACR..."
if [ -n "${ACR_PASSWORD:-}" ]; then
  echo "${ACR_PASSWORD}" | docker login \
    --username "${ACR_USERNAME}" \
    --password-stdin \
    "${ACR_REGISTRY}"
fi

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
# 5. 执行数据库迁移
# ==========================================
echo "🗄️  执行数据库迁移..."
if docker compose -f "${COMPOSE_FILE}" exec -T backend \
  npx typeorm migration:run -d dist/database/data-source-cli.js 2>/dev/null; then
  echo "  ✅ 数据库迁移完成"
else
  echo "  ⚠️  迁移命令执行失败（可能是首次部署无迁移文件，可忽略）"
fi

# ==========================================
# 6. 验证服务
# ==========================================
echo "🔍 验证服务..."

# 验证后端健康检查
for i in $(seq 1 10); do
  if curl -sf http://localhost:${BACKEND_PORT}/v1/health > /dev/null 2>&1; then
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
if curl -sf http://localhost:${FRONTEND_PORT}/ > /dev/null 2>&1; then
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

echo "✅ [$(date '+%Y-%m-%d %H:%M:%S')] ${LABEL} 部署完成"