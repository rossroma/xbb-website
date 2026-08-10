<template>
  <div class="knowledge-article-detail-page">
    <!-- ===== 加载态 ===== -->
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
      <header class="mt-10 pb-6 border-b border-border-subtle" aria-hidden="true">
        <div class="h-9 w-3/4 animate-skeleton rounded-inner mb-3" />
        <div class="h-5 w-2/3 animate-skeleton rounded-inner mb-4" />
        <div class="flex items-center gap-3">
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
        <Breadcrumb :items="breadcrumbItems" show-home-icon />

        <div class="knowledge-article-layout">
          <main class="knowledge-main-column">
            <article class="knowledge-detail-article">
              <header class="knowledge-detail-header">
                <h1 class="knowledge-detail-title">{{ article.title }}</h1>

                <div class="knowledge-detail-meta">
                  <span v-if="formattedTime">{{ formattedTime }}</span>
                  <span v-if="article.author">作者：{{ article.author }}</span>
                  <RouterLink to="/message" class="knowledge-detail-consult">微信咨询</RouterLink>
                </div>

                <div v-if="article.descs" class="knowledge-detail-summary">
                  {{ article.descs }}
                </div>
              </header>

              <!-- 文章正文 -->
              <div class="article-content rich-text" v-html="article.content" />

              <!-- 上下篇导航 -->
              <PageNav
                :prev-link="prevLink"
                :prev-title="prevArticle?.title"
                :next-link="nextLink"
                :next-title="nextArticle?.title"
              />

              <!-- FAQ 区域 -->
              <div v-if="knowledgeQnAFaqItems.length" :id="faqAnchorId" class="knowledge-faq-shell">
                <FaqList
                  title="本文相关FAQs"
                  :categories="knowledgeQnAFaqCategories"
                  :items="knowledgeQnAFaqItems"
                  expand-mode="single"
                  :show-categories="false"
                  :show-search="false"
                />

                <div class="knowledge-faq-actions">
                  <UiButton :to="trialPagePath" variant="primary" size="lg">CRM免费试用</UiButton>
                  <UiButton to="/" variant="outline" size="lg">销帮帮CRM官网</UiButton>
                </div>
              </div>
            </article>
          </main>

          <aside class="knowledge-sidebar" aria-label="知识问答侧边栏">
            <ArticleSidebar
              variant="toc"
              title="文章目录"
              :banners="knowledgeQnASidebarBanners"
              :toc-items="knowledgeDetailTocItems"
              :active-toc-id="activeTocId"
            />
          </aside>
        </div>
      </SectionBlock>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import ArticleSidebar from '@/client/components/business/ArticleSidebar.vue'
import type { ArticleSidebarTocItem } from '@/client/components/business/ArticleSidebar.vue'
import FaqList from '@/client/components/business/FaqList.vue'
import Breadcrumb from '@/client/components/layout/Breadcrumb.vue'
import type { BreadcrumbItem } from '@/client/components/layout/Breadcrumb.vue'
import PageNav from '@/client/components/layout/PageNav.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import UiButton from '@/client/components/ui/Button.vue'
import { toPagePath } from '@/client/data/routePaths'
import {
  getClientArticleDetail,
  type ArticleDetail as ArticleDetailData,
  type ArticleNavInfo,
} from '@/shared/api/article'
import {
  knowledgeQnAFaqCategories,
  knowledgeQnAFaqItems,
  knowledgeQnASeo,
  knowledgeQnASidebarBanners,
} from './knowledgeQnAData'

const route = useRoute()
const trialPagePath = toPagePath('single_mfsy')
const faqAnchorId = 'knowledge-faqs'

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

/** 面包屑数据 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: '首页', to: '/' },
  { label: '知识问答', to: '/zhishiwenda' },
  { label: article.value?.title ?? '文章详情' },
])

/** 上一篇链接 */
const prevLink = computed(() => {
  if (!prevArticle.value) return undefined
  return `/zhishiwenda/${prevArticle.value.id}`
})

/** 下一篇链接 */
const nextLink = computed(() => {
  if (!nextArticle.value) return undefined
  return `/zhishiwenda/${nextArticle.value.id}`
})

