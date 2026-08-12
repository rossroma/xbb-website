<template>
  <div class="service-page">
    <h1 class="sr-only">优质服务 - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <IconCardGrid
      :title="servicePlusSection.title"
      :subtitle="servicePlusSection.subtitle"
      :features="servicePlusSection.features"
      :columns="5"
      variant="icon-tile"
      color-scheme="accent"
    />

    <ImageShowcase
      v-for="section in serviceShowcaseSections"
      :key="section.key"
      :title="section.title"
      :subtitle="section.subtitle"
      :image="section.image"
      :image-alt="section.imageAlt"
      :layout="section.layout"
      theme="blue"
    />

    <IconCardGrid
      :title="supportSection.title"
      :subtitle="supportSection.subtitle"
      :features="supportSection.features"
      :columns="3"
      variant="icon-tile"
      color-scheme="accent"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import {
  heroBannerSlide,
  servicePlusSection,
  serviceShowcaseSections,
  supportSection,
} from './servicePageData'

usePageSEO()
</script>
