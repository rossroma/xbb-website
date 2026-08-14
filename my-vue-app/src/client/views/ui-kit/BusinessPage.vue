<template>
  <div class="flex flex-col gap-6">
    <!-- 分类三：Business 组件                                                  -->
    <!-- ================================================================ -->
    <div id="cat-business" class="scroll-mt-14 lg:scroll-mt-0 mt-6">
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded bg-status-success-soft text-status-success text-caption font-bold uppercase tracking-wider"
          >Business 组件</span
        >
      </div>
    </div>

    <!-- ===== HeroBanner ===== -->
    <Card id="hero-banner" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">HeroBanner 轮播</h2>
      <p class="text-small text-text-secondary mb-6">
        全宽轮播，自动播放，渐变背景，视频/图片媒体，左右箭头 + 指示点。
      </p>
      <HeroBanner :slides="bannerSlides" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: slides: BannerSlide[] — 支持 video/image 两种媒体类型</li>
          <li>自动播放 5s，hover 暂停，离开恢复</li>
          <li>支持 prefers-reduced-motion 关闭动画</li>
          <li>按钮使用 Button 组件 variant="hero" 和 variant="hero-outline"</li>
        </ul>
      </div>
    </Card>

    <!-- ===== HeroBanner (single) ===== -->
    <Card id="hero-banner-single" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">HeroBanner 单页 Hero</h2>
      <p class="text-small text-text-secondary mb-6">
        mode="single" 模式，子页面 Hero 区域，左文案右插图，支持双操作按钮，无轮播。
      </p>
      <div class="mb-4 flex flex-col items-start gap-2">
        <span class="text-caption font-semibold text-text-tertiary uppercase tracking-wider">
          Single Layout
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="layout in heroBannerSingleLayoutOptions"
            :key="layout"
            type="button"
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-all duration-fast',
              heroBannerSingleLayout === layout
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-primary',
            ]"
            @click="setHeroBannerSingleLayout(layout)"
          >
            {{ layout }}
          </button>
        </div>
      </div>
      <div class="border border-border-subtle rounded-card overflow-hidden">
        <HeroBanner
          mode="single"
          :single-layout="heroBannerSingleLayout"
          :slides="[heroBannerDemoSlide]"
        />
      </div>
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: mode="single", slides: BannerSlide[] (取第一个)</li>
          <li>singleLayout: horizontal | vertical</li>
          <li>Emits: action(slide, 'primary' | 'secondary')</li>
          <li>全宽通栏，grid-cols-[1fr_1fr]，移动端堆叠</li>
        </ul>
      </div>
    </Card>

    <!-- ===== HeroBanner (showcase carousel) ===== -->
    <Card id="hero-banner-showcase-carousel" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">HeroBanner 展示轮播</h2>
      <p class="text-small text-text-secondary mb-6">
        mode="showcase-carousel" 模式，复刻留资页第四/第五模块，支持左文右图和右文左图。
      </p>
      <div class="mb-4 flex flex-col items-start gap-2">
        <span class="text-caption font-semibold text-text-tertiary uppercase tracking-wider">
          Layout
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="layout in showcaseCarouselLayoutOptions"
            :key="layout"
            type="button"
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-all duration-fast',
              showcaseCarouselLayout === layout
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-primary',
            ]"
            @click="setShowcaseCarouselLayout(layout)"
          >
            {{ layout }}
          </button>
        </div>
      </div>
      <div class="border border-border-subtle rounded-card overflow-hidden">
        <HeroBanner
          mode="showcase-carousel"
          :showcase-layout="showcaseCarouselLayout"
          :showcase-title="showcaseCarouselTitle"
          :showcase-slides="showcaseCarouselSlides"
        />
      </div>
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: mode="showcase-carousel", showcaseSlides: HeroShowcaseSlide[]</li>
          <li>showcaseLayout: text-left（左文右图）| text-right（右文左图）</li>
          <li>自动播放 5s，hover 暂停，离开恢复</li>
        </ul>
      </div>
    </Card>

    <!-- ===== GradientHero ===== -->
    <PlaygroundShell
      section-id="gradient-hero"
      title="GradientHero 功能介绍"
      description="全宽通栏径向渐变背景，左文右图。支持 badge 图标、tag 标签、CTA 按钮、标题渐变色，10 种主题。"
      code-tag="GradientHero"
      code-self-closing
      :code-extra-props="featureIntroCodeExtra"
      :controls="featureIntroControls"
      :initial-props="featureIntroDefaults"
      :usage-notes="[
        'Props: title, description, image（必需）；badgeIcon?, tag?, buttonText?, theme?, reverse?, titleGradient?, linkHref?',
        'Emits: buttonClick',
        'theme: purple（默认）| blue | teal | green | orange | plain | slate | indigo | amber | sky',
        'tag + buttonText 启用案例卡片模式（来自原 CaseCard），badgeIcon 启用功能介绍模式',
        'titleGradient: 标题是否使用渐变色',
        'reverse 控制图文左右位置互换',
      ]"
      v-slot="fiProps"
    >
      <GradientHero
        v-bind="fiProps as any"
        :badge-icon="fiProps.mode === 'intro' && fiProps.badgeIcon === 'show' ? Star : undefined"
        :tag="fiProps.mode === 'case' ? '制造行业' : undefined"
        :button-text="fiProps.mode === 'case' ? '了解详情' : undefined"
      />
    </PlaygroundShell>

    <!-- ===== PromoBanner ===== -->
    <Card id="promo-banner" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">PromoBanner 媒体横条</h2>
      <p class="text-small text-text-secondary mb-6">左文右图，客户列表，操作按钮，响应式堆叠。</p>
      <PromoBanner
        eyebrow="安恒信息、外研在线、尼普顿、京达生物.."
        title="AI时代，先进企业为何选择用销帮帮AI CRM 重新定义增长"
        cta-text="定制企业提效方案"
        :image="custChoiseImg"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: eyebrow, title, ctaText, image</li>
          <li>按钮使用 Button variant="outline-neutral"</li>
          <li>支持 ctaClick 事件</li>
        </ul>
      </div>
    </Card>

    <!-- ===== PromoBannerCarousel ===== -->
    <Card id="promo-banner-carousel" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">PromoBannerCarousel 轮播横幅</h2>
      <p class="text-small text-text-secondary mb-6">
        结合 Carousel 与 PromoBanner 紧凑布局，支持自动轮播、指示点切换，无左右箭头，适合子页面
        Banner 区。
      </p>
      <PromoBannerCarousel :slides="promoCarouselDemoSlides" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: slides: PromoBannerSlide[]（必需）；autoPlay?, interval?</li>
          <li>
            PromoBannerSlide 字段：key, eyebrow, title, ctaText, image（必需）；imageAlt?（可选）
          </li>
          <li>默认自动播放 5s，hover 暂停，离开恢复</li>
          <li>底部指示点用于切换，无左右箭头</li>
          <li>按钮使用 Button variant="outline-neutral"</li>
          <li>支持 ctaClick 事件，传递当前 slide 数据</li>
        </ul>
      </div>
    </Card>

    <!-- ===== FeatureImageCard ===== -->
    <Card id="feature-image-card" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FeatureImageCard 图片卡片网格</h2>
      <p class="text-small text-text-secondary mb-6">
        4 列可点击卡片，hover 上浮 + 渐变图标，图片 + 标签 + 要点网格。
      </p>
      <FeatureImageCard heading="解决方案" :cards="solutionCards" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: heading, subheading, cards: FeatureImageCard[]</li>
          <li>卡片 hover 上浮 10px + 缩放 1.01 + 阴影提升</li>
          <li>图标使用 IconBadge variant="gradient"</li>
          <li>支持 headingClick 和 cardClick 事件</li>
        </ul>
      </div>
    </Card>

    <!-- ===== ImageShowcase ===== -->
    <PlaygroundShell
      section-id="image-showcase"
      title="ImageShowcase 左右布局展示"
      description="左侧标题与副标题，右侧完整图片，可选按钮，支持左右位置切换。"
      code-tag="ImageShowcase"
      code-self-closing
      :code-extra-props="imageShowcaseCodeExtra"
      :controls="imageShowcaseControls"
      :initial-props="imageShowcaseDefaults"
      :usage-notes="[
        'Props: title, subtitle, image（必需）；imageAlt?, layout?, theme?, ctaText?',
        'layout: text-left（左文右图）| text-right（右文左图）',
        'theme: purple | blue | teal | green | orange | plain | slate | indigo | amber | sky',
        '左侧保留标题、副标题和可选按钮，右侧为图片展示，切换时仅变换左右位置',
        'CTA Button 控件可切换 ctaText 按钮是否显示',
        '建议图片比例 16:10 或 4:3，推荐宽度 700px 以上',
      ]"
      v-slot="imgProps"
    >
      <ImageShowcase v-bind="imgProps as any" />
    </PlaygroundShell>

    <!-- ===== ArticleSidebar ===== -->
    <PlaygroundShell
      section-id="article-sidebar"
      title="ArticleSidebar 文章侧边栏"
      description="文章页右侧栏，顶部支持推广图片，底部支持文章目录或场景解决方案标签。"
      code-tag="ArticleSidebar"
      code-self-closing
      :code-extra-props="articleSidebarCodeExtra"
      :controls="articleSidebarControls"
      :initial-props="articleSidebarDefaults"
      :usage-notes="[
        'Props: banners?, tocItems（必需）, variant?, activeTocId?, title?, collapsedCount?, defaultExpanded?, expandText?, collapseText?, viewAllText?, viewAllLink?',
        'Banner 字段：title, image（必需）；key?, imageAlt?, to?, href?（可选）',
        'TocItem 字段：id, title（必需）；href?（可选，未传时默认跳转 #id）',
        'variant: toc（文章目录，默认）| link-tags（场景方案标签）',
        '推广位直接渲染整张图片，不再使用渐变方块和文案覆盖',
        '目录收起态使用底部渐变遮罩，展开/收起为纯文字按钮',
        'link-tags 模式使用两列轻量标签，并可通过 viewAllText/viewAllLink 添加底部更多入口',
        'link-tags 模式不渲染 banners，适合文章列表右侧的推荐场景解决方案模块',
      ]"
      v-slot="sidebarProps"
    >
      <div class="grid grid-cols-[minmax(0,1fr)_300px] gap-8 max-lg:grid-cols-1">
        <article class="rounded-card border border-border-subtle bg-surface-primary p-8">
          <h3 class="text-h2 font-bold text-text-primary leading-heading">
            适合中小企业的客户关系crm管理系统推荐及使用建议
          </h3>
          <p class="mt-4 text-body text-text-secondary leading-body">
            中小企业在市场竞争中处于一个非常特殊的位置：资源有限、业务灵活、发展速度快，但也更容易遇到客户管理混乱、销售跟进脱节、客户数据丢失等问题。
          </p>
          <p class="mt-4 text-body text-text-secondary leading-body">
            本示例使用知识问答页面的目录文本，展示文章右侧推广图片和目录折叠遮罩的组合效果。
          </p>
        </article>
        <div class="w-full max-w-75 justify-self-end max-lg:justify-self-start">
          <ArticleSidebar
            :banners="articleSidebarDemoBanners"
            :toc-items="
              sidebarProps.variant === 'link-tags'
                ? articleSidebarSceneItems
                : articleSidebarDemoTocItems
            "
            :variant="sidebarProps.variant as ArticleSidebarVariant"
            :title="sidebarProps.variant === 'link-tags' ? '推荐CRM场景解决方案' : '文章目录'"
            :active-toc-id="
              sidebarProps.variant === 'link-tags' ? '' : String(sidebarProps['active-toc-id'])
            "
            :collapsed-count="Number(sidebarProps['collapsed-count'])"
            :view-all-text="sidebarProps.variant === 'link-tags' ? '更多场景解决方案 →' : ''"
            :view-all-link="sidebarProps.variant === 'link-tags' ? '/jiejuefangan' : ''"
          />
        </div>
      </div>
    </PlaygroundShell>

    <!-- ===== ContentCardGrid ===== -->
    <PlaygroundShell
      section-id="content-card-grid"
      title="ContentCardGrid 图文卡片网格"
      description="图文卡片网格，支持多种形态 × 2 种布局方向。variant 控制展示形态，layout 控制排列方向，rounded 控制圆角开关。"
      code-tag="ContentCardGrid"
      code-self-closing
      :code-extra-props="imageTextCardGridCodeExtra"
      :controls="imageTextCardGridControls"
      :initial-props="imageTextCardGridDefaults"
      :usage-notes="[
        'Props: title, cards（必需）；subtitle?, variant?, layout?, columns?, rounded?',
        'variant: case（案例）| product（产品）| resource（资源）| square（正方形）',
        'layout: vertical（默认）| horizontal（水平排列）',
        'columns: vertical 3/4/5，horizontal 1/2',
        'rounded: true（默认，圆角）| false（直角）',
        'resource 变体：含描述 + 底部链接按钮',
        'square 变体：卡片 1:1 正方形，图片 4:3，标题 + 2行描述',
        'horizontal 布局：左图右文，单列模式显示摘要',
      ]"
      v-slot="itProps"
    >
      <ContentCardGrid
        v-bind="itProps as any"
        :title="String(itProps.title ?? '')"
        :subtitle="String(itProps.subtitle ?? '')"
        :cards="
          itProps.variant === 'square'
            ? demoSquareCards
            : itProps.variant === 'resource'
              ? resourceDemoCards
              : itProps.layout === 'horizontal'
                ? itProps.columns === 1
                  ? demoFeatureSingleCards
                  : demoFeatureCards
                : itProps.variant === 'product'
                  ? demoProductCards
                  : demoCaseCards
        "
      />
    </PlaygroundShell>

    <!-- ===== AddressTabs ===== -->
    <Card id="address-tabs" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">AddressTabs 地址切换</h2>
      <p class="text-small text-text-secondary mb-6">
        顶部 tab 切换城市，下方展示地图与地址信息，适合联系我们页面的地址模块。
      </p>
      <AddressTabs title="公司地址" :items="addressTabsDemoItems" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: title?, subtitle?, items</li>
          <li>items 字段：title, description?, image, imageAlt?, mapLabel?, hotline?, email?</li>
          <li>点击顶部 tab 切换下方地图和右侧地址内容。</li>
        </ul>
      </div>
    </Card>

    <!-- ===== AiCrmFeatureGrid ===== -->
    <Card id="ai-crm-feature-grid" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">AiCrmFeatureGrid AI+CRM 能力卡片</h2>
      <p class="text-small text-text-secondary mb-6">
        从 ContentCardGrid 的 ai-crm
        变体拆分出来的独立组件，复用留资页模块三的高卡片、背景图、图标与能力清单样式。
      </p>
      <AiCrmFeatureGrid title="AI+CRM，驱动企业业绩增长20%利润翻倍" :cards="aiCrmDemoCards" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: title?, cards（必需）</li>
          <li>card 字段：title, image?, icon?, description?, sideImage?, points?</li>
          <li>适合 AI+CRM 能力类高卡片展示，不再作为 ContentCardGrid 的 variant 使用</li>
        </ul>
      </div>
    </Card>

    <!-- ===== ImageCardGrid（标题高亮按钮：取当前标题末两字） ===== -->
    <PlaygroundShell
      section-id="image-card-grid"
      title="ImageCardGrid 图片卡片网格"
      description="图片卡片网格组件，支持原 image-card 图文卡片和大卡片 feature-panel 两种视觉风格。"
      code-tag="ImageCardGrid"
      code-self-closing
      :code-extra-props="imageCardGridCodeExtra"
      :controls="imageCardGridControls"
      :initial-props="imageCardGridDefaults"
      :usage-notes="[
        'Props: title, cards（必需）；titleHighlight?, subtitle?, columns?, variant?, colorScheme?',
        '标题高亮按钮：点击“高亮标题末两字”会取当前 title 最后两个字作为 title-highlight；再次点击取消高亮。',
        'variant: image-card（标题 + 描述 + 图片）| feature-panel（序号 + 模块 + 标题 + 描述 + 底部图片大卡片）',
        'colorScheme: brand | accent | mint | neutral | clean',
        'columns: 2 | 3 | 4，移动端自动 1 列',
        'ImageCardGridItem 字段：title（必需）；description?, image?, imageAlt?, number?, module?',
      ]"
      v-slot="icgProps"
    >
      <!-- 标题高亮演示：将当前 title 的最后两个字传给 title-highlight -->
      <div class="mb-4 flex justify-start">
        <button
          type="button"
          :class="[
            'inline-flex items-center rounded-pill px-4 py-1.5 text-[13px] font-medium transition-all duration-fast',
            imageCardGridTitleHighlightEnabled
              ? 'bg-brand-primary text-white'
              : 'border border-border-default text-text-secondary hover:border-brand-primary hover:text-text-primary',
          ]"
          @click="toggleImageCardGridTitleHighlight"
        >
          {{ imageCardGridTitleHighlightEnabled ? '取消标题高亮' : '高亮标题末两字' }}
        </button>
      </div>
      <ImageCardGrid
        v-bind="icgProps as any"
        :title-highlight="
          imageCardGridTitleHighlightEnabled ? getLastTwoTitleHighlight(icgProps.title) : undefined
        "
        :cards="
          icgProps.variant === 'feature-panel' ? imagePanelDemoCards : imageCardDemoFeatures
        "
      />
    </PlaygroundShell>

    <!-- ===== IconCardGrid（标题高亮按钮：取当前标题末两字） ===== -->
    <PlaygroundShell
      section-id="icon-card-grid"
      title="IconCardGrid 能力卡片网格"
      description="展示功能/能力卡片，支持 5 种视觉风格 × 4 种色彩方案，2 / 3 / 4 / 5 / 7 列布局。"
      code-tag="IconCardGrid"
      :code-extra-props="featureCardGridCodeExtra"
      code-self-closing
      :controls="featureCardGridControls"
      :initial-props="featureCardGridDefaults"
      :usage-notes="[
        'Props: title, features（必需）；titleHighlight?, subtitle?, topImages?, columns?, variant?, colorScheme?',
        '标题高亮按钮：点击“高亮标题末两字”会取当前 title 最后两个字作为 title-highlight；再次点击取消高亮。',
        'variant: plain（默认）| icon-badge（图标徽章行内）| icon-badge-protruding（凸出）| accent-strip（顶部强调线）| icon-tile（图标方块 + 标题下置）',
        'colorScheme: brand（品牌橙）| accent（蓝紫）| neutral（中性灰）| clean（icon-tile 无底色/无阴影/小图标）',
        'columns: 2 | 3 | 4 | 5 | 7（默认 4），移动端自动 1 列',
      ]"
      v-slot="fgProps"
    >
      <!-- 标题高亮演示：将当前 title 的最后两个字传给 title-highlight -->
      <div class="mb-4 flex justify-start">
        <button
          type="button"
          :class="[
            'inline-flex items-center rounded-pill px-4 py-1.5 text-[13px] font-medium transition-all duration-fast',
            iconCardGridTitleHighlightEnabled
              ? 'bg-brand-primary text-white'
              : 'border border-border-default text-text-secondary hover:border-brand-primary hover:text-text-primary',
          ]"
          @click="toggleIconCardGridTitleHighlight"
        >
          {{ iconCardGridTitleHighlightEnabled ? '取消标题高亮' : '高亮标题末两字' }}
        </button>
      </div>
      <IconCardGrid
        v-bind="fgProps as any"
        :title-highlight="
          iconCardGridTitleHighlightEnabled ? getLastTwoTitleHighlight(fgProps.title) : undefined
        "
        :features="
          fgProps.variant === 'icon-badge-protruding' ? ecoConnectCards : featureCardDemoFeatures
        "
      />
    </PlaygroundShell>

    <!-- ===== GradientCardGrid ===== -->
    <Card id="gradient-card-grid" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">GradientCardGrid 功能展示</h2>
      <p class="text-small text-text-secondary mb-6">
        4 列功能卡片，5 种渐变主题，支持图标前缀、前景图，hover 上浮 + 阴影。
      </p>
      <GradientCardGrid
        title="Hello！我是你的 AI 销售助理！"
        title-prefix="AI"
        :cards="assistantCards"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            Props: <code>title</code>, <code>cards</code>（必需）； <code>titleIcon</code> /
            <code>titlePrefix</code>（可选）
          </li>
          <li>
            Card 字段：<code>title</code>, <code>description</code>（必需）； <code>icon</code>,
            <code>gradient</code>, <code>image</code>, <code>imageAlt</code>（可选）
          </li>
          <li>
            渐变主题：<code>purple</code> | <code>blue</code> | <code>teal</code> |
            <code>green</code> | <code>orange</code>
          </li>
          <li>Slot <code>#visual</code> 接收 <code>{ card, index }</code>，可覆盖默认前景图</li>
          <li>支持 titleClick 和 cardClick 事件</li>
        </ul>
      </div>
    </Card>

    <!-- ===== SplitSection ===== -->
    <PlaygroundShell
      section-id="split-section"
      title="SplitSection 图文分栏"
      description="左右分栏布局，支持列表项（4 种图标颜色主题）或段落描述，双栏浅色背景，高度自适应。"
      code-tag="SplitSection"
      code-self-closing
      :code-extra-props="splitSectionCodeExtra"
      :controls="splitSectionControls"
      :initial-props="splitSectionDefaults"
      :usage-notes="[
        'Props: heading, description?, image, imageAlt?, reverse?, items?, iconTheme?',
        'iconTheme: brand（品牌橙，默认）| accent（蓝紫）| gradient（渐变圆底+白色图标）| neutral（中性灰）',
        'items: SplitSectionItem[]，每项含 icon?（图标组件，不传默认 CheckSmall）+ text',
        'items 和 description 互斥：提供 items 时优先渲染列表，否则回退到 description',
        '建议图片比例 16:10 或 4:3，推荐宽度 600–800px',
        '文字区域高度以图片区域为准，超出部分将被截断',
        'reverse 控制图文左右位置互换',
        'heading 和 description 支持 \\n 换行',
        '桌面端 grid-cols-2，移动端单列堆叠',
        '文本区背景: bg-surface-secondary，图片区背景: bg-split-image-gradient 暖色渐变',
      ]"
      v-slot="ssProps"
    >
      <SplitSection
        v-bind="ssProps as any"
        :items="ssProps.contentMode === 'description' ? undefined : ssProps.items"
        :description="
          ssProps.contentMode === 'description' ? (ssProps.description as string) : undefined
        "
      />
    </PlaygroundShell>

    <!-- ===== SplitCardLayout ===== -->
    <Card id="split-card-layout" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">SplitCardLayout 分栏卡片布局</h2>
      <p class="text-small text-text-secondary mb-6">
        左右分栏（2 大 + 4 小），图标徽章，背景图，响应式堆叠。
      </p>
      <SplitCardLayout heading="服务体系" :cards="serviceSystemCards" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: heading, cards: SplitCard[] — 通过 size 字段区分 tall/standard</li>
          <li>图标使用 IconBadge variant="white"</li>
          <li>tall 卡片支持背景图和背景色</li>
        </ul>
      </div>
    </Card>

    <!-- ===== ContentList ===== -->
    <PlaygroundShell
      section-id="content-list"
      title="ContentList 文章列表"
      description="文章列表组件，支持 4 种形态：卡片（含描述）、紧凑卡片（无描述）、纯文本列表、横向文章列表。"
      code-tag="ContentList"
      code-self-closing
      :code-extra-props="articleListCodeExtra"
      :controls="articleListControls"
      :initial-props="articleListDefaults"
      :usage-notes="[
        'Props: title, items（必需）；subtitle?, viewAllLink?, variant?, rounded?, showPagination?, currentPage?, totalPages?',
        'variant: card（默认，含描述）| compact（紧凑，无描述）| list（纯文本列表）| article-row（横向文章列表）',
        'rounded: true（默认，圆角）| false（直角），仅 card/compact 变体生效',
        'ContentCard 字段：title, publishDate, tag?（必需）；image?, description?, summary?, updatedAt?, author?, linkHref?, imageAlt?（可选）',
        'article-row 模式下左侧显示图片，右侧显示标题、两行内容梗概、编辑时间和作者，并可内置分页器',
        'linkHref 有值时渲染 <a> 链接，空值时触发 cardClick / itemClick 事件；article-row 分页触发 pageChange',
      ]"
      v-slot="alProps"
    >
      <ContentList
        v-bind="alProps as any"
        :items="
          alProps.variant === 'compact'
            ? demoArticleCards
            : alProps.variant === 'list'
              ? demoTextArticles
              : alProps.variant === 'article-row'
                ? demoArticleRows
                : demoArticles
        "
      />
    </PlaygroundShell>

    <!-- ===== FaqList ===== -->
    <PlaygroundShell
      section-id="faq-list"
      title="FaqList 常见问题"
      description="左侧分类过滤 + 搜索框 + 手风琴/平铺 FAQ 列表，支持分类切换、关键词搜索、序号徽章。"
      code-tag="FaqList"
      code-self-closing
      :code-extra-props="faqListCodeExtra"
      :controls="faqListControls"
      :initial-props="faqListDefaults"
      :usage-notes="[
        'Props: title?, subtitle?, categories, items（必需）；searchPlaceholder?, defaultCategory?, showCategories?, showSearch?, expandMode?',
        'FaqCategory 字段：key, label（必需）',
        'FaqItem 字段：id, question, answer, category（必需）',
        'expandMode: single（手风琴，默认）| flat（平铺，全部展开，无箭头，不可折叠）',
        'showCategories / showSearch: 控制分类侧边栏和搜索框显隐',
        '手风琴模式：同一时间仅展开一项，切换分类/搜索时自动折叠',
        '搜索同时匹配问题和答案内容',
        '桌面端左侧垂直分类导航，移动端切换为水平滚动胶囊',
        'Emits: categoryChange, toggle, search',
      ]"
      v-slot="faqProps"
    >
      <FaqList
        v-bind="faqProps as any"
        title="常见问题"
        :categories="faqCategories"
        :items="faqItems"
        search-placeholder="搜索问题关键词"
      />
    </PlaygroundShell>

    <!-- ===== FeatureList ===== -->
    <PlaygroundShell
      section-id="feature-list"
      title="FeatureList 软件功能展示"
      description="居中标题 + 可选描述 + 4 列灰底功能卡片网格。支持默认标题与浅色主题胶囊标题两种样式。"
      code-tag="FeatureList"
      code-self-closing
      :code-extra-props="softwareShowcaseCodeExtra"
      :controls="softwareShowcaseControls"
      :initial-props="softwareShowcaseDefaults"
      :usage-notes="[
        'Props: title, cards（必需）；subtitle（可选）',
        'variant: default（默认）| title-pill（标题图标与标题共用浅色主题胶囊背景）',
        'Card 字段：title（必需）；features（功能列表）与 description（单段描述）二选一；badgeIcon（可选）；theme（可选）',
        'features 模式：正文渲染带 CheckSmall 图标的列表，stroke-width=3 加粗',
        'description 模式：正文渲染为纯文本段落；标题 badgeIcon 仍会保留',
        '卡片使用 bg-surface-secondary 灰底，无交互（纯展示）',
        '桌面端 4 列，平板 2 列，手机 1 列',
      ]"
      v-slot="ssProps"
    >
      <FeatureList
        v-bind="ssProps as any"
        title="核心功能"
        subtitle="全方位覆盖销售管理场景，助力企业高效运营"
        :cards="
          ssProps.cardMode === 'description'
            ? softwareShowcaseDescCards
            : softwareShowcaseFeatureCards
        "
      />
    </PlaygroundShell>

    <!-- ===== FlowSteps ===== -->
    <PlaygroundShell
      section-id="flow-steps"
      title="FlowSteps 流程步骤"
      description="多步骤流程展示，支持简约（badge + 标题）和丰富（序号 + 标题 + 大图标/图片 + 描述）两种视觉形态。"
      code-tag="FlowSteps"
      code-self-closing
      :code-extra-props="flowStepsCodeExtra"
      :controls="flowStepsControls"
      :initial-props="flowStepsDefaults"
      :usage-notes="[
        'Props: title, steps（必需）；description?, variant?',
        'Step 字段：title（必需）；description?, icon?, image?, imageAlt?（可选）',
        'variant: simple（默认，简约模式：Badge 图标 + 标题）| rich（丰富模式：序号 + 标题 + 大图标/图片 + 描述）',
        'icon 和 image 互斥：icon 为图标组件，image 为图片 URL',
        'Badge 颜色按索引循环使用 bg-fs-icon-* 渐变类（蓝/绿/橙/紫/青）',
        '丰富模式序号圆标使用 bg-brand-primary-gradient 品牌色渐变',
        '步骤间用连接线串联，桌面端横向排列，移动端纵向堆叠',
        '建议 3-5 个步骤，组件无交互（纯展示）',
      ]"
      v-slot="fsProps"
    >
      <FlowSteps v-bind="fsProps as any" :steps="flowDemoSteps" />
    </PlaygroundShell>

    <!-- ===== TabShowcase（视觉风格 + 标题高亮按钮） ===== -->
    <PlaygroundShell
      section-id="tab-showcase"
      title="TabShowcase Tab 展示"
      description="鼠标悬停即切换 Tab，支持左侧列表、右侧列表、顶部标签和左侧横向标签等多种视觉风格。"
      code-tag="TabShowcase"
      code-self-closing
      :code-extra-props="tabShowcaseCodeExtra"
      :controls="tabShowcaseControls"
      :initial-props="tabShowcaseDefaults"
      :usage-notes="[
        'Props: title, tabs: TabShowcaseItem[], titleHighlight?, layout?, theme?, TabShowcaseItem.badgeIcon?',
        '标题高亮按钮：点击“高亮标题末两字”会取当前 title 最后两个字作为 title-highlight；再次点击取消高亮。',
        '鼠标悬停（mouseenter）即触发切换，点击和键盘也支持',
        '描述区 grid 动画展开/收起，固定 min-height 保证高度一致',
        '图片区域 min-h-[420px] 撑开组件，避免 Tab 切换时高度跳动',
        '右侧图片切换带 opacity + translateY 过渡动画',
        'layout 控制视觉风格：tabs-left / tabs-right 为侧边列表，tabs-top 为顶部标签，tabs-left-horizontal 为左侧横向标签',
        'TabShowcaseItem.badgeIcon 选填（图标组件），不填则不显示',
      ]"
      v-slot="tsProps"
    >
      <!-- 标题高亮演示：将当前 title 的最后两个字传给 title-highlight -->
      <div class="mb-4 flex justify-start">
        <button
          type="button"
          :class="[
            'inline-flex items-center rounded-pill px-4 py-1.5 text-[13px] font-medium transition-all duration-fast',
            tabShowcaseTitleHighlightEnabled
              ? 'bg-brand-primary text-white'
              : 'border border-border-default text-text-secondary hover:border-brand-primary hover:text-text-primary',
          ]"
          @click="toggleTabShowcaseTitleHighlight"
        >
          {{ tabShowcaseTitleHighlightEnabled ? '取消标题高亮' : '高亮标题末两字' }}
        </button>
      </div>
      <TabShowcase
        v-bind="tsProps as any"
        :title-highlight="
          tabShowcaseTitleHighlightEnabled ? getLastTwoTitleHighlight(tsProps.title) : undefined
        "
        :tabs="tsProps.showBadgeIcon === 'hide' ? tabFeatureDemoTabsNoBadge : tabFeatureDemoTabs"
      />
    </PlaygroundShell>

    <!-- ===== MetricsPanel ===== -->
    <PlaygroundShell
      section-id="metrics-panel"
      title="MetricsPanel 增长指标面板"
      description="KPI 指标展示，支持 3/4 列、可选副标题、高亮卡片和详情指标卡。"
      code-tag="MetricsPanel"
      code-self-closing
      :code-extra-props="metricsPanelCodeExtra"
      :controls="metricsPanelControls"
      :initial-props="metricsPanelDefaults"
      :usage-notes="[
        'Props: title, metrics（必需）；subtitle?, columns?, variant?',
        'Metric 字段：value, label（必需）；unit, highlighted, description（可选）',
        'columns: 4（默认）| 3（数据驾驶舱模式）',
        'variant: default（默认紧凑指标）| detail（大数字 + 标题 + 描述）',
        'highlighted: true 时卡片使用蓝色渐变背景',
        '数字使用 bg-metrics-gradient bg-clip-text 渐变效果',
      ]"
      v-slot="mpProps"
    >
      <MetricsPanel
        v-bind="mpProps as any"
        :metrics="
          mpProps.variant === 'detail'
            ? technologyDetailMetrics
            : mpProps.columns === 3
              ? dashboardMetrics
              : growthMetrics
        "
        :subtitle="
          mpProps.variant === 'detail'
            ? '研发投入、团队能力与自主知识产权，支撑产品持续迭代。'
            : mpProps.columns === 3
              ? '实时数据尽在掌握，帮助企业快速决策'
          : undefined
        "
      />
    </PlaygroundShell>

    <!-- ===== CompanyOverview ===== -->
    <Card id="company-overview" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">CompanyOverview 公司介绍模块</h2>
      <p class="text-small text-text-secondary mb-6">
        公司介绍页中“标题 + 左文右视频 + 下方四项数据”的固定展示模块，适合公司简介和品牌介绍场景。
      </p>
      <CompanyOverview
        :title="aboutSection.title"
        :paragraphs="aboutSection.paragraphs"
        :video="aboutSection.video"
        :metrics="aboutSection.metrics"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: title, paragraphs, video, metrics</li>
          <li>结构固定为居中标题、左侧文本、右侧视频、下方四列数据卡片</li>
          <li>适合公司介绍、品牌简介、企业概览类页面</li>
        </ul>
      </div>
    </Card>

    <!-- ===== IndustryCarousel ===== -->
    <Card id="industry-carousel" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">IndustryCarousel Logo 轮播</h2>
      <p class="text-small text-text-secondary mb-6">
        居中聚焦式轮播，Logo 网格，边缘渐变遮罩，左右箭头。
      </p>
      <IndustryCarousel heading="行业客户案例" :cards="industryCards" cta-text="查看更多案例" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: heading, cards: IndustryCard[], ctaText?</li>
          <li>居中聚焦式轮播，边缘卡片半透明 + 缩放</li>
          <li>左右箭头 + 渐变遮罩</li>
          <li>按钮使用 Button variant="outline-neutral"</li>
        </ul>
      </div>
    </Card>

    <!-- ===== PartnerGrid ===== -->
    <Card id="partner-grid" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">PartnerGrid Logo 网格</h2>
      <p class="text-small text-text-secondary mb-6">4 列 Logo 卡片，图标 + 标题 + 描述。</p>
      <PartnerGrid heading="生态合作伙伴" :items="ecosystemAbilityItems" />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Props: heading, items: LogoItem[] — icon 为图片 URL</li>
          <li>内部使用 CardGrid cols=4 gap=tight</li>
        </ul>
      </div>
    </Card>

    <!-- ===== PlatformDownload ===== -->
    <Card id="platform-download" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">PlatformDownload 各平台下载</h2>
      <p class="text-small text-text-secondary mb-6">
        横向展示 4-6 个平台下载卡片，上卡片下标题布局，鼠标悬停时卡片 3D 翻转显示二维码。
      </p>
      <PlatformDownload
        title="各平台下载"
        subtitle="支持多平台、多终端使用，随时随地高效办公"
        :platforms="platformDownloadCards"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            Props: <code>title</code>, <code>subtitle</code>（可选）；<code>platforms</code>（必需）
          </li>
          <li>
            PlatformDownloadCard 字段：<code>name</code>, <code>icon</code>,
            <code>qrCode</code>（必需）； <code>iconAlt</code>, <code>qrCodeAlt</code>（可选，默认取
            name）
          </li>
          <li>卡片 hover 时 3D 翻转（rotateY 180deg）显示二维码，过渡时长 450ms</li>
          <li>正面：浅灰底 + 平台图标；背面：白底 + 二维码 +「扫码下载」提示</li>
          <li>响应式：4 张卡片 2→4 列，5 张 2→3→5 列，6 张 2→3→6 列</li>
          <li>支持 <code>motion-reduce</code> 禁用翻转动画</li>
          <li>支持键盘 focus-visible 触发翻转</li>
        </ul>
      </div>
    </Card>

    <!-- ===== CTASection ===== -->
    <PlaygroundShell
      section-id="cta-section"
      title="CTASection 底部转化区"
      description="页面最后的转化区域，居中布局。支持双按钮、5 种渐变背景、可选展示图片。"
      code-tag="CTASection"
      code-self-closing
      :code-extra-props="finalCtaCodeExtra"
      :controls="finalCtaControls"
      :initial-props="finalCtaDefaults"
      :usage-notes="[
        'Props: title, subtitle, primaryCta, secondaryCta?, variant?, image?, imageAlt?',
        'Emits: primaryClick, secondaryClick',
        'variant: light（默认）| warm（暖橙微光）| cool（蓝紫微光）| dawn（晨光交融）| mint（薄荷清风）',
        'image: 传入后展示图片模式（带产品截图）',
      ]"
      v-slot="ctaProps"
    >
      <CTASection
        v-bind="ctaProps as any"
        :image="ctaProps.mode === 'image' ? '/images/customer/product-intro.svg' : undefined"
        :image-alt="ctaProps.mode === 'image' ? 'CRM产品截图' : undefined"
      />
    </PlaygroundShell>

    <!-- ===== ProcessSteps ===== -->
    <PlaygroundShell
      section-id="process-steps"
      title="ProcessSteps 流程步骤卡片"
      description="多步骤流程展示，每个步骤由上卡片（序号+标题+描述+特性列表）和下卡片（总结标题）组成，步骤间由 Remix 图标箭头连接。每个步骤支持独立主题色，箭头方向支持翻转。"
      code-tag="ProcessSteps"
      code-self-closing
      :code-extra-props="processStepsCodeExtra"
      :controls="processStepsControls"
      :initial-props="processStepsDefaults"
      :usage-notes="[
        'Props: title, steps（必需）；subtitle?, reverse?, arrowStyle?',
        'ProcessStep 字段：title, description, summary（必需）；theme?, number?, features?（可选）',
        'theme: purple（默认）| blue | teal | green | orange | plain | slate | indigo | amber | sky（每个步骤独立控制）',
        'arrowStyle: line（直线，默认）| filled（实心填充）| gradient（渐变渐隐）| chevron（双V形）',
        '序号徽章与下卡片使用 bg-fs-icon-* 渐变类，特性列表图标颜色跟随步骤主题色',
        'features: 字符串数组，每项渲染为带 CheckSmall 图标的列表项',
        'reverse: 翻转箭头方向（水平镜像），默认 false',
        '桌面端两行布局（上行卡片+箭头、下行卡片），移动端纵向堆叠',
        '建议 3-5 个步骤，组件无交互（纯展示）',
      ]"
      v-slot="psProps"
    >
      <ProcessSteps v-bind="psProps as any" :steps="processDemoSteps" />
    </PlaygroundShell>

    <!-- ===== ContactCard ===== -->
    <PlaygroundShell
      section-id="contact-card"
      title="ContactCard 联系方式卡片"
      description="联系方式卡片：支持通过 cards 数组动态配置售前、售后、邮箱和社交平台等内容。"
      code-tag="ContactCard"
      code-self-closing
      :code-extra-props="contactCardCodeExtra"
      :controls="[]"
      :initial-props="{}"
      :usage-notes="[
        'Props: cards?（推荐），社交平台可在 cards 内通过 type=socials 配置',
        'cards: ContactCardItem[]，支持 title, description, value, href, icon, valueIcon, type 等字段',
        '没有传 cards 时，会自动回退为售前咨询、售后服务、官方邮箱、社交平台四张卡',
        'SectionBlock 内部默认 width=default，内容宽度为 1200px 约束',
        '社交平台卡片支持 SocialIcons 悬浮二维码',
      ]"
      v-slot="ccProps"
    >
      <ContactCard
        v-bind="ccProps as any"
        :cards="contactCards"
      />
    </PlaygroundShell>

    <!-- ===== ReviewCardGrid ===== -->
    <PlaygroundShell
      section-id="review-card-grid"
      title="ReviewCardGrid 用户评价卡片"
      description="客户评价卡片网格，展示品牌 logo、行业标签、评价内容、用户名和星级评分。支持单列/双列布局，评价内容支持展开/收起。"
      code-tag="ReviewCardGrid"
      code-self-closing
      :code-extra-props="reviewCardGridCodeExtra"
      :controls="reviewCardGridControls"
      :initial-props="reviewCardGridDefaults"
      :usage-notes="[
        'Props: title, cards（必需）；subtitle?, columns?',
        'ReviewCard 字段：logo, industry, content, username, rating（必需）；logoAlt?（可选）',
        'columns: 1（单列）| 2（双列，默认），移动端自动切换为 1 列',
        'rating: 1-5 的星级评分，使用 Remix Star 图标',
        '评价内容默认截断 3 行，超过 120 字符时显示「展开全部」按钮',
        '双列布局使用 CSS Grid 自然流式布局，展开卡片不影响同行其他卡片对齐',
        '卡片 hover 上浮 1px + 阴影增强，支持 motion-reduce 禁用动效',
      ]"
      v-slot="rcProps"
    >
      <ReviewCardGrid
        v-bind="rcProps as any"
        title="客户评价"
        subtitle="来自各行各业的真实用户反馈"
        :cards="reviewDemoCards"
      />
    </PlaygroundShell>

    <!-- ===== Timeline ===== -->
    <Card id="timeline" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Timeline 发展历程</h2>
      <p class="text-small text-text-secondary mb-6">
        横向年份轴展示公司或产品的发展里程碑，支持悬停、聚焦或点击切换当前节点，并在下方展示对应详情卡片。
      </p>
      <Timeline
        title="发展历程"
        subtitle="从初创到行业领先，每一步都值得铭记"
        :milestones="timelineMilestones"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            Props: <code>title</code>,
            <code>milestones</code>（必需）；<code>subtitle</code>（可选）
          </li>
          <li>
            TimelineMilestone 字段：<code>year</code>, <code>title</code>,
            <code>description</code>（必需）
          </li>
          <li>
            description 支持混合类型数组：纯文本字符串 +
            <code>{ text, highlight?: true }</code> 高亮段
          </li>
          <li>高亮段使用品牌橙色（<code>text-brand-primary</code>）加粗渲染</li>
          <li>桌面端为横向可滚动年份轴 + 详情卡片，左右箭头用于查看更多年份</li>
          <li>移动端切换为左侧纵向时间线，年份、标题和描述直接展开显示</li>
          <li>适合 4 个以上里程碑；节点支持 hover、focus、click 切换当前详情</li>
        </ul>
      </div>
    </Card>

    <!-- ===== CaseDetailHeader ===== -->
    <Card id="case-detail-header" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">CaseDetailHeader 案例详情头部</h2>
      <p class="text-small text-text-secondary mb-6">
        案例详情页顶部卡片，左右分栏布局，左图右文，从上到下依次展示
        logo、描述、分割线、标题和标签。
      </p>
      <CaseDetailHeader
        image="/images/customer/product-intro.png"
        image-alt="某机械制造企业案例配图"
        logo="/images/customer/tab-unified.svg"
        logo-alt="企业 Logo"
        description="通过销帮帮 CRM 实现从线索管理、客户跟进到订单交付的全流程数字化，销售团队工作效率提升 40%，客户满意度显著提高。"
        title="某大型机械制造企业 CRM 数字化转型实践"
        :tags="['制造业', '数字化转型', 'CRM']"
      />
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            Props: <code>image</code>, <code>logo</code>, <code>description</code>,
            <code>title</code>, <code>tags</code>（必需）
          </li>
          <li><code>imageAlt</code>、<code>logoAlt</code> 可选，默认取 <code>title</code></li>
          <li>桌面端 grid-cols-2 左右分栏，移动端单列堆叠</li>
          <li>标签使用 Badge 组件 variant="brand"</li>
          <li>建议左侧配图比例 4:3 或 16:10，logo 宽度 120–160px</li>
        </ul>
      </div>
    </Card>

    <!-- ================================================================ -->
  </div>
