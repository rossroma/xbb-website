/** 导航路径映射 — 集中管理所有页面 key → URL path 的映射关系 */
export type RoutePathConfig = {
  readonly key: string
  readonly path: string
  readonly name: string
  readonly pageKey: string
  readonly entryKey?: string
}

type RoutePathAlias = {
  readonly key: string
  readonly fullPath: string
}

export const routePaths = [
  {
    key: 'channel_products',
    path: 'chanpin',
    name: 'ClientProducts',
    pageKey: 'channel_products',
  },
  {
    key: 'product_price',
    path: 'chanpinjiage',
    name: 'ClientProductPrice',
    pageKey: 'product_price',
  },
  {
    key: 'list_cases',
    path: 'hangyeanli',
    name: 'ClientCases',
    pageKey: 'list_cases',
  },
  {
    key: 'channel_changjingshalong',
    path: 'youzhifuwu',
    name: 'ClientService',
    pageKey: 'channel_changjingshalong',
  },
  {
    key: 'single_download',
    path: 'xiazaizhongxin',
    name: 'ClientDownload',
    pageKey: 'single_download',
  },
  {
    key: 'channel_aboutus',
    path: 'gongsijianjie',
    name: 'ClientAbout',
    pageKey: 'channel_aboutus',
  },
  {
    key: 'channel_qudao',
    path: 'huobanhezuo',
    name: 'ClientQudao',
    pageKey: 'channel_qudao',
  },
  {
    key: 'single_mfsy',
    path: 'mianfeishiyong',
    name: 'ClientFreeTrial',
    pageKey: 'single_mfsy',
  },
  {
    key: 'paas',
    path: 'paas',
    name: 'PaaSPage',
    pageKey: 'paas',
  },
  {
    key: 'market_management',
    path: 'shichangguanli',
    name: 'MarketManagement',
    pageKey: 'market_management',
  },
  {
    key: 'bi_analysis',
    path: 'bi',
    name: 'BIAnalysis',
    pageKey: 'bi_analysis',
  },
  {
    key: 'ai_sales_assistant',
    path: 'ai',
    name: 'AISalesAssistant',
    pageKey: 'ai_sales_assistant',
  },
  {
    key: 'list_contact',
    path: 'lianxiwomen',
    name: 'ClientContact',
    pageKey: 'list_contact',
  },
  {
    key: 'list_news',
    path: 'gongsidongtai',
    name: 'ClientNews',
    pageKey: 'list_news',
  },
  {
    key: 'list_voices',
    path: 'yonghuxinsheng',
    name: 'ClientVoices',
    pageKey: 'list_voices',
  },
  {
    key: 'channel_cooperation',
    path: 'jianzheyoufen',
    name: 'ClientTuiguang',
    pageKey: 'channel_cooperation',
  },
] as const satisfies readonly RoutePathConfig[]

const routePathAliases = [
  { key: 'single_common', fullPath: '/chanpin' },
  { key: 'single_xbb', fullPath: '/chanpin' },
  { key: 'single_xbb2', fullPath: '/chanpin' },
  { key: 'xbb_paas', fullPath: '/chanpin' },
  { key: 'channel_shuzihuaxcs', fullPath: '/guanyuwomen' },
  { key: 'single_shuzihua', fullPath: '/guanyuwomen' },
  { key: 'single_sf', fullPath: '/guanyuwomen' },
  { key: 'single_service', fullPath: '/youzhifuwu' },
  { key: 'single_live', fullPath: '/youzhifuwu' },
  { key: 'single_tuiguang', fullPath: '/jianzheyoufen' },
  { key: 'list_tuiguang', fullPath: '/jianzheyoufen' },
  { key: 'single_market', fullPath: '/guanyuwomen' },
  { key: 'list_services', fullPath: '/youzhifuwu' },
] as const satisfies readonly RoutePathAlias[]

const routePathLookup = routePaths.reduce<Record<string, string>>((lookup, route) => {
  lookup[route.key] = `/${route.path}`
  return lookup
}, {})

for (const alias of routePathAliases) {
  routePathLookup[alias.key] = alias.fullPath
}

export const toPagePath = (pageKey: string): string => {
  return routePathLookup[pageKey] ?? '/'
}
