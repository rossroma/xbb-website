// ========== 销帮帮 X 钉钉页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@/client/components/ui/remixIcons'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const dingtalkAppUrl =
  'https://appcenter.dingtalk.com/detail.html?goodsCode=FW_GOODS-1000298770&sig=a387bc5449960a8184b3fc2f537e1870'

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 钉钉',
  desc: '让进步发生，让业绩提升。销帮帮CRM深度集成钉钉，在熟悉的沟通协作场景中，实现客户全生命周期管理，无需切换系统，业务数据实时同步',
  primaryCta: '马上体验',
  primaryHref: dingtalkAppUrl,
  primaryTarget: '_blank' as const,
  secondaryCta: '',
  imageAlt: '销帮帮 CRM 钉钉版本展示',
  bg: "url('/images/dingtalk/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'dingtalk-hero',
  mediaType: 'image' as const,
  eyebrow: '钉钉官方合作伙伴',
  eyebrowBackground: 'rgba(91, 82, 255, 0.1)',
  eyebrowColor: '#5b52cc',
  title: heroSection.title,
  subtitle: '',
  desc: heroSection.desc,
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  primaryTarget: heroSection.primaryTarget,
  secondaryCta: heroSection.secondaryCta,
  bg: heroSection.bg,
  line: 'rgba(37, 99, 235, 0.14)',
  accent: '#2563eb',
  glow: 'rgba(37, 99, 235, 0.16)',
  orb: 'rgba(14, 165, 233, 0.18)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
}

// ========== CRM 基本能力区域（IconCardGrid capability-card） ==========
export const basicAbilitySection = {
  title: '销帮帮CRM基本能力',
  description:
    '销帮帮CRM提供给所有企业销售日常业务所需的基本功能，也可以根据企业的特殊业务场景，定制个性化数字服务。',
  columns: 5 as const,
  cards: [
    {
      title: '客户管理',
      intro: '360° 客户画像，让每位客户都被记住',
      description: '统一管理客户信息、联系记录、商机跟进，构建完整客户档案，随时掌握客户动态。',
      icon: Peoples,
      image: '/images/dingtalk/product-intro.png',
      imageAlt: '客户管理能力展示',
    },
    {
      title: '销售管理',
      intro: '标准化流程，每个商机都有迹可循',
      description: '从线索到成交的全流程管理，阶段推进器规范销售动作，漏斗分析精准预测业绩。',
      icon: Trend,
      image: '/images/dingtalk/tab-tracking-new.png',
      imageAlt: '销售管理能力展示',
    },
    {
      title: '市场管理',
      intro: '全渠道营销，驱动增长飞轮',
      description: '整合多渠道营销数据，追踪广告投放效果，计算 ROI，让每一分市场预算都花得值得。',
      icon: Filter,
      image: '/images/dingtalk/tab-collaboration-new.png',
      imageAlt: '市场管理能力展示',
    },
    {
      title: '智能报表',
      intro: '可视化 BI，决策有据可依',
      description: '自动生成销售日报、周报、月报，多维度数据分析，帮助管理者快速洞察业务趋势。',
      icon: ChartHistogram,
      image: '/images/dingtalk/dedup-report-new.png',
      imageAlt: '智能报表能力展示',
    },
    {
      title: '流程引擎',
      intro: '零代码搭建，业务流程自动化',
      description: '可视化流程设计器，拖拽式配置审批流、业务流，灵活适配企业个性化管理需求。',
      icon: Branch,
      image: '/images/dingtalk/dedup-rules-new.png',
      imageAlt: '流程引擎能力展示',
    },
  ] as readonly FeatureItem[],
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
