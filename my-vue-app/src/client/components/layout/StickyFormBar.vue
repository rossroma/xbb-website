<template>
  <div class="h-14 max-md:hidden" aria-label="底部固定表单栏">
    <div
      class="fixed inset-x-0 bottom-0 z-40 h-14 pt-2 bg-trial-bar-gradient border-t border-trial-bar-border shadow-trial-bar"
    >
      <div
        class="w-[min(1280px,calc(100%-48px))] mx-auto flex items-start max-[1199px]:w-[min(100%-32px,1280px)]"
      >
        <a
          href="#"
          class="shrink-0 mt-1 max-[1199px]:hidden"
          aria-label="返回首页"
          @click.prevent="scrollToTop"
          ><img src="/logo_blank.png" alt="销帮帮" class="h-8 block" /> </a
        ><span
          class="shrink-0 ml-5 text-body leading-9 text-trial-text max-[1199px]:ml-0 max-[1199px]:text-small"
          >{{ tagline }}</span
        >

        <div class="ml-auto relative">
          <Form inline class="relative flex items-start" @submit="handleFormSubmit">
            <!-- 反馈消息 -->
            <div
              v-if="feedback"
              :class="[
                'absolute inset-x-0 -top-6 min-h-5 text-center text-caption leading-5',
                feedbackType === 'success' ? 'text-status-success' : 'text-status-error',
              ]"
            >
              {{ feedback }}
            </div>

            <!-- 蜜罐字段（防机器人 — 对用户不可见） -->
            <div class="absolute opacity-0 pointer-events-none" aria-hidden="true" tabindex="-1">
              <FormInput
                v-model="honeypot"
                name="website"
                autocomplete="off"
                tabindex="-1"
                placeholder=""
              />
            </div>

            <div class="w-60 shrink-0 max-[1199px]:w-55">
              <FormInput
                v-model.trim="form.title"
                name="title"
                placeholder="请输入完整企业名称"
                aria-label="企业名称"
                size="md"
                :maxlength="200"
                class="trial-input"
              />
            </div>
            <div class="w-60 shrink-0 max-[1199px]:w-55">
              <FormInput
                v-model.trim="form.tel"
                name="tel"
                type="tel"
                inputmode="numeric"
                placeholder="请输入手机号码"
                aria-label="手机号码"
                size="md"
                :maxlength="11"
                class="trial-input"
                @update:model-value="
                  (val: string | number) => (form.tel = String(val).replace(/\D/g, ''))
                "
              />
            </div>
            <div class="w-60 shrink-0 max-[1199px]:w-55">
              <FormInput
                v-model="form.regcode"
                name="regcode"
                placeholder="请输入短信验证码"
                aria-label="短信验证码"
                size="md"
                :maxlength="6"
                class="trial-input trial-code-input"
              >
                <template #suffix
                  ><button
                    type="button"
                    class="h-9 px-3 border border-trial-bar-border rounded-r-lg bg-white/96 text-trial-code-btn text-small font-semibold text-center cursor-pointer whitespace-nowrap -mr-px disabled:opacity-50 disabled:cursor-default"
                    :disabled="countdown > 0"
                    ref="getCodeBtnRef"
                    @click="handleGetCode"
                  >
                    {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                  </button>
                </template>
              </FormInput>
            </div>
            <button
              type="submit"
              class="w-22 h-9 shrink-0 border-0 rounded-lg bg-trial-submit-gradient text-white text-small font-medium cursor-pointer shadow-trial-submit px-4 py-2 disabled:cursor-default disabled:opacity-70"
              :disabled="submitting"
            >
              {{ submitting ? '提交中' : submitText }}
            </button>
          </Form>
        </div>
      </div>
    </div>
    <!-- 算式验证码浮窗 -->
    <CaptchaModal
      ref="captchaModalRef"
      v-model:visible="captchaVisible"
      :trigger-el="getCodeBtnRef"
      @confirm="handleCaptchaConfirm"
      @close="handleCaptchaClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Form from '@/client/components/ui/Form.vue'
import FormInput from '@/client/components/ui/FormInput.vue'
import CaptchaModal from '@/client/components/business/CaptchaModal.vue'
import { useStickyFormSubmit } from '@/client/composables/useStickyFormSubmit'

withDefaults(
  defineProps<{
    /** 左侧标语文案 */
    tagline?: string
    /** 提交按钮文案 */
    submitText?: string
  }>(),
  {
    tagline: '0元领取试用资格',
    submitText: '立即领取',
  },
)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const {
  form,
  submitting,
  feedback,
  feedbackType,
  countdown,
  handleGetCode,
  confirmCaptchaAndSend,
  handleSubmit,
  onRequestCaptcha,
  onCaptchaSuccess,
  onCaptchaError,
} = useStickyFormSubmit()

// ==================== CaptchaModal ====================

const captchaVisible = ref(false)
const getCodeBtnRef = ref<HTMLElement | null>(null)
const captchaModalRef = ref<InstanceType<typeof CaptchaModal> | null>(null)

onRequestCaptcha(() => {
  captchaVisible.value = true
})

onCaptchaSuccess(() => {
  captchaVisible.value = false
  captchaModalRef.value?.reset()
})

onCaptchaError((msg) => {
  captchaModalRef.value?.setError(msg)
  captchaModalRef.value?.setLoading(false)
})

const handleCaptchaConfirm = (captchaText: string) => {
  captchaModalRef.value?.setLoading(true)
  const token = captchaModalRef.value?.getToken() || ''
  confirmCaptchaAndSend(captchaText, token)
}

const handleCaptchaClose = () => {
  captchaModalRef.value?.reset()
}

// ==================== 防攻击：蜜罐检测 ====================

/** 蜜罐字段（防机器人 — 正常用户不会填写） */
const honeypot = ref('')

/** 提交前的额外校验 — 蜜罐检测 */
const handleFormSubmit = async () => {
  // 蜜罐检测：若被填充则静默拒绝（安全机制，不提示用户）
  if (honeypot.value) {
    return
  }

  // 调用 composable 的 handleSubmit（内部含字段验证 + 频率限制 + API 调用）
  await handleSubmit()
}
</script>
