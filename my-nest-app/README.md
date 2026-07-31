# my-nest-app — 官网后端服务

基于 [NestJS](https://nestjs.com/) 构建的官网后端 REST API 服务，使用 TypeScript 开发，连接 MySQL 数据库，提供完整的内容管理、用户认证、文件上传等接口。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | NestJS 10 + TypeScript |
| 数据库 | MySQL 8 + TypeORM |
| 认证 | JWT + Passport |
| 密码加密 | bcrypt |
| 模板引擎 | Handlebars |
| 图片处理 | sharp |
| 验证码 | svg-captcha |
| 参数校验 | class-validator + class-transformer |

## 功能模块

| 模块 | 说明 |
|------|------|
| `auth` | 用户登录、注册、JWT 鉴权、验证码 |
| `article` | 文章的增删改查 |
| `category` | 文章分类管理 |
| `ads` | 广告位管理 |
| `gallery` | 图库管理 |
| `template` | Handlebars 页面模板管理 |
| `message` | 留言/消息管理 |
| `settings` | 网站全局配置 |
| `logs` | 操作日志 |
| `upload` | 文件上传（本地存储，sharp 压缩） |

## 目录结构

```
src/
├── main.ts                # 入口，启动 HTTP 服务
├── app.module.ts          # 根模块，注册所有子模块
├── common/                # 全局通用工具
│   ├── constants/         # 常量定义
│   ├── exceptions/        # 自定义异常
│   ├── filters/           # 全局异常过滤器
│   ├── interceptors/      # 响应格式拦截器
│   ├── interfaces/        # 通用接口类型
│   └── pipes/             # 全局验证管道
├── database/              # 数据库配置
└── modules/               # 业务模块（每模块含 controller/service/entity/dto）
    ├── auth/
    ├── article/
    ├── category/
    ├── ads/
    ├── gallery/
    ├── template/
    ├── message/
    ├── settings/
    ├── logs/
    └── upload/
uploads/                   # 上传文件存储目录（不纳入版本控制）
```

## 环境配置

在项目根目录创建 `.env` 文件，参考以下字段：

```env
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

> ⚠️ `.env` 文件已加入 `.gitignore`，**请勿提交到版本控制**。

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式（热重载）
pnpm run start:dev

# 生产模式
pnpm run build
pnpm run start:prod
```

## 测试

```bash
# 单元测试
pnpm run test

# 测试覆盖率
pnpm run test:cov

# E2E 测试
pnpm run test:e2e
```

## 代码规范

```bash
# 格式化
pnpm run format

# Lint 检查并自动修复
pnpm run lint
```
