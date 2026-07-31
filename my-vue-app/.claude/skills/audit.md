---
name: audit
description: 组件规范合规性审计 — 扫描组件目录，对照 DESIGN.md + Tailwind v4 + Web 组件标准 + CLAUDE.md 生成审计报告，并逐级修复问题
skill_type: workflow
version: 1.0.0
triggers:
  - 用户要求审计/检查/审查组件是否符合设计规范
  - 关键词：审计、合规检查、组件规范、设计令牌、audit、检查组件、规范审计
---

# /audit — 组件规范合规性审计

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill，无需用户显式输入 `/audit`：

- 要求审计/检查组件是否符合设计规范
- 关键词：「审计」「合规检查」「组件规范」「设计令牌」「检查组件」「规范审计」「audit」

## 审计维度

审计覆盖四个维度，每个维度有明确的检查项：

### 维度 A：DESIGN.md 设计令牌合规

| 检查项     | 规则                                                                  | 严重级别 |
| ---------- | --------------------------------------------------------------------- | -------- |
| 硬编码颜色 | 禁止 #hex、rgb()、rgba() 出现在 Tailwind 类或样式中                   | 🔴 P0    |
| 硬编码间距 | 禁止硬编码 px 值，优先使用 `--space-*` 令牌或 Tailwind spacing 工具类 | 🟡 P2    |
| 硬编码圆角 | 禁止硬编码 border-radius 值，使用 `rounded-*` 令牌                    | 🟡 P2    |
| 硬编码阴影 | 禁止硬编码 box-shadow 值，使用 `shadow-*` 令牌                        | 🟡 P2    |
| 硬编码字号 | 禁止硬编码 font-size 值，优先使用 `text-*` 排版令牌                   | 🟡 P2    |
| 硬编码行高 | 禁止硬编码 line-height 任意值，使用 `leading-*` 令牌                  | 🟢 P3    |
| 动效时长   | 使用 `duration-fast/normal/slow` 令牌                                 | 🟢 P3    |
| 缓动曲线   | 使用 `ease-in-out` 等标准曲线                                         | 🟢 P3    |

### 维度 B：Tailwind v4 规范合规

| 检查项                     | 规则                                                  | 严重级别 |
| -------------------------- | ----------------------------------------------------- | -------- |
| 无 `<style scoped>`        | 新组件禁止 `<style scoped>`，全部使用 Tailwind 工具类 | 🔴 P0    |
| `<script setup lang="ts">` | 必须使用 TypeScript Composition API                   | 🔴 P0    |
| TypeScript Props           | 使用 `defineProps<T>()` 类型声明                      | 🟡 P2    |
| Tailwind 类名有效性        | 无无效类名（如 `scale-1.04` 应为 `scale-[1.04]`）     | 🔴 P0    |
| 任意值使用                 | `bg-[...]`、`text-[...]` 等任意值是否可替换为令牌     | 🟢 P3    |

### 维度 C：Web 组件标准

| 检查项               | 规则                                                     | 严重级别 |
| -------------------- | -------------------------------------------------------- | -------- |
| `focus-visible` 样式 | 所有可交互元素必须有 `focus-visible:outline-*` 样式      | 🟡 P1    |
| `motion-reduce` 支持 | 有动效的组件必须支持 `motion-reduce:transition-none`     | 🟡 P1    |
| ARIA 属性            | 交互元素有 `aria-label`、`role`、`aria-checked` 等       | 🟡 P1    |
| 键盘导航             | 可点击元素支持 Enter/Space 键盘触发                      | 🟡 P1    |
| 语义化 HTML          | 使用正确的 HTML 标签（`<button>`、`<nav>`、`<article>`） | 🟢 P3    |
| 图片 `alt`           | 所有 `<img>` 有 `alt` 属性                               | 🟢 P3    |
| `role` 属性          | 状态组件有 `role="status"`/`role="alert"` 等             | 🟢 P3    |

### 维度 D：CLAUDE.md 开发规范

| 检查项       | 规则                                                             | 严重级别 |
| ------------ | ---------------------------------------------------------------- | -------- |
| 组件文件结构 | 遵循 `<script setup>` → `<template>` → 无 `<style>` 顺序         | 🟢 P3    |
| 优先复用     | 是否使用了现有 UI Kit 组件而非重复造轮子                         | 🟢 P3    |
| 文档同步     | `UI_KIT_SPEC.md` 与组件实现是否一致（仅限已记录的 6 个基础组件） | 🟡 P2    |
| 文档缺失     | 存在于 `ui/` 但未在 `UI_KIT_SPEC.md` 中记录的组件                | 🟡 P2    |

## 流程

### Phase 1：准备阶段

**目标**：加载设计规范文档，建立检查基线

1. 读取 `DESIGN.md` — 设计令牌体系、布局系统、动效规范
2. 读取 `tailwind.css` — @theme 令牌定义、@utility 工具类
3. 读取 `UI_KIT_SPEC.md` — 组件规格文档（**注意：仅覆盖 6 个基础组件，其余组件以此为参考模板，审计时以代码实现为准**）
4. 读取 `CLAUDE.md` — 开发规范
5. 扫描目标组件目录，列出所有 `.vue` 文件
6. **对比组件清单**：列出 `ui/` 目录中实际存在的组件 vs `UI_KIT_SPEC.md` 中已记录的组件，标记文档缺失项

