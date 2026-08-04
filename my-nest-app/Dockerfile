# ============================================
# Stage 1: Builder — 安装依赖 + 构建
# ============================================
FROM node:22-alpine AS builder

# bcrypt 编译需要 python3 / make / g++
RUN apk add --no-cache python3 make g++

# 安装 pnpm（版本锁定，与项目一致）
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# 复制 workspace 根文件（pnpm monorepo）
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 复制后端子项目
COPY my-nest-app/package.json my-nest-app/
COPY my-nest-app/tsconfig*.json my-nest-app/
COPY my-nest-app/nest-cli.json my-nest-app/

# 安装后端依赖（利用 pnpm workspace filter）
RUN pnpm install --filter my-nest-app --frozen-lockfile

# 复制后端源码
COPY my-nest-app/src/ my-nest-app/src/

# 构建 NestJS 项目
RUN pnpm -C my-nest-app build

# ============================================
# Stage 2: Production — 最小运行时
# ============================================
FROM node:22-alpine AS production

# 安装 tini（信号处理，优雅关闭）
RUN apk add --no-cache tini curl

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# 复制 workspace 根文件
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 复制后端 package.json
COPY my-nest-app/package.json my-nest-app/

# 仅安装生产依赖
RUN pnpm install --filter my-nest-app --frozen-lockfile --prod

# 从 builder 复制构建产物
COPY --from=builder /app/my-nest-app/dist/ my-nest-app/dist/

# 创建上传目录
RUN mkdir -p /app/my-nest-app/uploads && chown -R node:node /app/my-nest-app/uploads

# 切换到非 root 用户
USER node

# 工作目录切换到后端
WORKDIR /app/my-nest-app

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/v1/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]