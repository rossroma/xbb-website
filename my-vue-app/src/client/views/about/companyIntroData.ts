// ========== 公司介绍页面 SEO 配置 ==========
import { BookOpen, ChartHistogram, Rocket } from '@icon-park/vue-next'
import {
  ecosystemAbility1,
  ecosystemAbility2,
  ecosystemAbility3,
  ecosystemAbility1688,
  heroBrandVideo,
  industryCards,
} from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 ==========
export const heroSection = {
  title: '懂客户，更懂增长',
  subtitle: '销帮帮，国内一线AI CRM品牌——以专业、易用、安全的产品力，为企业搭建可持续增长销售体系',
  primaryCta: '免费使用',
  image: '',
  imageAlt: '',
  bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f8f5ff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'company-intro-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: trialPagePath,
  bg: heroSection.bg,
  line: 'rgba(91, 97, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
}

// ========== 关于销帮帮区域 ==========
export const aboutSection = {
  title: '关于销帮帮',
  video: heroBrandVideo,
  paragraphs: [
    '杭州逍邦网络科技有限公司成立于2015年，是国内一线CRM品牌和企服领域知名品牌。',
    '致力为客户提供专业的客户全生命周期管理和数字化销售管理服务，助力企业提升业绩，让企业更成功。',
    '销帮帮拥有强大而灵活的“PaaS+低代码”能力。',
    '支持大中型企业个性化业务定制，实现敏捷交付，随时响应市场与业务的变化。',
    '销帮帮积极探索AI在企业端的落地，是国内最早成功实现AI转型的SaaS服务商。',
    '其推出的销帮帮 AI CRM 已经深度服务了数百家付费客户，积累了大量销售团队AI转型的成功经验。',
  ],
  metrics: [
    { label: '服务客户数', value: '40万+' },
    { label: '服务上市公司', value: '700+' },
    { label: '付费客户五星好评', value: '1万+' },
    { label: '覆盖行业', value: '30+' },
  ],
}

// ========== 发展历程区域（Timeline） ==========
export const timelineSection = {
  title: '发展历程',
  subtitle: '从SaaS到PaaS，从多生态到AI CRM，销帮帮持续围绕企业增长场景进化。',
  milestones: [
    {
      year: '2015',
      title: 'SaaS时代开启',
      description: ['逍邦网络公司成立，销帮帮1.0/2.0上线。'],
    },
    {
      year: '2016',
      title: '生态合作起步',
      description: ['入驻阿里钉钉应用市场，成为钉钉战略级合作伙伴，并获得天使轮融资。'],
    },
    {
      year: '2017',
      title: '呼叫能力上线',
      description: ['呼叫中心上线，销售沟通与客户跟进能力进一步完善。'],
    },
    {
      year: '2018',
      title: '业务系统扩展',
      description: ['进销存上线，工单系统上线。'],
    },
    {
      year: '2019',
      title: 'PaaS能力发布',
      description: ['销帮帮pro版发布，PaaS平台1.0上线，获金沙江创投的A轮融资。'],
    },
    {
      year: '2020',
      title: '低代码平台诞生',
      description: ['销帮帮旗舰版发布，云叩低代码平台诞生。'],
    },
    {
      year: '2021',
      title: '多生态时代',
      description: ['入驻企业微信、飞书应用市场，获同创伟业领投的B轮融资。'],
    },
    {
      year: '2022',
      title: 'SCRM发布',
      description: ['销帮帮SCRM发布，进一步增强私域客户运营能力。'],
    },
    {
      year: '2023',
      title: '服务协同升级',
      description: ['新一代工单发布。'],
    },
    {
      year: '2024',
      title: '平台能力完善',
      description: ['数据集成平台、UI界面搭建平台发布。'],
    },
    {
      year: '2025',
      title: 'AI时代',
      description: ['销帮帮AI CRM发布，并入驻1688平台。'],
    },
  ],
}

