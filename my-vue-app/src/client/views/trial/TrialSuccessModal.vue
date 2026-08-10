<!--
  TrialSuccessModal — 免费试用提交成功确认弹窗

  提交成功后展示，包含成功图标、提示文案和"返回首页"按钮。
  使用 Teleport + Transition 模式，与 CaptchaModal 保持一致。
-->
<template>
  <Teleport to="body">
    <Transition name="success-modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
        @click.self="handleClose"
        @keydown.esc="handleClose"
      >
        <div
          class="bg-surface-primary rounded-lg shadow-elevation-lg border border-border-default px-8 py-10 w-100 max-w-[90vw] text-center"
        >
          <!-- 成功图标 -->
          <div
            class="w-16 h-16 mx-auto mb-5 rounded-full bg-status-success/10 flex items-center justify-center"
          >
            <CheckOne theme="filled" size="32" fill="var(--color-status-success)" />
          </div>

          <!-- 标题 -->
          <h2 class="text-h2 text-text-primary mb-2">提交成功</h2>
          <!-- 副标题 -->
          <p class="text-body text-text-secondary mb-8">我们会尽快与您联系</p>

          <!-- 返回首页按钮 -->
          <button
            type="button"
            class="inline-flex items-center justify-center h-11 px-10 rounded-lg bg-brand-primary text-white text-small font-semibold cursor-pointer hover:bg-brand-primary-hover transition-colors duration-fast"
            @click="handleGoHome"
          >
            返回首页
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CheckOne } from '@/client/components/ui/remixIcons'

interface Props {
  visible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const router = useRouter()

const handleClose = () => {
  emit('update:visible', false)
}

const handleGoHome = () => {
  emit('update:visible', false)
  router.push({ name: 'ClientHome' })
}
</script>

<style scoped>
.success-modal-enter-active,
.success-modal-leave-active {
  transition: opacity 0.2s ease;
}
.success-modal-enter-from,
.success-modal-leave-to {
  opacity: 0;
}
</style>
