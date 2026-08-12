<!--
  复用度：高（业务场景组件）
  可复用场景：内容列表页、资讯中心、帮助中心、博客首页等列表展示场景
  支持四种变体：
    - card（默认）：4 列图文卡片网格，含封面图、描述
    - compact：紧凑图文卡片，无描述，图片比例 16:9
    - list：纯文本列表行，无图片
    - article-row：文章横向列表，左图右文，内置分页器
-->
<template>
  <component :is="hideHeader ? 'div' : SectionBlock" :spacing="hideHeader ? undefined : 'default'">
    <!-- 标题区：左侧标题 + 右侧「查看全部」 -->
    <div v-if="!hideHeader" class="flex items-end justify-between gap-6">
      <SectionHeading
        :title="title"
        :subtitle="subtitle"
        align="left"
      />
      <component
        v-if="variant !== 'article-row'"
        :is="viewAllLink ? 'a' : 'button'"
        :href="viewAllLink"
        class="inline-flex shrink-0 items-center gap-1.5 text-small text-brand-primary font-semibold whitespace-nowrap transition-colors duration-fast ease hover:text-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary motion-reduce:transition-none"
        @click="!viewAllLink && emit('viewAll')"
      >
        <span>{{ variant === 'list' ? '查看全部' : '查看全部' }}</span>
        <Right :size="16" :stroke-width="3" />
      </component>
    </div>

    <!-- ===== 变体：card（默认）— 卡片网格 ===== -->
    <div
      v-if="variant === 'card'"
      :class="[
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-4',
        hideHeader ? 'mt-0' : 'mt-12 max-lg:mt-10 max-md:mt-8',
      ]"
    >
      <component
        :is="getLinkComponent(item.linkHref)"
        v-for="item in items"
        :key="item.title"
        :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
        :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
        :class="[
          'group flex flex-col overflow-hidden border border-border-subtle bg-surface-primary',
          rounded ? 'rounded-card' : 'rounded-none',
          'transition-all duration-normal ease',
          'hover:-translate-y-1 hover:shadow-card-hover',
          'motion-reduce:transition-none motion-reduce:transform-none',
          item.linkHref ? 'cursor-pointer' : '',
        ]"
        :role="item.linkHref ? undefined : 'button'"
        :tabindex="item.linkHref ? undefined : 0"
        @keydown="(e: KeyboardEvent) => handleCardKeydown(e, item)"
        @click="!item.linkHref && emit('cardClick', item.title)"
      >
        <!-- 封面图片 -->
        <div class="relative aspect-video overflow-hidden">
          <img
            :src="getOSSImageUrl(item.image, 280)"
            :alt="item.imageAlt ?? item.title"
            class="block h-full w-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
            loading="lazy"
          />
          <!-- 分类标签：图片左上角浮层 -->
          <span
            v-if="item.tag"
            class="absolute left-3 top-3 inline-flex items-center rounded-pill bg-white/85 px-2.5 py-1 text-caption font-medium text-brand-primary backdrop-blur-sm"
          >
            {{ item.tag }}
          </span>
        </div>

        <!-- 内容区 -->
        <div class="flex flex-1 flex-col p-6 max-lg:p-5 max-md:p-4">
          <h3 class="text-h3 text-text-primary leading-subtitle">
            {{ item.title }}
          </h3>
          <p class="mt-2 line-clamp-2 text-body text-text-secondary leading-body">
            {{ item.description }}
          </p>
        </div>
      </component>
    </div>

    <!-- ===== 变体：compact — 紧凑图文卡片 ===== -->
    <div
      v-if="variant === 'compact'"
      :class="[
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-4',
        hideHeader ? 'mt-0' : 'mt-12 max-lg:mt-10 max-md:mt-8',
      ]"
    >
      <component
        :is="getLinkComponent(item.linkHref)"
        v-for="item in items"
        :key="item.title"
        :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
        :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
        :class="[
          'group flex flex-col overflow-hidden border border-border-subtle bg-surface-primary',
          rounded ? 'rounded-card' : 'rounded-none',
          'transition-all duration-normal ease',
          'hover:-translate-y-1 hover:shadow-card-hover',
          'motion-reduce:transition-none motion-reduce:transform-none',
          item.linkHref ? 'cursor-pointer' : '',
        ]"
        :role="item.linkHref ? undefined : 'button'"
        :tabindex="item.linkHref ? undefined : 0"
        @keydown="(e: KeyboardEvent) => handleCardKeydown(e, item)"
        @click="!item.linkHref && emit('cardClick', item.title)"
      >
        <!-- 封面图片（16:9） -->
        <div class="relative aspect-video overflow-hidden">
          <img
            :src="getOSSImageUrl(item.image, 280)"
            :alt="item.imageAlt ?? item.title"
            class="block h-full w-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
            loading="lazy"
          />
          <!-- 分类标签：图片左上角浮层 -->
          <span
            v-if="item.tag"
            class="absolute left-3 top-3 inline-flex items-center rounded-pill bg-white/85 px-2.5 py-1 text-caption font-medium text-brand-primary backdrop-blur-sm"
          >
            {{ item.tag }}
          </span>
        </div>

        <!-- 内容区（紧凑） -->
        <div class="flex flex-1 flex-col p-6 max-lg:p-5 max-md:p-4">
          <h3
            :class="[
              'text-h3 text-text-primary leading-subtitle max-lg:text-h3 max-md:text-body',
              item.linkHref
                ? 'transition-colors duration-fast ease group-hover:text-brand-primary'
                : '',
            ]"
          >
            {{ item.title }}
          </h3>
          <time
            v-if="!hideDate && item.publishDate"
            :datetime="item.publishDate"
            class="mt-2 text-caption text-text-tertiary"
          >
            {{ item.publishDate }}
          </time>
        </div>
      </component>
    </div>

    <!-- ===== 变体：list — 纯文本列表 ===== -->
    <div v-if="variant === 'list'" :class="hideHeader ? 'mt-0' : 'mt-12 max-lg:mt-10 max-md:mt-8'">
      <div
        v-for="item in items"
        :key="item.title"
        class="group flex items-center gap-4 border-b border-border-subtle py-4 last:border-b-0 max-md:gap-3 max-md:py-3"
      >
        <!-- 发布时间 -->
        <time
          :datetime="item.publishDate"
          class="shrink-0 w-24 text-caption text-text-tertiary max-md:w-20"
        >
          {{ item.publishDate }}
        </time>

        <!-- 分类标签 -->
        <span v-if="item.tag" class="shrink-0 text-caption text-text-secondary max-md:hidden">
          {{ item.tag }}
        </span>
        <!-- 移动端：标签显示在标题下方 -->
        <span
          v-if="item.tag"
          class="hidden shrink-0 text-caption text-text-secondary max-md:inline"
        >
          {{ item.tag }}
        </span>

        <!-- 文章标题（可点击穿透） -->
        <component
          :is="getLinkComponent(item.linkHref, 'button')"
          :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
          :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
          class="flex min-w-0 flex-1 items-center gap-1.5 text-left text-body text-text-primary truncate transition-colors duration-fast ease hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none max-md:text-small"
          :role="item.linkHref ? undefined : 'button'"
          :tabindex="item.linkHref ? undefined : 0"
          @keydown="(e: KeyboardEvent) => handleListKeydown(e, item)"
          @click="!item.linkHref && emit('itemClick', item.title)"
        >
          <span class="truncate">{{ item.title }}</span>
          <Right
            :size="14"
            :stroke-width="3"
            class="shrink-0 opacity-0 transition-opacity duration-fast ease group-hover:opacity-100 motion-reduce:transition-none"
          />
        </component>
      </div>
    </div>

    <!-- ===== 变体：article-row — 横向文章列表 ===== -->
    <div
      v-if="variant === 'article-row'"
      :class="['content-list-article-row', hideHeader ? 'mt-0' : 'mt-12 max-lg:mt-10 max-md:mt-8']"
    >
      <!-- 初始加载骨架屏（仅 loading 且无数据时显示） -->
      <div
        v-if="loading && items.length === 0"
        class="content-list-article-row__skeleton"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="content-list-article-row__skeleton-item"
        >
          <div class="content-list-article-row__skeleton-media" />
          <div class="content-list-article-row__skeleton-body">
            <div class="content-list-article-row__skeleton-line skeleton-line--short" />
            <div class="content-list-article-row__skeleton-line skeleton-line--medium" />
            <div class="content-list-article-row__skeleton-line skeleton-line--long" />
          </div>
        </div>
      </div>

      <!-- 数据列表（翻页时保持挂载，通过 Transition 切换） -->
      <div
        v-else
        class="content-list-article-row__items"
      >
        <Transition name="list-fade" mode="out-in">
          <div :key="currentPage" class="content-list-article-row__items-inner">
            <div
              v-for="item in items"
              :key="item.title"
              class="content-list-article-row__item"
            >
              <div class="content-list-article-row__media">
                <component
                  v-if="item.image"
                  :is="getLinkComponent(item.linkHref)"
                  :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
                  :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
                  class="content-list-article-row__media-link"
                  :aria-label="item.linkHref ? `查看文章：${item.title}` : undefined"
                >
                  <img :src="getOSSImageUrl(item.image, 300)" :alt="item.imageAlt ?? item.title" loading="lazy" class="content-list-article-row__media-img" />
                </component>
              </div>

              <div class="content-list-article-row__body">
                <h3 class="content-list-article-row__title">
                  <component
                    :is="getLinkComponent(item.linkHref, 'span')"
                    :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
                    :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
                    class="content-list-article-row__text-link"
                  >
                    {{ item.title }}
                  </component>
                </h3>
                <p v-if="item.summary || item.description" class="content-list-article-row__description">
                  <component
                    :is="getLinkComponent(item.linkHref, 'span')"
                    :to="isInternalLink(item.linkHref) ? item.linkHref : undefined"
                    :href="isInternalLink(item.linkHref) ? undefined : item.linkHref"
                    class="content-list-article-row__summary-link"
                  >
                    {{ item.summary || item.description }}
                  </component>
                </p>

                <div class="content-list-article-row__meta">
                  <time :datetime="item.updatedAt ?? item.publishDate">{{
                    item.updatedAt ?? item.publishDate
                  }}</time>
                  <span v-if="item.author" aria-hidden="true">|</span>
                  <span v-if="item.author">{{ item.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div
        v-if="showPagination && total > 0"
        class="flex justify-center mt-6"
      >
        <Pagination
          :current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          :show-total="false"
          :show-size-changer="false"
          :show-quick-jumper="false"
          @update:current-page="handlePaginationChange"
        />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Right } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Pagination from '@/client/components/ui/Pagination.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

/** 内容卡片数据 */
export interface ContentCard {
  /** 封面图片 URL（card/compact 模式必需，list 模式可选） */
  image?: string
  /** 图片 alt 文本，默认取 title */
  imageAlt?: string
  /** 分类标签 */
  tag?: string
  /** 卡片标题 */
  title: string
  /** 摘要（card 模式显示；article-row 未传 summary 时作为回退） */
  description?: string
  /** 内容梗概（article-row 模式优先显示） */
  summary?: string
  /** 发布日期（如 "2024-10-28"） */
  publishDate: string
  /** 编辑时间（article-row 模式优先显示，未传则回退 publishDate） */
  updatedAt?: string
  /** 作者（article-row 模式显示） */
  author?: string
  /** 链接地址，为空时触发 cardClick / itemClick 事件 */
  linkHref?: string
}

/** 内容展示形态 */
type ContentVariant = 'card' | 'compact' | 'list' | 'article-row'

withDefaults(
  defineProps<{
    /** 区块标题 */
    title: string
    /** 区块副标题 */
    subtitle?: string
    /** 内容数据列表 */
    items: ContentCard[]
    /** 「查看全部」链接地址，为空时触发 viewAll 事件 */
    viewAllLink?: string
    /** 展示形态：card（默认，含描述）| compact（紧凑，无描述）| list（纯文本列表）| article-row（横向文章列表） */
    variant?: ContentVariant
    /** 隐藏标题栏（标题 + 查看全部），用于外部自行放置标题区 */
    hideHeader?: boolean
    /** 卡片圆角开关：true（默认，圆角）| false（直角），仅 card/compact 变体生效 */
    rounded?: boolean
    /** article-row 模式是否显示分页器 */
    showPagination?: boolean
    /** article-row 模式当前页码 */
    currentPage?: number
    /** article-row 模式数据总条数（Pagination 组件使用） */
    total?: number
    /** article-row 模式每页条数 */
    pageSize?: number
    /** （已废弃，请使用 total）article-row 模式总页数 */
    totalPages?: number
    /** 隐藏发布日期（card/compact 变体生效） */
    hideDate?: boolean
    /** 加载中状态（article-row 模式：初始加载时显示骨架屏，翻页时保持现有列表） */
    loading?: boolean
  }>(),
  {
    variant: 'card',
    hideHeader: false,
    rounded: true,
    showPagination: false,
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    hideDate: false,
    loading: false,
  },
)

const emit = defineEmits<{
  /** 点击「查看全部」（viewAllLink 为空时触发） */
  viewAll: []
  /** 卡片点击 — card/compact 模式（linkHref 为空时触发） */
  cardClick: [title: string]
  /** 列表项点击 — list 模式（linkHref 为空时触发） */
  itemClick: [title: string]
  /** article-row 分页器页码变化 */
  pageChange: [page: number]
  /** article-row 分页器 v-model 当前页 */
  'update:currentPage': [page: number]
}>()

/** 判断是否为内部链接（以 / 开头且非 // 开头） */
function isInternalLink(href?: string): boolean {
  return !!href && href.startsWith('/') && !href.startsWith('//')
}

/** 根据链接类型返回对应的组件：内部链接用 RouterLink，外部链接用 <a>，无链接用 fallback（默认 div） */
function getLinkComponent(href?: string, fallback = 'div') {
  if (!href) return fallback
  return isInternalLink(href) ? RouterLink : 'a'
}

/** 键盘事件处理：Enter/Space 触发卡片点击（card/compact 模式） */
function handleCardKeydown(e: KeyboardEvent, item: ContentCard): void {
  if (item.linkHref) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('cardClick', item.title)
  }
}

