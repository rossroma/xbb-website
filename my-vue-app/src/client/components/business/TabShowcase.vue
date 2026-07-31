<template>
  <SectionBlock spacing="default">
    <h2 class="text-h1 text-text-primary leading-heading text-center max-lg:text-h2 max-md:text-h3">
      {{ title }}
    </h2>

    <!-- 统一容器：Tab 列表 + 图片区域融为一体 -->
    <div
      :class="[
        'mt-12 grid rounded-card border border-border-subtle shadow-subtle overflow-hidden max-lg:mt-8',
        layout === 'tabs-right' ? 'grid-cols-[1fr_380px]' : 'grid-cols-[380px_1fr]',
        // 响应式：移动端单列，子元素恢复独立圆角
        'max-lg:grid-cols-1 max-lg:rounded-none max-lg:border-0 max-lg:shadow-none max-lg:gap-6 max-lg:overflow-visible',
      ]"
    >
      <!-- Tab 列表：左侧浅灰背景 -->
      <div
        :class="[
          'flex flex-col gap-1 p-2 bg-surface-secondary/60',
          layout === 'tabs-right' ? 'order-2' : 'order-1',
          'max-lg:rounded-card max-lg:border max-lg:border-border-subtle max-lg:bg-surface-primary',
        ]"
        role="tablist"
        :aria-label="title"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.key"
          :ref="(el) => (tabRefs[index] = el as HTMLElement | null)"
          role="tab"
          :aria-selected="activeTab === index"
          :aria-controls="`tab-panel-${tab.key}`"
          :tabindex="activeTab === index ? 0 : -1"
          :class="[
            'relative flex items-start gap-4 px-5 py-4 rounded-inner text-left transition-all duration-glide cursor-pointer',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
            'motion-reduce:transition-none motion-reduce:transform-none',
            activeTab === index
              ? 'bg-surface-primary shadow-subtle'
              : 'hover:bg-surface-primary/60',
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
            :class="[
              'shrink-0 mt-1 transition-colors duration-glide motion-reduce:transition-none',
              activeTab === index ? 'text-brand-primary' : 'text-text-primary',
            ]"
            aria-hidden="true"
          />

          <!-- 内容区 -->
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <span
              :class="[
                'text-h3 leading-subtitle transition-colors duration-glide max-lg:text-body',
                activeTab === index ? 'text-brand-primary font-semibold' : 'text-text-primary',
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
                <p class="text-small leading-small text-text-secondary line-clamp-3 min-h-[4.2rem]">
                  {{ tab.description }}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      <!-- 图片区域：渐变背景，固定最小高度撑开组件，避免 Tab 切换时高度跳动 -->
      <div
        :id="`tab-panel-${currentTab?.key}`"
        role="tabpanel"
        :aria-labelledby="`tab-${currentTab?.key}`"
        :class="[
          bgClass,
          'flex items-center justify-center min-h-105',
          layout === 'tabs-right' ? 'order-1' : 'order-2',
          'max-lg:min-h-0 max-lg:rounded-card max-lg:border max-lg:border-border-subtle',
        ]"
      >
        <Transition name="tab-image" mode="out-in">
          <div
            v-if="currentTab"
            :key="currentTab.key"
            class="aspect-[680/420] flex items-center justify-center p-8"
          >
            <img
              :src="currentTab.image"
              :alt="currentTab.imageAlt ?? currentTab.label"
              class="max-w-full max-h-full w-auto h-auto object-contain rounded-inner"
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
import { type Theme, THEME_BG_CLASS } from './theme'

/** Tab 展示项 */
export interface TabShowcaseItem {
  key: string
  label: string
  description: string
  image: string
  imageAlt?: string
  /** 左侧图标（IconPark 组件，选填） */
  badgeIcon?: Component
}

const props = withDefaults(
  defineProps<{
    title: string
    tabs: readonly TabShowcaseItem[]
    layout?: 'tabs-left' | 'tabs-right'
    /** 右侧图片区域渐变主题，默认 plain */
    theme?: Theme
  }>(),
  {
    layout: 'tabs-left',
    theme: 'plain',
  },
)

const bgClass = computed(() => THEME_BG_CLASS[props.theme])

const activeTab = ref(0)
const tabRefs = ref<(HTMLElement | null)[]>([])

const currentTab = computed(() => props.tabs[activeTab.value])

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
