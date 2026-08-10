<template>
  <span :class="badgeClasses" :style="{ color: color }" aria-hidden="true">
    <slot :icon-size-class="iconSizeClass" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'gradient' | 'white' | 'accent' | 'neutral'

const props = withDefaults(
  defineProps<{
    size?: Size
    variant?: Variant
    color?: string
  }>(),
  {
    size: 'md',
    variant: 'gradient',
  },
)

const sizeMap: Record<Size, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-13 h-13',
}

/** 推荐图标尺寸：与徽章尺寸成正比 */
const iconSizeMap: Record<Size, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
}

/** 图标字号：Remix 图标使用 width="1em"，必须通过 font-size 控制实际渲染尺寸 */
const fontSizeMap: Record<Size, string> = {
  sm: 'text-caption',
  md: 'text-body',
  lg: 'text-h2',
}

const variantMap: Record<Variant, string> = {
  gradient: 'bg-brand-primary-gradient shadow-button-brand',
  white: 'bg-white/92 shadow-service-icon',
  accent: 'bg-brand-accent-button-gradient shadow-button-accent',
  neutral: 'bg-brand-neutral-muted shadow-subtle',
}

const badgeClasses = computed(() => [
  'inline-flex shrink-0 items-center justify-center rounded-full',
  'leading-[0]', // 消除 line-height 导致的图标垂直偏移
  fontSizeMap[props.size], // Remix 图标使用 1em，必须通过 font-size 控制实际尺寸
  sizeMap[props.size],
  variantMap[props.variant],
])

const iconSizeClass = computed(() => iconSizeMap[props.size])
</script>
