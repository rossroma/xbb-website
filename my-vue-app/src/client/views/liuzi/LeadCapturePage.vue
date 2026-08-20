<template>
  <div class="lead-capture-page">
    <HeroBanner mode="single" single-variant="form-background" :slides="[leadHeroSlide]">
      <template #single-visual>
        <div class="lead-hero-form-card">
          <div class="lead-hero-form-card__heading">
            <h1>{{ trialFormContent.title }}</h1>
            <p>{{ trialFormContent.subtitle }}</p>
          </div>

          <Form class="lead-hero-form-card__form" @submit="handleFormSubmit">
            <p
              v-if="feedback"
              :class="[
                'lead-hero-form-card__feedback',
                feedbackType === 'success'
                  ? 'lead-hero-form-card__feedback--success'
                  : 'lead-hero-form-card__feedback--error',
              ]"
            >
              {{ feedback }}
            </p>

            <input
              v-model="honeypot"
              class="lead-hero-form-card__honeypot"
              name="website"
              autocomplete="off"
              tabindex="-1"
              aria-hidden="true"
            />

            <FormInput
              v-model.trim="form.title"
              class="lead-hero-form-card__field"
              name="title"
              size="md"
              :maxlength="200"
              placeholder="请输入完整企业名称"
              aria-label="企业名称"
            />

            <FormInput
              v-model.trim="form.tel"
              class="lead-hero-form-card__field"
              name="tel"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              size="md"
              :maxlength="11"
              placeholder="请输入手机号码"
              aria-label="手机号码"
              @update:model-value="
                (val: string | number) => (form.tel = String(val).replace(/\D/g, ''))
              "
            />

            <FormInput
              v-model="form.regcode"
              class="lead-hero-form-card__field"
              name="regcode"
              size="md"
              :maxlength="6"
              placeholder="请输入短信验证码"
              aria-label="短信验证码"
            >
              <template #suffix>
                <button
                  ref="getCodeBtnRef"
                  type="button"
                  class="h-9 px-3 border border-trial-bar-border rounded-r-lg bg-white/96 text-trial-code-btn text-small font-semibold text-center cursor-pointer whitespace-nowrap hover:bg-brand-accent-soft transition-colors duration-fast disabled:opacity-50 disabled:cursor-default"
                  :disabled="countdown > 0"
                  @click="handleGetCode"
                >
                  {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                </button>
              </template>
            </FormInput>

            <label class="lead-hero-form-card__agreement">
              <input v-model="agreedToTerms" type="checkbox" name="agreement" />
              <i aria-hidden="true"></i>
              <span>{{ trialFormContent.agreementPrefix }}</span>
              <a :href="trialFormContent.serviceAgreementUrl" target="_blank">{{
                trialFormContent.serviceAgreementText
              }}</a>
              及
              <a :href="trialFormContent.privacyPolicyUrl" target="_blank">{{
                trialFormContent.privacyPolicyText
              }}</a>
            </label>

            <button type="submit" class="lead-hero-form-card__submit" :disabled="submitting">
              {{ submitting ? trialFormContent.submittingText : trialFormContent.submitButton }}
            </button>
          </Form>
        </div>
      </template>
    </HeroBanner>

    <img :src="logoSection.image" :alt="logoSection.imageAlt" class="liuzi-logo-section__image" />

    <AiCrmFeatureGrid
      :title="aiCrmSection.title"
      :cards="aiCrmSection.cards"
      cta-text="免费试用"
      :cta-href="liuziTrialHref"
    />

    <HeroBanner
      mode="showcase-carousel"
      showcase-layout="text-left"
      :showcase-slides="managementShowcaseLeftSlides"
    />

    <HeroBanner
      mode="showcase-carousel"
      showcase-layout="text-right"
      :showcase-title="managementShowcaseRightSection.title"
      :showcase-slides="managementShowcaseRightSection.slides"
    />

    <IconCardGrid
      :title="biCapabilitySection.title"
      :features="biCapabilitySection.features"
      :columns="3"
      variant="icon-tile"
      color-scheme="clean"
      cta-text="免费试用"
      :cta-href="liuziTrialHref"
    />

    <PartnerGrid :heading="ecosystemSection.heading" :items="ecosystemSection.items" />

    <CaseDetailHeader :cases="caseHeaderSlides" />

    <SiteFooter
      :footer-columns="footerColumns"
      :socials="socials"
      :hotline="footerHotline"
      :email="footerEmail"
      :copyright="copyrightText"
    />
    <StickyFormBar />

    <CaptchaModal
      ref="captchaModalRef"
      v-model:visible="captchaVisible"
      :trigger-el="getCodeBtnRef"
      @confirm="handleCaptchaConfirm"
      @close="handleCaptchaClose"
    />
    <TrialSuccessModal v-model:visible="successModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import AiCrmFeatureGrid from '@/client/components/business/AiCrmFeatureGrid.vue'
import CaptchaModal from '@/client/components/business/CaptchaModal.vue'
import CaseDetailHeader from '@/client/components/business/CaseDetailHeader.vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import SiteFooter from '@/client/components/layout/SiteFooter.vue'
import StickyFormBar from '@/client/components/layout/StickyFormBar.vue'
import Form from '@/client/components/ui/Form.vue'
import FormInput from '@/client/components/ui/FormInput.vue'
import { useStickyFormSubmit } from '@/client/composables/useStickyFormSubmit'
import {
  copyrightText,
  footerColumns,
  footerEmail,
  footerHotline,
  socials,
} from '@/client/data/siteFooterData'
import TrialSuccessModal from '@/client/views/trial/TrialSuccessModal.vue'
import {
  aiCrmSection,
  biCapabilitySection,
  caseHeaderSlides,
  ecosystemSection,
  leadHeroSlide,
  liuziTrialHref,
  logoSection,
  managementShowcaseLeftSlides,
  managementShowcaseRightSection,
} from './liuziPageData'
import { pageContent as trialFormContent } from '@/client/views/trial/trialData'

usePageSEO()

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

const captchaVisible = ref(false)
const getCodeBtnRef = ref<HTMLElement | null>(null)
const captchaModalRef = ref<InstanceType<typeof CaptchaModal> | null>(null)
const successModalVisible = ref(false)
const agreedToTerms = ref(false)
const honeypot = ref('')

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

const handleFormSubmit = async () => {
  if (honeypot.value) {
    return
  }

  if (!agreedToTerms.value) {
    feedback.value = trialFormContent.agreementRequired
    feedbackType.value = 'error'
    return
  }

  form.title = form.title.trim()
  await handleSubmit()
}
</script>

<style scoped>
.lead-capture-page {
  background: #ffffff;
}

.lead-hero-form-card {
  --lead-hero-main-color: #ff6400;
  width: min(460px, 100%);
  padding: 48px 26px 40px;
  border-radius: 16px;
  background: #ffffff;
  box-sizing: border-box;
  transform: translateX(-72px);
}

.lead-hero-form-card__heading {
  margin-bottom: 28px;
  text-align: center;
}

.lead-hero-form-card__heading h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
}

