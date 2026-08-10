// ========== AI 销售助理页面 SEO 配置 ==========
import {
  ChartHistogram,
  CheckOne,
  DataDisplay,
  FileText,
  Filter,
  Monitor,
  Peoples,
  Robot,
  Trend,
} from '@/client/components/ui/remixIcons'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'


// ========== Hero 区域 ==========
export const heroSection = {
  title: '销帮帮AI CRM',
  subtitle: '用AI驱动销售增长',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: liuziPagePath,
  primaryHref: trialPagePath,
  image: blankShowcaseImage,
  imageAlt: 'AI 销售助理产品能力展示占位图',
  bg: 'linear-gradient(135deg, #faf9ff 0%, #eef2ff 50%, #f5f8ff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'ai-sales-assistant-hero',
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
  line: 'rgba(99, 102, 241, 0.16)',
  accent: '#6366f1',
  glow: 'rgba(99, 102, 241, 0.18)',
  orb: 'rgba(124, 92, 255, 0.18)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== AI 以客找客区域（TabShowcase） ==========
export const lookalikeSection = {
  title: 'AI 以客找客',
  tabs: [
    {
      key: 'profile-modeling',
      label: '画像建模分析',
      description: '分析已成交客户的多维特征，生成企业的「黄金客户DNA」。',
      image: blankShowcaseImage,
      imageAlt: '画像建模分析展示占位图',
      badgeIcon: DataDisplay,
    },
    {
      key: 'cross-source-match',
      label: '跨源匹配',
      description: '在工商数据库、招投标平台等渠道中，匹配潜在线索与企业。',
      image: blankShowcaseImage,
      imageAlt: '跨源匹配展示占位图',
      badgeIcon: Filter,
    },
    {
      key: 'priority-touch',
      label: '优先触达',
      description: '按相似度排序，按相似度与价值优先级筛出更值得推进的客户。',
      image: blankShowcaseImage,
      imageAlt: '优先触达展示占位图',
      badgeIcon: Trend,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== AI 销售过程透明化区域（TabShowcase） ==========
export const transparentSection = {
  title: 'AI 销售过程透明化',
  tabs: [
    {
      key: 'five-data-sources',
      label: '五大数据接入',
      description: '电话、微信、企微、会议、CRM 五大销售数据源无缝对接。',
      image: blankShowcaseImage,
      imageAlt: '五大数据接入展示占位图',
      badgeIcon: Monitor,
    },
    {
      key: 'ai-analysis',
      label: 'AI 智能分析',
      description: '自动识别沟通关键节点、客户意向度评分、流失预警、话术质量评估。',
      image: blankShowcaseImage,
      imageAlt: 'AI 智能分析展示占位图',
      badgeIcon: ChartHistogram,
    },
    {
      key: 'traffic-light-board',
      label: '红绿灯看板',
      description: '从“事后汇报”变成“过程可见”，异常指标实时预警，管理决策有据可依。',
      image: blankShowcaseImage,
      imageAlt: '红绿灯看板展示占位图',
      badgeIcon: DataDisplay,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== AI 陪练助手区域（TabShowcase） ==========
export const coachSection = {
  title: 'AI 陪练助手',
  tabs: [
    {
      key: 'real-scenario',
      label: '真实场景模拟',
      description: '基于公司真实产品和客户画像，AI 模拟多种客户类型和异议场景。',
      image: blankShowcaseImage,
      imageAlt: '真实场景模拟展示占位图',
      badgeIcon: Robot,
    },
    {
      key: 'smart-score',
      label: '智能评分反馈',
      description: 'AI 自动评估话术质量、情绪把控、异议处理能力，给出针对性的优化建议。',
      image: blankShowcaseImage,
      imageAlt: '智能评分反馈展示占位图',
      badgeIcon: CheckOne,
    },
    {
      key: 'team-standard',
      label: '团队标准化沉淀',
      description: '将销冠话术提炼为标准化训练模板，快速复制到整个销售团队。',
      image: blankShowcaseImage,
      imageAlt: '团队标准化沉淀展示占位图',
      badgeIcon: FileText,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== AI 分析师区域（TabShowcase） ==========
export const analystSection = {
  title: 'AI 分析师',
  tabs: [
    {
      key: 'customer-layering',
      label: '客户状态实时分层',
      description: '每个客户自动标记：跟进中 / 即将成交 / 潜在商机 / 异常流失风险。',
      image: blankShowcaseImage,
      imageAlt: '客户状态实时分层展示占位图',
      badgeIcon: Peoples,
    },
    {
      key: 'benchmark-board',
      label: '标杆客户看板',
      description: '销售日常工作实时可见、标杆客户红绿灯预警，让一线炮火响彻后方。',
      image: blankShowcaseImage,
      imageAlt: '标杆客户看板展示占位图',
      badgeIcon: Monitor,
    },
    {
      key: 'diagnosis-report',
      label: '智能诊断报告',
      description: '工作群自动推送日报、周报，不用开会、不用追问，一眼看清全局。',
      image: blankShowcaseImage,
      imageAlt: '智能诊断报告展示占位图',
      badgeIcon: FileText,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== AI 重点洞察区域（CTASection） ==========
export const focusSection = {
  title: 'AI 帮你“看”重点',
  description: '随心提问，智能解析全量销售数据。',
  image: blankShowcaseImage,
  imageAlt: 'AI 重点洞察展示占位图',
  ctaText: '立即咨询',
}

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
