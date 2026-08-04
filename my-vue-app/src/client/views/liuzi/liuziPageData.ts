import type { AiCrmFeatureCard } from '@/client/components/business/AiCrmFeatureGrid.vue'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { HeroShowcaseSlide } from '@/client/components/business/HeroBanner.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'


export const liuziTrialHref = `${toPagePath('single_mfsy')}/?type=new`

export const leadHeroSlide = {
  key: 'liuzi-hero',
  mediaType: 'image',
  eyebrow: '',
  title: '',
  subtitle: '',
  desc: '',
  primaryCta: '',
  secondaryCta: '',
  bg: "url('/images/liuzi/pc_banner.png') no-repeat center center / cover",
  line: 'transparent',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.16)',
  orb: 'rgba(255, 185, 120, 0.24)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: '销帮帮 AI CRM 免费试用',
} satisfies BannerSlide

export const leadTrialSection = {
  title: '免费试用',
  subtitle: '立即体验销帮帮AI CRM，开启高效客户管理之旅',
  image: '/images/liuzi/pc_banner.png',
  imageAlt: '销帮帮 AI CRM 免费试用',
  submitButton: '提交试用申请',
  submittingText: '提交中...',
  agreementPrefix: '我已阅读并同意',
  serviceAgreementUrl:
    'https://appwebfront.xbongbong.com/stand-alone-login.html#/book?type=service',
  serviceAgreementText: '《服务协议》',
  privacyPolicyUrl: 'https://appwebfront.xbongbong.com/stand-alone-login.html#/book?isBook=isBook',
  privacyPolicyText: '《隐私政策》',
  agreementRequired: '请先阅读并同意服务协议和隐私政策',
}

export const logoSection = {
  image: '/images/liuzi/logo.jpg',
  imageAlt: '销帮帮 AI CRM',
}

export const aiCrmSection = {
  title: 'AI+CRM，驱动企业业绩增长，50%利润翻倍',
  cards: [
    {
      image: '/images/liuzi/1.png',
      icon: '/images/liuzi/aiFindCust.png',
      iconAlt: 'AI找客助手图标',
      sideImage: '/images/liuzi/aiFindCustIcon.png',
      sideImageAlt: '',
      title: 'AI找客助手',
      description: '快速锁定优质成交客户',
      points: [
        '智能推荐相似客户',
        '挖掘上下游企业与潜在商机',
        '智能筛选高价值客户名单',
        '自动去重，减少无效线索',
        '实时查看拓客效果与数据分析',
      ],
    },
    {
      image: '/images/liuzi/2.png',
      icon: '/images/liuzi/aiSales.png',
      iconAlt: 'AI销售陪练图标',
      sideImage: '/images/liuzi/aiSalesIcon.png',
      sideImageAlt: '',
      title: 'AI销售陪练',
      description: '全员具备销冠实力',
      points: [
        '模拟真实客户沟通场景',
        'AI实时提问、追问与互动',
        '自动发现销售沟通问题',
        '提供针对性改进建议',
        '快速复制优秀销售经验',
      ],
    },
    {
      image: '/images/liuzi/3.png',
      icon: '/images/liuzi/aiBusiness.png',
      iconAlt: 'AI业务分析图标',
      sideImage: '/images/liuzi/aiBusinessIcon.png',
      sideImageAlt: '',
      title: 'AI业务分析',
      description: '数据诊问题，AI 挖机会',
      points: [
        '自动汇总客户与销售数据',
        '实时分析团队业绩情况',
        '提前预警商机流失风险',
        '找出销售过程中的关键瓶颈',
        'AI生成改善建议与行动方案',
      ],
    },
  ] satisfies AiCrmFeatureCard[],
}

