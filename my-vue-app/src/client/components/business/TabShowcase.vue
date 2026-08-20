<template>
  <SectionBlock spacing="default">
    <h2
      class="text-[36px] text-h1 text-text-primary leading-heading text-center max-lg:text-h2 max-md:text-h3"
    >
      <template v-if="titleParts">
        {{ titleParts.before
        }}<span
          :class="[
            'business-section-title-highlight',
            titleParts.isShort ? 'business-section-title-highlight--short' : '',
          ]"
          :data-text="titleParts.highlight"
        >
          {{ titleParts.highlight }}</span
        >{{ titleParts.after }}
      </template>
      <template v-else>
        {{ title }}
      </template>
    </h2>

    <p
      v-if="subtitle"
      class="mx-auto justify-center mt-4 max-w-150 text-body text-text-tertiary leading-body max-lg:text-body"
    >
      {{ subtitle }}
    </p>

    <!-- ===== Single tab mode（仅一个 tab 时，无 tab 导航，左文右图/右文左图） ===== -->
    <div
      v-if="isSingleTab && singleTab"
      :class="[
        'mt-12 grid items-center gap-16 max-lg:mt-8 max-lg:gap-8 max-lg:grid-cols-1',
        isSingleTabRight
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]'
          : 'lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]',
      ]"
    >
      <!-- 文本面板（参照 ImageShowcase 字体字号） -->
      <div
        :class="[
          'flex flex-col justify-center p-12 max-lg:p-8 max-md:p-6',
          isSingleTabRight ? 'lg:order-2' : 'lg:order-1',
        ]"
      >
        <h3
          class="mt-6 text-[36px] text-h1 font-semibold text-text-primary leading-heading whitespace-pre-line max-lg:text-h2 max-md:text-h3"
        >
          {{ singleTab.label }}
        </h3>
        <p class="mt-4 max-w-150 text-body text-text-tertiary leading-body">
          {{ singleTab.description }}
        </p>
        <div v-if="ctaText" class="mt-12 max-lg:mt-8">
          <Button variant="hero" size="lg" @click="$emit('ctaClick')">
            {{ ctaText }}
          </Button>
        </div>
      </div>

      <!-- 图片面板（TabShowcase 图片样式） -->
      <div
        :class="[
          'flex items-center justify-center min-h-105 max-lg:min-h-0',
          isSingleTabRight ? 'lg:order-1' : 'lg:order-2',
        ]"
      >
        <div
          class="isolate aspect-[680/420] w-full max-w-170 overflow-hidden rounded-card [clip-path:inset(0_round_16px)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)]"
        >
          <img
            :src="singleTab.image"
            :alt="singleTab.imageAlt ?? singleTab.label"
            class="block size-full rounded-card object-contain [clip-path:inset(0_round_16px)] [transform:translateZ(0)]"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- ===== Multi-tab 模式 ===== -->
    <div
      v-else-if="layout === 'tabs-left-horizontal'"
      class="tab-showcase-left-horizontal mt-12 grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-10 max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-6"
    >
      <div class="min-w-0">
        <div
          class="flex items-center gap-1 overflow-x-auto border-b border-border-subtle pb-4"
          role="tablist"
          :aria-label="title"
        >
          <div
            v-for="(tab, index) in tabs"
            :key="tab.key"
            class="tab-showcase-tab-item shrink-0"
            role="presentation"
          >
            <button
              :ref="(el) => (tabRefs[index] = el as HTMLElement | null)"
              type="button"
              role="tab"
              :aria-selected="activeTab === index"
              :aria-controls="`tab-panel-${tab.key}`"
              :tabindex="activeTab === index ? 0 : -1"
              :style="activeTab === index ? activeTabStyle : undefined"
              :class="[
                'tab-showcase-tab tab-showcase-tab--top relative inline-flex items-center gap-2 px-4 py-3 rounded-none border border-transparent text-left whitespace-nowrap transition-all duration-glide cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
                'motion-reduce:transition-none motion-reduce:transform-none',
                activeTab === index ? 'is-active' : '',
              ]"
              @mouseenter="setActiveTab(index)"
              @focus="setActiveTab(index)"
              @click="setActiveTab(index)"
              @keydown.up.prevent="navigateTab(-1)"
              @keydown.down.prevent="navigateTab(1)"
            >
              <span
                :class="[
                  'tab-showcase-tab__label text-body leading-body transition-colors duration-glide',
                  activeTab === index ? 'font-semibold' : 'text-text-secondary',
                ]"
              >
                {{ tab.label }}
              </span>
            </button>
          </div>
        </div>

        <Transition name="tab-panel" mode="out-in">
          <div v-if="currentTab" :key="currentTab.key" class="mt-10 max-lg:mt-6">
            <h3 class="text-h1 font-bold text-text-primary leading-heading max-md:text-h2">
              {{ currentTab.label }}
            </h3>
            <p
              class="mt-6 max-w-136 text-body text-text-secondary leading-body whitespace-pre-line max-lg:mt-4"
            >
              {{ currentTab.description }}
            </p>
          </div>
        </Transition>
      </div>

      <div
        :id="`tab-panel-${currentTab?.key}`"
        role="tabpanel"
        :aria-labelledby="`tab-${currentTab?.key}`"
        class="tab-showcase-left-horizontal__visual"
      >
        <Transition name="tab-image" mode="out-in">
          <div
            v-if="currentTab"
            :key="currentTab.key"
            class="isolate aspect-[680/420] w-full overflow-hidden rounded-card [clip-path:inset(0_round_16px)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)]"
          >
            <img
              :src="currentTab.image"
              :alt="currentTab.imageAlt ?? currentTab.label"
              class="block size-full rounded-card object-contain [clip-path:inset(0_round_16px)] [transform:translateZ(0)]"
            />
          </div>
        </Transition>
      </div>
    </div>

    <div v-else-if="layout === 'tabs-top'" class="tab-showcase-top mt-12 max-lg:mt-8">
      <div
        class="flex items-center justify-center gap-2 overflow-x-auto border-b border-border-subtle pb-4 [border-bottom-color:rgba(6,15,26,0.05)]"
        role="tablist"
        :aria-label="title"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          class="tab-showcase-tab-item"
          role="presentation"
        >
          <button
            :ref="(el) => (tabRefs[index] = el as HTMLElement | null)"
            type="button"
            role="tab"
            :aria-selected="activeTab === index"
            :aria-controls="`tab-panel-${tab.key}`"
            :tabindex="activeTab === index ? 0 : -1"
            :style="activeTab === index ? activeTabStyle : undefined"
            :class="[
              'tab-showcase-tab tab-showcase-tab--top relative inline-flex items-center gap-2 rounded-none border border-transparent bg-transparent px-5 py-3 text-left whitespace-nowrap shadow-none transition-all duration-glide cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
              'motion-reduce:transition-none motion-reduce:transform-none',
              activeTab === index ? 'is-active' : '',
            ]"
            @mouseenter="setActiveTab(index)"
            @focus="setActiveTab(index)"
            @click="setActiveTab(index)"
            @keydown.up.prevent="navigateTab(-1)"
            @keydown.down.prevent="navigateTab(1)"
          >
            <component
              v-if="tab.badgeIcon"
              :is="tab.badgeIcon"
              :size="18"
              theme="outline"
              :stroke-width="3"
              class="tab-showcase-tab__icon shrink-0 text-text-secondary"
              aria-hidden="true"
            />
            <span
              :class="[
                'tab-showcase-tab__label text-body leading-body transition-colors duration-glide',
                activeTab === index ? 'font-semibold' : 'text-text-secondary',
              ]"
            >
              {{ tab.label }}
            </span>
          </button>
        </div>
      </div>

      <Transition name="tab-panel" mode="out-in">
        <div
          v-if="currentTab"
          :key="currentTab.key"
          class="tab-showcase-top__panel mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-10 max-lg:grid-cols-1 max-lg:gap-6"
        >
          <div class="max-lg:text-center">
            <h3
              class="text-h1 font-bold text-text-primary leading-heading max-lg:text-h2 max-md:text-h3"
            >
              {{ currentTab.label }}
            </h3>
            <p
              class="mt-6 max-w-136 text-body text-text-secondary leading-body whitespace-pre-line max-lg:mx-auto max-lg:mt-4"
            >
              {{ currentTab.description }}
            </p>
          </div>
          <div
            class="isolate aspect-[680/420] w-full overflow-hidden rounded-card [clip-path:inset(0_round_16px)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)]"
          >
            <img
              :src="currentTab.image"
              :alt="currentTab.imageAlt ?? currentTab.label"
              class="block size-full rounded-card object-contain [clip-path:inset(0_round_16px)] [transform:translateZ(0)]"
            />
          </div>
        </div>
      </Transition>
    </div>

    <div
      v-else
      :class="[
        'mt-12 grid lg:min-h-105 max-lg:mt-8',
        layout === 'tabs-right' ? 'grid-cols-[1fr_380px]' : 'grid-cols-[380px_1fr]',
        'max-lg:grid-cols-1 max-lg:rounded-none max-lg:border-0 max-lg:shadow-none max-lg:gap-6 max-lg:overflow-visible',
      ]"
    >
      <div
        :class="[
          'flex flex-col gap-1 p-2 justify-center',
          layout === 'tabs-right' ? 'order-2 max-lg:order-1' : 'order-1',
          'max-lg:rounded-card',
        ]"
        role="tablist"
        :aria-label="title"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          class="tab-showcase-tab-item"
          role="presentation"
        >
          <button
            :ref="(el) => (tabRefs[index] = el as HTMLElement | null)"
            type="button"
            role="tab"
            :aria-selected="activeTab === index"
            :aria-controls="`tab-panel-${tab.key}`"
            :tabindex="activeTab === index ? 0 : -1"
            :style="activeTab === index ? activeTabStyle : undefined"
            :class="[
              'tab-showcase-tab relative flex w-full items-start gap-4 px-5 py-4 rounded-inner border border-transparent text-left transition-all duration-glide cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
              'motion-reduce:transition-none motion-reduce:transform-none',
              activeTab === index ? 'is-active' : '',
            ]"
            @mouseenter="setActiveTab(index)"
            @focus="setActiveTab(index)"
            @click="setActiveTab(index)"
            @keydown.up.prevent="navigateTab(-1)"
            @keydown.down.prevent="navigateTab(1)"
          >
            <component
              v-if="tab.badgeIcon"
              :is="tab.badgeIcon"
              :size="20"
              theme="outline"
              :stroke-width="3"
              class="tab-showcase-tab__icon shrink-0 mt-1 text-text-primary"
              aria-hidden="true"
            />

            <div class="flex flex-col gap-1 min-w-0 flex-1">
              <span
                :class="[
                  'tab-showcase-tab__label text-h3 leading-subtitle transition-colors duration-glide max-lg:text-body',
                  activeTab === index ? 'font-semibold' : 'text-text-primary',
                ]"
              >
                {{ tab.label }}
              </span>

              <div
                :class="[
                  'grid transition-all duration-glide motion-reduce:transition-none',
                  activeTab === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                ]"
              >
                <div class="overflow-hidden">
                  <p
                    class="text-small leading-small text-text-secondary line-clamp-3 min-h-[4.2rem]"
                  >
                    {{ tab.description }}
                  </p>
                </div>
              </div>
            </div>
          </button>

          <div
            v-if="activeTab === index && tab.image"
            class="tab-showcase-mobile-image isolate mt-6 mb-6 hidden aspect-[680/420] w-full overflow-hidden rounded-card [clip-path:inset(0_round_16px)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)] max-lg:block"
          >
            <img
              :src="tab.image"
              :alt="tab.imageAlt ?? tab.label"
              class="block size-full rounded-card object-contain [clip-path:inset(0_round_16px)] [transform:translateZ(0)]"
            />
          </div>
        </div>
      </div>

      <div
        :id="`tab-panel-${currentTab?.key}`"
        role="tabpanel"
        :aria-labelledby="`tab-${currentTab?.key}`"
        :class="[
          'flex items-center justify-center min-h-105',
          layout === 'tabs-right' ? 'order-1 max-lg:order-2' : 'order-2',
          'max-lg:hidden max-lg:min-h-0 max-lg:rounded-card',
        ]"
      >
        <Transition name="tab-image" mode="out-in">
          <div
            v-if="currentTab"
            :key="currentTab.key"
            class="isolate aspect-[680/420] w-full max-w-170 overflow-hidden rounded-card [clip-path:inset(0_round_16px)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)]"
          >
            <img
              :src="currentTab.image"
              :alt="currentTab.imageAlt ?? currentTab.label"
              class="block size-full rounded-card object-contain [clip-path:inset(0_round_16px)] [transform:translateZ(0)]"
            />
          </div>
        </Transition>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Button from '@/client/components/ui/Button.vue'
