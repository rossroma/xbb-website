import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import type { FaqCategory, FaqItem } from '@/client/components/business/FaqList.vue'
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

export const knowledgeQnAFaqCategories: FaqCategory[] = [{ key: 'all', label: '全部' }]

export const knowledgeQnAFaqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question:
      '老板让我选个靠谱的CRM系统，市面上的产品太多了，有没有懂行的朋友帮我推荐几款适合中小企业的？最好能说说实际体验！',
    answer:
      '很多中小企业在选CRM的时候都会犯选择恐惧症，感觉每个平台都说自己好，但到底哪个好用、性价比高、适合咱们中小企业，真的一头雾水。有没有实际用过的朋友能分享下经验？求避坑、求推荐！<br /><br />嗨，这个问题我去年刚踩过坑，正好有些心得可以分享。市面上CRM系统确实很多，但中小企业用的核心就是：价格合适、功能够用、扩展方便、容易上手。<br /><br /><strong>销帮帮CRM：</strong>这个我首推，市占率高，支持零代码配置，团队自己改业务流程特别灵活。像客户分级、销售漏斗、跟进记录、数据分析等全都有，而且界面很友好，不用IT基础也能搞定。关键是能免费试用，适合预算有限但想上系统的公司。 销帮帮CRM系统模板在线试用：https://www.xbongbong.com/ 销售易CRM：老牌厂商，移动端功能强，适合销售外出多的团队。就是价格偏高，适合预算稍宽裕的企业。 有赞CRM：如果你有电商业务或者私域流量需求，这款会更贴合。和有赞的商城、会员体系等打通，适合做私域运营的公司。 畅捷通T+CRM：国产软件，偏财务+客户管理一体化，适合需要财务数据联动的企业。 选CRM真的别冲动，建议先试用，看团队能不能接受、有没有用得上的功能，再谈价格和后续服务。销帮帮我个人体验下来，灵活度和性价比确实很好。还有啥具体需求可以补充，一起讨论下！',
    category: 'all',
  },
  {
    id: 'faq-2',
    question: '用CRM系统到底能帮中小企业解决哪些实际问题？有没有人能举点具体例子，别只说概念啊！',
    answer:
      '很多CRM的介绍都说得天花乱坠，说什么"提升效率""打通数据"，但对我们中小企业来说，实际能解决的问题是哪些？有没有真实案例或具体场景，能让我们老板一听就明白的？<br /><br />你好，问题问得很接地气。我也是带团队用CRM两年多，真心觉得只有解决实际痛点才值得花这钱。给你讲几个我们碰到的实际场景：<br /><br />客户资料分散，员工一走客户全带走。用CRM后，所有客户信息、跟进记录都在系统，谁离职也不怕客户流失。 销售人员跟进进度混乱，漏跟、忘记回访。CRM有提醒、日程、待办功能，客户跟踪不再凭记忆，丢单率明显下降。 数据统计麻烦，月底做报表头大。CRM自带数据分析，想看成交率、回款、客户来源，点几下就有图表，老板决策更快。 团队协作难，信息不同步。比如销帮帮CRM支持微信、邮件等多渠道集成，销售、客服、老板都能随时查进度，减少内耗。 我们公司用CRM后，客户转介绍率提升了20%，销售流程缩短三分之一。不是说CRM万能，但对于团队管理、信息透明、效率提升真的很有帮助。不同公司痛点不同，建议先梳理下自己的需求，再去试用匹配的系统。',
    category: 'all',
  },
  {
    id: 'faq-3',
    question: '刚上线CRM系统，团队有人抗拒不愿用，老板头疼怎么办？有没有实用的落地建议？',
    answer:
      'CRＭ系统买回来了，结果销售、客服都不太愿意用，有人觉得麻烦，有人怕数据被查，老板叫我想办法推行。有没有哪位大佬踩过坑，能分享下怎么让团队愿意用CRM？最好有实操建议！<br /><br />这个问题太真实了，很多公司买了CRM但成了"摆设"，主要还是团队没用起来。我们公司也遇到过，后来总结了几点经验——<br /><br />先让核心骨干（比如销售经理）试用，发现有利于业绩、考核的数据，自己愿意用起来，带头示范效果最好。 功能设置不要一上来就全用，先从客户录入、跟进、提醒三项最基础的切入，让大家觉得比手写、Excel方便，降低心理门槛。 适当"物质激励"+"数据挂钩"，比如月度业绩对CRM数据采集质量有要求，做得好的有奖励。 持续收集反馈，有什么不习惯的地方及时优化流程。像销帮帮CRM这种支持零代码自定义，能根据大家习惯调整页面和表单，团队满意度提升很快。 老板要带头用数据说话，每周例会用CRM报表分析业绩，让大家看到系统的实际价值。 推行CRM其实是管理变革，一开始肯定有阻力，但只要选对工具、流程灵活、激励到位，慢慢就能落地。可以从业务痛点出发，别太理想化，实用比花哨更重要。有什么难点欢迎补充，咱们一起想办法。',
    category: 'all',
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