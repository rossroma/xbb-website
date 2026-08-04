# ============================================
# Stage 1: Builder — 安装依赖 + 构建（含预渲染）
# ============================================
FROM node:22-alpine AS builder

# 安装 Chromium（预渲染脚本 puppeteer 需要）及系统依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 告诉 Puppeteer 使用系统安装的 Chromium（而非 macOS 默认路径）
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 安装 pnpm（版本锁定，与项目一致）
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# 复制 workspace 根文件（pnpm monorepo）
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 复制前端子项目
COPY my-vue-app/package.json my-vue-app/

# 安装前端依赖
RUN pnpm install --filter my-vue-app --frozen-lockfile

# 复制前端源码
COPY my-vue-app/ my-vue-app/

# 构建参数：API 地址（生产环境留空，由 nginx 反向代理；测试环境传入测试域名）
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# 构建 Vue 项目
RUN pnpm -C my-vue-app build

# ============================================
# Stage 2: Production — nginx 静态服务
# ============================================
FROM nginx:1.27-alpine AS production

# 安装 curl（健康检查需要）
RUN apk add --no-cache curl

# 复制自定义 nginx 配置
COPY my-vue-app/nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=builder /app/my-vue-app/dist/ /usr/share/nginx/html/

EXPOSE 80

# nginx 内置健康检查（直接检查进程）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]