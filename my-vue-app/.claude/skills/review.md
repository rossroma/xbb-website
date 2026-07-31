---
name: review
description: 代码审查标准化流程 — 变更扫描 → 正确性 → 架构 → 复用 → 规范 → SEO → 文档一致性 → 审查报告
skill_type: workflow
version: 1.1.0
triggers:
  - 用户要求审查代码、review 变更
  - 关键词：审查、review、检查代码、代码质量、帮我看看代码
---

# /review — 代码审查流程

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill，无需用户显式输入 `/review`：

- 要求审查代码、review 变更、检查代码质量
- 关键词：「审查」「review」「检查代码」「代码质量」「帮我看看代码」

> **注意**：`/review` 是独立的审查流程，不修改代码。`/component`、`/page`、`/fix` 流程中内置的审查步骤（铁律 #3）仍需执行，但 `/review` 可用于任意时刻的独立审查。

## 流程

### Phase 1：变更扫描

**目标**：确定审查范围

```bash
git diff --stat          # 查看变更文件
git diff                 # 查看变更内容
git log --oneline -5     # 查看最近提交
```

**输出**：变更文件清单 + 变更概要

### Phase 2：正确性审查

**要点**：

- 逻辑是否正确处理了边界情况（空数据、null、undefined）
- 异常处理是否完整（API 失败、网络超时）
- 条件分支是否覆盖所有情况
- 类型定义是否准确（无 `any` 滥用）

### Phase 3：架构审查

**要点**：

- 组件分层是否正确（ui → business → layout → page）
- 是否存在循环依赖
- 组件职责是否单一
- 页面是否包含本应属于组件的逻辑

### Phase 4：复用审查

**要点**：

- 是否有可复用的现有组件/工具函数被忽略
- 新组件是否可以进一步抽象为 UI Kit
- 是否存在重复代码（相似逻辑在不同文件中）

### Phase 5：规范审查

**要点**：

- 是否使用 `<script setup lang="ts">` + `defineProps<T>()` / `defineEmits<T>()`
- 是否使用 Tailwind 工具类（无 `<style scoped>`）
- 是否遵循 `DESIGN.md` 设计令牌（无硬编码颜色/间距/圆角/阴影）
- 是否包含 ARIA 属性和 `motion-reduce` 动效关怀
- 图片是否有 `alt` 属性
- 链接文本是否有描述性

### Phase 6：SEO 审查

**要点**（详见 `.claude/memory/seo.md`）：

- 页面是否有 `<title>`、`<meta description>`、`<meta keywords>`
- 是否有且仅有一个 `<h1>`，标题层级不跳级
- 是否使用语义化 HTML 标签
- JSON-LD 结构化数据是否正确
- Canonical URL 是否正确

### Phase 7：文档一致性审查

**要点**：

- 路由变更是否同步到 `README.md` 和 `architecture.md`
- 新增/修改命令是否同步到 `CLAUDE.md` 和 `README.md`
- 组件变更是否同步到 `docs/UI_KIT_SPEC.md` 和 `DESIGN.md`
- 配置变更是否同步到 `CLAUDE.md` 自动化验证章节
- 可使用 `pnpm check-docs` 快速检查

### Phase 8：可视化审查

**目标**：通过浏览器截图验证变更在真实渲染环境中的视觉效果

**触发条件**：当变更涉及 `src/client/components/` 或 `src/client/views/` 下的 `.vue` 文件时触发。

**步骤**：

1. **确认环境**：开发服务器已启动，gstack browse 工具已就绪

2. **确定审查范围**：
   - 变更了组件 → 截图 `/ui-kit` 页面中对应组件的展示区块
   - 变更了页面 → 截图目标页面的三个视口
   - 变更了布局组件 → 截图首页（验证全局布局效果）

3. **执行截图**：

   ```bash
   BROWSE="$HOME/.claude/skills/gstack/browse/dist/browse"
   $BROWSE goto http://localhost:5173/<路由>
   $BROWSE responsive /tmp/review-<target>
   ```

4. **基线对比**（如有基线截图）：

   ```bash
   # 与基线截图做视觉 diff
   diff .claude/screenshots/baseline/<target>-desktop.png /tmp/review-<target>-desktop.png
   ```

5. **检查清单**：
   - [ ] 变更后组件渲染正常（无白屏、无错位、无样式丢失）
   - [ ] 三个视口下布局正确
   - [ ] 控制台无新增错误
   - [ ] 与基线对比无意外视觉回归（如有基线）
   - [ ] 品牌色/设计令牌使用正确（肉眼验证）

**审查要点**：

- 新增组件是否与设计稿一致
- 修改组件是否引入视觉回归
- 响应式断点是否正确
- 交互状态（hover/focus/disabled）是否正确

### Phase 9：审查报告

**输出格式**：

```
## 代码审查报告

### 审查范围
- 变更文件：X 个
- 审查时间：YYYY-MM-DD

### 发现的问题
| 优先级 | 类别 | 文件:行号 | 问题描述 | 建议 |
|--------|------|-----------|----------|------|
| P0     | 正确性 | xxx.vue:42 | 未处理空数组 | 添加 v-if 守卫 |
| P1     | 规范 | xxx.vue:15 | 硬编码颜色 | 使用 @theme 令牌 |
| P2     | SEO | xxx.vue:8 | 缺少 meta description | 添加 useHead |

### 审查结论
- P0（阻塞）：X 个 — 必须修复
- P1（重要）：X 个 — 建议修复
- P2（建议）：X 个 — 可选修复
```

**优先级定义**：

- **P0**：功能错误、数据丢失、安全漏洞、构建失败
- **P1**：违反规范、影响可维护性、SEO 缺陷
- **P2**：改进建议、代码风格、非关键优化

**如有流程问题，记录到 `.claude/memory/state-problem-log.md`。**

## 完成标准

- [ ] 变更范围已扫描
- [ ] 八个审查维度已覆盖
- [ ] 可视化审查已完成（涉及组件/页面变更时）
- [ ] 问题已按优先级分类
- [ ] 审查报告已输出
- [ ] 流程问题已记录（如有）
