<template>
  <div class="knowledge-qna-page">
    <HeroBanner mode="single" :slides="[knowledgeQnAHeroSlide]" />

    <SectionBlock spacing="none" paddingBottom="default" width="default">
      <div class="knowledge-article-layout">
        <main class="knowledge-main-column">
          <header class="knowledge-list-header">
            <h2>知识问答</h2>
            <p>精选 CRM 选型、客户管理和数字化经营相关内容，帮助企业快速理解落地方法。</p>
          </header>

          <!-- 错误态（仅初始加载出错时显示） -->
          <ErrorState
            v-if="errorMessage && !articleList"
            :message="errorMessage"
            class="mt-6"
            @retry="loadArticles"
          />

          <!-- 空态（已加载但无数据） -->
          <EmptyState
            v-else-if="!isLoading && !errorMessage && articleList && articleItems.length === 0"
            message="暂无知识问答文章"
            class="mt-6"
          />

          <!-- 文章列表（始终渲染，翻页时 ContentList 保持挂载） -->
          <ContentList
            v-else
            title=""
            :items="articleItems"
            variant="article-row"
            hide-header
            show-pagination
            :loading="isLoading && !articleList"
            v-model:current-page="currentPage"
            :total="articleList?.total ?? 0"
            :page-size="pageSize"
            @page-change="handlePageChange"
          />
        </main>

        <aside class="knowledge-sidebar" aria-label="知识问答侧边栏">
          <ArticleSidebar
            variant="link-tags"
            title="推荐CRM场景解决方案"
            :toc-items="knowledgeSceneSolutionItems"
            view-all-text="获取您的专属方案"
            view-all-link="/liuzi"
          />
        </aside>
      </div>
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import ArticleSidebar from '@/client/components/business/ArticleSidebar.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import type { ContentCard } from '@/client/components/business/ContentList.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import ErrorState from '@/client/components/ui/ErrorState.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import { getClientArticles, type ClientArticleListResponse } from '@/shared/api/article'
import {
  knowledgeQnAHeroSlide,
  knowledgeSceneSolutionItems,
} from './knowledgeQnAData'

const KNOWLEDGE_QNA_BID = 190
const pageSize = 10

// ==================== SEO ====================

usePageSEO()

// ==================== 状态 ====================

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const articleList = ref<ClientArticleListResponse | null>(null)
const currentPage = ref(1)

/** Unix 时间戳转日期字符串 */
function formatTimestamp(ts: number): string {
  if (!ts) return ''
  const date = new Date(ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 转换为 ContentCard 格式 */
const articleItems = computed<ContentCard[]>(() => {
  if (!articleList.value) return []
  return articleList.value.items.map((article) => ({
    title: article.title,
    image: article.simg || undefined,
    imageAlt: article.title,
    description: article.descs || undefined,
    summary: article.descs || undefined,
    publishDate: formatTimestamp(article.addtime),
    updatedAt: article.updatetime ? formatTimestamp(article.updatetime) : undefined,
    author: '销帮帮',
    linkHref: `/zhishiwenda/${article.id}`,
  }))
})

// ==================== 数据加载 ====================

async function loadArticles() {
  isLoading.value = true
  errorMessage.value = null

  try {
    articleList.value = await getClientArticles({
      bid: KNOWLEDGE_QNA_BID,
      page: currentPage.value,
      limit: pageSize,
    })
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '加载文章列表失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// ==================== 事件处理 ====================

function handlePageChange(page: number) {
  currentPage.value = page
  loadArticles()
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.knowledge-qna-page {
  position: relative;
}

.knowledge-article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 300px);
  align-items: start;
  justify-content: space-between;
  gap: 48px;
  padding-top: 40px;
}

.knowledge-main-column {
  min-width: 0;
  width: 100%;
}

.knowledge-list-header {
  padding-bottom: 12px;
}

.knowledge-list-header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.25;
}

.knowledge-list-header p {
  max-width: 680px;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.75;
}

.knowledge-sidebar {
  position: sticky;
  top: calc(var(--client-header-height, 76px) + 24px);
  z-index: 3;
  width: 100%;
  max-width: 300px;
  justify-self: end;
}

@media (max-width: 1199px) {
  .knowledge-article-layout {
    display: block;
    padding-top: 32px;
  }

  .knowledge-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .knowledge-list-header h2 {
    font-size: 24px;
  }

  .knowledge-list-header p {
    font-size: 14px;
  }
}
</style>