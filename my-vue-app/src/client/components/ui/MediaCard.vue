<template>
  <article
    :class="[
      'relative rounded-card overflow-hidden',
      size === 'tall' ? 'w-68 h-104' : 'w-68 h-50 max-md:w-full',
      size === 'standard' ? 'bg-surface-secondary' : '',
      'flex flex-col',
    ]"
    :style="{
      backgroundImage: size === 'tall' && fullBackground && image ? `url(${image})` : undefined,
      backgroundColor: size === 'tall' && !fullBackground ? bg || undefined : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div
      :class="[
        'relative z-10 flex items-center justify-between gap-[18px]',
        size === 'tall' ? 'p-[26px] pb-0' : 'py-7 px-[26px] pb-0',
      ]"
    >
      <h3 class="text-h2 font-semibold text-text-primary">{{ title }}</h3>
      <IconBadge size="lg" variant="white" :color="accent" v-slot="{ iconSizeClass }">
        <component :is="icon" :class="iconSizeClass" :stroke-width="2.2" />
      </IconBadge>
    </div>

    <div
      :class="[
        'relative z-10 flex flex-col gap-0.5',
        size === 'tall' ? 'px-[26px] pb-[26px]' : 'px-[26px] pb-7',
        contentPosition === 'bottom-left' ? 'mt-auto' : '',
      ]"
    >
      <p v-for="line in descLines" :key="line" class="text-body text-service-desc">{{ line }}</p>
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
