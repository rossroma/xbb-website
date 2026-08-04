/** 页面 SEO 元数据 */
export interface PageSeoMeta {
  /** 页面标题（会显示在浏览器标签页和搜索结果中） */
  title: string
  /** 页面描述（搜索结果摘要，建议 120-160 字符） */
  description: string
}

/**
 * 静态页面的 SEO 配置，按路由 path 索引。
 *
 * 所有爬虫（百度、Google、AI 爬虫等）均不执行 JavaScript，
 * 预渲染时 Vue 组件在 Puppeteer 中运行，通过 `usePageSEO()` 读取此配置
 * 并写入 `<head>`，确保爬虫抓取到完整的 SEO 元数据。
 *
 * 对应路由定义见 `src/client/router.ts`。
 */
export const pageSeoConfig: Record<string, PageSeoMeta> = {
  '/': {
    title: '销帮帮 CRM - 企业增长型官网首页',
    description:
      '销帮帮 CRM 面向成长型企业提供线索管理、销售流程、客户服务与经营分析能力，帮助团队建立更高效的客户经营体系。',
  },

  // ===== 产品页 =====
  '/chanpin': {
    title: '产品概述 - 销帮帮AI CRM',
    description:
      '销帮帮AI CRM产品概述，覆盖CRM、市场管理、资金管理、工单管理、进销存、BI分析和AI能力。',
  },
  '/kehuguanli': {
    title: '客户管理 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 客户管理系统，支持客户全生命周期数字化管理，多维查重、客户画像、客户分层分类，构建企业潜在客户360°画像，提升企业私域客户池运作效率。',
  },
  '/xiaoshouguanli': {
    title: '销售管理 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 销售管理系统，AI 销售陪练助力团队能力提升，过程透明化让每一步有据可查，访客计划、签到管理、工作报告构建完整销售管理闭环。',
  },
  '/shichangguanli': {
    title: '市场管理 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 市场管理系统，支持官网、展会、电话、微信等全渠道线索统一汇入，沉淀跟进旅程，分析活动成效，提升线索转化效率。',
  },
  '/bi': {
    title: 'BI 分析 - 销帮帮 CRM',
    description:
      '销帮帮 CRM BI 分析能力，支持 Web 端和手机端查看仪表盘，自定义分析看板、多维度数据穿透与七大类初始化报表，让业务数据真正服务经营决策。',
  },
  '/ai': {
    title: 'AI 销售助理 - 销帮帮 CRM',
    description:
      '销帮帮 AI CRM 用 AI 驱动销售增长，支持以客找客、销售过程透明化、AI 陪练助手、AI 分析师和智能数据问答，重塑销售作业流程。',
  },
  '/paas': {
    title: 'PaaS - 销帮帮 CRM',
    description:
      '销帮帮 CRM PaaS 底层能力，支持自定义表单、流程引擎、权限管理、BI 引擎、低代码二开与开放 API，快速适配企业个性化业务需求。',
  },

  // ===== 平台版本页 =====
  '/dingtalk': {
    title: '销帮帮 X 钉钉 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 与钉钉协同，打通业务数据孤岛，支持客户管理、销售管理、市场管理、智能报表、流程引擎等核心能力，让销售管理更专业易用。',
  },
  '/feishubanben': {
    title: '销帮帮 X 飞书 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 与飞书协同，提供客户管理、销售管理、市场管理、智能报表、流程引擎等核心能力，让团队协作和业务服务真正无缝。',
  },
  '/qiweibanben': {
    title: '销帮帮 X 企业微信 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 与企业微信协同，提供客户管理、销售管理、市场管理、智能报表、流程引擎等核心能力，借助流量运营能力更高效地转化和服务客户。',
  },

  // ===== 内容页 =====
  '/gongsidongtai': {
    title: '新闻动态 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 最新动态与行业资讯，涵盖公司动态、行业动态、媒体报道，了解销帮帮最新产品功能与服务。',
  },
  '/hangyeanli': {
    title: '行业案例 - 销帮帮 CRM',
    description:
      '汇集制造业、互联网、教育、金融、零售、建材、服务等各行业客户的成功案例，了解销帮帮 CRM 如何助力企业实现数字化销售管理与业绩增长。',
  },
  '/yonghuxinsheng': {
    title: '用户心声 - 销帮帮 CRM',
    description:
      '汇集来自互联网、制造业、教育等各行业客户的真实评价，了解销帮帮 CRM 如何助力企业实现数字化销售管理。',
  },
  '/zhishiwenda': {
    title: '知识问答 - 销帮帮 CRM',
    description: '围绕中小企业 CRM 选型、实施与常见问题的知识问答页面。',
  },

  // ===== 公司页 =====
  '/gongsijianjie': {
    title: '公司介绍 - 销帮帮AI CRM',
    description:
      '杭州逍邦网络科技有限公司成立于2015年，是国内一线CRM品牌和企服领域知名品牌，致力为客户提供客户全生命周期管理和数字化销售管理服务。',
  },
  '/lianxiwomen': {
    title: '联系我们 - 销帮帮AI CRM',
    description: '联系销帮帮AI CRM，获取产品咨询、免费试用、服务热线、企业邮箱和公司地址信息。',
  },

  // ===== 转化页 =====
  '/mianfeishiyong': {
    title: '免费试用 - 销帮帮 CRM',
    description:
      '立即免费试用销帮帮CRM，开启高效客户管理之旅。智能客户管理、销售管理、数据分析，助力企业业绩增长。',
  },
  '/liuzi': {
    title: '免费试用 - 销帮帮 AI CRM',
    description:
      '免费试用销帮帮 AI CRM，体验 AI 找客、销售陪练、业务分析、客户管理、销售管理、市场管理、PaaS 和 BI 数据分析能力。',
  },
  '/huobanhezuo': {
    title: '伙伴合作 - 销帮帮AI CRM',
    description:
      '销帮帮AI CRM合作伙伴招募，面向渠道服务商、ISV伙伴与数字化业务团队开放合作，共享AI CRM增长红利。',
  },
  '/jianzheyoufen': {
    title: '推广大使 - 销帮帮AI CRM',
    description:
      '成为销帮帮推荐大使，推荐客户成功签约即可获得现金返佣。了解申请推荐、审核、下单购买与获得奖金的完整流程。',
  },
  '/youzhifuwu': {
    title: '优质服务 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 优质服务体系，提供帮助文档、视频教程、精品课程、直播培训、VIP售后群、专属服务和服务热线支持。',
  },
  '/xiazaizhongxin': {
    title: '下载中心 - 销帮帮 CRM',
    description:
      '销帮帮 CRM 下载中心，支持钉钉版、飞书版、1688版本、企微版、独立版与销帮帮AI CRM 多平台扫码体验，即刻上手。',
  },
}

/**
 * 根据路由 path 获取页面 SEO 配置。
 * 仅匹配静态路由，动态路由（如 `/gongsidongtai/:id`）返回 null。
 */
export function getPageSeo(pathname: string): PageSeoMeta | null {
  return pageSeoConfig[pathname] || null
}