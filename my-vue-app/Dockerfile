# ============================================
# Stage 1: Builder — 安装依赖 + 构建（含预渲染）
# ============================================
# 使用 Puppeteer 官方镜像，内置 Node.js + Chromium + 所有依赖
FROM ghcr.io/puppeteer/puppeteer:latest AS builder

# 安装 pnpm
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm@10.33.0

WORKDIR /app

# 复制 workspace 根文件（pnpm monorepo）
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 复制前端子项目
COPY my-vue-app/package.json my-vue-app/

# 安装前端依赖
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install --filter my-vue-app --frozen-lockfile

# 复制前端源码
COPY my-vue-app/ my-vue-app/

# 构建参数：API 地址
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# 构建 Vue 项目
RUN pnpm -C my-vue-app build

# ============================================
# Stage 2: Production — nginx 静态服务
# ============================================
FROM nginx:1.27-alpine AS production

# 安装 curl（健康检查需要）
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache curl

# 复制自定义 nginx 配置
COPY my-vue-app/nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=builder /app/my-vue-app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]