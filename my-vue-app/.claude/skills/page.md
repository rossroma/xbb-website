---
name: page
description: 页面组装标准化流程 — 将已有组件组装为页面，不涉及组件创建
skill_type: workflow
version: 2.0.0
triggers:
  - 用户要求新增/创建页面
  - 关键词：页面、新增页面、创建页面、做一个页面、新建页面、添加页面
---

# /page — 页面组装流程

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill，无需用户显式输入 `/page`：

- 明确要求新增、创建页面
- 关键词：「页面」「新增页面」「创建页面」「做一个页面」「新建页面」「添加页面」

> **核心原则**：`/page` 是纯组装流程，不涉及任何组件创建。组件的创建和精细打磨必须在 `/component` 流程中独立完成。**先有组件，后有页面。**

---

## 流程

### Phase 0：页面参考图（门禁 🚫）

**目标**：锚定页面的视觉目标，消除歧义

**用户必须提供以下任一形式的页面布局参考**：

- 设计稿截图（Figma / Sketch 导出）
- 竞品页面截图
- 手绘线框图 / 白板草图
- 现有页面的布局参考（如「和首页结构类似，但板块 2 换成卡片网格」）
- ASCII 线框图（最低要求）

**🚫 无参考图 → 拒绝执行。** 文字描述无法精确传达布局意图，必须先有视觉锚点。

### Phase 1：板块 → 组件映射

**目标**：用户明确指定每个板块使用哪个已有组件

**用户需提供**：

```
页面名称：<页面名>
目标路由：<路由路径>

板块 → 组件映射：
| 序号 | 板块描述 | 使用的组件 | 组件位置 |
|------|----------|-----------|----------|
| 1    | 首屏 Hero | ProductHero | src/client/components/business/ProductHero.vue |
| 2    | 产品展示 | ProductShowcase | src/client/components/business/ProductShowcase.vue |
| 3    | 底部转化区  | CTASection | src/client/components/business/CTASection.vue |
```

**如果用户不确定某个板块该用哪个组件**，Agent 可以帮助分析现有组件库，推荐合适的组件，但最终决定权在用户。

### Phase 2：组件存在性验证（门禁 🚫）

**目标**：验证所有指定组件已存在，缺失则拒绝

**步骤**：

1. 逐一检查每个组件文件是否存在
2. 检查组件是否已在 `registry.ts` 中注册（说明组件已完成完整 `/component` 流程）

**如果全部存在 → 通过 ✅，进入 Phase 3**

**如果任意组件不存在 → 拒绝 ❌**：

```
## ⛔ 页面创建被阻止

原因：以下组件尚未创建，无法进行页面组装。

缺失组件清单：
| 序号 | 组件名称 | 建议操作 |
|------|----------|----------|
| 1    | ProductHero | 请先执行 /component 创建此组件，提供参考图 |

操作步骤：
1. 对每个缺失组件，提供参考图，执行 /component 流程
2. 所有组件创建完成（含 UiKit 注册 + 可视化验证）后，再回来执行 /page
```

**🚫 铁律 #9：组件未就绪，禁止创建页面。先有组件，后有页面。**

### Phase 3：路由设计

**目标**：在 `src/client/router.ts` 中设计路由注册方案

**步骤**：

1. **查阅路由规范**：如果项目中存在 `docs/NAVIGATION_ROUTES.md`，**必须读取**，确认路径命名符合规范
2. 确定路由路径（如 `/kehuguanli`，而非自行命名为 `/customer`）
3. 确定路由在 `clientRoutes` 中的位置
4. 检查是否与现有路由冲突
5. 确认是否需要路由参数（如 `/products/:id`）

**反例**：不查阅 `NAVIGATION_ROUTES.md`，自行命名路由路径 → 导致路径不符合项目规范

### Phase 4：数据绑定与 SEO 元数据设计

**目标**：确定页面数据的来源和绑定方式，以及 SEO 元数据方案

**数据来源选项**：

- **静态数据**：页面专属数据文件就近放置在 `src/client/views/<page>/` 目录下（如 `src/client/views/customer/customerManagementData.ts`）；跨页面共享数据放在 `src/client/data/` 下
- **API 数据**：使用 `src/shared/api/` 中的接口，在页面中 `onMounted` 请求
- **路由参数**：从 `useRoute()` 获取动态参数

**SEO 元数据（必须）**：

