<template>
  <div class="customer-management">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CTASection
      :title="productIntroSection.title"
      :subtitle="productIntroSection.description"
      :image="productIntroSection.image"
      :image-alt="productIntroSection.imageAlt"
      :primary-cta="productIntroSection.ctaText"
    />

    <TabShowcase :title="tabFeaturesSection.title" :tabs="tabFeaturesSection.tabs" theme="blue" />

    <TabShowcase
      :title="dedupTabsSection.title"
      :tabs="dedupTabsSection.tabs"
      layout="tabs-right"
      theme="amber"
    />

    <IconCardGrid
      :title="publicSeaSection.title"
      :features="publicSeaSection.features"
      :columns="publicSeaSection.columns"
      variant="icon-badge"
      color-scheme="brand"
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
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import {
  heroBannerSlide,
  productIntroSection,
  tabFeaturesSection,
  dedupTabsSection,
  publicSeaSection,
  footerCtaSection,
} from './customerManagementData'

usePageSEO()
</script>
