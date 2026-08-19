// ========== 客户管理页面 SEO 配置 ==========
import {
  LoopOnce,
  AllApplication,
  History,
  Peoples,
  Protect,
  Filter,
  SettingConfig,
  ChartHistogram,
} from '@/client/components/ui/remixIcons'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import type { ImageCardGridItem } from '@/client/components/business/ImageCardGrid.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')
const customerHeroBg = '/images/customer/customer.png'
const customerLifecycleImage = '/images/customer/product-intro.png'


// ========== Hero 区域 ==========
export const heroSection = {
  title: '客户全生命周期',
  subtitle: '数字化管理',
  description: '支持多维度客户查重，通过自定义字段与标签实现分层分类\n构建360°客户画像，提升私域运营效率，精准把控客户旅程',
  primaryCta: '免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  image: customerLifecycleImage,
  imageAlt: '客户全生命周期管理产品截图',
  bg: `url('${customerHeroBg}') center -160px / 1920px auto no-repeat`,
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'customer-hero',
  mediaType: 'image' as const,
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.description,
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  highlightMode: 'subtitle',
  bg: heroSection.bg,
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== Tab 功能介绍区域 ==========
export const tabFeaturesSection = {
  title: '精细化运营，让增长可复制',
  tabs: [
    {
      key: 'unified',
      label: '全部客户统一管理',
      description:
        '支持自定义客户表单、批量导入导出、一键移交与分配。客户资料、归属人、跟进状态和业务动作集中在一个页面管理，减少信息分散和重复操作。',
      image: '/images/customer/tab-unified-new.png',
      imageAlt: '全部客户统一管理功能截图',
      badgeIcon: AllApplication,
    },
    {
      key: 'tracking',
      label: '跟进客户过程可追踪',
      description:
        '以时间线方式记录每一次客户沟通，自动标记最后跟进时间，并支持流失预警。销售主管可以快速判断客户是否被及时跟进，销售人员也能清楚掌握下一步动作。',
      image: '/images/customer/tab-tracking-new.png',
      imageAlt: '跟进客户过程可追踪功能截图',
      badgeIcon: History,
    },
    {
      key: 'retention',
      label: '成交客户持续经营',
      description:
        '集中管理签约客户，支持续约提醒、增购机会识别和成交后跟进。帮助团队从"只关注成交"转向"持续深耕客户价值"。',
      image: '/images/customer/tab-retention-new.png',
      imageAlt: '成交客户持续经营功能截图',
      badgeIcon: LoopOnce,
    },
    {
      key: 'collaboration',
      label: '重点客户协同推进',
      description:
        '支持一键标记重点客户、多人共享协作和权限控制。关键客户的跟进记录、协作动作和责任人清晰可见，避免大客户信息只掌握在个人手里。',
      image: '/images/customer/tab-collaboration-new.png',
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
      image: '/images/customer/dedup-collision-new.png',
      imageAlt: '客户查重示意图',
      badgeIcon: Protect,
    },
    {
      key: 'prevent',
      label: '源头防重，减少脏数据沉淀',
      description:
        '全场场景接入客户时自动校验手机号、邮箱、公司名称等关键信息，把重复数据拦在进入系统之前。',
      image: '/images/customer/dedup-prevent-new.png',
      imageAlt: '客户查重示意图',
      badgeIcon: Filter,
    },
    {
      key: 'flexible',
      label: '规则灵活，适配不同业务',
      description:
        '支持按业务线、客户模板或全局范围设置判重规则，满足不同团队对"同一个客户"的判断标准。',
      image: '/images/customer/dedup-rules-new.png',
      imageAlt: '客户查重流程示意图',
      badgeIcon: SettingConfig,
    },
    {
      key: 'reliable',
      label: '报表可信，管理决策更准',
      description:
        '减少重复客户后，客户数、跟进率、转化率和成交数据更接近真实，方便主管做分配、复盘和预测。',
      image: '/images/customer/dedup-report-new.png',
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
      title: '自动回收\n避免客户被占用',
      description:
        '自定义回收规则，到期前置提醒，逾期自动回流公海，减少资源闲置',
      image: '/images/customer/public-sea-recycle.png',
      imageAlt: '自动回收产品界面',
    },
    {
      title: '分层公海\n资源更精准',
      description:
        '搭建多层公海，差异化配置权限，让客户进入合适的销售池',
      image: '/images/customer/public-sea-tiered.png',
      imageAlt: '分层公海产品界面',
    },
    {
      title: '智能分配\n提升资源响应速度',
      description:
        '客户入公海后自动派单，销售在权限内主动领取，减少人工派单成本',
      image: '/images/customer/public-sea-assign.png',
      imageAlt: '智能分配产品界面',
    },
    {
      title: '限制囤积\n保障公平流转',
      description:
        '通过客户持有上限、领取频率限制等规则，避免销售囤客不维护',
      image: '/images/customer/public-sea-limit.png',
      imageAlt: '限制囤积产品界面',
    },
  ] as readonly ImageCardGridItem[],
  columns: 4 as const,
}
