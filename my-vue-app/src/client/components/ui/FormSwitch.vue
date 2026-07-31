<template>
  <label :class="switchClasses">
    <!-- 隐藏的原生 checkbox -->
    <input
      :id="id"
      :checked="modelValue"
      :name="name"
      :disabled="isDisabled"
      type="checkbox"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="ariaLabel"
      class="appearance-none absolute inset-0 m-0 cursor-pointer"
      :class="isDisabled ? 'cursor-not-allowed' : ''"
      @change="emit('update:modelValue', !modelValue)"
    />

    <!-- 轨道 -->
    <span class="relative inline-flex shrink-0 items-center rounded-pill transition-all duration-normal motion-reduce:transition-none" :class="trackClasses">
      <!-- 滑块 -->
      <span class="absolute rounded-full bg-white shadow-sm transition-transform duration-normal motion-reduce:transition-none" :class="thumbClasses" />
    </span>

    <!-- 标签文字 -->
    <span v-if="label || $slots.default" :class="labelClasses">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormInjectionKey } from './Form.vue'

interface FormSwitchProps {
  modelValue?: boolean
  disabled?: boolean
  size?: 'md' | 'sm'
  label?: string
  name?: string
  id?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<FormSwitchProps>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 从 Form 注入全局配置
const formContext = inject(FormInjectionKey, null)

const isDisabled = computed(() => {
  return props.disabled || (formContext?.disabled ?? false)
})

const resolvedSize = computed(() => {
  return formContext?.size || props.size
})

const switchClasses = computed(() => {
  const classes = [
    'relative inline-flex items-center gap-2',
    'motion-reduce:transition-none motion-reduce:transform-none',
  ]
  if (isDisabled.value) {
    classes.push('opacity-50 cursor-not-allowed')
  } else {
    classes.push('cursor-pointer')
  }
  return classes
})

const trackClasses = computed(() => {
  if (resolvedSize.value === 'sm') {
    return props.modelValue ? 'w-8 h-5 bg-brand-primary' : 'w-8 h-5 bg-border-default'
  }
  return props.modelValue ? 'w-10 h-6 bg-brand-primary' : 'w-10 h-6 bg-border-default'
})

const thumbClasses = computed(() => {
  if (resolvedSize.value === 'sm') {    return props.modelValue ? 'w-3.5 h-3.5 left-[2px] translate-x-3' : 'w-3.5 h-3.5 left-[2px] translate-x-0'
  }  return props.modelValue ? 'w-4 h-4 left-[3px] translate-x-4' : 'w-4 h-4 left-[3px] translate-x-0'
})

const labelClasses = computed(() => {
  const base = 'select-none cursor-pointer'
  if (resolvedSize.value === 'sm') return `${base} text-caption`
  return `${base} text-small`
})
</script>