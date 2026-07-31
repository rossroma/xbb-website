<template>
  <div>
    <span class="sr-only" role="status">加载中...</span>
    <div class="flex flex-col gap-2" aria-hidden="true">
      <div v-for="i in count" :key="i" :class="skeletonClasses" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SkeletonProps {
  type?: 'text' | 'card' | 'image'
  count?: number
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  type: 'text',
  count: 1,
})

const typeClasses: Record<string, string> = {
  text: 'h-4 w-full',
  card: 'h-32 w-full',
  image: 'h-40 w-full',
}

const skeletonClasses = computed(() => [
  'animate-skeleton',
  'motion-reduce:animate-none',
  'rounded-inner',
  typeClasses[props.type],
])
</script>
