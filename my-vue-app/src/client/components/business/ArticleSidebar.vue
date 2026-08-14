<template>
  <div
    :class="[
      'flex w-full max-h-[calc(100vh-var(--client-header-height,76px)-48px)] flex-col gap-3.5 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]',
      variant === 'link-tags' ? 'max-h-none overflow-visible pr-0' : '',
    ]"
  >
    <div v-if="variant === 'toc' && banners.length" class="flex flex-col gap-3.5">
      <template v-for="banner in banners" :key="banner.key ?? banner.title">
        <RouterLink
          v-if="banner.to"
          :to="banner.to"
          class="block aspect-[15/7] w-full overflow-hidden rounded-lg bg-surface-secondary no-underline transition-[transform,box-shadow] duration-normal"
        >
          <img
            :src="getOSSImageUrl(banner.image, 280)"
            :alt="banner.imageAlt ?? banner.title"
            class="block size-full object-cover"
            loading="lazy"
          />
        </RouterLink>
        <a
          v-else-if="banner.href"
          :href="banner.href"
          class="block aspect-[15/7] w-full overflow-hidden rounded-lg bg-surface-secondary no-underline transition-[transform,box-shadow] duration-normal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="getOSSImageUrl(banner.image, 280)"
            :alt="banner.imageAlt ?? banner.title"
            class="block size-full object-cover"
            loading="lazy"
          />
        </a>
        <div
          v-else
          class="block aspect-[15/7] w-full overflow-hidden rounded-lg bg-surface-secondary no-underline transition-[transform,box-shadow] duration-normal"
        >
          <img
            :src="getOSSImageUrl(banner.image, 280)"
            :alt="banner.imageAlt ?? banner.title"
            class="block size-full object-cover"
            loading="lazy"
          />
        </div>
      </template>
    </div>

    <nav
      v-if="variant === 'toc'"
      :class="[
        'relative rounded-lg border border-border-subtle bg-white/[0.98]',
        isExpanded ? 'overflow-y-auto overscroll-contain [scrollbar-width:thin]' : 'overflow-hidden',
      ]"
      :aria-label="ariaLabel || '文章目录'"
    >
      <h2
        class="border-b border-border-subtle px-4 py-1 text-xs font-semibold leading-1.4 text-text-primary"
      >
        {{ title }}
      </h2>
      <ol
        :class="[
          'relative m-0 list-none px-0 py-2.5 transition-[max-height] duration-normal',
          shouldShowToggle && !isExpanded
            ? tocListCollapsedClass
            : '',
        ]"
        :style="tocListStyle"
      >
        <li v-for="item in tocItems" :key="item.id" class="min-w-0">
          <a
            :href="item.href ?? `#${item.id}`"
            :class="[
              'block box-border max-w-full truncate border-l-[3px] px-4.5 py-1 text-small leading-1.45 text-text-secondary no-underline transition-colors duration-fast hover:border-l-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2',
              activeTocId === item.id
                ? 'border-l-brand-primary bg-brand-primary-soft font-semibold text-brand-primary'
                : 'border-l-transparent',
            ]"
            @click="handleTocClick(item.id)"
          >
            {{ item.title }}
          </a>
        </li>
      </ol>
      <button
        v-if="shouldShowToggle"
        :class="[
          'z-2 block w-max border-0 bg-transparent p-0 text-small font-semibold leading-1.45 text-brand-primary cursor-pointer transition-opacity duration-fast hover:opacity-80',
          isExpanded ? 'static mx-auto mb-4' : 'absolute inset-x-0 bottom-4 mx-auto',
        ]"
        type="button"
        :aria-expanded="isExpanded"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? collapseText : expandText }}
      </button>
    </nav>

    <nav
      v-else
      class="overflow-hidden rounded bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
      :aria-label="ariaLabel || title"
    >
      <h2
        class="border-b border-l-4 border-b-[#edf0f5] border-l-brand-primary px-5 py-[18px] pl-3 text-[18px] font-semibold leading-1.35 text-text-primary"
      >
        {{ title }}
      </h2>
      <div class="grid grid-cols-2 gap-x-2.5 gap-y-3 px-5 pb-5 pt-[18px]">
        <component
          :is="linkComponent(itemLink(item))"
          v-for="item in tocItems"
          :key="item.id"
          v-bind="linkAttrs(itemLink(item))"
          class="flex min-h-9 items-center justify-center rounded-[3px] border border-[#edf0f5] bg-[#f7f9fc] px-[9px] py-2 text-center text-small leading-1.35 text-[#354052] no-underline transition-[border-color,background,color] duration-fast hover:border-[rgba(255,100,0,0.36)] hover:bg-[#fff7f0] hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2"
        >
          {{ item.title }}
        </component>
      </div>
      <component
        :is="linkComponent(viewAllLink)"
        v-if="viewAllLink && viewAllText"
        v-bind="linkAttrs(viewAllLink)"
        class="flex items-center justify-center border-t border-[#edf0f5] px-5 py-[15px] text-small font-semibold leading-1.35 text-brand-primary no-underline transition-[background,color] duration-fast hover:bg-brand-primary-soft hover:text-brand-primary-hover focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2"
      >
        {{ viewAllText }}
      </component>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

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

const emit = defineEmits<{
  'toc-click': [id: string]
}>()

const isExpanded = ref(props.defaultExpanded)
const shouldShowToggle = computed(() => props.tocItems.length > props.collapsedCount)
const collapsedHeight = computed(() => `${Math.max(props.collapsedCount, 1) * 38}px`)
const tocListCollapsedClass =
  "max-h-[var(--article-sidebar-collapsed-height)] overflow-hidden pb-[46px] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[74px] after:bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.88)_46%,rgba(255,255,255,0.98)_100%)] after:content-['']"
const tocListStyle = computed(() => ({
  '--article-sidebar-collapsed-height': collapsedHeight.value,
}))

function handleTocClick(id: string) {
  emit('toc-click', id)
}

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
