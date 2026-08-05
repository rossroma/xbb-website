// ========== PaaS 页面 SEO 配置 ==========
import {
  AllApplication,
  ApiApp,
  Branch,
  DataDisplay,
  Filter,
  FolderPlus,
  LinkCloud,
  Shield,
  Thunderbolt,
  Trend,
} from '@icon-park/vue-next'
import type { TabShowcaseItem } from '@/client/components/business/TabShowcase.vue'
import { toPagePath } from '@/client/data/routePaths'

const blankShowcaseImage = '/images/paas/blank-showcase.svg'
const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'

export const paasSeo = {
  title: 'PaaS - 销帮帮 CRM',
  description:
    '销帮帮 CRM PaaS 底层能力，支持自定义表单、流程引擎、权限管理、BI 引擎、低代码二开与开放 API，快速适配企业个性化业务需求。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: 'PaaS',
  subtitle: '底层能力赋能商业个性化需求',
  primaryCta: '免费试用',
  secondaryCta: '立即咨询',
  secondaryHref: liuziPagePath,
  primaryHref: trialPagePath,
  image: blankShowcaseImage,
  imageAlt: 'PaaS 产品能力展示',
  bg: 'linear-gradient(135deg, #fef9f3 0%, #fef5eb 52%, #f8f5fb 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide = {
  key: 'paas-hero',
  mediaType: 'image' as const,
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: heroSection.primaryHref,
  secondaryCta: heroSection.secondaryCta,
  secondaryHref: heroSection.secondaryHref,
  bg: heroSection.bg,
  line: 'rgba(255, 100, 0, 0.16)',
  accent: '#ff6400',
  glow: 'rgba(255, 100, 0, 0.18)',
  orb: 'rgba(255, 154, 77, 0.22)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
}

// ========== PaaS 能力总览区域（CTASection） ==========
export const capabilityIntroSection = {
  title: '完美的 PaaS 底层能力可以赋能您的整个商业流程',
  description:
    '销帮帮 PaaS 底层能力助力企业应对与日俱增的业务挑战，实现系统与企业个性化需求的快速适配。',
  image: blankShowcaseImage,
  imageAlt: 'PaaS 底层能力展示占位图',
  primaryCta: '立即咨询',
  primaryHref: liuziPagePath,
}

// ========== 业务搭建能力区域（TabShowcase，左文右图） ==========
export const businessBuildSection = {
  title: '自定义表单、流程引擎、权限管理',
  tabs: [
    {
      key: 'custom-form',
      label: '自定义表单',
      description: '拖拉拽即可搭建业务表单，30+字段类型、100+函数公式，表单间数据联动随需配置。',
      image: blankShowcaseImage,
      imageAlt: '自定义表单功能展示占位图',
      badgeIcon: AllApplication,
    },
    {
      key: 'workflow-engine',
      label: '流程引擎',
      description: '预设审批流程即可自动流转，支持条件分支、阶段推进器，告别手动切换录入。',
      image: blankShowcaseImage,
      imageAlt: '流程引擎功能展示占位图',
      badgeIcon: Branch,
    },
    {
      key: 'permission-management',
      label: '权限管理',
      description: '角色权限穿透到单张表单和单条数据，支持按成员字段动态设置共享权限。',
      image: blankShowcaseImage,
      imageAlt: '权限管理功能展示占位图',
      badgeIcon: Shield,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 开放平台能力区域（TabShowcase，右文左图） ==========
export const openPlatformSection = {
  title: 'BI 引擎、云叩低代码、OPEN API',
  tabs: [
    {
      key: 'bi-engine',
      label: 'BI 引擎',
      description: '智能仪表盘自动获取表单数据，一键生成可视化图表，重要指标直达首页看板。',
      image: blankShowcaseImage,
      imageAlt: 'BI 引擎功能展示占位图',
      badgeIcon: DataDisplay,
    },
    {
      key: 'low-code',
      label: '云叩低代码',
      description: '不只是低代码，而是一套完整的二开方案。用更普惠的技术，驱动更高价值的业务。',
      image: blankShowcaseImage,
      imageAlt: '云叩低代码功能展示占位图',
      badgeIcon: Thunderbolt,
    },
    {
      key: 'open-api',
      label: 'OPEN API',
      description: '开放 API 接口连接不同系统平台，打破数据孤岛，数据联动不再依靠手动导出导入。',
      image: blankShowcaseImage,
      imageAlt: 'OPEN API 功能展示占位图',
      badgeIcon: ApiApp,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== 细节能力区域（TabShowcase，左文右图） ==========
export const detailCapabilitySection = {
  title: '不止于基础，更能深入细节',
  description: '从字段联动到数据回溯，从多模板管理到文档预览——每一个细节，都经过真实业务的打磨。',
  tabs: [
    {
      key: 'field-linkage',
      label: '字段自动联动，减少重复填写',
      description:
        '从字段联动到数据回溯，从多模板管理到文档预览——每一个细节，都经过真实业务的打磨。当用户选择特定字段选项时，系统可自动带出相关信息，支持文本、富文本、图片、附件等内容跨表单联动，减少手动录入和信息遗漏。',
      image: blankShowcaseImage,
      imageAlt: '字段自动联动功能展示占位图',
      badgeIcon: LinkCloud,
    },
    {
      key: 'business-relation',
      label: '业务数据关联，形成完整闭环',
      description:
        '客户、联系人、商机、合同等数据可灵活关联，支持本表关联、多模板关联和新建时自动填充，让复杂业务关系在系统中清晰可追踪。',
      image: blankShowcaseImage,
      imageAlt: '业务数据关联功能展示占位图',
      badgeIcon: Branch,
    },
    {
      key: 'cascade-filter',
      label: '层级筛选跟随，录入更高效',
      description: '上级字段选择后，下级选项自动过滤，帮助用户更快找到正确选项，降低填错概率。',
      image: blankShowcaseImage,
      imageAlt: '层级筛选跟随功能展示占位图',
      badgeIcon: Filter,
    },
    {
      key: 'sub-form',
      label: '子表单更好用，复杂信息也清楚',
      description:
        '多行文本自适应展示，支持展开收起，移动端采用更适合阅读的纵向平铺样式。报价明细、拜访记录、产品清单等复杂信息查看更顺畅。',
      image: blankShowcaseImage,
      imageAlt: '子表单功能展示占位图',
      badgeIcon: FolderPlus,
    },
    {
      key: 'opportunity-process',
      label: '商机推进更顺，过程更可控',
      description:
        '阶段任务完成后自动勾选，流失原因支持多级选择，并可在推进过程中直接新建关联数据，让销售推进商机时少跳转、少遗漏。',
      image: blankShowcaseImage,
      imageAlt: '商机推进功能展示占位图',
      badgeIcon: Trend,
    },
  ] as readonly TabShowcaseItem[],
}

// ========== Footer CTA 区域 ==========
export const footerCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  secondaryCta: '预约产品演示',
}
