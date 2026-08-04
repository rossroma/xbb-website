<template>
  <div class="knowledge-qna-page">
    <HeroBanner mode="single" :slides="[knowledgeQnAHeroSlide]" />

    <SectionBlock spacing="none" paddingBottom="default" width="default">
      <div class="knowledge-article-layout">
        <main class="knowledge-main-column">
          <div class="article-content">
            <template v-for="(block, blockIndex) in knowledgeQnAArticleBlocks" :key="blockIndex">
              <h2
                v-if="block.type === 'heading'"
                :id="getBlockAnchor(blockIndex)"
                class="article-heading"
              >
                {{ block.text }}
              </h2>

              <h3 v-else-if="block.type === 'subheading'" class="article-subheading">
                {{ block.text }}
              </h3>

              <p v-else-if="block.type === 'paragraph'" class="article-paragraph">
                <strong v-if="block.strongLead">{{ block.strongLead }}</strong
                >{{ block.text }}
              </p>

              <div v-else-if="block.type === 'table'" class="article-table-wrap">
                <table class="article-table">
                  <thead>
                    <tr>
                      <th v-for="header in block.headers" :key="header">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>

          <div :id="faqAnchorId" class="knowledge-faq-shell">
            <FaqList
              title="本文相关FAQs"
              :categories="knowledgeQnAFaqCategories"
              :items="knowledgeQnAFaqItems"
              expand-mode="single"
              :show-categories="false"
              :show-search="false"
            />

            <div class="knowledge-faq-actions">
              <UiButton :to="trialPagePath" variant="primary" size="lg">CRM免费试用</UiButton>
              <UiButton to="/" variant="outline" size="lg">销帮帮CRM官网</UiButton>
            </div>
          </div>
        </main>

        <aside class="knowledge-sidebar" aria-label="知识问答侧边栏">
          <ArticleSidebar
            :banners="knowledgeQnASidebarBanners"
            :toc-items="knowledgeQnATocItems"
            :active-toc-id="activeTocId"
          />
        </aside>
      </div>
    </SectionBlock>
    
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import ArticleSidebar from '@/client/components/business/ArticleSidebar.vue'
import CaptchaModal from '@/client/components/business/CaptchaModal.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import UiButton from '@/client/components/ui/Button.vue'
import Form from '@/client/components/ui/Form.vue'
import FaqList from '@/client/components/business/FaqList.vue'
import ReviewCardGrid from '@/client/components/business/ReviewCardGrid.vue'
import { useStickyFormSubmit } from '@/client/composables/useStickyFormSubmit'
import { toPagePath } from '@/client/data/routePaths'
import TrialSuccessModal from '@/client/views/trial/TrialSuccessModal.vue'
import {
  knowledgeQnAArticleBlocks,
  knowledgeQnAFaqCategories,
  knowledgeQnAFaqItems,
  knowledgeQnAHeroSlide,
  knowledgeQnAReviewCards,
  knowledgeQnASeo,
  knowledgeQnASidebarBanners,
} from './knowledgeQnAData'

const getBlockAnchor = (blockIndex: number) => `knowledge-section-${blockIndex}`
const faqAnchorId = 'knowledge-faqs'

const knowledgeQnATocItems = computed(() =>
  knowledgeQnAArticleBlocks
    .flatMap((block, blockIndex) =>
      block.type === 'heading' ? [{ id: getBlockAnchor(blockIndex), title: block.text }] : [],
    )
    .concat({ id: faqAnchorId, title: '本文相关FAQs' }),
)

const trialPagePath = toPagePath('single_mfsy')
const activeTocId = ref(knowledgeQnATocItems.value[0]?.id ?? '')
let tocObserver: IntersectionObserver | null = null

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