</template>
<script setup lang="ts">
import {
  Calendar,
  ChartHistogram,
  Check,
  Shield,
  SettingConfig,
  Trend,
  Star,
  LinkCloud,
  Wechat,
  Search,
  SendOne,
  ApiApp,
  User,
  UserBusiness,
  FolderPlus,
  ClickTap,
  CheckOne,
  Thunderbolt,
  Peoples,
  Message,
  Phone,
  Headset,
  Mail,
  ShareSys,
} from '@/client/components/ui/remixIcons'
import { computed, ref } from 'vue'
import Card from '@/client/components/ui/Card.vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import CompanyOverview from '@/client/components/business/CompanyOverview.vue'
import FeatureImageCard from '@/client/components/business/FeatureImageCard.vue'
import GradientCardGrid from '@/client/components/business/GradientCardGrid.vue'
import MetricsPanel from '@/client/components/business/MetricsPanel.vue'
import IndustryCarousel from '@/client/components/business/IndustryCarousel.vue'
import SplitCardLayout from '@/client/components/business/SplitCardLayout.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import PromoBanner from '@/client/components/business/PromoBanner.vue'
import PromoBannerCarousel from '@/client/components/business/PromoBannerCarousel.vue'
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import ArticleSidebar, { type ArticleSidebarVariant } from '@/client/components/business/ArticleSidebar.vue'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import SplitSection from '@/client/components/business/SplitSection.vue'
import GradientHero from '@/client/components/business/GradientHero.vue'
import FlowSteps from '@/client/components/business/FlowSteps.vue'
import FeatureList from '@/client/components/business/FeatureList.vue'
import AiCrmFeatureGrid from '@/client/components/business/AiCrmFeatureGrid.vue'
import ContentCardGrid from '@/client/components/business/ContentCardGrid.vue'
import AddressTabs from '@/client/components/business/AddressTabs.vue'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import PlatformDownload from '@/client/components/business/PlatformDownload.vue'
import FaqList from '@/client/components/business/FaqList.vue'
import ContactCard from '@/client/components/business/ContactCard.vue'
import ProcessSteps from '@/client/components/business/ProcessSteps.vue'
import Timeline from '@/client/components/business/Timeline.vue'
import ReviewCardGrid from '@/client/components/business/ReviewCardGrid.vue'
import CaseDetailHeader from '@/client/components/business/CaseDetailHeader.vue'
import PlaygroundShell from './components/PlaygroundShell.vue'
import {
  solutionCards,
  assistantCards,
  growthMetrics,
  industryCards,
  serviceSystemCards,
  ecosystemAbilityItems,
  ecosystemAbility1,
  ecosystemAbility2,
  ecosystemAbility3,
  custChoiseImg,
  type BannerSlide,
} from '@/client/data/homeData'
import { aboutSection } from '../about/companyIntroData'
import { socials, footerHotline, footerEmail } from '@/client/data/siteFooterData'

