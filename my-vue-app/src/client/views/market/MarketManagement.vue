<template>
  <div class="market-management">
    <h1 class="sr-only">市场管理 - 销帮帮 CRM</h1>
    <div class="market-management__hero">
      <HeroBanner mode="single" :slides="[heroBannerSlide]" />
    </div>

    <CTASection
      variant="cool"
      :title="leadSourceSection.title"
      :subtitle="leadSourceSection.description"
      :image="leadSourceSection.image"
      :image-alt="leadSourceSection.imageAlt"
      image-full-bleed
    />

    <ImageCardGrid
      v-for="section in imageCardGridSections"
      :key="section.title"
      :title="section.title"
      :subtitle="section.subtitle"
      :cards="section.cards"
      :columns="section.columns"
      :rows="section.rows"
      variant="feature-panel"
      color-scheme="accent"
    />

  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import CTASection from '@/client/components/business/CTASection.vue'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import {
  heroBannerSlide,
  leadSourceSection,
  imageCardGridSections,
} from './marketManagementData'

usePageSEO()
</script>
