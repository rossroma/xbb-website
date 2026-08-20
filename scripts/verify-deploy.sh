#!/usr/bin/env bash
# ==========================================
# 部署后验证脚本 — SEO / SSR / 安全头 / JSON-LD
# ==========================================
# 用法：
#   测试环境: bash scripts/verify-deploy.sh --test
#   生产环境: bash scripts/verify-deploy.sh --prod
#   CI 调用:  bash scripts/verify-deploy.sh --test
# ==========================================

set -euo pipefail

MODE="${1:---test}"
FRONTEND_PORT="${FRONTEND_PORT:-80}"
if [ "$MODE" = "--prod" ]; then
  BASE_URL="http://localhost:${FRONTEND_PORT}"
  LABEL="生产环境"
else
  BASE_URL="http://localhost:${FRONTEND_PORT}"
  LABEL="测试环境"
fi

PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local description="$1"
  local result="$2"
  local detail="${3:-}"
  if [ "$result" = "pass" ]; then
    echo -e "  ${GREEN}✅${NC} $description"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌${NC} $description"
    [ -n "$detail" ] && echo -e "     ${YELLOW}→${NC} $detail"
    FAIL=$((FAIL + 1))
  fi
}

CURL_OPTS="-s -o /dev/null -w '%{http_code}' --max-time 10"

echo ""
echo "============================================"
echo " 销帮帮CRM 部署验证 — ${LABEL}"
echo " 目标: ${BASE_URL}"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"

# =============================================
# 1. 基础可达性
# =============================================
echo ""
echo "📡 基础可达性"

HTTP_CODE=$(eval "curl $CURL_OPTS ${BASE_URL}/")
if [ "$HTTP_CODE" = "200" ]; then
  check "首页 HTTP 200" "pass"
else
  check "首页 HTTP 200" "fail" "返回 ${HTTP_CODE}"
fi

# =============================================
# 2. robots.txt / sitemap.xml
# =============================================
echo ""
echo "🤖 爬虫基础设施"

ROBOTS=$(curl -s --max-time 10 "${BASE_URL}/robots.txt")
if echo "$ROBOTS" | grep -q "User-agent"; then
  check "robots.txt 格式正确" "pass"
else
  check "robots.txt 格式正确" "fail" "返回非 robots.txt 内容（可能是 HTML）"
fi

SITEMAP=$(curl -s --max-time 10 "${BASE_URL}/sitemap.xml")
if echo "$SITEMAP" | grep -q '<urlset'; then
  SITEMAP_COUNT=$(echo "$SITEMAP" | grep -c '<url>' || true)
  check "sitemap.xml 格式正确 (${SITEMAP_COUNT} 个 URL)" "pass"
else
  check "sitemap.xml 格式正确" "fail" "返回非 XML 内容"
fi

# =============================================
# 3. HTML 文档结构
# =============================================
echo ""
echo "📄 HTML 文档结构"

INDEX_HTML=$(curl -s --max-time 10 "${BASE_URL}/")

# lang 属性
if echo "$INDEX_HTML" | grep -q 'lang="zh-CN"'; then
  check 'lang="zh-CN"' "pass"
else
  ACTUAL_LANG=$(echo "$INDEX_HTML" | grep -oP 'lang="[^"]*"' | head -1 || echo "未找到")
  check 'lang="zh-CN"' "fail" "当前: ${ACTUAL_LANG}"
fi

# title
if echo "$INDEX_HTML" | grep -q '<title>'; then
  TITLE=$(echo "$INDEX_HTML" | grep -oP '<title>\K[^<]+' | head -1)
  check "title 标签存在" "pass" "内容: ${TITLE}"
else
  check "title 标签存在" "fail" "缺少 <title>"
fi