- 页面标题（格式：`<页面标题> - 销帮帮CRM`）
- Meta 描述（100-150 字，含核心关键词）
- Meta 关键词（3-5 个）
- Canonical URL
- JSON-LD 结构化数据（根据页面类型选择 Organization / Product / BreadcrumbList / Article）
- 详见 `.claude/memory/seo.md`

### Phase 5：用户确认

**目标**：展示完整组装方案，用户确认后进入编码

**确认内容**：

- 板块 → 组件映射（所有组件已存在）
- 路由路径和位置（已查阅 NAVIGATION_ROUTES.md）
- 数据绑定方案
- 页面 SEO 元数据（`useHead` 标题和描述）

**🚫 铁律 #1：未确认前，禁止修改任何代码文件**

### Phase 6：页面编排

**目标**：按方案组装组件，创建页面文件

**编码规范**：

- 页面文件放在 `src/client/views/` 目录下
- 使用 `<script setup lang="ts">`，仅包含组件导入和数据绑定逻辑
- **禁止** `<style scoped>` — 页面不写样式，样式由组件内部处理
- **禁止**在页面中内联复杂的组件逻辑 — 应封装为独立组件
- **禁止**在页面中创建新组件 — 页面只做组装
- 使用 `useHead` 设置页面 SEO 元数据
- 使用 `<main>` 标签包裹主体内容，页面结构遵循语义化要求

**页面模板示例**：

```vue
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import SiteHeader from '@/client/components/layout/SiteHeader.vue'
import SiteFooter from '@/client/components/layout/SiteFooter.vue'
import ProductHero from '@/client/components/business/ProductHero.vue'
import ProductShowcase from '@/client/components/business/ProductShowcase.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import { pageData } from './somePageData.ts' // 页面专属数据就近放置

// SEO 元数据
useHead({
  title: '页面标题 - 销帮帮CRM',
  meta: [
    { name: 'description', content: '页面描述，100-150字，包含核心关键词...' },
    { name: 'keywords', content: 'CRM,客户管理,销帮帮,销售管理' },
    { 'http-equiv': 'Cache-Control', content: 'no-transform' },
    { 'http-equiv': 'Cache-Control', content: 'no-siteapp' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.xiaobangbang.com/<路由路径>' }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
        '@type': 'Organization',
        name: '销帮帮CRM',
        url: 'https://www.xiaobangbang.com',
        description: '销帮帮CRM是专业的客户关系管理系统...',
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen">
    <SiteHeader />
    <main>
      <h1 class="sr-only">页面标题</h1>
      <ProductHero v-bind="pageData.hero" />
      <ProductShowcase :items="pageData.showcase" />
      <CTASection v-bind="pageData.cta" />
    </main>
    <SiteFooter />
  </div>
</template>
```

### Phase 7：路由注册

**目标**：在 `src/client/router.ts` 中注册新路由

**步骤**：

1. 在 `clientRoutes` 数组中添加路由对象
2. 确认路由顺序（精确匹配路由在前，动态路由在后）
3. 如有需要，添加路由元信息（meta）

**示例**：

```typescript
{
  path: '/kehuguanli',
  name: 'CustomerManagement',
  component: () => import('@/client/views/customer/CustomerManagement.vue'),
  meta: { title: '客户管理 - 销帮帮' },
},
```

### Phase 8：资源检查

**目标**：确保页面引用的所有资源就绪

#### 8.1 图片资源检查

**步骤**：

1. 扫描页面和数据文件中所有图片引用（`:src`、`src`、`background-image`）
2. 逐一检查图片文件是否存在
3. **缺失的图片**：自动生成占位 SVG（标注板块名称、建议尺寸、「待替换」标识），放入 `public/images/` 对应目录
4. 更新数据文件中的图片路径，指向占位图

**占位图规范**：

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="#f3f4f6"/>
  <text x="400" y="180" text-anchor="middle" fill="#9ca3af" font-size="20">
    [板块名称] - 待替换
  </text>
  <text x="400" y="210" text-anchor="middle" fill="#d1d5db" font-size="14">
    建议尺寸: 800×400
  </text>
