import type { PromoBannerSlide } from '@/client/components/business/PromoBannerCarousel.vue'

// ========== 行业案例页面 SEO 配置 ==========

export const casesPageSeo = {
  title: '行业案例 - 销帮帮 CRM',
  description:
    '汇集制造业、互联网、教育、金融、零售、建材、服务等各行业客户的成功案例，了解销帮帮 CRM 如何助力企业实现数字化销售管理与业绩增长。',
}

// ========== 行业案例根类目配置 ==========

/** 行业案例根类目 ID（其子类目为各行业分类） */
export const CASE_ROOT_BID = 18

// ========== Banner 轮播数据 ==========

export const casePromoSlides: PromoBannerSlide[] = [
  {
    key: 'case-manufacturing',
    eyebrow: '制造业',
    title: '数字化转型，从客户管理开始',
    ctaText: '了解详情',
    image: '/images/customer/tab-unified.png',
    imageAlt: '制造业案例',
  },
  {
    key: 'case-internet',
    eyebrow: '互联网',
    title: '高速增长，需要高效管理',
    ctaText: '了解详情',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '互联网案例',
  },
  {
    key: 'case-finance',
    eyebrow: '金融',
    title: '合规与增长并行',
    ctaText: '了解详情',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '金融案例',
  },
]
