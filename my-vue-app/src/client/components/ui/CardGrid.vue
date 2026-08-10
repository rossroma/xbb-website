<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    cols?: 2 | 3 | 4 | 5 | 7
    gap?: 'default' | 'loose' | 'tight'
  }>(),
  {
    cols: 4,
    gap: 'default',
  },
)

const colsMap: Record<number, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  7: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7',
}

const gapMap: Record<string, string> = { default: 'gap-[2.5%]', loose: 'gap-16', tight: 'gap-5' }

const gridClasses = computed(() => ['grid', colsMap[props.cols], gapMap[props.gap]])
</script>