/** 键盘事件处理：Enter/Space 触发列表项点击（list 模式） */
function handleListKeydown(e: KeyboardEvent, item: ContentCard): void {
  if (item.linkHref) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('itemClick', item.title)
  }
}

/** Pagination 组件翻页回调 */
function handlePaginationChange(page: number): void {
  emit('update:currentPage', page)
  emit('pageChange', page)
}
</script>

<style scoped>
.content-list-article-row {
  border-top: 1px solid #e5e7eb;
}

/* ===== 初始加载骨架屏 ===== */
.content-list-article-row__skeleton {
  padding-top: 0;
}

.content-list-article-row__skeleton-item {
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 50px 0;
  border-bottom: 1px solid #d9dee7;
}

.content-list-article-row__skeleton-media {
  flex: 0 0 300px;
  width: 300px;
  aspect-ratio: 300 / 152;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: content-list-skeleton-pulse 1.5s ease-in-out infinite;
}

.content-list-article-row__skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.content-list-article-row__skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: content-list-skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-line--short {
  width: 40%;
}

.skeleton-line--medium {
  width: 65%;
}

.skeleton-line--long {
  width: 85%;
}

@keyframes content-list-skeleton-pulse {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.content-list-article-row__items {
  position: relative;
}

.content-list-article-row__items-inner {
  will-change: opacity;
}

/* 列表翻页过渡动画 — 仅透明度过渡，不改变容器高度 */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.25s ease;
}

