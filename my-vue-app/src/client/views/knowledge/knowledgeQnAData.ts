import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import type { ArticleSidebarTocItem } from '@/client/components/business/ArticleSidebar.vue'

export type KnowledgeSidebarBanner = {
  title: string
  subtitle: string
  ctaText: string
  image: string
  imageAlt: string
  to: string
  theme: 'teal' | 'violet'
}

export const knowledgeQnASeo = {
  title: '知识问答 - 销帮帮 CRM',
  description: '围绕中小企业 CRM 选型、实施与常见问题的知识问答页面。',
}

export const knowledgeQnABreadcrumb: BreadcrumbItem[] = [
  { label: '首页', to: '/' },
  { label: '关于我们', to: '/gongsijianjie' },
  { label: '新闻动态', to: '/gongsidongtai' },
  { label: '知识问答' },
]

export const knowledgeQnAHeroSlide = {
  key: 'knowledge-qna-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: '知识问答',
  subtitle:
    '为企业提供CRM系统、数字化转型、企业经营管理、销售管理、市场营销、客户服务等方面的专业知识。',
  desc: '',
  primaryCta: '',
  secondaryCta: '',
  bg: 'linear-gradient(90deg, rgba(247, 251, 255, 0.94) 0%, rgba(247, 251, 255, 0.82) 46%, rgba(247, 251, 255, 0.58) 100%)',
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: '知识问答 Hero 背景',
}

export const knowledgeQnASidebarBanners: KnowledgeSidebarBanner[] = [
  {
    title: 'CRM客户管理系统模板',
    subtitle: '客户资料、跟进记录与成交数据集中管理',
    ctaText: '免费安装',
    image: '/images/article-sidebar/crm-template.png',
    imageAlt: 'CRM客户管理系统模板',
    to: '/liuzi',
    theme: 'teal',
  },
  {
    title: '销售管理系统模板',
    subtitle: '销售过程透明可控，团队业绩实时掌握',
    ctaText: '免费安装',
    image: '/images/article-sidebar/sales-template.png',
    imageAlt: '销售管理系统模板',
    to: '/liuzi',
    theme: 'violet',
  },
]

export const knowledgeSceneSolutionItems: ArticleSidebarTocItem[] = [
  { id: 'omni-channel-marketing', title: '全渠道营销', href: '/liuzi' },
  { id: 'opportunity-management', title: 'AI获客', href: '/liuzi' },
  { id: 'lead-management', title: '线索管理', href: '/liuzi' },
  { id: 'sales-funnel', title: '客户管理', href: '/liuzi' },
  { id: 'order-management', title: '商机管理', href: '/liuzi' },
  { id: 'customer-management', title: '订单管理', href: '/liuzi' },
  { id: 'member-management', title: '销售漏斗', href: '/liuzi' },
  { id: 'purchase-management', title: 'AI分析师', href: '/liuzi' },
  { id: 'device-management', title: 'AI陪练', href: '/liuzi' },
  { id: 'work-order-management', title: '工单管理', href: '/liuzi' },
]