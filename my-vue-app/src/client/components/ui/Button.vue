<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="isActuallyDisabled"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === RouterLink ? to : undefined"
    :target="tag === 'a' ? target : undefined"
    :rel="tag === 'a' ? computedRel : undefined"
    :aria-label="ariaLabel"
    :aria-busy="loading ? true : undefined"
  >
    <Loading v-if="loading" :class="spinnerClasses" aria-hidden="true" />
    <span v-if="loading" class="sr-only">加载中</span>
    <span
      :class="[
        'inline-flex items-center justify-center leading-none whitespace-nowrap',
        { 'opacity-0': loading },
      ]"
    >
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Loading } from '@/client/components/ui/remixIcons'

interface ButtonProps {
  variant?:
    | 'primary'
    | 'outline'
    | 'outline-neutral'
    | 'text'
    | 'hero'
    | 'hero-outline'
    | 'ghost-white'
    | 'outline-fill'
  color?: 'brand' | 'accent'
  size?: 'lg' | 'md' | 'sm' | 'xs'
  radius?: 'pill' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  href?: string
  to?: string
  target?: string
  rel?: string
  block?: boolean
  icon?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  color: 'brand',
  size: 'lg',
  radius: 'pill',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  icon: false,
})

const tag = computed(() => {
  if (props.href !== undefined) return 'a'
  if (props.to !== undefined) return RouterLink
  return 'button'
})

const isActuallyDisabled = computed(() => {
  if (tag.value === 'a' || tag.value === RouterLink) return false
  return props.disabled
})

