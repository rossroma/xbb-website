# CLAUDE.md

## 项目概述

销帮帮 CRM 官网后端 — 基于 NestJS 10 + TypeScript 构建的 REST API 服务，为前端（`my-vue-app`）提供数据接口。

- **框架**: NestJS 10 + TypeScript
- **数据库**: MySQL 8 + TypeORM 0.3
- **认证**: JWT + Passport
- **参数校验**: class-validator + class-transformer
- **图片处理**: sharp
- **模板引擎**: Handlebars
- **包管理器**: pnpm

## 核心规则

- **中文输出**：所有对话、代码注释、文档内容均使用中文。
- **模块化优先**：每个业务模块独立目录，包含完整的 controller / service / entity / dto。
- **统一响应格式**：所有 API 返回 `ResponseResult` 格式（`{ code, message, data }`），由 `ResponseInterceptor` 自动包装。
- **异常统一处理**：业务异常使用 `BusinessException`，由 `HttpExceptionFilter` 统一捕获。
- **DTO 校验**：所有请求体使用 DTO 类 + `class-validator` 装饰器进行参数校验。
- **双端分离**：每个模块分 `admin/`（管理端）和 `client/`（客户端）子目录，接口路径前缀分别为 `/admin/` 和 `/client/`。
- **JWT 全局守卫**：默认所有接口需要登录，使用 `@Public()` 装饰器标记公开接口。

## 目录结构

```
src/
├── main.ts                     # 入口，注册全局过滤器/拦截器/管道/守卫
├── app.module.ts               # 根模块，注册所有子模块和全局配置
├── app.controller.ts           # 根控制器（健康检查等）
├── app.service.ts
├── common/                     # 全局通用工具
│   ├── constants/              # 响应码常量（RESPONSE_CODE）
│   ├── exceptions/             # 自定义异常（BusinessException）
│   ├── filters/                # 全局异常过滤器（HttpExceptionFilter）
│   ├── interceptors/           # 日志拦截器 + 响应包装拦截器
│   ├── interfaces/             # 统一响应接口（ResponseResult）
│   └── pipes/                  # 全局验证管道（ValidationPipe）
├── database/                   # 数据库配置
│   ├── data-source.ts          # TypeORM 数据源（运行时）
│   └── data-source-cli.ts      # TypeORM 数据源（CLI 迁移用）
└── modules/                    # 业务模块
    ├── auth/                   # 认证模块（登录、JWT、管理员管理）
    ├── article/                # 文章模块
    ├── category/               # 分类模块
    ├── ads/                    # 广告位模块
    ├── gallery/                # 图库模块
    ├── template/               # 页面模板模块
    ├── message/                # 留言/消息模块
    ├── settings/               # 网站设置模块
    ├── case/                   # 客户案例模块
    ├── partner/                # 渠道合作模块
    ├── sms/                    # 短信验证码模块
    └── upload/                 # 文件上传模块（阿里云 OSS 存储）
```

## 模块开发规范

### 标准模块结构

每个业务模块遵循以下目录结构：

```
modules/<module-name>/
├── <module-name>.module.ts     # 模块定义，注册 controller/service/entity
├── <module-name>.service.ts    # 业务逻辑层
├── admin/                      # 管理端控制器（需 JWT 认证）
│   └── admin-<name>.controller.ts
├── client/                     # 客户端控制器（公开或限流）
│   └── client-<name>.controller.ts
├── dto/                        # 数据传输对象
│   ├── create-<name>.dto.ts    # 创建请求体
│   ├── update-<name>.dto.ts    # 更新请求体
│   ├── query-<name>.dto.ts     # 查询参数
│   └── <name>-response.dto.ts  # 响应格式
└── entities/                   # TypeORM 实体定义
    └── <name>.entity.ts
```

### Controller 规范

