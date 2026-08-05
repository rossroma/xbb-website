// ========== 用户心声页面 SEO 配置 ==========
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'

export const voicesPageSeo = {
  title: '用户心声 - 销帮帮 CRM',
  description:
    '汇集来自互联网、制造业、教育等各行业客户的真实评价，了解销帮帮 CRM 如何助力企业实现数字化销售管理。',
}

// ========== 用户心声根类目配置 ==========

/** 用户心声根类目 ID（其子类目为各行业分类） */
export const VOICE_ROOT_BID = 19

// ========== Hero 区域 Banner 配置 ==========

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const voicesBannerSlide = {
  key: 'voices-banner',
  mediaType: 'image' as const,
  eyebrow: '',
  title: '用户心声',
  subtitle: '来自各行业的真实客户评价',
  desc: '',
  primaryCta: '免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '立即咨询',
  secondaryHref: liuziPagePath,
  bg: 'linear-gradient(135deg, #f0f1ff 0%, #e8e9fe 52%, #dce0ff 100%)',
  line: 'rgba(91, 97, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(91, 97, 255, 0.22)',
}