// ===== Mock 数据 =====
const bannerSlides: BannerSlide[] = [
  {
    key: 'mock-hero',
    mediaType: 'image',
    title: '懂客户，更懂增长',
    desc: '专注于客户数字化\n让增长不再是靠感觉，而是靠系统',
    primaryCta: '了解更多',
    secondaryCta: '预约产品演示',
    bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
    line: 'rgba(116, 129, 255, 0.16)',
    accent: '#5b61ff',
    glow: 'rgba(91, 97, 255, 0.18)',
    orb: 'rgba(127, 214, 255, 0.22)',
    showVisual: false,
    visualImage: '',
    visualImageAlt: '',
  },
]

// ===== ContactCard 演示数据（与 Footer 底部信息栏共享数据源） =====
const contactCards = [
  {
    title: '售前咨询',
    description: '了解产品详情、定制专属方案',
    value: footerHotline,
    href: `tel:${footerHotline}`,
    icon: Message,
    valueIcon: Phone,
    iconClass: 'text-[#31c4d1]',
    valueClass: 'text-[#31c4d1]',
  },
  {
    title: '售后服务',
    description: '产品应用操作、全天候陪伴服务',
    value: footerHotline,
    href: `tel:${footerHotline}`,
    icon: Headset,
    valueIcon: Phone,
    valueClass: 'text-brand-accent',
  },
  {
    title: '官方邮箱',
    description: '商务合作、媒体沟通与其他事务咨询',
    value: footerEmail,
    href: `mailto:${footerEmail}`,
    icon: Mail,
    valueIcon: Mail,
    valueClass: 'text-brand-primary',
  },
  {
    title: '社交平台',
    description: '关注官方账号，获取产品资讯与活动动态',
    type: 'socials',
    icon: ShareSys,
    iconClass: 'text-fs-icon-green',
    socials,
  },
] as const

