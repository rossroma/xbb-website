import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSiteInfo } from '@/shared/api/settings'

/** 站点设置（客户端从 /v1/client/site-info 获取） */
export interface SiteSettings {
  title: string
  keyword: string
  descs: string
  company?: string
  logo?: string
  wap_logo?: string
  ico_logo?: string
  tel?: string
  phone?: string
  email?: string
  address?: string
  fax?: string
  postcode?: string
  content2?: string
  toolscode_top?: string
  toolscode_bottom?: string
}

export const useSiteSettingsStore = defineStore('siteSettings', () => {
  const settings = ref<SiteSettings | null>(null)
  const loaded = ref(false)

  async function fetch() {
    try {
      const res = await getSiteInfo()
      settings.value = (res as SiteSettings) ?? null
    } catch {
      // 静默失败，使用默认值
      settings.value = null
    } finally {
      loaded.value = true
    }
  }

  // ========== 派生值：各组件直接使用 ==========

  /** 公司名称 */
  const company = computed(() => settings.value?.company || '')

  /** PC 端 Logo URL */
  const logo = computed(() => settings.value?.logo || '/logo_blank.png')

  /** 手机端 Logo URL */
  const wapLogo = computed(() => settings.value?.wap_logo || settings.value?.logo || '/logo_blank.png')

  /** ICO 图标 URL */
  const icoLogo = computed(() => settings.value?.ico_logo || '/favicon.ico')

  /** 联系电话 */
  const tel = computed(() => settings.value?.tel || '')

  /** 手机号码 */
  const phone = computed(() => settings.value?.phone || '')

  /** 电子邮箱 */
  const email = computed(() => settings.value?.email || '')

  /** 公司地址 */
  const address = computed(() => settings.value?.address || '')

  /** 传真 */
  const fax = computed(() => settings.value?.fax || '')

  /** 邮编 */
  const postcode = computed(() => settings.value?.postcode || '')

  /** 底部版权信息（HTML） */
  const copyright = computed(() => settings.value?.content2 || '')

  // ========== SEO 字段 ==========

  /** 网站标题 */
  const seoTitle = computed(() => settings.value?.title || '销帮帮CRM')

  /** SEO 关键词 */
  const seoKeywords = computed(() => settings.value?.keyword || '')

  /** SEO 描述 */
  const seoDescription = computed(() => settings.value?.descs || '')

  // ========== 统计代码 ==========

  /** 头部统计代码 */
  const headScript = computed(() => settings.value?.toolscode_top || '')

  /** 底部统计代码 */
  const bodyScript = computed(() => settings.value?.toolscode_bottom || '')

  return {
    // state
    settings,
    loaded,
    // actions
    fetch,
    // derived
    company,
    logo,
    wapLogo,
    icoLogo,
    tel,
    phone,
    email,
    address,
    fax,
    postcode,
    copyright,
    seoTitle,
    seoKeywords,
    seoDescription,
    headScript,
    bodyScript,
  }
})