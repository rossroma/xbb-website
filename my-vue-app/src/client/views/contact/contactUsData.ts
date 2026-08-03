// ========== 联系我们页面 SEO 配置 ==========
import type { BannerSlide } from '@/client/data/homeData'
import type { ContentCard } from '@/client/components/business/ContentCardGrid.vue'
import { footerEmail, footerHotline, socials as footerSocials } from '@/client/data/siteFooterData'

const addressMapImage = '/images/nnlx_mimg.jpg'

export const contactUsSeo = {
  title: '联系我们 - 销帮帮AI CRM',
  description: '联系销帮帮AI CRM，获取产品咨询、免费试用、服务热线、企业邮箱和公司地址信息。',
}

// ========== Hero 区域 ==========
export const heroSection = {
  title: '联系我们',
  primaryCta: '免费试用',
  bg: 'linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide: BannerSlide = {
  key: 'contact-us-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  desc: '',
  primaryCta: heroSection.primaryCta,
  bg: heroSection.bg,
  line: 'rgba(116, 129, 255, 0.16)',
  accent: '#5b61ff',
  glow: 'rgba(91, 97, 255, 0.18)',
  orb: 'rgba(127, 214, 255, 0.22)',
  showVisual: false,
}

// ========== 联系方式区域（ContactCard） ==========
export const contactInfoSection = {
  hotline: footerHotline,
  email: footerEmail,
  socials: footerSocials,
}

// ========== 公司地址区域（来源：app/views/single_contact.php 公司地址模块） ==========
export const addressSection = {
  title: '公司地址',
  cards: [
    {
      title: '杭州（总部）',
      description: '杭州市滨江区滨盛路1505号银丰大厦17层',
      image: addressMapImage,
      imageAlt: '杭州总部地图',
    },
    {
      title: '北京',
      description: '朝阳区建国门外大街永安东里甲3号通用国际中心A座9层905-2',
      image: addressMapImage,
      imageAlt: '北京公司地图',
    },
    {
      title: '上海',
      description: '上海市杨浦区昆明路739号文通大厦1009室',
      image: addressMapImage,
      imageAlt: '上海公司地图',
    },
    {
      title: '深圳',
      description: '南山区高新南九道53号航空航天大厦2号楼801室',
      image: addressMapImage,
      imageAlt: '深圳公司地图',
    }
  ] satisfies ContentCard[],
}
