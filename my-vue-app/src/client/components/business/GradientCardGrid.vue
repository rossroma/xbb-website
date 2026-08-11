<template>
  <SectionBlock spacing="loose">
    <!-- 标题栏 -->
    <div class="flex items-center gap-4 mb-12">
      <!-- 标题栏图标前缀 -->
      <span
        v-if="titleIcon"
        class="grid place-items-center w-11 h-11 rounded-full bg-fs-icon-purple shadow-ai-logo text-white text-body"
        aria-hidden="true"
      >
        <component :is="titleIcon" class="w-5 h-5" :stroke-width="3" />
      </span>
      <!-- 标题栏文字前缀（兜底） -->
      <span
        v-else-if="titlePrefix"
        class="grid place-items-center w-11 h-11 rounded-full bg-fs-icon-purple shadow-ai-logo text-white font-black shrink-0 text-body"
        aria-hidden="true"
        >{{ titlePrefix }}</span
      >
      <SectionHeading
        :title="title"
        align="left"
        @click="$emit('titleClick')"
      />
    </div>

    <!-- 卡片网格 -->
    <CardGrid :cols="4" gap="default" :class="'mt-14'">
      <article
        v-for="card in cards"
        :key="card.title"
        :class="[
          'group relative flex flex-col min-h-85 pt-7 px-5 pb-5 rounded-ai-card',
          'cursor-pointer transition-all duration-slow ease hover:-translate-y-2',
          'motion-reduce:transition-none motion-reduce:transform-none',
          gradientClass(card.gradient),
          shadowClass(card.gradient),
        ]"
        role="button"
        tabindex="0"
        :aria-label="`查看 ${card.title} 详情`"
        @click="$emit('cardClick', card.title)"
        @keydown.enter="$emit('cardClick', card.title)"
        @keydown.space.prevent="$emit('cardClick', card.title)"
      >
        <!-- hover 渐变遮罩 -->
        <div
          :class="[
            'absolute inset-0 rounded-ai-card opacity-0 transition-opacity duration-normal',
            'group-hover:opacity-100 motion-reduce:transition-none',
            overlayClass(card.gradient),
          ]"
          aria-hidden="true"
        />

        <!-- 标题栏：icon + title -->
        <div class="relative flex items-center gap-3 mb-4 z-10">
          <!-- 图标徽章 -->
          <span
            v-if="card.icon"
            :class="[
              'inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-full leading-0',
              iconBadgeClass(card.gradient),
            ]"
            aria-hidden="true"
          >
            <component :is="card.icon" class="w-4 h-4 text-white" :stroke-width="2.5" />
          </span>
          <h3 class="text-h3 font-extrabold text-text-primary leading-subtitle">
            {{ card.title }}
          </h3>
        </div>

        <!-- 内容信息 -->
        <p class="relative flex flex-col gap-1 text-small text-text-secondary leading-small z-10">
          <span v-for="line in card.description" :key="line">{{ line }}</span>
        </p>

        <!-- 前景图 / Slot（slot 优先，保证向后兼容） -->
        <div class="relative mt-auto pt-5 z-10">
          <template v-if="preferImage && card.image">
            <img
              :src="card.image"
              :alt="card.imageAlt ?? card.title"
              class="w-full h-auto rounded-xl"
              loading="lazy"
            />
          </template>
          <slot v-else name="visual" :card="card" :index="cards.indexOf(card)">
            <img
              v-if="card.image"
              :src="card.image"
              :alt="card.imageAlt ?? card.title"
              class="w-full h-auto rounded-xl"
              loading="lazy"
            />
          </slot>
        </div>

        <!-- hover 时显示的「查看更多」按钮 -->
        <div
          class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 opacity-0 translate-y-2 transition-all duration-normal group-hover:opacity-100 group-hover:translate-y-0 motion-reduce:transition-none"
        >
          <span
            class="inline-flex items-center gap-1.5 px-5 py-2 rounded-pill bg-white/90 text-small text-text-primary shadow-default backdrop-blur-sm"
          >
            查看更多
            <Right :size="14" aria-hidden="true" />
          </span>
        </div>
      </article>
    </CardGrid>
  </SectionBlock>
</template>

<script
  setup
  lang="ts"
  generic="
    T extends {
      title: string
      description: string[]
      icon?: object
      gradient?: 'purple' | 'blue' | 'teal' | 'green' | 'orange'
      image?: string
      imageAlt?: string
    }
  "
>
import type { Component } from 'vue'
import { Right } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'

/** 卡片渐变主题 */
type CardGradient = 'purple' | 'blue' | 'teal' | 'green' | 'orange'

defineProps<{
  title: string
  /** 标题栏前置图标（remix 组件） */
  titleIcon?: Component
  /** 标题栏前置文字（如 "AI"，与 titleIcon 互斥） */
  titlePrefix?: string
  cards: T[]
  preferImage?: boolean
}>()

defineEmits<{
  titleClick: []
  cardClick: [title: string]
}>()

/** 渐变主题 → 背景渐变工具类映射 */
const gradientClass = (theme?: CardGradient): string => {
  const map: Record<CardGradient, string> = {
    purple: 'bg-ai-primary-gradient',
    blue: 'bg-fs-blue-gradient',
    teal: 'bg-fs-teal-gradient',
    green: 'bg-fs-green-gradient',
    orange: 'bg-fs-orange-gradient',
  }
  return map[theme ?? 'purple']
}

/** 渐变主题 → hover 遮罩渐变工具类映射 */
const overlayClass = (theme?: CardGradient): string => {
  const map: Record<CardGradient, string> = {
    purple: 'bg-fs-overlay-purple',
    blue: 'bg-fs-overlay-blue',
    teal: 'bg-fs-overlay-teal',
    green: 'bg-fs-overlay-green',
    orange: 'bg-fs-overlay-orange',
  }
  return map[theme ?? 'purple']
}

/** 渐变主题 → 阴影工具类映射 */
const shadowClass = (theme?: CardGradient): string => {
  const map: Record<CardGradient, string> = {
    purple: 'shadow-fs-purple',
    blue: 'shadow-fs-blue',
    teal: 'shadow-fs-teal',
    green: 'shadow-fs-green',
    orange: 'shadow-fs-orange',
  }
  return map[theme ?? 'purple']
}

/** 渐变主题 → 图标徽章背景色映射（深色渐变，图标用白色） */
const iconBadgeClass = (theme?: CardGradient): string => {
  const map: Record<CardGradient, string> = {
    purple: 'bg-fs-icon-purple',
    blue: 'bg-fs-icon-blue',
    teal: 'bg-fs-icon-teal',
    green: 'bg-fs-icon-green',
    orange: 'bg-fs-icon-orange',
  }
  return map[theme ?? 'purple']
}
</script>
