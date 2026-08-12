<template>
  <div class="market-management">
    <h1 class="sr-only">市场管理 - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      variant="cool"
      :title="leadSourceSection.title"
      :subtitle="leadSourceSection.description"
      :image="leadSourceSection.image"
      :image-alt="leadSourceSection.imageAlt"
    />

    <ProcessSteps
      v-for="section in processSections"
      :key="section.title"
      :title="section.title"
      :subtitle="section.subtitle"
      :steps="section.steps"
      arrow-style="line"
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
import ProcessSteps from '@/client/components/business/ProcessSteps.vue'
import {
  heroBannerSlide,
  leadSourceSection,
  processSections,
  footerCtaSection,
} from './marketManagementData'

usePageSEO()
</script>
