# 销帮帮 CRM 官网设计规范

> **主题色：** `#ff6400`（品牌橙）
> **目标读者：** AI 代码生成。本规范定义视觉设计语言，组件开发约束见 `docs/UI_KIT_SPEC.md`。
> **配套文件：**
>
> - `docs/UI_KIT_SPEC.md` — 组件开发通用约束
> - `src/client/styles/tailwind.css` — Tailwind v4 设计令牌定义（`@theme` 块 + 渐变工具类）
>   **最后更新：** 2026-07-27

---

## 1. 设计令牌

所有令牌定义在 `src/client/styles/tailwind.css` 的 `@theme` 块中，使用 Tailwind 工具类消费（如 `text-brand-primary`、`bg-surface-secondary`）。**禁止在组件中硬编码颜色、间距、圆角、阴影值。**

令牌分两层管理：

- **核心语义令牌**（Section 1）— 对标本规范 Section 1.1-1.8，跨组件通用
- **组件专用令牌**（Section 2）— 按组件分组，仅特定组件使用，详见 `tailwind.css` 内注释

### 1.1 品牌色板

| 令牌                           | 值                     | 用途                   |
| ------------------------------ | ---------------------- | ---------------------- |
| `--color-brand-primary`        | `#ff6400`              | 主按钮、链接、强调文字 |
| `--color-brand-primary-hover`  | `#ff7a24`              | 主色 hover             |
| `--color-brand-primary-active` | `#e55a00`              | 主色 active            |
| `--color-brand-primary-soft`   | `rgba(255,100,0,0.08)` | 品牌色软底             |
| `--color-brand-primary-glow`   | `rgba(255,100,0,0.18)` | 品牌色发光             |
| `--color-brand-accent`         | `#5b61ff`              | 辅助色（蓝紫）         |
| `--color-brand-accent-hover`   | `#6670ff`              | 辅助色 hover           |
| `--color-brand-accent-soft`    | `rgba(91,97,255,0.08)` | 辅助色软底             |
| `--color-brand-accent-glow`    | `rgba(91,97,255,0.18)` | 辅助色发光             |

### 1.2 中性色

| 令牌                          | 值        | 用途       |
| ----------------------------- | --------- | ---------- |
| `--color-brand-neutral`       | `#1f2329` | 标题、正文 |
| `--color-brand-neutral-soft`  | `#646a73` | 辅助文字   |
| `--color-brand-neutral-muted` | `#86909c` | 弱化文字   |

### 1.3 表面色

| 令牌                        | 值        | 用途          |
| --------------------------- | --------- | ------------- |
| `--color-surface-primary`   | `#ffffff` | 页面主背景    |
| `--color-surface-secondary` | `#f6f6fb` | 次级模块背景  |
| `--color-surface-tertiary`  | `#fff3eb` | 品牌暖色背景  |
| `--color-surface-elevated`  | `#ffffff` | 浮层/卡片背景 |

### 1.4 文字色

| 令牌                     | 值        | 用途       |
| ------------------------ | --------- | ---------- |
| `--color-text-primary`   | `#1f2329` | 标题、正文 |
| `--color-text-secondary` | `#646a73` | 辅助文字   |
| `--color-text-tertiary`  | `#86909c` | 弱化文字   |

### 1.5 状态色

| 令牌                     | 值        | 用途      |
| ------------------------ | --------- | --------- |
| `--color-status-success` | `#16a34a` | 成功/正向 |
| `--color-status-warning` | `#f59e0b` | 警告      |
| `--color-status-error`   | `#d1242f` | 错误/危险 |
| `--color-status-info`    | `#2563eb` | 信息提示  |

### 1.6 排版

| 层级    | 用途          | 字号 | 行高 | 字重 | 字间距   | Tailwind 类    |
| ------- | ------------- | ---- | ---- | ---- | -------- | -------------- |
| Display | Hero 大标题   | 38px | 1.18 | 700  | -0.025em | `text-display` |
| H1      | 页面/区块标题 | 30px | 1.24 | 700  | -0.015em | `text-h1`      |
| H2      | 卡片/模块标题 | 24px | 1.32 | 700  | -0.005em | `text-h2`      |
| H3      | 小标题        | 20px | 1.5  | 700  | 0        | `text-h3`      |
| Body    | 正文          | 16px | 1.7  | 400  | 0        | `text-body`    |
| Small   | 辅助文字      | 14px | 1.6  | 400  | 0        | `text-small`   |
| Caption | 标签/说明     | 12px | 1.5  | 500  | 0        | `text-caption` |

**使用规则**：Display 每页最多 1 次（Hero 区域），H1 用于每个 `<section>` 主标题，Body 用于所有正文段落。

### 1.7 间距

基于 4px 基准，使用 Tailwind spacing 工具类（`p-4`、`gap-6`、`space-y-8`）：

