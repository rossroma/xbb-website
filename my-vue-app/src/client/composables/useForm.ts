import { reactive, ref, watch, type Ref } from 'vue'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: unknown) => boolean | string
}

interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T
  rules?: Record<string, FormRule[]>
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

interface UseFormReturn<T extends Record<string, unknown>> {
  values: T
  errors: Record<string, string>
  validate: () => boolean
  validateField: (field: keyof T) => boolean
  clearValidate: (field?: keyof T) => void
  reset: (values?: T) => void
  isSubmitting: Ref<boolean>
  isDirty: Ref<boolean>
  handleSubmit: (submitFn: (values: T) => Promise<void>) => Promise<void>
}

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const {
    initialValues,
    rules = {},
    validateOnBlur: _validateOnBlur = true,
    validateOnChange = false,
  } = options

  const values = reactive({ ...initialValues }) as T
  const errors = reactive<Record<string, string>>({})
  const isSubmitting = ref(false)
  const isDirty = ref(false)

  // 监听值变化，标记 isDirty
  watch(
    () => ({ ...values }),
    () => {
      isDirty.value = true
    },
    { deep: true },
  )

  // 输入时校验
  if (validateOnChange) {
    watch(
      () => ({ ...values }),
      () => {
        const changedFields = Object.keys(rules)
        for (const field of changedFields) {
          if (errors[field]) {
            validateField(field as keyof T)
          }
        }
      },
      { deep: true },
    )
  }

  function validateField(field: keyof T): boolean {
    const fieldRules = rules[field as string]
    if (!fieldRules || fieldRules.length === 0) {
      delete errors[field as string]
      return true
    }

    const value = values[field as string]

    for (const rule of fieldRules) {
      // required
      if (rule.required) {
        if (value === undefined || value === null || value === '') {
          errors[field as string] = rule.message || `${String(field)} 是必填项`
          return false
        }
        // 数组类型检查
        if (Array.isArray(value) && value.length === 0) {
          errors[field as string] = rule.message || `${String(field)} 是必填项`
          return false
        }
      }

      // 如果值为空且非必填，跳过后续校验
      if (value === undefined || value === null || value === '') {
        continue
      }

      // pattern
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          errors[field as string] = rule.message || `${String(field)} 格式不正确`
          return false
        }
      }

      // min
      if (rule.min !== undefined) {
        if (typeof value === 'string' && value.length < rule.min) {
          errors[field as string] =
            rule.message || `${String(field)} 长度不能少于 ${rule.min} 个字符`
          return false
        }
        if (typeof value === 'number' && value < rule.min) {
          errors[field as string] = rule.message || `${String(field)} 不能小于 ${rule.min}`
          return false
        }
      }

      // max
      if (rule.max !== undefined) {
        if (typeof value === 'string' && value.length > rule.max) {
          errors[field as string] =
            rule.message || `${String(field)} 长度不能超过 ${rule.max} 个字符`
          return false
        }
        if (typeof value === 'number' && value > rule.max) {
          errors[field as string] = rule.message || `${String(field)} 不能大于 ${rule.max}`
          return false
        }
      }

      // validator
      if (rule.validator) {
        const result = rule.validator(value)
        if (result === false) {
          errors[field as string] = rule.message || `${String(field)} 校验未通过`
          return false
        }
        if (typeof result === 'string') {
          errors[field as string] = result
          return false
        }
      }
    }

    // 校验通过，清除该字段错误
    delete errors[field as string]
    return true
  }

  function validate(): boolean {
    let isValid = true
    const fieldsToValidate = Object.keys(rules)

    for (const field of fieldsToValidate) {
      const fieldValid = validateField(field as keyof T)
      if (!fieldValid) {
        isValid = false
      }
    }

    return isValid
  }

  function clearValidate(field?: keyof T) {
    if (field) {
      delete errors[field as string]
    } else {
      Object.keys(errors).forEach((key) => delete errors[key])
    }
  }

  function reset(resetValues?: T) {
    const target = resetValues || initialValues
    Object.assign(values, target)
    isDirty.value = false
    clearValidate()
  }

  async function handleSubmit(submitFn: (values: T) => Promise<void>) {
    if (isSubmitting.value) return

    const isValid = validate()
    if (!isValid) return

    isSubmitting.value = true
    try {
      await submitFn({ ...values } as T)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    values,
    errors,
    validate,
    validateField,
    clearValidate,
    reset,
    isSubmitting,
    isDirty,
    handleSubmit,
  }
}
