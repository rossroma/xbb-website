<template>
  <SectionBlock spacing="default">
    <div
      :class="!image ? bgClass : ''"
      class="rounded-large py-16 px-8 flex flex-col items-center text-center max-md:py-12 max-md:px-6"
    >
      <SectionHeading
        :title="title"
        :subtitle="subtitle"
        align="center"
      />

      <div
        v-if="actionPlacement === 'under-title' && hasActions"
        class="flex gap-4 mt-12 flex-wrap justify-center max-md:flex-col max-md:items-center"
      >
        <Button v-if="primaryCta" variant="hero" size="lg" @click="handleAction('primary')">
          {{ primaryCta }}
        </Button>
        <Button
          v-if="secondaryCta"
          variant="hero-outline"
          size="lg"
          @click="handleAction('secondary')"
        >
          {{ secondaryCta }}
        </Button>
      </div>

      <!-- 可选图片（展示产品截图或背景图） -->
      <img
        v-if="image"
        :src="image"
        :alt="imageAlt ?? title"
        :class="[
          'max-w-230 w-full h-auto rounded-card shadow-subtle max-lg:mt-8',
          actionPlacement === 'under-title' ? 'mt-12' : 'mt-12',
        ]"
      />

      <div
        v-if="actionPlacement === 'default' && hasActions"
        class="flex gap-4 mt-12 flex-wrap justify-center max-md:flex-col max-md:items-center max-md:mt-6"
      >
        <Button v-if="primaryCta" variant="hero" size="lg" @click="handleAction('primary')">
          {{ primaryCta }}
        </Button>
        <Button
          v-if="secondaryCta"
          variant="hero-outline"
          size="lg"
          @click="handleAction('secondary')"
        >
          {{ secondaryCta }}
        </Button>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import Button from '@/client/components/ui/Button.vue'
import { toPagePath } from '@/client/data/routePaths'

type BgVariant = 'light' | 'warm' | 'cool' | 'dawn' | 'mint'
type ActionType = 'primary' | 'secondary'
type ActionPlacement = 'default' | 'under-title'

const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'
const defaultHrefByCtaText: Record<string, string> = {
  免费试用: trialPagePath,
  立即免费试用: trialPagePath,
  立即咨询: trialPagePath,
  预约产品演示: liuziPagePath,
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    /** 主按钮文案 */
    primaryCta?: string
    primaryHref?: string
    primaryTarget?: '_self' | '_blank'
    /** 次按钮文案（选填，不传则只显示主按钮） */
    secondaryCta?: string
    secondaryHref?: string
    secondaryTarget?: '_self' | '_blank'
    actionPlacement?: ActionPlacement
    /** 背景色变体 */
    variant?: BgVariant
    /** 展示图片 URL（选填，展示产品截图或背景图） */
    image?: string
    /** 图片 alt 文本 */
    imageAlt?: string
  }>(),
  {
    variant: 'light',
    actionPlacement: 'default',
  },
)

const emit = defineEmits<{
  primaryClick: []
  secondaryClick: []
}>()

const router = useRouter()
const hasActions = computed(() => !!props.primaryCta || !!props.secondaryCta)

function isInternalLink(href?: string): href is string {
  return !!href && href.startsWith('/') && !href.startsWith('//')
}

function getDefaultHrefByText(text?: string) {
  return text ? defaultHrefByCtaText[text.trim()] : undefined
}

function getActionHref(action: ActionType) {
  const href = action === 'primary' ? props.primaryHref : props.secondaryHref
  const text = action === 'primary' ? props.primaryCta : props.secondaryCta

  return getDefaultHrefByText(text) ?? href
}

function handleAction(action: ActionType) {
  const href = getActionHref(action)
  const target = action === 'primary' ? props.primaryTarget : props.secondaryTarget

  if (isInternalLink(href)) {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(href)
    return
  }

  if (href) {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    window.location.href = href
    return
  }

  if (action === 'primary') {
    emit('primaryClick')
    return
  }

  emit('secondaryClick')
}

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
