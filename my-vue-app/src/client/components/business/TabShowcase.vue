<template>
  <SectionBlock spacing="default">
    <h2 class="text-h1 text-text-primary leading-heading text-center max-lg:text-h2 max-md:text-h3">
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

    <!-- 统一容器：Tab 列表 + 图片区域融为一体 -->
    <div
      :class="[
        'mt-12 grid lg:h-105 lg:overflow-hidden max-lg:mt-8',
        layout === 'tabs-right' ? 'grid-cols-[1fr_380px]' : 'grid-cols-[380px_1fr]',
        // 响应式：移动端单列，子元素恢复独立圆角
        'max-lg:grid-cols-1 max-lg:rounded-none max-lg:border-0 max-lg:shadow-none max-lg:gap-6 max-lg:overflow-visible',
      ]"
    >
      <!-- Tab 列表 -->
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
            <!-- 图标（选填），颜色跟随标题文字 -->
            <component
              v-if="tab.badgeIcon"
              :is="tab.badgeIcon"
              :size="20"
              theme="outline"
              :stroke-width="3"
              class="tab-showcase-tab__icon shrink-0 mt-1 text-text-primary"
              aria-hidden="true"
            />

            <!-- 内容区 -->
            <div class="flex flex-col gap-1 min-w-0 flex-1">
              <span
                :class="[
                  'tab-showcase-tab__label text-h3 leading-subtitle transition-colors duration-glide max-lg:text-body',
                  activeTab === index ? 'font-semibold' : 'text-text-primary',
                ]"
              >
                {{ tab.label }}
              </span>

              <!-- 描述：grid 动画展开/收起，min-height 固定 3 行保证不同 Tab 聚焦时高度一致 -->
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
            class="tab-showcase-mobile-image mt-6 mb-6 hidden aspect-[680/420] w-full tab-showcase-image-frame max-lg:block"
          >
            <img :src="tab.image" :alt="tab.imageAlt ?? tab.label" class="tab-showcase-image" />
          </div>
        </div>
      </div>

      <!-- 图片区域：固定最小高度撑开组件，避免 Tab 切换时高度跳动 -->
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
            class="aspect-[680/420] w-full max-w-170 tab-showcase-image-frame"
          >
            <img
              :src="currentTab.image"
              :alt="currentTab.imageAlt ?? currentTab.label"
              class="tab-showcase-image"
            />
          </div>
        </Transition>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { type Theme, THEME_PRIMARY_COLOR } from './theme'

/** Tab 展示项 */
export interface TabShowcaseItem {
  key: string
  label: string
  description: string
  image: string
  imageAlt?: string
  /** 左侧图标（图标组件，选填） */
  badgeIcon?: Component
}

const props = withDefaults(
  defineProps<{
    title: string
    titleHighlight?: string
    tabs: readonly TabShowcaseItem[]
    layout?: 'tabs-left' | 'tabs-right'
    /** 仅控制左侧当前选中 Tab 的色系 */
    theme?: Theme
  }>(),
  {
    layout: 'tabs-left',
    theme: 'plain',
  },
)

const activeTab = ref(0)
const tabRefs = ref<(HTMLElement | null)[]>([])

const currentTab = computed(() => props.tabs[activeTab.value])
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

.tab-showcase-image-frame {
  isolation: isolate;
  border-radius: 16px;
  overflow: hidden;
  clip-path: inset(0 round 16px);
  -webkit-mask-image: -webkit-radial-gradient(#ffffff, #000000);
}

.tab-showcase-image {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  clip-path: inset(0 round 16px);
  object-fit: contain;
  transform: translateZ(0);
}

.tab-image-enter-active,
.tab-image-leave-active {
  transition:
    opacity 240ms ease,
    transform 240ms ease;
}
.tab-image-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tab-image-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
