<template>
  <div class="home">
    <!-- SEO: 首页核心主题，视觉隐藏，仅搜索引擎和屏幕阅读器可见 -->
    <h1 class="sr-only">销帮帮AI CRM — 懂客户，更懂增长</h1>

    <HeroBanner
      :slides="heroSlides"
      :brand-video="heroBrandVideo"
    />

    <FeatureImageCard
      :heading="solutionCardsSection.heading"
      :subheading="solutionCardsSection.subheading"
      :cards="solutionCardsSection.cards"
      @card-click="() => navigateToLiuziPage()"
    />

    <GradientCardGrid
      :title="aiFeatureCardsSection.title"
      :cards="aiFeatureCardsSection.cards"
      title-prefix="AI"
      prefer-image
      @card-click="() => navigateToLiuziPage()"
    />

    <MetricsPanel
      :title="metricsPanelSection.title"
      :metrics="metricsPanelSection.metrics"
    />

    <PartnerGrid
      :heading="ecosystemPartnersSection.heading"
      :items="ecosystemPartnersSection.items"
    />

    

    <IndustryCarousel
      :heading="caseCarouselSection.heading"
      :cards="caseCarouselSection.cards"
      :cta-text="caseCarouselSection.ctaText"
      @cta-click="navigateToClientPage(caseCarouselSection.ctaPageKey)"
    />

    <PromoBanner
      :eyebrow="enterpriseVideoSection.eyebrow"
      :title="enterpriseVideoSection.title"
      :cta-text="enterpriseVideoSection.ctaText"
      :image="enterpriseVideoSection.image"
      @cta-click="navigateToClientPage(enterpriseVideoSection.ctaPageKey)"
    />

    <SplitCardLayout
      :heading="serviceCardsSection.heading"
      :cards="serviceCardsSection.cards"
    />

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePageSEO } from '@/client/composables/usePageSEO'
import { useAds, AD_POSITION } from '@/client/composables/usePageAds'
import { toPagePath } from '@/client/data/routePaths'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import GradientCardGrid from '@/client/components/business/GradientCardGrid.vue'
import FeatureImageCard from '@/client/components/business/FeatureImageCard.vue'
import MetricsPanel from '@/client/components/business/MetricsPanel.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import PromoBanner from '@/client/components/business/PromoBanner.vue'
import IndustryCarousel from '@/client/components/business/IndustryCarousel.vue'
import SplitCardLayout from '@/client/components/business/SplitCardLayout.vue'
import {
  solutionCardsSection,
  aiFeatureCardsSection,
  metricsPanelSection,
  ecosystemPartnersSection,
  enterpriseVideoSection,
  caseCarouselSection,
  serviceCardsSection,
  heroBrandVideo,
  adsToBannerSlides,
} from '@/client/data/homeData'

usePageSEO()

const router = useRouter()

// 首页 Banner 轮播 — 优先使用后台广告数据，API 不可用时回退到硬编码
const { items: bannerAds } = useAds(AD_POSITION.HOME_BANNER)
const heroSlides = computed(() => adsToBannerSlides(bannerAds.value))

const navigateToClientPage = async (pageKey: string) => {
  if (!pageKey) return
  await router.push(toPagePath(pageKey))
}

const navigateToLiuziPage = async () => {
  await router.push('/liuzi')
}
</script>
