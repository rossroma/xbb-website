---
name: rules
description: 核心铁律 — 所有任务必须遵守的硬约束，新增/修改/删除必须经用户确认
metadata:
  type: project
  updated: 2026-07-24
---

# 核心铁律

以下规则适用于所有开发任务，不可跳过。

---

## 1. [铁律] 设计方案经用户确认后，方可修改代码

- 修改代码前，必须先输出设计方案（受影响文件、修改内容、风险点）
- 用户确认后，方可开始编码

---

## 2. [铁律] 代码修改后必须运行测试，失败必须修复

- 修改 `src/` 下文件后，必须运行 `pnpm test:unit`
- 涉及路由/页面跳转，额外运行 `pnpm test:e2e`
- 测试失败必须修复，不允许跳过

---

## 3. [铁律] 任务结束前必须执行代码审查

审查维度：**正确性**（边界/异常处理）→ **架构**（分层、循环依赖）→ **复用**（是否重复造轮子）→ **规范**（Tailwind、设计令牌、ARIA、motion-reduce）→ **SEO**（语义化标签、meta、JSON-LD）

---

## 4. [铁律] 任务结束前必须检查文档同步

| 变更类型      | 需检查的文档                   |
| ------------- | ------------------------------ |
| 路由变更      | `README.md`、`architecture.md` |
| 命令/依赖变更 | `CLAUDE.md`、`architecture.md` |
| 新增组件/页面 | `architecture.md`、`CLAUDE.md` |
| 新增设计令牌  | `DESIGN.md`                    |
| 配置变更      | `CLAUDE.md`、`README.md`       |
| 迁移推进      | `architecture.md`              |

同时检查 `state-problem-log.md` 是否需要记录。

---

## 5. [铁律] 规则的新增、修改、删除，必须经用户确认

- Agent 自驱优化 → 先提案，用户确认后执行
- 用户指令驱动 → 可直接执行
- 变更后更新 `updated` 时间戳

---

## 6. [铁律] 新组件必须遵循 Tailwind 优先 + 设计令牌

- 禁止 `<style scoped>`，全部使用 Tailwind 工具类
- 禁止硬编码颜色、间距、圆角、阴影值
- 详见 `docs/UI_KIT_SPEC.md`、`DESIGN.md`

---

## 7. [铁律] 先组件，后页面 — 严格顺序，不可颠倒

- `/component` 负责组件精细打磨，`/page` 负责将已有组件组装为页面
- `/page` 禁止创建新组件或内联组件逻辑
- 组件未完成（含 registry.ts 注册），页面不开始
- 创建组件和页面必须提供参考图，无参考图 → 拒绝执行

---

## 8. [铁律] 组件和页面必须满足 SEO/GEO 基本要求

- 语义化 HTML、图片 `alt`、描述性链接文本、键盘可访问
- 页面：`<title>`、`<meta description>`、`<meta keywords>`、canonical URL、JSON-LD
- 详见 `.claude/memory/seo.md`

---

## 9. [铁律] 任务中产生的流程问题必须记录到 state-problem-log

问题类别：`需求理解偏差` | `流程跳过` | `输出质量` | `上下文遗忘` | `工具使用` | `规则冲突`

详见 `.claude/memory/state-problem-log.md`。