const handleHeroFormSubmit = async () => {
  if (honeypot.value) return

  if (!agreedToTerms.value) {
    feedback.value = '请先阅读并同意服务协议和隐私政策'
    feedbackType.value = 'error'
    return
  }

  form.title = form.title.trim()
  await handleSubmit()
}
onMounted(async () => {
  await nextTick()

  const anchorElements = knowledgeQnATocItems.value
    .map((item) => document.getElementById(item.id))
    .filter((element): element is HTMLElement => Boolean(element))

  if (!anchorElements.length) return

  tocObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

      if (visibleEntry?.target.id) {
        activeTocId.value = visibleEntry.target.id
      }
    },
    {
      rootMargin: '-104px 0px -62% 0px',
      threshold: [0, 0.1, 1],
    },
  )

  anchorElements.forEach((element) => tocObserver?.observe(element))
})

onBeforeUnmount(() => {
  tocObserver?.disconnect()
  tocObserver = null
})

useHead({
  title: knowledgeQnASeo.title,
  meta: [
    {
      name: 'description',
      content: knowledgeQnASeo.description,
    },
  ],
})
</script>

<style scoped>
.knowledge-qna-page {
  position: relative;
}

.knowledge-hero-form-card {
  --main-color: #ff6400;
  width: min(500px, 100%);
  height: 526px;
  padding: 0 44px 34px;
  border-radius: 16px;
  background: #fff;
  box-sizing: border-box;
}

.knowledge-hero-form-card__heading {
  text-align: center;
}

.knowledge-hero-form-card__heading strong {
  display: block;
  margin-top: 55px;
  margin-bottom: 5px;
  font-size: 26px;
  font-weight: 500;
  color: #1f2329;
}

.knowledge-hero-form-card__heading p {
  margin-bottom: 24px;
  font-size: 16px;
  color: #373737;
}

.knowledge-hero-form-card__form {
  gap: 0;
}

.knowledge-hero-form-card__feedback {
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 20px;
}

.knowledge-hero-form-card__feedback--success {
  color: var(--color-status-success);
}

.knowledge-hero-form-card__feedback--error {
  color: var(--color-status-error);
}

.knowledge-hero-form-card__honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.knowledge-hero-form-card__row {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
}

.knowledge-hero-form-card__row label {
  display: flex;
  flex: 0 0 100px;
  color: #373737;
  font-size: 16px;
}

.knowledge-hero-form-card__row input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #cccfd5;
  outline: none;
  color: #666;
  font-size: 16px;
  line-height: 38px;
  background: #fff;
  transition: border-color 0.2s ease;
}

.knowledge-hero-form-card__row input::placeholder {
  color: #bdbdbd;
  font-size: 16px;
  font-weight: 400;
}

.knowledge-hero-form-card__row input:focus {
  border-color: var(--main-color);
  color: #333;
}

.knowledge-hero-form-card__code {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.knowledge-hero-form-card__code-button {
  width: auto;
  height: 40px;
  margin-left: 16px;
  padding: 0 16px;
  border: 0;
  border-radius: 6px;
  background: var(--main-color);
  color: #fff;
  font-size: 14px;
  line-height: 40px;
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.knowledge-hero-form-card__code-button:disabled {
  cursor: default;
  opacity: 0.55;
}

.knowledge-hero-form-card__agreement {
  position: relative;
  display: block;
  min-height: 24px;
  margin-bottom: 26px;
  padding-left: 24px;
  color: #666;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 1px;
}

.knowledge-hero-form-card__agreement input {
  position: absolute;
  left: 0;
  top: 4px;
  opacity: 0;
}

.knowledge-hero-form-card__agreement i {
  position: absolute;
  left: 0;
  top: 4px;
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 0.3em;
  box-sizing: border-box;
}

.knowledge-hero-form-card__agreement i::after {
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  content: '';
  opacity: 0;
  transform: rotate(45deg);
}

.knowledge-hero-form-card__agreement:hover i {
  border-color: var(--main-color);
}

.knowledge-hero-form-card__agreement input:checked + i {
  border-color: #ff8a39;
  background: #ff8a39;
}

.knowledge-hero-form-card__agreement input:checked + i::after {
  opacity: 1;
}

.knowledge-hero-form-card__agreement span {
  color: #b9b9b9;
}

.knowledge-hero-form-card__agreement a {
  color: #303030;
}

.knowledge-hero-form-card__submit {
  display: block;
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 0.4em;
  background: var(--main-color);
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 48px;
  letter-spacing: 1px;
  text-align: center;
  transition: all 0.5s ease-in-out;
}

.knowledge-hero-form-card__submit:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.knowledge-hero-form-card__submit:disabled {
  cursor: default;
  opacity: 0.72;
}

.knowledge-article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 300px);
  align-items: start;
  justify-content: space-between;
  gap: 48px;
  padding-top: 40px;
}

