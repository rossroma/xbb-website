# UI Kit 组件通用约束

> 本文档定义所有组件的**通用约束与开发规范**，不描述单个组件的具体 Props/Emits/Slots（这些由组件代码自文档化）。
> 配套文件：`DESIGN.md`（视觉规范）、`tailwind.css`（设计令牌定义）、`registry.ts`（组件注册表）。

---

## 一、组件注册表

`src/client/views/ui-kit/registry.ts` 是 UI Kit 展示页面的**唯一数据源**。侧边栏菜单自动从此文件生成，保证菜单和页面内容永远一致。

**新增组件演示的步骤**：

1. 在 `registry.ts` 的 `sections` 数组中添加一行：`{ id: 'my-component', name: 'MyComponent 组件名', category: 'base' }`
2. 在对应分类页面（如 `ComponentsPage.vue`）中添加 `<Card :id="reg.myComponent.id">...</Card>` 模板 section
3. 侧边栏自动更新，无需手动同步

**分类说明**：`foundations`（基础规范）、`base`（基础组件）、`business`（Business 组件）、`layout`（Layout 组件）、`composite`（组合组件）。

---

## 二、组件分层

| 层级     | 目录                              | 判定标准                                    | 示例                                     |
| -------- | --------------------------------- | ------------------------------------------- | ---------------------------------------- |
| UI Kit   | `src/client/components/ui/`       | 通用原子组件，无业务逻辑，跨页面复用        | Button, Card, Badge, Skeleton, FormInput |
| Business | `src/client/components/business/` | 业务场景组件，可组合 UI Kit，有明确业务含义 | HeroBanner, CTASection, IconCardGrid     |
| Layout   | `src/client/components/layout/`   | 全局布局组件，跨页面结构复用                | SiteHeader, SiteFooter, FloatingToolbar  |
| Page     | `src/client/views/`               | 页面组装，组合 Business + Layout            | Home.vue                                 |

---

## 三、通用文件结构

每个组件必须遵循以下结构：

```
ComponentName.vue
├── <script setup lang="ts">   # 类型安全的逻辑
│   ├── interface Props {}     # defineProps<T>()
│   ├── interface Emits {}     # defineEmits<T>()
│   └── 纯逻辑，无副作用
├── <template>                 # 纯 Tailwind 工具类
│   ├── 响应式：max-lg: / max-md: 前缀
│   ├── 无障碍：role / aria-label / aria-current
│   └── 动效：motion-reduce:transition-none
└── 无 <style scoped>          # 禁止内联样式块
```

---

## 四、UI Kit 组件通用约束

所有 `src/client/components/ui/` 下的组件必须满足以下最低要求：

### 4.1 变体系统

- 至少支持 **2 个 variant**（如 Button 的 primary/outline）
- 至少支持 **2 个 size**（如 lg/md）
- 每个 variant 在不同 size 下的视觉表现必须一致

### 4.2 状态覆盖

| 状态              | 要求                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **默认**          | 正常交互样式                                                                                                                                |
| **hover**         | 上移 1px + 阴影增强（或等效视觉反馈）。**所有可点击、可交互的 DOM 节点必须有 hover 视觉反馈**，至少包含背景色/文字色变化 + `cursor-pointer` |
| **active**        | 按下反馈（scale 回弹或阴影减弱）                                                                                                            |
| **disabled**      | `pointer-events-none` + 50% 透明度                                                                                                          |
| **loading**       | 80% 透明度 + 旋转 Loading 图标（IconPark）+ 文字隐藏但占位保留                                                                              |
| **focus-visible** | `focus-visible:outline-2 focus-visible:outline-offset-2` + 品牌色轮廓                                                                       |

> **hover 效果强制要求**：所有可点击或鼠标悬停触发事件的 DOM 节点（按钮、链接、卡片、页码、标签、图标等）**必须**提供可见的 hover 视觉反馈。这是最容易遗漏的交互细节，每次开发组件时需逐项检查。推荐方案：
>
> - 背景色变化：`hover:bg-brand-primary-soft` + `hover:text-brand-primary`
> - 指针变化：`cursor-pointer`（`<button>` 和 `<a>` 标签也需要显式声明）
> - 动效过渡：`transition-all duration-fast`

### 4.3 多态渲染

交互组件（Button、链接等）必须支持 `as` prop 切换渲染标签：

| 条件        | 渲染标签       |
| ----------- | -------------- |
| `href` 有值 | `<a>`          |
| `to` 有值   | `<RouterLink>` |
| 其他        | `<button>`     |

### 4.4 无障碍基线

- 交互元素：`aria-label`（有视觉标签时可选）、`aria-busy`（加载态）、`aria-disabled`（禁用态）
- 状态组件：`role="status"`（EmptyState）、`role="alert"`（ErrorState）
- 键盘导航：交互元素必须是 `<button>` 或 `<a>`（不用 `<div>` + `@click`）
- `focus-visible` 样式必须可见且符合品牌色

### 4.5 动效关怀

所有包含动效的组件必须支持：

```
motion-reduce:transition-none motion-reduce:transform-none
```

---

## 五、Business 组件通用约束

