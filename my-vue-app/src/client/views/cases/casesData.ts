import type { HeroBannerSlide } from '@/client/components/business/HeroBanner.vue'

// ========== 行业案例页面 SEO 配置 ==========

// ========== 行业案例根类目配置 ==========

/** 行业案例根类目 ID（其子类目为各行业分类） */
export const CASE_ROOT_BID = 18

// ========== Hero Banner 数据 ==========

export const caseHeroSlide = {
  key: 'case-hero',
  mediaType: 'image' as const,
  title: '行业案例',
  subtitle: '覆盖30+行业',
  desc: '超过700+上市企业\n都在深度使用销帮帮CRM',
  highlightMode: 'title',
  primaryCta: '',
  secondaryCta: '',
  bg: "url('/images/cases/hero-banner.png') center / cover no-repeat",
  line: 'rgba(91, 82, 255, 0.14)',
  accent: '#5b52cc',
  glow: 'rgba(91, 82, 255, 0.16)',
  orb: 'rgba(65, 147, 255, 0.18)',
} satisfies HeroBannerSlide

// ========== 行业方案轮播数据 ==========

export const industryCaseHeaderSlides = [
  {
    image: '/images/cases/hangye_img-1.jpeg',
    imageAlt: '阳光智维案例配图',
    logo: '/images/cases/hangye_logo-1.png',
    logoAlt: '阳光智维',
    description:
      '阳光新能源开发股份有限公司隶属阳光电源股份有限公司（股票代码300274），专注于新能源开发利用，是具有系统技术创新和品牌影响力的新能源开发投资商与技术服务商...',
    title: '阳光智维科技股份有限公司',
    tags: ['新能源行业', '营销管理', '渠道管理'],
  },
  {
    image: '/images/cases/hangye_img-2.jpg',
    imageAlt: '浙江尼普顿案例配图',
    logo: '/images/cases/hangye_logo-2.jpeg',
    logoAlt: '浙江尼普顿',
    description:
      '浙江尼普顿科技股份有限公司成立于2004年，是一家专注于生命科学领域，集实验室科研仪器和耗材、生物试剂销售及技术服务于一体的的综合服务商；在细分业务领域，经过近20年的深耕细作...',
    title: '浙江尼普顿科技股份有限公司',
    tags: ['医药行业', '进销存管理', '一体化管理'],
  },
  {
    image: '/images/cases/hangye_img-3.jpg',
    imageAlt: '上海平大案例配图',
    logo: '/images/cases/hangye_logo-3.jpg',
    logoAlt: '上海平大',
    description:
      '上海平大建筑工程管理咨询有限公司成立于2011年，于2004年创立“继教网”这个品牌，通过销售“继教网”的软件产品为建筑业企业、工程企业提供专业的软件服务...',
    title: '上海平大建筑工程管理咨询有限公司',
    tags: ['电商行业', 'CRM管理', '数字化管理'],
  },
  {
    image: '/images/cases/hangye_img-4.jpg',
    imageAlt: '外研在线案例配图',
    logo: '/images/cases/hangye_logo-4.png',
    logoAlt: '外研在线',
    description:
      '北京外研在线数字科技有限公司为外研社全资子公司，2009年由外研社联合投资方共同创立，依托外研社的品牌、资源优势及雄厚的科研、教学实力，致力于为语言教学与学习提供全方位...',
    title: '北京外研在线数字科技有限公司',
    tags: ['教育行业', '客户管理', '资产管理'],
  },
  {
    image: '/images/cases/hangye_img-5.jpg',
    imageAlt: '南京京达案例配图',
    logo: '/images/cases/hangye_logo-5.png',
    logoAlt: '南京京达',
    description:
      '南京京达生物技术有限公司是专业从事生物工程中下游技术服务与产品销售的公司，成立于2006年，现有员工近200名。在上海、北京、浙江、山东、湖北、河南、安徽、湖南等地有10多个分部。经营产品主要为生命科学仪器、试剂和耗材等。',
    title: '南京京达生物技术有限公司',
    tags: ['医药行业', '设备管理', '资产管理'],
  },
]
