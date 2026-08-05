import {
  Trend,
  Branch,
  Robot,
  People,
  Fire,
  SettingConfig,
  SettingComputer,
  Info,
  Help,
  FileSettings,
} from '@icon-park/vue-next'

// ========== 图片 paths ==========
const serviceSystemConsultant = '/images/consultant.png'
const serviceSystemHours = '/images/service-hours.png'
const solutionCardImprove = '/images/2-1.png'
const solutionCardProcess = '/images/2-2.png'
const solutionCardAiDriven = '/images/2-3.png'
const solutionCardOrganization = '/images/2-4.png'
const custChoiseImg = '/images/cust-choise.png'
const heroBanner2 = '/images/banner2.png'
const heroBanner3 = '/images/banner3.png'

// ========== 图标别名 ==========
const BurnlifeNotimeOutlined = Fire
const PaCustomRoleOutlined = SettingConfig
const TechnicalSupportOutlined = SettingComputer
const InfoCcmOutlined = Info
const HelpdeskOutlined = Help
const PaCompensationProfileOutlined = FileSettings

// ========== 公共资源 ==========
export const ecosystemAbility1 = '/ecosystem/ability-1.svg'
export const ecosystemAbility2 = '/ecosystem/ability-2.svg'
export const ecosystemAbility3 = '/ecosystem/ability-3.svg'
export const ecosystemAbility1688 = '/ecosystem/1688.png'
export const heroBrandVideo =
  'https://xbongbong.oss-cn-hangzhou.aliyuncs.com/market/%E4%BC%81%E4%B8%9A%E5%AE%A3%E4%BC%A0%E7%89%87%E8%8A%82%E9%80%89.mp4'
export { custChoiseImg }

// ========== 类型定义 ==========
interface HeroVisualBadge {
  label: string
  value: string
  slot: 'top' | 'middle' | 'bottom'
  tone?: 'violet' | 'sky' | 'amber'
}

interface HeroVisualBridge {
  title: string
  slot: 'top' | 'middle' | 'bottom'
  kicker?: string
  value?: string
  caption?: string
  variant?: 'metric' | 'timeline' | 'steps' | 'flow' | 'arrow' | 'toast'
  steps?: string[]
}

export interface BannerSlide {
  key: string
  /** 轮播顺序（来自 Ads 数据），用于 CTA 路由映射 */
  ord?: number
  mediaType: 'video' | 'image'
  eyebrow: string
  title: string
  subtitle?: string
  desc: string
  primaryCta: string
  primaryHref?: string
  primaryTarget?: '_self' | '_blank'
  secondaryCta?: string
  secondaryHref?: string
  secondaryTarget?: '_self' | '_blank'
  buttonStyle?: string
  secondaryButtonStyle?: string
  bg: string
  line: string
  accent: string
  glow: string
  orb: string
  visualTheme?: 'interaction' | 'proof' | 'trial'
  showVisual?: boolean
  visualImage?: string
  visualImageAlt?: string
  visualBadges?: HeroVisualBadge[]
  visualBridge?: HeroVisualBridge[]
}

// ========== 工具函数 ==========
const makeLogos = (group: number, names: string[]) =>
  names.map((name, index) => ({
    name,
    src: `/images/logos/${group}-${index + 1}.png`,
  }))

