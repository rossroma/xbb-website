import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import type { FaqCategory, FaqItem } from '@/client/components/business/FaqList.vue'
import type { ArticleSidebarTocItem } from '@/client/components/business/ArticleSidebar.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'

export type KnowledgeArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string; strongLead?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'cta'; text: string }

export type KnowledgeSidebarBanner = {
  title: string
  subtitle: string
  ctaText: string
  image: string
  imageAlt: string
  to: string
  theme: 'teal' | 'violet'
}

export type KnowledgeArticle = {
  slug: string
  title: string
  summary: string
  author: string
  publishDate: string
  updatedAt: string
  image: string
  imageAlt: string
  blocks: KnowledgeArticleBlock[]
  faqCategories?: FaqCategory[]
  faqItems?: FaqItem[]
}

export const knowledgeQnASeo = {
  title: '知识问答 - 销帮帮 CRM',
  description: '围绕中小企业 CRM 选型、实施与常见问题的知识问答页面。',
}

export const knowledgeQnABreadcrumb: BreadcrumbItem[] = [
  { label: '首页', to: '/' },
  { label: '关于我们', to: '/gongsijianjie' },
  { label: '新闻动态', to: '/gongsidongtai' },
  { label: '知识问答' },
]

export const knowledgeQnAHeader = {
  pageLabel: '知识问答',
  title: '适合中小企业的客户关系crm管理系统推荐及使用建议',
  intro:
    '中小企业在市场竞争中处于一个非常特殊的位置：资源有限、业务灵活、发展速度快，但也更容易遇到客户管理混乱、销售跟进脱节、客户数据丢失等问题。选择一款合适的客户关系CRM管理系统，已经成为中小企业数字化升级中不可或缺的一环。本文将以“适合中小企业的客户关系crm管理系统推荐及使用建议”为主线，帮助你理清CRM选型思路，了解主流产品，并能结合自身实际需求做出最优选择。',
  ctaText: '免费试用',
}

export const knowledgeQnAHeroSlide = {
  key: 'knowledge-qna-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: '知识问答',
  subtitle:
    '为企业提供CRM系统、数字化转型、企业经营管理、销售管理、市场营销、客户服务等方面的专业知识。',
  desc: '',
  primaryCta: '',
  secondaryCta: '',
  bg: 'linear-gradient(90deg, rgba(247, 251, 255, 0.94) 0%, rgba(247, 251, 255, 0.82) 46%, rgba(247, 251, 255, 0.58) 100%)',
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: false,
  visualImage: '',
  visualImageAlt: '知识问答 Hero 背景',
}

export const knowledgeQnASidebarBanners: KnowledgeSidebarBanner[] = [
  {
    title: 'CRM客户管理系统模板',
    subtitle: '客户资料、跟进记录与成交数据集中管理',
    ctaText: '免费安装',
    image: '/images/article-sidebar/crm-template.png',
    imageAlt: 'CRM客户管理系统模板',
    to: '/liuzi',
    theme: 'teal',
  },
  {
    title: '销售管理系统模板',
    subtitle: '销售过程透明可控，团队业绩实时掌握',
    ctaText: '免费安装',
    image: '/images/article-sidebar/sales-template.png',
    imageAlt: '销售管理系统模板',
    to: '/liuzi',
    theme: 'violet',
  },
]

