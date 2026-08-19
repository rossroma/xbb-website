<template>
  <div class="feishu-page">
    <h1 class="sr-only">销帮帮 X 飞书 - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <IconCardGrid
      :title="basicAbilitySection.title"
      :subtitle="basicAbilitySection.description"
      :features="basicAbilitySection.cards"
      :columns="basicAbilitySection.columns"
      variant="capability-card"
      color-scheme="brand"
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
import ImageShowcase from '@/client/components/business/ImageShowcase.vue'
import { heroBannerSlide, basicAbilitySection, showcaseSections } from './feishuPageData'

usePageSEO()
</script>