.knowledge-main-column {
  min-width: 0;
  width: 100%;
}

.knowledge-sidebar {
  position: sticky;
  top: calc(var(--client-header-height, 76px) + 24px);
  z-index: 3;
  width: 100%;
  max-width: 300px;
  justify-self: end;
}

.article-content {
  color: var(--color-text-primary);
  line-height: 1.85;
  font-size: 16px;
}

.article-paragraph {
  margin-bottom: 16px;
}

.article-paragraph strong {
  color: var(--color-text-primary);
  font-weight: 700;
}

.article-heading {
  margin-top: 34px;
  margin-bottom: 16px;
  scroll-margin-top: calc(var(--client-header-height, 76px) + 28px);
  font-size: 24px;
  line-height: 1.32;
  font-weight: 700;
  color: var(--color-text-primary);
}

.article-heading::before {
  position: relative;
  top: -2px;
  content: '';
  display: inline-block;
  width: 4px;
  height: 25px;
  margin-right: 16px;
  border-radius: 2px;
  vertical-align: middle;
  background: linear-gradient(180deg, #5b61ff 0%, #7fd6ff 100%);
}

.article-subheading {
  margin-top: 28px;
  margin-bottom: 14px;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 700;
  color: var(--color-text-primary);
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.article-table th,
.article-table td {
  border: 1px solid var(--color-border-default);
  padding: 10px 14px;
  text-align: left;
  vertical-align: top;
}

.article-table th {
  background: var(--color-surface-secondary);
  font-weight: 600;
}

.article-table-wrap {
  overflow-x: auto;
  margin: 20px 0;
}

.knowledge-faq-shell {
  margin-top: 46px;
  scroll-margin-top: calc(var(--client-header-height, 76px) + 28px);
}

.knowledge-faq-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 28px;
}

.knowledge-faq-actions :deep(a),
.knowledge-faq-actions :deep(button) {
  min-width: 172px;
  font-weight: 500;
}

.knowledge-review-shell {
  margin-top: 54px;
}

.knowledge-faq-shell :deep(section),
.knowledge-review-shell :deep(section) {
  padding: 0;
}

.knowledge-faq-shell :deep(section > div),
.knowledge-review-shell :deep(section > div) {
  width: 100%;
  max-width: none;
  margin: 0;
}

@media (max-width: 1199px) {
  .knowledge-hero-form-card {
    margin: 0 auto;
  }

  .knowledge-article-layout {
    display: block;
    padding-top: 32px;
  }

  .knowledge-sidebar {
    display: none;
  }
}

@media (max-width: 640px) {
  .knowledge-hero-form-card {
    height: auto;
    padding: 0 22px 28px;
  }

  .knowledge-hero-form-card__heading strong {
    margin-top: 34px;
  }

  .knowledge-hero-form-card__row {
    display: block;
    margin-bottom: 18px;
  }

  .knowledge-hero-form-card__row label {
    margin-bottom: 8px;
  }

  .knowledge-hero-form-card__agreement {
    margin-bottom: 20px;
  }
}
</style>
