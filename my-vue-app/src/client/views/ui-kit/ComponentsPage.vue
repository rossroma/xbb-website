<template>
  <div class="flex flex-col gap-6">
    <!-- 分类二：基础组件                                                        -->
    <!-- ================================================================ -->
    <div id="cat-base" class="scroll-mt-14 lg:scroll-mt-0 mt-6">
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded bg-brand-accent-soft text-brand-accent text-caption font-bold uppercase tracking-wider"
          >基础组件</span
        >
      </div>
    </div>

    <!-- ===== Button ===== -->
    <Card id="button" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Button 按钮</h2>
      <p class="text-small text-text-secondary mb-6">
        7 variant × 2 color × 3 size，支持 icon 圆形按钮、block 全宽、href/to 链接。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Colors</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap gap-3">
          <Button v-for="c in buttonColors" :key="c" :color="c" size="lg">{{
            c === 'brand' ? '品牌橙' : '辅助蓝紫'
          }}</Button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Variants</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap items-center gap-3">
          <Button v-for="v in buttonVariants" :key="v" :variant="v" size="lg">{{
            v === 'hero-outline' ? 'hero-outline' : v
          }}</Button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap items-end gap-3">
          <Button v-for="s in buttonSizes" :key="s" :size="s">{{ s.toUpperCase() }}</Button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Icon 圆形按钮</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap items-center gap-3">
          <Button icon variant="outline" size="md" aria-label="上一张">
            <Left class="w-[22px] h-[22px]" />
          </Button>
          <Button icon variant="outline" size="md" aria-label="下一张">
            <Right class="w-[22px] h-[22px]" />
          </Button>
          <Button icon variant="primary" size="md" aria-label="搜索">
            <Search class="w-5 h-5" />
          </Button>
          <Button icon variant="primary" color="accent" size="md" aria-label="AI">
            <Magic class="w-5 h-5" />
          </Button>
          <Button icon variant="outline" size="sm" aria-label="关闭">
            <Close class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">States</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="outline" disabled>Disabled</Button>
          <Button variant="outline" loading>Loading</Button>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Block & Link</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap items-center gap-3">
          <Button block size="lg">全宽按钮 (block)</Button>
          <Button href="https://example.com">作为 &lt;a&gt; 链接</Button>
          <Button to="/ui-kit" variant="outline">作为 &lt;router-link&gt;</Button>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>color="brand"</strong>（橙）：主
            CTA；<strong>color="accent"</strong>（蓝紫）：AI 功能、次要模块
          </li>
          <li>
            <strong>primary</strong> 渐变填充，每个操作区最多 1 个；<strong>outline</strong>
            次级操作（品牌色文字）；<strong>outline-neutral</strong>
            黑框白底（深色文字+边框）；<strong>text</strong> 纯文字链接
          </li>
          <li>
            <strong>hero</strong> / <strong>hero-outline</strong>：Hero Banner
            专用，更大阴影和毛玻璃效果
          </li>
          <li><strong>icon</strong>：圆形纯图标按钮，用于轮播箭头、关闭、搜索等场景</li>
          <li>
            <strong>block</strong>：移动端撑满；<strong>href</strong> / <strong>to</strong>：渲染为
            &lt;a&gt; 或 &lt;router-link&gt;
          </li>
        </ul>
      </div>
    </Card>

    <!-- ===== Card ===== -->
    <Card id="card" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Card 卡片</h2>
      <p class="text-small text-text-secondary mb-6">
        4 种变体，圆角 <code>rounded-card</code>（16px），阴影 <code>shadow-subtle</code>。
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Default · shadow-subtle</span
          ><Card
            ><h4 class="text-[18px] font-semibold text-text-primary mb-2">默认卡片</h4>
            <p class="text-small text-text-secondary">标准白色背景，细微阴影和边框。</p></Card
          >
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Clickable · hover: shadow-default</span
          ><Card clickable aria-label="可点击卡片示例"
            ><h4 class="text-[18px] font-semibold text-text-primary mb-2">可点击卡片</h4>
            <p class="text-small text-text-secondary">悬停上浮 4px + 阴影加深。</p></Card
          >
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Warm · surface-tertiary</span
          ><Card variant="warm"
            ><h4 class="text-[18px] font-semibold text-text-primary mb-2">暖色卡片</h4>
            <p class="text-small text-text-secondary">品牌暖色背景。</p></Card
          >
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Image · p-0 overflow-hidden</span
          ><Card
            variant="image"
            image-src="https://placehold.co/600x300/fff3eb/ff6400?text=Image+Card"
            image-alt="图片卡片"
            ><h4 class="text-[18px] font-semibold text-text-primary mb-2">图片卡片</h4>
            <p class="text-small text-text-secondary">顶部图片 + 下方文字。</p></Card
          >
        </div>
      </div>
    </Card>

    <!-- ===== VideoCard ===== -->
    <Card id="video-card" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">VideoCard 视频卡片</h2>
      <p class="text-small text-text-secondary mb-6">
        支持 16:10 和 1:1 两种封面比例，tag 和描述为选填，卡片高度自适应内容。
      </p>

      <!-- 基础变体：16:10 + 1:1 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">封面比例</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <div class="flex flex-wrap gap-6">
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >16:10（默认）</span
              >
              <VideoCard
                image="https://placehold.co/640x400/1f2329/ffffff?text=16:10+Cover"
                title="产品功能演示"
                tag="产品演示"
                description="快速了解销帮帮 CRM 的核心功能，掌握日常操作技巧。"
              />
            </div>
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >1:1</span
              >
              <VideoCard
                image="https://placehold.co/400x400/1f2329/ffffff?text=1:1+Cover"
                title="客户成功案例"
                tag="客户案例"
                description="看行业标杆如何用销帮帮实现业绩增长。"
                aspect-ratio="1:1"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 属性组合：无 tag / 无描述 / 仅标题 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">属性组合（高度自适应）</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <div class="flex flex-wrap gap-6">
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >无标签</span
              >
              <VideoCard
                image="https://placehold.co/640x400/1f2329/ffffff?text=No+Tag"
                title="入门指南"
                description="从零开始，5 分钟完成账号初始化与基础设置。"
              />
            </div>
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >无描述</span
              >
              <VideoCard
                image="https://placehold.co/640x400/1f2329/ffffff?text=No+Desc"
                title="移动端使用攻略"
                tag="新手必看"
              />
            </div>
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >仅标题</span
              >
              <VideoCard
                image="https://placehold.co/640x400/1f2329/ffffff?text=Title+Only"
                title="高级功能概览"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 可点击卡片 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">可点击卡片</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <div class="flex flex-wrap gap-6">
            <div>
              <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
                >clickable · hover 上浮 4px + 阴影增强</span
              >
              <VideoCard
                image="https://placehold.co/640x400/1f2329/ffffff?text=Clickable"
                title="数据报表解读"
                tag="进阶教程"
                description="学会用数据驱动决策，提升团队管理效率。"
                clickable
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            Props: image, title, aspectRatio?: '16:10' | '1:1', tag?, description?, clickable?
          </li>
          <li>封面使用 object-cover 自动裁切，aspect-ratio 控制比例</li>
          <li>tag 和 description 为选填，不传时不占高度</li>
          <li>clickable 时卡片 hover 上浮 4px + 阴影增强 + 图片放大 5%</li>
          <li>播放按钮始终居中，hover 时放大 10%</li>
        </ul>
      </div>
    </Card>

    <!-- ===== Badge ===== -->
    <Card id="badge" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Badge 徽章</h2>
      <p class="text-small text-text-secondary mb-6">
        5 种颜色变体，圆角 <code>rounded-pill</code>（999px），12px 字号。
      </p>
      <div class="bg-surface-secondary rounded-inner p-5">
        <div class="flex flex-wrap gap-3">
          <Badge v-for="v in badgeVariants" :key="v" :variant="v">{{ v }}</Badge>
        </div>
      </div>
    </Card>

    <!-- ===== Tabs ===== -->
    <Card id="tabs" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Tabs 选项卡</h2>
      <p class="text-small text-text-secondary mb-6">
        3 种布局风格 × 4 种选中背景色，尺寸随布局自动切换。支持 v-model
        双向绑定、键盘导航、图标自动着色、徽章、禁用态。
      </p>

      <!-- 布局风格 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">布局风格（layout）</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-6">
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >text-only · 纯文字</span
            >
            <Tabs v-model="tabsActive1" :tabs="tabsItems" layout="text-only" />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >icon-left · 左图标右文字</span
            >
            <Tabs v-model="tabsActive2" :tabs="tabsItemsWithIcon" layout="icon-left" />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >icon-top · 上图标下文字</span
            >
            <Tabs v-model="tabsActive3" :tabs="tabsItemsWithIcon" layout="icon-top" />
          </div>
        </div>
      </div>

      <!-- 选中背景色 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">选中背景色（activeBg）</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-6">
          <div v-for="bg in tabsActiveBgOptions" :key="bg">
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block">{{
              bg
            }}</span>
            <Tabs
              v-model="tabsActiveBg[bg]"
              :tabs="tabsItemsWithIcon"
              :active-bg="bg"
              layout="icon-left"
            />
          </div>
        </div>
      </div>

      <!-- 图标颜色 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">图标颜色</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-6">
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >自动着色（预设 6 色轮转）</span
            >
            <Tabs v-model="tabsIconAuto" :tabs="tabsIconAutoItems" layout="icon-left" />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >手动指定（iconColor）</span
            >
            <Tabs v-model="tabsIconManual" :tabs="tabsIconManualItems" layout="icon-left" />
          </div>
        </div>
      </div>

      <!-- 对齐 & 全宽 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">对齐 & 全宽</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-6">
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >start（默认）</span
            >
            <Tabs
              v-model="tabsAlignStart"
              :tabs="tabsItemsWithIcon"
              layout="icon-left"
              alignment="start"
            />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >center</span
            >
            <Tabs
              v-model="tabsAlignCenter"
              :tabs="tabsItemsWithIcon"
              layout="icon-left"
              alignment="center"
            />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >end</span
            >
            <Tabs
              v-model="tabsAlignEnd"
              :tabs="tabsItemsWithIcon"
              layout="icon-left"
              alignment="end"
            />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >fullWidth · 撑满容器</span
            >
            <Tabs v-model="tabsFullWidth" :tabs="tabsItemsWithIcon" layout="icon-left" full-width />
          </div>
        </div>
      </div>

      <!-- 徽章 & 禁用 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">徽章 & 禁用</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-6">
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >badge 徽章</span
            >
            <Tabs v-model="tabsBadge" :tabs="tabsItemsWithBadgeAndIcon" layout="icon-left" />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >disabled 禁用项</span
            >
            <Tabs v-model="tabsDisabled" :tabs="tabsItemsWithDisabledAndIcon" layout="icon-left" />
          </div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>layout</strong
            >：<code>text-only</code>（纯文字，默认）、<code>icon-left</code>（左图标右文字）、<code>icon-top</code>（上图标下文字）；尺寸随布局自动切换
          </li>
          <li>
            <strong>activeBg</strong
            >：<code>gray</code>（默认灰底）、<code>brand</code>（品牌橙浅底）、<code>accent</code>（蓝紫浅底）、<code>white</code>（白底+阴影）
          </li>
          <li>选中时仅通过背景高亮展示，不改变文字和图标颜色</li>
          <li>
            图标颜色支持 <code>tab.iconColor</code> 手动指定，未指定时按预设 6 色调色板自动轮转分配
          </li>
          <li><strong>v-model</strong> 绑定当前激活 tab 的 <code>key</code></li>
          <li>支持键盘导航：← → 切换，Home/End 跳转首/尾</li>
          <li>
            图标通过 <code>tab.icon</code> 传入Remix组件；<code>badge</code> 显示数字/文字徽章
          </li>
        </ul>
      </div>
    </Card>

    <!-- ===== Skeleton ===== -->
    <Card id="skeleton" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Skeleton 骨架屏</h2>
      <p class="text-small text-text-secondary mb-6">
        shimmer 动画 1.5s，圆角 <code>rounded-inner</code>（12px）。
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Text · count=3</span
          >
          <div class="bg-surface-secondary rounded-inner p-5">
            <Skeleton type="text" :count="3" />
          </div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2">Card</span>
          <div class="bg-surface-secondary rounded-inner p-5"><Skeleton type="card" /></div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Image</span
          >
          <div class="bg-surface-secondary rounded-inner p-5"><Skeleton type="image" /></div>
        </div>
      </div>
    </Card>

    <!-- ===== EmptyState ===== -->
    <Card id="emptystate" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">EmptyState 空状态</h2>
      <p class="text-small text-text-secondary mb-6">
        Inbox 图标，默认文案"暂无数据"，操作按钮通过插槽传入。
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Default</span
          >
          <div class="bg-surface-secondary rounded-inner"><EmptyState /></div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Custom Message</span
          >
          <div class="bg-surface-secondary rounded-inner">
            <EmptyState message="没有找到相关结果" />
          </div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >With Action</span
          >
          <div class="bg-surface-secondary rounded-inner">
            <EmptyState message="还没有任何内容"
              ><Button variant="outline" size="sm">去创建</Button></EmptyState
            >
          </div>
        </div>
      </div>
    </Card>

    <!-- ===== ErrorState ===== -->
    <Card id="errorstate" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">ErrorState 错误状态</h2>
      <p class="text-small text-text-secondary mb-6">
        role="alert"，AlertTriangle 图标，emit retry 事件。
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Default</span
          >
          <div class="bg-surface-secondary rounded-inner">
            <ErrorState @retry="onRetry('default')" />
          </div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-2"
            >Custom Message</span
          >
          <div class="bg-surface-secondary rounded-inner">
            <ErrorState message="网络连接失败，请检查网络后重试" @retry="onRetry('custom')" />
          </div>
        </div>
      </div>
    </Card>

    <!-- ===== Form 表单容器 ===== -->
    <Card id="form" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Form 表单容器 + FormItem</h2>
      <p class="text-small text-text-secondary mb-6">
        表单容器，通过 <code>provide/inject</code> 向子组件传递全局配置。FormItem 支持
        label、required、error、help。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Label Position</h3>
        <div class="flex gap-2 mb-3">
          <button
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast',
              formLabelPosition === 'top'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary',
            ]"
            @click="formLabelPosition = 'top'"
          >
            top（上下）
          </button>
          <button
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast',
              formLabelPosition === 'left'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary',
            ]"
            @click="formLabelPosition = 'left'"
          >
            left（左右）
          </button>
        </div>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <Form :label-position="formLabelPosition" :size="formSize">
            <FormItem label="用户名" required>
              <FormInput v-model="inputText" placeholder="请输入用户名" />
            </FormItem>
            <FormItem label="邮箱" required>
              <FormInput v-model="inputEmail" type="email" placeholder="请输入邮箱" />
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Size</h3>
        <div class="flex gap-2 mb-3">
          <button
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast',
              formSize === 'md'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary',
            ]"
            @click="formSize = 'md'"
          >
            md（默认）
          </button>
          <button
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast',
              formSize === 'sm'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary',
            ]"
            @click="formSize = 'sm'"
          >
            sm（小号）
          </button>
        </div>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <Form :size="formSize">
            <FormItem label="用户名" required>
              <FormInput v-model="inputText" placeholder="请输入用户名" />
            </FormItem>
            <FormItem label="邮箱">
              <FormInput v-model="inputEmail" type="email" placeholder="请输入邮箱" />
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Error / Help 状态</h3>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <Form>
            <FormItem label="用户名" required error="用户名不能为空">
              <FormInput v-model="inputText" placeholder="请输入用户名" invalid />
            </FormItem>
            <FormItem label="邮箱" help="请输入常用邮箱地址">
              <FormInput v-model="inputEmail" type="email" placeholder="请输入邮箱" />
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Disabled 全局禁用</h3>
        <div class="flex gap-2 mb-3">
          <button
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast',
              formDisabled
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary',
            ]"
            @click="formDisabled = !formDisabled"
          >
            {{ formDisabled ? '已禁用' : '正常' }}
          </button>
        </div>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <Form :disabled="formDisabled" :show-required-mark="!formDisabled">
            <FormItem label="用户名" required>
              <FormInput v-model="inputText" placeholder="请输入用户名" />
            </FormItem>
            <FormItem label="邮箱" required>
              <FormInput v-model="inputEmail" type="email" placeholder="请输入邮箱" />
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>Form</strong> 通过
            <code>provide/inject</code>
            向子组件传递全局配置（size、labelWidth、labelPosition、disabled、showRequiredMark）
          </li>
          <li>
            <strong>FormItem</strong> 自动读取 Form 的全局配置，也可单独覆盖
            <code>labelPosition</code>、<code>labelWidth</code>
          </li>
          <li>
            <code>labelPosition="top"</code>（默认）上下布局；<code>labelPosition="left"</code>
            左右布局
          </li>
          <li>
            <code>error</code> 显示红色错误提示（role="alert"）；<code>help</code>
            显示灰色辅助说明
          </li>
          <li>
            <code>required</code> 在 label 前显示红色 <code>*</code> 标记，可通过
            <code>showRequiredMark</code> 全局关闭
          </li>
        </ul>
      </div>
    </Card>

    <!-- ===== FormInput 输入框 ===== -->
    <Card id="form-input" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FormInput 输入框</h2>
      <p class="text-small text-text-secondary mb-6">
        支持多种输入类型，<code>prefix/suffix</code> 插槽，<code>clearable</code> 可清空，<code
          >textarea</code
        >
        多行文本。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">输入类型</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormInput v-model="inputText" placeholder="text — 文本输入" />
          <FormInput v-model="inputPassword" type="password" placeholder="password — 密码输入" />
          <FormInput v-model="inputEmail" type="email" placeholder="email — 邮箱输入" />
          <FormInput v-model="inputPhone" type="tel" placeholder="tel — 手机号输入" />
          <FormInput v-model="inputNumber" type="number" placeholder="number — 数字输入" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormInput v-model="inputText" size="md" placeholder="md（默认）— 36px 高度" />
          <FormInput v-model="inputText" size="sm" placeholder="sm — 32px 高度" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">States</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormInput v-model="inputText" placeholder="正常状态" />
          <FormInput v-model="inputText" disabled placeholder="disabled — 禁用状态" />
          <FormInput v-model="inputText" readonly placeholder="readonly — 只读状态" />
          <FormInput v-model="inputText" invalid placeholder="invalid — 错误状态" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Clearable 可清空</h3>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <FormInput v-model="inputText" clearable placeholder="输入文字后显示清空按钮" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Textarea 多行文本</h3>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <FormInput
            v-model="inputTextarea"
            type="textarea"
            placeholder="请输入备注信息"
            :maxlength="200"
            show-word-limit
            :rows="4"
          />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Prefix / Suffix 插槽</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormInput v-model="inputText" placeholder="搜索内容">
            <template #prefix>
              <Search theme="outline" size="16" />
            </template>
          </FormInput>
          <FormInput v-model="inputPhone" type="tel" placeholder="请输入手机号">
            <template #suffix>
              <span
                class="text-[13px] text-brand-primary font-medium cursor-pointer select-none whitespace-nowrap"
                >获取验证码</span
              >
            </template>
          </FormInput>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li><strong>type</strong>：text / password / email / tel / url / number / textarea</li>
          <li>
            <strong>textarea</strong> 模式自动纵向布局，支持 <code>rows</code> 和
            <code>showWordLimit</code> 字数统计
          </li>
          <li><strong>prefix/suffix</strong> 通过具名插槽传入，支持图标和交互元素</li>
          <li><strong>clearable</strong> 模式下输入内容后显示清空按钮</li>
          <li><strong>trim</strong> 自动去除首尾空格（input 事件 + blur 事件双重触发）</li>
          <li>所有状态通过 Form 的 <code>disabled</code> 全局继承</li>
        </ul>
      </div>
    </Card>

    <!-- ===== FormSelect 下拉选择 ===== -->
    <Card id="form-select" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FormSelect 下拉选择</h2>
      <p class="text-small text-text-secondary mb-6">
        原生 select 封装，支持
        <code>options</code
        >、<code>placeholder</code>、<code>clearable</code>、<code>multiple</code>。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">基础单选</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormSelect v-model="selectValue" :options="selectOptions" placeholder="请选择咨询类型" />
          <FormSelect
            v-model="selectValue"
            :options="selectOptions"
            placeholder="可清空"
            clearable
          />
          <div class="text-[13px] text-text-secondary">
            当前选中：<code class="text-brand-primary">{{ selectValue || '（未选择）' }}</code>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormSelect
            v-model="selectValue"
            :options="selectOptions"
            placeholder="md（默认）"
            size="md"
          />
          <FormSelect
            v-model="selectValue"
            :options="selectOptions"
            placeholder="sm（小号）"
            size="sm"
          />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Disabled</h3>
        <div class="bg-surface-secondary rounded-inner p-5 max-w-120">
          <FormSelect
            v-model="selectValue"
            :options="selectOptions"
            placeholder="禁用状态"
            disabled
          />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Multiple 多选</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4 max-w-120">
          <FormSelect v-model="selectMultiValue" :options="selectOptions" multiple clearable />
          <div class="text-[13px] text-text-secondary">
            当前选中：<code class="text-brand-primary">{{
              selectMultiValue.length ? selectMultiValue.join(', ') : '（未选择）'
            }}</code>
          </div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>options</strong> 类型为 <code>{{ '{ label, value, disabled? }[]' }}</code>
          </li>
          <li><strong>multiple</strong> 多选模式，modelValue 为数组类型</li>
          <li><strong>clearable</strong> 选中值后显示清空按钮，多选模式下清空整个数组</li>
          <li>下拉箭头使用 Remix 图标组件</li>
        </ul>
      </div>
    </Card>

    <!-- ===== FormCheckbox 复选框 ===== -->
    <Card id="form-checkbox" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FormCheckbox 复选框</h2>
      <p class="text-small text-text-secondary mb-6">
        支持单布尔值和多选数组两种 <code>modelValue</code> 类型，<code>indeterminate</code>
        半选状态。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">单个复选框</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <FormCheckbox v-model="checkboxSingle" label="我同意《服务条款》和《隐私政策》" />
          <div class="text-[13px] text-text-secondary">
            当前状态：<code class="text-brand-primary">{{
              checkboxSingle ? '已勾选' : '未勾选'
            }}</code>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">多选组</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <div class="flex flex-col gap-3">
            <FormCheckbox v-model="checkboxMulti" value="product" label="产品咨询" />
            <FormCheckbox v-model="checkboxMulti" value="support" label="技术支持" />
            <FormCheckbox v-model="checkboxMulti" value="business" label="商务合作" />
          </div>
          <div class="text-[13px] text-text-secondary">
            当前选中：<code class="text-brand-primary">{{
              checkboxMulti.length ? checkboxMulti.join(', ') : '（未选择）'
            }}</code>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <FormCheckbox v-model="checkboxSingle" size="md" label="md（默认）" />
          <FormCheckbox v-model="checkboxSingle" size="sm" label="sm（小号）" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">States</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <FormCheckbox v-model="checkboxSingle" disabled label="disabled — 禁用未选中" />
          <FormCheckbox :model-value="true" disabled label="disabled — 禁用已选中" />
          <FormCheckbox :model-value="false" indeterminate label="indeterminate — 半选状态" />
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li><strong>modelValue 为 boolean</strong>：单复选框（如"同意条款"）</li>
          <li>
            <strong>modelValue 为数组</strong>：多选组，每个 FormCheckbox 需设置
            <code>value</code> 标识
          </li>
          <li><strong>indeterminate</strong>：用于"全选/半选"场景（如表格全选）</li>
          <li>选中态使用品牌色填充 + 白色对勾图标</li>
        </ul>
      </div>
    </Card>

    <!-- ===== FormRadio 单选框 ===== -->
    <Card id="form-radio" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FormRadio 单选框</h2>
      <p class="text-small text-text-secondary mb-6">
        基于 <code>options</code> 数组渲染，支持
        <code>direction</code>（horizontal/vertical）、<code>disabled</code>。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Direction</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >vertical（默认）</span
            >
            <FormRadio v-model="radioValue" :options="radioOptions" direction="vertical" />
          </div>
          <div>
            <span class="text-caption font-medium text-text-tertiary uppercase mb-2 block"
              >horizontal</span
            >
            <FormRadio v-model="radioValue" :options="radioOptions" direction="horizontal" />
          </div>
          <div class="text-[13px] text-text-secondary">
            当前选中：<code class="text-brand-primary">{{ radioValue || '（未选择）' }}</code>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex flex-col gap-4">
          <FormRadio v-model="radioValue" :options="radioOptions.slice(0, 2)" size="md" />
          <FormRadio v-model="radioValue" :options="radioOptions.slice(0, 2)" size="sm" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Disabled</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <FormRadio :model-value="radioOptions[0]?.value" :options="radioOptions" disabled />
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>options</strong> 类型为 <code>{{ '{ label, value, disabled? }[]' }}</code>
          </li>
          <li><strong>direction</strong>：vertical（默认，纵向排列）/ horizontal（横向排列）</li>
          <li>选中态圆点使用品牌色填充，带 <code>role="radiogroup"</code> 无障碍支持</li>
          <li>单个选项可通过 <code>opt.disabled</code> 禁用</li>
        </ul>
      </div>
    </Card>

    <!-- ===== FormSwitch 开关 ===== -->
    <Card id="form-switch" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FormSwitch 开关</h2>
      <p class="text-small text-text-secondary mb-6">
        布尔值开关，支持 <code>size</code>（md/sm）、<code>disabled</code>、<code>label</code>。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">基础开关</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex items-center gap-8">
          <div class="flex items-center gap-3">
            <FormSwitch v-model="switchValue1" />
            <span class="text-[13px] text-text-secondary">{{
              switchValue1 ? '开启' : '关闭'
            }}</span>
          </div>
          <div class="flex items-center gap-3">
            <FormSwitch v-model="switchValue2" />
            <span class="text-[13px] text-text-secondary">{{
              switchValue2 ? '开启' : '关闭'
            }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Sizes</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex items-center gap-8">
          <FormSwitch v-model="switchValue1" size="md" label="md（默认）" />
          <FormSwitch v-model="switchValue1" size="sm" label="sm（小号）" />
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">Disabled</h3>
        <div class="bg-surface-secondary rounded-inner p-5 flex items-center gap-8">
          <FormSwitch :model-value="false" disabled label="禁用 — 关闭" />
          <FormSwitch :model-value="true" disabled label="禁用 — 开启" />
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li><strong>modelValue</strong> 为 boolean 类型</li>
          <li>轨道使用 <code>rounded-pill</code> 圆角，滑块白色圆形带阴影</li>
          <li>切换动画 200ms，支持 <code>motion-reduce</code> 关闭</li>
          <li><code>role="switch"</code> + <code>aria-checked</code> 无障碍支持</li>
        </ul>
      </div>
    </Card>

    <!-- ===== 综合表单示例 ===== -->
    <Card id="form-demo" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">综合表单示例</h2>
      <p class="text-small text-text-secondary mb-6">
        组合所有 Form 组件的完整表单，含验证规则和提交处理。
      </p>

      <div class="bg-surface-secondary rounded-inner p-6 max-w-140">
        <Form
          ref="demoFormRef"
          :model="formModel"
          :rules="formRules"
          label-position="left"
          @submit="handleFormSubmit"
        >
          <FormItem label="姓名" required name="name" html-for="demo-name">
            <FormInput id="demo-name" v-model="formModel.name as string" placeholder="请输入姓名" />
          </FormItem>
          <FormItem label="邮箱" required name="email" html-for="demo-email">
            <FormInput
              id="demo-email"
              v-model="formModel.email as string"
              type="email"
              placeholder="请输入邮箱"
            />
          </FormItem>
          <FormItem label="手机号" required name="phone" html-for="demo-phone">
            <FormInput
              id="demo-phone"
              v-model="formModel.phone as string"
              type="tel"
              placeholder="请输入手机号"
            />
          </FormItem>
          <FormItem label="性别" required name="gender">
            <FormRadio
              v-model="formModel.gender as string"
              :options="[
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
              ]"
              direction="horizontal"
            />
          </FormItem>
          <FormItem label="咨询类型" required name="category" html-for="demo-category">
            <FormSelect
              id="demo-category"
              v-model="formModel.category as string"
              :options="selectOptions"
              placeholder="请选择咨询类型"
            />
          </FormItem>
          <FormItem label="兴趣方向" name="interests">
            <div class="flex flex-col gap-2">
              <FormCheckbox
                v-model="formModel.interests as (string | number)[]"
                value="product"
                label="产品功能"
              />
              <FormCheckbox
                v-model="formModel.interests as (string | number)[]"
                value="pricing"
                label="价格方案"
              />
              <FormCheckbox
                v-model="formModel.interests as (string | number)[]"
                value="case"
                label="客户案例"
              />
            </div>
          </FormItem>
          <FormItem label="备注" name="remark" html-for="demo-remark">
            <FormInput
              id="demo-remark"
              v-model="formModel.remark as string"
              type="textarea"
              placeholder="请输入备注信息"
              :maxlength="200"
              show-word-limit
              :rows="3"
            />
          </FormItem>
          <FormItem label="通知设置" name="enableNotifications">
            <FormSwitch v-model="formModel.enableNotifications as boolean" label="启用邮件通知" />
          </FormItem>
          <FormItem name="agreement">
            <FormCheckbox
              v-model="formModel.agreement as boolean"
              label="我同意《服务条款》和《隐私政策》"
            />
          </FormItem>
          <div class="flex gap-3 pt-2">
            <Button type="submit" size="lg">提交表单</Button>
            <Button
              variant="outline"
              size="lg"
              @click="
                Object.assign(formModel, {
                  name: '',
                  email: '',
                  phone: '',
                  gender: '',
                  category: '',
                  interests: [],
                  enableNotifications: true,
                  agreement: false,
                  remark: '',
                })
              "
              >重置</Button
            >
          </div>
        </Form>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>Form</strong> 通过 <code>model</code> + <code>rules</code> 实现表单校验，<code
              >ref.validate()</code
            >
            手动触发验证
          </li>
          <li>
            <strong>FormItem</strong> 自动继承 Form 的 <code>labelPosition</code>、<code>size</code>
            等全局配置
          </li>
          <li>表单提交时触发 <code>@submit</code> 事件（需在 <code>&lt;Form&gt;</code> 上监听）</li>
          <li>
            验证规则支持
            <code>required</code
            >、<code>pattern</code>（正则）、<code>min/max</code>（长度/数值）、<code>validator</code>（自定义函数）
          </li>
          <li>
            所有 Form 子组件通过
            <code>inject(FormInjectionKey, null)</code> 获取上下文，独立使用时自动降级
          </li>
        </ul>
      </div>
    </Card>

    <!-- ===== SectionHeading ===== -->
    <Card id="section-heading" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">SectionHeading 标题区</h2>
      <p class="text-small text-text-secondary mb-6">
        居中/左对齐/可点击 3 种模式 + kicker 装饰标签。
      </p>
      <div class="flex flex-col gap-8">
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-3"
            >Center + Kicker</span
          >
          <div class="bg-surface-secondary rounded-card p-10">
            <SectionHeading
              title="AI CRM，无处不在"
              subtitle="四大核心场景，AI 深度融入销售全链路"
              kicker="增长引擎"
            />
          </div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-3"
            >Left Align + Clickable</span
          >
          <div class="bg-surface-secondary rounded-card p-10">
            <SectionHeading
              title="客户案例"
              subtitle="覆盖科技、教育、医疗、建筑等 30+ 行业的最佳实践"
              align="left"
              clickable
              @click="console.log('clicked')"
            />
          </div>
        </div>
        <div>
          <span class="block text-caption font-medium text-text-tertiary uppercase mb-3"
            >AI 风格</span
          >
          <div class="bg-surface-secondary rounded-card p-10">
            <div
              class="flex items-center gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-6"
              role="button"
              tabindex="0"
            >
              <span
                class="grid place-items-center w-11 h-11 rounded-full bg-brand-accent-hero-gradient shadow-ai-logo text-white text-body font-black"
                aria-hidden="true"
                >AI</span
              >
              <span class="text-h1 font-extrabold text-text-primary leading-1.2"
                >Hello！我是你的 AI 销售助理！</span
              >
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- ===== Pagination ===== -->
    <Card id="pagination" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Pagination 翻页</h2>
      <p class="text-small text-text-secondary mb-6">
        通用翻页组件，支持页码导航、每页条数切换、快速跳转。
      </p>

      <!-- 基本翻页 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">基本翻页</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <Pagination
            v-model:current-page="paginationDemo.page"
            v-model:page-size="paginationDemo.pageSize"
            :total="paginationDemo.total"
            @change="paginationDemo.handleChange"
          />
        </div>
      </div>

      <!-- 带每页条数切换 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">每页条数切换</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <Pagination
            v-model:current-page="paginationDemo2.page"
            v-model:page-size="paginationDemo2.pageSize"
            :total="paginationDemo2.total"
            :show-size-changer="true"
            @change="paginationDemo2.handleChange"
          />
        </div>
      </div>

      <!-- 带快速跳转 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">快速跳转</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <Pagination
            v-model:current-page="paginationDemo3.page"
            v-model:page-size="paginationDemo3.pageSize"
            :total="paginationDemo3.total"
            :show-quick-jumper="true"
            @change="paginationDemo3.handleChange"
          />
        </div>
      </div>

      <!-- 完整功能 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">完整功能</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <Pagination
            v-model:current-page="paginationDemo4.page"
            v-model:page-size="paginationDemo4.pageSize"
            :total="paginationDemo4.total"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :show-total="true"
            @change="paginationDemo4.handleChange"
          />
        </div>
      </div>

      <!-- 禁用状态 -->
      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">禁用状态</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <Pagination
            v-model:current-page="paginationDisabled.page"
            v-model:page-size="paginationDisabled.pageSize"
            :total="paginationDisabled.total"
            :show-size-changer="true"
            :show-quick-jumper="true"
            disabled
          />
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            <strong>v-model:current-page</strong> + <strong>v-model:page-size</strong>：通过 Vue
            v-model 双向绑定分页状态
          </li>
          <li>
            <strong>total</strong>：数据总条数，组件自动计算总页数（<code
              >Math.ceil(total / pageSize)</code
            >）
          </li>
          <li>
            <strong>showSizeChanger</strong>：显示每页条数选择器（原生
            <code>&lt;select&gt;</code>，默认 [10, 20, 50, 100]）
          </li>
          <li>
            <strong>showQuickJumper</strong>：显示快速跳转输入框，按 Enter 或点击 "跳转" 按钮跳转
          </li>
          <li>
            <strong>@change</strong>：页码或每页条数变化时触发，参数为
            <code>(page, size)</code>
          </li>
          <li>总页数 ≤ 7 时全部显示；超过 7 页时自动添加省略号</li>
          <li>当前页靠近首尾时自动扩展可见页码范围，避免省略号过多</li>
        </ul>
      </div>
    </Card>

    <!-- ================================================================ -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Left,
  Right,
  Search,
  Magic,
  Close,
  Home,
  Setting,
  Message,
  People,
} from '@/client/components/ui/remixIcons'
import Button from '@/client/components/ui/Button.vue'
import Card from '@/client/components/ui/Card.vue'
import VideoCard from '@/client/components/ui/VideoCard.vue'
import Badge from '@/client/components/ui/Badge.vue'
import Tabs from '@/client/components/ui/Tabs.vue'
import Skeleton from '@/client/components/ui/Skeleton.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import Form from '@/client/components/ui/Form.vue'
import FormItem from '@/client/components/ui/FormItem.vue'
import FormInput from '@/client/components/ui/FormInput.vue'
import FormSelect from '@/client/components/ui/FormSelect.vue'
import FormCheckbox from '@/client/components/ui/FormCheckbox.vue'
import FormRadio from '@/client/components/ui/FormRadio.vue'
import FormSwitch from '@/client/components/ui/FormSwitch.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import Pagination from '@/client/components/ui/Pagination.vue'

