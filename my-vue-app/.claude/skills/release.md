---
name: release
description: 版本发布检查流程 — 门禁检查 → 代码审查 → 变更日志 → 构建验证 → Go/No-Go
skill_type: workflow
version: 1.0.0
triggers:
  - 用户准备发布、发版、上线
  - 关键词：发布、发版、上线、release、部署、打包
---

# /release — 版本发布检查

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill，无需用户显式输入 `/release`：

- 准备发布版本、部署上线
- 关键词：「发布」「发版」「上线」「release」「部署」「打包」「能发吗」

## 流程

### Phase 1：工作区检查

**目标**：确认工作区干净，无未提交变更

```bash
git status --porcelain     # 工作区必须干净
git log origin/main..HEAD --oneline  # 待发布 commit 列表
```

**阻塞项**：未提交的变更、未推送的 commit

### Phase 2：门禁检查

**目标**：运行全部质量门禁

```bash
pnpm type-check         # TypeScript 类型检查
pnpm lint               # ESLint + oxlint
pnpm test:unit          # Vitest 单元测试
pnpm test:e2e           # Cypress E2E 测试
pnpm build              # 生产构建
```

**🚫 铁律 #2：任何失败都是阻塞项**

### Phase 3：代码审查

**目标**：审查 `git diff origin/main..HEAD` 的变更

**快速审查要点**：

- 调试代码（`console.log`、`debugger`）
- 硬编码密钥/密码
- 遗留文件误修改（铁律 #7）
- TODO/FIXME 是否已处理

### Phase 4：变更日志

**目标**：总结本次发布的变更内容

**输出格式**：

```
## 变更摘要
- 新增组件：X 个（Button, Card, ...）
- 新增页面：X 个（Home, Products, ...）
- 修复问题：X 个
- 文档更新：X 处
```

### Phase 5：构建验证与可视化对比

**目标**：验证生产构建产物，并进行关键页面截图对比

```bash
pnpm build              # 确保构建成功
pnpm preview            # 本地预览生产包
```

**验证步骤**：

#### 5.1 基础验证

1. 访问关键路由（首页、产品页），确认无白屏
2. 检查 SEO 元数据（title、description）
3. 检查控制台无报错

#### 5.2 可视化对比（关键页面截图对比）

**前置条件**：gstack browse 工具已就绪，`.claude/screenshots/baseline/` 中存在基线截图。

**步骤**：

1. **对关键页面执行截图**：

   ```bash
   BROWSE="$HOME/.claude/skills/gstack/browse/dist/browse"

   # 首页
   $BROWSE goto http://localhost:4173/
   $BROWSE responsive /tmp/release-home

   # UI Kit 展示页
   $BROWSE goto http://localhost:4173/ui-kit
   $BROWSE responsive /tmp/release-uikit
   ```

2. **与基线对比**（如存在基线）：

   ```bash
   for page in home uikit; do
     for viewport in desktop tablet mobile; do
       diff .claude/screenshots/baseline/${page}-${viewport}.png \
            /tmp/release-${page}-${viewport}.png
     done
   done
   ```

3. **对比检查清单**：
   - [ ] 首页三视口渲染与基线一致
   - [ ] UI Kit 展示页组件渲染与基线一致
   - [ ] 无视觉回归（颜色、间距、布局无异常变化）
   - [ ] 控制台无新增错误

4. **无基线时**：将当前截图保存为基线，作为后续发布的对比基准。

5. **对比结果**：纳入 Phase 6 Go/No-Go 判定，视觉回归属于阻塞项。

### Phase 6：Go/No-Go

**汇总所有检查结果**：

| 检查项     | 状态  | 说明                   |
| ---------- | ----- | ---------------------- |
| 工作区干净 | ✅/❌ |                        |
| 类型检查   | ✅/❌ |                        |
| Lint       | ✅/❌ |                        |
| 单元测试   | ✅/❌ |                        |
| E2E 测试   | ✅/❌ |                        |
| 构建成功   | ✅/❌ |                        |
| 代码审查   | ✅/❌ |                        |
| 基础验证   | ✅/❌ |                        |
| 可视化对比 | ✅/❌ | 关键页面截图与基线对比 |

**判定**：

- **Go** ✅ — 全部通过，输出 `pnpm build` 产物路径，可以部署
- **No-Go** ❌ — 存在阻塞项，输出需修复的问题清单

**如有流程问题，记录到 `.claude/memory/state-problem-log.md`。**

## 完成标准

- [ ] 工作区干净
- [ ] 所有门禁通过（type-check + lint + unit + e2e + build）
- [ ] 代码审查无阻塞项
- [ ] 变更日志已输出
- [ ] 构建验证通过
- [ ] 可视化对比通过（关键页面截图与基线一致）
- [ ] Go/No-Go 结论已给出
- [ ] 流程问题已记录（如有）
