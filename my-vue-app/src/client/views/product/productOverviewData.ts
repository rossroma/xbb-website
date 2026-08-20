// ========== 产品概述页面 SEO 配置 ==========
import type { ImageCardGridItem } from '@/client/components/business/ImageCardGrid.vue'
import type { BannerSlide } from '@/client/data/homeData'

const crmImage = '/images/product/customer-full-process-online.png'
const workOrderImage = '/images/product/service-process-standardization.png'
const financeImage = '/images/product/business-funds-integration.png'
const marketingImage = '/images/product/lead-to-conversion-closed-loop.png'
const inventoryImage = '/images/product/procurement-sales-inventory-coordination.png'
const biImage = '/images/product/business-data-visualization.png'
const aiImage = '/images/product/ai-intelligent-analysis.png'

export const moduleCenterUrl =
  'https://module-center.xbongbong.com/preview.html#/application#wz_141'


// ========== Hero 区域 ==========
export const heroSection = {
  title: '产品功能',
  primaryCta: '点击查看',
  desc:'AI CRM，让企业业绩增长看得见',
  bg: "url('/images/product/hero-banner.jpg') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide: BannerSlide = {
  key: 'product-overview-hero',
  mediaType: 'image',
  title: heroSection.title,
  desc: heroSection.desc,
  primaryCta: heroSection.primaryCta,
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 178, 91, 0.22)',
  showVisual: true,
  visualImage: '',
  visualImageAlt: '产品功能展示',
}

// ========== 产品能力区域（ImageCardGrid） ==========
export const productAbilitySection = {
  title: '产品能力',
  cards: [
    {
      key: 'crm',
      module: 'CRM',
      title: '客户经营全流程在线',
      description: '统一沉淀客户、线索、商机与跟进记录，让销售过程可追踪、客户资产可复用。',
      image: crmImage,
      imageAlt: 'CRM产品能力展示',
    },
    {
      key: 'marketing',
      module: '市场管理',
      title: '从获客到转化闭环管理',
      description: '覆盖市场活动、线索清洗、渠道归因和投放效果分析，帮助企业提升线索质量。',
      image: marketingImage,
      imageAlt: '市场管理产品能力展示',
    },
    {
      key: 'finance',
      module: '资金管理',
      title: '业务资金一体化管控',
      description: '打通回款、开票、应收应付和账户管理，让财务数据与销售业务保持一致。',
      image: financeImage,
      imageAlt: '资金管理产品能力展示',
    },
    {
      key: 'work-order',
      module: '工单管理',
      title: '服务流程标准化协同',
      description: '统一受理、分派、处理和回访售后工单，提升跨部门协作效率和客户服务体验。',
      image: workOrderImage,
      imageAlt: '工单管理产品能力展示',
    },
    {
      key: 'inventory',
      module: '进销存',
      title: '采购销售库存协同',
      description: '联动采购、销售、库存和交付流程，实时掌握库存变化，降低运营和履约成本。',
      image: inventoryImage,
      imageAlt: '进销存产品能力展示',
    },
    {
      key: 'bi',
      module: 'BI分析',
      title: '经营数据实时可视化',
      description: '多维度汇总业务数据，快速查看销售、客户、市场和回款表现，辅助管理决策。',
      image: biImage,
      imageAlt: 'BI分析产品能力展示',
    },
    {
      key: 'ai',
      module: '销帮帮AI',
      title: 'AI驱动销售提效',
      description: '通过智能分析、辅助跟进和业务洞察，帮助销售团队提升执行效率与转化质量。',
      image: aiImage,
      imageAlt: '销帮帮AI产品能力展示',
    },
  ] as readonly ImageCardGridItem[],
}

// ========== 图文展示区域（ImageShowcase） ==========
export const productShowcaseSections = [
  {
    key: 'crm-mobile',
    title: '口袋里的CRM系统',
    subtitle: '支持移动端，\n随时随地查看客户信息，\n科学管理销售行为。',
    ctaText: '点击查看',
    image: crmImage,
    imageAlt: 'CRM系统移动端能力展示',
    layout: 'text-left' as const,
  },
  {
    key: 'work-order',
    title: '工单管理让服务创造价值',
    subtitle: '售后流程标准化、规范化，\n促进部门或员工之间高效协同，提升售后体验。',
    ctaText: '点击查看',
    image: workOrderImage,
    imageAlt: '工单管理产品展示',
    layout: 'text-right' as const,
  },
  {
    key: 'finance',
    title: '一体化的资金管理',
    subtitle: '统一资金管理账户，\n预收预付，应收应付，收付款与发票管理一体化，\n资金管控更轻松。',
    ctaText: '点击查看',
    image: financeImage,
    imageAlt: '资金管理产品展示',
    layout: 'text-left' as const,
  },
  {
    key: 'marketing',
    title: '市场管理一手把控',
    subtitle: '从市场活动管理到线索清洗，\n有效提升线索质量，提高转化率，\n释放ROI的提升空间。',
    ctaText: '点击查看',
    image: marketingImage,
    imageAlt: '市场管理产品展示',
    layout: 'text-right' as const,
  },
  {
    key: 'inventory',
    title: '进销存也智能起来',
    subtitle: '智能推荐采购和生产计划，精准预测库存，\n提高交付效率，降低运营成本。',
    ctaText: '点击查看',
    image: inventoryImage,
    imageAlt: '进销存产品展示',
    layout: 'text-left' as const,
  },
]
