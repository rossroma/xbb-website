<template>
  <div class="market-management">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      variant="cool"
      :title="leadSourceSection.title"
      :subtitle="leadSourceSection.description"
      :image="leadSourceSection.image"
      :image-alt="leadSourceSection.imageAlt"
      :primary-cta="leadSourceSection.ctaText"
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
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import ProcessSteps from '@/client/components/business/ProcessSteps.vue'
import {
  marketManagementSeo,
  heroBannerSlide,
  leadSourceSection,
  processSections,
  footerCtaSection,
} from './marketManagementData'

useHead({
  title: marketManagementSeo.title,
  meta: [
    {
      name: 'description',
      content: marketManagementSeo.description,
    },
  ],
})
</script>
