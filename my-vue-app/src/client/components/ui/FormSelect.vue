<template>
  <div :class="wrapperClasses">
    <select
      :id="id"
      :value="modelValue"
      :name="name"
      :disabled="isDisabled"
      :multiple="multiple"
      :aria-invalid="invalid || undefined"
      :aria-label="ariaLabel"
      class="w-full appearance-none bg-transparent border-none outline-none text-text-primary pr-8 cursor-pointer"
      :class="selectSizeClasses"
      @change="handleChange"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option v-if="placeholder" value="" disabled :class="placeholderClass">
        {{ placeholder }}
      </option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>

    <!-- 下拉箭头 -->
    <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary shrink-0" aria-hidden="true">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9" /></svg>
    </span>

    <!-- 清空按钮 -->
    <button
      v-if="showClearButton"
      type="button"
      class="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
      aria-label="清空选择"
      @click="handleClear"
      @mousedown.prevent
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormInjectionKey } from './Form.vue'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface FormSelectProps {
  modelValue?: string | number | (string | number)[]
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  size?: 'md' | 'sm'
  invalid?: boolean
  multiple?: boolean
  clearable?: boolean
  name?: string
  id?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<FormSelectProps>(), {
  modelValue: '',
  disabled: false,
  size: 'md',
  invalid: false,
  multiple: false,
  clearable: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'clear'): void
}>()

// 从 Form 注入全局配置
const formContext = inject(FormInjectionKey, null)

const isDisabled = computed(() => {
  return props.disabled || (formContext?.disabled ?? false)
})

const resolvedSize = computed(() => {
  return formContext?.size || props.size
})

const placeholderClass = computed(() => {
  return 'text-text-tertiary'
})

const showClearButton = computed(() => {
  if (!props.clearable) return false
  if (isDisabled.value) return false
  if (props.multiple) {
    return (props.modelValue as (string | number)[])?.length > 0
  }
  return props.modelValue !== '' && props.modelValue !== undefined
})

const selectSizeClasses = computed(() => {
  switch (resolvedSize.value) {
    case 'md':
      return 'text-small h-9 px-3.5 py-1.5'
    case 'sm':
      return 'text-small h-8 px-2.5 py-1'
    default:
      return 'text-small h-9 px-3.5 py-1.5'
  }
})

const wrapperClasses = computed(() => {
  const classes = [
    'relative inline-flex items-center w-full rounded-inner border bg-surface-primary',
    'transition-all duration-normal ease-in-out',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]

  if (isDisabled.value) {
    classes.push('opacity-60 cursor-not-allowed bg-surface-secondary')
  } else if (props.invalid) {
    classes.push('border-status-error')
  } else {
    classes.push('border-border-default hover:border-border-subtle')
    classes.push('focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10')
  }

  return classes
})

function handleChange(e: Event) {
  const target = e.target as HTMLSelectElement
  if (props.multiple) {
    const selected = Array.from(target.selectedOptions).map((o) => o.value)
    emit('update:modelValue', selected)
  } else {
    emit('update:modelValue', target.value)
  }
}

function handleClear() {
  if (props.multiple) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', '')
  }
  emit('clear')
}
</script>