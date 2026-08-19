// ========== 用户心声页面 SEO 配置 ==========
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')

// ========== 用户心声根类目配置 ==========

/** 用户心声根类目 ID（其子类目为各行业分类） */
export const VOICE_ROOT_BID = 19

// ========== Hero 区域 Banner 配置 ==========

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const voicesBannerSlide = {
  key: 'voices-banner',
  mediaType: 'image' as const,
  title: '用户心声',
  subtitle: '',
  desc: '来自各行业的真实客户评价',
  highlightMode: 'title',
  highlightUnderline: true,
  primaryCta: '免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  bg: "url('/images/voices/hero-banner.png') center / cover no-repeat",
  line: 'rgba(91, 97, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(91, 97, 255, 0.22)',
}
