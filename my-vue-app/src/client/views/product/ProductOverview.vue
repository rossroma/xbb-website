<template>
  <div class="product-overview-page">
    <h1 class="sr-only">产品概述 - 销帮帮AI CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" @action="openModuleCenter" />

    <ImageCardGrid
      :title="productAbilitySection.title"
      :cards="productAbilitySection.cards"
      :columns="3"
      variant="feature-panel"
      color-scheme="brand"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import { heroBannerSlide, moduleCenterUrl, productAbilitySection } from './productOverviewData'

const openModuleCenter = () => {
  window.open(moduleCenterUrl, '_blank', 'noopener,noreferrer')
}

usePageSEO()
</script>
