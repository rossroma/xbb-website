import type { PromoBannerSlide } from '@/client/components/business/PromoBannerCarousel.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'

// ========== 行业案例页面 SEO 配置 ==========

export const casesPageSeo = {
  title: '行业案例 - 销帮帮 CRM',
  description:
    '汇集制造业、互联网、教育、金融、零售、医疗等各行业客户的成功案例，了解销帮帮 CRM 如何助力企业实现数字化销售管理与业绩增长。',
}

// ========== Banner 轮播数据 ==========

export const casePromoSlides: PromoBannerSlide[] = [
  {
    key: 'case-manufacturing',
    eyebrow: '制造业',
    title: '数字化转型，从客户管理开始',
    ctaText: '了解详情',
    image: '/images/customer/tab-unified.png',
    imageAlt: '制造业案例',
  },
  {
    key: 'case-internet',
    eyebrow: '互联网',
    title: '高速增长，需要高效管理',
    ctaText: '了解详情',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '互联网案例',
  },
  {
    key: 'case-finance',
    eyebrow: '金融',
    title: '合规与增长并行',
    ctaText: '了解详情',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '金融案例',
  },
]

// ========== 分类 Tab 配置 ==========

/** 分类 Tab 项 */
export interface CaseCategoryTab {
  /** Tab 唯一标识 */
  key: string
  /** 显示文本 */
  label: string
}

/** 分类 Tab 列表 */
export const CASE_CATEGORY_TABS: CaseCategoryTab[] = [
  { key: 'all', label: '全部' },
  { key: 'manufacturing', label: '制造业' },
  { key: 'internet', label: '互联网' },
  { key: 'education', label: '教育' },
  { key: 'finance', label: '金融' },
  { key: 'retail', label: '零售' },
  { key: 'medical', label: '医疗' },
  { key: 'other', label: '其他' },
]

/** Tab key → tag 字段值的映射关系（用于筛选） */
export const CATEGORY_TAG_MAP: Record<string, string> = {
  manufacturing: '制造业',
  internet: '互联网',
  education: '教育',
  finance: '金融',
  retail: '零售',
  medical: '医疗',
  other: '其他',
}

// ========== 案例卡片数据 ==========

