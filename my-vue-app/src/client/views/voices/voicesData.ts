import type { ReviewCard } from '@/client/components/business/ReviewCardGrid.vue'

// ========== 用户心声页面 SEO 配置 ==========

export const voicesPageSeo = {
  title: '用户心声 - 销帮帮 CRM',
  description:
    '汇集来自互联网、制造业、教育、服务、家居建材等各行业客户的真实评价，了解销帮帮 CRM 如何助力企业实现数字化销售管理。',
}

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
  secondaryCta: '立即咨询',
  bg: 'linear-gradient(135deg, #f0f1ff 0%, #e8e9fe 52%, #dce0ff 100%)',
  line: 'rgba(91, 97, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(91, 97, 255, 0.22)',
}

// ========== 分类 Tab 配置 ==========

/** 分类 Tab 项 */
export interface VoiceCategoryTab {
  /** Tab 唯一标识 */
  key: string
  /** 显示文本 */
  label: string
}

/** 分类 Tab 列表 */
export const VOICE_CATEGORY_TABS: VoiceCategoryTab[] = [
  { key: 'all', label: '全部' },
  { key: 'internet', label: '互联网' },
  { key: 'manufacturing', label: '制造业' },
  { key: 'education', label: '教育行业' },
  { key: 'service', label: '服务行业' },
  { key: 'homebuilding', label: '家居建材' },
  { key: 'other', label: '其他行业' },
]

// ========== 分类筛选映射表 ==========

/** Tab key → industry 字段值的映射关系 */
export const INDUSTRY_KEY_MAP: Record<string, string> = {
  internet: '互联网',
  manufacturing: '制造业',
  education: '教育行业',
  service: '服务行业',
  homebuilding: '家居建材',
  other: '其他行业',
}

// ========== 评价卡片数据 ==========

/** 静态评价数据 */
export const REVIEW_CARDS: ReviewCard[] = [
  // ─── 互联网 ───
  {
    logo: '/images/customer/tab-unified.png',
    logoAlt: '某互联网科技公司',
    industry: '互联网',
    content:
      '销帮帮 CRM 帮助我们实现了客户管理的全面数字化，从线索跟进到成交转化，整个流程变得清晰可控。销售团队的工作效率提升了至少 40%，客户满意度也大幅提高。',
    username: '张总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-tracking.png',
    logoAlt: '某互联网平台',
    industry: '互联网',
    content:
      '作为一家快速成长的互联网企业，我们需要一个既能满足当前需求又能支撑未来发展的 CRM 系统。销帮帮不仅功能完善，而且与钉钉的深度集成让我们的员工几乎零学习成本就上手了。',
    username: '李经理',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-collaboration.png',
    logoAlt: '某SaaS企业',
    industry: '互联网',
    content:
      '从选型到上线，销帮帮团队提供了全程专业支持。系统灵活度高，自定义字段和审批流程完全适配了我们的业务场景。使用半年后，客户跟进效率提升明显。',
    username: '赵工',
    rating: 4,
  },

  // ─── 制造业 ───
  {
    logo: '/images/customer/tab-unified.png',
    logoAlt: '某制造企业',
    industry: '制造业',
    content:
      '销帮帮 CRM 让我们从传统的 Excel 管理模式彻底转型为数字化管理。生产过程与客户订单的联动，让交付周期缩短了 30%，客户满意度显著提升。',
    username: '王总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-tracking.png',
    logoAlt: '某机械制造公司',
    industry: '制造业',
    content:
      '定制化生产是我们的核心业务，销帮帮的自定义字段功能完美适配了我们的需求。从客户询价到订单交付，全流程可追溯，管理效率大幅提升。',
    username: '陈经理',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-retention.png',
    logoAlt: '某电子制造企业',
    industry: '制造业',
    content:
      'AI 智能客户评分功能非常实用，帮我们精准识别高价值客户，销售资源分配更加合理。数据报表让管理层对销售动态一目了然。',
    username: '刘总监',
    rating: 4,
  },

  // ─── 教育行业 ───
  {
    logo: '/images/customer/tab-collaboration.png',
    logoAlt: '某教育机构',
    industry: '教育行业',
    content:
      '学员管理一直是我们最大的痛点，销帮帮的客户管理功能让我们从纸质记录彻底转向了数字化。学员跟进、课程推荐、续费提醒一气呵成。',
    username: '周校长',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-unified.png',
    logoAlt: '某在线教育平台',
    industry: '教育行业',
    content:
      '在线教育行业竞争激烈，销帮帮帮助我们建立了完整的客户生命周期管理体系，从试听到付费转化率提升了 25%。',
    username: '吴老师',
    rating: 5,
  },

  // ─── 服务行业 ───
  {
    logo: '/images/customer/tab-retention.png',
    logoAlt: '某咨询服务公司',
    industry: '服务行业',
    content:
      '咨询服务行业对客户关系管理要求极高，销帮帮的客户画像和跟进记录功能让我们对每一位客户都了如指掌，客户续约率提升了 20%。',
    username: '孙总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-tracking.png',
    logoAlt: '某法律服务所',
    industry: '服务行业',
    content:
      '法律服务需要严谨的客户管理流程，销帮帮的审批流和自定义字段完美适配了我们的业务场景，案件跟进效率大幅提升。',
    username: '郑律师',
    rating: 4,
  },
  {
    logo: '/images/customer/tab-collaboration.png',
    logoAlt: '某广告公司',
    industry: '服务行业',
    content:
      '广告行业的客户需求多变，销帮帮的灵活性和移动端体验让我们的销售团队可以随时随地跟进客户，不错过任何商机。',
    username: '钱经理',
    rating: 4,
  },

  // ─── 家居建材 ───
  {
    logo: '/images/customer/tab-unified.png',
    logoAlt: '某家居品牌',
    industry: '家居建材',
    content:
      '家居行业客户决策周期长，销帮帮的客户跟进提醒功能帮助我们不错过每一个关键节点，成交转化率得到了显著提升。',
    username: '林总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-retention.png',
    logoAlt: '某建材供应商',
    industry: '家居建材',
    content:
      '建材行业的客户关系管理一直是个难题，销帮帮让我们从混乱的客户信息中理清了头绪，老客户复购率提升了 35%。',
    username: '黄经理',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-tracking.png',
    logoAlt: '某装修公司',
    industry: '家居建材',
    content:
      '装修行业项目周期长、涉及环节多，销帮帮帮助我们将客户管理、项目进度、合同管理整合在一起，效率提升明显。',
    username: '何工',
    rating: 4,
  },

  // ─── 其他行业 ───
  {
    logo: '/images/customer/tab-collaboration.png',
    logoAlt: '某物流企业',
    industry: '其他行业',
    content:
      '物流行业客户分布广、需求多样，销帮帮的客户分类和标签功能帮助我们实现了精细化的客户管理，服务响应速度大幅提升。',
    username: '马总',
    rating: 5,
  },
  {
    logo: '/images/customer/tab-unified.png',
    logoAlt: '某医疗企业',
    industry: '其他行业',
    content:
      '医疗行业对合规性要求严格，销帮帮的权限管理和数据安全功能让我们放心地将客户数据迁移到云端，管理效率显著提升。',
    username: '杨主任',
    rating: 4,
  },
  {
    logo: '/images/customer/tab-retention.png',
    logoAlt: '某金融科技公司',
    industry: '其他行业',
    content:
      '金融科技行业客户价值高、服务要求高，销帮帮的客户画像和智能分析功能帮助我们精准服务每一位客户，客户满意度达到新高。',
    username: '曹总',
    rating: 5,
  },
]
