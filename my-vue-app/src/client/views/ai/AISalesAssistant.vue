<template>
  <div class="ai-sales-assistant">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <TabShowcase
      :title="lookalikeSection.title"
      :tabs="lookalikeSection.tabs"
      layout="tabs-left"
      theme="purple"
    />

    <TabShowcase
      :title="transparentSection.title"
      :tabs="transparentSection.tabs"
      layout="tabs-right"
      theme="blue"
    />

    <TabShowcase
      :title="coachSection.title"
      :tabs="coachSection.tabs"
      layout="tabs-left"
      theme="indigo"
    />

    <TabShowcase
      :title="analystSection.title"
      :tabs="analystSection.tabs"
      layout="tabs-right"
      theme="purple"
    />

    <CTASection
      variant="cool"
      :title="focusSection.title"
      :subtitle="focusSection.description"
      :image="focusSection.image"
      :image-alt="focusSection.imageAlt"
    />

    <CTASection
      variant="cool"
      :title="footerCtaSection.title"
      :subtitle="footerCtaSection.subtitle"
      :primary-cta="footerCtaSection.primaryCta"
      :secondary-cta="footerCtaSection.secondaryCta"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import {
  heroBannerSlide,
  lookalikeSection,
  transparentSection,
  coachSection,
  analystSection,
  focusSection,
  footerCtaSection,
} from './aiSalesAssistantData'

usePageSEO()
</script>
