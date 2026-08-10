import type { Component } from 'vue'
import { Wechat, Phone, Rocket } from '@/client/components/ui/remixIcons'

const floatingServiceIcon = '/images/cservice.png'
const floatingQrCode = '/images/sdr_contact_me_qr.png'

/** 工具栏项类型 */
export interface ToolbarItem {
  /** 唯一标识 */
  key: string
  /** 图标 */
  icon: Component
  /** 标签文字 */
  label: string
  /** 交互类型 */
  type: 'qrcode' | 'phone' | 'route'
  /** 二维码图片（type=qrcode 时） */
  qrImage?: string
  /** 电话号码（type=phone 时） */
  phoneNumber?: string
  /** 路由地址（type=route 时） */
  routeTo?: string
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
      key: 'wechat',
      icon: Wechat,
      label: '微信',
      type: 'qrcode',
      qrImage: floatingQrCode,
    },
    {
      key: 'phone',
      icon: Phone,
      label: '热线',
      type: 'phone',
      phoneNumber: '4000-464-288',
    },
    {
      key: 'trial',
      icon: Rocket,
      label: '体验',
      type: 'route',
      routeTo: '/mianfeishiyong',
    },
  ] as readonly ToolbarItem[],
}