export const managementShowcaseLeftSlides: HeroShowcaseSlide[] = [
  {
    key: 'customer-management',
    title: '客户全生命周期数字化管理，提升企业效益',
    image: '/images/liuzi/1-1.png',
    imageAlt: '客户管理产品界面',
    items: [
      { title: '支持客户多维度查重' },
      { title: '通过预设自定义字段及标签实现客户分层分类' },
      { title: '构建企业潜在客户360°画像，\n提升私域客户池运作效率', afterBreaks: 2 },
      { title: '实现对于客户旅程的精准把控' },
    ],
    primaryCta: '免费试用',
    primaryHref: liuziTrialHref,
    secondaryCta: '申请演示',
    secondaryHref: liuziTrialHref,
  },
  {
    key: 'sales-management',
    title: '精细化销售过程管理',
    image: '/images/liuzi/1-2.png',
    imageAlt: '销售管理产品界面',
    items: [
      { title: '对应不同客户类型和阶段\n标准化销售打单旅程，', afterBreaks: 2 },
      { title: '抽炼优秀销售运营动作\n穿透并赋能每一位前线销售', afterBreaks: 2 },
      { title: '让每个销售策略都有理有据\n全面提升销售团队效率和业务能力。' },
    ],
    primaryCta: '免费试用',
    primaryHref: liuziTrialHref,
    secondaryCta: '申请演示',
    secondaryHref: liuziTrialHref,
  },
  {
    key: 'market-management',
    title: '市场管理',
    image: '/images/liuzi/1-3.png',
    imageAlt: '市场管理产品界面',
    items: [
      { title: '销帮帮CRM支持统一管理市场活动' },
      { title: '根据ROI分析，持续不断优化营销渠道\n获得更多高质量线索。', afterBreaks: 2 },
      { title: '从线索收集、分配、跟进到转化' },
      { title: '全面提高线索质量，加速转化。' },
    ],
    primaryCta: '免费试用',
    primaryHref: liuziTrialHref,
    secondaryCta: '申请演示',
    secondaryHref: liuziTrialHref,
  },
  {
    key: 'paas-capability',
    title: '完美的PaaS底层能力可以赋能您的整个商业流程',
    image: '/images/liuzi/1-4.png',
    imageAlt: 'PaaS能力产品界面',
    items: [
      { title: '销帮帮PaaS底层能力助力企业\n应对与日俱增的业务挑战', afterBreaks: 2 },
      { title: '实现系统与企业个性化需求的快速适配' },
    ],
    primaryCta: '免费试用',
    primaryHref: liuziTrialHref,
    secondaryCta: '申请演示',
    secondaryHref: liuziTrialHref,
  },
  {
    key: 'ai-sales-assistant',
    title: 'AI 销售助理，重塑销售作业流程，助力业绩增长',
    image: '/images/liuzi/1-5.png',
    imageAlt: 'AI销售助理产品界面',
    items: [
      { title: '一键录入企业客户' },
      { title: 'AI帮你补全客户资料' },
      { title: '一键自动提炼会议内容' },
      { title: 'AI帮你推动客户跟进' },
      { title: '一键自动提炼跟进纪要' },
      { title: 'AI帮跟进总结·跟进评估·假日祝福' },
    ],
    primaryCta: '免费试用',
    primaryHref: liuziTrialHref,
    secondaryCta: '申请演示',
    secondaryHref: liuziTrialHref,
  },
]

