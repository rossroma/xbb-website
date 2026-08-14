<template>
  <SectionBlock spacing="loose" width="full">
    <div
      class="w-full bg-surface-secondary px-12 py-8 max-[900px]:bg-transparent max-[900px]:px-0 max-[900px]:py-0"
    >
      <div class="mx-auto w-full max-w-300 max-[900px]:px-6">
        <div
          class="grid w-full grid-cols-1 items-center gap-8 min-[901px]:grid-cols-[minmax(0,1fr)_390px] min-[901px]:gap-x-[77px] min-[901px]:gap-y-0"
        >
          <div class="min-w-0 max-[900px]:text-center min-[901px]:row-start-1">
            <p
              class="mb-2 text-h3 mt-[15px] font-normal leading-subtitle text-text-secondary max-[900px]:mt-0"
            >
              {{ eyebrow }}
            </p>
            <h2
              class="whitespace-pre-wrap text-[28px] text-h2 font-semibold leading-subtitle text-text-primary max-[900px]:mt-2  max-[900px]:text-[28px] max-[900px]:text-h3"
            >
              {{ title }}
            </h2>
          </div>
          <img
            :src="image"
            :alt="imageAlt ?? ''"
            class="aspect-[390/217] w-full rounded-card object-cover max-[900px]:h-auto min-[901px]:row-start-1 min-[901px]:row-span-2 min-[901px]:h-[217px] min-[901px]:w-[390px] min-[901px]:shrink-0"
          />
          <Button
            variant="outline-neutral"
            size="lg"
            class="inline-flex items-center gap-3 justify-self-start min-[901px]:row-start-2 min-[901px]:mt-[38px] min-[901px]:mb-[15px] max-[900px]:w-full max-[900px]:justify-center"
            @click="$emit('ctaClick')"
          >
            <span>{{ ctaText }}</span>
            <span class="text-body leading-none">&gt;</span>
          </Button>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Button from '@/client/components/ui/Button.vue'
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