### Phase 2：逐组件审计

**目标**：对每个组件执行四维度检查

对每个组件文件执行：

1. **静态扫描**（自动化）：

   ```bash
   # 检查硬编码颜色
   grep -n '#[0-9a-fA-F]\{3,6\}\|rgb(' <component>
   # 检查是否有 <style scoped>
   grep -n '<style' <component>
   # 检查 ARIA 属性
   grep -n 'role=\|aria-' <component>
   # 检查 motion-reduce
   grep -n 'motion-reduce' <component>
   # 检查 focus-visible
   grep -n 'focus-visible' <component>
   ```

2. **人工审查**（逐项对照）：
   - 对照 DESIGN.md 检查每个 Tailwind 类是否使用令牌
   - 检查 Props 定义是否使用 TypeScript 类型声明
   - 检查组件变体是否与文档一致
   - 检查动效是否符合 DESIGN.md Section 1.6

3. **记录问题**：按严重级别（P0/P1/P2/P3）分类记录

### Phase 3：生成审计报告

**目标**：输出结构化的审计报告，写入 `docs/COMPONENT_AUDIT_REPORT.md`

报告结构：

```
# 基础组件规范合规性审计报告

## 一、审计总览（表格：维度、通过率）
## 二、逐组件审计（每个组件：得分、检查项、问题列表）
## 三、全局问题汇总（按 P0/P1/P2/P3 分组）
## 四、规范覆盖度分析
## 五、最终评分（整体评分 + 各组件评分排行）
## 六、修复优先级建议
```

### Phase 4：修复问题（用户确认后）

**目标**：按优先级逐级修复发现的问题

**🚫 铁律：新增令牌需经用户确认**

修复顺序：

1. **P0（立即修复）**：无效类名、缺失 `<style scoped>`、硬编码颜色
2. **P1（询问后修复）**：`focus-visible`、`motion-reduce`、ARIA 属性
3. **P2（询问后修复）**：硬编码间距/圆角/字号、文档同步
4. **P3（可选修复）**：任意值提取为 `@utility`、代码风格优化

**令牌新增流程**（P2 涉及新令牌时）：

1. 提案：说明理由 + 使用场景 + 预计使用次数
2. 用户审批
3. 实施：更新 `tailwind.css` + `DESIGN.md` + 组件代码

### Phase 5：回归验证

**目标**：确保修复不引入新问题

```bash
pnpm type-check    # TypeScript 类型检查
pnpm lint          # ESLint + oxlint 检查
```

## 修复原则

1. **最小化修改**：只修改规范不合规的部分，不改变组件行为
2. **令牌优先**：能用现有令牌的不用任意值，需要新令牌的先提案
3. **设计文档为准**：当组件实现与 DESIGN.md 不一致时，以 DESIGN.md 为准（除非 DESIGN.md 已过时）
4. **百分比间距保留**：`gap-[2.5%]` 等已在 DESIGN.md 中明确规定的百分比值，不属于硬编码
5. **组件专用尺寸保留**：DESIGN.md Section 2 中规定的组件专用尺寸（如 MetricItem 65px），不属于硬编码

## 审计检查清单

每审计一个组件，必须逐项检查：

- [ ] 无 `<style scoped>` 块
- [ ] 使用 `<script setup lang="ts">`
- [ ] Props 使用 `defineProps<T>()` 类型声明
- [ ] 无硬编码颜色（#hex、rgb()、rgba()）
- [ ] 优先使用 Tailwind @theme 令牌（`bg-brand-primary`、`text-text-primary`）
- [ ] 间距使用 Tailwind spacing 工具类（`p-4`、`gap-6`）
- [ ] 圆角使用 `rounded-*` 令牌（`rounded-card`、`rounded-pill`）
- [ ] 阴影使用 `shadow-*` 令牌（`shadow-subtle`、`shadow-default`）
- [ ] 字号使用 `text-*` 排版令牌（`text-body`、`text-h2`）
- [ ] 动效时长使用 `duration-*` 令牌（`duration-fast`、`duration-normal`）
- [ ] 有动效的组件支持 `motion-reduce:transition-none`
- [ ] 可交互元素有 `focus-visible:outline-*` 样式
- [ ] 交互元素有 ARIA 属性（`aria-label`、`role` 等）
- [ ] 可点击元素支持键盘导航（Enter/Space）
- [ ] 图片有 `alt` 属性
- [ ] 状态组件有语义化 `role`（`role="status"`、`role="alert"`）
- [ ] 组件变体与 `UI_KIT_SPEC.md` 文档一致（仅限已记录组件；未记录组件以代码实现为准）
- [ ] Tailwind 类名均为有效语法（无 `scale-1.04` 等非法类名）

## 完成标准

- [ ] 四个维度全部审计完成
- [ ] 审计报告已写入 `docs/COMPONENT_AUDIT_REPORT.md`
- [ ] 用户确认修复方案
- [ ] P0 问题全部修复
- [ ] P1 问题全部修复（或用户确认跳过的已记录）
- [ ] 类型检查通过（`pnpm type-check`）
- [ ] Lint 检查通过（`pnpm lint`）
- [ ] 新增令牌已同步更新 `tailwind.css` + `DESIGN.md`
- [ ] 组件实现与 `UI_KIT_SPEC.md` 文档一致（已记录组件）/ 文档缺失项已标记（未记录组件）
