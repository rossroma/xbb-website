#!/usr/bin/env bash
# ==========================================
# 部署前自检脚本
# 在推送 CI/CD 相关变更前执行，检查常见问题
# 用法: bash scripts/deploy-check.sh
# ==========================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
PASS=0
FAIL=0
WARN=0

check_pass() {
  echo -e "  ${GREEN}✅${NC} $1"
  PASS=$((PASS + 1))
}

check_fail() {
  echo -e "  ${RED}❌${NC} $1"
  FAIL=$((FAIL + 1))
}

check_warn() {
  echo -e "  ${YELLOW}⚠️${NC} $1"
  WARN=$((WARN + 1))
}

echo ""
echo "=========================================="
echo "  🔍 部署前自检脚本"
  echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# ---- 1. 环境变量检查 ----
echo "📋 1. 环境变量一致性检查"
echo ""

# 检查 .env 文件是否存在
if [ -f .env ]; then
  check_pass ".env 文件存在"
  # 检查 .env 中是否存在敏感变量是空值(不泄露值本身)
  EMPTY_VARS=$(grep -E '^[^#].*=.*' .env | grep -E '=$' || true)
  if [ -n "$EMPTY_VARS" ]; then
    check_warn ".env 中存在空值变量，请确认是否预期"
  fi
else
  check_fail ".env 文件不存在，请检查环境变量配置"
fi

# 检查 .env.example 是否存在（如果存在）
if [ -f .env.example ]; then
  check_pass ".env.example 存在"
fi

# 检查 deploy.yml 中引用的环境变量是否在 vars/secrets 中定义
if [ -f .github/workflows/deploy.yml ]; then
  # 提取 deploy.yml 中所有 ${{ vars.* }} 和 ${{ secrets.* }} 引用
  VAR_REFS=$(grep -oE '\$\{\{ vars\.([^}]+) \}\}' .github/workflows/deploy.yml | sort -u)
  SECRET_REFS=$(grep -oE '\$\{\{ secrets\.([^}]+) \}\}' .github/workflows/deploy.yml | sort -u)
  check_pass "deploy.yml 环境变量引用已扫描"
  echo "    vars 引用: $(echo "$VAR_REFS" | wc -l) 个"
  echo "    secrets 引用: $(echo "$SECRET_REFS" | wc -l) 个"
fi

echo ""
echo "📋 2. Dockerfile 完整性检查"
echo ""

# 检查前端 Dockerfile
if [ -f my-vue-app/Dockerfile ]; then
  if grep -q "pnpm-lock.yaml" my-vue-app/Dockerfile 2>/dev/null; then
    check_pass "前端 Dockerfile: 复制了 pnpm-lock.yaml"
  else
    check_fail "前端 Dockerfile: 缺少 pnpm-lock.yaml 复制"
  fi
  if grep -q "HEALTHCHECK" my-vue-app/Dockerfile 2>/dev/null; then
    check_pass "前端 Dockerfile: 有健康检查"
  else
    check_warn "前端 Dockerfile: 缺少健康检查"
  fi
fi

# 检查后端 Dockerfile
if [ -f my-nest-app/Dockerfile ]; then
  if grep -q "pnpm-lock.yaml" my-nest-app/Dockerfile 2>/dev/null; then
    check_pass "后端 Dockerfile: 复制了 pnpm-lock.yaml"
  else
    check_fail "后端 Dockerfile: 缺少 pnpm-lock.yaml 复制"
  fi
  if grep -q "assets/" my-nest-app/Dockerfile 2>/dev/null; then
    check_pass "后端 Dockerfile: 复制了 assets/ 目录"
  else
    check_warn "后端 Dockerfile: 未显式复制 assets/ 目录（可能不需要）"
  fi
  if grep -q "scripts/" my-nest-app/Dockerfile 2>/dev/null; then
    check_pass "后端 Dockerfile: 复制了 scripts/ 构建脚本"
  else
    check_fail "后端 Dockerfile: 缺少 scripts/ 构建脚本复制"
  fi
  if grep -q "dotenv" my-nest-app/package.json 2>/dev/null; then
    # 检查 dotenv 是否在 dependencies 中（非 devDependencies）
    if grep -A 50 '"dependencies"' my-nest-app/package.json | grep -q "dotenv"; then
      check_pass "后端: dotenv 在 dependencies 中"
    else
      check_fail "后端: dotenv 不在 dependencies 中（可能在 devDependencies，运行时找不到）"
    fi
  fi
fi

echo ""
echo "📋 3. 部署脚本检查"
echo ""

# 检查 docker-compose.yml 是否存在
if [ -f docker-compose.yml ]; then
  check_pass "docker-compose.yml 存在"
fi

# 检查 verify-deploy.sh 是否存在
if [ -f scripts/verify-deploy.sh ]; then
  check_pass "verify-deploy.sh 存在"
fi

# 检查 deploy.yml 是否引用了必要的 secrets
if [ -f .github/workflows/deploy.yml ]; then
  MISSING_SECRETS=""
  for secret in SSH_HOST SSH_USER SSH_PRIVATE_KEY ACR_PASSWORD DB_PASSWORD JWT_SECRET; do
    if ! grep -q "secrets\.$secret" .github/workflows/deploy.yml 2>/dev/null; then
      MISSING_SECRETS="$MISSING_SECRETS $secret"
    fi
  done
  if [ -n "$MISSING_SECRETS" ]; then
    check_warn "deploy.yml 中可能缺失以下 secrets 引用:$MISSING_SECRETS"
  else
    check_pass "deploy.yml 引用了必要的 secrets"
  fi
fi

echo ""
echo "📋 4. Git 提交检查"
echo ""

# 检查是否有未提交的变更
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  check_warn "存在未提交的变更，建议先提交再部署"
else
  check_pass "工作区干净"
fi

# 检查当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
if [ "$CURRENT_BRANCH" = "develop" ] || [ "$CURRENT_BRANCH" = "main" ]; then
  check_warn "当前在 $CURRENT_BRANCH 分支，直接推送将触发自动部署"
else
  check_pass "当前在 $CURRENT_BRANCH 分支，不会触发自动部署"
fi

# 检查是否与本周同类提交有关
SAME_TOPIC_COUNT=$(git log --since="2026-08-05" --oneline --format="%s" 2>/dev/null | grep -ciE "deploy|docker|ci/cd|acr|镜像" || true)
if [ "$SAME_TOPIC_COUNT" -gt 5 ]; then
  check_warn "本周已有 $SAME_TOPIC_COUNT 次 CI/CD 相关提交，请确认本次变更是否为新问题修复"
fi

echo ""
echo "=========================================="
echo -e "  ${GREEN}✅ 通过: $PASS${NC}"
echo -e "  ${RED}❌ 失败: $FAIL${NC}"
echo -e "  ${YELLOW}⚠️  警告: $WARN${NC}"
echo "=========================================="
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}❌ 自检未通过，请修复失败项后重新运行${NC}"
  exit 1
elif [ $WARN -gt 0 ]; then
  echo -e "${YELLOW}⚠️  自检通过但有警告，请确认后继续${NC}"
  exit 0
else
  echo -e "${GREEN}✅ 自检全部通过，可以部署${NC}"
  exit 0
fi