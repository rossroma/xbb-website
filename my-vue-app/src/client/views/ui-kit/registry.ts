/**
 * UI Kit 组件注册表 — 单一数据源
 *
 * 新增组件只需在此文件中添加一行，侧边栏自动生成，无需手动同步。
 * 页面模板中的 section id 必须与此注册表中的 id 一致。
 */

export type CategoryId = 'foundations' | 'base' | 'business' | 'layout' | 'composite'

export interface CategoryMeta {
  id: string
  label: string
  path: string
}

export interface SectionEntry {
  id: string
  name: string
  category: CategoryId
}

// ===== 分类元数据 =====
export const categoryMeta: Record<CategoryId, CategoryMeta> = {
  foundations: { id: 'cat-foundations', label: '基础规范', path: '/ui-kit/foundations' },
  base: { id: 'cat-base', label: '基础组件', path: '/ui-kit/components' },
  business: { id: 'cat-business', label: 'Business 组件', path: '/ui-kit/business' },
  layout: { id: 'cat-layout', label: 'Layout 组件', path: '/ui-kit/layout' },
  composite: { id: 'cat-ui-kit', label: '组合组件', path: '/ui-kit/composite' },
}

// ===== 所有 Section 注册表 =====
// 新增组件只需在此数组中添加一行
export const sections: SectionEntry[] = [
  // ── 基础规范 ──
  { id: 'colors', name: '1.1 品牌色板', category: 'foundations' },
  { id: 'colors-gradients', name: '1.1b 渐变色', category: 'foundations' },
  { id: 'typography', name: '1.2 排版', category: 'foundations' },
  { id: 'spacing', name: '1.3–1.5 间距/圆角/阴影', category: 'foundations' },
  { id: 'motion', name: '1.6 动效', category: 'foundations' },
  { id: 'breakpoints', name: '1.8 断点', category: 'foundations' },
  { id: 'icons', name: '1.9 Icon 图标库', category: 'foundations' },

  // ── 基础组件 ──
  { id: 'button', name: 'Button 按钮', category: 'base' },
  { id: 'card', name: 'Card 卡片', category: 'base' },
  { id: 'video-card', name: 'VideoCard 视频卡片', category: 'base' },
  { id: 'badge', name: 'Badge 徽章', category: 'base' },
  { id: 'tabs', name: 'Tabs 选项卡', category: 'base' },
  { id: 'skeleton', name: 'Skeleton 骨架屏', category: 'base' },
  { id: 'emptystate', name: 'EmptyState 空状态', category: 'base' },
  { id: 'errorstate', name: 'ErrorState 错误状态', category: 'base' },
  { id: 'form', name: 'Form 表单容器', category: 'base' },
  { id: 'form-input', name: 'FormInput 输入框', category: 'base' },
  { id: 'form-select', name: 'FormSelect 下拉选择', category: 'base' },
  { id: 'form-checkbox', name: 'FormCheckbox 复选框', category: 'base' },
  { id: 'form-radio', name: 'FormRadio 单选框', category: 'base' },
  { id: 'form-switch', name: 'FormSwitch 开关', category: 'base' },
  { id: 'form-demo', name: '综合表单示例', category: 'base' },
  { id: 'section-heading', name: 'SectionHeading 标题区', category: 'base' },
  { id: 'pagination', name: 'Pagination 翻页', category: 'base' },

  // ── Business 组件 ──
  // 页面顶部 / Hero 区
  { id: 'hero-banner', name: 'HeroBanner', category: 'business' },
  { id: 'hero-banner-single', name: 'HeroBanner (单页)', category: 'business' },
  { id: 'hero-banner-showcase-carousel', name: 'HeroBanner 展示轮播', category: 'business' },
  { id: 'image-showcase', name: 'TabShowcase 单Tab图文', category: 'business' },
  { id: 'article-sidebar', name: 'ArticleSidebar 文章侧边栏', category: 'business' },
  { id: 'gradient-hero', name: 'GradientHero 渐变 Hero', category: 'business' },
  { id: 'promo-banner', name: 'PromoBanner 图文横幅', category: 'business' },
  { id: 'promo-banner-carousel', name: 'PromoBannerCarousel 轮播', category: 'business' },

  // 图文卡片 / 展示类
  { id: 'feature-image-card', name: 'FeatureImageCard 图片卡片', category: 'business' },
  { id: 'content-card-grid', name: 'ContentCardGrid 图文卡片', category: 'business' },
  { id: 'address-tabs', name: 'AddressTabs 地址切换', category: 'business' },
  { id: 'ai-crm-feature-grid', name: 'AiCrmFeatureGrid AI+CRM 能力卡片', category: 'business' },
  { id: 'image-card-grid', name: 'ImageCardGrid 图片卡片网格', category: 'business' },
  { id: 'icon-card-grid', name: 'IconCardGrid 图标卡片', category: 'business' },
  { id: 'gradient-card-grid', name: 'GradientCardGrid 渐变卡片', category: 'business' },
  { id: 'split-section', name: 'SplitSection 图文分栏', category: 'business' },
  { id: 'split-card-layout', name: 'SplitCardLayout 非对称卡片', category: 'business' },

  // 列表 / 内容类
  { id: 'content-list', name: 'ContentList 内容列表', category: 'business' },
  { id: 'faq-list', name: 'FaqList 常见问题', category: 'business' },
  { id: 'feature-list', name: 'FeatureList 功能列表', category: 'business' },
  { id: 'flow-steps', name: 'FlowSteps 流程步骤', category: 'business' },
  { id: 'tab-showcase', name: 'TabShowcase Tab 展示', category: 'business' },

  // 数据 / 信任 / 转化类
  { id: 'metrics-panel', name: 'MetricsPanel 数据指标', category: 'business' },
  { id: 'company-overview', name: 'CompanyOverview 公司介绍模块', category: 'business' },
  { id: 'research-strength-section', name: 'ResearchStrengthSection 研发实力', category: 'business' },
  { id: 'recognition-section', name: 'RecognitionSection 权威认可', category: 'business' },
  { id: 'industry-carousel', name: 'IndustryCarousel 行业案例', category: 'business' },
  { id: 'partner-grid', name: 'PartnerGrid 合作伙伴', category: 'business' },
  { id: 'platform-download', name: 'PlatformDownload 平台下载', category: 'business' },
  { id: 'cta-section', name: 'CTASection 行动号召', category: 'business' },
  { id: 'process-steps', name: 'ProcessSteps 流程步骤卡片', category: 'business' },
  { id: 'contact-hotline', name: 'ContactHotline 热线联系方式', category: 'business' },
  { id: 'contact-card', name: 'ContactCard 联系方式卡片', category: 'business' },
  { id: 'review-card-grid', name: 'ReviewCardGrid 用户评价', category: 'business' },
  { id: 'timeline', name: 'Timeline 发展历程', category: 'business' },
  { id: 'case-detail-header', name: 'CaseDetailHeader 案例详情头部', category: 'business' },

  // ── Layout 组件 ──
  { id: 'site-header', name: 'SiteHeader', category: 'layout' },
  { id: 'site-footer', name: 'SiteFooter', category: 'layout' },
  { id: 'floating-toolbar', name: 'FloatingToolbar', category: 'layout' },
  { id: 'sticky-form-bar', name: 'StickyFormBar', category: 'layout' },
  { id: 'breadcrumb', name: 'Breadcrumb 面包屑', category: 'layout' },
  { id: 'page-nav', name: 'PageNav 上下翻页', category: 'layout' },

  // ── 组合组件 ──
  { id: 'section-block', name: 'SectionBlock', category: 'composite' },
  { id: 'card-grid', name: 'CardGrid', category: 'composite' },
  { id: 'carousel', name: 'Carousel', category: 'composite' },
  { id: 'icon-badge', name: 'IconBadge', category: 'composite' },
  { id: 'metric-item', name: 'MetricItem', category: 'composite' },
]

// ===== 工具函数 =====

/** 按分类获取 section 列表 */
export function getSectionsByCategory(cat: CategoryId): SectionEntry[] {
  return sections.filter((s) => s.category === cat)
}

/** 构建 id → section 查找表 */
export const sectionById = new Map<string, SectionEntry>(sections.map((s) => [s.id, s]))

/** 构建 id → category 查找表（用于侧边栏跨页面跳转） */
export const categoryBySectionId = new Map<string, CategoryId>(
  sections.map((s) => [s.id, s.category]),
)