export const knowledgeQnAArticleBlocks: KnowledgeArticleBlock[] = [
  { type: 'heading', text: '🚀一、为什么中小企业需要专业的CRM管理系统？' },
  { type: 'subheading', text: '1、CRM系统对中小企业的核心价值' },
  {
    type: 'paragraph',
    text: '客户关系管理（CRM）系统的本质，是帮助企业规范客户资料的采集、整理、分级、跟进、分析和维护过程。对于中小企业而言，CRM不仅仅是一个“通讯录”，更是提升销售转化、优化团队协作、沉淀客户资产、支撑业务增长的核心工具。具体体现在：',
  },
  {
    type: 'paragraph',
    strongLead: '高效管理客户信息：',
    text: '集中存储客户资料，避免因人员变动造成客户流失。',
  },
  {
    type: 'paragraph',
    strongLead: '销售流程可视化：',
    text: '从线索到成交，每一个环节都清晰可控，销售漏斗一目了然。',
  },
  {
    type: 'paragraph',
    strongLead: '提升团队协作：',
    text: '销售、客服、市场等角色的数据协同，减少重复沟通和信息孤岛。',
  },
  {
    type: 'paragraph',
    strongLead: '科学分析数据：',
    text: '通过报表分析销售业绩、客户活跃度、复购概率等，指导决策。',
  },
  {
    type: 'paragraph',
    strongLead: '降低客户流失率：',
    text: '自动提醒、定期回访、个性化营销，增强客户黏性。',
  },
  { type: 'subheading', text: '2、中小企业在CRM应用上的实际痛点' },
  { type: 'paragraph', text: '在与大量中小企业主的沟通中，我们发现这些痛点极具代表性：' },
  { type: 'cta', text: '免费试用' },
  { type: 'paragraph', text: '客户资料四散、重复，无法统一管理' },
  { type: 'paragraph', text: '销售机会跟进不及时，丢单频发' },
  { type: 'paragraph', text: '业务流程随意，员工离职带走大量客户信息' },
  { type: 'paragraph', text: '管理层对销售进度和团队绩效缺乏实时把控' },
  { type: 'paragraph', text: '数据统计依赖Excel，耗时低效且易出错' },
  {
    type: 'paragraph',
    text: '面对这些现实困扰，一个好用、易上手、能灵活扩展的CRM系统，正是解决问题的关键。',
  },
  { type: 'cta', text: '免费试用' },
  { type: 'subheading', text: '3、CRM系统的选型关注点' },
  {
    type: 'paragraph',
    text: '要选出适合中小企业的CRM管理系统，企业主必须从实际需求出发，关注以下几个核心方面：',
  },
  { type: 'paragraph', strongLead: '易用性和上手速度：', text: '系统复杂，员工用不起来等于白搭。' },
  {
    type: 'paragraph',
    strongLead: '灵活性和可扩展性：',
    text: '业务变化快，能不能快速调整流程和字段？',
  },
  { type: 'paragraph', strongLead: '性价比：', text: '预算有限，是否有免费试用、按需付费计划？' },
  { type: 'paragraph', strongLead: '数据安全与合规：', text: '客户数据是否有完善的安全保障？' },
  { type: 'paragraph', strongLead: '本地化支持：', text: '中文界面、国内服务商，售后响应快。' },
  {
    type: 'paragraph',
    strongLead: '集成能力：',
    text: '能否对接微信、钉钉、企业微信、ERP等常用工具？',
  },
  { type: 'subheading', text: '4、适合中小企业的主流CRM系统概览' },
  {
    type: 'paragraph',
    text: '基于上述选型关注点，市场上的CRM系统繁多，既有传统型（如Salesforce、SAP CRM），也有新兴的国产数字化平台。根据市场调研和企业反馈，以下系统在中小企业用户中拥有极高的口碑和适用性：',
  },
  {
    type: 'table',
    headers: ['系统名称', '主要特点', '适用场景', '价格区间', '特色亮点'],
    rows: [
      [
        '销帮帮CRM',
        '零代码开发，灵活可定制，2000w+用户',
        '各行业，快速上线',
        '免费/付费多档',
        '流程自定义极强',
      ],
      ['销售易CRM', '移动端强大，销售流程化管理', '互联网/制造/服务业', '按需付费', '智能销售助手'],
      ['纷享销客CRM', '全场景覆盖，社交+移动办公', '连锁/快消/大客户', '按需付费', '内嵌社交协作'],
      ['北森CRM', '人才管理+客户管理一体化', '专业服务/咨询/教育', '按需付费', '一体化人事+CRM'],
      [
        '用友CRM',
        '本地化服务强，财务和ERP对接能力突出',
        '制造/贸易/财务相关',
        '按需付费',
        'ERP深度集成',
      ],
    ],
  },
  {
    type: 'paragraph',
    text: '选择这些系统，都能显著提升中小企业客户管理的专业化和数字化水平。其中，销帮帮CRM系统以其灵活性、易用性和极高的性价比，成为众多成长型企业的首选。',
  },
  { type: 'heading', text: '🛠️二、热门CRM系统推荐及对比分析' },
  {
    type: 'paragraph',
    text: '中小企业在选择CRM管理系统时，面对市场上琳琅满目的产品，常常会感到无从下手。本节将对几款主流、口碑极高的CRM产品进行详细解析，对比其功能、适用场景、价格和亮点，帮助企业主高效决策。',
  },
  { type: 'subheading', text: '1、销帮帮CRM系统——零代码灵活定制，2000w+用户的信赖之选' },
  {
    type: 'paragraph',
    text: '销帮帮CRM系统是国内市场占有率第一的零代码数字化平台，2000w+用户、200w+团队正在使用。它不仅能快速搭建完善的客户资料库、销售流程自动化、团队协作与数据分析等关键场景，还能根据企业实际需求灵活搭建和调整功能模块——即使不会编程，也能像搭积木一样自定义业务流程。',
  },
  {
    type: 'paragraph',
    strongLead: '高自由度：',
    text: '客户信息、商机、回款、合同、售后等，全流程自定义。',
  },
  { type: 'paragraph', strongLead: '简单易用：', text: '拖拽式设计，员工无需培训即可上手。' },
  {
    type: 'paragraph',
    strongLead: '集成能力强：',
    text: '与微信、钉钉、企业微信、邮件、短信等无缝集成。',
  },
  {
    type: 'paragraph',
    strongLead: '数据可视化：',
    text: '强大的报表仪表盘，一键洞察销售线索和客户转化数据。',
  },
  {
    type: 'paragraph',
    strongLead: '免费试用，性价比高：',
    text: '支持在线免费试用，灵活按需付费，适合预算有限的中小企业。',
  },
  {
    type: 'paragraph',
    text: '无论你是初创公司，还是团队已达百人规模，销帮帮都能满足你对CRM的所有想象。推荐体验： 销帮帮CRM系统模板在线试用：www.jiandaoyun.com',
  },
  { type: 'subheading', text: '2、销售易CRM——聚焦销售自动化，移动办公体验突出' },
  {
    type: 'paragraph',
    text: '销售易CRM以其移动端体验和销售全流程自动化管理著称，适合业务发展迅猛、对销售流程管控要求高的中小企业。其核心亮点包括：',
  },
  {
    type: 'paragraph',
    strongLead: '全流程销售管理：',
    text: '从线索、客户、商机到订单、回款，每一步都可视化监管。',
  },
  {
    type: 'paragraph',
    strongLead: '移动办公：',
    text: '出差在外也能随时查客户、报备拜访、进度同步。',
  },
  {
    type: 'paragraph',
    strongLead: '智能助手：',
    text: '自动提醒跟进、推送重要商机，减少销售人员遗忘和遗漏。',
  },
  { type: 'paragraph', strongLead: '灵活部署：', text: '支持云端和本地化，安全合规。' },
  {
    type: 'paragraph',
    text: '销售易CRM适用于互联网、制造、服务等多个行业，尤其适合销售团队较为活跃、外勤需求强的企业。',
  },
  { type: 'subheading', text: '3、纷享销客CRM——社交化协作，覆盖全场景' },
  {
    type: 'paragraph',
    text: '纷享销客CRM主打“社交+CRM”模式，将客户管理与团队协作、日常沟通融合，非常适合连锁、快消、贸易等依赖团队协同的中小企业。',
  },
  {
    type: 'paragraph',
    strongLead: '客户+圈子：',
    text: '客户、供应商、合作伙伴都能加入协作圈，提升沟通效率。',
  },
  { type: 'paragraph', strongLead: '全场景覆盖：', text: '支持售前、售中、售后全链路管理。' },
  { type: 'paragraph', strongLead: '移动办公便捷：', text: '随时随地处理客户和商机。' },
  { type: 'paragraph', strongLead: '智能报表与分析：', text: '老板随时掌控销售全貌。' },
  { type: 'paragraph', text: '纷享销客CRM大大缩短了从获客到成交的周期，也降低了沟通成本。' },
  { type: 'subheading', text: '4、北森CRM——人才与客户管理一体化' },
  {
    type: 'paragraph',
    text: '北森CRM融合了人事和客户管理功能，适合人力资源、咨询、教育等专业服务型企业。其核心优势包括：',
  },
  { type: 'paragraph', strongLead: '一体化平台：', text: '客户线索与人才招聘、绩效等数据互通。' },
  { type: 'paragraph', strongLead: '项目型管理：', text: '支持大客户、项目型业务管理流程。' },
  { type: 'paragraph', strongLead: '数据安全保障：', text: '严格的权限分级和数据备份。' },
  { type: 'paragraph', text: '如果你的企业既需要管客户，也需要管人才，北森CRM是极佳选择。' },
  { type: 'subheading', text: '5、用友CRM——ERP深度集成，适合财务和制造型企业' },
  {
    type: 'paragraph',
    text: '用友CRM依托其在财务和ERP领域的强大积累，特别适合制造、贸易、财务相关企业。亮点如下：',
  },
  { type: 'paragraph', text: '与ERP系统无缝对接，打通财务、供应链和客户管理。' },
  { type: 'paragraph', text: '本地化服务较强，售后响应快。' },
  { type: 'paragraph', strongLead: '功能全面：', text: '销售、服务、市场、合同、回款全流程覆盖。' },
  { type: 'paragraph', text: '用友CRM更适合对财务和进销存要求较高的中小企业。' },
  { type: 'subheading', text: 'CRM系统对比表' },
  {
    type: 'table',
    headers: ['系统名称', '上手难度', '定制能力', '价格策略', '适用行业范围', '集成能力'],
    rows: [
      ['销帮帮CRM', '★☆☆☆☆', '★★★★★', '免费/多档', '通用型', '极强'],
      ['销售易CRM', '★★☆☆☆', '★★★★☆', '按需付费', '互联网/制造业', '强'],
      ['纷享销客CRM', '★★☆☆☆', '★★★★☆', '按需付费', '快消/连锁/服务', '强'],
      ['北森CRM', '★★☆☆☆', '★★★☆☆', '按需付费', '咨询/教育/HR', '适中'],
      ['用友CRM', '★★★☆☆', '★★★☆☆', '按需付费', '制造/贸易', '极强'],
    ],
  },
  {
    type: 'paragraph',
    text: '从易用性、灵活性和性价比综合来看，销帮帮CRM系统是最适合中小企业快速上手和持续扩展的选择。',
  },
  { type: 'heading', text: '📈三、CRM系统实施建议及常见误区避坑指南' },
  {
    type: 'paragraph',
    text: '选择了CRM系统只是第一步，怎么用好它、避免常见误区，才能真正让中小企业实现客户管理升级。这一节就带你逐步拆解实操中的关键建议和注意事项。',
  },
  { type: 'subheading', text: '1、系统上线前的准备工作' },
  { type: 'paragraph', text: '成功上线CRM系统，前期准备极为重要。包括：' },
  {
    type: 'paragraph',
    strongLead: '梳理业务流程：',
    text: '明晰自己的客户管理、销售跟进、服务流程，哪些环节需要数字化、标准化。',
  },
  { type: 'paragraph', strongLead: '明确核心需求：', text: '哪些功能是“必选项”，哪些是“加分项”。' },
  {
    type: 'paragraph',
    strongLead: '确定数据结构：',
    text: '客户信息、联系人、商机、合同、回款等，字段怎么设，谁来维护？',
  },
  {
    type: 'paragraph',
    strongLead: '选定试点团队：',
    text: '建议先让一线销售或市场团队试用，收集反馈后再全员推广。',
  },
  {
    type: 'paragraph',
    strongLead: '案例：',
    text: '一家20人规模的IT外包公司，采用销帮帮CRM前，先梳理客户跟进和回款流程，定义了8个主要字段和3个销售阶段，2天内就搭建并试点上线，极大提升了成单率。',
  },
  { type: 'subheading', text: '2、系统实施过程的关键动作' },
  {
    type: 'paragraph',
    strongLead: '分阶段推进：',
    text: '先让一线销售/客服用起来，跑通基本流程，再逐步扩展到合同、回款、售后等模块。',
  },
  {
    type: 'paragraph',
    strongLead: '定期培训和答疑：',
    text: '安排骨干员工做“种子用户”，有问题快速响应和解答。',
  },
  {
    type: 'paragraph',
    strongLead: '持续优化流程：',
    text: '根据实际使用反馈，不断微调字段、流程、自动提醒等功能。',
  },
  {
    type: 'paragraph',
    strongLead: '数据迁移与清洗：',
    text: '老数据导入时要做去重、分类，避免“垃圾进垃圾出”。',
  },
  { type: 'subheading', text: '典型误区' },
  { type: 'paragraph', text: '只用CRM做“通讯录”，没有流程驱动，员工用不起来。' },
  { type: 'paragraph', text: '一次性上线全部功能，导致员工负担重，排斥新系统。' },
  { type: 'paragraph', text: '管理层没有持续关注，缺乏绩效考核和使用激励。' },
  { type: 'subheading', text: '最佳实践' },
  { type: 'paragraph', text: '明确KPI，比如客户跟进数、回款周期等，系统自动统计，纳入绩效考核。' },
  { type: 'paragraph', text: '制定激励政策，如谁录入客户资料最全、跟进最及时，给予奖励。' },
  { type: 'subheading', text: '3、CRM系统日常运维与持续优化' },
  {
    type: 'paragraph',
    strongLead: '系统管理员：',
    text: '指定专人负责权限设置、数据安全和流程调整。',
  },
  { type: 'paragraph', strongLead: '定期数据备份：', text: '防止误删和信息丢失。' },
  { type: 'paragraph', strongLead: '安全分级权限：', text: '重要客户信息，只有授权人员可见。' },
  {
    type: 'paragraph',
    strongLead: '持续收集反馈：',
    text: '每月收集销售、客服团队反馈，持续优化系统功能。',
  },
  { type: 'subheading', text: '常见问题解决建议' },
  { type: 'paragraph', strongLead: '客户资料混乱：', text: '定期检查、去重、完善关键信息。' },
  { type: 'paragraph', strongLead: '跟进提醒失效：', text: '设置自动提醒，确保每个商机不错过。' },
  {
    type: 'paragraph',
    strongLead: '数据分析难：',
    text: '善用CRM自带的报表工具，按月输出客户转化率、销售漏斗等图表。',
  },
  {
    type: 'paragraph',
    strongLead: '典型案例参考：',
    text: ' 某制造企业用销帮帮CRM系统后，员工离职再也不担心客户信息丢失，新人一键接管，客户服务不中断，团队协作效率提升30%以上。',
  },
  { type: 'subheading', text: '4、适合中小企业的CRM系统选型与实施建议总结表' },
  {
    type: 'table',
    headers: ['关键环节', '推荐做法', '常见误区/对策'],
    rows: [
      ['需求梳理', '业务流程、字段先简后繁', '盲目套模板，需求不匹配'],
      ['试点上线', '小团队试点，收集反馈', '一步到位全员推，易反感'],
      ['培训支持', '种子用户带动，管理层重视', '一次性培训，后续无人管'],
      ['数据安全', '权限分级，定期备份', '权限滥设，数据泄露风险'],
      ['持续优化', '月度反馈，灵活调整流程', '一成不变，员工用不下去'],
    ],
  },
  {
    type: 'paragraph',
    text: 'CRM不是万能钥匙，而是企业数字化升级、精细化运营的基础设施。选对系统、用对方法，客户资产才能真正沉淀下来，业务增长自然水到渠成。',
  },
  { type: 'heading', text: '🏁四、结语：中小企业客户管理升级，从选对CRM开始' },
  {
    type: 'paragraph',
    text: '中小企业的成长，离不开对客户资源的专业管理和科学运营。CRM系统正是帮助企业实现客户资料沉淀、销售流程标准化、团队协作高效化的利器。通过对主流CRM管理系统的对比分析和实施建议梳理，相信你已经能根据自身实际需求做出更明智的选择。',
  },
  {
    type: 'paragraph',
    text: '销帮帮CRM系统凭借零代码开发、极强灵活性和2000w+用户的口碑，是中小企业数字化转型的首选。别再让客户信息流失、销售跟进掉链子，从现在开始体验专业CRM带来的高效与增长！',
  },
  {
    type: 'paragraph',
    strongLead: '立即体验：',
    text: ' 销帮帮CRM系统模板在线试用：https://www.xbongbong.com/',
  },
]