const contactCardCodeExtra = {
  ':cards': 'contactCards',
}

// ===== Demo 数据 =====
const tabFeatureDemoTabs = [
  {
    key: 'unified',
    label: '全部客户统一管理',
    description: '支持自定义客户表单、批量导入导出、一键移交与分配。',
    image: '/images/customer/tab-unified.svg',
    imageAlt: '全部客户统一管理',
    badgeIcon: Star,
  },
  {
    key: 'tracking',
    label: '跟进客户过程可追踪',
    description: '以时间线方式记录每一次客户沟通，自动标记最后跟进时间。',
    image: '/images/customer/tab-tracking.svg',
    imageAlt: '跟进客户过程可追踪',
    badgeIcon: Thunderbolt,
  },
  {
    key: 'retention',
    label: '成交客户持续经营',
    description: '集中管理签约客户，支持续约提醒、增购机会识别和成交后跟进。',
    image: '/images/customer/tab-retention.svg',
    imageAlt: '成交客户持续经营',
    badgeIcon: Trend,
  },
  {
    key: 'collaboration',
    label: '重点客户协同推进',
    description: '支持一键标记重点客户、多人共享协作和权限控制。',
    image: '/images/customer/tab-collaboration.svg',
    imageAlt: '重点客户协同推进',
    badgeIcon: Peoples,
  },
] as const

/** 无 badge 版本（用于 Badge 控件切换） */
const tabFeatureDemoTabsNoBadge = tabFeatureDemoTabs.map((tab) => {
  const copy = { ...tab }
  delete (copy as Record<string, unknown>).badgeIcon
  return copy
}) as unknown as typeof tabFeatureDemoTabs

const featureCardDemoFeatures = [
  {
    title: '避免撞单，客户归属更清楚',
    description: '线索、客户、联系人自动交叉校验，识别同一客户的不同记录，避免多个销售重复跟进。',
    icon: Check,
  },
  {
    title: '源头防重，减少脏数据沉淀',
    description: '全场场景接入客户时自动校验手机号、邮箱、公司名称等关键信息。',
    icon: Shield,
  },
  {
    title: '规则灵活，适配不同业务',
    description: '支持按业务线、客户模板或全局范围设置判重规则。',
    icon: SettingConfig,
  },
  {
    title: '报表可信，管理决策更准',
    description: '减少重复客户后，客户数、跟进率、转化率和成交数据更接近真实。',
    icon: Trend,
  },
] as const

const imageCardDemoFeatures = [
  {
    title: '视频',
    description: '无需跳转，即可直接播放来自西瓜视频、抖音、优酷视频、哔哩哔哩等视频',
    image: '/images/liuzi/ability-1.png',
    imageAlt: '视频能力展示',
  },
  {
    title: '画板',
    description: '嵌在文档的图形创作工具，让你轻松画出好看的流程图、规划图和示意图',
    image: '/images/liuzi/ability-2.png',
    imageAlt: '画板能力展示',
  },
  {
    title: '思维导图',
    description: '无需其他思维导图应用，在文档里就能用可视化的方式梳理、呈现思路',
    image: '/images/liuzi/ability-3.png',
    imageAlt: '思维导图能力展示',
  },
] as const

const imagePanelDemoCards = [
  {
    number: '01',
    module: '客户协作',
    title: '客户资料同步，团队信息同频',
    description:
      '客户、联系人、跟进记录和业务动态集中沉淀，团队成员无需反复询问即可获取完整上下文。',
    image: '/images/customer/tab-unified-new.png',
    imageAlt: '客户资料同步展示',
  },
  {
    number: '02',
    module: '过程管理',
    title: '销售动作可视，推进节奏更稳',
    description:
      '围绕客户跟进、任务提醒和阶段推进建立标准动作，让管理者及时发现卡点并推动协作。',
    image: '/images/customer/tab-tracking-new.png',
    imageAlt: '销售动作可视展示',
  },
  {
    number: '03',
    module: '智能运营',
    title: '数据洞察沉淀，决策更有依据',
    description:
      '将客户行为、销售过程和转化结果汇聚到统一视图，帮助团队持续优化运营策略。',
    image: '/images/customer/tab-collaboration-new.png',
    imageAlt: '数据洞察展示',
  },
] as const

const heroBannerDemoSlide = {
  key: 'demo-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: '客户管理',
  subtitle: '客户全生命周期数字化管理',
  desc: '',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  bg: "url('/images/customer/customer.png') center / cover no-repeat",
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: true,
  visualImage: '/images/customer/product-intro.png',
  visualImageAlt: '客户管理产品展示',
}

const heroBannerSingleLayout = ref<'horizontal' | 'vertical'>('vertical')
const heroBannerSingleLayoutOptions = ['horizontal', 'vertical'] as const

function setHeroBannerSingleLayout(layout: (typeof heroBannerSingleLayoutOptions)[number]): void {
  heroBannerSingleLayout.value = layout
}

const showcaseCarouselLayout = ref<'text-left' | 'text-right'>('text-left')
const showcaseCarouselLayoutOptions = ['text-left', 'text-right'] as const
const showcaseCarouselTitle = computed(() =>
  showcaseCarouselLayout.value === 'text-right' ? 'AI智能生态，驱动管理全面提效' : '',
)
const showcaseCarouselSlides = computed(() =>
  showcaseCarouselLayout.value === 'text-right'
    ? managementShowcaseRightSlides
    : managementShowcaseLeftSlides,
)

function setShowcaseCarouselLayout(layout: (typeof showcaseCarouselLayoutOptions)[number]): void {
  showcaseCarouselLayout.value = layout
}

const tabShowcaseTitleHighlightEnabled = ref(false)
const imageCardGridTitleHighlightEnabled = ref(false)
const iconCardGridTitleHighlightEnabled = ref(false)

function getLastTwoTitleHighlight(title: unknown): string | undefined {
  const text = String(title ?? '').trim()
  return text ? text.slice(-2) : undefined
}

function toggleTabShowcaseTitleHighlight(): void {
  tabShowcaseTitleHighlightEnabled.value = !tabShowcaseTitleHighlightEnabled.value
}

function toggleImageCardGridTitleHighlight(): void {
  imageCardGridTitleHighlightEnabled.value = !imageCardGridTitleHighlightEnabled.value
}

function toggleIconCardGridTitleHighlight(): void {
  iconCardGridTitleHighlightEnabled.value = !iconCardGridTitleHighlightEnabled.value
}

