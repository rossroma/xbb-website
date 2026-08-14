<template>
  <div class="news-page">
    <h1 class="sr-only">新闻动态 - 销帮帮 CRM</h1>
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
      <div
        v-if="isLoading"
        class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-hidden="true"
      >
        <div
          v-for="i in 6"
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
        :cols="3"
        :title-line-clamp="2"
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
import { usePageSEO } from '@/client/composables/usePageSEO'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import Tabs from '@/client/components/ui/Tabs.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'
import Pagination from '@/client/components/ui/Pagination.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import { getClientArticles, type ClientArticleListResponse } from '@/shared/api/article'
import { newsBannerSlide, DEFAULT_CATEGORY_TABS, NEWS_CHILD_BIDS } from './newsData'

// ==================== SEO ====================

usePageSEO()

// ==================== 状态 ====================

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

/** 分类 Tab 列表 */
const categoryTabs = ref<{ key: string; label: string }[]>(
  DEFAULT_CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label })),
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
  const tab = DEFAULT_CATEGORY_TABS.find((t) => t.bid === bid)
  return tab?.label ?? ''
}

// ==================== 数据加载 ====================

/** 获取当前 Tab 对应的查询参数 */
function getActiveQueryParams(): { page: number; limit: number; bid?: number; bids?: string } {
  const tab = DEFAULT_CATEGORY_TABS.find((t) => t.key === activeTabKey.value)
  const params: { page: number; limit: number; bid?: number; bids?: string } = {
    page: currentPage.value,
    limit: pageSize.value,
  }
  if (tab?.key === 'all') {
    // 「全部」标签：展示 bid=8 下所有子类目的文章
    params.bids = NEWS_CHILD_BIDS.join(',')
  } else if (tab?.bid !== null) {
    params.bid = tab!.bid
  }
  return params
}

/** 加载文章列表 */
async function loadArticles() {
  isLoading.value = true
  errorMessage.value = null

  try {
    articleList.value = await getClientArticles(getActiveQueryParams())
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文章列表失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** Tab 切换 */
function handleTabChange() {
  // v-model 已更新 activeTabKey，只需重置页码并加载
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
  await loadArticles()
})
</script>
