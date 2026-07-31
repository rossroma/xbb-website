<!--
  CaptchaModal — 算式验证码浮窗组件

  用于短信验证码发送前的人机验证。
  浮窗定位在触发按钮附近，包含 SVG 算式图片、输入框和确认按钮。

  使用方式：
  - 父组件通过 v-model:visible 控制显隐
  - 通过 triggerEl 传入触发按钮的 ref，自动定位浮窗
  - @confirm 事件在用户确认后触发，携带输入值
-->
<template>
  <Teleport to="body">
    <Transition name="captcha-modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-100"
        @click.self="handleClose"
        @keydown.esc="handleClose"
      >
        <!-- 浮窗内容 -->
        <div
          ref="modalRef"
          class="absolute bg-surface-primary rounded-lg shadow-elevation-lg border border-border-default p-4 w-64"
          :style="modalStyle"
        >
          <!-- 标题 -->
          <p class="text-small font-medium text-text-primary mb-3">请输入算式结果</p>

          <!-- 验证码图片 -->
          <div class="flex items-center gap-2 mb-3">
            <div
              class="flex-1 h-10 bg-surface-secondary rounded-md flex items-center justify-center cursor-pointer border border-border-default overflow-hidden"
              @click="handleRefresh"
              title="点击刷新验证码"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                v-if="captchaSvg"
                class="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full"
                v-html="captchaSvg"
              />
              <span v-else class="text-caption text-text-tertiary">加载中...</span>
            </div>
            <button
              type="button"
              class="shrink-0 text-caption text-brand-accent hover:text-brand-primary transition-colors duration-fast"
              @click="handleRefresh"
            >
              刷新
            </button>
          </div>

          <!-- 输入框 + 确认按钮 -->
          <div class="flex items-center gap-2">
            <input
              ref="inputRef"
              v-model="inputValue"
              type="text"
              maxlength="3"
              autocomplete="off"
              placeholder="请输入计算结果"
              class="flex-1 h-9 px-3 rounded-inner border border-border-default bg-surface-primary text-small outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all duration-fast"
              @keydown.enter="handleConfirm"
            />
            <button
              type="button"
              class="shrink-0 h-9 px-4 rounded-lg bg-brand-primary text-white text-small font-medium cursor-pointer hover:bg-brand-primary-hover transition-colors duration-fast disabled:opacity-50 disabled:cursor-default"
              :disabled="!inputValue || loading"
              @click="handleConfirm"
            >
              {{ loading ? '验证中...' : '确认' }}
            </button>
          </div>

          <!-- 错误提示 -->
          <p v-if="errorMsg" class="text-caption text-status-error mt-2">{{ errorMsg }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { getCaptcha } from '@/shared/api/sms'

interface Props {
  visible: boolean
  /** 触发按钮的元素引用（用于定位浮窗） */
  triggerEl?: HTMLElement | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', value: string): void
  (e: 'close'): void
}>()

// ==================== 状态 ====================

const modalRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const captchaSvg = ref('')
const captchaToken = ref('')
const errorMsg = ref('')
const loading = ref(false)

// ==================== 浮窗定位 ====================

const modalStyle = computed(() => {
  if (!props.triggerEl) return {}

  const triggerRect = props.triggerEl.getBoundingClientRect()
  const modalWidth = 256
  const modalHeight = 180 // 估计高度
  const gap = 8

  // 水平居中于按钮
  let left = triggerRect.left + triggerRect.width / 2 - modalWidth / 2
  // 不超出屏幕
  left = Math.max(8, Math.min(left, window.innerWidth - modalWidth - 8))

  // 判断显示在按钮上方还是下方
  const spaceBelow = window.innerHeight - triggerRect.bottom
  const spaceAbove = triggerRect.top

  if (spaceBelow > modalHeight + gap || spaceBelow >= spaceAbove) {
    // 显示在下方
    return { left: `${left}px`, top: `${triggerRect.bottom + gap}px` }
  }
  // 显示在上方
  return { left: `${left}px`, bottom: `${window.innerHeight - triggerRect.top + gap}px` }
})

// ==================== 方法 ====================

/** 加载/刷新验证码 */
async function loadCaptcha() {
  try {
    errorMsg.value = ''
    const res = await getCaptcha()
    captchaSvg.value = res.svg
    captchaToken.value = res.token
  } catch {
    errorMsg.value = '算式加载失败，请重试'
  }
}

/** 刷新验证码 */
function handleRefresh() {
  inputValue.value = ''
  errorMsg.value = ''
  loadCaptcha()
}

/** 确认 */
function handleConfirm() {
  if (!inputValue.value) return
  emit('confirm', inputValue.value)
}

/** 关闭浮窗 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

// ==================== 暴露给父组件 ====================

defineExpose({
  /** 获取当前 captcha JWT Token */
  getToken: () => captchaToken.value,
  /** 设置加载状态 */
  setLoading: (val: boolean) => {
    loading.value = val
  },
  /** 设置错误信息 */
  setError: (msg: string) => {
    errorMsg.value = msg
  },
  /** 重置状态 */
  reset: () => {
    inputValue.value = ''
    errorMsg.value = ''
    loading.value = false
  },
})

// ==================== 监听 ====================

// 浮窗打开时加载验证码并聚焦
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      inputValue.value = ''
      errorMsg.value = ''
      loading.value = false
      await loadCaptcha()
      await nextTick()
      inputRef.value?.focus()
    }
  },
)
</script>

<style scoped>
/* 浮窗过渡动画 */
.captcha-modal-enter-active,
.captcha-modal-leave-active {
  transition: opacity 0.15s ease;
}
.captcha-modal-enter-from,
.captcha-modal-leave-to {
  opacity: 0;
}
</style>
