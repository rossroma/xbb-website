import { toPagePath } from '@/client/data/routePaths'
import type { Component } from 'vue'
import {
  ApiAppFill,
  DataDisplayFill,
  PeoplesFill,
  RobotFill,
  RocketFill,
  TrendFill,
} from '@/client/components/ui/remixIcons'

/** 导航菜单图标 */
interface HeaderMenuIcon {
  src?: string
  component?: Component
  width: number
  height: number
  marginRight?: number
  marginLeft?: number
}

/** 导航节点 */
export interface HeaderNavNode {
  label: string
  desc: string
  to?: string
  hash?: string
  legacyPath?: string
  icon?: HeaderMenuIcon
}

/** 巨型菜单 */
interface HeaderMegaMenu {
  overview: HeaderNavNode[]
  features: HeaderNavNode[]
}

/** 导航项 */
export interface HeaderNavItem extends HeaderNavNode {
  children?: HeaderNavNode[]
  mega?: HeaderMegaMenu
}

// ========== 产品中心子菜单数据 ==========

const productOverview: HeaderNavNode[] = [
  {
    label: '产品概述',
    desc: 'PRODUCT PRESENTATION',
    to: toPagePath('channel_products'),
  },
  {
    label: '模板中心',
    desc: 'TEMPLATE CENTER',
    to: 'https://module-center.xbongbong.com/preview.html#/application#wz_141',
  },
  { label: '体验产品', desc: 'PRODUCT TRIAL', to: toPagePath('single_mfsy') },
]

const productFeatures: HeaderNavNode[] = [
  {
    label: '客户管理',
    desc: '客户全生命周期数字化管理',
    to: '/kehuguanli',
    icon: { component: PeoplesFill, width: 18, height: 18 },
  },
  {
    label: '销售管理',
    desc: '精细化销售管理助力业绩增长',
    to: '/xiaoshouguanli',
    icon: { component: TrendFill, width: 18, height: 18 },
  },
  {
    label: '市场管理',
    desc: '全渠道营销获客，高效转化',
    to: '/shichangguanli',
    icon: { component: RocketFill, width: 18, height: 18 },
  },
  {
    label: 'PaaS',
    desc: '底层能力赋能商业个性化需求',
    to: '/paas',
    icon: { component: ApiAppFill, width: 18, height: 18 },
  },
  {
    label: 'AI销售助理',
    desc: '重塑销售作业流程，助力业绩增长',
    to: '/ai',
    icon: { component: RobotFill, width: 18, height: 18 },
  },
  {
    label: 'BI',
    desc: '数据驱动决策，洞察业务增长',
    to: '/bi',
    icon: { component: DataDisplayFill, width: 18, height: 18 },
  },
  {
    label: '销帮帮 X 钉钉',
    desc: '让进步发生，让业绩提升',
    to: '/dingtalk',
    icon: { src: '/images/dingtalk/dingding.svg', width: 18, height: 18 },
  },
  {
    label: '销帮帮 X 飞书',
    desc: '拥抱数字化，拥抱先进',
    to: '/feishubanben',
    icon: { src: '/images/feishu/feishu.svg', width: 18, height: 18 },
  },
  {
    label: '销帮帮 X 企业微信',
    desc: '强者结合，绝妙拍档',
    to: '/qiweibanben',
    icon: { src: '/images/qiwei/qiwei.svg', width: 18, height: 18 },
  },
]

// ========== 主导航数据 ==========

export const siteNavItems: HeaderNavItem[] = [
  { label: '首页', desc: '返回官网首页顶部', to: '/' },
  {
    label: '产品中心',
    desc: '查看产品矩阵与功能说明',
    to: toPagePath('channel_products'),
    children: [
      { label: '产品功能', desc: '产品功能', hash: '#products' },
      { label: 'AI CRM', desc: 'AI CRM', hash: '#' },
    ],
    mega: { overview: productOverview, features: productFeatures },
  },
  {
    label: '案例中心',
    desc: '查看客户案例与行业实践',
    to: toPagePath('list_cases'),
    children: [
      { label: '行业案例', desc: '行业案例', to: '/hangyeanli' },
      { label: '客户心声', desc: '客户心声', to: '/yonghuxinsheng' },
    ],
  },
  {
    label: '客户服务',
    desc: '查看服务与使用支持内容',
    to: toPagePath('channel_changjingshalong'),
    children: [
      {
        label: '优质服务',
        desc: '售前、实施、服务协同',
        to: toPagePath('channel_changjingshalong'),
      },
      {
        label: '常见问题',
        desc: '高频选型问题答疑',
        to: 'https://help.xbongbong.com/?p=306#wz_25',
      },
    ],
  },
  {
    label: '下载中心',
    desc: '进入试用与下载入口',
    to: toPagePath('single_download'),
  },
  {
    label: '关于我们',
    desc: '查看品牌与联系信息',
    to: toPagePath('channel_aboutus'),
    children: [
      { label: '公司介绍', desc: '公司介绍', to: '/gongsijianjie' },
      { label: '新闻动态', desc: '新闻动态', to: toPagePath('list_news') },
      { label: '知识问答', desc: 'CRM 选型与实践问答', to: toPagePath('knowledge_qna') },
      { label: '联系我们', desc: '联系我们', to: toPagePath('list_contact') },
    ],
  },
  {
    label: '渠道合作',
    desc: '查看渠道合作与推广信息',
    to: toPagePath('channel_qudao'),
    children: [
      { label: '伙伴合作', desc: '伙伴合作', to: toPagePath('channel_qudao') },
      { label: '推广大使', desc: '推广大使', to: toPagePath('channel_cooperation') },
    ],
  },
]

/** 试用页路由 */
export const trialRoute = toPagePath('single_mfsy')

/** 客服热线 */
export const siteHotline = '4000-464-288'