.lead-hero-form-card__heading p {
  margin: 10px 0 0;
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 1.6;
}

.lead-hero-form-card__form {
  gap: 0;
}

.lead-hero-form-card__feedback {
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 20px;
}

.lead-hero-form-card__feedback--success {
  color: var(--color-status-success);
}

.lead-hero-form-card__feedback--error {
  color: var(--color-status-error);
}

.lead-hero-form-card__honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.lead-hero-form-card__field {
  margin-bottom: 18px;
}

.lead-hero-form-card__agreement {
  position: relative;
  display: block;
  min-height: 24px;
  margin: 4px 0 22px;
  padding-left: 24px;
  color: #666666;
  font-size: 14px;
  line-height: 24px;
}

.lead-hero-form-card__agreement input {
  position: absolute;
  left: 0;
  top: 4px;
  opacity: 0;
}

.lead-hero-form-card__agreement i {
  position: absolute;
  left: 0;
  top: 4px;
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 0.3em;
  box-sizing: border-box;
}

.lead-hero-form-card__agreement i::after {
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  content: '';
  opacity: 0;
  transform: rotate(45deg);
}

.lead-hero-form-card__agreement input:checked + i {
  border-color: #ff8a39;
  background: #ff8a39;
}

.lead-hero-form-card__agreement input:checked + i::after {
  opacity: 1;
}

.lead-hero-form-card__agreement span {
  color: #9a9a9a;
}

.lead-hero-form-card__agreement a {
  color: var(--color-text-primary);
}

.lead-hero-form-card__submit {
  display: block;
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 6px;
  background: var(--lead-hero-main-color);
  color: #ffffff;
  cursor: pointer;
  font-size: 16px;
  line-height: 48px;
  letter-spacing: 1px;
  text-align: center;
  transition:
    opacity 0.2s ease,
    box-shadow 0.2s ease;
}

.lead-hero-form-card__submit:hover:not(:disabled) {
  box-shadow: 0 10px 30px rgba(255, 100, 0, 0.24);
}

.lead-hero-form-card__submit:disabled {
  cursor: default;
  opacity: 0.72;
}

.liuzi-logo-section {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 72px 0 48px;
  text-align: center;
}

.liuzi-logo-section__image {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
}

@media (max-width: 1199px) {
  .lead-hero-form-card {
    margin: 0 auto;
    transform: none;
  }
}

@media (max-width: 640px) {
  .lead-hero-form-card {
    min-height: 0;
    padding: 30px 22px 28px;
  }

  .lead-hero-form-card__heading {
    margin-bottom: 22px;
  }

  .lead-hero-form-card__heading h1 {
    font-size: 24px;
  }

  .liuzi-logo-section {
    width: min(1200px, calc(100% - 32px));
    padding: 48px 0 32px;
  }
}
</style>
