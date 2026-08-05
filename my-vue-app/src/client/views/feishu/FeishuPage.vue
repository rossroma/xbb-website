<template>
  <div class="feishu-page">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <IconCardGrid
      :title="basicAbilitySection.title"
      :subtitle="basicAbilitySection.description"
      :features="basicAbilitySection.features"
      :columns="basicAbilitySection.columns"
      variant="icon-tile"
      color-scheme="accent"
    />

    <CTASection
      variant="cool"
      :title="collaborationSection.title"
      :subtitle="collaborationSection.description"
      :image="collaborationSection.image"
      :image-alt="collaborationSection.imageAlt"
    />

    <ImageShowcase
      v-for="section in showcaseSections"
      :key="section.key"
      :title="section.title"
      :subtitle="section.subtitle"
      :image="section.image"
      :image-alt="section.imageAlt"
      :layout="section.layout"
      :theme="section.theme"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import {
  heroBannerSlide,
  basicAbilitySection,
  collaborationSection,
  showcaseSections,
} from './feishuPageData'

usePageSEO()
</script>
