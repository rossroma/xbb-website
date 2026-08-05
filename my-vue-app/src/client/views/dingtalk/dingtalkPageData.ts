// ========== 销帮帮 X 钉钉页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@icon-park/vue-next'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const dingtalkAppUrl =
  'https://appcenter.dingtalk.com/detail.html?goodsCode=FW_GOODS-1000298770&sig=a387bc5449960a8184b3fc2f537e1870'

export const dingtalkSeo = {
  title: '销帮帮 X 钉钉 - 销帮帮 CRM',
  description:
    '销帮帮 CRM 与钉钉协同，打通业务数据孤岛，支持客户管理、销售管理、市场管理、智能报表、流程引擎等核心能力，让销售管理更专业易用。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 钉钉',
  subtitle: '让进步发生 让业绩提升',
  primaryCta: '马上体验',
  primaryHref: dingtalkAppUrl,
  primaryTarget: '_blank' as const,
  secondaryCta: '',
  image: blankShowcaseImage,
  imageAlt: '销帮帮 CRM 钉钉版本展示',
  bg: 'linear-gradient(135deg, #f4f9ff 0%, #eef5ff 52%, #f8fbff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'dingtalk-hero',
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
  line: 'rgba(37, 99, 235, 0.14)',
  accent: '#2563eb',
  glow: 'rgba(37, 99, 235, 0.16)',
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

// ========== 钉钉专业易用区域（CTASection 图片模式） ==========
export const professionalSection = {
  title: '钉钉，让您的CRM变得更专业易用',
  description: '打通业务数据孤岛，玩转客户',
  image: '/images/dingtalk/dingtalk03.png',
  imageAlt: '钉钉 CRM 专业易用能力展示',
  primaryCta: '马上体验',
}

// ========== 图文展示区域（ImageShowcase） ==========
export const showcaseSections = [
  {
    key: 'stage-accelerator',
    title: '阶段推进器',
    subtitle: '全新定义业务标准动作，完美匹配不同商机阶段\n规范销售执行动作，节约人力校验成本',
    image: '/images/dingtalk/dingtalk04.png',
    imageAlt: '阶段推进器功能展示',
    layout: 'text-left' as const,
    theme: 'blue' as Theme,
  },
  {
    key: 'decision-organization-tree',
    title: '决策树&组织树',
    subtitle: '关键KP对接快，有效提升赢单率\n了解客户的人员层级关系，在跟进的过程中找到突破口',
    image: '/images/dingtalk/dingtalk05.png',
    imageAlt: '决策树与组织树功能展示',
    layout: 'text-right' as const,
    theme: 'sky' as Theme,
  },
  {
    key: 'team-members',
    title: '团队成员',
    subtitle: '依据权限共享数据，让团队协作更高效\n操作权限配置灵活，让角色分工更明确',
    image: '/images/dingtalk/dingtalk06.png',
    imageAlt: '团队成员功能展示',
    layout: 'text-left' as const,
    theme: 'blue' as Theme,
  },
  {
    key: 'work-notice-approval',
    title: '工作通知&审批',
    subtitle:
      'CRM生成的日月周报、跟进记录、审批提醒等\n将以钉钉工作通知的形式推送给团队成员，保障信息的即时同步',
    image: '/images/dingtalk/dingtalk07.png',
    imageAlt: '工作通知与审批功能展示',
    layout: 'text-right' as const,
    theme: 'sky' as Theme,
  },
]
