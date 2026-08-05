<template>
  <div class="dingtalk-page">
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
      :title="professionalSection.title"
      :subtitle="professionalSection.description"
      :image="professionalSection.image"
      :image-alt="professionalSection.imageAlt"
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
  dingtalkSeo,
  heroBannerSlide,
  basicAbilitySection,
  professionalSection,
  showcaseSections,
} from './dingtalkPageData'

useHead({
  title: dingtalkSeo.title,
  meta: [
    {
      name: 'description',
      content: dingtalkSeo.description,
    },
  ],
})
</script>