.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .list-fade-enter-active,
  .list-fade-leave-active {
    transition: none;
  }

  .list-fade-enter-from,
  .list-fade-leave-to {
    opacity: 1;
  }
}

.content-list-article-row__item {
  display: flex;
  align-items: center;
  gap: 26px;
  width: 100%;
  padding: 50px 0;
  border-bottom: 1px solid #d9dee7;
  color: inherit;
  text-decoration: none;
}

.content-list-article-row__media {
  flex: 0 0 300px;
  width: 300px;
  aspect-ratio: 300 / 152;
  overflow: hidden;
  border-radius: 4px;
  background: #f4f6f9;
  cursor: pointer;
}

.content-list-article-row__media-link {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.content-list-article-row__media-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .content-list-article-row__media-img {
    transition: none;
  }
}

.content-list-article-row__media:hover .content-list-article-row__media-img {
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .content-list-article-row__media:hover .content-list-article-row__media-img {
    transform: none;
  }
}

.content-list-article-row__media:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .content-list-article-row__media:hover {
    box-shadow: none;
  }
}

.content-list-article-row__body {
  min-width: 0;
  flex: 1;
}

.content-list-article-row__title {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  transition: color 0.2s ease;
}

.content-list-article-row__text-link,
.content-list-article-row__summary-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  transition: color 0.2s ease;
}

