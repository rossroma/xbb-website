<template>
  <div class="sales-management">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <IconCardGrid
      :title="aiCoachSection.title"
      :subtitle="aiCoachSection.description"
      :features="aiCoachSection.cards"
      variant="icon-badge"
      :columns="4"
      color-scheme="brand"
    />

    <TabShowcase
      :title="transparentSection.title"
      :tabs="transparentSection.tabs"
      layout="tabs-left"
      theme="blue"
    />

    <TabShowcase
      :title="visitPlanSection.title"
      :tabs="visitPlanSection.tabs"
      layout="tabs-right"
      theme="purple"
    />

    <TabShowcase
      :title="checkinSection.title"
      :tabs="checkinSection.tabs"
      layout="tabs-left"
      theme="sky"
    />

    <TabShowcase
      :title="workReportSection.title"
      :tabs="workReportSection.tabs"
      layout="tabs-right"
      theme="orange"
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
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import {
  salesManagementSeo,
  heroBannerSlide,
  aiCoachSection,
  transparentSection,
  visitPlanSection,
  checkinSection,
  workReportSection,
  footerCtaSection,
} from './salesManagementData'

useHead({
  title: salesManagementSeo.title,
  meta: [
    {
      name: 'description',
      content: salesManagementSeo.description,
    },
  ],
})
</script>