const managementShowcaseLeftSlides = [
  {
    key: 'customer-management',
    title: '客户全生命周期数字化管理，提升企业效益',
    image: '/images/liuzi/1-1.png',
    imageAlt: '客户管理产品界面',
    items: [
      { title: '支持客户多维度查重' },
      { title: '通过预设自定义字段及标签实现客户分层分类' },
      { title: '构建企业潜在客户360°画像，\n提升私域客户池运作效率', afterBreaks: 2 },
      { title: '实现对于客户旅程的精准把控' },
    ],
    primaryCta: '免费试用',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '申请演示',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'sales-management',
    title: '精细化销售过程管理',
    image: '/images/liuzi/1-2.png',
    imageAlt: '销售管理产品界面',
    items: [
      { title: '对应不同客户类型和阶段\n标准化销售打单旅程，', afterBreaks: 2 },
      { title: '抽炼优秀销售运营动作\n穿透并赋能每一位前线销售', afterBreaks: 2 },
      { title: '让每个销售策略都有理有据\n全面提升销售团队效率和业务能力。' },
    ],
    primaryCta: '免费试用',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '申请演示',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'market-management',
    title: '市场管理',
    image: '/images/liuzi/1-3.png',
    imageAlt: '市场管理产品界面',
    items: [
      { title: '销帮帮CRM支持统一管理市场活动' },
      { title: '根据ROI分析，持续不断优化营销渠道\n获得更多高质量线索。', afterBreaks: 2 },
      { title: '从线索收集、分配、跟进到转化' },
      { title: '全面提高线索质量，加速转化。' },
    ],
    primaryCta: '免费试用',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '申请演示',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'paas-capability',
    title: '完美的PaaS底层能力可以赋能您的整个商业流程',
    image: '/images/liuzi/1-4.png',
    imageAlt: 'PaaS能力产品界面',
    items: [
      { title: '销帮帮PaaS底层能力助力企业\n应对与日俱增的业务挑战', afterBreaks: 2 },
      { title: '实现系统与企业个性化需求的快速适配' },
    ],
    primaryCta: '免费试用',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '申请演示',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'ai-sales-assistant',
    title: 'AI 销售助理，重塑销售作业流程，助力业绩增长',
    image: '/images/liuzi/1-5.png',
    imageAlt: 'AI销售助理产品界面',
    items: [
      { title: '一键录入企业客户' },
      { title: 'AI帮你补全客户资料' },
      { title: '一键自动提炼会议内容' },
      { title: 'AI帮你推动客户跟进' },
      { title: '一键自动提炼跟进纪要' },
      { title: 'AI帮跟进总结·跟进评估·假日祝福' },
    ],
    primaryCta: '免费试用',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '申请演示',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
]

const managementShowcaseRightSlides = [
  {
    key: 'sesame-customer',
    title: '芝麻找客助手',
    titleIcon: Search,
    image: '/images/liuzi/findCustomer.png',
    imageAlt: '芝麻找客助手',
    description:
      '芝麻找客助手，是蚂蚁集团旗下芝麻企业信用打造的AI智能拓客工具，为企业销售全链路赋能，让业务拓客效率提升数十倍',
    items: [
      {
        title: '多场景精准拓客',
        description:
          '支持「以客找客、主营找客、上下游找客」多维度拓客模式，快速锁定目标客户群体，精准匹配业务需求，高效挖掘潜在商机。',
      },
      {
        title: '多维度权威数据',
        description:
          '依托独家企业认知库，整合产业链、投资、产品等多维度数据，提供匹配度、购买能力等企业评估指标，让客户筛选有据可依。',
      },
      {
        title: '多渠道高效建联',
        description:
          '覆盖企业老板、决策层、核心员工等多角色联系方式，助力销售快速触达关键决策人，高效推进业务对接。',
      },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'sesame-bidding',
    title: '芝麻标讯助手',
    titleIcon: Search,
    image: '/images/liuzi/biddingInfo.png',
    imageAlt: '芝麻标讯助手',
    description: '任何重要投标机会。',
    items: [
      {
        title: '商机深度分析，投标更有策略',
        description:
          '报价策略智能建议、甲方采购行为分析、潜在竞争对手分析，依托海量行业专家经验与独家算法融合计算，帮你精准制定投标方案，提升中标率。',
      },
      { title: 'AI智能赋能，全流程高效管理' },
      { description: '精准商机推荐：智能匹配最适合你的招标项目' },
      { description: '- 一句话查标讯：自然语言直接表达需求，快速定位目标标讯' },
      { description: '- 客户/同行动态监控：招标、中标动态实时推送，掌握市场先机' },
      { description: '- 一键下载附件：招标文件、附件材料一键获取，省心省力' },
      { description: '- CRM联动管理：标讯线索一键入库，无缝对接企业管理流程' },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'schedule',
    title: '日程助手',
    titleIcon: Calendar,
    image: '/images/liuzi/schedule.png',
    imageAlt: '日程助手',
    items: [
      {
        description:
          '适合需要持续拜访、维护和推进客户的团队使用，让拜访安排更清晰、准备更充分、后续跟进更连续。日程助手围绕用户在访客计划中维护的数据，帮助用户更高效地完成拜访前准备与后续任务安排。用户在查看日程时，可以快速回顾客户基本情况、历史跟进内容和近期重点事项，减少临时翻找信息的时间，让每次拜访前都更有准备。',
      },
      {
        description:
          '同时，系统会基于每次拜访形成的跟进记录，自动生成推荐的跟进任务，帮助用户更顺畅地衔接下一步动作。用户可以根据实际情况，自由选择是否将这些任务加入访客计划。',
      },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'train-partner',
    title: '陪练助手',
    titleIcon: UserBusiness,
    image: '/images/liuzi/trainPartner.png',
    imageAlt: '陪练助手',
    items: [
      {
        description:
          '陪练助手适合销售、客服、顾问、培训等需要高频沟通的岗位使用。它可以围绕常见业务场景，帮助用户提前练习开场表达、需求挖掘、异议回应、方案介绍和收尾推进，让新人更快上手，也让有经验的同事持续打磨表达能力。',
      },
      {
        description:
          '它最大的价值，是把“临场发挥”变成“可反复练习”。用户可以在正式接触客户前，先进行低成本演练，提前发现表达不清、逻辑不顺、回应不够有力的问题。这样不仅能提升个人信心，也能帮助团队逐步沉淀更稳定的沟通方法，让服务质量和成交表现更可控。',
      },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'analysis',
    title: '分析师',
    titleIcon: ChartHistogram,
    image: '/images/liuzi/analysis.png',
    imageAlt: '分析师',
    items: [
      {
        description:
          '分析师面向需要看经营情况、判断趋势、发现问题的管理者与业务团队。它可以帮助用户更快整理关键信息，聚焦核心指标变化，辅助判断哪里做得好、哪里值得优化，以及下一步应该优先关注什么。',
      },
      {
        description:
          '很多团队并不缺数据，缺的是把数据变成判断和行动的能力。无论是线索转化、客户活跃、团队效率，还是活动效果、产品使用情况，都可以借助分析师更高效地发现问题、解释现象、支持决策，让业务优化更有依据。分析师的价值，就在于帮助用户从繁杂信息中更快抓住重点，减少“看了很多表、还是不知道怎么办”的情况。',
      },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
  {
    key: 'follow-up',
    title: '跟进助手',
    titleIcon: SendOne,
    image: '/images/liuzi/followUp.png',
    imageAlt: '跟进助手',
    items: [
      {
        description:
          '适合用于客户拜访、电话沟通、项目推进等场景，让跟进更及时、记录更完整、后续动作更明确，帮助团队提升客户经营效率。',
      },
      {
        description:
          '跟进助手帮助用户把每一次沟通沉淀成可复用、可追踪的客户资产。用户可自主上传录音文件，系统会对沟通内容进行提炼分析，自动整理关键信息，并生成结构化的跟进记录，减少手工整理带来的时间消耗和信息遗漏。',
      },
      {
        description:
          '在完成记录沉淀后，跟进助手还会结合本次沟通内容，给出下一步行动建议，帮助用户更快判断后续该推进什么、联系什么人、补充哪些动作。',
      },
    ],
    primaryCta: '申请演示',
    primaryHref: '/mianfeishiyong/?type=new',
    secondaryCta: '免费试用',
    secondaryHref: '/mianfeishiyong/?type=new',
  },
]

// ===== PromoBannerCarousel 演示数据 =====
const promoCarouselDemoSlides = [
  {
    key: 'demo-slide-1',
    eyebrow: '制造业',
    title: '数字化转型，从客户管理开始',
    ctaText: '了解详情',
    image: '/images/customer/tab-unified.svg',
    imageAlt: '制造业案例',
  },
  {
    key: 'demo-slide-2',
    eyebrow: '互联网',
    title: '高速增长，需要高效管理',
    ctaText: '了解详情',
    image: '/images/customer/tab-tracking.svg',
    imageAlt: '互联网案例',
  },
  {
    key: 'demo-slide-3',
    eyebrow: '金融',
    title: '合规与增长并行',
    ctaText: '了解详情',
    image: '/images/customer/tab-collaboration.svg',
    imageAlt: '金融案例',
  },
]

// ===== ImageCardGrid 交互式控件（含标题高亮按钮开关） =====
const imageCardGridControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'image-card', value: 'image-card' },
      { label: 'feature-panel', value: 'feature-panel' },
    ],
  },
  {
    label: 'Color Scheme',
    prop: 'color-scheme',
    options: [
      { label: 'brand', value: 'brand' },
      { label: 'accent', value: 'accent' },
      { label: 'mint', value: 'mint' },
      { label: 'neutral', value: 'neutral' },
      { label: 'clean', value: 'clean' },
    ],
  },
  {
    label: 'Columns',
    prop: 'columns',
    options: [
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
]

const imageCardGridDefaults = {
  variant: 'feature-panel',
  'color-scheme': 'mint',
  columns: 3,
  title: '解锁你的工作新方式',
}

// ===== IconCardGrid 交互式控件（含标题高亮按钮开关） =====
const featureCardGridControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'icon-badge', value: 'icon-badge' },
      { label: 'icon-tile', value: 'icon-tile' },
      { label: 'icon-badge-protruding', value: 'icon-badge-protruding' },
      { label: 'accent-strip', value: 'accent-strip' },
      { label: 'plain', value: 'plain' },
    ],
  },
  {
    label: 'Color Scheme',
    prop: 'color-scheme',
    options: [
      { label: 'brand', value: 'brand' },
      { label: 'accent', value: 'accent' },
      { label: 'neutral', value: 'neutral' },
      { label: 'clean', value: 'clean' },
    ],
  },
  {
    label: 'Columns',
    prop: 'columns',
    options: [
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '7', value: 7 },
    ],
  },
]

const featureCardGridDefaults = {
  variant: 'icon-badge',
  'color-scheme': 'accent',
  columns: 3,
  title: '内容创作能力，协同效率更高',
}

// ===== CTASection 交互式控件 =====
const finalCtaControls = [
  {
    label: 'Mode',
    prop: 'mode',
    options: [
      { label: '纯 CTA', value: 'cta' },
      { label: '图片模式', value: 'image' },
    ],
  },
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'light', value: 'light' },
      { label: 'warm', value: 'warm' },
      { label: 'cool', value: 'cool' },
      { label: 'dawn', value: 'dawn' },
      { label: 'mint', value: 'mint' },
    ],
  },
]

const finalCtaDefaults = {
  mode: 'cta',
  variant: 'light',
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  'primary-cta': '立即免费试用',
  'secondary-cta': '预约产品演示',
}

// ===== ImageShowcase 交互式控件 =====
const imageShowcaseControls = [
  {
    label: 'Layout',
    prop: 'layout',
    options: [
      { label: 'text-left', value: 'text-left' },
      { label: 'text-right', value: 'text-right' },
    ],
  },
  {
    label: 'Theme',
    prop: 'theme',
    options: [
      { label: 'purple', value: 'purple' },
      { label: 'blue', value: 'blue' },
      { label: 'teal', value: 'teal' },
      { label: 'green', value: 'green' },
      { label: 'orange', value: 'orange' },
      { label: 'plain', value: 'plain' },
      { label: 'slate', value: 'slate' },
      { label: 'indigo', value: 'indigo' },
      { label: 'amber', value: 'amber' },
      { label: 'sky', value: 'sky' },
    ],
  },
  {
    label: 'CTA Button',
    prop: 'ctaText',
    options: [
      { label: '显示', value: '点击查看' },
      { label: '隐藏', value: '' },
    ],
  },
]

const imageShowcaseDefaults = {
  layout: 'text-left',
  theme: 'orange',
  title: '产品能力展示',
  subtitle: '左侧标题与副标题，右侧展示一张图片，适合纯展示型业务模块。',
  ctaText: '点击查看',
  image: '/images/customer/product-intro.png',
}

const imageShowcaseCodeExtra = {
  title: '产品能力展示',
  subtitle: '左侧标题与副标题，右侧展示一张图片，适合纯展示型业务模块。',
  ctaText: '点击查看',
  image: '/images/customer/product-intro.png',
  layout: 'text-left',
  theme: 'orange',
}

// ===== ArticleSidebar 交互式控件 =====
const articleSidebarDemoBanners = [
  {
    title: 'CRM客户管理系统模板',
    image: '/images/article-sidebar/crm-template.png',
    imageAlt: 'CRM客户管理系统模板',
    to: '/kehuguanli',
  },
  {
    title: '销售管理系统模板',
    image: '/images/article-sidebar/sales-template.png',
    imageAlt: '销售管理系统模板',
    to: '/xiaoshouguanli',
  },
]

const articleSidebarDemoTocItems = [
  {
    id: 'knowledge-section-0',
    title: '🚀一、为什么中小企业需要专业的CRM管理系统？',
  },
  {
    id: 'knowledge-section-1',
    title: '🛠️二、热门CRM系统推荐及对比分析',
  },
  {
    id: 'knowledge-section-2',
    title: '📈三、CRM系统实施建议及常见误区避坑指南',
  },
  {
    id: 'knowledge-section-3',
    title: '🏁四、结语：中小企业客户管理升级，从选对CRM开始',
  },
  {
    id: 'knowledge-faqs',
    title: '本文相关FAQs',
  },
]