/** 静态案例数据 */
export const CASE_CARDS: ContentCard[] = [
  // ─── 制造业 ───
  {
    title: '某大型机械制造企业 CRM 数字化转型实践',
    image: '/images/customer/tab-unified.png',
    imageAlt: '机械制造企业案例',
    tag: '制造业',
    description:
      '通过销帮帮 CRM 实现从线索管理、客户跟进到订单交付的全流程数字化，销售团队工作效率提升 40%，客户满意度显著提高。',
    publishDate: '2025-12-15',
    linkHref: '/hangyeanli/676',
  },
  {
    title: '某电子制造企业客户管理升级之路',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '电子制造企业案例',
    tag: '制造业',
    description:
      '定制化生产场景下，销帮帮自定义字段和审批流程完美适配业务需求，交付周期缩短 30%，客户复购率提升 25%。',
    publishDate: '2025-11-20',
    linkHref: '/hangyeanli/677',
  },
  {
    title: '某化工企业销售管理数字化变革',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '化工企业案例',
    tag: '制造业',
    description:
      '销帮帮 AI 智能客户评分功能帮助精准识别高价值客户，销售资源分配更加合理，管理层对销售动态一目了然。',
    publishDate: '2025-10-08',
    linkHref: '/hangyeanli/678',
  },
  {
    title: '某汽车零部件企业销售效率提升实践',
    image: '/images/customer/tab-retention.png',
    imageAlt: '汽车零部件企业案例',
    tag: '制造业',
    description:
      '通过销帮帮移动端 CRM，销售团队在外出拜访客户时也能实时查看客户信息、记录跟进情况，客户响应速度提升 50%。',
    publishDate: '2025-09-12',
    linkHref: '/hangyeanli/679',
  },

  // ─── 互联网 ───
  {
    title: '某 SaaS 企业从 0 到 1 的客户管理体系搭建',
    image: '/images/customer/tab-unified.png',
    imageAlt: 'SaaS 企业案例',
    tag: '互联网',
    description:
      '创业初期即引入销帮帮 CRM，伴随企业从 10 人团队成长为 500 人规模，客户管理始终有条不紊。',
    publishDate: '2025-12-01',
    linkHref: '/hangyeanli/680',
  },
  {
    title: '某电商平台客户精细化运营实践',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '电商平台案例',
    tag: '互联网',
    description:
      '销帮帮帮助电商平台实现客户分层管理，针对不同等级客户制定差异化运营策略，大客户留存率提升 35%。',
    publishDate: '2025-11-15',
    linkHref: '/hangyeanli/681',
  },
  {
    title: '某在线教育企业客户全生命周期管理',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '在线教育企业案例',
    tag: '互联网',
    description:
      '从试听转化到续费留存，销帮帮覆盖学员全生命周期，试听转化率提升 28%，续费率提升 20%。',
    publishDate: '2025-10-22',
    linkHref: '/hangyeanli/682',
  },

  // ─── 教育 ───
  {
    title: '某职业培训机构学员管理数字化升级',
    image: '/images/customer/tab-retention.png',
    imageAlt: '职业培训机构案例',
    tag: '教育',
    description:
      '销帮帮帮助培训机构从纸质记录彻底转向数字化，学员跟进、课程推荐、续费提醒一气呵成，管理效率提升 60%。',
    publishDate: '2025-11-08',
    linkHref: '/hangyeanli/683',
  },
  {
    title: '某 K12 教育机构客户关系管理实践',
    image: '/images/customer/tab-unified.png',
    imageAlt: 'K12 教育机构案例',
    tag: '教育',
    description:
      '面对激烈的市场竞争，销帮帮帮助建立完整的客户生命周期管理体系，家长满意度提升，转介绍率增长 40%。',
    publishDate: '2025-10-15',
    linkHref: '/hangyeanli/684',
  },

  // ─── 金融 ───
  {
    title: '某城商行客户经理效能提升项目',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '城商行案例',
    tag: '金融',
    description:
      '销帮帮为银行客户经理提供移动化客户管理工具，外出拜访、客户维护更加便捷，人均管户数提升 30%。',
    publishDate: '2025-12-08',
    linkHref: '/hangyeanli/685',
  },
  {
    title: '某保险公司代理人数字化展业平台',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '保险公司案例',
    tag: '金融',
    description:
      '通过销帮帮 PaaS 平台定制保险行业专属 CRM，代理人展业效率大幅提升，人均产能增长 25%。',
    publishDate: '2025-11-25',
    linkHref: '/hangyeanli/686',
  },
  {
    title: '某证券公司客户服务数字化转型',
    image: '/images/customer/tab-retention.png',
    imageAlt: '证券公司案例',
    tag: '金融',
    description:
      '销帮帮满足金融行业数据安全合规要求，帮助证券公司实现客户分级服务，高净值客户满意度达到新高。',
    publishDate: '2025-10-30',
    linkHref: '/hangyeanli/687',
  },

  // ─── 零售 ───
  {
    title: '某连锁零售企业门店客户管理升级',
    image: '/images/customer/tab-unified.png',
    imageAlt: '连锁零售企业案例',
    tag: '零售',
    description: '销帮帮帮助连锁零售企业实现门店客户统一管理，会员营销精准度提升，复购率增长 30%。',
    publishDate: '2025-12-10',
    linkHref: '/hangyeanli/688',
  },
  {
    title: '某新消费品牌私域运营实践',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '新消费品牌案例',
    tag: '零售',
    description:
      '通过销帮帮客户标签和画像功能，品牌实现精准私域运营，社群转化率提升 45%，客单价增长 20%。',
    publishDate: '2025-11-18',
    linkHref: '/hangyeanli/689',
  },

  // ─── 医疗 ───
  {
    title: '某医疗器械企业销售合规管理',
    image: '/images/customer/tab-collaboration.png',
    imageAlt: '医疗器械企业案例',
    tag: '医疗',
    description:
      '销帮帮帮助医疗器械企业建立合规的客户管理流程，从资质审核到合同管理全流程可追溯，合规风险大幅降低。',
    publishDate: '2025-12-05',
    linkHref: '/hangyeanli/690',
  },
  {
    title: '某医药企业数字化营销转型',
    image: '/images/customer/tab-retention.png',
    imageAlt: '医药企业案例',
    tag: '医疗',
    description:
      '通过销帮帮 CRM，医药企业实现学术推广和客户拜访的数字化管理，拜访效率提升 35%，合规性显著增强。',
    publishDate: '2025-11-12',
    linkHref: '/hangyeanli/691',
  },

  // ─── 其他 ───
  {
    title: '某物流企业客户服务数字化升级',
    image: '/images/customer/tab-unified.png',
    imageAlt: '物流企业案例',
    tag: '其他',
    description:
      '物流行业客户分布广、需求多样，销帮帮客户分类和标签功能帮助实现精细化客户管理，服务响应速度提升 50%。',
    publishDate: '2025-12-12',
    linkHref: '/hangyeanli/692',
  },
  {
    title: '某建筑设计院项目型客户管理实践',
    image: '/images/customer/tab-tracking.png',
    imageAlt: '建筑设计院案例',
    tag: '其他',
    description:
      '销帮帮帮助建筑设计院实现项目型客户的全流程管理，从初次接触到项目交付，每个节点清晰可控。',
    publishDate: '2025-10-25',
    linkHref: '/hangyeanli/693',
  },
]
