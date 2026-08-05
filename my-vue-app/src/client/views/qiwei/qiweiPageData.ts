// ========== 销帮帮 X 企业微信页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@icon-park/vue-next'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const qiweiAppUrl =
  'https://open.work.weixin.qq.com/appStore/app?appId=MTk3MDMyNDk0MDE1MzkxMl8xMDAxNTY2XzE%3D'

export const qiweiSeo = {
  title: '销帮帮 X 企业微信 - 销帮帮 CRM',
  description:
    '销帮帮 CRM 与企业微信协同，提供客户管理、销售管理、市场管理、智能报表、流程引擎等核心能力，借助流量运营能力更高效地转化和服务客户。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 企业微信',
  subtitle: '强者结合 绝妙拍档',
  primaryCta: '马上体验',
  primaryHref: qiweiAppUrl,
  primaryTarget: '_blank' as const,
  secondaryCta: '',
  image: blankShowcaseImage,
  imageAlt: '销帮帮 CRM 企业微信版本展示',
  bg: 'linear-gradient(135deg, #f4fcf8 0%, #eefaf4 52%, #f7fbff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'qiwei-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  primaryTarget: heroSection.primaryTarget,
  secondaryCta: heroSection.secondaryCta,
  bg: heroSection.bg,
  line: 'rgba(16, 185, 129, 0.14)',
  accent: '#10b981',
  glow: 'rgba(16, 185, 129, 0.16)',
  orb: 'rgba(14, 165, 169, 0.16)',
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

// ========== 企业微信转化总览区域（CTASection 图片模式） ==========
export const trafficOperationSection = {
  title: '企业微信，让您的CRM变得更强',
  description: '借助流量运营能力更高效地转化和服务客户',
  image: '/images/qiwei/qiwei-1@2x.png',
  imageAlt: '企业微信 CRM 流量运营能力展示',
  primaryCta: '马上体验',
}

// ========== 图文展示区域（ImageShowcase） ==========
export const showcaseSections = [
  {
    key: 'conversation-archive',
    title: '会话存档',
    subtitle:
      '实时留存销售会话内容，通过数据统计和AI分析\n提升会话质量，审计会话合规\n规避业务风险、提升转化效率。',
    image: '/images/qiwei/qiwei-2@2x.png',
    imageAlt: '会话存档功能展示',
    layout: 'text-left' as const,
    theme: 'green' as Theme,
  },
  {
    key: 'traffic-code',
    title: '引流活码',
    subtitle: '聚合多个员工/群聊的二维码，扫码自动添加\n为企业搭建私域流量池，快速引流获客。',
    image: '/images/qiwei/qiwei-3@2x.png',
    imageAlt: '引流活码功能展示',
    layout: 'text-right' as const,
    theme: 'teal' as Theme,
  },
  {
    key: 'sidebar',
    title: '侧边栏',
    subtitle:
      '销帮帮在企业微信侧边框融入了客户信息、阶段、跟进工具\n素材库、模板库等内容，轻松浏览和分享，提高工作效率。',
    image: '/images/qiwei/qiwei-4@2x.png',
    imageAlt: '企业微信侧边栏功能展示',
    layout: 'text-left' as const,
    theme: 'green' as Theme,
  },
  {
    key: 'interaction-radar',
    title: '互动雷达',
    subtitle:
      '精准记录并反馈用户通过小程序、内容素材等触发的行为\n全面把握客户全生命周期管理，进行精细化用户运营。',
    image: '/images/qiwei/qiwei-5@2x.png',
    imageAlt: '互动雷达功能展示',
    layout: 'text-right' as const,
    theme: 'teal' as Theme,
  },
]