.content-list-article-row__text-link:focus-visible,
.content-list-article-row__summary-link:focus-visible,
.content-list-article-row__media-link:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 3px;
}

.content-list-article-row__text-link:hover,
.content-list-article-row__summary-link:hover {
  color: var(--color-brand-primary);
}

.content-list-article-row__description {
  display: -webkit-box;
  margin: 12px 0 0;
  overflow: hidden;
  color: #3f4a5a;
  font-size: 14px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.content-list-article-row__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
  color: #8b97a8;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .content-list-article-row__item {
    align-items: flex-start;
    gap: 20px;
    padding: 34px 0;
  }

  .content-list-article-row__media {
    flex-basis: 240px;
    width: 240px;
  }

  .content-list-article-row__title {
    font-size: 19px;
  }

  .content-list-article-row__description {
    font-size: 15px;
  }

  .content-list-article-row__skeleton-item {
    gap: 20px;
    padding: 34px 0;
  }

  .content-list-article-row__skeleton-media {
    flex-basis: 240px;
    width: 240px;
  }
}

@media (max-width: 640px) {
  .content-list-article-row__item {
    flex-direction: column;
  }

  .content-list-article-row__media {
    width: 100%;
    flex-basis: auto;
  }

  .content-list-article-row__skeleton-item {
    flex-direction: column;
  }

  .content-list-article-row__skeleton-media {
    width: 100%;
    flex-basis: auto;
    aspect-ratio: 300 / 152;
  }
}
</style>
