<template>
  <SectionBlock spacing="loose" width="full"
    ><div
      class="flex w-full items-center gap-[77px] bg-surface-secondary rounded-card px-12 py-8 max-lg:flex-col max-lg:gap-8 max-md:px-6"
    >
    <div class="w-300 flex mx-auto">
      <div class="flex-1">
        <p class="text-body text-text-secondary leading-subtitle mb-2 font-normal mt-[15px]">
          {{ eyebrow }}
        </p>
        <h2
          class="text-h2 font-semibold text-text-primary leading-subtitle whitespace-pre-wrap max-md:text-h3"
        >
          {{ title }}
        </h2>
        <Button
          variant="outline-neutral"
          size="lg"
          class="mt-[38px] mb-[15px] inline-flex items-center gap-3"
          @click="$emit('ctaClick')"
        >
          <span>{{ ctaText }}</span
          ><span class="text-body leading-none">→</span>
        </Button>
      </div>
      <img
        :src="getOSSImageUrl(image, 390)"
        :alt="imageAlt ?? ''"
        class="w-[390px] h-[217px] max-md:w-full max-md:h-45 rounded-card object-cover shrink-0"
      />
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Button from '@/client/components/ui/Button.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

defineProps<{
  eyebrow: string
  title: string
  ctaText: string
  image: string
  /** 图片 alt 文本，默认空（装饰性图片） */
  imageAlt?: string
}>()

defineEmits<{
  ctaClick: []
}>()
</script>
