<template>
  <div class="paas-page">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      variant="warm"
      :title="capabilityIntroSection.title"
      :subtitle="capabilityIntroSection.description"
      :image="capabilityIntroSection.image"
      :image-alt="capabilityIntroSection.imageAlt"
      :primary-cta="capabilityIntroSection.primaryCta"
      :primary-href="capabilityIntroSection.primaryHref"
    />

    <TabShowcase
      :title="businessBuildSection.title"
      :tabs="businessBuildSection.tabs"
      layout="tabs-left"
      theme="blue"
    />

    <TabShowcase
      :title="openPlatformSection.title"
      :tabs="openPlatformSection.tabs"
      layout="tabs-right"
      theme="purple"
    />

    <TabShowcase
      :title="detailCapabilitySection.title"
      :tabs="detailCapabilitySection.tabs"
      layout="tabs-left"
      theme="orange"
    />

    <CTASection
      variant="dawn"
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
  capabilityIntroSection,
  businessBuildSection,
  openPlatformSection,
  detailCapabilitySection,
  footerCtaSection,
} from './paasPageData'

usePageSEO()
</script>
