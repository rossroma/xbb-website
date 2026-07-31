// ========== 新闻动态页面 SEO 配置 ==========

export const newsPageSeo = {
  title: '新闻动态 - 销帮帮 CRM',
  description:
    '销帮帮 CRM 最新动态与行业资讯，涵盖公司动态、行业动态、媒体报道，了解销帮帮最新产品功能与服务。',
}

// ========== Hero 区域 Banner 配置 ==========

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const newsBannerSlide = {
  key: 'news-banner',
  mediaType: 'image' as const,
  eyebrow: '',
  title: '新闻动态',
  subtitle: '了解销帮帮最新资讯与行业动态',
  desc: '',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 52%, #e0e7ff 100%)',
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#7461ff',
  glow: 'rgba(116, 129, 255, 0.18)',
  orb: 'rgba(147, 139, 255, 0.22)',
}

// ========== 分类 Tab 配置 ==========

/** 分类 Tab 项 */
export interface NewsCategoryTab {
  /** Tab 唯一标识 */
  key: string
  /** 显示文本 */
  label: string
  /** 对应栏目英文标识（slug），用于匹配 API 返回的栏目 */
  slug: string
  /** 栏目 ID（从 API 动态获取，初始为 null） */
  bid: number | null
}

/** 默认分类 Tab 列表（bid 从 API 动态获取） */
export const DEFAULT_CATEGORY_TABS: NewsCategoryTab[] = [
  { key: 'all', label: '全部', slug: '', bid: null },
  { key: 'company', label: '公司动态', slug: 'gongsidongtai', bid: null },
  { key: 'industry', label: '行业动态', slug: 'hangyedongtai', bid: null },
  { key: 'media', label: '媒体报道', slug: 'meitibaodao', bid: null },
]