const articleSidebarSceneItems = [
  { id: 'omnichannel-marketing', title: '全渠道营销', href: '/jiejuefangan/quanqudaoyingxiao' },
  { id: 'opportunity-management', title: '商机管理', href: '/jiejuefangan/shangjiguanli' },
  { id: 'lead-management', title: '线索管理', href: '/jiejuefangan/xiansuoguanli' },
  { id: 'sales-funnel', title: '销售漏斗', href: '/jiejuefangan/xiaoshouloudou' },
  { id: 'order-management', title: '订单管理', href: '/jiejuefangan/dingdanguanli' },
  { id: 'customer-management', title: '客户管理', href: '/kehuguanli' },
  { id: 'member-management', title: '会员管理', href: '/jiejuefangan/huiyuanguanli' },
  { id: 'purchase-management', title: '订货管理', href: '/jiejuefangan/dinghuoguanli' },
  { id: 'device-management', title: '设备管理', href: '/jiejuefangan/shebeiguanli' },
  { id: 'work-order-management', title: '工单管理', href: '/jiejuefangan/gongdanguanli' },
]

const articleSidebarControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'toc（文章目录）', value: 'toc' },
      { label: 'link-tags（场景标签）', value: 'link-tags' },
    ],
  },
  {
    label: 'Collapsed Items',
    prop: 'collapsed-count',
    options: [
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
    ],
  },
  {
    label: 'Active Item',
    prop: 'active-toc-id',
    options: [
      { label: '一、CRM价值', value: 'knowledge-section-0' },
      { label: '二、系统推荐', value: 'knowledge-section-1' },
      { label: 'FAQs', value: 'knowledge-faqs' },
    ],
  },
]

const articleSidebarDefaults = {
  variant: 'toc',
  'collapsed-count': 4,
  'active-toc-id': 'knowledge-section-0',
}

const articleSidebarCodeExtra = {
  ':banners': 'banners',
  ':toc-items': 'tocItems',
  variant: '"toc"',
}

// ===== TabShowcase 交互式控件（含视觉风格和标题高亮按钮开关） =====
const tabShowcaseControls = [
  {
    label: '视觉风格',
    prop: 'layout',
    options: [
      { label: '左侧列表', value: 'tabs-left' },
      { label: '右侧列表', value: 'tabs-right' },
      { label: '顶部标签', value: 'tabs-top' },
      { label: '左侧横向标签', value: 'tabs-left-horizontal' },
    ],
  },
  {
    label: 'Theme',
    prop: 'theme',
    options: [
      { label: 'plain', value: 'plain' },
      { label: 'slate', value: 'slate' },
      { label: 'indigo', value: 'indigo' },
      { label: 'amber', value: 'amber' },
      { label: 'sky', value: 'sky' },
      { label: 'purple', value: 'purple' },
      { label: 'blue', value: 'blue' },
      { label: 'teal', value: 'teal' },
      { label: 'green', value: 'green' },
      { label: 'orange', value: 'orange' },
    ],
  },
  {
    label: 'Badge',
    prop: 'showBadgeIcon',
    options: [
      { label: '显示', value: 'show' },
      { label: '隐藏', value: 'hide' },
    ],
  },
]

const tabShowcaseDefaults = {
  layout: 'tabs-left',
  theme: 'purple',
  showBadgeIcon: 'show',
  title: '精细化运营，让增长可复制',
}

// ===== Code Extra Props =====
const imageCardGridCodeExtra = {
  ':cards': 'cards',
  title: '"解锁你的工作新方式"',
  variant: '"feature-panel"',
  'color-scheme': '"mint"',
  columns: '3',
}
const featureCardGridCodeExtra = {
  ':features': 'features',
  title: '"内容创作能力，协同效率更高"',
  variant: '"icon-badge"',
  'color-scheme': '"accent"',
  columns: '3',
}
const finalCtaCodeExtra = {
  title: '"让增长，从这里开始"',
  subtitle: '"免费试用7天，体验AI驱动的新一代CRM平台"',
  'primary-cta': '"立即免费试用"',
  'secondary-cta': '"预约产品演示"',
}
const tabShowcaseCodeExtra = {
  title: '"精细化运营，让增长可复制"',
  ':tabs': 'tabs',
  theme: '"purple"',
}

// ===== SplitSection 交互式控件 =====
const splitSectionControls = [
  {
    label: 'Icon Theme',
    prop: 'iconTheme',
    options: [
      { label: 'brand（品牌橙）', value: 'brand' },
      { label: 'accent（蓝紫）', value: 'accent' },
      { label: 'gradient（渐变圆底）', value: 'gradient' },
      { label: 'neutral（中性灰）', value: 'neutral' },
    ],
  },
  {
    label: 'Content Mode',
    prop: 'contentMode',
    options: [
      { label: 'items（列表）', value: 'items' },
      { label: 'description（段落）', value: 'description' },
    ],
  },
  {
    label: 'Reverse',
    prop: 'reverse',
    options: [
      { label: 'false（文本左）', value: false },
      { label: 'true（文本右）', value: true },
    ],
  },
]

const splitSectionDefaults = {
  reverse: false,
  contentMode: 'items',
  iconTheme: 'brand',
  heading: '客户深度运营\n精细化运营，让增长可复制',
  description:
    '支持客户多维度查重，有效通过预设自定义字段及标签实现客户分层分类。\n支持客户全生命周期管理，从线索到成交复购，AI 帮你看准每一个商机。',
  image: '/images/customer/product-intro.png',
  items: [
    { text: '支持客户多维度查重，有效通过预设自定义字段及标签实现客户分层分类' },
    { text: '构建企业潜在客户360°画像，提升企业私域客户池运作效率' },
    { text: '实现对于客户旅程的精准把控，从线索到成交复购的全生命周期管理' },
    { text: 'AI 驱动智能推荐，帮你看准每一个商机，提升销售转化率' },
  ],
}

const splitSectionCodeExtra = {
  heading: '"客户深度运营\\n精细化运营，让增长可复制"',
  image: '"/images/customer/product-intro.png"',
  ':items': 'items',
}

// ===== ContentCardGrid 交互式控件 =====
const imageTextCardGridControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'case（案例）', value: 'case' },
      { label: 'product（产品）', value: 'product' },
      { label: 'resource（资源）', value: 'resource' },
      { label: 'square（正方形）', value: 'square' },
    ],
  },
  {
    label: 'Layout',
    prop: 'layout',
    options: [
      { label: 'vertical（垂直）', value: 'vertical' },
      { label: 'horizontal（水平）', value: 'horizontal' },
    ],
  },
  {
    label: 'Columns',
    prop: 'columns',
    options: [
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Rounded',
    prop: 'rounded',
    options: [
      { label: '开启', value: true },
      { label: '关闭', value: false },
    ],
  },
]

const imageTextCardGridDefaults = {
  variant: 'case',
  layout: 'vertical',
  columns: 4,
  rounded: true,
  title: '客户案例',
  subtitle: '来自各行各业的真实客户故事',
}

const imageTextCardGridCodeExtra = {
  title: '"客户案例"',
  subtitle: '"来自各行各业的真实客户故事"',
  ':cards': 'cards',
  variant: '"case"',
  rounded: 'true',
}

// ===== EcoResourceCardGrid 演示数据 =====
const addressTabsDemoItems = [
  {
    title: '杭州（总部）',
    description: '杭州市滨江区滨盛路505号银丰大厦7层',
    image: '/images/nnlx_mimg.jpg',
    imageAlt: '杭州总部地图',
    mapLabel: '杭州（总部）',
    hotline: footerHotline,
    email: footerEmail,
  },
  {
    title: '北京',
    description: '朝阳区建国门外大街永安东里甲3号通用国际中心A座05-2',
    image: '/images/nnlx_mimg.jpg',
    imageAlt: '北京公司地图',
    mapLabel: '北京',
    hotline: footerHotline,
    email: footerEmail,
  },
  {
    title: '上海',
    description: '上海市杨浦区昆明路39号文通大厦009室',
    image: '/images/nnlx_mimg.jpg',
    imageAlt: '上海公司地图',
    mapLabel: '上海',
    hotline: footerHotline,
    email: footerEmail,
  },
  {
    title: '深圳',
    description: '南山区高新南九道53号航空航天大厦2号楼801室',
    image: '/images/nnlx_mimg.jpg',
    imageAlt: '深圳公司地图',
    mapLabel: '深圳',
    hotline: footerHotline,
    email: footerEmail,
  },
] as const

const resourceDemoCards = [
  {
    image: ecosystemAbility1,
    title: '工业品生态资源',
    description: '连接工业品行业上下游资源，帮助企业快速对接供应商和客户，实现产业链协同。',
    linkText: '了解详情',
  },
  {
    image: ecosystemAbility2,
    title: '企业服务生态',
    description: '整合企业服务资源，从财税、法务到人力资源，为企业提供一站式服务支持。',
    linkText: '了解详情',
  },
  {
    image: ecosystemAbility3,
    title: '技术生态伙伴',
    description: '与行业领先的技术伙伴深度合作，为企业提供更完善的技术解决方案和集成能力。',
    linkText: '了解详情',
  },
]

// ===== ContentCardGrid square 演示数据 =====
const demoSquareCards = [
  {
    image: ecosystemAbility1,
    title: '客户管理',
    description: '全生命周期客户管理，从线索到成交一站式管理',
  },
  {
    image: ecosystemAbility2,
    title: '销售自动化',
    description: '智能分配线索，自动跟进提醒，提升转化效率',
  },
  {
    image: ecosystemAbility3,
    title: '数据分析',
    description: '多维度数据看板，实时掌握业务动态与趋势',
  },
  {
    image: ecosystemAbility1,
    title: '移动办公',
    description: '随时随地处理业务，外勤管理更高效便捷',
  },
]

// ===== GradientHero 交互式控件 =====
const featureIntroControls = [
  {
    label: 'Mode',
    prop: 'mode',
    options: [
      { label: '功能介绍（badge + 标题）', value: 'intro' },
      { label: '案例卡片（tag + 按钮）', value: 'case' },
    ],
  },
  {
    label: 'Theme',
    prop: 'theme',
    options: [
      { label: 'plain', value: 'plain' },
      { label: 'slate', value: 'slate' },
      { label: 'indigo', value: 'indigo' },
      { label: 'amber', value: 'amber' },
      { label: 'sky', value: 'sky' },
      { label: 'purple', value: 'purple' },
      { label: 'blue', value: 'blue' },
      { label: 'teal', value: 'teal' },
      { label: 'green', value: 'green' },
      { label: 'orange', value: 'orange' },
    ],
  },
  {
    label: 'Title Gradient',
    prop: 'titleGradient',
    options: [
      { label: 'off（黑色）', value: false },
      { label: 'on（渐变色）', value: true },
    ],
  },
  {
    label: 'Reverse',
    prop: 'reverse',
    options: [
      { label: 'false（文左图右）', value: false },
      { label: 'true（图左文右）', value: true },
    ],
  },
]

const featureIntroDefaults = {
  mode: 'intro',
  theme: 'purple',
  reverse: false,
  titleGradient: false,
  badgeIcon: 'show',
  title: '智能客户分配\nAI 精准匹配最佳线索',
  description:
    '基于 AI 算法智能匹配客户与销售，提升线索转化率，让每个销售人员都能获得最适合自己的客户资源。',
  image: custChoiseImg,
}

const featureIntroCodeExtra = {
  title: '"智能客户分配\\nAI 精准匹配最佳线索"',
  description: '"基于 AI 算法智能匹配客户与销售..."',
  image: '"/images/cust-choise.png"',
  ':badge-icon': 'Star',
  theme: '"purple"',
}

// ===== MetricsPanel 交互式控件 =====
const metricsPanelControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'default（紧凑指标）', value: 'default' },
      { label: 'detail（详情指标）', value: 'detail' },
    ],
  },
  {
    label: 'Columns',
    prop: 'columns',
    options: [
      { label: '4（增长指标）', value: 4 },
      { label: '3（详情指标）', value: 3 },
    ],
  },
]

const metricsPanelDefaults = {
  variant: 'default',
  columns: 4,
  title: '让增长，自然发生',
}

const metricsPanelCodeExtra = {
  title: '"让增长，自然发生"',
  ':metrics': 'metrics',
  variant: '"default"',
}

// ===== DataDashboard 演示数据 =====
const dashboardMetrics = [
  { value: '16,108', label: '付费客户数', highlighted: true },
  { value: '30', unit: '万+', label: '服务企业' },
  { value: '12', unit: '亿+', label: '营业收入' },
  { value: '98.5', unit: '%', label: '用户留存率' },
  { value: '10', unit: '万+', label: '在线用户' },
  { value: '160', unit: '%', label: '续费率' },
]

const technologyDetailMetrics = [
  {
    value: '120',
    unit: '+',
    label: '研发团队规模',
    description: '杭州滨江、城西两大研发中心，50%以上来自一线互联网企业，博士及硕士研究生20余名。',
  },
  {
    value: '40',
    unit: '%',
    label: '研发人员占比',
    description: '300+员工中研发人员超过40%，技术基因深入公司骨髓，产品力就是竞争力。',
  },
  {
    value: '39',
    unit: '项',
    label: '自主知识产权',
    description: '6项专利 + 33项软件著作权，持续投入技术创新，用知识产权构建护城河。',
  },
]

// ===== BadgeCardGrid 演示数据 =====
const ecoConnectCards = [
  {
    icon: LinkCloud,
    title: '钉钉深度集成',
    description:
      '与钉钉组织架构、审批流、IM 消息全面打通，在熟悉的界面中完成 CRM 操作，降低员工学习成本。',
  },
  {
    icon: Wechat,
    title: '企业微信互通',
    description: '支持企业微信客户继承、离职交接、群发消息，打通企业微信通讯录与 CRM 客户库。',
  },
  {
    icon: SendOne,
    title: '飞书无缝协作',
    description: '飞书审批单自动同步至 CRM，多维表格与客户数据双向映射，消息卡片直达客户详情。',
  },
  {
    icon: ApiApp,
    title: 'Open API 开放平台',
    description:
      '提供 200+ 标准 API 接口，支持 ERP、财务、电商等第三方系统快速对接，构建企业数据中台。',
  },
]

