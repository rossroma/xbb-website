<template>
  <div class="bi-analysis">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      variant="cool"
      :title="mobileDataSection.title"
      :subtitle="mobileDataSection.description"
      :image="mobileDataSection.image"
      :image-alt="mobileDataSection.imageAlt"
      :primary-cta="mobileDataSection.ctaText"
    />

    <TabShowcase
      :title="dashboardSection.title"
      :tabs="dashboardSection.tabs"
      layout="tabs-left"
      theme="blue"
    />

    <TabShowcase
      :title="dataInsightSection.title"
      :tabs="dataInsightSection.tabs"
      layout="tabs-right"
      theme="indigo"
    />

    <CTASection
      variant="cool"
      :title="reportSection.title"
      :subtitle="reportSection.description"
      :image="reportSection.image"
      :image-alt="reportSection.imageAlt"
      :primary-cta="reportSection.ctaText"
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
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import {
  biAnalysisSeo,
  heroBannerSlide,
  mobileDataSection,
  dashboardSection,
  dataInsightSection,
  reportSection,
  footerCtaSection,
} from './biAnalysisData'

useHead({
  title: biAnalysisSeo.title,
  meta: [
    {
      name: 'description',
      content: biAnalysisSeo.description,
    },
  ],
})
</script>
