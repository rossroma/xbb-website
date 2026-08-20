<!--
  免费试用页面 — 左右分栏布局
  左侧：视觉区域，右侧：试用表单
  表单逻辑与 StickyFormBar 一致，复用 useStickyFormSubmit composable
  包含前端防攻击措施：蜜罐字段、频率限制、提交冷却
-->
<template>
  <div>
    <div
      class="relative min-h-175 bg-linear-to-b from-[#FBFCFF] to-[#EAEFFF] px-8 py-24 lg:min-h-190 lg:px-0 lg:py-0"
    >
      <div
        class="mx-auto grid min-h-175 w-full max-w-300 grid-cols-1 items-center justify-items-center gap-10 lg:min-h-190 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-10"
      >
        <div class="hidden h-145 w-full items-center justify-center lg:flex" aria-hidden="true">
          <img
            src="/images/liuzi/customer_wall.png"
            alt=""
            class="h-full w-full object-contain object-center"
            loading="eager"
          />
        </div>

        <div
          class="w-full max-w-115 rounded-[20px] bg-white/96 px-10 py-10 shadow-[0_20px_50px_rgba(33,52,96,0.16)] ring-1 ring-white/70 backdrop-blur-sm lg:h-110 lg:w-115 max-sm:px-6 max-sm:py-8"
        >
          <!-- 标题 -->
          <h1 class="text-h1 text-text-primary">{{ pageContent.title }}</h1>
          <!-- 副标题 -->
          <p class="text-body text-text-secondary mt-4">{{ pageContent.subtitle }}</p>

          <!-- 表单 -->
          <Form class="relative mt-10" @submit="handleFormSubmit">
            <!-- 反馈消息 -->
            <div
              v-if="feedback"
              :class="[
                'mb-4 text-small leading-5',
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

            <!-- 企业名称 -->
            <FormInput
              v-model.trim="form.title"
              name="title"
              placeholder="请输入完整企业名称"
              aria-label="企业名称"
              size="md"
              :maxlength="200"
            />

            <!-- 手机号码 -->
            <FormInput
              v-model.trim="form.tel"
              name="tel"
              type="tel"
              inputmode="numeric"
              placeholder="请输入手机号码"
              aria-label="手机号码"
              size="md"
              :maxlength="11"
              @update:model-value="(val: string | number) => (form.tel = String(val).replace(/\D/g, ''))"
            />

            <!-- 短信验证码 -->
            <FormInput
              v-model="form.regcode"
              name="regcode"
              placeholder="请输入短信验证码"
              aria-label="短信验证码"
              size="md"
              :maxlength="6"
            >
              <template #suffix>
                <button
                  type="button"
                  class="h-9 px-3 border border-trial-bar-border rounded-r-lg bg-white/96 text-trial-code-btn text-small font-semibold text-center cursor-pointer whitespace-nowrap hover:bg-brand-accent-soft transition-colors duration-fast disabled:opacity-50 disabled:cursor-default"
                  :disabled="countdown > 0"
                  ref="getCodeBtnRef"
                  @click="handleGetCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </button>
              </template>
            </FormInput>

            <!-- 协议勾选 -->
            <FormCheckbox v-model="agreedToTerms" name="agreement">
              <span class="text-small text-text-secondary">
                {{ pageContent.agreementPrefix
                }}<a
                  :href="pageContent.serviceAgreementUrl"
                  target="_blank"
                  class="text-brand-accent hover:underline"
                  >{{ pageContent.serviceAgreementText }}</a
                >和<a
                  :href="pageContent.privacyPolicyUrl"
                  target="_blank"
                  class="text-brand-accent hover:underline"
                  >{{ pageContent.privacyPolicyText }}</a
                >
              </span>
            </FormCheckbox>

            <!-- 提交按钮 -->
            <button
              type="submit"
              class="w-full h-11 border-0 rounded-lg bg-trial-submit-gradient text-white text-small font-semibold cursor-pointer shadow-trial-submit px-4 py-2 disabled:cursor-default disabled:opacity-70 transition-shadow duration-fast hover:shadow-button-accent-hover"
              :disabled="submitting"
            >
              {{ submitting ? pageContent.submittingText : pageContent.submitButton }}
            </button>
          </Form>
        </div>
      </div>
    </div>

    <!-- ===== 页脚 ===== -->
    <SiteFooter
      :footer-columns="footerColumns"
      :socials="socials"
      :hotline="footerHotline"
      :email="footerEmail"
      :copyright="copyrightText"
    />
    <!-- 算式验证码浮窗 -->
    <CaptchaModal
      ref="captchaModalRef"
      v-model:visible="captchaVisible"
      :trigger-el="getCodeBtnRef"
      @confirm="handleCaptchaConfirm"
      @close="handleCaptchaClose"
    />
    <!-- 提交成功弹窗 -->
    <TrialSuccessModal v-model:visible="successModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import Form from '@/client/components/ui/Form.vue'
import FormInput from '@/client/components/ui/FormInput.vue'
import FormCheckbox from '@/client/components/ui/FormCheckbox.vue'
import SiteFooter from '@/client/components/layout/SiteFooter.vue'
import CaptchaModal from '@/client/components/business/CaptchaModal.vue'
import TrialSuccessModal from './TrialSuccessModal.vue'
import { useStickyFormSubmit } from '@/client/composables/useStickyFormSubmit'
import { captureSemData } from '@/shared/utils/semData'
import { pageContent } from './trialData'
import {
  footerColumns,
  socials,
  footerHotline,
  footerEmail,
  copyrightText,
} from '@/client/data/siteFooterData'

// ==================== SEM 数据捕获 ====================

// 页面加载时从 URL 参数提取 SEM 数据并缓存到 localStorage
// 与旧版 page.php 中 setSemParams() 行为一致
captureSemData()

// ==================== SEO ====================

usePageSEO()

// ==================== 表单状态 ====================

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
} = useStickyFormSubmit({
  onSuccess: () => {
    feedback.value = ''
    successModalVisible.value = true
  },
})

// ==================== CaptchaModal ====================

const captchaVisible = ref(false)
const getCodeBtnRef = ref<HTMLElement | null>(null)
const captchaModalRef = ref<InstanceType<typeof CaptchaModal> | null>(null)

/** 提交成功弹窗显隐 */
const successModalVisible = ref(false)

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

/** 协议勾选状态 */
const agreedToTerms = ref(false)

/** 蜜罐字段（防机器人 — 正常用户不会填写） */
const honeypot = ref('')

// ==================== 提交处理 ====================

/** 提交前的额外校验 — 协议勾选 + 蜜罐检测 */
const handleFormSubmit = async () => {
  // 蜜罐检测：若被填充则静默拒绝（安全机制，不提示用户）
  if (honeypot.value) {
    return
  }

  // 协议勾选检查
  if (!agreedToTerms.value) {
    feedback.value = pageContent.agreementRequired
    feedbackType.value = 'error'
    return
  }

  // 调用 composable 的 handleSubmit（内部含字段验证 + 频率限制 + API 调用）
  await handleSubmit()
}
</script>
