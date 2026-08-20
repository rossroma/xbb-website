<template>
  <div class="ai-sales-assistant">
    <div class="ai-hero-wrapper relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] bg-[#0A0814]">
      <GradientWavesBg class="absolute inset-0 z-0" />
      <HeroBanner mode="single" single-layout="vertical" :slides="[heroBannerSlide]" single-title-class="ai-hero-title"
        single-subtitle-class="ai-hero-subtitle" single-primary-btn-class="ai-hero-primary-btn"
        single-secondary-btn-class="ai-hero-secondary-btn" class="relative z-10" />
    </div>

    <ImageCardGrid :title="lookalikeSection.title" :cards="lookalikeSection.cards" :subtitle="lookalikeSection.subtitle" variant="image-card" color-scheme="neutral" :rows="[1, 2]" />

    <ImageCardGrid :title="transparentSection.title" :cards="transparentSection.cards" :subtitle="transparentSection.subtitle" variant="image-card" color-scheme="neutral" :rows="[1, 2]" />

    <ImageCardGrid :title="coachSection.title" :cards="coachSection.cards" :subtitle="coachSection.subtitle" variant="image-card" color-scheme="neutral" :rows="[3]" />

    <ImageCardGrid :title="analystSection.title" :cards="analystSection.cards" :subtitle="analystSection.subtitle" variant="image-card" color-scheme="neutral" :rows="[3]" />

    <CTASection variant="cool" :title="focusSection.title" :subtitle="focusSection.description"
      :image="focusSection.image" :image-alt="focusSection.imageAlt" />

  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import GradientWavesBg from '@/client/components/ui/GradientWavesBg.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import ImageCardGrid from '@/client/components/business/ImageCardGrid.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import {
  heroBannerSlide,
  lookalikeSection,
  transparentSection,
  coachSection,
  analystSection,
  focusSection,
} from './aiSalesAssistantData'

usePageSEO()
</script>

<style>
/* AI 销售助理 Hero 标题字号 */
.ai-hero-title {
  font-size: 24px !important;
}

.ai-hero-subtitle {
  font-size: 64px !important;
  margin-top: 12px !important;
  color: #ffffff !important;
}

/* 免费试用按钮 - 白色背景 + 深灰字体 */
.ai-hero-primary-btn {
  background: #ffffff !important;
  color: #29241F !important;
}

/* 立即咨询按钮 - 渐变边框 */
.ai-hero-secondary-btn {
  color: #FFFFFF;
  background: linear-gradient(#0A0814, #0A0814) padding-box,
    linear-gradient(285deg, #1574ff 2%, #5952ff 51%, #a969fe 96%) border-box !important;
  border: 2px solid transparent !important;
  border-radius: 999px;
}
</style>
