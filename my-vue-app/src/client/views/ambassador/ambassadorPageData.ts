// ========== 推广大使页面 SEO 配置 ==========
import { Audit, Edit, Gift, ShoppingCart } from '@/client/components/ui/remixIcons'
import type { BannerSlide } from '@/client/data/homeData'
import type { FaqCategory, FaqItem } from '@/client/components/business/FaqList.vue'



// ========== Hero 区域 ==========
export const heroSection = {
  title: '"荐"者有礼',
  subtitle: '',
  description:
    '邀请好友成为销帮帮客户\n成功签约即享高额现金返佣，轻松赚取引荐奖金',
  primaryCta: '立即联系客服',
  secondaryCta: '了解推荐流程',
  image: '',
  imageAlt: '销帮帮推广大使计划展示',
}

export const heroBannerSlide = {
  key: 'ambassador-hero',
  mediaType: 'image',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.description,
  primaryCta: '',
  secondaryCta: '',
  bg: "url('/images/ambassador/hero-banner.png') center / cover no-repeat",
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 联系方式区域 ==========
export const contactSection = {
  title: '立即联系客服，申请成为推荐大使',
  subtitle: '客服热线：4000-464-288',
}

export const contactHotlineSection = {
  title: contactSection.title,
  label: '客服热线',
  description: '推荐大使咨询',
  phone: '4000-464-288',
  theme: 'brand' as const,
}

// ========== 推荐流程区域 ==========
export const referralProcessSection = {
  title: '推荐流程',
  rewardImage: '/images/ambassador/reward-rate.png',
  rewardImageAlt: '推荐成功后我能获得多少奖励',
  steps: [
    {
      title: '申请推荐',
      description: '扫码填写信息，提交即申请成功',
      icon: Edit,
    },
    {
      title: '通过审核',
      description: '通过审核，审核周期为1-3个工作日',
      icon: Audit,
    },
    {
      title: '下单购买',
      description: '被推荐者成功下单',
      icon: ShoppingCart,
    },
    {
      title: '获得奖金',
      description: '引荐成功，大使获得现金奖励',
      icon: Gift,
    },
  ],
}

// ========== 常见问题区域 ==========
export const faqCategories: FaqCategory[] = [{ key: 'all', label: '全部' }]

export const faqItems: FaqItem[] = [
  {
    id: 'who-can-join',
    question: '谁可以成为推荐大使？',
    answer:
      '无论您是企业管理者、行业顾问、自由职业者，还是销帮帮的老用户，只要有推广资源，均可申请。',
    category: 'all',
  },
  {
    id: 'commission-time',
    question: '推荐成功后多久能收到返佣？',
    answer: '被推荐客户签约并完成付款后，佣金将在次月结算发放。',
    category: 'all',
  },
]

// ========== 底部转化区域 ==========
export const finalCtaSection = {
  title: '立即加入，推荐即赚钱',
  subtitle: '扫码成为销帮帮推荐大使',
  primaryCta: '立即联系客服',
  secondaryCta: '拨打 4000-464-288',
}
