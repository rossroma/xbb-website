---
name: component
description: 组件开发标准化流程 — 需求对齐 → 类型判定 → 设计参考 → 规格确认 → 实施编码 → UiKit 注册 → 验证 → 收尾
skill_type: workflow
version: 3.0.0
triggers:
  - 用户要求新增/创建/封装一个组件
  - 关键词：组件、创建组件、新增组件、封装一个、写一个组件、添加组件
---

# /component — 组件开发流程

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill：

- 明确要求新增、创建、封装一个组件
- 关键词：「组件」「创建组件」「新增组件」「封装一个」「写一个组件」「添加组件」

> **核心原则**：组件是独立、精细打磨的单元。每个组件单独创建，提供参考图，逐个打磨完善。组件完成后才能用于页面组装。

---

## 参考图解读原则

参考图是「功能规格书」，不是「样式复刻模板」。AI 必须从中提取要素，结合项目 `DESIGN.md` 设计规范，重新设计一个符合当前设计系统的组件。

### ✅ 必须参考的部分

| 维度            | 说明                                 | 示例                                                               |
| --------------- | ------------------------------------ | ------------------------------------------------------------------ |
| **能力 / 场景** | 组件解决什么问题、在什么上下文中使用 | 「这是一个 SaaS 首页的 Hero 区域，包含标题、副标题、一张产品截图」 |
| **信息架构**    | 包含哪些内容区块、主次关系如何       | 「标题 → 副标题 → 双按钮组 → 底部配图，标题最突出」                |
| **布局结构**    | 元素的排列方向和空间关系             | 「桌面端左文右图两栏、移动端上下堆叠、按钮水平并排」               |
| **交互模式**    | 用户可执行的操作和反馈               | 「hover 卡片有上浮阴影、tab 切换内容区、轮播自动播放」             |
| **内容密度**    | 信息量的多寡和留白程度               | 「稀疏型 Hero，大量留白，仅 3 行文字 + 1 个按钮」                  |

### ❌ 禁止参考的部分

| 维度                   | 原因                                   | 替代方案                                                                              |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| **颜色 / 配色**        | 参考图来自其他产品，配色属于其品牌标识 | 使用 `DESIGN.md` 中定义的 `@theme` 令牌（`text-brand-primary`、`bg-surface-warm` 等） |
| **字体 / 字号**        | 参考图的字体系统与本项目不同           | 使用 `DESIGN.md` 中定义的排版规范（`font-size-*`、`font-family`）                     |
| **间距 / 圆角 / 阴影** | 属于设计令牌范畴，必须统一             | 使用 `tailwind.css` 中定义的间距类（`p-6`、`gap-4`）和圆角/阴影令牌                   |
| **图标风格**           | 不同产品使用不同图标库                 | 统一使用 `@icon-park/vue-next`，从 IconPark 中选取语义匹配的图标                      |

### AI 的输出规范

拿到参考图后，AI 必须输出以下内容供用户确认，**不得跳过直接编码**：

1. **能力描述**：这个组件在什么场景下、解决什么问题
2. **布局拆解**：桌面端和移动端的元素排列方式（可用 ASCII 线框图辅助说明）
3. **内容区块**：逐块列出组件包含的内容元素（标题、描述、按钮、图片、列表等）
4. **交互行为**：hover/click/focus/动画等交互细节
5. **设计令牌映射**：参考图中的视觉元素对应到本项目的哪个 `@theme` 令牌
6. **变体与状态**：可能的 variant、size、loading/empty/error 状态

**🚫 铁律：未完成上述输出并经用户确认，禁止进入编码阶段。**

---

## 流程

### 1. 需求对齐（门禁 🚫）

**必须提供视觉参考**（设计稿截图 / 竞品截图 / 手绘草图 / 参考链接）。
**🚫 无参考图 → 拒绝执行。** 文字描述样式天然有损，AI 无法仅凭文字精确还原视觉预期。

拿到参考图后，按「参考图解读原则」提取要素，结合项目设计规范描述组件。

**必须确认的维度**：

| 维度     | 需确认内容                   | 模糊示例             | 应追问                                                 |
| -------- | ---------------------------- | -------------------- | ------------------------------------------------------ |
| 视觉样式 | 风格倾向（非具体颜色/间距）  | 「做一个好看的卡片」 | 「倾向于圆润还是硬朗？扁平还是带阴影？轻盈还是厚重？」 |
| 交互行为 | hover/click/focus、动画      | 「点击后弹出来」     | 「弹出什么？弹窗还是下拉？需要动画吗？」               |
| 数据来源 | Props / API / 硬编码         | 「展示一些数据」     | 「数据从哪来？Props 传入还是 API 请求？」              |
| 状态覆盖 | loading/empty/error/disabled | 「做一个列表」       | 「需要处理加载中、空数据、错误状态吗？」               |
| 响应式   | 各断点布局变化               | 「适配移动端」       | 「移动端是堆叠还是横向滚动？」                         |
| 复用范围 | 单页面 / 跨页面              | 「这个组件」         | 「只在当前页面用，还是其他地方也会用？」               |

**🚫 以上任一维度不明确 → 必须追问，不得自行假设。**

### 2. 组件类型判定

| 层级     | 目录                              | 判定标准                             | 示例                       |
| -------- | --------------------------------- | ------------------------------------ | -------------------------- |
| UI Kit   | `src/client/components/ui/`       | 通用原子组件，无业务逻辑，跨页面复用 | Button, Card, Badge, Modal |
| Business | `src/client/components/business/` | 业务场景组件，有明确业务含义         | HeroBanner, IconCardGrid   |
| Layout   | `src/client/components/layout/`   | 全局布局组件，跨页面结构复用         | SiteHeader, SiteFooter     |

