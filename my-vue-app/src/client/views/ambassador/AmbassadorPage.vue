<template>
  <div class="ambassador-page">
    <h1 class="sr-only">推广大使 - 销帮帮AI CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <ContactHotline v-bind="contactHotlineSection" />

    <FlowSteps
      :title="referralProcessSection.title"
      :steps="referralProcessSection.steps"
      variant="rich"
    />

    <div class="mx-auto mt-30 w-[min(1200px,calc(100%-48px))] max-md:mt-8">
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
  </div>
</template>

<script setup lang="ts">
import { usePageSEO } from '@/client/composables/usePageSEO'
import ContactHotline from '@/client/components/business/ContactHotline.vue'
import FaqList from '@/client/components/business/FaqList.vue'
import FlowSteps from '@/client/components/business/FlowSteps.vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import {
  contactHotlineSection,
  faqCategories,
  faqItems,
  heroBannerSlide,
  referralProcessSection,
} from './ambassadorPageData'

usePageSEO()
</script>
