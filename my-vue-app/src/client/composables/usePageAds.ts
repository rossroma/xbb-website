import { ref, onMounted } from 'vue'
import { getClientAds } from '@/shared/api/ads'
import type { Ads } from '@/shared/api/ads'

/**
 * 广告位 ID 常量
 * 与后台 web_ads_type 表的 ID 一一对应
 */
export const AD_POSITION = {
  /** 首页-Banner轮播 */
  HOME_BANNER: 1,
  /** 联系我们-公司地址 */
  CONTACT_ADDRESS: 9,
} as const

/**
 * 按广告位 ID 获取广告数据
 *
 * 用法：
 *   const { items, loading } = useAds(AD_POSITION.HOME_BANNER)
 *
 * 容错：API 异常时 items 为空数组，由上层适配器回退到硬编码数据
 */
export function useAds(position: number) {
  const items = ref<Ads[]>([])
  const loading = ref(false)

  const fetch = async () => {
    loading.value = true
    try {
      items.value = await getClientAds(position)
    } catch {
      // 静默失败 — API 不可用时 items 保持空数组，适配器层会回退到硬编码数据
      items.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(fetch)

  return { items, loading, refetch: fetch }
}
