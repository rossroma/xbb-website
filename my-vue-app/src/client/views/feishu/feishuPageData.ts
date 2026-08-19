// ========== 销帮帮 X 飞书页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@/client/components/ui/remixIcons'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const feishuAppUrl =
  'https://app.feishu.cn/app/cli_a068c888e8f8d00b?lang=zh-CN&open_in_browser=true'

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 飞书',
  desc: '拥抱数字化，拥抱先进。销帮帮CRM深度集成飞书，在熟悉的沟通协作场景中，实现客户全生命周期管理，无需切换系统，业务数据实时同步',
  primaryCta: '马上体验',
  primaryHref: feishuAppUrl,
  primaryTarget: '_blank' as const,
  secondaryCta: '',
  imageAlt: '销帮帮 CRM 飞书版本展示',
  bg: "url('/images/feishu/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'feishu-hero',
  mediaType: 'image' as const,
  eyebrow: '飞书官方合作伙伴',
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
  line: 'rgba(99, 102, 241, 0.14)',
  accent: '#6366f1',
  glow: 'rgba(99, 102, 241, 0.16)',
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
      image: '/images/feishu/product-intro.png',
      imageAlt: '客户管理能力展示',
    },
    {
      title: '销售管理',
      intro: '标准化流程，每个商机都有迹可循',
      description: '从线索到成交的全流程管理，阶段推进器规范销售动作，漏斗分析精准预测业绩。',
      icon: Trend,
      image: '/images/feishu/tab-tracking-new.png',
      imageAlt: '销售管理能力展示',
    },
    {
      title: '市场管理',
      intro: '全渠道营销，驱动增长飞轮',
      description: '整合多渠道营销数据，追踪广告投放效果，计算 ROI，让每一分市场预算都花得值得。',
      icon: Filter,
      image: '/images/feishu/tab-collaboration-new.png',
      imageAlt: '市场管理能力展示',
    },
    {
      title: '智能报表',
      intro: '可视化 BI，决策有据可依',
      description: '自动生成销售日报、周报、月报，多维度数据分析，帮助管理者快速洞察业务趋势。',
      icon: ChartHistogram,
      image: '/images/feishu/dedup-report-new.png',
      imageAlt: '智能报表能力展示',
    },
    {
      title: '流程引擎',
      intro: '零代码搭建，业务流程自动化',
      description: '可视化流程设计器，拖拽式配置审批流、业务流，灵活适配企业个性化管理需求。',
      icon: Branch,
      image: '/images/feishu/dedup-rules-new.png',
      imageAlt: '流程引擎能力展示',
    },
  ] as readonly FeatureItem[],
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