export const knowledgeQnAFaqCategories: FaqCategory[] = [{ key: 'all', label: '全部' }]

export const knowledgeQnAFaqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question:
      '老板让我选个靠谱的CRM系统，市面上的产品太多了，有没有懂行的朋友帮我推荐几款适合中小企业的？最好能说说实际体验！',
    answer:
      '很多中小企业在选CRM的时候都会犯选择恐惧症，感觉每个平台都说自己好，但到底哪个好用、性价比高、适合咱们中小企业，真的一头雾水。有没有实际用过的朋友能分享下经验？求避坑、求推荐！<br /><br />嗨，这个问题我去年刚踩过坑，正好有些心得可以分享。市面上CRM系统确实很多，但中小企业用的核心就是：价格合适、功能够用、扩展方便、容易上手。<br /><br /><strong>销帮帮CRM：</strong>这个我首推，市占率高，支持零代码配置，团队自己改业务流程特别灵活。像客户分级、销售漏斗、跟进记录、数据分析等全都有，而且界面很友好，不用IT基础也能搞定。关键是能免费试用，适合预算有限但想上系统的公司。 销帮帮CRM系统模板在线试用：https://www.xbongbong.com/ 销售易CRM：老牌厂商，移动端功能强，适合销售外出多的团队。就是价格偏高，适合预算稍宽裕的企业。 有赞CRM：如果你有电商业务或者私域流量需求，这款会更贴合。和有赞的商城、会员体系等打通，适合做私域运营的公司。 畅捷通T+CRM：国产软件，偏财务+客户管理一体化，适合需要财务数据联动的企业。 选CRM真的别冲动，建议先试用，看团队能不能接受、有没有用得上的功能，再谈价格和后续服务。销帮帮我个人体验下来，灵活度和性价比确实很好。还有啥具体需求可以补充，一起讨论下！',
    category: 'all',
  },
  {
    id: 'faq-2',
    question: '用CRM系统到底能帮中小企业解决哪些实际问题？有没有人能举点具体例子，别只说概念啊！',
    answer:
      '很多CRM的介绍都说得天花乱坠，说什么“提升效率”“打通数据”，但对我们中小企业来说，实际能解决的问题是哪些？有没有真实案例或具体场景，能让我们老板一听就明白的？<br /><br />你好，问题问得很接地气。我也是带团队用CRM两年多，真心觉得只有解决实际痛点才值得花这钱。给你讲几个我们碰到的实际场景：<br /><br />客户资料分散，员工一走客户全带走。用CRM后，所有客户信息、跟进记录都在系统，谁离职也不怕客户流失。 销售人员跟进进度混乱，漏跟、忘记回访。CRM有提醒、日程、待办功能，客户跟踪不再凭记忆，丢单率明显下降。 数据统计麻烦，月底做报表头大。CRM自带数据分析，想看成交率、回款、客户来源，点几下就有图表，老板决策更快。 团队协作难，信息不同步。比如销帮帮CRM支持微信、邮件等多渠道集成，销售、客服、老板都能随时查进度，减少内耗。 我们公司用CRM后，客户转介绍率提升了20%，销售流程缩短三分之一。不是说CRM万能，但对于团队管理、信息透明、效率提升真的很有帮助。不同公司痛点不同，建议先梳理下自己的需求，再去试用匹配的系统。',
    category: 'all',
  },
  {
    id: 'faq-3',
    question: '刚上线CRM系统，团队有人抗拒不愿用，老板头疼怎么办？有没有实用的落地建议？',
    answer:
      'CRＭ系统买回来了，结果销售、客服都不太愿意用，有人觉得麻烦，有人怕数据被查，老板叫我想办法推行。有没有哪位大佬踩过坑，能分享下怎么让团队愿意用CRM？最好有实操建议！<br /><br />这个问题太真实了，很多公司买了CRM但成了“摆设”，主要还是团队没用起来。我们公司也遇到过，后来总结了几点经验——<br /><br />先让核心骨干（比如销售经理）试用，发现有利于业绩、考核的数据，自己愿意用起来，带头示范效果最好。 功能设置不要一上来就全用，先从客户录入、跟进、提醒三项最基础的切入，让大家觉得比手写、Excel方便，降低心理门槛。 适当“物质激励”+“数据挂钩”，比如月度业绩对CRM数据采集质量有要求，做得好的有奖励。 持续收集反馈，有什么不习惯的地方及时优化流程。像销帮帮CRM这种支持零代码自定义，能根据大家习惯调整页面和表单，团队满意度提升很快。 老板要带头用数据说话，每周例会用CRM报表分析业绩，让大家看到系统的实际价值。 推行CRM其实是管理变革，一开始肯定有阻力，但只要选对工具、流程灵活、激励到位，慢慢就能落地。可以从业务痛点出发，别太理想化，实用比花哨更重要。有什么难点欢迎补充，咱们一起想办法。',
    category: 'all',
  },
]

