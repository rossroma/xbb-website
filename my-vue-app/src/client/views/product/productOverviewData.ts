// ========== 产品概述页面 SEO 配置 ==========
import {
  Branch,
  ChartHistogram,
  FileSettings,
  Peoples,
  Robot,
  SettingConfig,
  Trend,
} from '@icon-park/vue-next'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { BannerSlide } from '@/client/data/homeData'
import heroImage from '../../../../../../statics/home/images/new2022/products/banner-large.jpg'
import crmImage from '../../../../../../statics/home/images/new2022/products/crm@2x.png'
import workOrderImage from '../../../../../../statics/home/images/new2022/products/gongdanguanli@2x.png'
import financeImage from '../../../../../../statics/home/images/new2022/products/zijinguanli@2x.png'
import marketingImage from '../../../../../../statics/home/images/new2022/products/shichangguanli@2x.png'
import inventoryImage from '../../../../../../statics/home/images/new2022/products/jxc@2x.png'

export const moduleCenterUrl =
  'https://module-center.xbongbong.com/preview.html#/application#wz_141'

export const productOverviewSeo = {
  title: '产品概述 - 销帮帮AI CRM',
  description:
    '销帮帮AI CRM产品概述，覆盖CRM、市场管理、资金管理、工单管理、进销存、BI分析和AI能力。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '产品功能',
  primaryCta: '点击查看',
  bg: 'linear-gradient(135deg, #fff7ed 0%, #fff1e7 48%, #fff8f2 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide: BannerSlide = {
  key: 'product-overview-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  desc: '',
  primaryCta: heroSection.primaryCta,
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 178, 91, 0.22)',
  showVisual: true,
  visualImage: heroImage,
  visualImageAlt: '产品功能展示',
}

// ========== 产品能力区域（IconCardGrid） ==========
export const productAbilitySection = {
  title: '产品能力',
  features: [
    { title: 'CRM', description: '', icon: Peoples },
    { title: '市场管理', description: '', icon: Trend },
    { title: '资金管理', description: '', icon: ChartHistogram },
    { title: '工单管理', description: '', icon: SettingConfig },
    { title: '进销存', description: '', icon: FileSettings },
    { title: 'BI分析', description: '', icon: Branch },
    { title: '销帮帮AI', description: '', icon: Robot },
  ] as readonly FeatureItem[],
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
