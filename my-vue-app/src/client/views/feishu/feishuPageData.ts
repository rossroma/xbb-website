// ========== 销帮帮 X 飞书页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@icon-park/vue-next'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'


// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 飞书',
  subtitle: '拥抱数字化 拥抱先进',
  primaryCta: '马上体验',
  secondaryCta: '',
  image: blankShowcaseImage,
  imageAlt: '销帮帮 CRM 飞书版本展示',
  bg: 'linear-gradient(135deg, #f6f7ff 0%, #edf2ff 52%, #f7fbff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'feishu-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  secondaryCta: heroSection.secondaryCta,
  bg: heroSection.bg,
  line: 'rgba(99, 102, 241, 0.14)',
  accent: '#6366f1',
  glow: 'rgba(99, 102, 241, 0.16)',
  orb: 'rgba(14, 165, 233, 0.18)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
}

// ========== CRM 基本能力区域（IconCardGrid） ==========
export const basicAbilitySection = {
  title: '销帮帮CRM基本能力',
  description:
    '销帮帮CRM提供给所有企业销售日常业务所需的基本功能，也可以根据企业的特殊业务场景，定制个性化数字服务。',
  columns: 5 as const,
  features: [
    {
      title: '客户管理',
      description: '',
      icon: Peoples,
    },
    {
      title: '销售管理',
      description: '',
      icon: Trend,
    },
    {
      title: '市场管理',
      description: '',
      icon: Filter,
    },
    {
      title: '智能报表',
      description: '',
      icon: ChartHistogram,
    },
    {
      title: '流程引擎',
      description: '',
      icon: Branch,
    },
  ] as readonly FeatureItem[],
}

// ========== 飞书协作总览区域（CTASection 图片模式） ==========
export const collaborationSection = {
  title: '飞书，让您的CRM变得更加完美',
  description: '真正无缝的团队协作和业务服务',
  image: '/images/feishu/feishu-1@2x.png',
  imageAlt: '飞书 CRM 团队协作和业务服务展示',
  primaryCta: '马上体验',
}

// ========== 图文展示区域（ImageShowcase） ==========
export const showcaseSections = [
  {
    key: 'stage-change-reminder',
    title: '阶段变更提醒',
    subtitle: '即时同步客户阶段、商机阶段的变更信息\n私信至客户负责人，保障信息变更安全性',
    image: '/images/feishu/feishu-2@2x.png',
    imageAlt: '阶段变更提醒功能展示',
    layout: 'text-left' as const,
    theme: 'indigo' as Theme,
  },
  {
    key: 'business-sync',
    title: '业务信息同步',
    subtitle:
      'CRM生成的日月周报、跟进记录等业务数据\n将以飞书的卡片形式推送给团队成员，保障信息的即时同步',
    image: '/images/feishu/feishu-3@2x.png',
    imageAlt: '业务信息同步功能展示',
    layout: 'text-right' as const,
    theme: 'blue' as Theme,
  },
  {
    key: 'sales-automation',
    title: '自动化销售运营',
    subtitle:
      '首次问候、节日关怀、生日祝福等，系统可进行自动提示\n帮助销售完成标准化运营动作，提高客情',
    image: '/images/feishu/feishu-4@2x.png',
    imageAlt: '自动化销售运营功能展示',
    layout: 'text-left' as const,
    theme: 'indigo' as Theme,
  },
]
