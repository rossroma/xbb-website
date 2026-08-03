import type { Component } from 'vue'
import { Wechat, Phone, Rocket, Up, User } from '@icon-park/vue-next'
import floatingServiceIcon from '../../../../statics/home/images/cservice.png'
import floatingQrCode from '../../../../statics/home/images/sdr_contact_me_qr.png'

/** 工具栏项类型 */
export interface ToolbarItem {
  /** 唯一标识 */
  key: string
  /** 图标 */
  icon: Component
  /** 标签文字 */
  label: string
  /** 交互类型 */
  type: 'link' | 'qrcode' | 'phone' | 'route'
  /** 链接地址（type=link 时） */
  href?: string
  /** 二维码图片（type=qrcode 时） */
  qrImage?: string
  /** 电话号码（type=phone 时） */
  phoneNumber?: string
  /** 路由地址（type=route 时） */
  routeTo?: string
  /** 是否新窗口打开 */
  external?: boolean
}

/** 浮动工具栏数据 */
export const floatingToolbarData = {
  /** 客服链接（百度商桥） */
  customerServiceLink:
    'https://affim.baidu.com/unique_78988184/chat?siteId=23046108&userId=78988184&siteToken=292fc0a44e2b7502192cb96882a1ac9b',
  /** 客服热线 */
  hotline: '4000-464-288',
  /** 客服图标 */
  serviceIcon: floatingServiceIcon,
  /** 微信二维码 */
  qrCode: floatingQrCode,
  /** 工具栏项 */
  items: [
    {
      key: 'service',
      icon: User,
      label: '在线客服',
      type: 'link',
      href: 'https://affim.baidu.com/unique_78988184/chat?siteId=23046108&userId=78988184&siteToken=292fc0a44e2b7502192cb96882a1ac9b',
      external: true,
    },
    {
      key: 'wechat',
      icon: Wechat,
      label: '微信咨询',
      type: 'qrcode',
      qrImage: floatingQrCode,
    },
    {
      key: 'phone',
      icon: Phone,
      label: '客服热线',
      type: 'phone',
      phoneNumber: '4000-464-288',
    },
    {
      key: 'trial',
      icon: Rocket,
      label: '立即体验',
      type: 'route',
      routeTo: '/message',
    },
  ] as readonly ToolbarItem[],
}
