<template>
  <div
    :class="cardClasses"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="clickable ? ariaLabel : undefined"
    @click="clickable && $emit('click')"
    @keydown.enter="clickable && $emit('click')"
    @keydown.space.prevent="clickable && $emit('click')"
  >
    <img
      v-if="variant === 'image' && imageSrc"
      :src="imageSrc"
      :alt="imageAlt ?? ''"
      class="w-full object-cover rounded-t-card"
    />
    <div :class="variant === 'image' ? 'p-4' : ''">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CardProps {
  clickable?: boolean
  variant?: 'default' | 'warm' | 'image'
  imageSrc?: string
  imageAlt?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<CardProps>(), {
  clickable: false,
  variant: 'default',
})

defineEmits<{
  click: []
}>()

const cardClasses = computed(() => {
  const classes = [
    'bg-surface-elevated border border-border-subtle rounded-card shadow-subtle',
    'transition-all duration-normal ease-in-out',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]

  if (props.variant === 'image') {
    classes.push('p-0 overflow-hidden')
  } else {
    classes.push('p-6')
  }

  if (props.variant === 'warm') {
    classes.push('bg-surface-tertiary')
  }

  if (props.clickable) {
    classes.push(
      'cursor-pointer hover:-translate-y-1 hover:shadow-default',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
    )
  }

  return classes
})
</script>
