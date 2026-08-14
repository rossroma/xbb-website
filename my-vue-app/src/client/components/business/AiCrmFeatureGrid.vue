<template>
  <SectionBlock spacing="default">
    <SectionHeading v-if="title" :title="title" align="center" />

    <div
      class="mt-12 mb-10 flex flex-wrap items-stretch justify-center gap-[30px] max-[1100px]:gap-6"
    >
      <div
        v-for="(card, index) in cards"
        :key="card.title"
        class="box-border flex h-[414px] w-[306px] flex-col bg-center bg-cover bg-no-repeat p-[30px] max-[1100px]:w-[min(306px,100%)] max-md:px-6 max-md:py-7"
        :style="cardStyle(card)"
      >
        <div class="mb-6 flex h-12 w-12 items-center justify-center text-xs text-[#999]">
          <img
            v-if="card.icon"
            :src="card.icon"
            :alt="card.iconAlt ?? card.title"
            class="block max-h-full max-w-full"
            loading="lazy"
          />
        </div>

        <div class="min-w-0 shrink-0 -translate-y-[30px] max-md:-translate-y-[18px]">
          <h3 class="mb-2 text-[22px] font-semibold leading-1.3 text-[#333] max-md:text-xl">
            {{ card.title }}
          </h3>
          <p
            v-if="card.description"
            class="text-[21px] font-medium leading-1.45 text-[#333] max-md:text-[15px]"
          >
            {{ card.description }}
          </p>
        </div>

        <div class="mt-auto flex items-start justify-between gap-3 px-0 pb-3 pt-1">
          <img
            v-if="card.sideImage"
            :class="[
              'block h-auto shrink-0 self-start mb-2',
              index === 1 ? 'w-7.5' : index === 2 ? 'w-[29px]' : 'w-[24px]',
            ]"
            :src="card.sideImage"
            :alt="card.sideImageAlt ?? ''"
            loading="lazy"
          />
          <ul class="m-0 min-w-0 flex-1 list-none p-0">
            <li
              v-for="point in card.points ?? []"
              :key="point"
              class="mb-2 flex items-start gap-2 text-[15px] leading-body text-[#555] last:mb-0 max-md:text-[13px]"
            >
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="ctaText && ctaHref" class="flex justify-center">
      <UiButton :href="ctaHref" variant="hero" color="brand" size="lg">
        {{ ctaText }}
      </UiButton>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import UiButton from '@/client/components/ui/Button.vue'

export interface AiCrmFeatureCard {
  image?: string
  icon?: string
  iconAlt?: string
  sideImage?: string
  sideImageAlt?: string
  title: string
  description?: string
  points?: string[]
}

defineProps<{
  title?: string
  cards: AiCrmFeatureCard[]
  ctaText?: string
  ctaHref?: string
}>()

function cardStyle(card: AiCrmFeatureCard): CSSProperties {
  if (!card.image) return {}

  return {
    backgroundImage: `url("${card.image}")`,
  }
}
</script>
