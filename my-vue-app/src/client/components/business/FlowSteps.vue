<!--
  复用度：中（业务场景组件）
  可复用场景：产品使用流程、合作对接流程、服务交付流程、操作步骤引导等需要展示多步骤流程的场景
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题 + 介绍 -->
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-4 max-w-2xl text-body text-text-secondary leading-body">
        {{ description }}
      </p>
    </div>

    <!-- === 变体：简约模式 === -->
    <div
      v-if="variant === 'simple'"
      class="mt-14 flex items-start justify-center max-lg:flex-col max-lg:items-stretch max-lg:mt-10"
    >
      <template v-for="(step, index) in steps" :key="index">
        <!-- 步骤 -->
        <div
          class="flex flex-1 flex-col items-center text-center max-lg:flex-row max-lg:text-left max-lg:gap-4 max-lg:items-start"
          :class="index < steps.length - 1 ? 'flex-1' : 'flex-shrink-0'"
        >
          <!-- Badge 图标 -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            :class="getBadgeBg(index)"
          >
            <component :is="step.icon" :size="24" class="text-white" :stroke-width="3" />
          </div>
          <!-- 标题 -->
          <h3 class="mt-4 text-h3 text-text-primary leading-subtitle max-lg:mt-0 max-lg:text-body">
            {{ step.title }}
          </h3>
        </div>

        <!-- 箭头（最后一步不显示） -->
        <div
          v-if="index < steps.length - 1"
          class="flex shrink-0 items-center justify-center w-16 mt-2.5 max-lg:w-auto max-lg:mt-0 max-lg:py-2"
          aria-hidden="true"
        >
          <component
            :is="Right"
            :size="28"
            class="text-text-tertiary max-lg:hidden"
            :stroke-width="3"
          />
          <component
            :is="Down"
            :size="28"
            class="hidden text-text-tertiary max-lg:block"
            :stroke-width="3"
          />
        </div>
      </template>
    </div>

    <!-- === 变体：丰富模式 === -->
    <div
      v-if="variant === 'rich'"
      class="mt-14 flex items-start justify-center max-lg:flex-col max-lg:items-stretch max-lg:mt-10"
    >
      <template v-for="(step, index) in steps" :key="index">
        <!-- 步骤 -->
        <div
          class="flex flex-1 flex-col items-center text-center max-lg:flex-row max-lg:text-left max-lg:gap-4 max-lg:items-start"
          :class="index < steps.length - 1 ? 'flex-1' : 'flex-shrink-0'"
        >
          <!-- 序号圆标 -->
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-gradient text-white text-h3 font-bold leading-subtitle max-lg:text-body"
          >
            {{ index + 1 }}
          </div>

          <!-- 标题 -->
          <h3 class="mt-4 text-h3 text-text-primary leading-subtitle max-lg:mt-0 max-lg:text-body">
            {{ step.title }}
          </h3>

          <!-- 大号 Badge 图标或图片 -->
          <div
            class="mt-6 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-surface-secondary max-lg:hidden"
          >
            <component
              v-if="step.icon"
              :is="step.icon"
              :size="48"
              class="text-text-tertiary"
              :stroke-width="2"
            />
            <img
              v-else-if="step.image"
              :src="step.image"
              :alt="step.imageAlt ?? step.title"
              class="h-full w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>

          <!-- 描述 -->
          <p
            v-if="step.description"
            class="mt-4 max-w-60 text-small text-text-secondary leading-small max-lg:mt-0"
          >
            {{ step.description }}
          </p>
        </div>

        <!-- 箭头（最后一步不显示） -->
        <div
          v-if="index < steps.length - 1"
          class="flex shrink-0 items-center justify-center w-16 mt-1.5 max-lg:w-auto max-lg:mt-0 max-lg:py-2"
          aria-hidden="true"
        >
          <component
            :is="Right"
            :size="28"
            class="text-text-tertiary max-lg:hidden"
            :stroke-width="3"
          />
          <component
            :is="Down"
            :size="28"
            class="hidden text-text-tertiary max-lg:block"
            :stroke-width="3"
          />
        </div>
      </template>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Right, Down } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'

/** 单个流程步骤数据 */
interface FlowStep {
  /** 步骤标题 */
  title: string
  /** 步骤描述（丰富模式使用） */
  description?: string
  /** Badge 图标（remix组件），与 image 互斥 */
  icon?: Component
  /** 图片 URL（丰富模式使用），与 icon 互斥 */
  image?: string
  /** 图片 alt 文本 */
  imageAlt?: string
}

/** 流程展示风格 */
type FlowVariant = 'simple' | 'rich'

withDefaults(
  defineProps<{
    /** 区域标题 */
    title: string
    /** 区域介绍文字 */
    description?: string
    /** 流程步骤列表（3-5 个） */
    steps: readonly FlowStep[]
    /** 流程展示风格：simple（简约，默认）| rich（丰富） */
    variant?: FlowVariant
  }>(),
  {
    variant: 'simple',
  },
)

/** Badge 背景渐变类，按索引循环使用（复用 GradientCardGrid 的 bg-fs-icon-*） */
const badgeBgClasses = [
  'bg-fs-icon-blue',
  'bg-fs-icon-green',
  'bg-fs-icon-orange',
  'bg-fs-icon-purple',
  'bg-fs-icon-teal',
] as const

function getBadgeBg(index: number): string {
  return badgeBgClasses[index % badgeBgClasses.length]!
}
</script>
