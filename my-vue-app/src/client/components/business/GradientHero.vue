<!--
  复用度：高（通用组件）
  可复用场景：专题页功能介绍、产品特性展示、案例卡片、解决方案介绍等全宽通栏渐变背景 + 图文分栏场景
-->
<template>
  <section :class="bgClass" class="overflow-hidden">
    <div class="max-w-320 mx-auto px-5 md:px-12 lg:px-20 py-16 md:py-24 lg:py-32">
      <div
        :class="[
          'grid grid-cols-1 gap-8 lg:gap-16 items-center',
          reverse ? 'lg:grid-cols-[7fr_5fr]' : 'lg:grid-cols-[5fr_7fr]',
        ]"
      >
        <!-- 文字区域 -->
        <div :class="reverse ? 'order-2 max-lg:order-none' : 'order-1'">
          <!-- Badge 图标（选填） -->
          <div v-if="badgeIcon" class="mb-6">
            <span
              :class="badgeBgClass"
              class="inline-flex items-center justify-center w-11 h-11 rounded-full"
              aria-hidden="true"
            >
              <component :is="badgeIcon" :size="24" class="text-white" :stroke-width="3" />
            </span>
          </div>

          <!-- 标签（选填，来自 CaseCard） -->
          <span
            v-if="tag"
            class="inline-block px-4 py-1.5 rounded-pill text-small font-medium bg-brand-primary-soft text-brand-primary mb-5"
          >
            {{ tag }}
          </span>

          <!-- 标题（支持换行；titleGradient 为 true 时展示渐变色文字） -->
          <h2
            :class="[
              'text-display lg:text-[44px] lg:leading-1.15 font-extrabold whitespace-pre-line',
              titleGradient ? titleGradientClass : 'text-text-primary',
            ]"
          >
            {{ title }}
          </h2>

          <!-- 描述 -->
          <p class="mt-6 text-body text-text-secondary leading-body max-w-md">
            {{ description }}
          </p>

          <!-- CTA 按钮（选填，来自 CaseCard） -->
          <div v-if="buttonText" class="mt-8">
            <Button
              variant="outline-neutral"
              size="md"
              :href="linkHref"
              @click="!linkHref && $emit('buttonClick')"
            >
              <span class="inline-flex items-center gap-1.5">
                {{ buttonText }}
                <component :is="RightIcon" :stroke-width="3" class="w-4 h-4 shrink-0" />
              </span>
            </Button>
          </div>
        </div>

        <!-- 图片区域 -->
        <div
          :class="[
            'flex items-center justify-center',
            reverse ? 'order-1 max-lg:order-none' : 'order-2',
          ]"
        >
          <img
            :src="image"
            :alt="imageAlt ?? title"
            class="w-full h-auto max-w-160 max-h-105 object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Right } from '@/client/components/ui/remixIcons'
import Button from '@/client/components/ui/Button.vue'
import {
  type Theme,
  THEME_BG_CLASS,
  THEME_TITLE_GRADIENT_CLASS,
  THEME_ICON_BADGE_CLASS,
} from './theme'

const props = withDefaults(
  defineProps<{
    /** 标题，支持 \n 换行 */
    title: string
    /** 描述文字 */
    description: string
    /** 右侧图片 URL */
    image: string
    /** 图片 alt 文本，默认取 title */
    imageAlt?: string
    /** 标题上方 badge 图标（remix 组件），选填 */
    badgeIcon?: Component
    /** 渐变主题：purple（紫）| blue（蓝）| teal（青）| green（绿）| orange（橙） */
    theme?: Theme
    /** 是否交换图文左右位置 */
    reverse?: boolean
    /** 标题是否使用渐变色（默认 false，标题为黑色） */
    titleGradient?: boolean
    /** 标签文字（选填，来自 CaseCard），如"制造行业" */
    tag?: string
    /** 按钮文案（选填，来自 CaseCard），传入后显示 CTA 按钮 */
    buttonText?: string
    /** 按钮链接地址（选填，来自 CaseCard），为空时触发 buttonClick 事件 */
    linkHref?: string
  }>(),
  {
    theme: 'purple',
    reverse: false,
    titleGradient: false,
  },
)

defineEmits<{
  /** 按钮点击（linkHref 为空时触发），来自 CaseCard */
  buttonClick: []
}>()

const RightIcon = Right

const bgClass = computed(() => THEME_BG_CLASS[props.theme])
const titleGradientClass = computed(() => THEME_TITLE_GRADIENT_CLASS[props.theme])
const badgeBgClass = computed(() => THEME_ICON_BADGE_CLASS[props.theme])
</script>
