<!--
  案例详情页
  页面结构：面包屑 → CaseDetailHeader → 富文本正文 → 上下篇导航 → 返回按钮 → 更多案例
-->
<template>
  <div class="case-detail">
    <!--
      ===== 加载态 =====
      骨架屏对齐真实布局，避免加载完成后出现视觉跳动
    -->
    <SectionBlock v-if="isLoading" spacing="none" width="default">
      <span class="sr-only" role="status">案例加载中...</span>

      <!-- 面包屑骨架 -->
      <div class="flex items-center gap-1.5 py-4" aria-hidden="true">
        <div class="h-4 w-12 animate-skeleton rounded-inner" />
        <div class="h-4 w-4 animate-skeleton rounded-inner" />
        <div class="h-4 w-16 animate-skeleton rounded-inner" />
        <div class="h-4 w-4 animate-skeleton rounded-inner" />
        <div class="h-4 w-28 animate-skeleton rounded-inner" />
      </div>

      <!-- CaseDetailHeader 骨架 -->
      <div
        class="mt-6 overflow-hidden rounded-card border border-border-subtle bg-surface-secondary"
        aria-hidden="true"
      >
        <div class="grid grid-cols-2 max-lg:grid-cols-1">
          <div class="aspect-[4/3] animate-skeleton" />
          <div class="flex flex-col gap-6 p-8 max-lg:p-6 max-md:p-5">
            <div class="ml-auto h-10 w-32 animate-skeleton rounded-inner" />
            <div class="space-y-2">
              <div class="h-4 w-full animate-skeleton rounded-inner" />
              <div class="h-4 w-5/6 animate-skeleton rounded-inner" />
              <div class="h-4 w-4/5 animate-skeleton rounded-inner" />
            </div>
            <div class="h-px w-full bg-border-default" />
            <div class="h-8 w-3/4 animate-skeleton rounded-inner" />
            <div class="flex gap-2">
              <div class="h-6 w-16 animate-skeleton rounded-pill" />
              <div class="h-6 w-16 animate-skeleton rounded-pill" />
            </div>
          </div>
        </div>
      </div>

      <!-- 正文骨架 -->
      <div class="mt-8 space-y-4" aria-hidden="true">
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-5/6 animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-4/5 animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-3/4 animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-2/3 animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-5/6 animate-skeleton rounded-inner" />
        <div class="h-4 w-full animate-skeleton rounded-inner" />
        <div class="h-4 w-1/2 animate-skeleton rounded-inner" />
      </div>

      <!-- 上下篇导航骨架 -->
      <div class="mt-8 grid grid-cols-2 gap-4" aria-hidden="true">
        <div class="h-16 animate-skeleton rounded-card" />
        <div class="h-16 animate-skeleton rounded-card" />
      </div>

      <!-- 返回按钮骨架 -->
      <div class="mt-6 flex justify-center pb-8" aria-hidden="true">
        <div class="h-10 w-32 animate-skeleton rounded-pill" />
      </div>
    </SectionBlock>

    <!-- ===== 错误态 ===== -->
    <ErrorState v-else-if="errorMessage" :message="errorMessage" class="mt-24" @retry="loadCase" />

    <!-- ===== 空态 ===== -->
    <EmptyState v-else-if="!caseData" message="案例不存在或已下线" class="mt-24" />

    <!-- ===== 案例详情 ===== -->
    <template v-else>
      <SectionBlock spacing="none" paddingBottom="default" width="default">
        <!-- 面包屑 -->
        <Breadcrumb :items="breadcrumbItems" show-home-icon />

        <!-- 案例头部 -->
        <div class="mt-6">
          <CaseDetailHeader
            :image="caseData.image"
            :logo="caseData.logo"
            :description="caseData.description"
            :title="caseData.title"
            :tags="caseData.tags"
          />
        </div>

        <!-- 内容主体（富文本） -->
        <div
          v-if="caseData.content"
          class="case-content rich-text mt-3"
          v-html="caseData.content"
        />

        <!-- 上下篇导航 -->
        <PageNav
          :prev-link="prevLink"
          :prev-title="prevCase?.title"
          :next-link="nextLink"
          :next-title="nextCase?.title"
        />

        <!-- 返回列表 -->
        <div class="mt-6 text-center">
          <Button variant="outline" size="lg" class="!w-auto" @click="router.push('/hangyeanli')">
            <span class="inline-flex items-center gap-2">
              <Left :size="18" :stroke-width="4" />
              <span>返回列表</span>
            </span>
          </Button>
        </div>
      </SectionBlock>

      <!-- 更多案例 -->
      <ContentCardGrid title="更多案例" :cards="relatedCaseCards" variant="case" :columns="3" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Left } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Button from '@/client/components/ui/Button.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import Breadcrumb from '@/client/components/layout/Breadcrumb.vue'
