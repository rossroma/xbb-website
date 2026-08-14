import { ref } from 'vue'
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

// ========== localStorage 缓存层 ==========

const CACHE_PREFIX = 'xbb_ads_'
const CACHE_TTL = 30 * 60 * 1000 // 30 分钟

interface CacheEntry {
  data: Ads[]
  timestamp: number
}

function readCache(position: number): Ads[] | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${position}`)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(`${CACHE_PREFIX}${position}`)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

function writeCache(position: number, data: Ads[]) {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${position}`,
      JSON.stringify({ data, timestamp: Date.now() }),
    )
  } catch {
    // localStorage 不可用或已满，静默忽略
  }
}

/**
 * 按广告位 ID 获取广告数据
 *
 * 用法：
 *   const { items, loading, isCached } = useAds(AD_POSITION.HOME_BANNER)
 *
 * 缓存策略：
 *   - 首次渲染时优先读取 localStorage 缓存，确保首屏快速显示
 *   - 同时发起 API 请求，返回后更新 items 并写入缓存
 *   - API 异常时保留缓存数据（或无数据），不崩溃
 *
 * 容错：API 异常时 items 保持当前值（缓存或空数组），由上层适配器回退到硬编码数据
 */
export function useAds(position: number) {
  const items = ref<Ads[]>(readCache(position) ?? [])
  const loading = ref(true) // 初始为 true，确保 setup 阶段骨架屏立即显示
  const isCached = ref(items.value.length > 0)

  const fetch = async () => {
    loading.value = true
    try {
      const data = await getClientAds(position)
      items.value = data
      writeCache(position, data)
      isCached.value = false
    } catch {
      // 静默失败 — 保留缓存数据或空数组
    } finally {
      loading.value = false
    }
  }

  // SSG 构建时跳过（无 API 环境）；客户端在 setup 阶段立即发起请求（比 onMounted 更早）
  if (!import.meta.env.SSR) {
    fetch()
  }

  return { items, loading, isCached, refetch: fetch }
}
