<template>
  <SectionBlock spacing="default">
    <div class="mb-12 flex justify-center text-center max-lg:mb-10 max-md:mb-8">
      <SectionHeading
        :title="heading"
        align="center"
        :heading-class="headingClass"
      />
    </div>

    <div
      class="split-card-layout__grid mx-auto grid w-full max-w-284 gap-4"
    >
      <MediaCard
        v-for="card in tallCards"
        :key="card.key"
        class="split-card-layout__card split-card-layout__card--tall"
        content-position="below-title"
        :title="card.title"
        :icon="card.icon"
        :desc-lines="card.descLines"
        size="tall"
        :accent="card.accent"
        :image="card.image"
        :full-background="card.fullBackground"
        :bg="card.bg"
      />
      <MediaCard
        v-for="(card, index) in standardCards"
        :key="card.key"
        :class="getStandardCardClass(index)"
        :title="card.title"
        :icon="card.icon"
        :desc-lines="card.descLines"
        size="standard"
        :accent="card.accent"
      />
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
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
  headingClass?: string
}>()

const tallCards = computed(() => props.cards.filter((c) => c.size === 'tall'))
const standardCards = computed(() => props.cards.filter((c) => c.size === 'standard'))

function getStandardCardClass(index: number): string {
  return index >= 2
    ? 'split-card-layout__card split-card-layout__card--wide-at-three'
    : 'split-card-layout__card'
}
</script>

<style scoped>
.split-card-layout__grid {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.split-card-layout__card {
  grid-column: span 2;
}

.split-card-layout__card--tall {
  grid-row: span 2;
}

@media (max-width: 1024px) {
  .split-card-layout__grid {
    max-width: 724px;
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .split-card-layout__card--wide-at-three {
    grid-column: span 3;
  }
}

@media (max-width: 640px) {
  .split-card-layout__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .split-card-layout__card--wide-at-three {
    grid-column: span 2;
  }
}
</style>
