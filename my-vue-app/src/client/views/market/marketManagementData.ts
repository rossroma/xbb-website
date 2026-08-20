// ========== 市场管理页面 SEO 配置 ==========
import type { BannerSlide } from '@/client/data/homeData'
import type { ImageCardGridFunnelVisual } from '@/client/components/business/ImageCardGrid.vue'
import { toPagePath } from '@/client/data/routePaths'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const marketCustomer = '/images/market/market-customer.png'
const leadTriggerScenariosImage = '/images/market/lead-trigger-scenarios.png'
const leadAutoWorkflowImage = '/images/market/lead-auto-assignment-reminder-recycle.png'
const leadJourneyOverviewImage = '/images/market/lead-communication-stage-overview.png'
const leadQualityRecommendationImage = '/images/market/lead-quality-action-recommendation.png'
const leadCommunicationTimelineImage = '/images/market/lead-communication-timeline.png'
const leadIntentTrendImage = '/images/market/lead-intent-trend-ai-detection.png'
const leadStageFlowWarningImage = '/images/market/lead-stage-flow-timeout-warning.png'
const leadOneClickCustomerConversionImage = '/images/market/lead-one-click-customer-conversion.png'
const customerPoolFollowUpCultivationImage =
  '/images/market/customer-pool-follow-up-cultivation.png'
const closedLoopCustomerServiceImage =
  '/images/market/closed-loop-customer-service-archive-review.png'
const trialPagePath = toPagePath('single_mfsy')

interface MarketImageCardItem {
  title: string
  description: string
  image?: string
  imageAlt?: string
  visual?: ImageCardGridFunnelVisual
  /** feature-panel 视觉中右上角所属模块 */
  module?: string
}

