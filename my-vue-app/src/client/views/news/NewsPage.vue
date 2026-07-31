<template>
  <div class="news-page">
    <!-- ===== Banner 区 ===== -->
    <HeroBanner mode="single" :slides="[newsBannerSlide]" />

    <!-- ===== 分类 Tab 区 + 文章列表区 ===== -->
    <SectionBlock spacing="none" paddingBottom="default" class="mt-5">
      <!-- 分类 Tab -->
      <Tabs
        v-model="activeTabKey"
        :tabs="categoryTabs"
        layout="text-only"
        active-bg="brand"
        :disabled="isLoading"
        @update:model-value="handleTabChange"
      />

      <!-- 加载态 -->
      <div v-if="isLoading" class="mt-6 space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-4 border-b border-border-subtle py-4"
        >
          <div class="skeleton h-4 w-24 rounded" />
          <div class="skeleton h-4 flex-1 rounded" />
          <div class="skeleton h-4 w-12 rounded" />
        </div>
      </div>

      <!-- 错误态 -->
      <ErrorState
        v-else-if="errorMessage"
        :message="errorMessage"
        class="mt-6"
        @retry="loadArticles"
      />

      <!-- 空态 -->
      <EmptyState
        v-else-if="!isLoading && articleItems.length === 0"
        message="暂无相关文章"
        class="mt-6"
      />

      <!-- 文章列表 -->
      <ContentList
        v-else
        :title="''"
        :items="articleItems"
        variant="card"
        hide-header
        class="mt-6"
      />

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <Pagination
          v-model:current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          show-total
          :disabled="isLoading"
          @change="handlePageChange"
        />
      </div>
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import Tabs from '@/client/components/ui/Tabs.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'
import Pagination from '@/client/components/ui/Pagination.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import { getClientArticles, type ClientArticleListResponse } from '@/shared/api/article'
import { getClientCategories, type ClientCategoryListResponse } from '@/shared/api/category'
import type { Category } from '@/shared/api/category'
import { newsPageSeo, newsBannerSlide, DEFAULT_CATEGORY_TABS } from './newsData'

// ==================== SEO ====================

useHead({
  title: newsPageSeo.title,
  meta: [
    {
      name: 'description',
      content: newsPageSeo.description,
    },
  ],
})

// ==================== 状态 ====================

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

/** 分类 Tab 列表（含动态获取的 bid） */
const categoryTabs = ref<{ key: string; label: string }[]>(
  DEFAULT_CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label })),
)

/** 内部分类映射表：key → slug/bid */
const categoryMap = ref<Map<string, { slug: string; bid: number | null }>>(
  new Map(DEFAULT_CATEGORY_TABS.map((t) => [t.key, { slug: t.slug, bid: t.bid }])),
)

/** 当前选中的 Tab key */
const activeTabKey = ref('all')

/** 文章列表数据 */
const articleList = ref<ClientArticleListResponse | null>(null)

/** 当前页码 */
const currentPage = ref(1)
/** 每页条数 */
const pageSize = ref(12)

/** 总条数 */
const total = computed(() => articleList.value?.total ?? 0)
/** 总页数 */
const totalPages = computed(() => articleList.value?.totalPages ?? 0)

/** 转换为 ContentCard 格式 */
const articleItems = computed<ContentCard[]>(() => {
  if (!articleList.value) return []
  return articleList.value.items.map((article) => ({
    title: article.title,
    image: article.simg || undefined,
    description: article.descs || undefined,
    publishDate: formatTimestamp(article.addtime),
    tag: getCategoryTag(article.bid),
    linkHref: `/gongsidongtai/${article.id}`,
  }))
})

// ==================== 工具函数 ====================

/** Unix 时间戳转日期字符串 */
function formatTimestamp(ts: number): string {
  if (!ts) return ''
  const date = new Date(ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 根据 bid 获取分类标签名 */
function getCategoryTag(bid: number): string {
  for (const [, info] of categoryMap.value) {
    if (info.bid === bid) {
      for (const tab of DEFAULT_CATEGORY_TABS) {
        if (tab.bid === bid) return tab.label
      }
    }
  }
  return ''
}

// ==================== 数据加载 ====================

/** 获取当前选中 Tab 的 bid */
function getActiveBid(): number | null {
  const info = categoryMap.value.get(activeTabKey.value)
  return info?.bid ?? null
}

/** 加载文章列表 */
async function loadArticles() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const bid = getActiveBid()
    const params: { page: number; limit: number; bid?: number } = {
      page: currentPage.value,
      limit: pageSize.value,
    }
    if (bid !== null) {
      params.bid = bid
    }
    articleList.value = await getClientArticles(params)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文章列表失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** 加载分类列表并匹配 Tab */
async function loadCategories() {
  try {
    const result: ClientCategoryListResponse = await getClientCategories(true)
    const categories: Category[] = result.items

    // 遍历 Tab 配置，根据 slug 匹配栏目 ID
    for (const tab of DEFAULT_CATEGORY_TABS) {
      if (!tab.slug) continue // 跳过「全部」
      const matched = categories.find((c) => c.english === tab.slug && c.status === 1)
      if (matched) {
        categoryMap.value.set(tab.key, { slug: tab.slug, bid: matched.id })
      }
    }
  } catch {
    // 分类加载失败不影响文章列表展示，使用默认配置
    console.warn('加载分类列表失败，将使用默认配置')
  }
}

// ==================== 事件处理 ====================

/** Tab 切换 */
function handleTabChange(key: string) {
  if (activeTabKey.value === key && articleList.value) return
  activeTabKey.value = key
  currentPage.value = 1
  loadArticles()
}

/** 翻页 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadArticles()
  // 滚动到列表顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ==================== 生命周期 ====================

onMounted(async () => {
  await loadCategories()
  await loadArticles()
})
</script>
