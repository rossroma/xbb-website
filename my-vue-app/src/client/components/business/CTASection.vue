<template>
  <SectionBlock spacing="default">
    <div
      :class="!image ? bgClass : ''"
      class="rounded-large py-16 px-8 flex flex-col items-center text-center max-md:py-12 max-md:px-6"
    >
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p class="mt-4 text-body text-text-secondary leading-body max-w-140 max-md:mt-3">
        {{ subtitle }}
      </p>

      <!-- 可选图片（展示产品截图或背景图） -->
      <img
        v-if="image"
        :src="image"
        :alt="imageAlt ?? title"
        class="mt-10 max-w-230 w-full h-auto rounded-card shadow-subtle max-lg:mt-8"
      />

      <div
        class="flex gap-4 mt-8 flex-wrap justify-center max-md:flex-col max-md:items-center max-md:mt-6"
      >
        <Button variant="hero" size="lg" @click="$emit('primaryClick')">{{ primaryCta }}</Button>
        <Button
          v-if="secondaryCta"
          variant="hero-outline"
          size="lg"
          @click="$emit('secondaryClick')"
        >
          {{ secondaryCta }}
        </Button>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Button from '@/client/components/ui/Button.vue'

type BgVariant = 'light' | 'warm' | 'cool' | 'dawn' | 'mint'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    /** 主按钮文案 */
    primaryCta: string
    /** 次按钮文案（选填，不传则只显示主按钮） */
    secondaryCta?: string
    /** 背景色变体 */
    variant?: BgVariant
    /** 展示图片 URL（选填，展示产品截图或背景图） */
    image?: string
    /** 图片 alt 文本 */
    imageAlt?: string
  }>(),
  {
    variant: 'light',
  },
)

defineEmits<{
  primaryClick: []
  secondaryClick: []
}>()

// 轻量渐变背景：淡雅、有层次但不抢眼，文字始终使用深色保证可读性
// 渐变定义见 tailwind.css Section 3：bg-cta-warm-gradient / bg-cta-cool-gradient / bg-cta-dawn-gradient / bg-cta-mint-gradient
const variantClassMap: Record<BgVariant, string> = {
  light: 'bg-surface-secondary',
  warm: 'bg-cta-warm-gradient',
  cool: 'bg-cta-cool-gradient',
  dawn: 'bg-cta-dawn-gradient',
  mint: 'bg-cta-mint-gradient',
}

const bgClass = computed(() => variantClassMap[props.variant])
</script>