### 3. 设计参考

1. 阅读 `DESIGN.md` 设计令牌和布局规范
2. 检查同层级现有组件，确认不可复用后才新建
3. UI Kit 组件额外参考 `docs/UI_KIT_SPEC.md`
4. 检查 `tailwind.css` 的 `@theme` 令牌

### 4. 规格设计 + 确认

定义 Props / Emits / Slots 接口，**必须经用户确认后方可编码**。

**UI Kit 组件**：

```typescript
interface Props {
  variant?: 'primary' | 'outline' | '...'
  size?: 'lg' | 'md' | 'sm'
  loading?: boolean
  disabled?: boolean
  as?: string // 多态渲染（button/a/RouterLink）
}
```

**Business 组件**：

```typescript
interface Props {
  title: string
  items: Item[]
  layout?: 'grid' | 'carousel'
}
```

**Layout 组件**：

```typescript
interface Props {
  logo?: string
  navItems?: NavItem[]
  transparent?: boolean
}
```

**🚫 未确认前，禁止修改任何代码文件。**

### 5. 实施编码

**编码检查清单**：

```
□ <script setup lang="ts"> + defineProps<T>() / defineEmits<T>()
□ 无 <style scoped> — 全部使用 Tailwind 工具类
□ 颜色使用 @theme 令牌（text-brand-primary, bg-surface-warm）
□ 间距使用 Tailwind 间距类（p-6, gap-4）
□ 响应式：max-lg: / max-md: 前缀，桌面优先
□ ARIA：role / aria-label / aria-current
□ 动效关怀：motion-reduce:transition-none
□ 加载态：IconPark Loading + animate-spin
□ 禁用态：pointer-events-none + opacity-50
□ 焦点态：focus-visible:outline-none focus-visible:ring-2
□ 图标使用 @icon-park/vue-next
□ 交互元素使用 button 标签（不用 div + click）
□ 语义化标签：header/nav/main/article/section/footer
□ 图片必须有 alt 属性
□ 键盘可访问：tabindex + focus-visible 样式
□ 模板中 ref<number> 索引数组用 computed 包装（避免 TS2532）
```

**TS 数组访问规范**：

```typescript
// ❌ 错误：模板中直接访问 tabs[activeTab]，TS 严格模式报 TS2532
const activeTab = ref(0)
// 模板中：{{ tabs[activeTab].title }}  ← 报错

// ✅ 正确：使用 computed 包装
const currentTab = computed(() => tabs[activeTab.value])
// 模板中：v-if="currentTab" 守卫后再访问 {{ currentTab.title }}
```

**Business 组件额外要求**：

- 数据通过 Props 传入，不硬编码
- 优先使用 UI Kit 组件（Button、Card、Badge）

### 6. UiKit 注册（门禁 🚫）

**🚫 未注册 = 未完成。**

1. 在 `registry.ts` 的 `sections` 中添加一行
2. 在对应分类页面中添加展示 section
3. UI Kit 组件：展示所有 variant × size × 状态组合
4. Business 组件：展示默认状态和响应式表现
5. 确认开发服务器可访问 `/ui-kit`（复用优先，见 Phase 7.1 服务器检查逻辑）

### 7. 验证

```bash
pnpm test:unit          # 单元测试
pnpm type-check         # 类型检查
pnpm lint               # ESLint + oxlint
```

**🚫 测试必须全部通过。**

### 7.1 可视化验证

**目标**：通过浏览器截图验证组件在多视口、多状态下的渲染效果，与参考图对比确认视觉还原度。

**前置 — 服务器检查（复用优先）**：

```bash
# 先检查 dev server 是否已在运行
if lsof -i :5173 > /dev/null 2>&1; then
  echo "✅ 开发服务器已在运行，直接复用"
else
  echo "🔄 开发服务器未启动，后台启动中..."
  pnpm dev &
  # 等待服务就绪（最多 30 秒）
  for i in $(seq 1 30); do
    curl -s -o /dev/null http://localhost:5173 && break
    sleep 1
  done
fi
```

> **核心原则**：开发服务器是共享资源，不因单次验证而启停。已运行则复用，未运行才启动，验证完成后**保持运行**。

**验证步骤**：

1. **导航到组件展示页**：

   ```bash
   BROWSE="$HOME/.claude/skills/gstack/browse/dist/browse"
   $BROWSE goto http://localhost:5173/ui-kit
   ```

2. **多视口截图**（使用 browse 或 screenshot skill）：
   - Desktop（1280×720）
   - Tablet（768×1024）
   - Mobile（375×812）

3. **控制台检查**：`$BROWSE console --errors` — 无 JS 运行时错误

4. **与参考图对比**：确认视觉还原度，差异项标注并修正

**⚠️ 验证完成后不要 kill vite 进程**，保持服务器运行供用户继续使用。

### 8. 收尾

- [ ] **复用度标注**：组件文件头部注释标注复用度（高/中/低）
- [ ] **文档同步**：检查 CLAUDE.md、architecture.md、DESIGN.md、UI_KIT_SPEC.md 是否需要更新
- [ ] **问题日志**：如有流程问题，记录到 `.claude/memory/state-problem-log.md`

---

## 完成标准

- [ ] 参考图已提供 + 需求已澄清
- [ ] 组件层级判定正确
- [ ] 规格已获用户确认
- [ ] 代码符合编码检查清单
- [ ] 已在 registry.ts 中注册
- [ ] 所有测试通过 + 可视化验证通过
- [ ] 复用度已标注 + 文档已同步
