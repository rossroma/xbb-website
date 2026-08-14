<template>
  <SectionBlock spacing="default">
    <div
      :class="!image ? bgClass : ''"
      class="rounded-large flex flex-col items-center text-center max-md:py-12 max-md:px-6"
    >
      <SectionHeading :title="title" :subtitle="subtitle" align="center" />

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

      <img
        v-if="image"
        :src="image"
        :alt="imageAlt ?? title"
        :class="[
          'h-auto rounded-card max-lg:mt-8',
          imageFullBleed ? 'w-full max-w-none' : 'max-w-230 w-full',
          'mt-12',
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
    primaryCta?: string
    primaryHref?: string
    secondaryCta?: string
    secondaryHref?: string
    actionPlacement?: ActionPlacement
    variant?: BgVariant
    image?: string
    imageAlt?: string
    imageFullBleed?: boolean
  }>(),
  {
    variant: 'light',
    actionPlacement: 'default',
    imageFullBleed: false,
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

  if (isInternalLink(href)) {
    router.push(href)
    return
  }

  if (href) {
    window.location.href = href
    return
  }

  if (action === 'primary') {
    emit('primaryClick')
    return
  }

  emit('secondaryClick')
}

const variantClassMap: Record<BgVariant, string> = {
  light: 'bg-surface-secondary',
  warm: 'bg-cta-warm-gradient',
  cool: 'bg-cta-cool-gradient',
  dawn: 'bg-cta-dawn-gradient',
  mint: 'bg-cta-mint-gradient',
}

const bgClass = computed(() => variantClassMap[props.variant])
</script>