// ===== 组件数据 =====
const buttonVariants = [
  'primary',
  'outline',
  'outline-neutral',
  'text',
  'hero',
  'hero-outline',
  'outline-fill',
] as const
const buttonColors = ['brand', 'accent'] as const
const buttonSizes = ['lg', 'md', 'sm'] as const
const badgeVariants = ['brand', 'accent', 'success', 'warning', 'info'] as const

// ===== Tabs 组件演示状态 =====
const tabsActive1 = ref('tab1')
const tabsActive2 = ref('tab1')
const tabsActive3 = ref('tab1')

const tabsItems = [
  { key: 'tab1', label: '全部' },
  { key: 'tab2', label: '进行中' },
  { key: 'tab3', label: '已完成' },
  { key: 'tab4', label: '已归档' },
]

const tabsItemsWithIcon = [
  { key: 'tab1', label: '首页', icon: Home },
  { key: 'tab2', label: '设置', icon: Setting },
  { key: 'tab3', label: '消息', icon: Message },
  { key: 'tab4', label: '联系人', icon: People },
]

const tabsItemsWithBadgeAndIcon = [
  { key: 'tab1', label: '全部', icon: Home, badge: 12 },
  { key: 'tab2', label: '待处理', icon: Setting, badge: 5 },
  { key: 'tab3', label: '已完成', icon: Message, badge: 0 },
  { key: 'tab4', label: '已归档', icon: People },
]

