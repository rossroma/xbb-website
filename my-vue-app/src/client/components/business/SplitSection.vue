<!--
  复用度：高（通用组件）
  可复用场景：任何需要图文左右分栏展示的营销/产品介绍区块

  建议图片尺寸：16:10 或 4:3 比例，推荐宽度 600–800px。
  文字区域高度以图片区域高度为准，超出部分将被截断。
-->
<template>
  <SectionBlock spacing="default">
    <div class="grid grid-cols-2 gap-4 max-lg:grid-cols-1 max-lg:gap-6">
      <!-- 文本区域 -->
      <div
        :class="[
          'bg-surface-secondary rounded-card p-12 max-lg:p-8 overflow-hidden',
          reverse ? 'order-2 max-lg:order-none' : 'order-1',
        ]"
      >
        <!-- 标题 -->
        <SectionHeading
          :title="heading"
          align="left"
          heading-class="font-semibold leading-title whitespace-pre-line max-lg:text-h2 max-md:text-h3"
        />

        <!-- 列表项（优先于 description） -->
        <ul v-if="items && items.length > 0" class="mt-12 space-y-4 max-lg:mt-8">
          <li v-for="(item, index) in items" :key="index" class="flex items-start gap-3">
            <!-- gradient 主题：迷你渐变圆底 + 白色图标 -->
            <span
              v-if="iconTheme === 'gradient'"
              class="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand-primary-gradient flex items-center justify-center"
            >
              <component
                :is="item.icon ?? CheckSmall"
                class="w-3 h-3 text-white"
                :stroke-width="3"
              />
            </span>
            <!-- 其他主题：纯色图标 -->
            <component
              v-else
              :is="item.icon ?? CheckSmall"
              :class="['shrink-0 mt-0.5 w-5 h-5', iconColorClass]"
              :stroke-width="2.5"
            />

            <span class="text-body text-text-secondary leading-body">{{ item.text }}</span>
          </li>
        </ul>

        <!-- 段落描述（向后兼容回退） -->
        <p
          v-else-if="description"
          class="mt-12 text-body text-text-secondary leading-body whitespace-pre-line max-lg:mt-8"
        >
          {{ description }}
        </p>
      </div>

      <!-- 图片区域 -->
      <div
        :class="[
          'flex items-center justify-center bg-split-image-gradient rounded-card p-12 max-lg:p-8',
          reverse ? 'order-1 max-lg:order-none' : 'order-2',
        ]"
      >
        <img
          :src="getOSSImageUrl(image, 600)"
          :alt="imageAlt ?? heading"
          class="max-w-full h-auto rounded-card shadow-subtle"
        />
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { CheckSmall } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

/** 图标颜色主题 */
export type IconTheme = 'brand' | 'accent' | 'gradient' | 'neutral'

/** 列表项：文字 + 可选图标前缀 */
export interface SplitSectionItem {
  /** 图标前缀（Remix 组件），不传则使用默认 CheckSmall 图标 */
  icon?: Component
  /** 列表项文字 */
  text: string
}

const props = withDefaults(
  defineProps<{
    heading: string
    /** 描述文字（当 items 未提供时使用，向后兼容） */
    description?: string
    image: string
    imageAlt?: string
    reverse?: boolean
    /** 列表项数组，传入后替代 description 渲染 */
    items?: readonly SplitSectionItem[]
    /** 图标颜色主题：brand（品牌橙）| accent（蓝紫）| gradient（渐变圆底）| neutral（中性灰） */
    iconTheme?: IconTheme
  }>(),
  {
    iconTheme: 'brand',
  },
)

/** 图标颜色类名（gradient 主题通过专用圆底渲染，不走此类） */
const iconColorClass = computed(() => {
  const map: Record<IconTheme, string> = {
    brand: 'text-brand-primary',
    accent: 'text-brand-accent',
    gradient: '', // 由模板中的圆底容器处理
    neutral: 'text-text-tertiary',
  }
  return map[props.iconTheme]
})
</script>