const computedRel = computed(() => {
  if (props.rel) return props.rel
  if (props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

// ---- Color tokens by scheme ----
type ColorScheme = {
  solid: string
  hover: string
  soft: string
  text: string
  border: string
  gradient: string
  heroGradient: string
  heroOutlineText: string
  heroOutlineBorder: string
  heroOutlineHoverBorder: string
  focusOutline: string
  fillHoverBg: string
}

const colorSchemes: Record<'brand' | 'accent', ColorScheme> = {
  brand: {
    solid: 'bg-brand-primary',
    hover: 'hover:bg-brand-primary-hover',
    soft: 'bg-brand-primary-soft',
    text: 'text-brand-primary',
    border: 'border-brand-primary',
    gradient: 'bg-[#FF6A00]',
    heroGradient: 'bg-[#FF6A00]',
    heroOutlineText: 'text-brand-primary',
    heroOutlineBorder: 'border-brand-primary-ring',
    heroOutlineHoverBorder: 'hover:border-brand-primary-ring-hover',
    focusOutline: 'focus-visible:outline-brand-primary',
    fillHoverBg: 'hover:bg-brand-primary',
  },
  accent: {
    solid: 'bg-brand-accent',
    hover: 'hover:bg-brand-accent-hover',
    soft: 'bg-brand-accent-soft',
    text: 'text-brand-accent',
    border: 'border-brand-accent',
    gradient: 'bg-brand-accent-button-gradient',
    heroGradient: 'bg-brand-accent-hero-gradient',
    heroOutlineText: 'text-brand-accent',
    heroOutlineBorder: 'border-brand-accent-ring',
    heroOutlineHoverBorder: 'hover:border-brand-accent-ring-hover',
    focusOutline: 'focus-visible:outline-brand-accent',
    fillHoverBg: 'hover:bg-brand-accent',
  },
}

const sizeClasses: Record<'lg' | 'md' | 'sm' | 'xs', string> = {
  lg: 'h-[49px] px-9 py-3 text-body gap-3',
  md: 'h-9 px-3.5 text-small gap-1.5',
  sm: 'h-8 px-3 text-caption gap-1.5',
  xs: 'h-6 px-2 text-caption gap-1',
}

const radiusClasses: Record<'pill' | 'lg', string> = {
  pill: 'rounded-[99px]',
  lg: 'rounded-lg',
}

const iconSizeClasses: Record<'lg' | 'md' | 'sm' | 'xs', string> = {
  lg: 'w-12 h-12',
  md: 'w-9 h-9',
  sm: 'w-8 h-8',
  xs: 'w-6 h-6',
}

const buttonClasses = computed(() => {
  const cs = colorSchemes[props.color]
  const classes = [
    'static left-0 top-0 inline-flex flex-row items-center justify-center opacity-100 font-semibold',
    'transition-all duration-normal ease-in-out',
    cs.focusOutline,
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]

  // Icon-only mode: circular, square
  if (props.icon) {
    classes.push('rounded-full', 'p-0', iconSizeClasses[props.size])
    // Icon button still uses the variant for background/border color
    const v = props.variant
    if (v === 'primary' || v === 'hero') {
      classes.push(cs.gradient, 'text-white', 'border border-transparent')
    } else if (v === 'outline' || v === 'hero-outline') {
      classes.push('bg-white', cs.text, 'border border-[#FF6A00]')
    } else if (v === 'outline-neutral') {
      classes.push('bg-surface-primary', 'text-heading', 'border border-heading')
    } else {
      classes.push('bg-transparent', cs.text, 'border-none')
    }
    classes.push('hover:scale-[1.04]')
  } else {
    // Standard button
    if (props.block) {
      classes.push('w-full')
    } else if (props.size === 'lg') {
      
    }
    classes.push(radiusClasses[props.radius], sizeClasses[props.size])

    // Variant styles
    const v = props.variant
    if (v === 'primary') {
      classes.push(cs.gradient, 'text-white', 'border border-transparent')
      classes.push('hover:translate-y-[-1px]')
      classes.push('active:translate-y-0')
    } else if (v === 'outline') {
      classes.push('bg-white', cs.text, 'border border-[#FF6A00]')
      classes.push('hover:translate-y-[-1px]', 'hover:border-[#FF6A00]')
      classes.push('active:translate-y-0')
    } else if (v === 'outline-neutral') {
      classes.push('bg-surface-primary', 'text-heading', 'border border-heading')
      classes.push('hover:translate-y-[-1px]', 'hover:bg-surface-secondary')
      classes.push('active:translate-y-0')
    } else if (v === 'text') {
      classes.push('bg-transparent', cs.text, 'border-none', 'p-0')
      classes.push('hover:opacity-80')
    } else if (v === 'hero') {
      classes.push(cs.heroGradient, 'text-white', 'border border-transparent')
      classes.push('hover:translate-y-[-1px]')
      classes.push('active:translate-y-0')
    } else if (v === 'hero-outline') {
      classes.push('bg-white', cs.heroOutlineText, 'border', 'border-[#FF6A00]')
      classes.push('hover:translate-y-[-1px]', 'hover:bg-white', 'hover:border-[#FF6A00]')
      classes.push('active:translate-y-0')
    } else if (v === 'ghost-white') {
      classes.push('bg-white/74', 'text-heading', 'border border-heading/78')
      classes.push('text-body font-medium')
      classes.push('hover:translate-y-[-1px]', 'hover:bg-white/92')
      classes.push('active:translate-y-0')
    } else if (v === 'outline-fill') {
      classes.push('bg-transparent', cs.text, 'border', cs.border)
      classes.push('hover:translate-y-[-1px]', 'hover:text-white', cs.fillHoverBg)
      classes.push('active:translate-y-0')
    }
  }

  // Disabled / Loading
  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed pointer-events-none')
  } else if (props.loading) {
    classes.push('opacity-80 cursor-wait pointer-events-none')
  }

  if (tag.value === 'button') {
    classes.push('cursor-pointer')
  } else {
    classes.push('inline-flex no-underline')
  }

  return classes
})

const spinnerClasses = computed(() => {
  const base = 'animate-spin shrink-0'
  if (props.size === 'xs') return `${base} w-3.5 h-3.5`
  if (props.size === 'sm') return `${base} w-4 h-4`
  return `${base} w-5 h-5`
})
</script>
