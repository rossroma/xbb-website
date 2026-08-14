<template>
  <article
    :class="[
      'service-media-card relative overflow-hidden rounded-card',
      size === 'tall'
        ? 'aspect-[17/26] w-full'
        : 'aspect-[34/25] w-full',
      size === 'standard' ? 'bg-surface-secondary' : '',
      'flex flex-col',
    ]"
    :style="{
      backgroundImage: size === 'tall' && fullBackground && image ? `url(${image})` : undefined,
      backgroundColor: size === 'tall' && !fullBackground ? bg || undefined : undefined,
    }"
  >
    <div
      :class="[
        'relative z-10 flex items-center justify-between gap-[18px]',
        size === 'tall'
          ? 'p-[26px] pb-0 max-md:p-5 max-md:pb-0'
          : 'py-7 px-[26px] pb-0 max-md:px-5 max-md:py-5 max-md:pb-0',
      ]"
    >
      <h3 class="text-h2 font-semibold text-text-primary max-md:text-h3 max-[640px]:text-body">
        {{ title }}
      </h3>
      <IconBadge size="md" variant="white" :color="accent" v-slot="{ iconSizeClass }">
        <component :is="icon" :class="iconSizeClass" :stroke-width="2.2" />
      </IconBadge>
    </div>

    <div
      :class="[
        'relative z-10 flex flex-col gap-0.5',
        size === 'tall'
          ? 'px-[26px] pb-[26px] max-md:px-5 max-md:pb-5'
          : 'px-[26px] pb-7 max-md:px-5 max-md:pb-5',
        contentPosition === 'bottom-left' ? 'mt-auto' : '',
      ]"
    >
      <p v-for="line in descLines" :key="line" class="text-small text-service-desc max-[640px]:text-caption">
        {{ line }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import IconBadge from '@/client/components/ui/IconBadge.vue'

withDefaults(
  defineProps<{
    title: string
    icon: Component
    descLines: string[]
    size: 'tall' | 'standard'
    accent: string
    image?: string
    fullBackground?: boolean
    bg?: string
    contentPosition?: 'bottom-left' | 'below-title'
  }>(),
  {
    contentPosition: 'bottom-left' as const,
  },
)
</script>

<style scoped>
.service-media-card {
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
}

</style>