// ========== Banner 轮播数据 ==========
export const bannerSlides: BannerSlide[] = [
  {
    key: 'hero-video',
    mediaType: 'video',
    eyebrow: '销帮帮 AI CRM',
    title: '懂客户，更懂增长',
    desc: '专注于客户数字化\n让增长不再是靠感觉，而是靠系统',
    primaryCta: '了解更多',
    secondaryCta: '预约产品演示',
    secondaryHref: '/liuzi',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
    line: 'rgba(116, 129, 255, 0.16)',
    accent: '#5b61ff',
    glow: 'rgba(91, 97, 255, 0.18)',
    orb: 'rgba(127, 214, 255, 0.22)',
    visualImage: '',
    visualImageAlt: '',
  },
  {
    key: 'hero-interaction',
    mediaType: 'image',
    eyebrow: 'AI 驱动的新一代智能 CRM',
    title: '让每一次客户互动\n都转化为增长',
    desc: '从获客到成交复购，AI 帮你看准每一个商机，不浪费任何一个潜在机会。',
    primaryCta: '了解更多',
    buttonStyle: 'hero-button--violet',
    secondaryButtonStyle: 'hero-button--ghost-indigo',
    bg: `url(${heroBanner2}) center / cover no-repeat`,
    line: 'rgba(94, 105, 255, 0.16)',
    accent: '#6670ff',
    glow: 'rgba(123, 134, 242, 0.18)',
    orb: 'rgba(131, 214, 255, 0.18)',
    visualTheme: 'interaction',
    showVisual: false,
  },
  {
    key: 'hero-proof',
    mediaType: 'image',
    eyebrow: '40万+企业信赖的选择',
    title: '数据说话\n见证企业增长奇迹',
    desc: '覆盖科技、教育、医疗、建筑等30+行业',
    primaryCta: '查看客户案例',
    secondaryCta: '了解更多行业方案',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    bg: `url(${heroBanner3}) center / cover no-repeat`,
    line: 'rgba(85, 126, 255, 0.16)',
    accent: '#4b74ff',
    glow: 'rgba(75, 116, 255, 0.18)',
    orb: 'rgba(122, 207, 255, 0.18)',
    visualTheme: 'proof',
  },
  {
    key: 'hero-trial',
    mediaType: 'image',
    eyebrow: '新客专享 · 限时体验',
    title: '现在注册',
    subtitle: '立享七天免费试用',
    desc: '0元试用 · 全功能开放 · 预约专属顾问1对1服务',
    primaryCta: '立即免费注册',
    secondaryCta: '预约产品演示',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    bg: 'linear-gradient(135deg, #f9fbff 0%, #f1f6ff 46%, #f7f1ff 100%)',
    line: 'rgba(101, 112, 255, 0.15)',
    accent: '#6b63ff',
    glow: 'rgba(107, 99, 255, 0.16)',
    orb: 'rgba(255, 178, 91, 0.12)',
    visualTheme: 'trial',
  },
]

// ========== 行业案例轮播数据 ==========
export const industryCards = [
  {
    key: 'internet',
    industry: '互联网服务',
    summary: '适合重视线索流转速度、试用转化与客户续费节奏的服务型团队。',
    logos: makeLogos(1, [
      '云桥科技',
      '鲸准互动',
      '星链服务',
      '微脉网络',
      '海纳增长',
      '引擎云服',
      '前线互联',
      '易客在线',
      '拓界数智',
    ]),
  },
  {
    key: 'software',
    industry: '计算机与软件',
    summary: '适配售前、交付、续费与客户成功并行推进的软件与解决方案团队。',
    logos: makeLogos(2, [
      '矩阵软件',
      '数帆系统',
      '同策云科',
      '光维平台',
      '明略智软',
      '智算工坊',
      '联域系统',
      '合象科技',
      '北辰软件',
    ]),
  },
  {
    key: 'manufacturing',
    industry: '知名外企',
    summary: '支持项目型销售、报价推进、客户回访与交付协作的一体化经营。',
    logos: makeLogos(3, [
      '智造精工',
      '远航装备',
      '华卓制造',
      '升维器械',
      '丰铂工业',
      '天擎设备',
      '锐进工贸',
      '荣拓自动化',
      '协立实业',
    ]),
  },
  {
    key: 'media',
    industry: '知名央国企',
    summary: '帮助客户经营与项目交付同步推进，强化续签判断与重点客户维护。',
    logos: makeLogos(4, [
      '灵动传媒',
      '众耀互动',
      '禾象创意',
      '蓝际传播',
      '曜石内容',
      '矩点营销',
      '声量品牌',
      '象限广告',
      '高频传播',
    ]),
  },
  {
    key: 'medical',
    industry: '医药与医疗技术',
    summary: '适用于流程复杂、角色众多、服务标准要求高的专业型业务场景。',
    logos: makeLogos(5, [
      '安序医疗',
      '维新健康',
      '睿研医疗',
      '清禾医技',
      '康域生科',
      '博澜技术',
      '衡康医疗',
      '合源医科',
      '诺景科技',
    ]),
  },
  {
    key: 'others',
    industry: '其他行业',
    summary: '为成长型企业提供可快速迁移、逐步扩展的统一客户经营底座。',
    logos: makeLogos(6, [
      '星海咨询',
      '柏年教育',
      '丰衡服务',
      '信桥商贸',
      '智域文旅',
      '合众物业',
      '易诚供应',
      '开源服务',
      '云泽集团',
    ]),
  },
] as const

