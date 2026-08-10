<template>
  <div :class="wrapperClasses">
    <!-- 前缀图标插槽 -->
    <span v-if="$slots.prefix" :class="prefixClasses" aria-hidden="true">
      <slot name="prefix" />
    </span>

    <!-- textarea 模式 -->
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="rows"
      :aria-invalid="invalid || undefined"
      :aria-label="ariaLabel"
      class="w-full bg-transparent border-none outline-none resize-none placeholder:text-text-tertiary"
      :class="inputSizeClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="$emit('focus', $event)"
    />

    <!-- input 模式 -->
    <input
      v-else
      :id="id"
      :type="inputType"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :aria-invalid="invalid || undefined"
      :aria-label="ariaLabel"
      class="w-full bg-transparent border-none outline-none placeholder:text-text-tertiary"
      :class="inputSizeClasses"
      @input="handleInput"
      @blur="handleBlur"
      @focus="$emit('focus', $event)"
    />

    <!-- 清空按钮 -->
    <button
      v-if="showClearButton"
      type="button"
      class="shrink-0 p-0.5 rounded-full text-text-tertiary hover:text-text-secondary transition-colors duration-fast"
      aria-label="清空输入"
      @click="handleClear"
      @mousedown.prevent
    >
      <CloseSmall class="w-3.5 h-3.5" aria-hidden="true" />
    </button>

    <!-- 后缀插槽（支持交互元素，如验证码按钮） -->
    <div v-if="$slots.suffix" :class="suffixClasses">
      <slot name="suffix" />
    </div>

    <!-- 字数统计（仅 textarea） -->
    <span
      v-if="type === 'textarea' && showWordLimit && maxlength"
      class="absolute right-3 bottom-2 text-caption text-text-tertiary tabular-nums pointer-events-none"
    >
      {{ String(modelValue).length }}/{{ maxlength }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { CloseSmall } from '@/client/components/ui/remixIcons'
import { FormInjectionKey } from './Form.vue'

interface FormInputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'number' | 'textarea'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'md' | 'sm'
  invalid?: boolean
  clearable?: boolean
  trim?: boolean
  maxlength?: number
  showWordLimit?: boolean
  rows?: number
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  autocomplete?: string
  name?: string
  id?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<FormInputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  size: 'md',
  invalid: false,
  clearable: false,
  trim: false,
  showWordLimit: false,
  rows: 4,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
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

// 将 textarea 以外的类型透传给原生 input
const inputType = computed(() => {
  if (props.type === 'textarea') return 'text'
  return props.type
})

const showClearButton = computed(() => {
  if (!props.clearable) return false
  if (isDisabled.value || props.readonly) return false
  return String(props.modelValue).length > 0
})

const inputSizeClasses = computed(() => {
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

  // 状态：聚焦、错误、禁用
  if (isDisabled.value) {
    classes.push('opacity-60 cursor-not-allowed bg-surface-secondary')
  } else if (props.invalid) {
    classes.push('border-status-error')
  } else {
    classes.push('border-border-default hover:border-border-subtle')
    classes.push(
      'focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10',
    )
  }

  // textarea 需要纵向布局
  if (props.type === 'textarea') {
    classes.push('items-start')
  }

  return classes
})

const prefixClasses = computed(() => {
  const base = 'shrink-0 text-text-tertiary'
  if (resolvedSize.value === 'sm') return `${base} ml-2.5`
  return `${base} ml-3`
})

const suffixClasses = computed(() => {
  const base = 'shrink-0 text-text-tertiary'
  if (resolvedSize.value === 'sm') return `${base} ml-2.5`
  return `${base} ml-3`
})

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  let val = target.value
  if (props.trim) {
    val = val.trim()
  }
  emit('update:modelValue', val)
}

function handleBlur(e: FocusEvent) {
  // trim on blur 确保离开输入框时也触发 trim
  if (props.trim) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const trimmed = target.value.trim()
    if (trimmed !== target.value) {
      emit('update:modelValue', trimmed)
    }
  }
  emit('blur', e)
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
