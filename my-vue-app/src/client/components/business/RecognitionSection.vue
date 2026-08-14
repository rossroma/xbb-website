<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <SectionHeading :title="title" :subtitle="subtitle" align="center" />

      <img
        :src="image"
        :alt="imageAlt ?? title"
        class="mt-12 h-auto w-full max-w-none rounded-card max-lg:mt-8"
      />

      <div
        v-if="hasMarqueeImages"
        class="mt-10 w-full overflow-hidden py-6 max-md:mt-7 max-md:py-[18px]"
      >
        <div class="group overflow-hidden" :aria-label="marqueeLabel">
          <div class="recognition-section__marquee-track">
            <div
              v-for="groupIndex in 2"
              :key="groupIndex"
              class="flex shrink-0 gap-8 pr-8"
              :aria-hidden="groupIndex === 2 ? 'true' : undefined"
            >
              <img
                v-for="item in marqueeImages"
                :key="`${groupIndex}-${item.src}`"
                :src="item.src"
                :alt="item.alt"
                class="block h-50 w-50 shrink-0 object-contain max-md:h-28 max-md:w-28"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

export interface RecognitionImage {
  src: string
  alt: string
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    image: string
    imageAlt?: string
    marqueeImages?: readonly RecognitionImage[]
    marqueeLabel?: string
  }>(),
  {
    subtitle: '',
    marqueeImages: () => [],
    marqueeLabel: '权威认可图片滚动',
  },
)

const hasMarqueeImages = computed(() => props.marqueeImages.length > 0)
</script>

<style scoped>
.recognition-section__marquee-track {
  display: flex;
  width: max-content;
  animation: recognition-section-marquee-scroll 32s linear infinite;
}

.group:hover .recognition-section__marquee-track {
  animation-play-state: paused;
}

@keyframes recognition-section-marquee-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .recognition-section__marquee-track {
    animation: none;
  }
}
</style>
