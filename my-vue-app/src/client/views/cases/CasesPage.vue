<!--
  行业案例页面 — 展示各行业客户的成功案例
  页面结构：轮播 Banner → 分类 Tab → 案例卡片列表
  类目数据通过父类目（bid=18）动态获取子类目
-->
<template>
  <div class="cases-page">
    <h1 class="sr-only">行业案例 - 销帮帮 CRM</h1>
    <!-- ===== Hero Banner 区 ===== -->
    <HeroBanner mode="single" :slides="[caseHeroSlide]" />

    <!-- ===== 分类 Tab 区 + 案例卡片列表 ===== -->
    <SectionBlock spacing="none" paddingBottom="default" class="mt-5">
      <!-- 分类 Tab -->
      <div class="scroll-mt-20">
        <Tabs
          v-model="activeTabKey"
          :tabs="categoryTabs"
          layout="text-only"
          active-bg="brand"
          :disabled="isLoading"
          @update:model-value="handleTabChange"
        />
      </div>

      <!-- 加载态 -->
      <div
        v-if="isLoading"
        class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
      <EmptyState
        v-else-if="!isLoading && caseCards.length === 0"
        message="暂无该行业的案例"
        class="mt-8"
      />

      <!-- 案例卡片列表 -->
      <ContentList
        v-else
        title=""
        :items="caseCards"
        variant="card"
        :cols="3"
        :title-line-clamp="1"
        hide-header
        hide-date
        class="mt-8"
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
import EmptyState from '@/client/components/ui/EmptyState.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import { getClientCases, type CaseListResponse } from '@/shared/api/case'
import {
  getClientCategories,
  type ClientCategoryListResponse,
  type Category,
} from '@/shared/api/category'
import { caseHeroSlide, CASE_ROOT_BID } from './casesData'

// ==================== SEO ====================

usePageSEO()

// ==================== 状态 ====================

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

/** 分类 Tab 列表（含动态获取的 bid） */
const categoryTabs = ref<{ key: string; label: string }[]>([{ key: 'all', label: '全部' }])

/** 内部分类映射表：key → bid */
const categoryMap = ref<Map<string, number>>(new Map())

/** 当前选中的 Tab key */
const activeTabKey = ref('all')
/** 上一次的 Tab key，用于防止重复请求同一分类 */
const prevTabKey = ref('all')

/** 案例列表数据 */
const caseList = ref<CaseListResponse | null>(null)

/** 当前页码 */
const currentPage = ref(1)
/** 每页条数 */
const pageSize = ref(12)

/** 总条数 */
const total = computed(() => caseList.value?.total ?? 0)
/** 总页数 */
const totalPages = computed(() => caseList.value?.totalPages ?? 0)

/** 转换为 ContentCard 格式 */
const caseCards = computed<ContentCard[]>(() => {
  if (!caseList.value) return []
  return caseList.value.items.map((item) => ({
    image: item.image,
    title: item.title,
    tag: item.tags?.[0] ?? '',
    description: stripHtml(item.content || item.description || ''),
    publishDate: formatTimestamp(item.addtime),
    linkHref: `/hangyeanli/${item.id}`,
  }))
})

// ==================== 工具函数 ====================

/** 去除 HTML 标签，将富文本转为纯文本 */
function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/** Unix 时间戳转日期字符串 */
function formatTimestamp(ts?: number): string {
  if (!ts) return ''
  const date = new Date(ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ==================== 数据加载 ====================

/** 获取当前选中 Tab 的 bid */
function getActiveBid(): number | undefined {
  if (activeTabKey.value === 'all') return undefined
  return categoryMap.value.get(activeTabKey.value)
}

/** 加载案例列表 */
async function loadCases() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const bid = getActiveBid()
    const params: { page: number; limit: number; bid?: number; rootBid?: number; order: 'random' } =
      {
        page: currentPage.value,
        limit: pageSize.value,
        rootBid: CASE_ROOT_BID,
        order: 'random',
      }
    if (bid !== undefined) {
      params.bid = bid
    }
    caseList.value = await getClientCases(params)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载案例列表失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** 加载分类列表 — 获取 pid=CASE_ROOT_BID 的子类目作为 Tab */
async function loadCategories() {
  try {
    const result: ClientCategoryListResponse = await getClientCategories(true)
    const categories: Category[] = result.items

    // 过滤出行业案例根类目下的子类目
    const childCategories = categories.filter((c) => c.pid === CASE_ROOT_BID && c.status === 1)

    if (childCategories.length > 0) {
      const tabs = [{ key: 'all', label: '全部' }]
      const map = new Map<string, number>()

      for (const cat of childCategories) {
        const key = `bid_${cat.id}`
        // 去掉「行业」后缀，如「互联网行业」→「互联网」
        const label = cat.title.replace(/行业$/, '')
        tabs.push({ key, label })
        map.set(key, cat.id)
      }

      categoryTabs.value = tabs
      categoryMap.value = map
    }
  } catch {
    // 分类加载失败不影响案例列表展示，使用默认配置
    console.warn('加载分类列表失败，将使用默认配置')
  }
}

// ==================== 事件处理 ====================

/** Tab 切换 */
function handleTabChange(key: string) {
  if (prevTabKey.value === key && caseList.value) return
  prevTabKey.value = key
  activeTabKey.value = key
  currentPage.value = 1
  loadCases()
}

/** 翻页 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadCases()
  // 滚动到列表顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ==================== 生命周期 ====================

onMounted(async () => {
  await Promise.all([loadCategories(), loadCases()])
})
</script>
