<!--
  行业案例页面 — 展示各行业客户的成功案例
  页面结构：轮播 Banner → 分类 Tab → 案例卡片列表
-->
<template>
  <div class="cases-page">
    <!-- ===== 轮播 Banner 区 ===== -->
    <PromoBannerCarousel :slides="casePromoSlides" />

    <!-- ===== 分类 Tab 区 + 案例卡片列表 ===== -->
    <SectionBlock spacing="none" paddingBottom="default" class="mt-20">
      <!-- 分类 Tab -->
      <Tabs v-model="activeTabKey" :tabs="categoryTabs" layout="text-only" active-bg="brand" />

      <!-- 加载态 -->
      <div
        v-if="isLoading"
        class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        aria-hidden="true"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-card border border-border-subtle overflow-hidden"
        >
          <div class="aspect-[4/3] animate-skeleton" />
          <div class="p-5 space-y-3">
            <div class="h-5 w-16 animate-skeleton rounded-pill" />
            <div class="h-6 w-full animate-skeleton rounded-inner" />
          </div>
        </div>
      </div>

      <!-- 错误态 -->
      <ErrorState
        v-else-if="errorMessage"
        :message="errorMessage"
        class="mt-8"
        @retry="loadCases"
      />

      <!-- 空态 -->
      <EmptyState v-else-if="filteredCards.length === 0" message="暂无该行业的案例" class="mt-8" />

      <!-- 案例卡片列表 -->
      <ContentList v-else title="" :items="filteredCards" variant="card" hide-header class="mt-8" />
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@vueuse/head'
import PromoBannerCarousel from '@/client/components/business/PromoBannerCarousel.vue'
import Tabs from '@/client/components/ui/Tabs.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import { getClientCases, type CaseListItem } from '@/shared/api/case'
import { casesPageSeo, casePromoSlides, CASE_CATEGORY_TABS, CATEGORY_TAG_MAP } from './casesData'

// ==================== SEO ====================

useHead({
  title: casesPageSeo.title,
  meta: [
    {
      name: 'description',
      content: casesPageSeo.description,
    },
  ],
})

// ==================== 状态 ====================

/** 分类 Tab 列表 */
const categoryTabs = CASE_CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label }))

/** 当前选中的 Tab key */
const activeTabKey = ref('all')

/** 加载状态 */
const isLoading = ref(true)
/** 错误信息 */
const errorMessage = ref<string | null>(null)
/** API 返回的案例列表 */
const caseItems = ref<CaseListItem[]>([])

// ==================== 数据加载 ====================

/** 格式化时间戳为日期字符串 */
function formatDate(ts?: number): string {
  if (!ts) return ''
  const date = new Date(ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 将 API 返回的 CaseListItem 转为 ContentCard */
function toContentCard(item: CaseListItem): ContentCard {
  return {
    image: item.image,
    title: item.title,
    tag: item.tags?.[0] ?? '',
    description: item.description,
    publishDate: formatDate(item.addtime),
    linkHref: `/hangyeanli/${item.id}`,
  }
}

/** 根据当前 Tab 筛选案例卡片 */
const filteredCards = computed<ContentCard[]>(() => {
  return caseItems.value.map(toContentCard)
})

async function loadCases() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const tag = activeTabKey.value === 'all' ? undefined : CATEGORY_TAG_MAP[activeTabKey.value]
    const result = await getClientCases({ tag, limit: 100 })
    caseItems.value = result.items
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载案例失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** Tab 切换时重新加载 */
watch(
  activeTabKey,
  () => {
    loadCases()
  },
  { immediate: true },
)
</script>
