<template>
  <div class="paas-page">
    <h1 class="sr-only">PaaS - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <TabShowcase
      :title="businessBuildSection.title"
      :tabs="businessBuildSection.tabs"
      :subtitle="businessBuildSection.subtitle"
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
      :subtitle="detailCapabilitySection.subtitle"
      layout="tabs-left"
      theme="orange"
    />

  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import {
  heroBannerSlide,
  businessBuildSection,
  openPlatformSection,
  detailCapabilitySection,
} from './paasPageData'

usePageSEO()
</script>
