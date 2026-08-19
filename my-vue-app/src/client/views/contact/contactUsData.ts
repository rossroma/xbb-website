// ========== 联系我们页面 SEO 配置 ==========
import type { BannerSlide } from '@/client/data/homeData'
import type { AddressTabItem } from '@/client/components/business/AddressTabs.vue'
import { footerEmail, footerHotline, socials as footerSocials } from '@/client/data/siteFooterData'
import { toPagePath } from '@/client/data/routePaths'
import type { ContactCardItem } from '@/client/components/business/ContactCard.vue'
import { Headset, Mail, Message, Phone, ShareSys } from '@/client/components/ui/remixIcons'

const addressImageHangzhou = '/images/contact/hangzhou.png'
const addressMapImageBeijing = '/images/contact/beijing.png'
const addressMapImageShanghai = '/images/contact/shanghai.png'
const addressMapImageShenzhen = '/images/contact/shenzhen.png'
const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 ==========
export const heroSection = {
  title: '联系我们',
  primaryCta: '免费试用',
 bg: "url('/images/contact/hero-banner.png') center / cover no-repeat",
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide: BannerSlide = {
  key: 'contact-us-hero',
  mediaType: 'image',
  title: heroSection.title,
  desc: '留下联系方式，专业顾问将尽快与您取得联系，提供产品演示与解决方案',
  primaryCta: heroSection.primaryCta,
  primaryHref: trialPagePath,
  bg: heroSection.bg,
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: false,
}

// ========== 联系方式区域（ContactCard） ==========
export const contactInfoSection = {
  cards: [
    {
      title: '售前咨询',
      description: ['了解产品详情、预约专属演示','获取您的专属解决方案与报价'],
      value: footerHotline,
      href: `tel:${footerHotline}`,
      icon: Message,
      valueIcon: Phone,
      iconClass: 'text-[#31c4d1]',
      valueClass: 'text-[#31c4d1]',
    },
    {
      title: '售后服务',
      description: ['产品操作指导、使用培训与功能答疑','工作时段专人值守，确保团队快速上手'],
      value: '0571-2883-4699',
      href: 'tel:0571-2883-4699',
      icon: Headset,
      valueIcon: Phone,
      valueClass: 'text-brand-accent',
    },
    {
      title: '官方邮箱',
      description: ['渠道代理、市场合作、生态共建','商务活动、品牌联合与资源对接'],
      value: footerEmail,
      href: `mailto:${footerEmail}`,
      icon: Mail,
      valueIcon: Mail,
      valueClass: 'text-brand-primary',
    },
    {
      title: '关注我们',
      description: ['获取产品更新、行业洞察与客户案例','参与用户活动，享专属客户权益通道'],
      type: 'socials',
      icon: ShareSys,
      iconClass: 'text-fs-icon-green',
      socials: footerSocials,
    },
  ] satisfies ContactCardItem[],
}

// ========== 公司地址区域（来源：app/views/single_contact.php 公司地址模块） ==========
export const addressSection = {
  title: '公司地址',
  cards: [
    {
      title: '杭州（总部）',
      description: '杭州市滨江区滨盛路1505号银丰大厦17层',
      image: addressImageHangzhou,
      imageAlt: '杭州总部地图',
    },
    {
      title: '北京',
      description: '北京市朝阳区朝外大街乙12号办公楼2601房间',
      image: addressMapImageBeijing,
      imageAlt: '北京公司地图',
    },
    {
      title: '上海',
      description: '上海市杨浦区昆明路739号文通大厦1009室',
      image: addressMapImageShanghai,
      imageAlt: '上海公司地图',
    },
    {
      title: '深圳',
      description: '南山区高新南九道53号航空航天大厦2号楼801室',
      image: addressMapImageShenzhen,
      imageAlt: '深圳公司地图',
    }
  ] satisfies AddressTabItem[],
}

// ====================================================================
// Ads 数据适配器 — 将后台广告数据映射为组件 props
// ====================================================================

import type { Ads } from '@/shared/api/ads'

/**
 * 将 Ads 广告数据转换为公司地址卡片列表
 * API 数据为空时自动回退到硬编码的 addressSection.cards
 */
export function adsToAddressCards(ads: Ads[]): AddressTabItem[] {
  if (!ads?.length) return addressSection.cards
  return ads
    .slice()
    .sort((a, b) => a.ord - b.ord)
    .map((ad) => ({
      title: ad.title,
      description: ad.descs || '',
      image: ad.simg || '',
      imageAlt: `${ad.title}地图`,
      mapLabel: ad.title,
      hotline: footerHotline,
      email: footerEmail,
    }))
}
