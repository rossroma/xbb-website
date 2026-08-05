// ========== 推广大使页面 SEO 配置 ==========
import { Audit, Edit, Gift, ShoppingCart } from '@icon-park/vue-next'
import type { BannerSlide } from '@/client/data/homeData'
import type { FaqCategory, FaqItem } from '@/client/components/business/FaqList.vue'

const heroVisualImage = '/images/customer/hero.png'

export const ambassadorSeo = {
  title: '推广大使 - 销帮帮AI CRM',
  description:
    '成为销帮帮推荐大使，推荐客户成功签约即可获得现金返佣。了解申请推荐、审核、下单购买与获得奖金的完整流程。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '"荐"者有份，诚邀您成为销帮帮推荐大使',
  subtitle: '您的每一次推荐，都值得被回报',
  description:
    '邀请具备推广能力的你，成为销帮帮推荐大使\n推荐客户成功签约即享高比例现金返佣。快加入我们轻松赚取引荐奖金吧',
  primaryCta: '立即联系客服',
  secondaryCta: '了解推荐流程',
  image: heroVisualImage,
  imageAlt: '销帮帮推广大使计划展示',
}

export const heroBannerSlide = {
  key: 'ambassador-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.description,
  primaryCta: '',
  secondaryCta: '',
  bg: 'linear-gradient(135deg, #fff7ed 0%, #fff1e6 48%, #f8f4ff 100%)',
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 联系方式区域 ==========
export const contactSection = {
  title: '立即联系客服，申请成为推荐大使',
  subtitle: '客服热线：4000-464-288',
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
