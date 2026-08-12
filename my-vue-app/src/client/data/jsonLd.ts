import type { SiteSettings } from '@/client/stores/siteSettings'

/**
 * 页面支持的 JSON-LD 结构化数据类型。
 *
 * - `Organization` — 组织信息（公司名称、Logo、描述、联系方式）
 * - `WebSite` — 网站信息（含搜索框，仅首页）
 * - `BreadcrumbList` — 面包屑导航（每个页面）
 * - `Product` — 产品信息（功能/能力介绍页）
 */
export type JsonLdType = 'Organization' | 'WebSite' | 'BreadcrumbList' | 'Product'

/**
 * 按路由 path 定义面包屑名称。
 * 仅包含有独立页面的路由，子页面（如 /hangyeanli/:id）不在此列。
 */
const BREADCRUMB_MAP: Record<string, string> = {
  '/': '首页',
  '/chanpin': '产品功能',
  '/kehuguanli': '客户管理',
  '/xiaoshouguanli': '销售管理',
  '/shichangguanli': '市场管理',
  '/bi': 'BI 分析',
  '/ai': 'AI 销售助理',
  '/paas': 'PaaS 平台',
  '/dingtalk': '钉钉版本',
  '/feishubanben': '飞书版本',
  '/qiweibanben': '企业微信版本',
  '/gongsidongtai': '新闻动态',
  '/hangyeanli': '行业案例',
  '/yonghuxinsheng': '用户心声',
  '/zhishiwenda': '知识问答',
  '/gongsijianjie': '公司介绍',
  '/lianxiwomen': '联系我们',
  '/mianfeishiyong': '免费试用',
  '/liuzi': '免费试用',
  '/huobanhezuo': '伙伴合作',
  '/jianzheyoufen': '推广大使',
  '/youzhifuwu': '优质服务',
  '/xiazaizhongxin': '下载中心',
}

/** 面包屑层级定义：部分页面有父级路径 */
const BREADCRUMB_PARENTS: Record<string, string> = {
  '/kehuguanli': '/chanpin',
  '/xiaoshouguanli': '/chanpin',
  '/shichangguanli': '/chanpin',
  '/bi': '/chanpin',
  '/ai': '/chanpin',
  '/paas': '/chanpin',
}

/** 站点基础信息 — 用于 Organization / WebSite JSON-LD */
const SITE_URL = 'https://www.xbongbong.com'
const SITE_NAME = '销帮帮CRM'
const SITE_DESCRIPTION = '销帮帮CRM是专业的客户关系管理系统，提供客户管理、销售管理、市场管理、BI分析等一站式数字化销售解决方案。'

/* ========== JSON-LD 生成函数 ========== */

/**
 * 生成 Organization JSON-LD（组织信息）。
 * 百度支持，用于在搜索结果中展示企业信息。
 */
function buildOrganization(store?: SiteSettings | null): Record<string, unknown> {
  return {
    '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: store?.company || SITE_NAME,
    url: SITE_URL,
    logo: store?.logo || `${SITE_URL}/logo_blank.png`,
    description: store?.descs || SITE_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: store?.tel || '+86-4000-464-288',
      contactType: 'customer service',
    },
  }
}

/**
 * 生成 WebSite JSON-LD（网站信息，含站内搜索）。
 * 仅首页注入，帮助百度理解网站结构。
 */
function buildWebSite(): Record<string, unknown> {
  return {
    '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * 生成 BreadcrumbList JSON-LD（面包屑导航）。
 * 根据当前路由 path 和 BREADCRUMB_MAP 自动构建层级。
 */
function buildBreadcrumbList(path: string): Record<string, unknown> {
  const items: Array<{ '@type': string; position: number; name: string; item: string }> = []

  // 首页始终在第一条
  items.push({
    '@type': 'ListItem',
    position: 1,
    name: '首页',
    item: SITE_URL,
  })

  // 如果当前页面有父级路径，先添加父级
  const parent = BREADCRUMB_PARENTS[path]
  if (parent && BREADCRUMB_MAP[parent]) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: BREADCRUMB_MAP[parent],
      item: `${SITE_URL}${parent}`,
    })
  }

  // 当前页面（非首页时添加）
  if (path !== '/' && BREADCRUMB_MAP[path]) {
    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: BREADCRUMB_MAP[path],
      item: `${SITE_URL}${path}`,
    })
  }

  return {
    '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

/**
 * 生成 Product JSON-LD（产品信息）。
 * 仅产品/功能页注入，不包含价格信息（SaaS 按需询价）。
 */
function buildProduct(pageSeo: { title: string; description: string }): Record<string, unknown> {
  return {
    '@context': 'https://ziyuan.baidu.com/contexts/cambrian.jsonld',
    '@type': 'Product',
    name: pageSeo.title.replace(/ - 销帮帮.*$/, ''),
    description: pageSeo.description,
    category: '企业管理软件',
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
  }
}

/* ========== 入口函数 ========== */

/**
 * 根据页面 SEO 配置和路由 path 生成 JSON-LD 脚本数组。
 *
 * @param types    - 需要生成的 JSON-LD 类型
 * @param path     - 当前路由 path（用于 BreadcrumbList）
 * @param pageSeo  - 页面 SEO 元数据（用于 Product）
 * @param store    - 站点设置（用于 Organization 中的公司信息）
 */
export function generateJsonLd(
  types: JsonLdType[],
  path: string,
  pageSeo: { title: string; description: string },
  store?: SiteSettings | null,
): Array<{ type: 'application/ld+json'; textContent: string }> {
  const scripts: Array<{ type: 'application/ld+json'; textContent: string }> = []

  for (const type of types) {
    let data: Record<string, unknown> | null = null

    switch (type) {
      case 'Organization':
        data = buildOrganization(store)
        break
      case 'WebSite':
        if (path === '/') {
          data = buildWebSite()
        }
        break
      case 'BreadcrumbList':
        data = buildBreadcrumbList(path)
        break
      case 'Product':
        data = buildProduct(pageSeo)
        break
    }

    if (data) {
      scripts.push({
        type: 'application/ld+json',
        textContent: JSON.stringify(data),
      })
    }
  }

  return scripts
}