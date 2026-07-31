<template>
  <SectionBlock spacing="default"
    ><div class="flex justify-center mb-[70px] text-center">
      <h2 class="text-h1 font-semibold whitespace-normal text-center max-lg:text-h2 max-md:text-h3">
        {{ heading }}
      </h2>
    </div>
    <div class="max-w-284 mx-auto flex justify-center gap-4 max-lg:flex-col max-lg:items-center">
      <!-- Left: 2 tall cards -->
      <div class="flex gap-4 shrink-0 max-md:flex-col">
        <MediaCard
          v-for="card in tallCards"
          content-position="below-title"
          :key="card.key"
          :title="card.title"
          :icon="card.icon"
          :desc-lines="card.descLines"
          size="tall"
          :accent="card.accent"
          :image="card.image"
          :full-background="card.fullBackground"
          :bg="card.bg"
        />
      </div>

      <!-- Right: 4 standard cards -->
      <div class="shrink-0 flex flex-wrap gap-4 w-140 max-lg:w-auto max-md:flex-col max-md:w-full">
        <MediaCard
          v-for="card in standardCards"
          :key="card.key"
          :title="card.title"
          :icon="card.icon"
          :desc-lines="card.descLines"
          size="standard"
          :accent="card.accent"
        />
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import MediaCard from '@/client/components/ui/MediaCard.vue'

interface SplitCard {
  key: string
  title: string
  icon: Component
  descLines: string[]
  size: 'tall' | 'standard'
  image?: string
  fullBackground?: boolean
  bg?: string
  accent: string
}

const props = defineProps<{
  heading: string
  cards: SplitCard[]
}>()

const tallCards = computed(() => props.cards.filter((c) => c.size === 'tall'))
const standardCards = computed(() => props.cards.filter((c) => c.size === 'standard'))
</script>
