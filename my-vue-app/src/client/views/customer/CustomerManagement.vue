<template>
  <div class="customer-management">
    <h1 class="sr-only">客户管理 - 销帮帮 CRM</h1>
    <div class="customer-management__hero">
      <HeroBanner mode="single" :slides="[heroBannerSlide]" />
    </div>

    <div class="customer-management__tab-bg">
      <TabShowcase
        :title="tabFeaturesSection.title"
        title-highlight="增长可复制"
        :tabs="tabFeaturesSection.tabs"
        theme="blue"
      />
    </div>

    <div class="customer-management__dedup-bg">
      <TabShowcase
        :title="dedupTabsSection.title"
        title-highlight="可靠"
        :tabs="dedupTabsSection.tabs"
        layout="tabs-right"
        theme="amber"
      />
    </div>

    <ImageCardGrid
      :title="publicSeaSection.title"
      title-highlight="效率"
      :cards="publicSeaSection.features"
      :columns="publicSeaSection.columns"
      variant="image-card"
      color-scheme="brand"
    />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import TabShowcase from '@/client/components/business/TabShowcase.vue'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import {
  heroBannerSlide,
  tabFeaturesSection,
  dedupTabsSection,
  publicSeaSection,
} from './customerManagementData'

usePageSEO()
</script>

<style scoped>
.customer-management__tab-bg {
  background: url('/images/customer/tab-showcase-bg.png') top center / cover no-repeat;
}
</style>
