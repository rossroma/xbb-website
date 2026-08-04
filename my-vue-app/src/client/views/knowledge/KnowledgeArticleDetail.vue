<template>
  <div class="knowledge-article-detail-page">
    <SectionBlock spacing="none" paddingBottom="default" width="default">
      <EmptyState v-if="!article" message="文章不存在或已下线" class="knowledge-detail-empty" />

      <template v-else>
        <Breadcrumb :items="breadcrumbItems" show-home-icon />

        <div class="knowledge-article-layout">
          <main class="knowledge-main-column">
            <article class="knowledge-detail-article">
              <header class="knowledge-detail-header">
                <h1 class="knowledge-detail-title">{{ article.title }}</h1>

                <div class="knowledge-detail-meta">
                  <span>{{ article.author }} · 编辑于 {{ article.updatedAt }}</span>
                  <RouterLink to="/message" class="knowledge-detail-consult">微信咨询</RouterLink>
                </div>

                <div class="knowledge-detail-summary">
                  {{ article.summary }}
                </div>
              </header>

              <div class="article-content">
                <template v-for="(block, blockIndex) in article.blocks" :key="blockIndex">
                  <h2
                    v-if="block.type === 'heading'"
                    :id="getBlockAnchor(blockIndex)"
                    class="article-heading"
                  >
                    {{ block.text }}
                  </h2>

                  <h3 v-else-if="block.type === 'subheading'" class="article-subheading">
                    {{ block.text }}
                  </h3>

                  <p v-else-if="block.type === 'paragraph'" class="article-paragraph">
                    <strong v-if="block.strongLead">{{ block.strongLead }}</strong
                    >{{ block.text }}
                  </p>

                  <div v-else-if="block.type === 'table'" class="article-table-wrap">
                    <table class="article-table">
                      <thead>
                        <tr>
                          <th v-for="header in block.headers" :key="header">
                            {{ header }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                          <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            {{ cell }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </div>

              <div v-if="article.faqItems?.length" :id="faqAnchorId" class="knowledge-faq-shell">
                <FaqList
                  title="本文相关FAQs"
                  :categories="article.faqCategories ?? knowledgeQnAFaqCategories"
                  :items="article.faqItems"
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
      </template>
    </SectionBlock>
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
import EmptyState from '@/client/components/ui/EmptyState.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import UiButton from '@/client/components/ui/Button.vue'
import { toPagePath } from '@/client/data/routePaths'
import {
  getKnowledgeArticleBySlug,
  knowledgeQnAFaqCategories,
  knowledgeQnASeo,
  knowledgeQnASidebarBanners,
} from './knowledgeQnAData'

const route = useRoute()
const trialPagePath = toPagePath('single_mfsy')
const faqAnchorId = 'knowledge-faqs'
const getBlockAnchor = (blockIndex: number) => `knowledge-section-${blockIndex}`

const article = computed(() => {
  const slug = String(route.params.slug ?? '')
  return getKnowledgeArticleBySlug(slug)
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: '首页', to: '/' },
  { label: '知识问答', to: '/zhishiwenda' },
  { label: article.value?.title ?? '文章详情' },
])

const knowledgeDetailTocItems = computed<ArticleSidebarTocItem[]>(() => {
  if (!article.value) return []

  const headingItems = article.value.blocks.flatMap((block, blockIndex) =>
    block.type === 'heading' ? [{ id: getBlockAnchor(blockIndex), title: block.text }] : [],
  )

  if (article.value.faqItems?.length) {
    headingItems.push({ id: faqAnchorId, title: '本文相关FAQs' })
  }

  return headingItems
})

const activeTocId = ref('')
let tocObserver: IntersectionObserver | null = null

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

onMounted(() => {
  observeTocAnchors()
})

watch(
  () => route.params.slug,
  () => {
    observeTocAnchors()
  },
)

onBeforeUnmount(() => {
  tocObserver?.disconnect()
  tocObserver = null
})

useHead(() => {
  if (!article.value) {
    return {
      title: knowledgeQnASeo.title,
    }
  }

  return {
    title: `${article.value.title} - 知识问答 - 销帮帮 CRM`,
    meta: [
      {
        name: 'description',
        content: article.value.summary,
      },
    ],
  }
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

.knowledge-detail-empty {
  margin-top: 80px;
}

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

.article-content {
  color: var(--color-text-primary);
  line-height: 1.85;
  font-size: 16px;
}

.article-paragraph {
  margin-bottom: 16px;
}

.article-paragraph strong {
  color: var(--color-text-primary);
  font-weight: 700;
}

.article-heading {
  margin-top: 34px;
  margin-bottom: 16px;
  scroll-margin-top: calc(var(--client-header-height, 76px) + 28px);
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.32;
}

.article-heading::before {
  position: relative;
  top: -2px;
  display: inline-block;
  width: 4px;
  height: 25px;
  margin-right: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #5b61ff 0%, #7fd6ff 100%);
  content: '';
  vertical-align: middle;
}

.article-subheading {
  margin-top: 28px;
  margin-bottom: 14px;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.article-table th,
.article-table td {
  border: 1px solid var(--color-border-default);
  padding: 10px 14px;
  text-align: left;
  vertical-align: top;
}

.article-table th {
  background: var(--color-surface-secondary);
  font-weight: 600;
}

.article-table-wrap {
  overflow-x: auto;
  margin: 20px 0;
}

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
