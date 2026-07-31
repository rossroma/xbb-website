<!--
  复用度：高（业务场景组件）
  可复用场景：内容列表页、资讯中心、帮助中心、博客首页等列表展示场景
  支持三种变体：
    - card（默认）：4 列图文卡片网格，含封面图、描述
    - compact：紧凑图文卡片，无描述，图片比例 16:9
    - list：纯文本列表行，无图片
-->
<template>
  <component :is="hideHeader ? 'div' : SectionBlock" :spacing="hideHeader ? undefined : 'default'">
    <!-- 标题区：左侧标题 + 右侧「查看全部」 -->
    <div v-if="!hideHeader" class="flex items-end justify-between gap-6">
      <div>
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-4 text-body text-text-secondary leading-body">
          {{ subtitle }}
        </p>
      </div>
      <component
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
        hideHeader ? 'mt-0' : 'mt-14 max-lg:mt-10 max-md:mt-8',
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
            :src="item.image"
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
          <time :datetime="item.publishDate" class="mt-auto pt-4 text-caption text-text-tertiary">
            {{ item.publishDate }}
          </time>
        </div>
      </component>
    </div>

    <!-- ===== 变体：compact — 紧凑图文卡片 ===== -->
    <div
      v-if="variant === 'compact'"
      :class="[
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-4',
        hideHeader ? 'mt-0' : 'mt-14 max-lg:mt-10 max-md:mt-8',
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
            :src="item.image"
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
            v-if="item.publishDate"
            :datetime="item.publishDate"
            class="mt-2 text-caption text-text-tertiary"
          >
            {{ item.publishDate }}
          </time>
        </div>
      </component>
    </div>

    <!-- ===== 变体：list — 纯文本列表 ===== -->
    <div v-if="variant === 'list'" :class="hideHeader ? 'mt-0' : 'mt-14 max-lg:mt-10 max-md:mt-8'">
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
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Right } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'

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
  /** 摘要（仅 card 模式显示） */
  description?: string
  /** 发布日期（如 "2024-10-28"） */
  publishDate: string
  /** 链接地址，为空时触发 cardClick / itemClick 事件 */
  linkHref?: string
}

/** 内容展示形态 */
type ContentVariant = 'card' | 'compact' | 'list'

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
    /** 展示形态：card（默认，含描述）| compact（紧凑，无描述）| list（纯文本列表） */
    variant?: ContentVariant
    /** 隐藏标题栏（标题 + 查看全部），用于外部自行放置标题区 */
    hideHeader?: boolean
    /** 卡片圆角开关：true（默认，圆角）| false（直角），仅 card/compact 变体生效 */
    rounded?: boolean
  }>(),
  {
    variant: 'card',
    hideHeader: false,
    rounded: true,
  },
)

const emit = defineEmits<{
  /** 点击「查看全部」（viewAllLink 为空时触发） */
  viewAll: []
  /** 卡片点击 — card/compact 模式（linkHref 为空时触发） */
  cardClick: [title: string]
  /** 列表项点击 — list 模式（linkHref 为空时触发） */
  itemClick: [title: string]
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
</script>