// ========== 技术驱动区域（MetricsPanel） ==========
export const technologySection = {
  title: '技术驱动',
  subtitle: '研发投入、团队能力与自主知识产权，是销帮帮持续迭代产品力的基础。',
  metrics: [
    {
      value: '120',
      unit: '+',
      label: '研发团队规模',
      description:
        '杭州滨江、城西两大研发中心，50%以上来自一线互联网企业，博士及硕士研究生20余名。',
    },
    {
      value: '40',
      unit: '%',
      label: '研发人员占比',
      description: '300+员工中研发人员超过40%，技术基因深入公司骨髓，产品力就是竞争力。',
    },
    {
      value: '39',
      unit: '项',
      label: '自主知识产权',
      description: '6项专利 + 33项软件著作权，持续投入技术创新，用知识产权构建护城河。',
    },
  ],
}

// ========== 权威认可区域 ==========
export const recognitionSection = {
  title: '权威认可，持续加码',
  items: [
    '浙江省专精特新中小企业',
    '2021信息技术优秀产品',
    '杭州市科技型初创企业培育工程企业',
    '质量管理体系认证证书（ISO9001）',
    '优秀雏鹰企业',
    '信息安全管理体系认证证书（ISO27001）',
    '隐私信息管理体系认证证书（ISO27701）',
    '2022年度瞪羚企业',
    'CMMI Maturity Level 3',
    '2023年杭州市准独角兽企业',
    '浙江省科技型中小企业',
    '高新技术企业',
    '省级高新技术企业研究开发中心',
    '软件产品证书（T/SIA003 2019）',
    '杭州市企业高新技术研发中心（工业类）',
  ],
}

// ========== 主流平台生态区域（PartnerGrid） ==========
export const ecosystemSection = {
  heading: '主流平台，深度生态融合',
  items: [
    {
      title: '钉钉',
      desc: '2016年入驻 · 战略级合作伙伴',
      icon: ecosystemAbility1,
    },
    {
      title: '企业微信',
      desc: '2021年入驻 · SCRM深度集成',
      icon: ecosystemAbility2,
    },
    {
      title: '飞书',
      desc: '2021年入驻 · 协同办公连接',
      icon: ecosystemAbility3,
    },
    {
      title: '1688',
      desc: '2025年入驻 · 高效询盘转化',
      icon: ecosystemAbility1688,
      logoHeight: 'h-[70px]',
    },
  ],
}

// ========== 上市企业客户区域（IndustryCarousel） ==========
export const listedCompanySection = {
  heading: '截至目前，已有700+上市企业选择使用销帮帮',
  cards: industryCards,
}

// ========== 成功支持区域 ==========
export const successSupportSection = {
  title: '销帮帮AI CRM让企业更成功',
  subtitle: '联系我们，专属顾问将为您提供全力支持',
  points: [
    { title: '分享先进工作方式', icon: BookOpen },
    { title: '输送行业最佳实践', icon: Rocket },
    { title: '全面助力业绩增长', icon: ChartHistogram },
  ],
}

// ========== 底部转化区域 ==========
export const footerCtaSection = {
  title: '联系我们',
  subtitle: '下载销帮帮AI CRM',
  primaryCta: '联系我们',
  primaryHref: '/liuzi',
  secondaryCta: '下载销帮帮AI CRM',
  secondaryHref: '/xiazaizhongxin',
}

// ====================================================================
// Ads 数据适配器 — 将后台广告数据映射为组件 props
// ====================================================================

import type { Ads } from '@/shared/api/ads'

/**
 * 将 Ads 广告数据转换为权威认可资质列表
 * API 数据为空时自动回退到硬编码的 recognitionSection.items
 */
export function adsToRecognitionItems(ads: Ads[]): string[] {
  if (!ads?.length) return recognitionSection.items
  return ads
    .slice()
    .sort((a, b) => a.ord - b.ord)
    .map((ad) => ad.title)
}
