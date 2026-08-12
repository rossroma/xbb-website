<template>
  <div class="product-overview-page">
    <h1 class="sr-only">产品概述 - 销帮帮AI CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" @action="openModuleCenter" />

    <IconCardGrid
      :title="productAbilitySection.title"
      :features="productAbilitySection.features"
      :columns="7"
      variant="icon-tile"
      color-scheme="brand"
    />

    <ImageShowcase
      v-for="section in productShowcaseSections"
      :key="section.key"
      :title="section.title"
      :subtitle="section.subtitle"
      :image="section.image"
      :image-alt="section.imageAlt"
      :layout="section.layout"
      :cta-text="section.ctaText"
      theme="orange"
      @cta-click="openModuleCenter"
    />

    <CTASection
      variant="warm"
      title="让增长，从这里开始"
      subtitle="免费试用7天，体验AI驱动的新一代CRM平台"
      primary-cta="立即免费试用"
      secondary-cta="预约产品演示"
      @primary-click="openModuleCenter"
      @secondary-click="openModuleCenter"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import {
  heroBannerSlide,
  moduleCenterUrl,
  productAbilitySection,
  productShowcaseSections,
} from './productOverviewData'

const openModuleCenter = () => {
  window.open(moduleCenterUrl, '_blank', 'noopener,noreferrer')
}

usePageSEO()
</script>
