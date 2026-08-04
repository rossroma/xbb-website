// ========== 市场管理页面 SEO 配置 ==========
import type { Theme } from '@/client/components/business/theme'
import type { BannerSlide } from '@/client/data/homeData'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'

type MarketProcessStep = {
  theme?: Theme
  number?: number
  title: string
  description: string
  features?: string[]
  summary: string
}

type MarketProcessSection = {
  title: string
  subtitle: string
  steps: MarketProcessStep[]
}


// ========== Hero 区域 ==========
export const heroSection = {
  title: '市场管理',
  subtitle: '全渠道营销获客，高效转化',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  image: blankShowcaseImage,
  imageAlt: '市场管理产品能力展示占位图',
  bg: 'linear-gradient(135deg, #fef9f3 0%, #fef5eb 52%, #f8f5fb 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'market-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  secondaryCta: heroSection.secondaryCta,
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
} satisfies BannerSlide

// ========== 线索来源承接区域（CTASection） ==========
export const leadSourceSection = {
  title: '客户从哪来，都能接得住',
  description: '官网、展会、电话、微信——所有渠道线索统一汇入线索资产池。',
  image: blankShowcaseImage,
  imageAlt: '全渠道线索汇入展示占位图',
  ctaText: '立即咨询',
}

// ========== 市场管理流程区域（ProcessSteps） ==========
export const processSections: MarketProcessSection[] = [
  {
    title: '让每条线索，都走向成交',
    subtitle: '公海池灵活流转，自动推进下一步，减少线索浪费。',
    steps: [
      {
        theme: 'blue',
        title: '公海池流转',
        description: '多场景触发，线索不闲置。',
        features: ['公海池入驻 / 分配 / 回收。'],
        summary: '客户不流失',
      },
      {
        theme: 'indigo',
        title: '自动推进',
        description: '该分配、该提醒、该回收，系统自动推。',
        features: ['新线索及时分配。', '超时未跟自动提醒。', '沉默线索自动回收。'],
        summary: '渠道算得清',
      },
      {
        theme: 'purple',
        title: '跟进旅程沉淀',
        description: '历史沟通、当前阶段，一目了然。',
        features: ['从哪来。', '谁跟过。', '聊过什么。', '到哪一步。'],
        summary: '销售跟得上',
      },
      {
        theme: 'blue',
        title: 'AI 推动转化',
        description: '识别质量，推荐动作。',
        features: [
          '计划 + 话术结合来源、沟通和阶段，给销售下一步建议。',
          '渠道质量洞察。',
          '沉默线索唤醒。',
        ],
        summary: '预算花得值',
      },
    ],
  },
  {
    title: '跟进旅程，全程沉淀',
    subtitle: '每次沟通、每个阶段、每步决策，都有记录可追溯。',
    steps: [
      {
        theme: 'blue',
        title: '沟通记录',
        description: '时间线式记录，每次电话、微信、拜访内容自动归档。',
        features: ['通话录音自动关联线索。', '微信沟通内容同步记录。', '拜访签到 + 备注一键录入。'],
        summary: '沟通不丢档',
      },
      {
        theme: 'indigo',
        title: '客户意向',
        description: '意向升温降温趋势，AI 自动识别，帮销售判断推进节奏。',
        features: ['意向信号自动提取。', '升温 / 降温趋势可视。', '红灯商机及时预警。'],
        summary: '意向看得见',
      },
      {
        theme: 'purple',
        title: '阶段推进',
        description: '从线索到成交的阶段流转路径清晰，停滞超时自动预警。',
        features: ['自定义销售阶段漏斗。', '阶段停留时长统计。', '瓶颈阶段自动预警。'],
        summary: '风险早发现',
      },
    ],
  },
  {
    title: '线索一转，客户入库',
    subtitle: '确认有效即转客户，成交 / 无效 / 不确定分类清晰，客户进入新流转。',
    steps: [
      {
        theme: 'blue',
        title: '一键转换',
        description: '线索确认有效，一键转为客户，信息自动继承。',
        features: [
          '线索信息自动带入客户档案。',
          '沟通记录、跟进历史完整保留。',
          '转换规则可配置，灵活适配。',
        ],
        summary: '信息不重录',
      },
      {
        theme: 'indigo',
        title: '客户公海池',
        description: '客户同样进入公海池流转，继续跟进培育，资源不闲置。',
        features: [
          '未成交客户自动退回再流转。',
          '持有上限控制，防止资源囤积。',
          '按规则分配，精准投放。',
        ],
        summary: '流转不停滞',
      },
      {
        theme: 'purple',
        title: '成交闭环',
        description: '成交客户持续服务，无效客户归档复盘，不确定客户继续跟进。',
        features: [
          '成交客户自动归档，续约提醒。',
          '无效客户原因分析，优化获客。',
          '不确定客户持续培育，定期唤醒。',
        ],
        summary: '客户不流失',
      },
    ],
  },
  {
    title: '活动成效，一屏看清',
    subtitle: '渠道 ROI、转出效果、转化漏斗——用数据优化投放策略。',
    steps: [
      {
        theme: 'blue',
        title: '活动成效',
        description: '各渠道线索量、有效率、跟进率、转化率一目了然，实时对比投放效果。',
        summary: '渠道 ROI 实时对比',
      },
      {
        theme: 'indigo',
        title: '转出效果分析',
        description: '线索转客户效率、各销售转化能力、各阶段停留时长，精准定位瓶颈。',
        summary: '转化瓶颈精准定位',
      },
      {
        theme: 'purple',
        title: '可视转化漏斗',
        description: '从曝光→点击→线索→跟进→成交，全链路漏斗，每个环节流失率清晰。',
        summary: '漏斗流失一目了然',
      },
    ],
  },
]

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
