<template>
  <div class="bi-analysis">
    <h1 class="sr-only">BI 分析 - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      variant="cool"
      :title="mobileDataSection.title"
      :subtitle="mobileDataSection.description"
      :image="mobileDataSection.image"
      :image-alt="mobileDataSection.imageAlt"
      :primary-cta="mobileDataSection.ctaText"
      :primary-href="mobileDataSection.ctaHref"
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
      action-placement="under-title"
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
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import CTASection from '@/client/components/business/CTASection.vue'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import {
  heroBannerSlide,
  mobileDataSection,
  dashboardSection,
  dataInsightSection,
  reportSection,
  footerCtaSection,
} from './biAnalysisData'

usePageSEO()
</script>