const tabsItemsWithDisabledAndIcon = [
  { key: 'tab1', label: '可用', icon: Home },
  { key: 'tab2', label: '禁用', icon: Setting, disabled: true },
  { key: 'tab3', label: '正常', icon: Message },
]

const tabsActiveBgOptions = ['gray', 'brand', 'accent', 'white'] as const
const tabsActiveBg = reactive<Record<string, string>>({
  gray: 'tab1',
  brand: 'tab1',
  accent: 'tab1',
  white: 'tab1',
})

// 图标颜色演示
const tabsIconAuto = ref('tab1')
const tabsIconAutoItems = [
  { key: 'tab1', label: '首页', icon: Home },
  { key: 'tab2', label: '设置', icon: Setting },
  { key: 'tab3', label: '消息', icon: Message },
  { key: 'tab4', label: '联系人', icon: People },
  { key: 'tab5', label: '搜索', icon: Search },
  { key: 'tab6', label: '收藏', icon: Magic },
]
const tabsIconManual = ref('tab1')
const tabsIconManualItems = [
  { key: 'tab1', label: '全部', icon: Home, iconColor: '#ff6400' },
  { key: 'tab2', label: '收藏', icon: Magic, iconColor: '#f59e0b' },
  { key: 'tab3', label: '热门', icon: Search, iconColor: '#d1242f' },
  { key: 'tab4', label: '最新', icon: Message, iconColor: '#16a34a' },
]