// ===== FeatureList 演示数据 =====
const softwareShowcaseFeatureCards = [
  {
    badgeIcon: User,
    theme: 'blue' as const,
    title: '客户管理',
    features: [
      '客户信息集中管理，支持自定义字段',
      '智能查重，防止重复录入',
      '客户分层分类，精细化运营',
    ],
  },
  {
    badgeIcon: Trend,
    theme: 'indigo' as const,
    title: '销售自动化',
    features: [
      'AI 智能分配线索，提升转化率',
      '跟进提醒，不错过任何商机',
      '销售漏斗可视化，实时掌握进度',
    ],
  },
  {
    badgeIcon: Star,
    theme: 'purple' as const,
    title: '数据分析',
    features: ['多维度数据报表，一键生成', '实时数据驾驶舱，掌握全局', '自定义 BI 看板，灵活配置'],
  },
  {
    badgeIcon: LinkCloud,
    theme: 'sky' as const,
    title: '生态集成',
    features: ['钉钉/企微/飞书深度打通', '200+ Open API 开放接口', 'ERP、财务系统无缝对接'],
  },
]

const softwareShowcaseDescCards = [
  {
    badgeIcon: User,
    theme: 'blue' as const,
    title: '客户管理',
    description: '客户信息集中管理，支持自定义字段与智能查重，通过客户分层分类实现精细化运营。',
  },
  {
    badgeIcon: Trend,
    theme: 'indigo' as const,
    title: '销售自动化',
    description: 'AI 智能分配线索并自动跟进提醒，通过销售漏斗可视化实时掌握转化进度。',
  },
  {
    badgeIcon: Star,
    theme: 'purple' as const,
    title: '数据分析',
    description: '多维度数据报表一键生成，实时数据驾驶舱掌握全局，支持自定义 BI 看板灵活配置。',
  },
  {
    badgeIcon: LinkCloud,
    theme: 'sky' as const,
    title: '生态集成',
    description: '钉钉、企微、飞书深度打通，200+ Open API 开放接口，ERP 与财务系统无缝对接。',
  },
]

const softwareShowcaseControls = [
  {
    label: '标题样式',
    prop: 'variant',
    options: [
      { label: 'title-pill（浅色胶囊）', value: 'title-pill' },
      { label: 'default（默认图标）', value: 'default' },
    ],
  },
  {
    label: '卡片内容模式',
    prop: 'cardMode',
    options: [
      { label: 'features（功能列表 + ✓ 图标）', value: 'features' },
      { label: 'description（单段描述纯文本）', value: 'description' },
    ],
  },
]

const softwareShowcaseDefaults = {
  variant: 'title-pill',
  cardMode: 'features',
}

const softwareShowcaseCodeExtra = {
  title: '"核心功能"',
  subtitle: '"全方位覆盖销售管理场景，助力企业高效运营"',
  ':cards': 'cards',
}

// ===== FaqList 演示数据 =====
const faqCategories = [
  { key: 'all', label: '全部' },
  { key: 'product', label: '产品功能' },
  { key: 'pricing', label: '价格与购买' },
  { key: 'tutorial', label: '使用教程' },
  { key: 'account', label: '账号管理' },
  { key: 'security', label: '数据安全' },
]

const faqItems = [
  {
    id: 1,
    question: '销帮帮 CRM 支持哪些平台使用？',
    answer:
      '销帮帮 CRM 支持多平台使用，包括 Web 网页版、Windows 客户端、Mac 客户端、iOS App、Android App，以及钉钉、企业微信、飞书等第三方平台集成。数据实时同步，随时随地高效办公。',
    category: 'product',
  },
  {
    id: 2,
    question: '如何导入已有的客户数据？',
    answer:
      '支持多种导入方式：<br>1. <strong>Excel 批量导入</strong>：下载模板，填写客户信息后一键导入；<br>2. <strong>API 接口对接</strong>：通过 Open API 从其他系统同步数据；<br>3. <strong>手动录入</strong>：在系统中逐条添加客户信息。导入过程中系统会自动进行查重校验，避免重复数据。',
    category: 'tutorial',
  },
  {
    id: 3,
    question: '免费版和付费版有什么区别？',
    answer:
      '免费版支持最多 3 个用户使用，包含基础客户管理、跟进记录、简单报表等核心功能，适合小型团队试用。付费版按用户数计费，提供高级功能如 AI 智能推荐、自定义字段、高级报表、API 接口、多级权限管理等，且支持无限客户数量。具体价格方案请查看官网定价页面或联系销售顾问获取定制报价。',
    category: 'pricing',
  },
  {
    id: 4,
    question: '数据安全如何保障？',
    answer:
      '我们高度重视数据安全，采取了多重保障措施：<br>1. <strong>数据加密</strong>：传输层使用 TLS 1.3 加密，存储层使用 AES-256 加密；<br>2. <strong>权限控制</strong>：支持角色级、字段级权限设置，确保数据最小可见原则；<br>3. <strong>备份机制</strong>：每日自动全量备份，支持任意时间点数据恢复；<br>4. <strong>合规认证</strong>：通过 ISO 27001 信息安全管理体系认证，符合等保三级要求。',
    category: 'security',
  },
  {
    id: 5,
    question: '是否支持与钉钉/企业微信集成？',
    answer:
      '支持。销帮帮 CRM 已与钉钉、企业微信、飞书深度集成，包括：组织架构同步、审批流打通、消息通知推送、客户数据互通等。在钉钉或企业微信中即可直接使用 CRM 功能，无需切换应用，降低员工学习成本。',
    category: 'product',
  },
  {
    id: 6,
    question: '如何修改账号密码？',
    answer:
      '登录后点击右上角头像 →「账号设置」→「安全设置」，即可修改登录密码。如果忘记密码，可以在登录页面点击「忘记密码」，通过注册手机号或邮箱重置密码。企业管理员可以在后台为员工重置密码。',
    category: 'account',
  },
  {
    id: 7,
    question: '购买的版本可以升级吗？',
    answer:
      '可以。我们支持随时升级套餐，升级后立即生效，差价按剩余天数计算。例如从标准版升级到专业版，只需补缴剩余服务期的差价即可。升级后所有历史数据完整保留，新功能即时可用。如需降级版本，请联系客服处理。',
    category: 'pricing',
  },
  {
    id: 8,
    question: '是否支持自定义字段？',
    answer:
      '付费版支持自定义字段功能。管理员可以在「系统设置」→「字段管理」中为客户、联系人、商机等模块添加自定义字段，支持文本、数字、日期、下拉选项、多选等多种字段类型。自定义字段会同步到列表、详情页、报表和导出数据中。',
    category: 'product',
  },
  {
    id: 9,
    question: '如何给团队成员分配权限？',
    answer:
      '企业管理员可在「系统设置」→「角色权限」中创建自定义角色，为每个角色设置模块访问权限（查看/编辑/删除）、数据可见范围（全部/部门/仅自己）、字段级权限（敏感字段脱敏或隐藏）等。支持按部门、按人员灵活分配角色。',
    category: 'account',
  },
  {
    id: 10,
    question: '数据可以导出吗？',
    answer:
      '支持导出客户、联系人、商机、合同等模块的数据，支持 Excel 和 CSV 格式。导出时可以选择导出字段、时间范围等筛选条件。同时支持通过 Open API 进行数据拉取，方便与第三方系统对接或进行数据分析。',
    category: 'security',
  },
]

// ===== FaqList 交互式控件 =====
const faqListControls = [
  {
    label: 'Expand Mode',
    prop: 'expandMode',
    options: [
      { label: 'single（手风琴）', value: 'single' },
      { label: 'flat（平铺）', value: 'flat' },
    ],
  },
  {
    label: 'Show Categories',
    prop: 'showCategories',
    options: [
      { label: 'true（显示）', value: true },
      { label: 'false（隐藏）', value: false },
    ],
  },
  {
    label: 'Show Search',
    prop: 'showSearch',
    options: [
      { label: 'true（显示）', value: true },
      { label: 'false（隐藏）', value: false },
    ],
  },
]

const faqListDefaults = {
  expandMode: 'single',
  showCategories: true,
  showSearch: true,
}

const faqListCodeExtra = {
  title: '"常见问题"',
  ':categories': 'categories',
  ':items': 'items',
  'search-placeholder': '"搜索问题关键词"',
}

// ===== FlowSteps 演示数据 =====
const flowDemoSteps = [
  {
    icon: User,
    title: '注册账号',
    description: '填写企业信息，完成账号注册与实名认证，开通企业专属工作台。',
  },
  {
    icon: FolderPlus,
    title: '导入客户',
    description: '批量导入客户数据，支持 Excel、API 对接等多种方式。',
  },
  {
    icon: ClickTap,
    title: '设置规则',
    description: '自定义客户分配规则、跟进提醒与审批流程，适配业务场景。',
  },
  {
    icon: CheckOne,
    title: '开始使用',
    description: '团队上线使用，AI 自动辅助客户跟进与商机识别。',
  },
] as const

// ===== FlowSteps 交互式控件 =====
const flowStepsControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'simple（简约）', value: 'simple' },
      { label: 'rich（丰富）', value: 'rich' },
    ],
  },
]

const flowStepsDefaults = {
  variant: 'simple',
  title: '简单四步，开启智能客户管理',
  description: '从注册到上线，仅需四个步骤，轻松构建企业数字化客户管理体系',
}

const flowStepsCodeExtra = {
  title: '"简单四步，开启智能客户管理"',
  description: '"从注册到上线，仅需四个步骤..."',
  ':steps': 'steps',
  variant: '"simple"',
}

// ===== ContentCardGrid 演示数据 =====
const demoCaseCards = [
  {
    image: ecosystemAbility1,
    tag: '制造行业',
    title: '山东华垦化工 ERP 系统升级',
    linkHref: '/cases/shandong-huaken',
  },
  {
    image: ecosystemAbility2,
    tag: '零售行业',
    title: '美特好超市数字化运营',
    linkHref: '/cases/meitehao',
  },
  {
    image: ecosystemAbility3,
    tag: '服务行业',
    title: '中科曙光 IT 服务管理',
    linkHref: '/cases/zhongke-shuguang',
  },
]

const demoProductCards = [
  {
    image: ecosystemAbility1,
    tag: 'CRM',
    title: '客户关系管理',
    linkHref: '/products/crm',
  },
  {
    image: ecosystemAbility2,
    tag: 'ERP',
    title: '企业资源计划',
    linkHref: '/products/erp',
  },
  {
    image: ecosystemAbility3,
    title: '智能数据分析平台',
    linkHref: '/products/analytics',
  },
]

const aiCrmDemoCards = [
  {
    image: '/images/liuzi/1.png',
    icon: '/images/liuzi/aiFindCust.png',
    iconAlt: 'AI找客助手图标',
    sideIcon: '/images/liuzi/aiFindCustIcon.png',
    sideImageAlt: '',
    title: 'AI找客助手',
    description: '快速锁定优质成交客户',
    points: [
      '智能推荐相似客户',
      '挖掘上下游企业与潜在商机',
      '智能筛选高价值客户名单',
      '自动去重，减少无效线索',
      '实时查看拓客效果与数据分析',
    ],
  },
  {
    image: '/images/liuzi/2.png',
    icon: '/images/liuzi/aiSales.png',
    iconAlt: 'AI销售陪练图标',
    sideIcon: '/images/liuzi/aiSalesIcon.png',
    sideImageAlt: '',
    title: 'AI销售陪练',
    description: '全员具备销冠实力',
    points: [
      '模拟真实客户沟通场景',
      'AI实时提问、追问与互动',
      '自动发现销售沟通问题',
      '提供针对性改进建议',
      '快速复制优秀销售经验',
    ],
  },
  {
    image: '/images/liuzi/3.png',
    icon: '/images/liuzi/aiBusiness.png',
    iconAlt: 'AI业务分析图标',
    sideIcon: '/images/liuzi/aiBusinessIcon.png',
    sideImageAlt: '',
    title: 'AI业务分析',
    description: '数据诊问题，AI 挖机会',
    points: [
      '自动汇总客户与销售数据',
      '实时分析团队业绩情况',
      '提前预警商机流失风险',
      '找出销售过程中的关键瓶颈',
      'AI生成改善建议与行动方案',
    ],
  },
]

const demoArticleCards = [
  {
    image: ecosystemAbility1,
    tag: '产品动态',
    title: '销帮帮 CRM 2026 年度产品发布会回顾',
    publishDate: '2026-07-20',
    linkHref: '/articles/2026-product-launch',
  },
  {
    image: ecosystemAbility2,
    tag: '行业洞察',
    title: '制造业数字化转型的六大关键趋势',
    publishDate: '2026-07-15',
    linkHref: '/articles/manufacturing-digital-trends',
  },
  {
    image: ecosystemAbility3,
    title: '从数据到决策：AI 如何重塑客户管理',
    publishDate: '2026-07-10',
    linkHref: '/articles/ai-reshaping-crm',
  },
]

// ===== ContentList 交互式控件 =====
const articleListControls = [
  {
    label: 'Variant',
    prop: 'variant',
    options: [
      { label: 'card（含描述）', value: 'card' },
      { label: 'compact（紧凑）', value: 'compact' },
      { label: 'list（纯文本）', value: 'list' },
      { label: 'article-row（横向文章）', value: 'article-row' },
    ],
  },
  {
    label: 'Rounded',
    prop: 'rounded',
    options: [
      { label: '开启', value: true },
      { label: '关闭', value: false },
    ],
  },
  {
    label: 'Pagination',
    prop: 'show-pagination',
    options: [
      { label: '显示', value: true },
      { label: '隐藏', value: false },
    ],
  },
]

const articleListDefaults = {
  variant: 'card',
  rounded: true,
  'show-pagination': true,
  'current-page': 1,
  total: 17090,
  'page-size': 10,
  title: '最新文章',
}

const articleListCodeExtra = {
  title: '"最新文章"',
  ':items': 'items',
}