```typescript
// 管理端控制器 — 需要 JWT 认证
@Controller('admin/articles')
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() dto: CreateArticleDto, @CurrentUser() user: Admin) {
    return this.articleService.create(dto, user.id);
  }
}

// 客户端控制器 — 使用 @Public() 标记公开
@Controller('client/articles')
export class ClientArticleController {
  @Get()
  @Public()
  async findAll(@Query() dto: QueryArticleDto) {
    return this.articleService.findAllForClient(dto);
  }
}
```

### Service 规范

- 使用 `@InjectRepository()` 注入 Repository
- 使用 `createQueryBuilder` 构建复杂查询
- 资源不存在时抛出 `BusinessException(RESPONSE_CODE.RESOURCE_NOT_FOUND, 'xxx不存在')`
- 区分管理端和客户端方法（如 `findAll()` vs `findAllForClient()`）

### Entity 规范

- 使用 TypeORM 装饰器（`@Entity`、`@Column`、`@PrimaryGeneratedColumn`）
- 时间戳字段使用 Unix 秒级时间戳（`Math.floor(Date.now() / 1000)`）
- 时区统一使用 UTC（`timezone: 'Z'`）

### 响应格式

所有接口统一返回：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

错误响应：

```json
{
  "code": 404,
  "message": "文章不存在",
  "data": null
}
```

### 公开接口标记

使用 `@Public()` 装饰器标记不需要 JWT 认证的接口：

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get()
async findAll() { ... }
```

## API 路由总览

| 路由前缀 | 认证 | 说明 |
|----------|------|------|
| `/admin/auth/*` | 公开（登录） | 管理员登录、登出 |
| `/admin/admins/*` | JWT | 管理员 CRUD |
| `/admin/admin-groups/*` | JWT | 管理员分组管理 |
| `/admin/articles/*` | JWT | 文章管理 |
| `/client/articles/*` | 公开 | 客户端文章列表/详情 |
| `/admin/categories/*` | JWT | 分类管理 |
| `/client/categories/*` | 公开 | 客户端分类列表 |
| `/admin/ads/*` | JWT | 广告位管理 |
| `/client/ads/*` | 公开 | 客户端广告位 |
| `/admin/gallery/*` | JWT | 图库管理 |
| `/client/gallery/*` | 公开 | 客户端图库 |
| `/admin/templates/*` | JWT | 模板管理 |
| `/client/templates/*` | 公开 | 客户端模板页面 |
| `/admin/messages/*` | JWT | 留言管理 |
| `/client/messages/*` | 公开 | 提交留言/试用申请 |
| `/admin/settings/*` | JWT | 网站设置 |
| `/client/settings/*` | 公开 | 客户端设置 |
| `/client/cases/*` | 公开 | 客户案例 |
| `/client/partners/*` | 公开 | 渠道合作 |
| `/client/sms/*` | 公开 | 短信验证码 |
| `/upload/*` | JWT | 文件上传（上传至阿里云 OSS，返回完整 URL） |

## 常用命令

```bash
pnpm start:dev              # 开发模式（热重载，默认端口 3000）
pnpm build                  # 生产构建
pnpm start:prod             # 生产模式启动
pnpm test                   # 单元测试（Jest）
pnpm test:cov               # 测试覆盖率
pnpm test:e2e               # E2E 测试
pnpm lint                   # ESLint 检查并修复
pnpm format                 # Prettier 格式化
pnpm migration:generate     # 生成迁移文件
pnpm migration:run          # 执行迁移
pnpm migration:revert       # 回滚迁移
```

## 环境变量

在 `my-nest-app/` 根目录创建 `.env` 文件：

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=xbb_website

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 阿里云 OSS（图片上传）
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=your-bucket-name
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
```

> ⚠️ `.env` 已加入 `.gitignore`，请勿提交到版本控制。

## 参考文档

| 文档 | 内容 |
|------|------|
| `README.md` | 技术栈、快速开始、环境配置 |
| 前端 `CLAUDE.md` | 前端开发规范（双端协同参考） |
| 前端 `DESIGN.md` | 设计规范（全项目共享） |
| `.github/workflows/deploy.yml` | GitHub Actions 部署流水线 |