| 间距          | 用途              |
| ------------- | ----------------- |
| 4px (`p-1`)   | 极小间距          |
| 8px (`p-2`)   | 图标与文字        |
| 16px (`p-4`)  | 卡片内边距        |
| 24px (`p-6`)  | 卡片间距          |
| 32px (`p-8`)  | 模块内边距        |
| 48px (`p-12`) | 紧凑 section 间距 |
| 80px (`p-20`) | 标准 section 间距 |

### 1.8 圆角

| Tailwind 类     | 值    | 用途                   |
| --------------- | ----- | ---------------------- |
| `rounded-pill`  | 999px | 按钮、标签、药丸形组件 |
| `rounded-card`  | 16px  | 卡片                   |
| `rounded-large` | 32px  | 大容器（Hero 区域）    |

### 1.9 阴影

| Tailwind 类        | 值                                 | 用途         |
| ------------------ | ---------------------------------- | ------------ |
| `shadow-subtle`    | `0 12px 28px rgba(15,23,42,0.06)`  | 卡片默认阴影 |
| `shadow-default`   | `0 24px 60px rgba(15,23,42,0.08)`  | 卡片悬停阴影 |
| `shadow-prominent` | `0 24px 48px rgba(255,100,0,0.12)` | 品牌色浮层   |

### 1.10 动效

| Tailwind 类       | 值    | 用途                         |
| ----------------- | ----- | ---------------------------- |
| `duration-fast`   | 180ms | 微小交互（hover 颜色、图标） |
| `duration-normal` | 240ms | 标准交互（按钮、卡片 hover） |
| `duration-slow`   | 360ms | 大幅移动（模态框、抽屉）     |
| `duration-glide`  | 450ms | 轮播滑动                     |

**动效模式**：

| 模式        | transform          | 阴影                             | 持续时间 |
| ----------- | ------------------ | -------------------------------- | -------- |
| 按钮 hover  | `translateY(-1px)` | 加深                             | 240ms    |
| 按钮 active | `translateY(0)`    | 减弱                             | 240ms    |
| 卡片 hover  | `translateY(-4px)` | `shadow-subtle → shadow-default` | 240ms    |

**必须支持 `prefers-reduced-motion`**：`motion-reduce:transition-none motion-reduce:transform-none`

### 1.11 断点

| 断点    | 视口            | 网格列数 |
| ------- | --------------- | -------- |
| Wide    | ≥ 1280px        | 4 列     |
| Desktop | 1024px - 1279px | 3 列     |
| Tablet  | 768px - 1023px  | 2 列     |
| Mobile  | ≤ 767px         | 1 列     |

---

## 2. 布局系统

### 2.1 容器

页面内容使用 `SectionBlock` 组件包裹，控制最大宽度和居中：

```html
<SectionBlock spacing="default">
  <!-- 内容 -->
</SectionBlock>
```

### 2.2 网格

使用 Tailwind CSS Grid：

```html
<div class="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
  <!-- 卡片 -->
</div>
```

### 2.3 Section 模式

| 模式         | 实现                               |
| ------------ | ---------------------------------- |
| 默认 Section | `<SectionBlock spacing="default">` |
| 交替背景     | 通过 `bg-surface-secondary` 切换   |
| 品牌暖色背景 | `bg-surface-tertiary`              |

### 2.4 页面模板

**首页布局**：

```
Hero Banner → 解决方案卡片 → AI 能力卡片 → 指标面板 → 生态合作 → 视频转化区 → 案例轮播 → 服务体系 → CTASection
```

**子页面布局**：

```
Hero Banner → Section（图文介绍）→ Section（交替背景）→ Section（左文右图）→ CTASection
```

---

## 3. 响应式规范

### 3.1 排版缩放

| 层级    | Wide (≥1280px) | Desktop (≤1280px) | Mobile (≤768px) |
| ------- | -------------- | ----------------- | --------------- |
| Display | 38px           | 32px              | 28px            |
| H1      | 30px           | 26px              | 22px            |
| H2      | 24px           | 22px              | 20px            |
| H3      | 20px           | 18px              | 17px            |
| Body    | 16px           | 16px              | 15px            |

### 3.2 间距缩放

| 间距             | Desktop | Tablet | Mobile |
| ---------------- | ------- | ------ | ------ |
| Section 上下间距 | 80px    | 60px   | 40px   |
| 模块间距         | 48px    | 36px   | 24px   |
| 卡片内边距       | 24px    | 20px   | 16px   |
| 网格间距         | 24px    | 20px   | 16px   |

### 3.3 移动端触控目标

- 按钮最小高度：44px
- 链接最小点击区域：44×44px
- 表单输入框最小高度：44px

### 3.4 移动端导航

- 导航使用抽屉/折叠模式
- 一级菜单垂直排列
- 子菜单缩进展开
