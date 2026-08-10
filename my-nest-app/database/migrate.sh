#!/usr/bin/env bash
# ============================================================
# 数据库迁移运行器
# ============================================================
# 用法：
#   export DB_HOST=... DB_USERNAME=... DB_PASSWORD=... DB_DATABASE=...
#   bash database/migrate.sh
# ============================================================
# 设计说明：
#   - 使用 schema_migrations 表追踪已执行过的迁移文件
#   - 自动跳过已执行的文件（基于文件名去重）
#   - 优先使用宿主机 mysql CLI，不可用时 fallback 到 docker run mysql:8
#   - 迁移文件按文件名排序依次执行
# ============================================================

set -euo pipefail

# --------------------------------------------
# 配置（从环境变量读取）
# --------------------------------------------
MYSQL_HOST="${DB_HOST:?请设置环境变量 DB_HOST}"
MYSQL_PORT="${DB_PORT:-3306}"
MYSQL_USER="${DB_USERNAME:?请设置环境变量 DB_USERNAME}"
MYSQL_PASS="${DB_PASSWORD:?请设置环境变量 DB_PASSWORD}"
MYSQL_DB="${DB_DATABASE:?请设置环境变量 DB_DATABASE}"

# 迁移文件目录（脚本同级目录下的 migrations/）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MIGRATIONS_DIR="${SCRIPT_DIR}/migrations"

# --------------------------------------------
# mysql 客户端选择
# --------------------------------------------
MYSQL_CLIENT=""

# 尝试宿主机 mysql CLI
if command -v mysql &>/dev/null; then
  MYSQL_CLIENT="mysql"
  echo "🔌 使用宿主机 mysql CLI"
else
  # 尝试 docker run mysql:8
  if command -v docker &>/dev/null && docker image inspect mysql:8 &>/dev/null 2>&1; then
    MYSQL_CLIENT="docker run --rm --network host -i mysql:8 mysql"
    echo "🔌 使用 docker mysql:8"
  elif command -v docker &>/dev/null; then
    echo "🐳 拉取 mysql:8 镜像..."
    docker pull mysql:8 --quiet
    MYSQL_CLIENT="docker run --rm --network host -i mysql:8 mysql"
    echo "🔌 使用 docker mysql:8"
  else
    echo "❌ 未找到 mysql CLI，请安装 mysql 客户端或确保 Docker 可用"
    echo "   macOS: brew install mysql-client"
    echo "   Ubuntu: apt install mysql-client"
    exit 1
  fi
fi

# mysql 执行封装（自动注入连接参数）
mysql_exec() {
  # 使用 MYSQL_PWD 环境变量避免密码在命令行中暴露
  MYSQL_PWD="${MYSQL_PASS}" ${MYSQL_CLIENT} \
    -h"${MYSQL_HOST}" \
    -P"${MYSQL_PORT}" \
    -u"${MYSQL_USER}" \
    "${MYSQL_DB}" \
    "$@"
}

# --------------------------------------------
# 确保 schema_migrations 追踪表存在
# --------------------------------------------
echo "📋 检查迁移追踪表..."
mysql_exec <<'SQL'
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL COMMENT '迁移文件名',
  `checksum` char(64) NOT NULL COMMENT '文件 SHA256',
  `executed_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '执行时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据库迁移记录表';
SQL
echo "  ✅ 追踪表已就绪"

# --------------------------------------------
# 检查迁移文件目录
# --------------------------------------------
if [ ! -d "${MIGRATIONS_DIR}" ]; then
  echo "❌ 迁移文件目录不存在: ${MIGRATIONS_DIR}"
  exit 1
fi

# 统计文件数
MIGRATION_FILES=($(ls "${MIGRATIONS_DIR}"/*.sql 2>/dev/null | sort))
TOTAL="${#MIGRATION_FILES[@]}"

if [ "${TOTAL}" -eq 0 ]; then
  echo "ℹ️  没有待执行的迁移文件（${MIGRATIONS_DIR}/ 下无 *.sql）"
  exit 0
fi

echo "📦 共发现 ${TOTAL} 个迁移文件"

# --------------------------------------------
# 执行迁移
# --------------------------------------------
PENDING=0
SUCCESS=0
SKIPPED=0
FAILED=0

for f in "${MIGRATION_FILES[@]}"; do
  FILENAME=$(basename "${f}")
  CHECKSUM=$(sha256sum "${f}" | cut -d' ' -f1)

  # 检查是否已执行
  ALREADY=$(mysql_exec -N -e \
    "SELECT 1 FROM \`schema_migrations\` WHERE \`filename\` = '${FILENAME}'")

  if [ -n "${ALREADY}" ]; then
    echo "⏭  [${FILENAME}] 已执行，跳过"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  PENDING=$((PENDING + 1))
  echo "▶  [${FILENAME}] 执行中..."

  # 执行迁移 SQL
  if mysql_exec < "${f}"; then
    # 记录迁移
    mysql_exec -e \
      "INSERT INTO \`schema_migrations\` (\`filename\`, \`checksum\`) VALUES ('${FILENAME}', '${CHECKSUM}')"
    echo "  ✅ 完成"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ❌ 失败！请检查错误信息后重试"
    FAILED=$((FAILED + 1))
  fi
done

# --------------------------------------------
# 汇总报告
# --------------------------------------------
echo ""
echo "=========================================="
echo "📊 迁移执行汇总"
echo "   总计: ${TOTAL}"
echo "   跳过: ${SKIPPED}"
echo "   成功: ${SUCCESS}"
echo "   失败: ${FAILED}"
echo "=========================================="

if [ "${FAILED}" -gt 0 ]; then
  echo "❌ 有 ${FAILED} 个迁移失败，请检查后重新运行 migrate.sh"
  exit 1
fi

echo "✅ 数据库迁移全部完成"