import { type Theme, THEME_PRIMARY_COLOR } from './theme'

export interface TabShowcaseItem {
  key: string
  label: string
  description: string
  image: string
  imageAlt?: string
  badgeIcon?: Component
}

const props = withDefaults(
  defineProps<{
    title: string
    titleHighlight?: string
    subtitle?: string
    tabs: readonly TabShowcaseItem[]
    layout?: 'tabs-left' | 'tabs-right' | 'tabs-top' | 'tabs-left-horizontal'
    theme?: Theme
    /** 单 tab 模式下文案下方的按钮文字，未传不显示（仅 isSingleTab 生效） */
    ctaText?: string
  }>(),
  {
    layout: 'tabs-left',
    theme: 'plain',
  },
)

defineEmits<{
  ctaClick: []
}>()

const activeTab = ref(0)
const tabRefs = ref<(HTMLElement | null)[]>([])

const currentTab = computed(() => props.tabs[activeTab.value])

/** 仅一个 tab 时进入单 tab 模式 */
const isSingleTab = computed(() => props.tabs.length === 1)
const singleTab = computed(() => (isSingleTab.value ? props.tabs[0] : null))

/** 单 tab 模式下文本是否在右侧（layout 为 tabs-right 时） */
const isSingleTabRight = computed(() => isSingleTab.value && props.layout === 'tabs-right')

