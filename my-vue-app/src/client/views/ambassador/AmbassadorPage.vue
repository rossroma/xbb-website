<template>
  <div class="ambassador-page">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <SectionBlock spacing="default">
      <div class="flex flex-col items-center text-center">
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ contactSection.title }}
        </h2>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-6">
        <a
          class="group mx-auto flex w-full max-w-180 items-center justify-between gap-6 rounded-card border border-[#ffd8bd] bg-[#fff8f3] px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:border-[#ffb27a] hover:shadow-subtle max-sm:flex-col max-sm:items-start"
          :href="`tel:${contactHotline}`"
        >
          <div class="flex items-center gap-4">
            <span
              class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff0e6] text-brand-primary"
              aria-hidden="true"
            >
              <PhoneTelephone :size="22" :stroke-width="2.6" />
            </span>
            <span>
              <span class="block text-h3 text-text-primary leading-subtitle">
                {{ contactHotlineLabel }}
              </span>
              <span class="mt-1 block text-small text-text-tertiary">推荐大使咨询</span>
            </span>
          </div>
          <span class="text-h3 font-semibold text-brand-primary leading-subtitle">
            {{ contactHotlineValue }}
          </span>
        </a>
      </div>
    </SectionBlock>

    <FlowSteps
      :title="referralProcessSection.title"
      :steps="referralProcessSection.steps"
      variant="rich"
    />

    <div class="mx-auto mt-[120px] w-[min(1200px,calc(100%-48px))] max-md:mt-8">
      <img
        :src="referralProcessSection.rewardImage"
        :alt="referralProcessSection.rewardImageAlt"
        class="w-full"
        loading="lazy"
      />
    </div>

    <FaqList
      title="常见问题"
      :categories="faqCategories"
      :items="faqItems"
      expand-mode="single"
      :show-categories="false"
      :show-search="false"
    />

    <CTASection
      variant="warm"
      :title="finalCtaSection.title"
      :subtitle="finalCtaSection.subtitle"
      :primary-cta="finalCtaSection.primaryCta"
      :secondary-cta="finalCtaSection.secondaryCta"
    />
  </div>
</template>

<script setup lang="ts">
import { PhoneTelephone } from '@icon-park/vue-next'
import { usePageSEO } from '@/client/composables/usePageSEO'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import FlowSteps from '@/client/components/business/FlowSteps.vue'
import FaqList from '@/client/components/business/FaqList.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import {
  contactSection,
  faqCategories,
  faqItems,
  finalCtaSection,
  heroBannerSlide,
  referralProcessSection,
} from './ambassadorPageData'

const [contactHotlineLabel = '客服热线', contactHotlineValue = contactSection.subtitle] =
  contactSection.subtitle.split(/[：:]/)
const contactHotline = contactHotlineValue.replace(/[^\d-]/g, '')

usePageSEO()
</script>
