<!--
  复用度：高（通用组件）
  可复用场景：产品介绍、能力说明、专题页图文展示、纯展示型业务模块
-->
<template>
  <SectionBlock spacing="default">
    <div :class="containerClass">
      <!-- 左侧文本 -->
      <div :class="textPanelClass">
        <span
          class="block w-12 h-1.5 rounded-full"
          :style="{ backgroundColor: accentColor }"
          aria-hidden="true"
        />
        <SectionHeading
          :title="title"
          :subtitle="subtitle"
          align="left"
          heading-class="mt-6 font-semibold whitespace-pre-line"
        />
        <div v-if="ctaText" class="mt-12">
          <Button variant="hero" size="lg" @click="$emit('ctaClick')">
            {{ ctaText }}
          </Button>
        </div>
      </div>

      <!-- 右侧图片 -->
      <div :class="imagePanelClass">
        <div class="w-full max-w-170 aspect-[680/420] flex items-center justify-center">
          <img
            :src="getOSSImageUrl(image, 680)"
            :alt="imageAlt ?? title"
            class="max-w-full max-h-full w-auto h-auto object-contain rounded-inner shadow-subtle"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import Button from '@/client/components/ui/Button.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'
import {
  type Theme,
  THEME_BG_CLASS,
  THEME_PRIMARY_COLOR,
} from './theme'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    image: string
    imageAlt?: string
    /** 文案下方按钮，未传时不显示 */
    ctaText?: string
    /** 图文布局：text-left（左文右图）| text-right（右文左图） */
    layout?: 'text-left' | 'text-right'
    theme?: Theme
  }>(),
  {
    layout: 'text-left',
    theme: 'orange',
  },
)

defineEmits<{
  ctaClick: []
}>()

const isTextRight = computed(() => props.layout === 'text-right')
const bgClass = computed(() => THEME_BG_CLASS[props.theme])
const accentColor = computed(() => THEME_PRIMARY_COLOR[props.theme])
const containerClass = computed(() => [
  'grid gap-0 rounded-card border border-border-subtle shadow-subtle overflow-hidden max-lg:grid-cols-1 max-lg:border-0 max-lg:shadow-none max-lg:overflow-visible',
  isTextRight.value
    ? 'grid-cols-[minmax(0,1fr)_minmax(0,420px)]'
    : 'grid-cols-[minmax(0,420px)_minmax(0,1fr)]',
])
const textPanelClass = computed(() => [
  'bg-surface-secondary/60 p-12 max-lg:p-8 max-md:p-6 flex flex-col justify-center',
  isTextRight.value ? 'order-2 max-lg:order-none' : 'order-1',
])
const imagePanelClass = computed(() => [
  bgClass.value,
  'flex items-center justify-center min-h-105 p-10 max-lg:min-h-0 max-lg:p-8',
  isTextRight.value ? 'order-1 max-lg:order-none' : 'order-2',
])
</script>
