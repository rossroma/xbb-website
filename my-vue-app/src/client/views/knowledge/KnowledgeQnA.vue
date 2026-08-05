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

          <ContentList
            title=""
            :items="paginatedKnowledgeArticleList"
            variant="article-row"
            hide-header
            show-pagination
            v-model:current-page="currentPage"
            :total-pages="knowledgeArticleTotalPages"
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
import { computed, ref } from 'vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import ArticleSidebar from '@/client/components/business/ArticleSidebar.vue'
import ContentList from '@/client/components/business/ContentList.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import {
  knowledgeArticleList,
  knowledgeQnAHeroSlide,
  knowledgeSceneSolutionItems,
} from './knowledgeQnAData'

const knowledgeArticlePageSize = 10
const currentPage = ref(1)

const knowledgeArticleTotalPages = computed(() =>
  Math.max(1, Math.ceil(knowledgeArticleList.length / knowledgeArticlePageSize)),
)

const paginatedKnowledgeArticleList = computed(() => {
  const startIndex = (currentPage.value - 1) * knowledgeArticlePageSize
  return knowledgeArticleList.slice(startIndex, startIndex + knowledgeArticlePageSize)
})

usePageSEO()
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
