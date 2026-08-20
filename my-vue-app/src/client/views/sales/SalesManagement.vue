<template>
  <div class="sales-management">
    <h1 class="sr-only">销售管理 - 销帮帮 CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <ImageCardGrid
      :title="aiCoachSection.title"
      :subtitle="aiCoachSection.description"
      :cards="aiCoachSection.cards"
      variant="image-card"
      :columns="2"
      color-scheme="neutral"
    />

    <TabShowcase
      :title="transparentSection.title"
      :subtitle="transparentSection.subtitle"
      :tabs="transparentSection.tabs"
      layout="tabs-left"
      theme="blue"
    />

    <TabShowcase
      :title="visitPlanSection.title"
      :subtitle="visitPlanSection.subtitle"
      :tabs="visitPlanSection.tabs"
      layout="tabs-right"
      theme="purple"
    />

    <TabShowcase
      :title="checkinSection.title"
      :subtitle="checkinSection.subtitle"
      :tabs="checkinSection.tabs"
      layout="tabs-left"
      theme="sky"
    />

    <TabShowcase
      :title="workReportSection.title"
      :subtitle="workReportSection.subtitle"
      :tabs="workReportSection.tabs"
      layout="tabs-right"
      theme="orange"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import {
  heroBannerSlide,
  aiCoachSection,
  transparentSection,
  visitPlanSection,
  checkinSection,
  workReportSection,
} from './salesManagementData'

usePageSEO()
</script>