// ========== 解决方案卡片数据 ==========
export const solutionCards = [
  {
    title: '销售增长',
    kicker: '增长引擎',
    image: solutionCardImprove,
    icon: Trend,
    points: ['提升线索转化率', '提升销售成交率', '提升客户跟进效率', '缩短成交周期'],
    linkHref: '/features/sales-growth',
  },
  {
    title: '销售管理',
    kicker: '流程可视',
    image: solutionCardProcess,
    icon: Branch,
    points: ['销售过程透明化', '销售行为可量化', '销售动作可追踪', '销售风险可预警'],
    linkHref: '/features/sales-management',
  },
  {
    title: 'AI 业务赋能',
    kicker: 'AI 驱动',
    image: solutionCardAiDriven,
    icon: Robot,
    points: ['AI 自动分析客户', 'AI 辅助销售沟通', 'AI 自动生成话术', 'AI 智能复盘质检'],
    linkHref: '/features/ai-empowerment',
  },
  {
    title: '组织升级',
    kicker: '组织沉淀',
    image: solutionCardOrganization,
    icon: People,
    points: ['销售 SOP 沉淀', '销售经验资产化', '新人成长标准化', 'AI 持续训练组织'],
    linkHref: '/features/org-upgrade',
  },
]

// ========== AI 助理卡片数据 ==========
export const assistantCards = [
  {
    title: 'AI 拓客',
    description: ['基于成交客户画像', '自动推荐相似客户与触达理由'],
    type: 'prospecting' as const,
    icon: People,
    gradient: 'blue' as const,
    image: '/images/feature-showcase/prospecting.svg',
    imageAlt: 'AI 拓客仪表盘',
  },
  {
    title: 'AI 过程管理',
    description: ['打通线上会议、面议、电话、微信和跟进数据，自动发现每一次跟进风险'],
    type: 'process' as const,
    icon: SettingConfig,
    gradient: 'teal' as const,
    image: '/images/feature-showcase/process.svg',
    imageAlt: '过程管理面板',
    processItems: [
      { label: '超时未跟进', status: '有风险', statusClass: 'process-panel__item--danger' },
      { label: '客户异议未处理', status: '有风险', statusClass: 'process-panel__item--danger' },
      { label: '今日已跟进', status: '正常', statusClass: 'process-panel__item--success' },
    ],
  },
  {
    title: 'AI 陪练',
    description: ['模拟真实客户沟通，生成话术建议', '复制销冠方法'],
    type: 'coach' as const,
    icon: Robot,
    gradient: 'purple' as const,
    image: '/images/feature-showcase/coach.svg',
    imageAlt: 'AI 陪练对话界面',
  },
  {
    title: 'AI 分析师',
    description: ['自动分析客户、机会和业绩数据', '找到增长突破口'],
    type: 'analyst' as const,
    icon: Trend,
    gradient: 'green' as const,
    image: '/images/feature-showcase/analyst.svg',
    imageAlt: '数据分析报告',
    prompts: ['本月会话中，哪些客户可能成交', '帮我整理一份优秀销售话术', '哪些客户存在流失风险'],
  },
]

// ========== 增长指标数据 ==========
export const growthMetrics = [
  { value: '87', label: '人效提升', unit: '%' },
  { value: '35', label: '销售成单率提升', unit: '%' },
  { value: '48', label: '年成本降低率', unit: '%' },
  { value: '68', label: '客户满意度提升', unit: '%' },
]