import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import PageNav from '@/client/components/layout/PageNav.vue'
import CaseDetailHeader from '@/client/components/business/CaseDetailHeader.vue'
import ContentCardGrid from '@/client/components/business/ContentCardGrid.vue'
import type { ContentCard } from '@/client/components/business/ContentCardGrid.vue'
import {
  getClientCaseDetail,
  type CaseDetail,
  type CaseNavInfo,
  type CaseCard,
} from '@/shared/api/case'

// ==================== 路由 ====================

const route = useRoute()
const router = useRouter()

// ==================== 状态 ====================

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const caseData = ref<CaseDetail | null>(null)
const prevCase = ref<CaseNavInfo | null>(null)
const nextCase = ref<CaseNavInfo | null>(null)
const relatedCases = ref<CaseCard[]>([])

// ==================== 计算属性 ====================

/** 面包屑数据 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: '首页', to: '/' },
    { label: '行业案例', to: '/hangyeanli' },
  ]
  if (caseData.value?.title) {
    items.push({ label: caseData.value.title })
  }
  return items
})

/** 上一篇链接 */
const prevLink = computed(() => {
  if (!prevCase.value) return undefined
  return `/hangyeanli/${prevCase.value.id}`
})

/** 下一篇链接 */
const nextLink = computed(() => {
  if (!nextCase.value) return undefined
  return `/hangyeanli/${nextCase.value.id}`
})

/** 相关案例转换为 ContentCard 格式 */
const relatedCaseCards = computed<ContentCard[]>(() => {
  return relatedCases.value.map((c) => ({
    image: c.image,
    title: c.title,
    tag: c.tags?.[0] ?? '',
    description: c.description,
    publishDate: c.addtime ? new Date(c.addtime * 1000).toISOString().slice(0, 10) : undefined,
    linkHref: `/hangyeanli/${c.id}`,
  }))
})

// ==================== SEO ====================

useHead(() => {
  if (!caseData.value) {
    return {
      title: '案例详情 - 销帮帮 CRM',
    }
  }
  return {
    title: caseData.value.seoTitle || `${caseData.value.title} - 销帮帮 CRM`,
    meta: [
      {
        name: 'description',
        content: caseData.value.seoDescription || caseData.value.description || '',
      },
      {
        name: 'keywords',
        content: caseData.value.seoKeyword || '',
      },
    ],
  }
})

// ==================== 数据加载 ====================

async function loadCase() {
  const id = Number(route.params.id)
  if (!id || isNaN(id)) {
    errorMessage.value = '无效的案例 ID'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const result = await getClientCaseDetail(id)
    caseData.value = result.case
    prevCase.value = result.prev
    nextCase.value = result.next
    relatedCases.value = result.relatedCases
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载案例失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** 路由参数变化时重新加载 */
watch(
  () => route.params.id,
  () => {
    loadCase()
  },
  { immediate: true },
)
</script>

<style scoped>
/* ===== 富文本内容样式 ===== */
/* 已提取到 src/client/styles/rich-text.css 全局共享 */
</style>