export const knowledgeSceneSolutionItems: ArticleSidebarTocItem[] = [
  { id: 'omni-channel-marketing', title: '全渠道营销', href: '/jiejuefangan/quanqudaoyingxiao' },
  { id: 'opportunity-management', title: '商机管理', href: '/jiejuefangan/shangjiguanli' },
  { id: 'lead-management', title: '线索管理', href: '/jiejuefangan/xiansuoguanli' },
  { id: 'sales-funnel', title: '销售漏斗', href: '/jiejuefangan/xiaoshouloudou' },
  { id: 'order-management', title: '订单管理', href: '/jiejuefangan/dingdanguanli' },
  { id: 'customer-management', title: '客户管理', href: '/kehuguanli' },
  { id: 'member-management', title: '会员管理', href: '/jiejuefangan/huiyuanguanli' },
  { id: 'purchase-management', title: '订货管理', href: '/jiejuefangan/dinghuoguanli' },
  { id: 'device-management', title: '设备管理', href: '/jiejuefangan/shebeiguanli' },
  { id: 'work-order-management', title: '工单管理', href: '/jiejuefangan/gongdanguanli' },
]

export const knowledgeQnAArticles: KnowledgeArticle[] = [
  {
    slug: 'crm-system-recommendation-for-smb',
    title: knowledgeQnAHeader.title,
    summary: knowledgeQnAHeader.intro,
    author: '销帮帮',
    publishDate: '2026-8-4',
    updatedAt: '2026-8-4 10:14:06',
    image: '/images/article-sidebar/crm-template.png',
    imageAlt: knowledgeQnAHeader.title,
    blocks: knowledgeQnAArticleBlocks,
    faqCategories: knowledgeQnAFaqCategories,
    faqItems: knowledgeQnAFaqItems,
  },
]

export const knowledgeArticleList: ContentCard[] = knowledgeQnAArticles.map((article) => ({
  image: article.image,
  imageAlt: article.imageAlt,
  title: article.title,
  description: article.summary,
  summary: article.summary,
  publishDate: article.publishDate,
  updatedAt: article.updatedAt,
  author: article.author,
  linkHref: `/zhishiwenda/${article.slug}`,
}))

export function getKnowledgeArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return knowledgeQnAArticles.find((article) => article.slug === slug)
}