// ========== 生态能力数据 ==========
export const ecosystemAbilityItems = [
  {
    title: '钉钉',
    desc: '阿里钉钉业财联盟首批成员\nPC/移动高效协同业务流程透明化',
    icon: ecosystemAbility1,
  },
  {
    title: '企业微信',
    desc: '多维度引流获客，帮助企业\n更好地运营客户，搭建私域流量池',
    icon: ecosystemAbility2,
  },
  {
    title: '飞书',
    desc: '先进的团队协同平台理念\n帮助构建健康高效的运营环境',
    icon: ecosystemAbility3,
  },
  {
    title: '1688',
    desc: '批发询盘自动归集\n全域批发客源高效转化',
    icon: ecosystemAbility1688,
    logoHeight: 'h-[70px]',
  },
]

// ========== 服务体系卡片数据 ==========
export const serviceSystemCards = [
  {
    key: 'consultant',
    title: '企业增长顾问',
    icon: BurnlifeNotimeOutlined,
    descLines: ['定位增长难题', '指定增长提升方案'],
    size: 'tall' as const,
    image: serviceSystemConsultant,
    fullBackground: true,
    bg: 'transparent',
    accent: '#4a9ae8',
  },
  {
    key: 'ai-service',
    title: 'AI+人工服务',
    icon: PaCustomRoleOutlined,
    descLines: ['工作日：8:30-20:30', '非工作日：8:30-17:30'],
    size: 'tall' as const,
    image: serviceSystemHours,
    fullBackground: true,
    bg: 'transparent',
    accent: '#8663ff',
  },
  {
    key: 'technical',
    title: '技术支持',
    icon: TechnicalSupportOutlined,
    descLines: ['工作时段', '一对一在线支持'],
    size: 'standard' as const,
    accent: '#4d76ff',
  },
  {
    key: 'consulting',
    title: '咨询服务',
    icon: InfoCcmOutlined,
    descLines: ['提供组织增长升级', '咨询服务'],
    size: 'standard' as const,
    accent: '#d987ff',
  },
  {
    key: 'help',
    title: '帮助中心',
    icon: HelpdeskOutlined,
    descLines: ['员工自助答疑', '降低企业运营成本'],
    size: 'standard' as const,
    accent: '#29b9a8',
  },
  {
    key: 'migration',
    title: '新手教程',
    icon: PaCompensationProfileOutlined,
    descLines: ['新手入门视频教程', '零基础快速熟悉系统'],
    size: 'standard' as const,
    accent: '#ff9d42',
  },
]

// ====================================================================
// 首页区域配置（按组件维度组织，合并标题 / CTA / 路由映射）
// ====================================================================


/** 区域一：Hero Banner */
export const heroBannerSection = {
  slides: bannerSlides,
  routeActions: {
    'hero-video': { primary: 'channel_products', secondary: 'list_contact' },
    'hero-interaction': { primary: 'channel_products', secondary: '' },
    'hero-proof': { primary: 'list_cases', secondary: 'channel_qudao' },
    'hero-trial': { primary: 'single_mfsy', secondary: 'list_contact' },
  } as Record<string, { primary: string; secondary: string }>,
}

/** 区域二：解决方案卡片 */
export const solutionCardsSection = {
  heading: 'AI CRM，无处不在',
  subheading: '四大核心场景，AI 深度融入销售全链路',
  headingPageKey: 'channel_products',
  cards: solutionCards,
  routeMap: {
    销售增长: 'channel_products',
    销售管理: 'channel_products',
    'AI 业务赋能': 'channel_products',
    组织升级: 'channel_qudao',
  } as Record<string, string>,
}

/** 区域三：AI 功能卡片 */
export const aiFeatureCardsSection = {
  title: 'Hello！我是你的 AI 销售助理！',
  cards: assistantCards,
  routeMap: {
    'AI 拓客': 'channel_products',
    'AI 过程管理': 'channel_products',
    'AI 陪练': 'single_mfsy',
    'AI 分析师': 'channel_qudao',
  } as Record<string, string>,
}

/** 区域四：增长指标 */
export const metricsPanelSection = {
  title: '让增长，自然发生',
  metrics: growthMetrics,
}

/** 区域五：生态能力 */
export const ecosystemPartnersSection = {
  heading: '深度融入你的工作生态',
  items: ecosystemAbilityItems,
}

/** 区域六：企业视频 */
export const enterpriseVideoSection = {
  eyebrow: '安恒信息、外研在线、尼普顿、京达生物..',
  title: 'AI时代，先进企业为何选择\n用销帮帮AI CRM 重新定义增长',
  ctaText: '定制企业提效方案',
  ctaPageKey: 'single_mfsy',
  image: custChoiseImg,
}

