<template>
  <div :class="['article-sidebar', `article-sidebar--${variant}`]">
    <div v-if="variant === 'toc' && banners.length" class="article-sidebar__banners">
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

    <nav
      v-if="variant === 'toc'"
      :class="['article-sidebar__toc', { 'is-expanded': isExpanded }]"
      :aria-label="ariaLabel || '文章目录'"
    >
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

    <nav v-else class="article-sidebar__links" :aria-label="ariaLabel || title">
      <h2 class="article-sidebar__links-title">{{ title }}</h2>
      <div class="article-sidebar__links-grid">
        <component
          :is="linkComponent(itemLink(item))"
          v-for="item in tocItems"
          :key="item.id"
          v-bind="linkAttrs(itemLink(item))"
          class="article-sidebar__link-tag"
        >
          {{ item.title }}
        </component>
      </div>
      <component
        :is="linkComponent(viewAllLink)"
        v-if="viewAllLink && viewAllText"
        v-bind="linkAttrs(viewAllLink)"
        class="article-sidebar__view-all"
      >
        {{ viewAllText }}
      </component>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

export type ArticleSidebarVariant = 'toc' | 'link-tags'

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
    variant?: ArticleSidebarVariant
    activeTocId?: string
    title?: string
    ariaLabel?: string
    collapsedCount?: number
    defaultExpanded?: boolean
    expandText?: string
    collapseText?: string
    viewAllText?: string
    viewAllLink?: string
  }>(),
  {
    banners: () => [],
    variant: 'toc',
    activeTocId: '',
    title: '目录',
    ariaLabel: '',
    collapsedCount: 4,
    defaultExpanded: false,
    expandText: '展开更多',
    collapseText: '收起',
    viewAllText: '',
    viewAllLink: '',
  },
)

const isExpanded = ref(props.defaultExpanded)
const shouldShowToggle = computed(() => props.tocItems.length > props.collapsedCount)
const collapsedHeight = computed(() => `${Math.max(props.collapsedCount, 1) * 38}px`)
const tocListStyle = computed(() => ({
  '--article-sidebar-collapsed-height': collapsedHeight.value,
}))

function itemLink(item: ArticleSidebarTocItem): string {
  return item.href ?? `#${item.id}`
}

function isInternalRoute(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

function isExternalLink(href: string): boolean {
  return /^https?:\/\//.test(href) || href.startsWith('//')
}

function linkComponent(href: string) {
  return isInternalRoute(href) ? RouterLink : 'a'
}

function linkAttrs(href: string) {
  if (isInternalRoute(href)) {
    return { to: href }
  }

  if (isExternalLink(href)) {
    return {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  return { href }
}
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

.article-sidebar--link-tags {
  max-height: none;
  overflow: visible;
  padding-right: 0;
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

.article-sidebar__links {
  overflow: hidden;
  border: 0;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.article-sidebar__links-title {
  position: relative;
  border-bottom: 1px solid #edf0f5;
  padding: 18px 20px 15px 32px;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}

.article-sidebar__links-title::before {
  position: absolute;
  top: 21px;
  left: 20px;
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: var(--color-brand-primary);
  content: '';
}

.article-sidebar__links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 10px;
  padding: 18px 20px 20px;
}

.article-sidebar__link-tag {
  display: flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid #edf0f5;
  border-radius: 3px;
  background: #f7f9fc;
  padding: 8px 9px;
  color: #354052;
  font-size: 14px;
  line-height: 1.35;
  text-align: center;
  text-decoration: none;
  transition:
    border-color var(--transition-duration-fast) ease,
    background var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease;
}

.article-sidebar__link-tag:hover {
  border-color: rgba(255, 100, 0, 0.36);
  background: #fff7f0;
  color: var(--color-brand-primary);
}

.article-sidebar__link-tag:focus-visible,
.article-sidebar__view-all:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}

.article-sidebar__view-all {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #edf0f5;
  padding: 15px 20px;
  color: var(--color-brand-primary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  text-decoration: none;
  transition:
    background var(--transition-duration-fast) ease,
    color var(--transition-duration-fast) ease;
}

.article-sidebar__view-all:hover {
  background: var(--color-brand-primary-soft);
  color: var(--color-brand-primary-hover);
}
</style>