export interface MarketImageCardSection {
  title: string
  subtitle: string
  cards: MarketImageCardItem[]
  columns?: 2 | 3 | 4
  rows?: number[]
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '市场管理',
  subtitle: '数字化营销',
  desc: '整合线上线下全渠道营销场景，构建全域转化漏斗，实时洞察投放 ROI\n让每一分市场投入都有迹可循',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: trialPagePath,
  primaryHref: trialPagePath,
  image: blankShowcaseImage,
  imageAlt: '市场管理产品能力展示占位图',
  bg: "url('/images/market/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'market-hero',
  mediaType: 'image',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: heroSection.desc,
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  highlightMode: 'title',
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 线索来源承接区域（CTASection） ==========
export const leadSourceSection = {
  title: '客户从哪来，都能接得住',
  description: '官网、展会、电话、微信——所有渠道线索统一汇入线索资产池',
  image: marketCustomer,
  imageAlt: '全渠道线索汇入展示占位图',
  ctaText: '立即咨询',
}

// ========== 市场管理流程区域（ImageCardGrid，feature-panel 变体） ==========
export const imageCardGridSections: MarketImageCardSection[] = [
  {
    title: '让每条线索，都走向成交',
    subtitle: '公海池灵活流转，自动推进下一步，减少线索浪费',
    rows: [2, 2],
    cards: [
      {
        title: '多场景触发\n线索不闲置',
        module: '公海池流转',
        image: leadTriggerScenariosImage,
        imageAlt: '多场景触发线索不闲置产品界面',
        description: '公海池入驻、分配、回收灵活配置，确保每条线索都被及时跟进。',
      },
      {
        title: '该分配、该提醒、该回收\n系统自动推',
        module: '自动推进',
        image: leadAutoWorkflowImage,
        imageAlt: '线索分配提醒回收自动推进产品界面',
        description: '新线索实时分配，超时未跟自动提醒，沉默线索自动回收。',
      },
      {
        title: '历史沟通、当前阶段\n一目了然',
        module: '跟进旅程沉淀',
        image: leadJourneyOverviewImage,
        imageAlt: '历史沟通和当前阶段总览产品界面',
        description: '从哪来、谁跟过、聊过什么、到哪一步，完整记录每条线索的生命周期。',
      },
      {
        title: '识别质量\n推荐动作',
        module: 'AI 推动转化',
        image: leadQualityRecommendationImage,
        imageAlt: '线索质量识别和推荐动作产品界面',
        description: 'AI 结合来源、沟通和阶段给销售下一步建议，渠道质量洞察，沉默线索智能唤醒。',
      },
    ],
  },
  {
    title: '跟进旅程，全程沉淀',
    subtitle: '每次沟通、每个阶段、每步决策，都有记录可追溯',
    columns: 3,
    cards: [
      {
        title: '每次电话、微信、拜访内容自动归档',
        module: '沟通记录',
        image: leadCommunicationTimelineImage,
        imageAlt: '时间线式沟通记录自动归档产品界面',
        description: '通话录音自动关联线索，微信沟通内容同步记录，拜访签到加备注一键录入。',
      },
      {
        title: 'AI 自动识别\n帮销售判断推进节奏',
        module: '客户意向',
        image: leadIntentTrendImage,
        imageAlt: '客户意向升温降温趋势 AI 识别产品界面',
        description: '意向信号自动提取，升温降温趋势可视，红灯商机及时预警。',
      },
      {
        title: '从线索到成交流转清晰\n停滞超时自动预警',
        module: '阶段推进',
        image: leadStageFlowWarningImage,
        imageAlt: '线索成交阶段流转和超时预警产品界面',
        description: '自定义销售阶段漏斗，阶段停留时长统计，瓶颈阶段自动预警。',
      },
    ],
  },
  {
    title: '线索一转，客户入库',
    subtitle: '确认有效即转客户，成交 / 无效 / 不确定分类清晰，客户进入新流转',
    columns: 3,
    cards: [
      {
        title: '一键转为客户\n信息自动继承',
        module: '一键转换',
        image: leadOneClickCustomerConversionImage,
        imageAlt: '线索一键转为客户并自动继承信息产品界面',
        description: '线索信息自动带入客户档案，沟通记录、跟进历史完整保留，转换规则灵活配置。',
      },
      {
        title: '继续跟进培育\n资源不闲置',
        module: '客户公海池',
        image: customerPoolFollowUpCultivationImage,
        imageAlt: '客户进入公海池继续跟进培育产品界面',
        description: '未成交客户自动退回再流转，持有上限控制防止资源囤积，按规则精准投放。',
      },
      {
        title: '成交客户持续服务\n无效客户归档复盘',
        module: '成交闭环',
        image: closedLoopCustomerServiceImage,
        imageAlt: '成交客户持续服务和无效客户归档复盘产品界面',
        description: '成交客户自动归档，续约提醒。无效客户原因分析，优化获客。不确定客户持续培育，定期唤醒。',
      },
    ],
  },
  {
    title: '活动成效，一屏看清',
    subtitle: '渠道 ROI、转出效果、转化漏斗——用数据优化投放策略',
    columns: 3,
    cards: [
      {
        title: '活动成效',
        module: '活动成效',
        visual: {
          type: 'conversion-funnel',
          headline: '某一次活动/渠道从线索到成交的逐级转化',
          stages: [
            { label: '线索量', value: '100%', shape: 'bar', tone: 'blue', width: 100 },
            { label: '有效', value: '72%', shape: 'wide-trapezoid', tone: 'sky', width: 82 },
            { label: '跟进', value: '54%', shape: 'narrow-bar', tone: 'cyan', width: 42 },
            { label: '成交', value: '28%', shape: 'terminal', tone: 'green', width: 42 },
          ],
        },
        imageAlt: '活动成效数据分析产品界面',
        description: '各渠道线索量、有效率、跟进率、转化率一目了然，实时对比投放效果',
      },
      {
        title: '转出效果分析',
        module: '转出效果分析',
        visual: {
          type: 'conversion-funnel',
          headline: '线索到成交各阶段的转化',
          stages: [
            { label: '线索量', value: '100%', shape: 'bar', tone: 'blue', width: 100 },
            { label: 'MQL', value: '64%', shape: 'wide-trapezoid', tone: 'sky', width: 70 },
            { label: 'SQL', value: '38%', shape: 'narrow-bar', tone: 'cyan', width: 36 },
            { label: '成交', value: '22%', shape: 'terminal', tone: 'green', width: 36 },
          ],
        },
        imageAlt: '线索转出效果分析产品界面',
        description: '线索转客户效率、各销售转化能力、各阶段停留时长，精准定位瓶颈',
      },
      {
        title: '可视转化漏斗',
        module: '可视转化漏斗',
        visual: {
          type: 'conversion-funnel',
          headline: '从广告投放全链路到最终成交',
          stages: [
            { label: '曝光', value: '100%', shape: 'bar', tone: 'blue', width: 100 },
            { label: '点击', value: '48%', shape: 'wide-trapezoid', tone: 'sky', width: 58 },
            { label: '线索', value: '26%', shape: 'narrow-bar', tone: 'cyan', width: 30 },
            { label: '成交', value: '8%', shape: 'terminal', tone: 'green', width: 30 },
          ],
        },
        imageAlt: '全链路可视转化漏斗产品界面',
        description: '从曝光→点击→线索→跟进→成交，全链路漏斗，每个环节流失率清晰',
      },
    ],
  },
]
