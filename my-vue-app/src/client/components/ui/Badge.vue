<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BadgeProps {
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'info'
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'brand',
})

type BadgeVariant = 'brand' | 'accent' | 'success' | 'warning' | 'info'

const variantMap: Record<BadgeVariant, { bg: string; text: string }> = {
  brand: {
    bg: 'bg-brand-primary-soft',
    text: 'text-brand-primary',
  },
  accent: {
    bg: 'bg-brand-accent-soft',
    text: 'text-brand-accent',
  },
  success: {
    bg: 'bg-status-success-soft',
    text: 'text-status-success',
  },
  warning: {
    bg: 'bg-status-warning-soft',
    text: 'text-status-warning',
  },
  info: {
    bg: 'bg-status-info-soft',
    text: 'text-status-info',
  },
}

const badgeClasses = computed(() => {
  const v = variantMap[props.variant as BadgeVariant]
  return [
    'inline-flex items-center px-3 py-1 rounded-pill',
    'text-caption font-medium leading-subtitle',
    v.bg,
    v.text,
  ]
})
</script>