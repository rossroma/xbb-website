import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { getPageSeo } from '@/client/data/pageSeoConfig'
import { useSiteSettingsStore } from '@/client/stores/siteSettings'

/**
 * 为当前页面统一设置 SEO 元数据（title、description、keywords、Open Graph）。
 *
 * 优先级：
 *   1. 页面级配置（`pageSeoConfig.ts` — 最精准，预渲染时直接可用）
 *   2. 全局 SiteStore（从 `/v1/client/site-info` 获取，CMS 可配置）
 *   3. 硬编码默认值（兜底）
 *
 * 使用方式：在页面组件的 `<script setup>` 中调用 `usePageSEO()` 即可，
 * 无需传参 — composable 自动从当前路由 path 读取对应的 SEO 配置。
 */
export function usePageSEO(): void {
  const route = useRoute()
  const store = useSiteSettingsStore()
  const pageSeo = getPageSeo(route.path)

  const title = pageSeo?.title || store.seoTitle || '销帮帮CRM'
  const description = pageSeo?.description || store.seoDescription || ''
  const keywords = store.seoKeywords || ''

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      // Open Graph（微信 / 微博 / 飞书等分享卡片）
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
    ],
  })
}