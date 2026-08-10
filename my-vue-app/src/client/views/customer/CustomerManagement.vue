<template>
  <div class="customer-management">
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

.customer-management__hero :deep(h1 + p) {
  position: relative;
  z-index: 1;
  isolation: isolate;
  width: fit-content;
  color: #ffffff;
  -webkit-text-fill-color: #ffffff;
}

.customer-management__hero :deep(h1 + p)::before {
  content: '数字化管理';
  position: absolute;
  inset: 0;
  z-index: 2;
  background-image: linear-gradient(315deg, #1574ff 2%, #5952ff 51%, #a969fe 96%);
  background-clip: text;
  color: transparent;
  pointer-events: none;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.customer-management__hero :deep(h1 + p) {
  font-size: var(--text-display) !important;
  font-weight: var(--text-display--font-weight) !important;
  line-height: var(--text-display--line-height) !important;
  letter-spacing: var(--text-display--letter-spacing) !important;
}

.customer-management__hero :deep(h1 + p)::after {
  content: '';
  position: absolute;
  z-index: -1;
  background: url('/images/customer/digital-management-underline.png') center / contain no-repeat;
  pointer-events: none;
  left: 8px;
  bottom: -0.35em;
  width: 94.74%;
  height: 72.73%;
  opacity: 1;
}

@media (max-width: 1023px) {
  .customer-management__hero :deep(h1 + p) {
    font-size: var(--text-h1) !important;
    line-height: var(--text-h1--line-height) !important;
    letter-spacing: var(--text-h1--letter-spacing) !important;
  }

  .customer-management__hero :deep(h1 + p)::after {
    left: 8px;
    bottom: -10px;
    width: 190px;
    height: 37px;
  }
}

@media (max-width: 767px) {
  .customer-management__hero :deep(h1 + p) {
    font-size: var(--text-h2) !important;
    line-height: var(--text-h2--line-height) !important;
    letter-spacing: var(--text-h2--letter-spacing) !important;
  }

  .customer-management__hero :deep(h1 + p)::after {
    left: 6px;
    bottom: -8px;
    width: 150px;
    height: 29px;
  }
}
</style>