// ===== ContentList 演示数据 =====
const demoArticles = [
  {
    image: ecosystemAbility1,
    tag: '客户管理',
    title: '客户生命周期管理：从线索到成交的全流程优化',
    description:
      '深入了解客户生命周期各阶段的管理要点，从线索获取、培育转化到成交复购，构建完整的客户管理闭环。',
    publishDate: '2024-10-28',
  },
  {
    image: ecosystemAbility2,
    tag: '行业方案',
    title: '制造业数字化转型实践：CRM 如何赋能传统工厂',
    description:
      '探讨制造业企业在数字化转型过程中的痛点与解决方案，看 CRM 系统如何帮助传统工厂实现智能化管理升级。',
    publishDate: '2024-10-25',
  },
  {
    image: ecosystemAbility3,
    tag: '产品动态',
    title: '销帮帮 CRM 2024 年 Q4 产品更新亮点一览',
    description:
      '汇集 Q4 季度产品功能更新，包括 AI 智能推荐、客户画像增强、移动端体验优化等多项重要升级。',
    publishDate: '2024-10-22',
  },
  {
    image: ecosystemAbility1,
    tag: '签约喜报',
    title: '喜报：华强集团正式签约销帮帮 CRM 企业版',
    description:
      '华强集团经过多轮选型评估，最终选择销帮帮 CRM 作为企业数字化管理平台，覆盖销售、客服全流程。',
    publishDate: '2024-10-20',
  },
  {
    image: ecosystemAbility2,
    tag: '更新公告',
    title: '销帮帮 V6.8 版本更新公告：全新 UI 与性能优化',
    description:
      'V6.8 版本带来全新界面设计、3 倍性能提升、批量操作优化等多项改进，升级体验全面焕新。',
    publishDate: '2024-10-18',
  },
  {
    image: ecosystemAbility3,
    tag: '功能详解',
    title: 'AI 智能客户评分：让数据告诉你谁是最有价值的客户',
    description:
      '深度解析 AI 智能客户评分功能的工作原理与应用场景，帮助企业精准识别高价值客户，提升销售效率。',
    publishDate: '2024-10-15',
  },
  {
    image: ecosystemAbility1,
    tag: '干货分享',
    title: '销售团队管理的 7 个关键指标：从数据看管理效率',
    description:
      '分享销售团队管理中最重要的 7 个 KPI 指标，帮助管理者通过数据驱动决策，提升团队整体业绩。',
    publishDate: '2024-10-12',
  },
  {
    image: ecosystemAbility2,
    tag: '客户案例',
    title: '从 0 到 1000 万：某初创企业使用 CRM 的增长故事',
    description:
      '一家初创企业如何通过销帮帮 CRM 实现客户管理标准化，在 18 个月内实现营收从 0 到 1000 万的跨越式增长。',
    publishDate: '2024-10-10',
  },
]

const demoArticleRows = [
  {
    image: ecosystemAbility1,
    title: '2026 年跨境业务 CRM 排行榜：适合外贸团队的 5 大热门系统',
    description:
      '2026年跨境业务CRM排行榜深度评测：纷享销客、Salesforce、HubSpot等5大热门外贸系统横向对比。解析AI智能化、LTC闭环与合规选型标准，帮助出海企业避开闲置陷阱。',
    summary:
      '2026年跨境业务CRM排行榜深度评测：纷享销客、Salesforce、HubSpot等5大热门外贸系统横向对比。解析AI智能化、LTC闭环与合规选型标准，帮助出海企业避开闲置陷阱。',
    publishDate: '2026-8-4',
    updatedAt: '2026-8-4',
    author: '纷享销客',
    linkHref: '#',
  },
  {
    image: ecosystemAbility2,
    title: '2026 国内头部出海企业 CRM 服务商梯队，跨国业务选型榜',
    description:
      '2026年出海CRM选型指南：深度解析跨国业务四大硬指标，梳理国内服务商梯队，纷享销客等国产CRM如何凭借GDPR合规、1+N架构与Agentic AI成为大型跨国集团的核心系统。',
    summary:
      '2026年出海CRM选型指南：深度解析跨国业务四大硬指标，梳理国内服务商梯队，纷享销客等国产CRM如何凭借GDPR合规、1+N架构与Agentic AI成为大型跨国集团的核心系统。',
    publishDate: '2026-8-4',
    updatedAt: '2026-8-4',
    author: '纷享销客',
    linkHref: '#',
  },
  {
    image: ecosystemAbility3,
    title: '跨境 B2B 大客户精细化管理选什么 CRM？2026 集团系统推荐',
    description:
      '围绕跨境B2B企业的大客户经营、线索流转、商机推进和多区域团队协作，拆解CRM系统在集团化管理场景中的核心能力和落地方式。',
    summary:
      '围绕跨境B2B企业的大客户经营、线索流转、商机推进和多区域团队协作，拆解CRM系统在集团化管理场景中的核心能力和落地方式。',
    publishDate: '2026-8-3',
    updatedAt: '2026-8-3',
    author: '纷享销客',
    linkHref: '#',
  },
]

// ===== TextContentList 演示数据 =====
const demoTextArticles = [
  {
    publishDate: '2024-10-28',
    tag: '客户管理',
    title: '客户生命周期管理：从线索到成交的全流程优化',
  },
  {
    publishDate: '2024-10-25',
    tag: '行业方案',
    title: '制造业数字化转型实践：CRM 如何赋能传统工厂',
    linkHref: '#',
  },
  {
    publishDate: '2024-10-22',
    tag: '产品动态',
    title: '销帮帮 CRM 2024 年 Q4 产品更新亮点一览',
  },
  {
    publishDate: '2024-10-20',
    tag: '签约喜报',
    title: '喜报：华强集团正式签约销帮帮 CRM 企业版',
  },
  {
    publishDate: '2024-10-18',
    tag: '更新公告',
    title: '销帮帮 V6.8 版本更新公告：全新 UI 与性能优化',
    linkHref: '#',
  },
  {
    publishDate: '2024-10-15',
    tag: '功能详解',
    title: 'AI 智能客户评分：让数据告诉你谁是最有价值的客户',
  },
]

// ===== ImageTextFeatureGrid 演示数据 =====
const demoFeatureCards = [
  {
    image: ecosystemAbility1,
    tag: '产品动态',
    title: '进销存管理全新升级，智能补货与库存预警能力大幅提升',
    publishDate: '2026-07-27',
    linkHref: '#',
  },
  {
    image: ecosystemAbility2,
    tag: '行业洞察',
    title: '财务管理',
    publishDate: '2026-07-25',
    linkHref: '#',
  },
  {
    image: ecosystemAbility3,
    tag: '产品动态',
    title: '客户全生命周期管理方案：从线索获取到成交复购的完整闭环',
    publishDate: '2026-07-20',
    linkHref: '#',
  },
  {
    image: ecosystemAbility1,
    tag: '行业洞察',
    title: '数据分析',
    publishDate: '2026-07-15',
    linkHref: '#',
  },
]

// ===== ImageTextFeatureGrid 单列演示数据（含摘要） =====
const demoFeatureSingleCards = [
  {
    image: ecosystemAbility1,
    tag: '产品动态',
    title: '进销存管理',
    description: '一体化进销存管理，实时掌握库存动态，智能补货提醒，让商品管理更高效。',
    publishDate: '2026-07-27',
    linkHref: '#',
  },
  {
    image: ecosystemAbility2,
    tag: '行业洞察',
    title: '财务管理',
    description: '智能财务核算，多维度利润分析，自动生成财务报表，助力企业精细化运营。',
    publishDate: '2026-07-25',
    linkHref: '#',
  },
]

// ===== PlatformDownload 演示数据 =====
const platformDownloadCards = [
  {
    name: '钉钉',
    icon: '/ecosystem/ability-1.svg',
    qrCode: '/images/customer/tab-unified.svg',
  },
  {
    name: '飞书',
    icon: '/ecosystem/ability-3.svg',
    qrCode: '/images/customer/tab-tracking.svg',
  },
  {
    name: '企业微信',
    icon: '/ecosystem/ability-2.svg',
    qrCode: '/images/customer/tab-retention.svg',
  },
  {
    name: '独立版',
    icon: '/ecosystem/1688.png',
    qrCode: '/images/customer/tab-collaboration.svg',
  },
  {
    name: 'AI助手',
    icon: '/images/liuzi/aiBusiness.png',
    qrCode: '/images/customer/hero.svg',
  },
]

// ===== Timeline 演示数据 =====
const timelineMilestones = [
  {
    year: '2017',
    title: '产品正式发布',
    description: [
      '销帮帮 CRM 1.0 版本正式上线，主打客户管理与销售跟进功能，',
      { text: '首年付费客户突破 1000 家', highlight: true },
      '，获得天使轮融资。',
    ],
  },
  {
    year: '2018',
    title: '高速增长期',
    description: [
      '完成 A 轮融资，团队规模从 30 人扩张至 150 人，',
      { text: '服务企业突破 10,000 家', highlight: true },
      '，产品新增数据分析与智能报表模块。',
    ],
  },
  {
    year: '2019',
    title: 'AI 战略升级',
    description: [
      '发布 AI 智能客户评分与商机推荐引擎，',
      { text: '日活用户突破 50 万', highlight: true },
      '，完成 B 轮融资，与钉钉、企业微信达成深度战略合作。',
    ],
  },
  {
    year: '2020',
    title: '行业领先地位',
    description: [
      '累计服务企业超 30 万家，',
      { text: '付费客户数突破 16,000 家', highlight: true },
      '，营收突破 12 亿，稳居国内 CRM 行业第一梯队。',
    ],
  },
] as const

// ===== FlowSteps 演示数据 =====
const processDemoSteps = [
  {
    theme: 'purple' as const,
    title: '需求梳理与方案设计',
    description: '专业顾问团队深入调研企业业务痛点，结合行业最佳实践，为您量身定制数字化解决方案。',
    features: ['需求调研与诊断', '行业对标分析', '个性化方案设计'],
    summary: '1-3 个工作日完成方案',
  },
  {
    theme: 'blue' as const,
    title: '系统部署与数据迁移',
    description: '快速完成系统环境搭建，安全高效地完成历史数据迁移与接口对接，确保业务无缝衔接。',
    features: ['系统环境搭建', '数据迁移与清洗', '第三方系统对接'],
    summary: '3-5 个工作日上线部署',
  },
  {
    theme: 'teal' as const,
    title: '员工培训与试运行',
    description: '分层级开展系统操作培训，通过试运行阶段收集反馈，持续优化流程与体验。',
    features: ['分层级操作培训', '试运行与反馈收集', '流程持续优化'],
    summary: '1-2 周完成全员培训',
  },
  {
    theme: 'orange' as const,
    title: '正式上线与持续服务',
    description: '系统正式上线运行，专属客户成功经理持续跟进，提供7×24小时技术支持与迭代升级服务。',
    features: ['正式上线切换', '7×24 技术支持', '定期回访与升级'],
    summary: '长期陪跑，持续赋能',
  },
] as const

// ===== FlowSteps 交互式控件 =====
const processStepsControls = [
  {
    label: 'Arrow Style',
    prop: 'arrowStyle',
    options: [
      { label: 'line（直线）', value: 'line' },
      { label: 'filled（实心）', value: 'filled' },
      { label: 'gradient（渐变）', value: 'gradient' },
      { label: 'chevron（双V形）', value: 'chevron' },
    ],
  },
  {
    label: 'Reverse（箭头翻转）',
    prop: 'reverse',
    options: [
      { label: 'false（默认方向）', value: false },
      { label: 'true（翻转方向）', value: true },
    ],
  },
]

const processStepsDefaults = {
  arrowStyle: 'line',
  reverse: false,
  title: '如何快速开启数智化',
  subtitle: '从需求梳理到正式上线，专业团队全程陪跑，助力企业轻松实现数字化转型',
}

const processStepsCodeExtra = {
  title: '"如何快速开启数智化"',
  subtitle: '"从需求梳理到正式上线，专业团队全程陪跑..."',
  ':steps': 'steps',
  'arrow-style': '"line"',
  reverse: 'false',
}

// ===== ReviewCardGrid 演示数据 =====
const reviewDemoCards = [
  {
    logo: '/images/customer/tab-unified.svg',
    industry: '制造行业',
    content:
      '销帮帮 CRM 帮助我们实现了客户管理的全面数字化，从线索跟进到成交转化，整个流程变得清晰可控。销售团队的工作效率提升了至少 40%，客户满意度也大幅提高。',
    username: '张总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-tracking.svg',
    industry: '零售行业',
    content:
      '作为一家快速成长的零售企业，我们需要一个既能满足当前需求又能支撑未来发展的 CRM 系统。销帮帮不仅功能完善，而且与钉钉的深度集成让我们的员工几乎零学习成本就上手了。从客户分配到售后跟进，全流程数字化管理，真正实现了降本增效。强烈推荐给同样在寻找数字化解决方案的零售同行！',
    username: '李经理',
    rating: 4,
  },
  {
    logo: '/images/customer/tab-retention.svg',
    industry: '服务行业',
    content: 'AI 智能客户评分功能非常实用，帮我们精准识别高价值客户，销售资源分配更加合理。',
    username: '王总监',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-collaboration.svg',
    industry: '科技行业',
    content:
      '从选型到上线，销帮帮团队提供了全程专业支持。系统灵活度高，自定义字段和审批流程完全适配了我们的业务场景。使用半年后，客户跟进效率提升明显，数据报表也让管理层对销售动态一目了然。唯一的小建议是希望移动端的部分功能体验能进一步优化，但整体来说已经非常满意了。',
    username: '赵工',
    rating: 3,
  },
]

const reviewCardGridControls = [
  {
    label: 'Columns',
    prop: 'columns',
    options: [
      { label: '2（双列）', value: 2 },
      { label: '1（单列）', value: 1 },
    ],
  },
]

const reviewCardGridDefaults = {
  columns: 2,
}

const reviewCardGridCodeExtra = {
  title: '"客户评价"',
  subtitle: '"来自各行各业的真实用户反馈"',
  ':cards': 'cards',
}
</script>
