---
name: deploy
description: 部署流程 — 部署前自检、Dockerfile 完整性检查、方案验证、部署后验证、反思检查
---

# Deploy Skill — 部署流程技能

## 概述

当用户要求执行部署、发布、上线、发版等操作时，调用此 skill。此 skill 不直接执行部署，而是在执行前后进行**自检检查**和**规则校验**，确保部署流程的完整性和可靠性，避免反复修复。

## 触发条件

用户输入包含以下关键词时触发：
- 部署、发布、上线、发版、deploy、release
- 提交 CI/CD 配置变更、修改部署脚本
- 推送 Dockerfile 变更

## 流程

### Phase 1: 部署前自检（Pre-flight Check）

在执行部署或推送部署相关变更前，逐项检查以下清单。**任一项未通过，不得继续执行部署**。

#### 1.0 本地代码质量检查（Pre-push Code Check）

**在推送任何代码之前**（无论是否涉及 CI/CD 变更），必须先执行本地类型检查。这是第一道防线，不要在 CI 才暴露类型错误。

```
□ 是否已执行全量类型检查？
   → 本地命令：pnpm type-check
   → 注意：pnpm dev 不会做类型检查，Vite 使用 esbuild 转译，跳过类型检查
   → 注意：pnpm build 虽然会跑 type-check，但它是与 vite-ssg build 并行运行的
     （run-p type-check "build-only"），有可能构建成功但你没注意到 type-check 的报错

□ 是否使用了 --noEmit 确保全量检查？
   → 本地 vue-tsc --build 是增量模式，可能因 .tsbuildinfo 缓存跳过部分文件
   → 建议在推送前执行：pnpm -C my-vue-app exec vue-tsc --build --noEmit
   → 这会强制全量重新检查，覆盖率与 CI 一致

□ 是否有未跟踪的文件包含了类型错误？
   → CI 的类型检查会覆盖所有 src/ 下的文件，包括未跟踪的新文件
   → 新增文件时尤其要注意，本地增量模式可能不会检查全新文件
```

#### 1.1 CI/CD 变更设计检查

当本次变更涉及 `.github/workflows/`、`.gitlab-ci.yml`、`Dockerfile`、`docker-compose.yml`、`scripts/` 目录时：

```
□ 本次变更是否涉及外部服务（ACR/镜像仓库/SSH 目标/CI 环境）？
   → 若是，是否已在本地或服务器上手动验证过这些服务可用？
   → 示例：先在服务器上执行 docker pull <acr-registry>/<namespace>/xbb-backend:latest 验证 ACR 可拉取

□ 本次变更是否新增/修改了环境变量？
   → 若是，是否已在 deploy.yml 的所有引用处同步更新？
   → 是否在 docker-compose.yml 中同步了环境变量？
   → 部署脚本中是否所有必要的环境变量都已 export？

□ 本次变更是否和本周之前的 CI/CD 变更是同一类问题？
   → 若是，这是第几次修改？第 3 次及以上 → 必须停下来，先写设计文档，再做 dry-run 验证

□ 是否有回滚方案？
   → 部署失败时，能否恢复到上一个稳定版本？
   → rollback.sh 是否能在不依赖外部服务的情况下执行？（本地镜像回滚）
```

#### 1.2 Dockerfile 完整性检查

当本次变更涉及 Dockerfile 时：

```
□ 构建依赖清单是否完整？
   Dockerfile 注释中是否列出了所有构建依赖项，包括：
   - 系统包（node 版本、pnpm 版本、系统工具）
   - 依赖文件（package.json、pnpm-lock.yaml）
   - 构建脚本（scripts/ 下的文件）
   - 静态资源（字体文件、assets/ 目录下的资源）
   - 运行时依赖（dotenv 在 dependencies 中，不在 devDependencies）

□ 是否一次性检查了所有可能的缺失项？
   禁止：改了一个点就推送，等 CI 跑完发现下一个点又炸
   应该：列出所有已知/可能的缺失项，一次性修复后再推送
```

#### 1.3 技术方案选型检查

当本次变更涉及技术方案变更（如镜像推送策略、预渲染方案、SSR 方案等）：

```
□ 是否做过可行性验证？
   → 涉及外部服务的变更，先在服务器上手动验证
   → 示例：镜像推送策略变更前，先在服务器上手动 docker pull 验证

□ 新方案是否解决了旧方案的根本问题？
   → 如果只是绕过一个障碍而没有解决根因，不要换方案
   → 示例：Puppeteer 预渲染 -> vite-ssg -> NestJS SSR，如果一开始就明确需要动态 SSR，就不会走弯路

□ 是否有评估矩阵？
   → 构建时间、运行时性能、维护成本、回滚能力
   → 不要做一半发现不行就换，先评估再实施
```

### Phase 2: 部署执行（由用户手动触发或 CI 自动触发）

部署执行由 CI/CD 流水线自动完成（GitHub Actions），此步骤不需要 Claude 干预。

### Phase 3: 部署后验证（Post-deploy Check）

部署完成后，验证以下内容：

```
□ CI 流水线是否全部通过？（check → build → deploy → verify）
   → 如果 build 或 check 失败，说明有代码问题，修复后重新推送

□ 部署后验证脚本（verify-deploy.sh）是否通过？
   → SEO 检查、安全头检查、SSR 检查
   → 如果验证失败但部署成功，需要手动确认服务状态

□ 是否已更新 :latest 标签？
   → 只有验证通过后才会更新 :latest
   → 验证失败时 :latest 保持旧版本，确保回滚可用

□ 部署版本是否已持久化？
   → current-version.txt 是否存在？
   → rollback.sh 是否已清理（新版本已验证，不再需要旧版本回滚）？

□ 延迟健康检查是否通过？
   → 部署后 30 秒再次确认服务状态
   → 后端 health endpoint 是否正常响应？
   → 前端 nginx 是否正常响应？
```

### Phase 4: 反思检查（反思提交）

适用于以下场景：
- 本次是同一问题的**第 3 次及以上修改**
- 部署完成后发现仍然有未修复的问题

```
□ 为什么前几次修改没有解决问题？
   → 是否没有找到根因，只是在修复表面症状？

□ 本次修改是否触及了根因？
   → 如果还不能确定根因，需要先排查再提交

□ 同类问题是否可能在其他地方也存在？
   → 示例：如果 dotenv 依赖缺失，是否还有其他 devDependencies 在运行时被引用？

□ 如何避免下次再出现同类问题？
   → 是否需要在 Dockerfile 注释中补充依赖清单？
   → 是否需要在 pre-push 钩子中增加检查？
```

## 禁止行为

- ❌ 没有通过部署前自检就执行部署
- ❌ 同一问题第 3 次修改时，没有停下来做反思检查
- ❌ 涉及外部服务的变更，没有先在本地/服务器上手动验证
- ❌ 改了一个 Docker 构建问题就推送，没有检查所有可能的缺失项
- ❌ 下午 5 点后提交 CI/CD 大规模变更（当天头脑不清醒时容易出连环补丁）
- ❌ 同类小修改不合并，改一个点推送一次，让 CI 重复跑

## 参考

- 部署流水线文件：`.github/workflows/deploy.yml`
- 部署后验证脚本：`scripts/verify-deploy.sh`
- Dockerfile（后端）：`my-nest-app/Dockerfile`
- Dockerfile（前端）：`my-vue-app/Dockerfile`
- Docker Compose：`docker-compose.yml`