const tabsAlignStart = ref('tab1')
const tabsAlignCenter = ref('tab1')
const tabsAlignEnd = ref('tab1')
const tabsFullWidth = ref('tab1')
const tabsBadge = ref('tab1')
const tabsDisabled = ref('tab1')

// ===== Form 组件演示状态 =====
const formSize = ref<'md' | 'sm'>('md')
const formLabelPosition = ref<'top' | 'left'>('top')
const formDisabled = ref(false)

const inputText = ref('')
const inputPassword = ref('')
const inputEmail = ref('')
const inputPhone = ref('')
const inputTextarea = ref('')
const inputNumber = ref('')

const selectValue = ref('')
const selectMultiValue = ref<(string | number)[]>([])
const selectOptions = [
  { label: '产品咨询', value: 'product' },
  { label: '技术支持', value: 'support' },
  { label: '商务合作', value: 'business' },
  { label: '其他问题', value: 'other', disabled: true },
]

const checkboxSingle = ref(false)
const checkboxMulti = ref<(string | number)[]>([])

const radioValue = ref('')
const radioOptions = [
  { label: '选项 A', value: 'a' },
  { label: '选项 B', value: 'b' },
  { label: '选项 C（禁用）', value: 'c', disabled: true },
]

const switchValue1 = ref(false)
const switchValue2 = ref(true)

