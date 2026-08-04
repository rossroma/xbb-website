<template>
  <div class="article-sidebar">
    <div v-if="banners.length" class="article-sidebar__banners">
      <template v-for="banner in banners" :key="banner.key ?? banner.title">
        <RouterLink v-if="banner.to" :to="banner.to" class="article-sidebar__promo">
          <img
            :src="banner.image"
            :alt="banner.imageAlt ?? banner.title"
            class="article-sidebar__promo-image"
            loading="lazy"
          />
        </RouterLink>
        <a
          v-else-if="banner.href"
          :href="banner.href"
          class="article-sidebar__promo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="banner.image"
            :alt="banner.imageAlt ?? banner.title"
            class="article-sidebar__promo-image"
            loading="lazy"
          />
        </a>
        <div v-else class="article-sidebar__promo">
          <img
            :src="banner.image"
            :alt="banner.imageAlt ?? banner.title"
            class="article-sidebar__promo-image"
            loading="lazy"
          />
        </div>
      </template>
    </div>

    <nav :class="['article-sidebar__toc', { 'is-expanded': isExpanded }]" aria-label="文章目录">
      <h2 class="article-sidebar__toc-title">{{ title }}</h2>
      <ol
        :class="['article-sidebar__toc-list', { 'is-collapsed': shouldShowToggle && !isExpanded }]"
        :style="tocListStyle"
      >
        <li v-for="item in tocItems" :key="item.id">
          <a :href="item.href ?? `#${item.id}`" :class="{ 'is-active': activeTocId === item.id }">
            {{ item.title }}
          </a>
        </li>
      </ol>
      <button
        v-if="shouldShowToggle"
        class="article-sidebar__toc-toggle"
        type="button"
        :aria-expanded="isExpanded"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? collapseText : expandText }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ArticleSidebarBanner {
  key?: string
  title: string
  image: string
  imageAlt?: string
  to?: string
  href?: string
}

export interface ArticleSidebarTocItem {
  id: string
  title: string
  href?: string
}

const props = withDefaults(
  defineProps<{
    banners?: ArticleSidebarBanner[]
    tocItems: ArticleSidebarTocItem[]
    activeTocId?: string
    title?: string
    collapsedCount?: number
    defaultExpanded?: boolean
    expandText?: string
    collapseText?: string
  }>(),
  {
    banners: () => [],
    activeTocId: '',
    title: '目录',
    collapsedCount: 4,
    defaultExpanded: false,
    expandText: '展开更多',
    collapseText: '收起',
  },
)

const isExpanded = ref(props.defaultExpanded)
const shouldShowToggle = computed(() => props.tocItems.length > props.collapsedCount)
const collapsedHeight = computed(() => `${Math.max(props.collapsedCount, 1) * 38}px`)
const tocListStyle = computed(() => ({
  '--article-sidebar-collapsed-height': collapsedHeight.value,
}))
</script>

<style scoped>
.article-sidebar {
  display: flex;
  width: 100%;
  max-height: calc(100vh - var(--client-header-height, 76px) - 48px);
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;
  scrollbar-width: thin;
}

.article-sidebar__banners {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.article-sidebar__promo {
  display: block;
  width: 100%;
  aspect-ratio: 15 / 7;
  overflow: hidden;
  border-radius: 8px;
  background: var(--color-surface-secondary);
  text-decoration: none;
  transition:
    transform var(--transition-duration-normal) ease,
    box-shadow var(--transition-duration-normal) ease;
}

.article-sidebar__promo-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-sidebar__toc {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.98);
}

.article-sidebar__toc-title {
  border-bottom: 1px solid var(--color-border-subtle);
  padding: 4px 16px;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.article-sidebar__toc-list {
  position: relative;
  margin: 0;
  padding: 10px 0;
  list-style: none;
  transition: max-height var(--transition-duration-normal) ease;
}

.article-sidebar__toc-list li {
  min-width: 0;
}

.article-sidebar__toc-list.is-collapsed {
  max-height: var(--article-sidebar-collapsed-height);
  overflow: hidden;
  padding-bottom: 46px;
}

.article-sidebar__toc-list.is-collapsed::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 74px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.88) 46%,
    rgba(255, 255, 255, 0.98) 100%
  );
  content: '';
  pointer-events: none;
}

.article-sidebar__toc-list a {
  display: block;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
  border-left: 3px solid transparent;
  padding: 4px 18px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.45;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    color var(--transition-duration-fast) ease,
    background var(--transition-duration-fast) ease,
    border-color var(--transition-duration-fast) ease;
}

.article-sidebar__toc-list a:hover,
.article-sidebar__toc-list a.is-active {
  border-left-color: var(--color-brand-primary);
  background: var(--color-brand-primary-soft);
  color: var(--color-brand-primary);
}

.article-sidebar__toc-list a.is-active {
  font-weight: 600;
}

.article-sidebar__toc-toggle {
  position: absolute;
  right: 0;
  bottom: 16px;
  left: 0;
  z-index: 2;
  display: block;
  width: max-content;
  margin: 0 auto;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--color-brand-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
  cursor: pointer;
  transition: opacity var(--transition-duration-fast) ease;
}

.article-sidebar__toc.is-expanded .article-sidebar__toc-toggle {
  position: static;
  margin: 0 auto 16px;
}

.article-sidebar__toc-toggle:hover {
  opacity: 0.8;
}
</style>
