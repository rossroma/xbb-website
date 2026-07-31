<!--
  复用度：中（业务场景组件）
  可复用场景：产品首页核心功能展示、功能页亮点拆解、解决方案页能力介绍
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题区 -->
    <div class="text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-4 max-w-180 mx-auto text-body text-text-secondary leading-body">
        {{ subtitle }}
      </p>
    </div>

    <!-- 功能卡片网格 -->
    <CardGrid :cols="columns" gap="tight" class="mt-12 max-lg:mt-8">
      <article
        v-for="(card, index) in cards"
        :key="card.title"
        :class="[
          'flex flex-col rounded-card bg-surface-secondary px-6 py-8',
          props.variant === 'title-pill' ? 'gap-8' : 'gap-4',
        ]"
      >
        <!-- 卡片标题 -->
        <h3
          :class="[
            'flex items-center gap-3 text-h3 text-text-primary leading-subtitle',
            props.variant === 'title-pill'
              ? 'w-fit max-w-full rounded-pill border px-4 py-2.5'
              : '',
          ]"
          :style="props.variant === 'title-pill' ? titlePillStyle(card, index) : undefined"
        >
          <span
            v-if="card.badgeIcon"
            :class="[
              'inline-flex shrink-0 items-center justify-center',
              props.variant === 'title-pill' ? 'w-5 h-5' : 'w-8 h-8 rounded-full bg-fs-icon-purple',
            ]"
            aria-hidden="true"
          >
            <component
              :is="card.badgeIcon"
              :size="props.variant === 'title-pill' ? 20 : 16"
              :stroke-width="2.5"
              :fill="props.variant === 'title-pill' ? titleIconColor(card, index) : '#ffffff'"
              :class="props.variant === 'title-pill' ? '' : 'text-white'"
              :style="props.variant === 'title-pill' ? titleIconStyle(card, index) : undefined"
            />
          </span>
          <span :class="props.variant === 'title-pill' ? 'min-w-0 break-words' : ''">
            {{ card.title }}
          </span>
        </h3>

        <!-- 单段描述文本（无 icon） -->
        <p v-if="card.description" class="text-body text-text-secondary leading-body">
          {{ card.description }}
        </p>

        <!-- 功能列表 -->
        <ul v-else-if="card.features" class="flex flex-col gap-3">
          <li v-for="feature in card.features" :key="feature" class="flex items-start gap-2.5">
            <CheckSmall
              :size="18"
              :class="[
                'shrink-0 mt-0.5',
                props.variant === 'title-pill' ? 'text-text-primary' : 'text-brand-primary',
              ]"
              :stroke-width="3"
            />
            <span class="text-body text-text-secondary leading-body">{{ feature }}</span>
          </li>
        </ul>
      </article>
    </CardGrid>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { CheckSmall } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import { type Theme, THEME_PRIMARY_COLOR } from './theme'

export type FeatureListVariant = 'default' | 'title-pill'

export interface FeatureListItem {
  /** 卡片标题 */
  title: string
  /** 功能列表（与 description 二选一，feature 优先展示带 ✓ 图标列表） */
  features?: string[]
  /** 单段描述文本（与 features 二选一，正文渲染为纯文本，不影响标题 badgeIcon） */
  description?: string
  /** 标题前 Badge 图标（IconPark 组件，选填） */
  badgeIcon?: Component
  /** 标题胶囊主题色，仅 variant="title-pill" 时生效 */
  theme?: Theme
}

const props = withDefaults(
  defineProps<{
    /** 主标题 */
    title: string
    /** 副标题/描述（选填） */
    subtitle?: string
    /** 功能卡片列表 */
    cards: FeatureListItem[]
    /** 卡片列数 */
    columns?: 2 | 3 | 4
    /** 卡片标题样式 */
    variant?: FeatureListVariant
  }>(),
  {
    columns: 4,
    variant: 'default',
  },
)

const titlePillThemeCycle: Theme[] = ['blue', 'indigo', 'purple', 'sky']

function cardTheme(card: FeatureListItem, index: number): Theme {
  return card.theme ?? titlePillThemeCycle[index % titlePillThemeCycle.length] ?? 'blue'
}

function alpha(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

function titlePillStyle(card: FeatureListItem, index: number) {
  const color = THEME_PRIMARY_COLOR[cardTheme(card, index)]

  return {
    backgroundColor: alpha(color, 0.16),
    borderColor: alpha(color, 0.24),
  }
}

function titleIconColor(card: FeatureListItem, index: number): string {
  return THEME_PRIMARY_COLOR[cardTheme(card, index)]
}

function titleIconStyle(card: FeatureListItem, index: number) {
  return {
    color: titleIconColor(card, index),
  }
}
</script>