/** 从 HTML 内容中提取标题作为 TOC 目录项 */
const knowledgeDetailTocItems = computed<ArticleSidebarTocItem[]>(() => {
  const items: ArticleSidebarTocItem[] = []
  if (!article.value?.content) return items

  // 解析 HTML 中的 h2/h3 标签，提取 id 和文本
  const headingRegex = /<h([23])\b[^>]*?(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h[23]>/gi
  let match: RegExpExecArray | null
  let index = 0

  while ((match = headingRegex.exec(article.value.content)) !== null) {
    const level = match[1]
    const id = match[2] || `knowledge-heading-${index}`
    const text = (match[3] ?? '').replace(/<[^>]+>/g, '').trim()
    if (text) {
      items.push({
        id,
        title: level === '2' ? text : `· ${text}`,
      })
      index++
    }
  }

  // 添加 FAQ 锚点
  if (knowledgeQnAFaqItems.length) {
    items.push({ id: faqAnchorId, title: '本文相关FAQs' })
  }

  return items
})

const activeTocId = ref('')
let tocObserver: IntersectionObserver | null = null

// ==================== TOC 滚动监听 ====================

async function observeTocAnchors() {
  tocObserver?.disconnect()
  tocObserver = null

  await nextTick()

  const anchorElements = knowledgeDetailTocItems.value
    .map((item) => document.getElementById(item.id))
    .filter((element): element is HTMLElement => Boolean(element))

  activeTocId.value = knowledgeDetailTocItems.value[0]?.id ?? ''

  if (!anchorElements.length) return

  tocObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

      if (visibleEntry?.target.id) {
        activeTocId.value = visibleEntry.target.id
      }
    },
    {
      rootMargin: '-104px 0px -62% 0px',
      threshold: [0, 0.1, 1],
    },
  )

  anchorElements.forEach((element) => tocObserver?.observe(element))
}

// ==================== SEO ====================

useHead(() => {
  if (!article.value) {
    return {
      title: knowledgeQnASeo.title,
    }
  }

  return {
    title: article.value.seoTitle || `${article.value.title} - 知识问答 - 销帮帮 CRM`,
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

    // 等待 DOM 更新后建立 TOC 监听
    await nextTick()
    observeTocAnchors()
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文章失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadArticle()
})

watch(
  () => route.params.id,
  () => {
    loadArticle()
  },
)

onBeforeUnmount(() => {
  tocObserver?.disconnect()
  tocObserver = null
})
</script>

<style scoped>
.knowledge-article-detail-page {
  position: relative;
}

.knowledge-article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 300px);
  align-items: start;
  justify-content: space-between;
  gap: 48px;
  padding-top: 48px;
}

.knowledge-main-column {
  min-width: 0;
  width: 100%;
}

.knowledge-sidebar {
  position: sticky;
  top: calc(var(--client-header-height, 76px) + 24px);
  z-index: 3;
  width: 100%;
  max-width: 300px;
  justify-self: end;
}

/* ===== 骨架屏 ===== */
.animate-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ===== 文章头部 ===== */
.knowledge-detail-header {
  margin-bottom: 38px;
}

.knowledge-detail-title {
  max-width: 980px;
  margin: 0;
  color: #0f172a;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.22;
}

.knowledge-detail-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  margin-top: 24px;
  color: #7d8797;
  font-size: 16px;
  line-height: 1.5;
}

.knowledge-detail-consult {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  border-radius: 999px;
  background: #ff7a1a;
  padding: 0 14px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  transition:
    background var(--transition-duration-fast) ease,
    transform var(--transition-duration-fast) ease;
}

.knowledge-detail-consult:hover {
  background: #f06d0d;
  transform: translateY(-1px);
}

.knowledge-detail-summary {
  margin-top: 32px;
  border-left: 5px solid #ff7a1a;
  border-radius: 3px;
  background: #f6f7f9;
  padding: 24px;
  color: #111827;
  font-size: 16px;
  line-height: 1.7;
}

/* ===== 富文本内容样式 ===== */
/* 已提取到 src/client/styles/rich-text.css 全局共享 */

/* ===== FAQ 区域 ===== */
.knowledge-faq-shell {
  margin-top: 46px;
  scroll-margin-top: calc(var(--client-header-height, 76px) + 28px);
}

.knowledge-faq-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 28px;
}

.knowledge-faq-actions :deep(a),
.knowledge-faq-actions :deep(button) {
  min-width: 172px;
  font-weight: 500;
}

.knowledge-faq-shell :deep(section) {
  padding: 0;
}

.knowledge-faq-shell :deep(section > div) {
  width: 100%;
  max-width: none;
  margin: 0;
}

@media (max-width: 1199px) {
  .knowledge-article-layout {
    display: block;
    padding-top: 36px;
  }

  .knowledge-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .knowledge-detail-title {
    font-size: 28px;
  }

  .knowledge-detail-meta {
    gap: 14px;
    font-size: 14px;
  }

  .knowledge-detail-summary {
    padding: 20px 22px;
    font-size: 16px;
  }
}
</style>