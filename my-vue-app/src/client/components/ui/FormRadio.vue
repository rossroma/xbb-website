<template>
  <div :class="groupClasses" role="radiogroup" :aria-label="ariaLabel">
    <label
      v-for="opt in options"
      :key="opt.value"
      :class="optionClasses(opt)"
    >
      <span class="relative inline-flex shrink-0" :class="radioSizeClasses">
        <input
          type="radio"
          :name="name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          :disabled="isDisabled || opt.disabled"
          class="appearance-none absolute inset-0 m-0 cursor-pointer"
          :class="isDisabled || opt.disabled ? 'cursor-not-allowed' : ''"
          @change="emit('update:modelValue', opt.value)"
        />
        <span class="inline-flex items-center justify-center w-full h-full rounded-full border transition-all duration-fast motion-reduce:transition-none" :class="radioIndicatorClasses(opt)">
          <span v-if="modelValue === opt.value" class="rounded-full bg-brand-primary" :class="innerDotClasses" />
        </span>
      </span>
      <span :class="[labelClasses, (isDisabled || opt.disabled) ? 'opacity-50' : '']">
        {{ opt.label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormInjectionKey } from './Form.vue'

export interface RadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface FormRadioProps {
  modelValue?: string | number
  options: RadioOption[]
  disabled?: boolean
  size?: 'md' | 'sm'
  direction?: 'horizontal' | 'vertical'
  name?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<FormRadioProps>(), {
  modelValue: '',
  disabled: false,
  size: 'md',
  direction: 'vertical',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

// 从 Form 注入全局配置
const formContext = inject(FormInjectionKey, null)

const isDisabled = computed(() => {
  return props.disabled || (formContext?.disabled ?? false)
})

const resolvedSize = computed(() => {
  return formContext?.size || props.size
})

const groupClasses = computed(() => {
  const base = 'flex'
  if (props.direction === 'horizontal') {
    return `${base} flex-wrap gap-4`
  }
  return `${base} flex-col gap-2.5`
})

const radioSizeClasses = computed(() => {
  return resolvedSize.value === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
})

const innerDotClasses = computed(() => {
  return resolvedSize.value === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
})

const labelClasses = computed(() => {
  const base = 'select-none cursor-pointer'
  if (resolvedSize.value === 'sm') return `${base} text-caption`
  return `${base} text-small`
})

function optionClasses(opt: RadioOption) {
  const optDisabled = isDisabled.value || opt.disabled
  const classes = [
    'group inline-flex items-center gap-2',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]
  if (optDisabled) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer')
  }
  return classes
}

function radioIndicatorClasses(opt: RadioOption) {
  const classes = []
  const optDisabled = isDisabled.value || opt.disabled
  if (props.modelValue === opt.value) {
    classes.push('border-brand-primary')
  } else {
    classes.push('bg-surface-primary border-border-default')
    if (!optDisabled) {
      classes.push('group-hover:border-brand-primary')
    }
  }
  return classes
}
</script>