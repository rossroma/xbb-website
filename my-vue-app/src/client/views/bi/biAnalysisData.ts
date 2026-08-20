// ========== BI 分析页面 SEO 配置 ==========
import {
  ChartHistogram,
  DataDisplay,
  Filter,
  Peoples,
  Protect,
  SettingConfig,
} from '@/client/components/ui/remixIcons'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const report = '/images/BI/report.png'
const trialPagePath = toPagePath('single_mfsy')
const biImageBase = '/images/BI'

// ========== Hero 区域 ==========
export const heroSection = {
  title: 'BI 分析',
  subtitle: '数据洞察',
  desc: '多端随时随地查看仪表盘，自定义看板千人千面，数据钻取穿透\n从总览到明细，图表实时联动，预置报表覆盖增长全链路',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  primaryHref: trialPagePath,
  image: blankShowcaseImage,
  imageAlt: 'BI 分析产品能力展示占位图',
  bg: "url('/images/BI/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'bi-analysis-hero',
  mediaType: 'image',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.desc,
  highlightMode: 'title',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  bg: heroSection.bg,
  line: 'rgba(74, 127, 217, 0.16)',
  accent: '#4a7fd9',
  glow: 'rgba(74, 127, 217, 0.18)',
  orb: 'rgba(99, 102, 241, 0.16)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 随身数据区域（CTASection） ==========
export const mobileDataSection = {
  title: '随时随地，数据随身',
  description: 'Web 端 / 手机端完整查看仪表盘，出门在外也能及时掌握业务动态',
  image: `${biImageBase}/data-anywhere.png`,
  imageAlt: '随时随地查看 BI 数据仪表盘',
  ctaText: '立即咨询',
  ctaHref: trialPagePath,
}

// ========== 自定义分析看板区域（TabShowcase） ==========
export const dashboardSection = {
  title: '自定义分析看板，千人千面',
  tabs: [
    {
      key: 'custom-dashboard',
      label: '个性化看板配置',
      description: '自定义生成多维业务统计看板，满足不同企业、不同团队的分析需要。',
      image: `${biImageBase}/personalized-dashboard.png`,
      imageAlt: '个性化看板配置展示',
      badgeIcon: SettingConfig,
    },
    {
      key: 'role-view',
      label: '分角色分析视图',
      description: '让高管看全局，让管理者查过程，让一线看执行。',
      image: `${biImageBase}/role-based-analysis-view.png`,
      imageAlt: '分角色分析视图展示',
      badgeIcon: Peoples,
    },
    {
      key: 'panel-permission',
      label: '权限精细到面板',
      description: '不同角色配置不同仪表盘，一键切换，数据安全又高效。',
      image: `${biImageBase}/panel-level-permissions.png`,
      imageAlt: '权限精细到面板展示',
      badgeIcon: Protect,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 数据洞察区域（TabShowcase） ==========
export const dataInsightSection = {
  title: '多维度数据穿透，洞察无死角',
  tabs: [
    {
      key: 'multi-dimensional-analysis',
      label: '多维度数据分析',
      description: '围绕时间、区域、部门、客户、产品等维度，帮助企业从结果继续追溯原因。',
      image: `${biImageBase}/multi-dimensional-analysis.png`,
      imageAlt: '多维度数据分析展示',
      badgeIcon: DataDisplay,
    },
    {
      key: 'data-drilldown',
      label: '数据钻取穿透',
      description: '从总览到明细，从单图到联动，让问题更快被发现，也更容易被定位。',
      image: `${biImageBase}/data-drilldown.png`,
      imageAlt: '数据钻取穿透展示',
      badgeIcon: Filter,
    },
    {
      key: 'chart-linkage',
      label: '图表实时联动',
      description: '点一个图表其他同步响应，多维度交叉分析，沉浸式洞察。',
      image: `${biImageBase}/chart-linkage.png`,
      imageAlt: '图表实时联动展示',
      badgeIcon: ChartHistogram,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 初始化报表区域（CTASection） ==========
export const reportSection = {
  title: '初始化七大类报表，覆盖增长全链路',
  description: '',
  image: report,
  imageAlt: '初始化七大类报表展示占位图',
  ctaText: '立即体验',
}

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
