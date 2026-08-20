// ========== 伙伴合作页面 SEO 配置 ==========
import {
  Agreement,
  BookOpen,
  Certificate,
  Checklist,
  CooperativeHandshake,
  FileEditing,
  FileSearch,
  Income,
  Level,
  LinkCloud,
  Rocket,
  SalesReport,
  Trend,
  UserBusiness,
} from '@/client/components/ui/remixIcons'
import type { FeatureListItem } from '@/client/components/business/FeatureList.vue'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const productVisualImage = '/images/customer/hero.png'
const partnerContactHref = `${toPagePath('channel_qudao')}#partner-contact`

// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮AI CRM合作伙伴招募',
  desc: '互相成就，共享 AI CRM 增长红利\n携手销帮帮AI CRM助力企业智能销售全面升级',
  primaryCta: '立即加入',
  primaryHref: partnerContactHref,
  image: productVisualImage,
  imageAlt: '销帮帮AI CRM产品界面展示',
  bg: "url('/images/partner/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'partner-cooperation-hero',
  mediaType: 'image',
  title: heroSection.title,
  subtitle: '',
  desc: heroSection.desc,
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: undefined,
  bg: heroSection.bg,
  line: 'rgba(124, 92, 255, 0.16)',
  accent: '#7c5cff',
  glow: 'rgba(124, 92, 255, 0.18)',
  orb: 'rgba(14, 165, 233, 0.16)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 渠道伙伴类型区域（IconCardGrid） ==========
export const partnerTypeSection = {
  title: '我们在寻找怎样的渠道伙伴',
  subtitle: '只要你有客户资源和服务意愿，就是我们想要的伙伴',
  features: [
    {
      title: '有客户积累的服务商',
      description:
        '拥有区域或行业客户资源，希望引入AI CRM产品完善服务体系，为客户提供从获客到管理的全链路解决方案。',
      icon: UserBusiness,
    },
    {
      title: '有行业深耕的ISV伙伴',
      description:
        '在特定行业已有成熟产品或服务能力，希望与销帮帮开放平台对接，共同打造行业垂直解决方案。',
      icon: LinkCloud,
    },
    {
      title: '想拓展业务的新锐团队',
      description:
        '看好企业数字化赛道，希望以低门槛切入AI CRM市场，借助销帮帮成熟产品快速开展业务、建立客户基础。',
      icon: Rocket,
    },
  ] as readonly FeatureItem[],
}

// ========== 合作收益区域（FeatureList / features） ==========
export const partnerBenefitSection = {
  title: '与销帮帮同行，共享AI CRM市场红利',
  subtitle: '加入销帮帮，你将获得。',
  cards: [
    {
      title: '高回报分成',
      badgeIcon: Income,
      theme: 'purple',
      features: ['行业领先的阶梯分润比例', '每一次客户转化都获得丰厚回报'],
    },
    {
      title: '全周期赋能',
      badgeIcon: BookOpen,
      theme: 'indigo',
      features: ['从产品培训、售前支持到实施交付', '销帮帮团队全程陪跑', '伙伴只需专注客户关系'],
    },
    {
      title: '级别成长',
      badgeIcon: Level,
      theme: 'blue',
      features: ['铜牌起步，银牌进阶，金牌登顶', '业绩达标自动晋升', '级别越高，分润越高'],
    },
  ] satisfies FeatureListItem[],
}

// ========== 选择销帮帮区域（FeatureList / description） ==========
export const whyChooseSection = {
  title: '为什么选择销帮帮',
  subtitle: '不只是卖AI CRM，是交付一套完整的业务数字化能力。',
  cards: [
    {
      title: '产品能打',
      badgeIcon: SalesReport,
      description:
        '从获客到成交，AI CRM 全程驱动。表单、流程、BI 全栈打通，为客户提供从获客到管理的全链路解决方案。',
    },
    {
      title: '开放可扩展',
      badgeIcon: CooperativeHandshake,
      description:
        'OPEN API + 云叩低代码，伙伴可基于销帮帮二次开发，打造行业专属解决方案，交付能力不设天花板。',
    },
    {
      title: '持续迭代',
      badgeIcon: Trend,
      description: '产品高频迭代，紧跟AI CRM趋势，伙伴始终有最新的武器库面对客户。',
    },
  ] satisfies FeatureListItem[],
}

// ========== 入驻流程区域（FlowSteps） ==========
export const onboardingSection = {
  title: '入驻流程',
  steps: [
    { title: '1.合作申请', icon: Checklist },
    { title: '2.资质审核', icon: FileSearch },
    { title: '3.合同签约', icon: Agreement },
    { title: '4.培训赋能', icon: FileEditing },
    { title: '5.合作开启', icon: Certificate },
  ],
}

// ========== 联系我们区域 ==========
export const contactSection = {
  title: '联系我们',
  subtitle: '提交合作意向前，也可以直接联系渠道合作经理。',
  contacts: [
    { name: '郑经理', phone: '15600906840' },
    { name: '郭经理', phone: '15381142230' },
  ],
}

// ========== 合作伙伴信息查询区域 ==========
export const partnerQuerySection = {
  title: '合作伙伴信息查询',
  placeholder: '请输入企业名称（全称）',
}
