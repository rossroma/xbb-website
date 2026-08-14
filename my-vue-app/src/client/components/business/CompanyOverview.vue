<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
    </div>

    <div class="mt-12 grid grid-cols-[0.95fr_1.05fr] items-center gap-10 max-lg:grid-cols-1">
      <div class="flex flex-col gap-4">
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="`${index}-${paragraph}`"
          class="text-body text-text-secondary leading-body"
        >
          {{ paragraph }}
        </p>
      </div>

      <div class="overflow-hidden rounded-card border border-border-subtle bg-surface-primary shadow-subtle">
        <video
          class="block aspect-video w-full object-cover"
          :src="video"
          controls
          playsinline
          preload="metadata"
        />
      </div>
    </div>

    <div class="mt-10 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-card border border-[#dfe5ff] bg-[#f8faff] px-6 py-7 text-center"
      >
        <div class="text-display font-bold leading-none text-brand-accent max-lg:text-h1">
          {{ metric.value }}
        </div>
        <div class="mt-3 text-body leading-body text-text-secondary">
          {{ metric.label }}
        </div>
      </article>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'

export interface CompanyOverviewMetric {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    title: string
    paragraphs: readonly string[]
    video: string
    metrics: readonly CompanyOverviewMetric[]
  }>(),
  {},
)
</script>