const titleParts = computed(() => {
  const highlight = props.titleHighlight?.trim()
  if (!highlight) return null

  const index = props.title.indexOf(highlight)
  if (index < 0) return null

  return {
    before: props.title.slice(0, index),
    highlight,
    after: props.title.slice(index + highlight.length),
    isShort: highlight.length <= 2,
  }
})

const activeTabStyle = computed<Record<string, string>>(() => ({
  '--tab-showcase-accent': THEME_PRIMARY_COLOR[props.theme],
}))

const setActiveTab = (index: number) => {
  if (activeTab.value === index) return
  activeTab.value = index
}

const navigateTab = (direction: number) => {
  const next = activeTab.value + direction
  if (next >= 0 && next < props.tabs.length) {
    setActiveTab(next)
    tabRefs.value[next]?.focus()
  }
}
</script>

<style>
.tab-showcase-tab.is-active {
  background-color: color-mix(in srgb, var(--tab-showcase-accent) 7%, #ffffff);
  border-color: color-mix(in srgb, var(--tab-showcase-accent) 18%, #ffffff);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--tab-showcase-accent) 10%, transparent);
}

.tab-showcase-tab--top.is-active {
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}

.tab-showcase-tab--top.is-active::after {
  position: absolute;
  right: 0;
  bottom: -17px;
  left: 0;
  height: 2px;
  content: '';
  background: var(--tab-showcase-accent);
}

.tab-showcase-tab.is-active .tab-showcase-tab__icon,
.tab-showcase-tab.is-active .tab-showcase-tab__label {
  color: var(--tab-showcase-accent);
}

@supports not (background-color: color-mix(in srgb, #000000 10%, #ffffff)) {
  .tab-showcase-tab.is-active {
    background-color: #f8fafc;
    border-color: #e2e8f0;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  }
}

.tab-image-enter-active,
.tab-image-leave-active,
.tab-panel-enter-active,
.tab-panel-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}

.tab-image-enter-from,
.tab-panel-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-image-leave-to,
.tab-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
