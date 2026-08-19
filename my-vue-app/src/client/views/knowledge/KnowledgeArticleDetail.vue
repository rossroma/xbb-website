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
                  <span>{{ article.author }} · 编辑于 {{ formattedTime}}</span>
                  <RouterLink to="/mianfeishiyong" class="knowledge-detail-consult">免费试用</RouterLink>
                </div>

                <div v-if="summaryText" class="knowledge-detail-summary">
                  {{ summaryText }}
                </div>
              </header>

              <!-- 文章正文（使用 processedContent 确保所有标题都有锚点 ID） -->
              <div class="article-content rich-text" v-html="processedContent" />

              <!-- 上下篇导航 -->
              <PageNav
                :prev-link="prevLink"
                :prev-title="prevArticle?.title"
                :next-link="nextLink"
                :next-title="nextArticle?.title"
              />

              <!-- FAQ 区域 -->
              <div v-if="faqItems.length" :id="faqAnchorId" class="knowledge-faq-shell">
                <FaqList
                  title="本文相关FAQs"
                  :categories="[{ key: 'all', label: '全部' }]"
                  :items="faqItems"
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
              @toc-click="onTocClick"
            />
          </aside>
        </div>
      </SectionBlock>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
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
  getClientArticles,
  type ArticleDetail as ArticleDetailData,
  type ArticleNavInfo,
} from '@/shared/api/article'
import type { FaqItem } from '@/client/components/business/FaqList.vue'
import { knowledgeQnASeo, knowledgeQnASidebarBanners } from './knowledgeQnAData'
import { generateJsonLd, type FaqSchemaItem } from '@/client/data/jsonLd'

const route = useRoute()
const trialPagePath = toPagePath('single_mfsy')
const faqAnchorId = 'knowledge-faqs'

// ==================== 状态 ====================

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const article = ref<ArticleDetailData | null>(null)
const prevArticle = ref<ArticleNavInfo | null>(null)
const nextArticle = ref<ArticleNavInfo | null>(null)
const faqItems = ref<FaqItem[]>([])

const KNOWLEDGE_QNA_BID = 190
const FAQ_PAGE_SIZE = 3

// ==================== 计算属性 ====================

/** 摘要：优先使用 descs，否则从正文内容截取 */
const summaryText = computed(() => {
  if (article.value?.descs) return article.value.descs
  if (!article.value?.content) return ''
  const text = article.value.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > 200 ? text.slice(0, 200) + '…' : text
})

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

/** 将 faqItems 转为 FaqSchemaItem 格式（去除 HTML 标签） */
const faqSchemaItems = computed<FaqSchemaItem[]>(() => {
  return faqItems.value.map((item) => ({
    question: item.question,
    answer: item.answer.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  }))
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

const HEADING_SCROLL_MARGIN = 'calc(var(--client-header-height, 76px) + 28px)'

/** 为文章正文中缺少 id 的 h2/h3 注入锚点 ID 和 scroll-margin-top */
const processedContent = computed(() => {
  if (!article.value?.content) return ''
  let index = 0
  return article.value.content.replace(
    /<h([23])(\b[^>]*?)>/gi,
    (match, _level, attrs) => {
      // 已有 id 的不处理
      if (/id\s*=\s*["']/i.test(attrs)) return match
      const id = `knowledge-heading-${index++}`
      return `<h${_level}${attrs} id="${id}" style="scroll-margin-top:${HEADING_SCROLL_MARGIN}">`
    },
  )
})

/** 从 HTML 内容中提取标题作为 TOC 目录项（基于 processedContent 确保 ID 完整） */
const knowledgeDetailTocItems = computed<ArticleSidebarTocItem[]>(() => {
  const items: ArticleSidebarTocItem[] = []
  if (!processedContent.value) return items

  // 解析 HTML 中的 h2/h3 标签，提取 id 和文本
  // 注意：不能用 (?:id="...")? 方式捕获 id，因为非贪婪匹配的 [^>]*? 会跳过 id 捕获
  // 改用 [^>]* 捕获完整属性串，再从中提取 id
  const headingRegex = /<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(processedContent.value)) !== null) {
    const level = match[1]
    const attrs = match[2] ?? ''
    const content = match[3] ?? ''
    const id = attrs.match(/id="([^"]*)"/)?.[1]
    const text = content.replace(/<[^>]+>/g, '').trim()
    if (id && text) {
      items.push({
        id,
        title: level === '2' ? text : `· ${text}`,
      })
    }
  }

  // 添加 FAQ 锚点
  if (faqItems.value.length) {
    items.push({ id: faqAnchorId, title: '本文相关FAQs' })
  }

  return items
})

const activeTocId = ref('')

/** 用户点击目录项时，立即更新高亮并平滑滚动到目标标题 */
function onTocClick(id: string) {
  activeTocId.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 目录项加载完成后，默认高亮第一项
watch(
  () => knowledgeDetailTocItems.value,
  (items) => {
    if (items.length && !activeTocId.value) {
      activeTocId.value = items[0]!.id
    }
  },
  { immediate: true },
)

// ==================== SEO ====================

useHead(() => {
  if (!article.value) {
    return {
      title: knowledgeQnASeo.title,
    }
  }

  // 生成 FAQPage JSON-LD 脚本
  const faqLdScripts = faqSchemaItems.value.length > 0
    ? generateJsonLd(
        ['FAQPage'],
        route.path,
        { title: article.value.title, description: article.value.setDescription || summaryText.value || '' },
        undefined,
        { faqItems: faqSchemaItems.value },
      )
    : []

  return {
    title: article.value.seoTitle || `${article.value.title} - 知识问答 - 销帮帮 CRM`,
    meta: [
      {
        name: 'description',
        content: article.value.setDescription || summaryText.value || '',
      },
      {
        name: 'keywords',
        content: article.value.seoKeyword || '',
      },
    ],
    script: faqLdScripts.length > 0 ? faqLdScripts : undefined,
  }
})

// ==================== 数据加载 ====================

/** 加载 FAQ 数据（同栏目文章） */
async function loadFaqArticles() {
  try {
    const result = await getClientArticles({
      bid: KNOWLEDGE_QNA_BID,
      page: 1,
      limit: FAQ_PAGE_SIZE,
    })
    faqItems.value = result.items.map((item) => ({
      id: item.id,
      question: item.title,
      answer: item.content || item.descs || '',
      category: 'all',
    }))
  } catch {
    // FAQ 非关键数据，静默失败
    faqItems.value = []
  }
}

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
    const [result] = await Promise.all([
      getClientArticleDetail(id),
      loadFaqArticles(),
    ])
    article.value = result.article
    prevArticle.value = result.prev
    nextArticle.value = result.next

    // 等待 DOM 更新
    await nextTick()
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
  word-break: break-word;
  overflow-wrap: break-word;
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