/** 区域七：客户案例 */
export const caseCarouselSection = {
  heading: '客户案例',
  cards: industryCards,
  ctaText: '了解更多客户案例',
  ctaPageKey: 'list_cases',
}

/** 区域八：服务体系 */
export const serviceCardsSection = {
  heading: '全方位陪伴服务体系 全面助力企业增长',
  cards: serviceSystemCards,
}

// ====================================================================
// Ads 数据适配器 — 将后台广告数据映射为组件 props
// ====================================================================

import type { Ads } from '@/shared/api/ads'

/**
 * 每个轮播位（按 ord）的默认视觉样式
 * 广告数据只覆盖图片 + 文案，视觉风格保持前端硬编码
 */
const slideVisualByOrd: Record<number, Partial<BannerSlide>> = {
  1: {
    mediaType: 'video' as const,
    bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
    line: 'rgba(116, 129, 255, 0.16)',
    accent: '#5b61ff',
    glow: 'rgba(91, 97, 255, 0.18)',
    orb: 'rgba(127, 214, 255, 0.22)',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    visualImage: '',
    visualImageAlt: '',
  },
  2: {
    mediaType: 'image' as const,
    line: 'rgba(94, 105, 255, 0.16)',
    accent: '#6670ff',
    glow: 'rgba(123, 134, 242, 0.18)',
    orb: 'rgba(131, 214, 255, 0.18)',
    buttonStyle: 'hero-button--violet',
    secondaryButtonStyle: 'hero-button--ghost-indigo',
    visualTheme: 'interaction' as const,
    showVisual: false,
  },
  3: {
    mediaType: 'image' as const,
    line: 'rgba(85, 126, 255, 0.16)',
    accent: '#4b74ff',
    glow: 'rgba(75, 116, 255, 0.18)',
    orb: 'rgba(122, 207, 255, 0.18)',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    visualTheme: 'proof' as const,
  },
  4: {
    mediaType: 'image' as const,
    bg: 'linear-gradient(135deg, #f9fbff 0%, #f1f6ff 46%, #f7f1ff 100%)',
    line: 'rgba(101, 112, 255, 0.15)',
    accent: '#6b63ff',
    glow: 'rgba(107, 99, 255, 0.16)',
    orb: 'rgba(255, 178, 91, 0.12)',
    buttonStyle: 'hero-button--sunset',
    secondaryButtonStyle: 'hero-button--indigo-soft',
    visualTheme: 'trial' as const,
  },
}

/** 超出 4 个轮播位时的默认样式 */
const defaultSlideStyle: Partial<BannerSlide> = {
  mediaType: 'image' as const,
  bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  buttonStyle: 'hero-button--sunset',
}

/**
 * 将 Ads 广告数据转换为首页 Banner 轮播数据
 * API 数据为空时自动回退到硬编码的 bannerSlides
 */
export function adsToBannerSlides(ads: Ads[]): BannerSlide[] {
  if (!ads?.length) return bannerSlides

  return ads
    .slice()
    .sort((a, b) => a.ord - b.ord)
    .map((ad) => {
      const visual = slideVisualByOrd[ad.ord] || defaultSlideStyle
      return {
        key: `ad-${ad.id}`,
        ord: ad.ord,
        mediaType: visual.mediaType!,
        eyebrow: ad.subtitle || '',
        title: ad.title || '',
        subtitle: visual.subtitle,
        desc: ad.descs || '',
        primaryCta: ad.content || '了解更多',
        secondaryCta: visual.secondaryCta,
        bg: ad.simg ? `url(${ad.simg}) center / cover no-repeat` : visual.bg!,
        line: visual.line!,
        accent: visual.accent!,
        glow: visual.glow!,
        orb: visual.orb!,
        buttonStyle: visual.buttonStyle,
        secondaryButtonStyle: visual.secondaryButtonStyle,
        visualTheme: visual.visualTheme,
        showVisual: visual.showVisual,
        visualImage: visual.visualImage,
        visualImageAlt: visual.visualImageAlt,
      }
    })
}
