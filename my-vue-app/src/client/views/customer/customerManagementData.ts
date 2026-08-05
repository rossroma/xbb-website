// ========== 客户管理页面 SEO 配置 ==========
import {
  LoopOnce,
  CategoryManagement,
  SendOne,
  Forbid,
  AllApplication,
  History,
  Peoples,
  Protect,
  Filter,
  SettingConfig,
  ChartHistogram,
} from '@icon-park/vue-next'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import type { FeatureItem, TopImage } from '@/client/components/business/IconCardGrid.vue'
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'


// ========== Hero 区域 ==========
export const heroSection = {
  title: '客户管理',
  subtitle: '客户全生命周期数字化管理',
  primaryCta: '免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '立即咨询',
  secondaryHref: liuziPagePath,
  image: '/images/customer/hero.png',
  imageAlt: '客户管理产品展示',
  bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'customer-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  bg: heroSection.bg,
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
}

// ========== 产品介绍区域 ==========
export const productIntroSection = {
  title: '客户全生命周期管理',
  description:
    '支持客户多维度查重，有效通过预设自定义字段及标签实现客户分层分类，构建企业潜在客户360°画像，提升企业私域客户池运作效率，实现对于客户旅程的精准把控。',
  image: '/images/customer/product-intro.png',
  imageAlt: 'CRM产品截图',
  ctaText: '立即咨询',
  ctaHref: liuziPagePath,
}

// ========== Tab 功能介绍区域 ==========
export const tabFeaturesSection = {
  title: '精细化运营，让增长可复制',
  tabs: [
    {
      key: 'unified',
      label: '全部客户统一管理',
      description:
        '支持自定义客户表单、批量导入导出、一键移交与分配。客户资料、归属人、跟进状态和业务动作集中在一个页面管理，减少信息分散和重复操作。',
      image: '/images/customer/tab-unified.png',
      imageAlt: '全部客户统一管理功能截图',
      badgeIcon: AllApplication,
    },
    {
      key: 'tracking',
      label: '跟进客户过程可追踪',
      description:
        '以时间线方式记录每一次客户沟通，自动标记最后跟进时间，并支持流失预警。销售主管可以快速判断客户是否被及时跟进，销售人员也能清楚掌握下一步动作。',
      image: '/images/customer/tab-tracking.png',
      imageAlt: '跟进客户过程可追踪功能截图',
      badgeIcon: History,
    },
    {
      key: 'retention',
      label: '成交客户持续经营',
      description:
        '集中管理签约客户，支持续约提醒、增购机会识别和成交后跟进。帮助团队从"只关注成交"转向"持续深耕客户价值"。',
      image: '/images/customer/tab-retention.png',
      imageAlt: '成交客户持续经营功能截图',
      badgeIcon: LoopOnce,
    },
    {
      key: 'collaboration',
      label: '重点客户协同推进',
      description:
        '支持一键标记重点客户、多人共享协作和权限控制。关键客户的跟进记录、协作动作和责任人清晰可见，避免大客户信息只掌握在个人手里。',
      image: '/images/customer/tab-collaboration.png',
      imageAlt: '重点客户协同推进功能截图',
      badgeIcon: Peoples,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 客户查重区域（Tab 展示） ==========
export const dedupTabsSection = {
  title: '数据干净，销售决策才可靠',
  tabs: [
    {
      key: 'collision',
      label: '避免撞单，客户归属更清楚',
      description: '线索、客户、联系人自动交叉校验，识别同一客户的不同记录，避免多个销售重复跟进。',
      image: '/images/customer/dedup-1.png',
      imageAlt: '客户查重示意图',
      badgeIcon: Protect,
    },
    {
      key: 'prevent',
      label: '源头防重，减少脏数据沉淀',
      description:
        '全场场景接入客户时自动校验手机号、邮箱、公司名称等关键信息，把重复数据拦在进入系统之前。',
      image: '/images/customer/dedup-1.png',
      imageAlt: '客户查重示意图',
      badgeIcon: Filter,
    },
    {
      key: 'flexible',
      label: '规则灵活，适配不同业务',
      description:
        '支持按业务线、客户模板或全局范围设置判重规则，满足不同团队对"同一个客户"的判断标准。',
      image: '/images/customer/dedup-2.png',
      imageAlt: '客户查重流程示意图',
      badgeIcon: SettingConfig,
    },
    {
      key: 'reliable',
      label: '报表可信，管理决策更准',
      description:
        '减少重复客户后，客户数、跟进率、转化率和成交数据更接近真实，方便主管做分配、复盘和预测。',
      image: '/images/customer/dedup-2.png',
      imageAlt: '客户查重流程示意图',
      badgeIcon: ChartHistogram,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 公海管理区域 ==========
export const publicSeaSection = {
  title: '资源不沉底，流转出效率',
  features: [
    {
      title: '自动回收，避免客户被长期占用',
      description:
        '可按无跟进、无签合同、无新建机会等各类条件设置退回规则。客户到期前自动提醒销售处理，逾期后回收到公海，减少资源闲置。',
      icon: LoopOnce,
    },
    {
      title: '分层公海，资源投放更精准',
      description:
        '支持按区域、行业、团队、客户等级等维度建立多层级公海，并配置不同查看和领取权限，让不同类型客户进入合适的销售池。',
      icon: CategoryManagement,
    },
    {
      title: '智能分配，提升资源响应速度',
      description:
        '客户进入公海后，可按规则自动分配给销售，也支持销售在权限范围内主动领取，减少人工派单成本，提高跟进效率。',
      icon: SendOne,
    },
    {
      title: '限制囤积，保障公平流转',
      description:
        '通过客户持有上限、领取频率限制等规则，避免销售大量占用客户却不及时跟进，让优质资源真正被有效利用。',
      icon: Forbid,
    },
  ] as readonly FeatureItem[],
  columns: 2 as const,
}

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