// 综合表单
const demoFormRef = ref<InstanceType<typeof Form> | null>(null)
const formModel = reactive<Record<string, unknown>>({
  name: '',
  email: '',
  phone: '',
  gender: '',
  category: '',
  interests: [] as (string | number)[],
  enableNotifications: true,
  agreement: false,
  remark: '',
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' as const }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' as const },
    { type: 'email' as const, message: '请输入正确的邮箱格式', trigger: 'blur' as const },
  ],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' as const }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' as const }],
  category: [{ required: true, message: '请选择咨询类型', trigger: 'change' as const }],
  agreement: [
    {
      validator: (value: unknown) => {
        if (!value) {
          return '请同意服务条款'
        }
        return true
      },
      trigger: 'change' as const,
    },
  ],
}

function handleFormSubmit() {
  console.log('表单提交:', { ...formModel })
}

function onRetry(source: string) {
  console.log('retry from:', source)
}

// ===== Pagination 组件演示状态 =====
const paginationDemo = reactive({
  page: 1,
  pageSize: 10,
  total: 86,
  handleChange(page: number, size: number) {
    console.log(`Pagination 基本: page=${page}, size=${size}`)
  },
})

const paginationDemo2 = reactive({
  page: 1,
  pageSize: 20,
  total: 156,
  handleChange(page: number, size: number) {
    console.log(`Pagination 切换条数: page=${page}, size=${size}`)
  },
})

const paginationDemo3 = reactive({
  page: 3,
  pageSize: 10,
  total: 200,
  handleChange(page: number, size: number) {
    console.log(`Pagination 快速跳转: page=${page}, size=${size}`)
  },
})

const paginationDemo4 = reactive({
  page: 5,
  pageSize: 20,
  total: 500,
  handleChange(page: number, size: number) {
    console.log(`Pagination 完整功能: page=${page}, size=${size}`)
  },
})

const paginationDisabled = reactive({
  page: 1,
  pageSize: 10,
  total: 86,
})
</script>