export const managementShowcaseRightSection = {
  title: 'AI智能生态，驱动管理全面提效',
  slides: [
    {
      key: 'sesame-customer',
      title: '芝麻找客助手',
      titleIcon: '/images/liuzi/2-1.png',
      image: '/images/liuzi/findCustomer.png',
      imageAlt: '芝麻找客助手',
      description:
        '芝麻找客助手，是蚂蚁集团旗下芝麻企业信用打造的AI智能拓客工具，为企业销售全链路赋能，让业务拓客效率提升数十倍',
      items: [
        {
          title: '多场景精准拓客',
          description:
            '支持「以客找客、主营找客、上下游找客」多维度拓客模式，快速锁定目标客户群体，精准匹配业务需求，高效挖掘潜在商机。',
        },
        {
          title: '多维度权威数据',
          description:
            '依托独家企业认知库，整合产业链、投资、产品等多维度数据，提供匹配度、购买能力等企业评估指标，让客户筛选有据可依。',
        },
        {
          title: '多渠道高效建联',
          description:
            '覆盖企业老板、决策层、核心员工等多角色联系方式，助力销售快速触达关键决策人，高效推进业务对接。',
        },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
    {
      key: 'sesame-bidding',
      title: '芝麻标讯助手',
      titleIcon: '/images/liuzi/2-1.png',
      image: '/images/liuzi/biddingInfo.png',
      imageAlt: '芝麻标讯助手',
      description: '任何重要投标机会。',
      items: [
        {
          title: '商机深度分析，投标更有策略',
          description:
            '报价策略智能建议、甲方采购行为分析、潜在竞争对手分析，依托海量行业专家经验与独家算法融合计算，帮你精准制定投标方案，提升中标率。',
        },
        { title: 'AI智能赋能，全流程高效管理' },
        { description: '精准商机推荐：智能匹配最适合你的招标项目' },
        { description: '- 一句话查标讯：自然语言直接表达需求，快速定位目标标讯' },
        { description: '- 客户/同行动态监控：招标、中标动态实时推送，掌握市场先机' },
        { description: '- 一键下载附件：招标文件、附件材料一键获取，省心省力' },
        { description: '- CRM联动管理：标讯线索一键入库，无缝对接企业管理流程' },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
    {
      key: 'schedule',
      title: '日程助手',
      titleIcon: '/images/liuzi/2-3.png',
      image: '/images/liuzi/schedule.png',
      imageAlt: '日程助手',
      items: [
        {
          description:
            '适合需要持续拜访、维护和推进客户的团队使用，让拜访安排更清晰、准备更充分、后续跟进更连续。日程助手围绕用户在访客计划中维护的数据，帮助用户更高效地完成拜访前准备与后续任务安排。用户在查看日程时，可以快速回顾客户基本情况、历史跟进内容和近期重点事项，减少临时翻找信息的时间，让每次拜访前都更有准备。',
        },
        {
          description:
            '同时，系统会基于每次拜访形成的跟进记录，自动生成推荐的跟进任务，帮助用户更顺畅地衔接下一步动作。用户可以根据实际情况，自由选择是否将这些任务加入访客计划。',
        },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
    {
      key: 'train-partner',
      title: '陪练助手',
      titleIcon: '/images/liuzi/2-4.png',
      image: '/images/liuzi/trainPartner.png',
      imageAlt: '陪练助手',
      items: [
        {
          description:
            '陪练助手适合销售、客服、顾问、培训等需要高频沟通的岗位使用。它可以围绕常见业务场景，帮助用户提前练习开场表达、需求挖掘、异议回应、方案介绍和收尾推进，让新人更快上手，也让有经验的同事持续打磨表达能力。',
        },
        {
          description:
            '它最大的价值，是把“临场发挥”变成“可反复练习”。用户可以在正式接触客户前，先进行低成本演练，提前发现表达不清、逻辑不顺、回应不够有力的问题。这样不仅能提升个人信心，也能帮助团队逐步沉淀更稳定的沟通方法，让服务质量和成交表现更可控。',
        },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
    {
      key: 'analysis',
      title: '分析师',
      titleIcon: '/images/liuzi/2-5.png',
      image: '/images/liuzi/analysis.png',
      imageAlt: '分析师',
      items: [
        {
          description:
            '分析师面向需要看经营情况、判断趋势、发现问题的管理者与业务团队。它可以帮助用户更快整理关键信息，聚焦核心指标变化，辅助判断哪里做得好、哪里值得优化，以及下一步应该优先关注什么。',
        },
        {
          description:
            '很多团队并不缺数据，缺的是把数据变成判断和行动的能力。无论是线索转化、客户活跃、团队效率，还是活动效果、产品使用情况，都可以借助分析师更高效地发现问题、解释现象、支持决策，让业务优化更有依据。分析师的价值，就在于帮助用户从繁杂信息中更快抓住重点，减少“看了很多表、还是不知道怎么办”的情况。',
        },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
    {
      key: 'follow-up',
      title: '跟进助手',
      titleIcon: '/images/liuzi/2-6.png',
      image: '/images/liuzi/followUp.png',
      imageAlt: '跟进助手',
      items: [
        {
          description:
            '适合用于客户拜访、电话沟通、项目推进等场景，让跟进更及时、记录更完整、后续动作更明确，帮助团队提升客户经营效率。',
        },
        {
          description:
            '跟进助手帮助用户把每一次沟通沉淀成可复用、可追踪的客户资产。用户可自主上传录音文件，系统会对沟通内容进行提炼分析，自动整理关键信息，并生成结构化的跟进记录，减少手工整理带来的时间消耗和信息遗漏。',
        },
        {
          description:
            '在完成记录沉淀后，跟进助手还会结合本次沟通内容，给出下一步行动建议，帮助用户更快判断后续该推进什么、联系什么人、补充哪些动作。',
        },
      ],
      primaryCta: '申请演示',
      primaryHref: liuziTrialHref,
      secondaryCta: '免费试用',
      secondaryHref: liuziTrialHref,
    },
  ] satisfies HeroShowcaseSlide[],
}

export const biCapabilitySection = {
  title: '数据分析能力和可视化功能，助企业快速决策',
  features: [
    {
      title: 'BI智能报表',
      description: '多维度交叉计算、分析，灵活查询\n高效洞察业务数据，助企业快速决策',
      image: '/images/liuzi/ability-1.png',
      imageAlt: 'BI智能报表',
    },
    {
      title: '数据看板',
      description: '高复杂、高消耗的驾驶舱项目\n通过云叩快速开发、无缝植入，用户体验感好',
      image: '/images/liuzi/ability-2.png',
      imageAlt: '数据看板',
    },
    {
      title: '数据二次开发',
      description: '匹配绩效统计、穿透分析等复杂数据处理场景\n支持低代码级别的数据二次开发',
      image: '/images/liuzi/ability-3.png',
      imageAlt: '数据二次开发',
    },
  ] satisfies FeatureItem[],
}

export const ecosystemSection = {
  heading: '多平台战略生态合作伙伴，便捷高效服务',
  items: [
    {
      title: '钉钉',
      desc: '阿里钉钉业财联盟首批成员，PC/移动高效协同\n业务流程透明化',
      icon: '/images/liuzi/ability-1.svg',
      logoHeight: 'h-[70px]',
    },
    {
      title: '企业微信',
      desc: '多维度引流获客，帮助企业更好地运营客户\n搭建私域流量池',
      icon: '/images/liuzi/ability-2.svg',
      logoHeight: 'h-[70px]',
    },
    {
      title: '飞书',
      desc: '先进的团队协同平台理念\n帮助构建健康高效的运营环境',
      icon: '/images/liuzi/ability-3.svg',
      logoHeight: 'h-[70px]',
    },
    {
      title: '1688',
      desc: '批发询盘自动归集\n全域批发客源高效转化',
      icon: '/ecosystem/1688.png',
      logoHeight: 'h-[70px]',
    },
  ],
}

export const caseHeaderSection = {
  image: '/images/liuzi/pc_banner.png',
  imageAlt: '销帮帮 AI CRM 行业解决方案',
  logo: '/images/liuzi/logo.jpg',
  logoAlt: '销帮帮 AI CRM',
  description:
    '基于专业化系统架构，采用微服务架构，兼容主流数据库，满足千万级数据量下的 CRM 稳定运行。持续创新 CRM 解决方案，并通过咨询、培训和服务帮助客户价值提升。',
  title: '30+行业 400,000+知名企业共同的选择',
  tags: ['企业级数据', '持续服务', '原创创新'],
}