# meta description
if echo "$INDEX_HTML" | grep -q 'name="description"'; then
  DESC=$(echo "$INDEX_HTML" | grep -oP 'content="\K[^"]+' | head -1)
  DESC_LEN=${#DESC}
  if [ "$DESC_LEN" -ge 80 ] && [ "$DESC_LEN" -le 320 ]; then
    check "meta description (${DESC_LEN} 字符)" "pass"
  else
    check "meta description (${DESC_LEN} 字符)" "fail" "建议 120-160 字符"
  fi
else
  check "meta description 存在" "fail" "缺少 meta description"
fi

# H1 标签
H1_COUNT=$(echo "$INDEX_HTML" | grep -c '<h1' || true)
if [ "$H1_COUNT" -eq 1 ]; then
  H1_TEXT=$(echo "$INDEX_HTML" | grep -oP '<h1[^>]*>\K[^<]+' | head -1)
  check "H1 标签 (1 个)" "pass" "内容: ${H1_TEXT}"
elif [ "$H1_COUNT" -eq 0 ]; then
  check "H1 标签" "fail" "缺少 H1 标签"
else
  check "H1 标签" "fail" "存在 ${H1_COUNT} 个 H1（应该只有 1 个）"
fi

# canonical 标签
if echo "$INDEX_HTML" | grep -q 'rel="canonical"'; then
  CANONICAL=$(echo "$INDEX_HTML" | grep -oP 'href="\K[^"]+' | head -1)
  check "canonical 标签" "pass" "href: ${CANONICAL}"
else
  check "canonical 标签" "fail" "缺少 canonical"
fi

# =============================================
# 4. JSON-LD 结构化数据
# =============================================
echo ""
echo "📊 JSON-LD 结构化数据"

JSON_LD_COUNT=$(echo "$INDEX_HTML" | grep -c 'application/ld+json' || true)
if [ "$JSON_LD_COUNT" -gt 0 ]; then
  # 检查 JSON-LD 是否被错误渲染为 children 属性
  if echo "$INDEX_HTML" | grep -q 'children="'; then
    check "JSON-LD 脚本标签 (${JSON_LD_COUNT} 个)" "fail" "JSON-LD 被渲染为 children 属性，搜索引擎无法解析"
  else
    # 尝试提取第一个 JSON-LD 并验证 JSON 有效性
    JSON_LD=$(echo "$INDEX_HTML" | grep -oP '<script type="application/ld\+json">\K[^<]+' | head -1)
    if [ -n "$JSON_LD" ] && echo "$JSON_LD" | python3 -m json.tool > /dev/null 2>&1; then
      check "JSON-LD 脚本标签 (${JSON_LD_COUNT} 个) & 有效 JSON" "pass"
    else
      check "JSON-LD 脚本标签 (${JSON_LD_COUNT} 个)" "fail" "JSON 格式无效或提取失败"
    fi
  fi
else
  check "JSON-LD 脚本标签" "fail" "缺少 <script type=\"application/ld+json\">"
fi

# =============================================
# 5. Open Graph / Twitter Card
# =============================================
echo ""
echo "📱 社交分享标签"

check "og:title"      $(echo "$INDEX_HTML" | grep -q 'og:title'       && echo "pass" || echo "fail")
check "og:description" $(echo "$INDEX_HTML" | grep -q 'og:description' && echo "pass" || echo "fail")
check "og:image"      $(echo "$INDEX_HTML" | grep -q 'og:image'       && echo "pass" || echo "fail" "分享时缺少预览图")
check "og:url"        $(echo "$INDEX_HTML" | grep -q 'og:url'         && echo "pass" || echo "fail")
check "og:site_name"  $(echo "$INDEX_HTML" | grep -q 'og:site_name'   && echo "pass" || echo "fail")
check "twitter:card"  $(echo "$INDEX_HTML" | grep -q 'twitter:card'   && echo "pass" || echo "fail")

# =============================================
# 6. 关键页面内容独立性（防重复内容）
# =============================================
echo ""
echo "🔍 页面内容独立性"

PAGES_TO_CHECK=(
  "/chanpin"
  "/hangyeanli"
  "/mianfeishiyong"
  "/gongsijianjie"
)

HOME_TITLE=$(echo "$INDEX_HTML" | grep -oP '<title>\K[^<]+' | head -1)

for page in "${PAGES_TO_CHECK[@]}"; do
  PAGE_HTML=$(curl -s --max-time 10 "${BASE_URL}${page}")
  PAGE_TITLE=$(echo "$PAGE_HTML" | grep -oP '<title>\K[^<]+' | head -1 || echo "无")

  if [ "$PAGE_TITLE" != "$HOME_TITLE" ] && [ -n "$PAGE_TITLE" ] && [ "$PAGE_TITLE" != "无" ]; then
    check "${page} 独立 title" "pass" "标题: ${PAGE_TITLE}"
  else
    check "${page} 独立 title" "fail" "与首页相同或缺失"
  fi
done

# =============================================
# 7. SSR 端点（后端预渲染）
# =============================================
echo ""
echo "🖥️  SSR 端点"

SSR_ENDPOINTS=(
  "/v1/ssr/gongsidongtai/1"
  "/v1/ssr/hangyeanli/1"
  "/v1/ssr/zhishiwenda/1"
)

for endpoint in "${SSR_ENDPOINTS[@]}"; do
  HTTP_CODE=$(eval "curl $CURL_OPTS ${BASE_URL}${endpoint}")
  if [ "$HTTP_CODE" = "200" ]; then
    SSR_HTML=$(curl -s --max-time 10 "${BASE_URL}${endpoint}")
    if echo "$SSR_HTML" | grep -q '<!DOCTYPE html>'; then
      SSR_TITLE=$(echo "$SSR_HTML" | grep -oP '<title>\K[^<]+' | head -1 || echo "无")
      check "SSR ${endpoint}" "pass" "title: ${SSR_TITLE}"
    else
      check "SSR ${endpoint}" "fail" "返回的不是 HTML"
    fi
  else
    check "SSR ${endpoint}" "fail" "HTTP ${HTTP_CODE}"
  fi
done

# =============================================
# 8. 安全响应头
# =============================================
echo ""
echo "🔒 安全响应头"

RESPONSE_HEADERS=$(curl -sI --max-time 10 "${BASE_URL}/")

check_header() {
  local header="$1"
  local desc="$2"
  if echo "$RESPONSE_HEADERS" | grep -qi "$header"; then
    check "$desc" "pass"
  else
    check "$desc" "fail"
  fi
}

check_header "X-Frame-Options" "X-Frame-Options"
check_header "X-Content-Type-Options" "X-Content-Type-Options"
check_header "X-XSS-Protection" "X-XSS-Protection"
check_header "Referrer-Policy" "Referrer-Policy"
# HSTS 仅生产环境 HTTPS 下有意义
if [ "$MODE" = "--prod" ]; then
  check_header "Strict-Transport-Security" "HSTS (仅 HTTPS)"
else
  check "HSTS (仅 HTTPS 环境需要)" "pass" "测试环境跳过"
fi

# =============================================
# 9. 图片 alt 属性覆盖率
# =============================================
echo ""
echo "🖼️  图片 alt 属性"

IMG_TOTAL=$(echo "$INDEX_HTML" | grep -c '<img' || true)
IMG_WITH_ALT=$(echo "$INDEX_HTML" | grep -c '<img[^>]*alt="[^"]*"' || true)
if [ "$IMG_TOTAL" -gt 0 ]; then
  ALT_PCT=$((IMG_WITH_ALT * 100 / IMG_TOTAL))
  if [ "$ALT_PCT" -ge 90 ]; then
    check "图片 alt 覆盖率 ${ALT_PCT}% (${IMG_WITH_ALT}/${IMG_TOTAL})" "pass"
  else
    check "图片 alt 覆盖率 ${ALT_PCT}% (${IMG_WITH_ALT}/${IMG_TOTAL})" "fail" "建议 ≥ 90%"
  fi
else
  check "图片 alt 覆盖率" "pass" "无图片"
fi

# =============================================
# 结果汇总
# =============================================
echo ""
echo "============================================"
TOTAL=$((PASS + FAIL))
echo " 验证结果: ${PASS}/${TOTAL} 通过"
if [ "$FAIL" -gt 0 ]; then
  echo -e " ${RED}${FAIL} 项未通过${NC}"
  echo ""
  echo "⚠️  请检查以上未通过项，修复后重新部署。"
  exit 1
else
  echo -e " ${GREEN}全部通过 ✅${NC}"
  echo ""
  echo "部署验证通过，可以上线。"
fi
echo "============================================"