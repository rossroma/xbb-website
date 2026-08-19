// ========== 销帮帮 X 企业微信页面 SEO 配置 ==========
import { Branch, ChartHistogram, Filter, Peoples, Trend } from '@/client/components/ui/remixIcons'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { Theme } from '@/client/components/business/theme'

const qiweiAppUrl =
  'https://open.work.weixin.qq.com/appStore/app?appId=MTk3MDMyNDk0MDE1MzkxMl8xMDAxNTY2XzE%3D'

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮CRM X 企业微信',
  desc: '强者结合，绝妙拍档。销帮帮CRM深度集成企业微信，在熟悉的沟通协作场景中，实现客户全生命周期管理，无需切换系统，业务数据实时同步',
  primaryCta: '马上体验',
  primaryHref: qiweiAppUrl,
  primaryTarget: '_blank' as const,
  secondaryCta: '',
  imageAlt: '销帮帮 CRM 企业微信版本展示',
  bg: "url('/images/qiwei/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'qiwei-hero',
  mediaType: 'image' as const,
  eyebrow: '企业微信官方合作伙伴',
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
  line: 'rgba(16, 185, 129, 0.14)',
  accent: '#10b981',
  glow: 'rgba(16, 185, 129, 0.16)',
  orb: 'rgba(14, 165, 169, 0.16)',
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
      image: '/images/qiwei/product-intro.png',
      imageAlt: '客户管理能力展示',
    },
    {
      title: '销售管理',
      intro: '标准化流程，每个商机都有迹可循',
      description: '从线索到成交的全流程管理，阶段推进器规范销售动作，漏斗分析精准预测业绩。',
      icon: Trend,
      image: '/images/qiwei/tab-tracking-new.png',
      imageAlt: '销售管理能力展示',
    },
    {
      title: '市场管理',
      intro: '全渠道营销，驱动增长飞轮',
      description: '整合多渠道营销数据，追踪广告投放效果，计算 ROI，让每一分市场预算都花得值得。',
      icon: Filter,
      image: '/images/qiwei/tab-collaboration-new.png',
      imageAlt: '市场管理能力展示',
    },
    {
      title: '智能报表',
      intro: '可视化 BI，决策有据可依',
      description: '自动生成销售日报、周报、月报，多维度数据分析，帮助管理者快速洞察业务趋势。',
      icon: ChartHistogram,
      image: '/images/qiwei/dedup-report-new.png',
      imageAlt: '智能报表能力展示',
    },
    {
      title: '流程引擎',
      intro: '零代码搭建，业务流程自动化',
      description: '可视化流程设计器，拖拽式配置审批流、业务流，灵活适配企业个性化管理需求。',
      icon: Branch,
      image: '/images/qiwei/dedup-rules-new.png',
      imageAlt: '流程引擎能力展示',
    },
  ] as readonly FeatureItem[],
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
