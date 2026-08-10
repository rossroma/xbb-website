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
const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'


// ========== Hero 区域 ==========
export const heroSection = {
  title: 'BI 分析',
  subtitle: '让业务数据真正服务经营决策',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: liuziPagePath,
  primaryHref: trialPagePath,
  image: blankShowcaseImage,
  imageAlt: 'BI 分析产品能力展示占位图',
  bg: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 50%, #f5f8ff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'bi-analysis-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  bg: heroSection.bg,
  line: 'rgba(74, 127, 217, 0.16)',
  accent: '#4a7fd9',
  glow: 'rgba(74, 127, 217, 0.18)',
  orb: 'rgba(99, 102, 241, 0.16)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 随身数据区域（CTASection） ==========
export const mobileDataSection = {
  title: '随时随地，数据随身',
  description: 'Web 端 / 手机端完整查看仪表盘，出门在外也能及时掌握业务动态。',
  image: blankShowcaseImage,
  imageAlt: '移动端 BI 仪表盘展示占位图',
  ctaText: '立即咨询',
  ctaHref: liuziPagePath,
}

// ========== 自定义分析看板区域（TabShowcase） ==========
export const dashboardSection = {
  title: '自定义分析看板，千人千面',
  tabs: [
    {
      key: 'custom-dashboard',
      label: '个性化看板配置',
      description: '自定义生成多维业务统计看板，满足不同企业、不同团队的分析需要。',
      image: blankShowcaseImage,
      imageAlt: '个性化看板配置展示占位图',
      badgeIcon: SettingConfig,
    },
    {
      key: 'role-view',
      label: '分角色分析视图',
      description: '让高管看全局，让管理者查过程，让一线看执行。',
      image: blankShowcaseImage,
      imageAlt: '分角色分析视图展示占位图',
      badgeIcon: Peoples,
    },
    {
      key: 'panel-permission',
      label: '权限精细到面板',
      description: '不同角色配置不同仪表盘，一键切换，数据安全又高效。',
      image: blankShowcaseImage,
      imageAlt: '仪表盘权限配置展示占位图',
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
      image: blankShowcaseImage,
      imageAlt: '多维度数据分析展示占位图',
      badgeIcon: DataDisplay,
    },
    {
      key: 'data-drilldown',
      label: '数据钻取穿透',
      description: '从总览到明细，从单图到联动，让问题更快被发现，也更容易被定位。',
      image: blankShowcaseImage,
      imageAlt: '数据钻取穿透展示占位图',
      badgeIcon: Filter,
    },
    {
      key: 'chart-linkage',
      label: '图表实时联动',
      description: '点一个图表其他同步响应，多维度交叉分析，沉浸式洞察。',
      image: blankShowcaseImage,
      imageAlt: '图表实时联动展示占位图',
      badgeIcon: ChartHistogram,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 初始化报表区域（CTASection） ==========
export const reportSection = {
  title: '初始化七大类报表，覆盖增长全链路',
  description: '',
  image: blankShowcaseImage,
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
