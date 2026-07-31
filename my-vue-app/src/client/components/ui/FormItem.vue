<template>
  <div :class="itemClasses">
    <!-- 标签 -->
    <label
      v-if="label"
      :for="htmlFor"
      :class="labelClasses"
      :style="labelWidth ? { width: labelWidth } : undefined"
    >
      <span v-if="required && showRequiredMark" class="text-status-error mr-0.5" aria-hidden="true"
        >*</span
      >
      {{ label }}
    </label>

    <!-- 控件区域 -->
    <div :class="controlClasses">
      <slot />

      <!-- 错误提示 -->
      <p v-if="error" :class="errorClasses" role="alert">
        {{ error }}
      </p>

      <!-- 辅助说明 -->
      <p v-else-if="help" :class="helpClasses">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormInjectionKey } from './Form.vue'

interface FormItemProps {
  label?: string
  required?: boolean
  error?: string
  help?: string
  labelWidth?: string
  labelPosition?: 'top' | 'left'
  name?: string
  htmlFor?: string
}

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
  labelPosition: 'top',
})

// 从 Form 注入全局配置
const formContext = inject(FormInjectionKey, null)

const showRequiredMark = computed(() => {
  return formContext?.showRequiredMark !== false
})

const resolvedLabelPosition = computed(() => {
  return props.labelPosition || formContext?.labelPosition || 'top'
})

const itemClasses = computed(() => {
  if (resolvedLabelPosition.value === 'left') {
    return 'flex items-start gap-3'
  }
  return 'flex flex-col gap-1.5'
})

const labelClasses = computed(() => {
  const base = 'text-small font-medium text-text-primary select-none shrink-0'
  if (resolvedLabelPosition.value === 'left') {
    return `${base} pt-2 leading-10`
  }
  return `${base} leading-5`
})

const controlClasses = computed(() => {
  return 'flex-1 min-w-0'
})

const errorClasses = computed(() => {
  return 'text-caption text-status-error mt-1 leading-4'
})

const helpClasses = computed(() => {
  return 'text-caption text-text-tertiary mt-1 leading-4'
})
</script>
