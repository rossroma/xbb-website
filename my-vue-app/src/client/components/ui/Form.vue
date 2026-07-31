<template>
  <form :class="formClasses" @submit.prevent="handleFormSubmit">
    <slot />
  </form>
</template>

<script lang="ts">
import type { InjectionKey } from 'vue'

export interface FormContext {
  size: 'md' | 'sm'
  labelWidth: string
  labelPosition: 'top' | 'left'
  showRequiredMark: boolean
  disabled: boolean
}

export const FormInjectionKey: InjectionKey<FormContext> = Symbol('FormContext')
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { FormRule } from '@/client/composables/useForm'

interface FormProps {
  model?: Record<string, unknown>
  rules?: Record<string, FormRule[]>
  size?: 'md' | 'sm'
  labelWidth?: string
  labelPosition?: 'top' | 'left'
  inline?: boolean
  disabled?: boolean
  showRequiredMark?: boolean
}

const props = withDefaults(defineProps<FormProps>(), {
  size: 'md',
  labelPosition: 'top',
  inline: false,
  disabled: false,
  showRequiredMark: true,
})

const emit = defineEmits<{
  (e: 'submit'): void
}>()

// 向下传递全局配置
provide(FormInjectionKey, {
  size: props.size,
  labelWidth: props.labelWidth || '',
  labelPosition: props.labelPosition,
  showRequiredMark: props.showRequiredMark,
  disabled: props.disabled,
})

const formClasses = computed(() => {
  const classes = ['motion-reduce:transition-none motion-reduce:transform-none']
  if (props.inline) {
    classes.push('flex flex-wrap items-start gap-4')
  } else {
    classes.push('flex flex-col gap-4')
  }
  return classes
})

function handleFormSubmit() {
  emit('submit')
}

// 暴露验证方法：当需要手动校验时，调用方可通过 ref 访问
function validate(): boolean {
  // 如果传入了 model 和 rules，使用 useForm 的校验逻辑
  if (props.model && props.rules) {
    return runValidation()
  }
  return true
}

function runValidation(): boolean {
  let isValid = true
  const model = props.model!
  const rules = props.rules!

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = model[field]

    for (const rule of fieldRules) {
      if (rule.required) {
        if (value === undefined || value === null || value === '') {
          isValid = false
          break
        }
        if (Array.isArray(value) && value.length === 0) {
          isValid = false
          break
        }
      }

      if (value === undefined || value === null || value === '') continue

      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        isValid = false
        break
      }

      if (rule.min !== undefined) {
        if (typeof value === 'string' && value.length < rule.min) { isValid = false; break }
        if (typeof value === 'number' && value < rule.min) { isValid = false; break }
      }

      if (rule.max !== undefined) {
        if (typeof value === 'string' && value.length > rule.max) { isValid = false; break }
        if (typeof value === 'number' && value > rule.max) { isValid = false; break }
      }

      if (rule.validator) {
        const result = rule.validator(value)
        if (result === false || typeof result === 'string') { isValid = false; break }
      }
    }

    if (!isValid) break
  }

  return isValid
}

defineExpose({ validate })
</script>