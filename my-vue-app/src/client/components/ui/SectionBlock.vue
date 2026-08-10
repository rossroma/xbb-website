<template>
  <component :is="tag" :class="sectionClasses">
    <div :class="containerClasses">
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Spacing = 'default' | 'loose' | 'compact' | 'none'
type Width = 'default' | 'narrow' | 'wide' | 'full'

const props = withDefaults(
  defineProps<{
    spacing?: Spacing
    /** 单独控制底部间距，叠加在 spacing 之上，默认 none 不追加 */
    paddingBottom?: Spacing
    width?: Width
    tag?: string
  }>(),
  {
    spacing: 'default',
    paddingBottom: 'none',
    width: 'default',
    tag: 'section',
  },
)

const spacingMap: Record<Spacing, string> = {
  default:
    'pt-[64px] max-lg:pt-[40px] max-md:pt-[30px] pb-[64px] max-lg:pb-[40px] max-md:pb-[30px]',
  loose: 'pt-[64px] max-lg:pt-[50px] max-md:pt-[40px] pb-[64px] max-lg:pb-[50px] max-md:pb-[40px]',
  compact:
    'pt-[64px] max-lg:pt-[28px] max-md:pt-[20px] pb-[64px] max-lg:pb-[28px] max-md:pb-[20px]',
  none: '',
}

const widthMap: Record<Width, string> = {
  default: 'w-[min(1200px,calc(100%-48px))] mx-auto',
  narrow: 'w-[min(1200px,calc(100%-48px))] mx-auto',
  wide: 'w-[min(1200px,calc(100%-48px))] mx-auto max-w-[1136px]',
  full: '',
}

const paddingBottomMap: Record<Spacing, string> = {
  default: 'pb-[64px] max-lg:pb-[40px] max-md:pb-[30px]',
  loose: 'pb-[64px] max-lg:pb-[50px] max-md:pb-[40px]',
  compact: 'pb-[64px] max-lg:pb-[28px] max-md:pb-[20px]',
  none: '',
}

const sectionClasses = computed(() =>
  [spacingMap[props.spacing], paddingBottomMap[props.paddingBottom]].filter(Boolean).join(' '),
)

const containerClasses = computed(() => widthMap[props.width])
</script>
