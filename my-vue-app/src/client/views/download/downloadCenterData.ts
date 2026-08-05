// ========== 下载中心页面 SEO 配置 ==========
import type { PlatformDownloadCard } from '@/client/components/business/PlatformDownload.vue'


// ========== 各平台下载区域（PlatformDownload） ==========
export const downloadCenterSection = {
  title: '扫码体验，即刻上手',
  subtitle: '多端覆盖，随需而选。随时随地，高效销售。',
  platforms: [
    {
      name: '钉钉版',
      icon: '/images/download/dingup.png',
      qrCode: '/images/download/dingdown.jpg',
      iconAlt: '钉钉版下载入口',
      qrCodeAlt: '钉钉版下载二维码',
    },
    {
      name: '飞书版',
      icon: '/images/download/flyup.png',
      qrCode: '/images/download/flydown.jpg',
      iconAlt: '飞书版下载入口',
      qrCodeAlt: '飞书版下载二维码',
    },
    {
      name: '企微版',
      icon: '/images/download/wxup.png',
      qrCode: '/images/download/wxdown.jpg',
      iconAlt: '企微版下载入口',
      qrCodeAlt: '企微版下载二维码',
    },
    {
      name: '1688版本',
      icon: '/images/download/1688.png',
      qrCode: '/images/download/xbbdown.jpg',
      iconAlt: '1688版本下载入口',
      qrCodeAlt: '1688版本下载二维码占位图',
    },
    {
      name: '独立版',
      icon: '/images/download/xbbup.png',
      qrCode: '/images/download/xbbdown.jpg',
      iconAlt: '独立版下载入口',
      qrCodeAlt: '独立版下载二维码',
    },
  ] as PlatformDownloadCard[],
}
