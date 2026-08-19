// ========== 新闻动态页面 SEO 配置 ==========
import { toPagePath } from '@/client/data/routePaths'

const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 Banner 配置 ==========

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const newsBannerSlide = {
  key: 'news-banner',
  mediaType: 'image' as const,
  title: '新闻动态',
  subtitle: '',
  desc: '汇聚产品更新、行业趋势与客户案例，第一时间掌握销帮帮最新动态',
  primaryCta: '免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  bg: "url('/images/news/hero-banner.png') center / cover no-repeat",
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

/** 新闻动态父栏目 ID（bid=8，其下子类目为 11/12/13） */
export const NEWS_PARENT_BID = 8

/** 新闻动态子类目 ID 列表（公司动态 11、行业动态 12、媒体报道 13） */
export const NEWS_CHILD_BIDS = [11, 12, 13]

/** 默认分类 Tab 列表（bid 已确认，无需动态获取） */
export const DEFAULT_CATEGORY_TABS: NewsCategoryTab[] = [
  { key: 'all', label: '全部', slug: '', bid: null },
  { key: 'company', label: '公司动态', slug: 'gongsidongtai', bid: 11 },
  { key: 'industry', label: '行业动态', slug: 'hangyedongtai', bid: 12 },
  { key: 'media', label: '媒体报道', slug: 'meitibaodao', bid: 13 },
]
