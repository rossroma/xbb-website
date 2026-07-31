<template>
  <div class="qiwei-page">
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
      variant="mint"
      :title="trafficOperationSection.title"
      :subtitle="trafficOperationSection.description"
      :image="trafficOperationSection.image"
      :image-alt="trafficOperationSection.imageAlt"
      :primary-cta="trafficOperationSection.primaryCta"
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
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import {
  qiweiSeo,
  heroBannerSlide,
  basicAbilitySection,
  trafficOperationSection,
  showcaseSections,
} from './qiweiPageData'

useHead({
  title: qiweiSeo.title,
  meta: [
    {
      name: 'description',
      content: qiweiSeo.description,
    },
  ],
})
</script>
