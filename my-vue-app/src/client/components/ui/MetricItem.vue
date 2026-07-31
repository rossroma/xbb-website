<template>
  <article
    :class="[
      'flex flex-col items-center justify-center rounded-card px-6 py-10',
      'transition-all duration-normal motion-reduce:transition-none',
      highlighted ? 'bg-dashboard-card-highlighted shadow-subtle' : 'bg-dashboard-card',
    ]"
  >
    <h3 class="text-body font-semibold text-text-secondary leading-1.45 mr-6">{{ label }}</h3>
    <strong class="inline-flex items-end gap-1">
      <span
        class="text-metrics-value tracking-normal bg-metrics-gradient bg-clip-text text-transparent max-lg:text-[48px] max-md:text-[36px]"
        >{{ value }}</span
      >
      <span
        v-if="unit"
        class="text-metrics-unit bg-metrics-gradient bg-clip-text text-transparent max-lg:text-[32px] max-md:text-[28px]"
        >{{ unit }}</span
      >
    </strong>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string
    unit?: string
    label: string
    /** 是否高亮背景（蓝色渐变），默认 false */
    highlighted?: boolean
  }>(),
  {
    highlighted: false,
  },
)
</script>
