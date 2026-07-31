<template>
  <label :class="checkboxClasses">
    <span class="relative inline-flex shrink-0" :class="boxSizeClasses">
      <input
        :id="id"
        :checked="isChecked"
        :name="name"
        :disabled="isDisabled"
        :value="value"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-label="ariaLabel"
        type="checkbox"
        class="appearance-none absolute inset-0 m-0 cursor-pointer"
        :class="isDisabled ? 'cursor-not-allowed' : ''"
        @change="handleToggle"
      />
      <span
        class="inline-flex items-center justify-center w-full h-full rounded border transition-all duration-fast motion-reduce:transition-none"
        :class="indicatorClasses"
      >
        <!-- 选中：对勾 -->
        <svg
          v-if="isChecked && !indeterminate"
          class="w-3 h-3 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <!-- 半选：横线 -->
        <svg
          v-if="indeterminate"
          class="w-2.5 h-0.5 text-white"
          viewBox="0 0 10 2"
          fill="currentColor"
        >
          <rect width="10" height="2" rx="1" />
        </svg>
      </span>
    </span>
    <span v-if="label || $slots.default" :class="labelClasses">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormInjectionKey } from './Form.vue'

interface FormCheckboxProps {
  modelValue?: boolean | (string | number)[]
  value?: string | number
  label?: string
  disabled?: boolean
  size?: 'md' | 'sm'
  indeterminate?: boolean
  name?: string
  id?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<FormCheckboxProps>(), {
  modelValue: false,
  value: undefined,
  label: undefined,
  disabled: false,
  size: 'md',
  indeterminate: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | (string | number)[]): void
}>()

// 从 Form 注入全局配置
const formContext = inject(FormInjectionKey, null)

const isDisabled = computed(() => {
  return props.disabled || (formContext?.disabled ?? false)
})

const resolvedSize = computed(() => {
  return formContext?.size || props.size
})

const isMulti = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() => {
  if (isMulti.value) {
    return (props.modelValue as (string | number)[]).includes(props.value!)
  }
  return Boolean(props.modelValue)
})

const boxSizeClasses = computed(() => {
  return resolvedSize.value === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
})

const indicatorClasses = computed(() => {
  const classes = []
  if (isDisabled.value) {
    classes.push('opacity-50')
  }
  if (isChecked.value || props.indeterminate) {
    classes.push('bg-brand-primary border-brand-primary')
  } else {
    classes.push('bg-surface-primary border-border-default')
    if (!isDisabled.value) {
      classes.push('group-hover:border-brand-primary')
    }
  }
  return classes
})

const labelClasses = computed(() => {
  const base = 'select-none cursor-pointer'
  if (resolvedSize.value === 'sm') return `${base} text-caption`
  return `${base} text-small`
})

const checkboxClasses = computed(() => {
  const classes = [
    'group inline-flex items-center gap-2',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]
  if (isDisabled.value) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer')
  }
  return classes
})

function handleToggle() {
  if (isMulti.value) {
    const arr = [...(props.modelValue as (string | number)[])]
    const idx = arr.indexOf(props.value!)
    if (idx >= 0) {
      arr.splice(idx, 1)
    } else {
      arr.push(props.value!)
    }
    emit('update:modelValue', arr)
  } else {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