### 5.1 数据驱动

- 数据通过 Props 传入，**禁止硬编码**在组件内
- 优先使用 UI Kit 组件（Button、Card、Badge 等），不直接使用 Element Plus

### 5.2 响应式

- 桌面优先响应式（`max-lg:`、`max-md:` 断点）
- 移动端卡片/列表从多列切换为单列

---

## 六、Layout 组件通用约束

- 数据通过 Props 或 data 文件传入（导航项、Logo、页脚链接等）
- 支持 `transparent` prop（用于 Hero 区域透明 Header）
- 移动端导航使用抽屉/折叠模式

---

## 七、禁止事项

| 禁止                                       | 替代方案                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `<style scoped>`                           | 全部使用 Tailwind 工具类                                                                           |
| 硬编码颜色值（`#ff6400` 等）               | 使用 `@theme` 令牌（`text-brand-primary`）                                                         |
| 硬编码间距/圆角/阴影值                     | 使用 Tailwind spacing 工具类（`p-6`、`gap-4`）                                                     |
| IconPark 图标用 `class="w-4 h-4"` 设置尺寸 | 使用 IconPark 原生 `:size` prop（如 `:size="24"`），详见下方 7.1 节                                |
| `<div @click>` 模拟按钮                    | 使用 `<button>` 或 `<a>`                                                                           |
| 图片缺少 `alt` 属性                        | 装饰性图片用 `alt=""`，内容图片写描述文字                                                          |
| 链接使用「点击这里」「了解更多」           | 使用描述性文本（如「查看客户案例」）                                                               |
| 在页面中创建新组件                         | 走 `/component` 流程独立创建                                                                       |
| 在页面中修改组件样式                       | 通过 Props 控制组件行为                                                                            |
| 可交互元素缺少 hover 视觉反馈              | 所有可点击/悬停触发的 DOM 节点必须有 hover 效果（背景色/文字色变化 + cursor-pointer），详见 4.2 节 |

### 7.1 IconPark 图标尺寸设置规范

IconPark（`@icon-park/vue-next`）图标组件渲染为内联 SVG，其内部 `width`/`height` 默认设为 `1em`。**必须使用 IconPark 原生 `:size` prop 设置尺寸，禁止使用 Tailwind 的 `w-* h-*` 工具类**。

**原因**：Tailwind `w-* h-*` 设置的是 CSS `width`/`height`，IconPark 内部 SVG 属性 `width="1em" height="1em"` 会与 CSS 产生冲突，导致实际渲染尺寸与预期不符。`size` prop 直接控制 SVG 的 `width`/`height` 属性，始终准确。

**正确用法**：

```html
<!-- ✅ 正确：使用 IconPark 原生 size prop -->
<component :is="Star" :size="24" class="text-white" :stroke-width="3" />

<!-- ✅ 也可以直接使用图标组件 -->
<Star :size="24" class="text-white" :stroke-width="3" />
```

**错误用法**：

```html
<!-- ❌ 错误：使用 Tailwind w-* h-* 类设置 IconPark 图标尺寸 -->
<component :is="Star" class="w-5 h-5 text-white" :stroke-width="3" />
```

**常用尺寸对照**：

| 场景                                    | `size` 值 | 容器尺寸参考             |
| --------------------------------------- | --------- | ------------------------ |
| 卡片内小图标（GradientCardGrid）        | 16        | `w-8 h-8`（32px 容器）   |
| 标题栏图标（GradientCardGrid 顶部）     | 20        | `w-11 h-11`（44px 容器） |
| Badge 徽章图标（GradientHero）          | 24        | `w-11 h-11`（44px 容器） |
| 大号独立图标（EmptyState / ErrorState） | 120       | 无容器                   |

**原则**：图标尺寸应约为容器尺寸的 50%~55%，视觉上居中且留白适当。

---

## 八、TypeScript 严格模式

- 所有组件使用 `<script setup lang="ts">`
- Props/Emits 使用 `defineProps<T>()` / `defineEmits<T>()` 类型声明
- 模板中访问 `ref<number>` 索引的数组元素时，使用 `computed` 包装避免 TS2532 错误：

```typescript
// ❌ 错误：模板中直接访问 tabs[activeTab]，TS 严格模式报 TS2532
const activeTab = ref(0)
// 模板中：{{ tabs[activeTab].title }}  ← 报错

// ✅ 正确：使用 computed 包装
const currentTab = computed(() => tabs[activeTab.value])
// 模板中：v-if="currentTab" 守卫后再访问 {{ currentTab.title }}
```

---

## 九、组件复用度标注

每个组件在文件头部注释中标注复用度：

```vue
<!--
  复用度：高（通用组件）
  可复用场景：任何落地页底部转化区域
-->
```

| 复用度 | 标注     | 含义                                                 |
| ------ | -------- | ---------------------------------------------------- |
| 高     | 通用组件 | 可跨页面、跨场景复用（如 CTASection、Button）        |
| 中     | 场景组件 | 在特定场景下复用（如 IconCardGrid 可用于多个子页面） |
| 低     | 专用组件 | 仅供当前页面使用（如特定页面的 Hero）                |
