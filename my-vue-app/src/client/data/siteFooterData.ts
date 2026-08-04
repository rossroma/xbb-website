import type { Component } from 'vue'
import { Mail, Wechat, Tiktok } from '@icon-park/vue-next'
import { WechatVideo } from '@/client/components/ui/icons'
import { toPagePath } from '@/client/data/routePaths'

const footerWechatQr = '/images/wxImg.png'
const footerDouyinQr = '/images/code-douyin.png'
const footerWechatVideoQr = '/images/code-wechatVideo.png'

/** 页脚链接 */
export interface FooterLink {
  text: string
  href: string
}

/** 页脚操作按钮 */
export interface FooterAction {
  text: string
  href: string
  variant?: 'primary' | 'outline'
}

/** 页脚列 */
export interface FooterColumn {
  title: string
  links: FooterLink[]
  /** 操作按钮 */
  actions?: FooterAction[]
}

/** 社交图标 */
export interface SocialItem {
  label: string
  icon: Component
  qr: string
  qrText: string
}

/** 站点信息 */
export interface SiteInfo {
  company: string
  address: string
  tel: string
  phone: string
  email: string
  content2: string
}

/** 页脚导航列数据 */
export const footerColumns: FooterColumn[] = [
  {
    title: '产品中心',
    links: [
      { text: 'AI 销售助理', href: '/ai' },
      { text: '销帮帮 X 钉钉', href: '/dingtalk' },
      { text: '销帮帮 X 飞书', href: '/feishubanben' },
      { text: '销帮帮 X 企业微信', href: '/qiweibanben' },
    ],
  },
  {
    title: '案例中心',
    links: [
      {
        text: '模板中心',
        href: 'https://module-center.xbongbong.com/preview.html#/application#wz_141',
      },
      { text: '行业案例', href: '/hangyeanli' },
      { text: '客户心声', href: '/yonghuxinsheng' },
    ],
  },
  {
    title: '客户服务',
    links: [
      { text: '优质服务', href: toPagePath('channel_changjingshalong') },
      { text: '使用教程', href: 'https://help.xbongbong.com/?p=311' },
      { text: '常见问题', href: 'https://help.xbongbong.com/?p=306#wz_25' },
    ],
  },
  {
    title: '下载中心',
    links: [
      { text: '钉钉版', href: toPagePath('single_download') },
      { text: '企微版', href: toPagePath('single_download') },
      { text: '飞书版', href: toPagePath('single_download') },
      { text: '独立版', href: toPagePath('single_download') },
      { text: 'AI 助理', href: toPagePath('single_download') },
    ],
  },
  {
    title: '关于我们',
    links: [
      { text: '公司介绍', href: '/gongsijianjie' },
      { text: '新闻动态', href: toPagePath('list_news') },
      { text: '联系我们', href: toPagePath('list_contact') },
    ],
  },
  {
    title: '了解更多',
    links: [
      { text: '伙伴合作', href: toPagePath('channel_qudao') },
      { text: '推广大使', href: toPagePath('channel_cooperation') },
    ],
    actions: [
      { text: '下载销帮帮AI CRM', href: toPagePath('single_download'), variant: 'primary' },
      { text: '联系您的专属顾问', href: toPagePath('single_mfsy'), variant: 'outline' },
    ],
  },
]

/** 社交图标数据 */
export const socials: SocialItem[] = [
  { label: '微信', icon: Wechat, qr: footerWechatQr, qrText: '扫描二维码\n关注微信公众号' },
  { label: '视频号', icon: WechatVideo, qr: footerWechatVideoQr, qrText: '扫描二维码\n关注微信视频号' },
  { label: '抖音', icon: Tiktok, qr: footerDouyinQr, qrText: '扫描二维码\n关注抖音官方号' },
]

/** 站点联系信息默认值 */
export const defaultSiteInfo: SiteInfo = {
  company: '',
  address: '',
  tel: '',
  phone: '',
  email: '',
  content2: '',
}

/** 版权信息 */
export const copyrightText = '2017-2025 杭州逍邦网络科技有限公司 版权所有'

/** 服务热线 */
export const footerHotline = '4000-464-288'

/** 企业邮箱 */
export const footerEmail = 'xbb@xbongbong.com'
