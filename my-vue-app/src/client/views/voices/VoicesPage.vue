<!--
  用户心声页面 — 展示各行业客户的真实评价
  页面结构：Banner → 分类 Tab → 评价卡片列表
  类目数据通过父类目（bid=19）动态获取子类目
-->
<template>
  <div class="voices-page">
    <!-- ===== Banner 区 ===== -->
    <HeroBanner mode="single" :slides="[voicesBannerSlide]" />

    <!-- ===== 分类 Tab 区 + 评价卡片列表 ===== -->
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
      <div v-if="isLoading" class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-card border border-border-subtle p-6 space-y-4"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full animate-skeleton" />
            <div class="flex-1 space-y-2">
              <div class="h-4 w-24 animate-skeleton rounded-inner" />
              <div class="h-3 w-16 animate-skeleton rounded-inner" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-4 w-full animate-skeleton rounded-inner" />
            <div class="h-4 w-5/6 animate-skeleton rounded-inner" />
            <div class="h-4 w-4/5 animate-skeleton rounded-inner" />
          </div>
        </div>
      </div>

      <!-- 错误态 -->
      <ErrorState
        v-else-if="errorMessage"
        :message="errorMessage"
        class="mt-6"
        @retry="loadVoices"
      />

      <!-- 空态 -->
      <EmptyState
        v-else-if="!isLoading && reviewCards.length === 0"
        message="暂无该行业的客户评价"
        class="mt-6"
      />

      <!-- 评价卡片列表 -->
      <ReviewCardGrid v-else title="" :cards="reviewCards" :columns="2" class="mt-6" />

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
import ReviewCardGrid from '@/client/components/business/ReviewCardGrid.vue'
import type { ReviewCard } from '@/client/components/business/ReviewCardGrid.vue'
import Pagination from '@/client/components/ui/Pagination.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import { getClientCases, type CaseListResponse, type CaseListItem } from '@/shared/api/case'
import { getClientCategories, type ClientCategoryListResponse, type Category } from '@/shared/api/category'
import { voicesPageSeo, voicesBannerSlide, VOICE_ROOT_BID } from './voicesData'

// ==================== SEO ====================

useHead({
  title: voicesPageSeo.title,
  meta: [
    {
      name: 'description',
      content: voicesPageSeo.description,
    },
  ],
})

// ==================== 状态 ====================

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

/** 分类 Tab 列表（含动态获取的 bid） */
const categoryTabs = ref<{ key: string; label: string }[]>([
  { key: 'all', label: '全部' },
])

/** 内部分类映射表：key → bid */
const categoryMap = ref<Map<string, number>>(new Map())

/** 当前选中的 Tab key */
const activeTabKey = ref('all')

/** 案例列表数据 */
const voiceList = ref<CaseListResponse | null>(null)

/** 当前页码 */
const currentPage = ref(1)
/** 每页条数 */
const pageSize = ref(12)

/** 总条数 */
const total = computed(() => voiceList.value?.total ?? 0)
/** 总页数 */
const totalPages = computed(() => voiceList.value?.totalPages ?? 0)

/** 将 CaseListItem 转为 ReviewCard 格式 */
const reviewCards = computed<ReviewCard[]>(() => {
  if (!voiceList.value) return []
  return voiceList.value.items.map((item) => toReviewCard(item))
})

// ==================== 数据转换 ====================

/** 将 API 返回的 CaseListItem 转为 ReviewCard */
function toReviewCard(item: CaseListItem): ReviewCard {
  return {
    logo: item.image || '',
    logoAlt: item.title,
    industry: item.tags?.[0] ?? '',
    content: item.description || '',
    username: item.title,
    rating: 5,
  }
}

// ==================== 数据加载 ====================

/** 获取当前选中 Tab 的 bid */
function getActiveBid(): number | undefined {
  if (activeTabKey.value === 'all') return undefined
  return categoryMap.value.get(activeTabKey.value)
}

/** 加载用户心声列表 */
async function loadVoices() {
  isLoading.value = true
  errorMessage.value = null

  try {
    const bid = getActiveBid()
    const params: { page: number; limit: number; bid?: number; rootBid?: number } = {
      page: currentPage.value,
      limit: pageSize.value,
      rootBid: VOICE_ROOT_BID,
    }
    if (bid !== undefined) {
      params.bid = bid
    }
    voiceList.value = await getClientCases(params)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载用户心声失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** 加载分类列表 — 获取 pid=VOICE_ROOT_BID 的子类目作为 Tab */
async function loadCategories() {
  try {
    const result: ClientCategoryListResponse = await getClientCategories(true)
    const categories: Category[] = result.items

    // 过滤出用户心声根类目下的子类目
    const childCategories = categories.filter(
      (c) => c.pid === VOICE_ROOT_BID && c.status === 1,
    )

    if (childCategories.length > 0) {
      const tabs = [{ key: 'all', label: '全部' }]
      const map = new Map<string, number>()

      for (const cat of childCategories) {
        const key = `bid_${cat.id}`
        tabs.push({ key, label: cat.title })
        map.set(key, cat.id)
      }

      categoryTabs.value = tabs
      categoryMap.value = map
    }
  } catch {
    // 分类加载失败不影响列表展示
    console.warn('加载用户心声分类列表失败，将使用默认配置')
  }
}

// ==================== 事件处理 ====================

/** Tab 切换 */
function handleTabChange(key: string) {
  if (activeTabKey.value === key && voiceList.value) return
  activeTabKey.value = key
  currentPage.value = 1
  loadVoices()
}

/** 翻页 */
function handlePageChange(page: number) {
  currentPage.value = page
  loadVoices()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ==================== 生命周期 ====================

onMounted(async () => {
  await Promise.all([loadCategories(), loadVoices()])
})
</script>