</svg>
```

### Phase 8：测试验证

**目标**：确保页面正确渲染，路由可访问

```bash
pnpm type-check         # TypeScript 类型检查
pnpm lint               # ESLint + oxlint 检查
pnpm build              # 构建验证
```

**验证步骤**：

1. 访问目标路由，确认页面渲染无白屏/报错
2. 检查所有组件是否正确显示
3. 检查 SEO 元数据（页面标题、描述、keywords、canonical）
4. 检查语义化 HTML 结构（`<main>`、`<h1>`、标题层级）
5. 检查 JSON-LD 结构化数据是否正确注入
6. 检查 `alt` 属性是否完整

**🚫 铁律 #2：测试必须全部通过**

### Phase 10：可视化验证

**目标**：通过浏览器截图验证页面在真实渲染环境中的视觉效果

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

**前置条件**：gstack browse 工具已就绪

**步骤**：

1. **导航到目标页面**：

   ```bash
   BROWSE="$HOME/.claude/skills/gstack/browse/dist/browse"
   $BROWSE goto http://localhost:5173/<路由路径>
   ```

2. **多视口截图**：

   ```bash
   $BROWSE responsive /tmp/page-<页面名>
   ```

   生成 desktop（1280×720）、tablet（768×1024）、mobile（375×812）三张截图。

3. **控制台检查**：

   ```bash
   $BROWSE console --errors
   ```

   - [ ] 无 JS 运行时错误（排除后端 API 预期的 404）
   - [ ] 无资源加载失败

4. **网络检查**：

   ```bash
   $BROWSE network
   ```

   - [ ] 核心资源均为 200
   - [ ] 无 5xx 错误

5. **SEO 数据验证**：

   ```bash
   $BROWSE data
   ```

   - [ ] `<title>` 正确（格式：`页面标题 - 销帮帮CRM`）
   - [ ] `<meta description>` 100-150 字
   - [ ] JSON-LD 结构化数据存在

6. **响应式检查**：
   - [ ] Desktop：布局正确，无元素重叠
   - [ ] Tablet：导航/卡片布局适配
   - [ ] Mobile：可读性良好，无内容溢出

7. **保存基线**（首次创建时）：

   ```bash
   mkdir -p .claude/screenshots/baseline
   cp /tmp/page-<页面名>-desktop.png .claude/screenshots/baseline/<页面名>-desktop.png
   cp /tmp/page-<页面名>-tablet.png .claude/screenshots/baseline/<页面名>-tablet.png
   cp /tmp/page-<页面名>-mobile.png .claude/screenshots/baseline/<页面名>-mobile.png
   ```

8. **使用 Read 工具向用户展示截图**，确认视觉效果符合预期。

9. **⚠️ 保持开发服务器运行**：可视化验证完成后，**不要 kill vite 进程**。服务器已在前置检查阶段确保运行，验证完成后继续保持运行，方便用户在浏览器中查看页面。

### Phase 11：文档同步

**目标**：更新所有相关文档

**检查清单**：

- `CLAUDE.md` — 页面清单是否需更新
- `README.md` — 路由表是否需要更新
- `architecture.md` — 路由结构、迁移阶段是否需要更新
- `DESIGN.md` — 新视觉模式是否需要记录
- `state-problem-log.md` — 本次任务是否产生需记录的问题

**🚫 铁律 #4：文档必须同步**

### Phase 12：问题日志记录

**目标**：记录本次任务中的流程问题

**检查**：需求是否因模糊而反复追问？流程步骤是否被跳过？代码/方案是否被退回重做？

**如有问题**：按格式记录到 `.claude/memory/state-problem-log.md`

**🚫 铁律 #11：流程问题必须记录**

---

## 完成标准

- [ ] 页面参考图已提供
- [ ] 板块 → 组件映射已确认
- [ ] 所有组件已存在（已在 UiKit 注册）
- [ ] 路由设计已查阅 NAVIGATION_ROUTES.md，无冲突
- [ ] 数据绑定方案已获用户确认
- [ ] SEO 元数据方案已确认
- [ ] 页面文件已创建（纯组装，无 `<style scoped>`，无内联组件逻辑）
- [ ] 图片资源已检查（缺失已生成占位图）
- [ ] 路由已注册到 `router.ts`
- [ ] 类型检查 + Lint + 构建通过
- [ ] 可视化验证通过（多视口截图 + 控制台/网络/SEO 检查）
- [ ] 开发服务器保持运行（未 kill）
- [ ] 文档已同步
- [ ] 流程问题已记录（如有）

---

## 与 /component 的关系

```
/component → 创建单个组件（独立流程，需参考图，精细打磨）
    ↓
/component → 创建单个组件
    ↓
/component → 创建单个组件
    ↓
... 全部组件就绪（含 UiKit 注册 + 可视化验证）
    ↓
/page → 纯组装（组件全部就绪后，拼装为页面）
```

**严格顺序**：先有组件，后有页面。组件未完成，页面不开始。
