// ========== 优质服务页面 SEO 配置 ==========
import {
  Bookshelf,
  CarouselVideo,
  FileText,
  Headset,
  PhoneTelephone,
  Time,
  VideoOne,
  Vip,
} from '@/client/components/ui/remixIcons'
import type { FeatureItem } from '@/client/components/business/IconCardGrid.vue'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

const heroImage = '/images/youzhikehubg.png'
const freeSupportImage = '/images/youzhibg1.png'
const premiumServiceImage = '/images/youzhibg3.png'
const vipServiceImage = '/images/youzhibg2.png'
const trialPagePath = toPagePath('single_mfsy')


// ========== Hero 区域 ==========
export const heroSection = {
  title: '优质服务',
  subtitle: '专业相伴，让系统真正落地',
  primaryCta: '免费试用',
  image: heroImage,
  imageAlt: '优质服务展示',
  bg: 'linear-gradient(135deg, #eaf6ff 0%, #edf4ff 52%, #f8fbff 100%)',
}

/** Hero Banner Slide 格式（供 HeroBanner mode="single" 使用） */
export const heroBannerSlide: BannerSlide = {
  key: 'service-hero',
  mediaType: 'image',
  eyebrow: '',
  title: heroSection.title,
  subtitle: heroSection.subtitle,
  desc: '',
  primaryCta: heroSection.primaryCta,
  primaryHref: trialPagePath,
  bg: heroSection.bg,
  line: 'rgba(74, 127, 217, 0.16)',
  accent: '#4a7fd9',
  glow: 'rgba(74, 127, 217, 0.18)',
  orb: 'rgba(14, 165, 233, 0.2)',
  showVisual: true,
  visualImage: heroSection.image,
  visualImageAlt: heroSection.imageAlt,
}

// ========== 服务 PLUS 区域（IconCardGrid） ==========
export const servicePlusSection = {
  title: '全心为您 服务PLUS',
  subtitle: '属于您的私人定制服务',
  features: [
    { title: '帮助文档', description: '', icon: FileText },
    { title: '视频教程', description: '', icon: VideoOne },
    { title: '精品课程', description: '', icon: Bookshelf },
    { title: '直播培训', description: '', icon: CarouselVideo },
    { title: 'VIP售后群', description: '', icon: Vip },
  ] as readonly FeatureItem[],
}

// ========== 图文展示区域（ImageShowcase） ==========
export const serviceShowcaseSections = [
  {
    key: 'free-support',
    title: '免费服务支持',
    subtitle:
      '品质服务·始终如一\n新手入门视频教程\n热门行业解决方案\n基础操作文档\n用户常见问题解答\n帮助中心进阶教程\n企业数字化落地精品课程',
    image: freeSupportImage,
    imageAlt: '免费服务支持展示',
    layout: 'text-left' as const,
  },
  {
    key: 'premium-service',
    title: '至尊服务',
    subtitle:
      '专业客服团队—尊享全方位服务\n一对一专属服务群\n一对一专家线上指导\n基础操作文档\n企业流程与产品功能匹配梳理\n梳理过程视频录制\n专家配置专属流程和表单',
    image: premiumServiceImage,
    imageAlt: '至尊服务展示',
    layout: 'text-right' as const,
  },
  {
    key: 'super-vip-service',
    title: '超级VIP服务',
    subtitle:
      '一对一专家线上指导\n一对一专家线上指导\n企业流程与产品功能匹配梳理\n梳理过程视频录制\n专家配置专属流程和表单\n免费上门服务',
    image: vipServiceImage,
    imageAlt: '超级VIP服务展示',
    layout: 'text-left' as const,
  },
]

// ========== 服务支持区域（IconCardGrid） ==========
export const supportSection = {
  title: '服务支持',
  subtitle: '及时响应·耐心解答·专业服务·值得信赖',
  features: [
    {
      title: '人工服务时间',
      description: '工作日：8:30-20:30\n非工作日：8:30-17:30',
      icon: Time,
    },
    {
      title: '服务热线',
      description: '400-464-288',
      icon: PhoneTelephone,
    },
    {
      title: '服务方式',
      description: '在线咨询\n钉钉VIP群服务\n定期售后VIP群直播',
      icon: Headset,
    },
  ] as readonly FeatureItem[],
}
