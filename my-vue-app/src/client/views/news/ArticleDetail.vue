<template>
  <div class="article-detail">
    <!--
      ===== 加载态 =====
      骨架屏结构对齐真实文章布局，避免加载完成后出现视觉跳动
    -->
    <SectionBlock v-if="isLoading" spacing="none" width="default">
      <span class="sr-only" role="status">文章加载中...</span>

      <!-- 面包屑骨架 -->
      <div class="flex items-center gap-1.5 py-4" aria-hidden="true">
        <div class="h-4 w-12 animate-skeleton rounded-inner" />
        <div class="h-4 w-4 animate-skeleton rounded-inner" />
        <div class="h-4 w-16 animate-skeleton rounded-inner" />
        <div class="h-4 w-4 animate-skeleton rounded-inner" />
        <div class="h-4 w-28 animate-skeleton rounded-inner" />
      </div>

      <!-- 文章头部骨架 -->
      <header class="mt-10 text-center pb-6 border-b border-border-subtle" aria-hidden="true">
        <div class="h-6 w-20 animate-skeleton rounded-pill mx-auto mb-4" />
        <div class="h-9 w-3/4 animate-skeleton rounded-inner mx-auto mb-3" />
        <div class="h-9 w-1/2 animate-skeleton rounded-inner mx-auto mb-3" />
        <div class="h-5 w-2/3 animate-skeleton rounded-inner mx-auto mb-4" />
        <div class="flex items-center justify-center gap-3">
          <div class="h-4 w-24 animate-skeleton rounded-inner" />
          <div class="h-4 w-16 animate-skeleton rounded-inner" />
          <div class="h-4 w-20 animate-skeleton rounded-inner" />
        </div>
      </header>

      <!-- 文章正文骨架 -->
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
    <ErrorState
      v-else-if="errorMessage"
      :message="errorMessage"
      class="mt-24"
      @retry="loadArticle"
    />

    <!-- ===== 空态 ===== -->
    <EmptyState v-else-if="!article" message="文章不存在或已下线" class="mt-24" />

    <!-- ===== 文章详情 ===== -->
    <template v-else>
      <SectionBlock spacing="none" paddingBottom="default" width="default">
        <!-- 面包屑 -->
        <Breadcrumb :items="breadcrumbItems" show-home-icon />

        <!-- 文章头部 -->
        <header
          class="article-header mt-10 text-center pb-6 border-b border-border-subtle shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <!-- 分类标签 -->
          <Badge v-if="categoryLabel" variant="brand" class="mb-4">
            {{ categoryLabel }}
          </Badge>

          <!-- 标题 -->
          <h1 class="text-h1 text-text-primary mb-3">{{ article.title }}</h1>

          <!-- 副标题 -->
          <p v-if="article.subtitle" class="text-body text-text-secondary mb-4">
            {{ article.subtitle }}
          </p>

          <!-- 元信息 -->
          <div
            class="flex flex-wrap items-center justify-center gap-3 text-body text-text-tertiary"
          >
            <span v-if="formattedTime">{{ formattedTime }}</span>
            <span
              v-if="formattedTime && article.author"
              aria-hidden="true"
              class="text-border-default"
              >·</span
            >
            <span v-if="article.author">作者：{{ article.author }}</span>
            <span
              v-if="article.author && article.source"
              aria-hidden="true"
              class="text-border-default"
              >·</span
            >
            <span v-if="article.source">来源：{{ article.source }}</span>
            <span
              v-if="(article.author || article.source) && article.hit !== undefined"
              aria-hidden="true"
              class="text-border-default"
              >·</span
            >
            <span v-if="article.hit !== undefined">{{ article.hit }} 次阅读</span>
          </div>
        </header>

        <!-- 文章正文 -->
        <div class="article-content rich-text mt-3" v-html="article.content" />

        <!-- 上下篇导航 -->
        <PageNav
          :prev-link="prevLink"
          :prev-title="prevArticle?.title"
          :next-link="nextLink"
          :next-title="nextArticle?.title"
        />

        <!-- 返回列表 -->
        <div class="mt-6 text-center">
          <Button
            variant="outline"
            size="lg"
            class="!w-auto"
            @click="router.push('/gongsidongtai')"
          >
            <span class="inline-flex items-center gap-2">
              <Left :size="18" :stroke-width="4" />
              <span>返回列表</span>
            </span>
          </Button>
        </div>
      </SectionBlock>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { Left } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Badge from '@/client/components/ui/Badge.vue'
import Button from '@/client/components/ui/Button.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import Breadcrumb from '@/client/components/layout/Breadcrumb.vue'
import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import PageNav from '@/client/components/layout/PageNav.vue'
import {
  getClientArticleDetail,
  type ArticleDetail as ArticleDetailData,
  type ArticleNavInfo,
} from '@/shared/api/article'
import { DEFAULT_CATEGORY_TABS } from './newsData'

// ==================== 路由 ====================

const route = useRoute()
const router = useRouter()

// ==================== 状态 ====================

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const article = ref<ArticleDetailData | null>(null)
const prevArticle = ref<ArticleNavInfo | null>(null)
const nextArticle = ref<ArticleNavInfo | null>(null)

// ==================== 计算属性 ====================

/** 格式化时间戳为日期字符串 */
const formattedTime = computed(() => {
  const ts = article.value?.addtime
  if (!ts) return ''
  const date = new Date(ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

/** 根据 bid 获取分类标签名 */
const categoryLabel = computed(() => {
  const bid = article.value?.bid
  if (bid === undefined || bid === null) return ''
  const tab = DEFAULT_CATEGORY_TABS.find((t) => t.bid === bid)
  return tab?.label ?? ''
})

/** 面包屑数据 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { label: '首页', to: '/' },
    { label: '新闻动态', to: '/gongsidongtai' },
  ]
  if (article.value?.title) {
    items.push({ label: article.value.title })
  }
  return items
})

/** 上一篇链接 */
const prevLink = computed(() => {
  if (!prevArticle.value) return undefined
  return `/gongsidongtai/${prevArticle.value.id}`
})

/** 下一篇链接 */
const nextLink = computed(() => {
  if (!nextArticle.value) return undefined
  return `/gongsidongtai/${nextArticle.value.id}`
})

// ==================== SEO ====================

useHead(() => {
  if (!article.value) {
    return {
      title: '文章详情 - 销帮帮 CRM',
    }
  }
  return {
    title: article.value.seoTitle || `${article.value.title} - 销帮帮 CRM`,
    meta: [
      {
        name: 'description',
        content: article.value.setDescription || article.value.descs || '',
      },
      {
        name: 'keywords',
        content: article.value.seoKeyword || '',
      },
    ],
  }
})

// ==================== 数据加载 ====================

async function loadArticle() {
  const id = Number(route.params.id)
  if (!id || isNaN(id)) {
    errorMessage.value = '无效的文章 ID'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    const result = await getClientArticleDetail(id)
    article.value = result.article
    prevArticle.value = result.prev
    nextArticle.value = result.next
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文章失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

/** 路由参数变化时重新加载 */
watch(
  () => route.params.id,
  () => {
    loadArticle()
  },
  { immediate: true },
)
</script>

<style scoped>
/* ===== 富文本内容样式 ===== */
/* 已提取到 src/client/styles/rich-text.css 全局共享 */
</style>
