<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <SectionHeading :title="title" :subtitle="subtitle" align="center" />

      <div v-if="paragraphs.length" class="mt-12 flex max-w-300 flex-col gap-4 text-center">
        <p
          v-for="paragraph in paragraphs"
          :key="paragraph"
          class="text-body text-text-secondary leading-body whitespace-pre-line"
        >
          {{ paragraph }}
        </p>
      </div>

      <div
        v-if="images.length"
        class="mt-10 flex w-full flex-wrap justify-center gap-4 max-lg:gap-3 max-md:gap-2"
      >
        <img
          v-for="image in images"
          :key="image.src"
          :src="image.src"
          :alt="image.alt"
          class="w-[calc((100%_-_96px)/7)] shrink-0 object-contain transition-transform duration-normal hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none max-lg:w-[calc((100%_-_36px)/4)] max-md:w-[calc((100%_-_8px)/2)]"
          loading="lazy"
        />
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

export interface ResearchStrengthImage {
  src: string
  alt: string
}

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    paragraphs: readonly string[]
    images: readonly ResearchStrengthImage[]
  }>(),
  {
    subtitle: '',
  },
)
</script>
