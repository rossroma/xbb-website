<template>
  <div class="home">
    <!-- SEO: 首页核心主题，视觉隐藏，仅搜索引擎和屏幕阅读器可见 -->
    <h1 class="sr-only">销帮帮AI CRM — 懂客户，更懂增长</h1>

    <HeroBanner
      :slides="heroSlides"
      :brand-video="heroBrandVideo"
      @action="handleHeroAction"
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
      prefer-image
      @card-click="() => navigateToLiuziPage()"
    />

    <MetricsPanel :title="metricsPanelSection.title" :metrics="metricsPanelSection.metrics" />

    <PartnerGrid
      :heading="ecosystemPartnersSection.heading"
      :items="ecosystemPartnersSection.items"
    />

    <PromoBanner
      :eyebrow="enterpriseVideoSection.eyebrow"
      :title="enterpriseVideoSection.title"
      :cta-text="enterpriseVideoSection.ctaText"
      :image="enterpriseVideoSection.image"
      @cta-click="navigateToClientPage(enterpriseVideoSection.ctaPageKey)"
    />

    <IndustryCarousel
      :heading="caseCarouselSection.heading"
      :cards="caseCarouselSection.cards"
      :cta-text="caseCarouselSection.ctaText"
      @cta-click="navigateToClientPage(caseCarouselSection.ctaPageKey)"
    />

    <SplitCardLayout :heading="serviceCardsSection.heading" :cards="serviceCardsSection.cards" />

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
  heroBannerSection,
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
import type { BannerSlide } from '@/client/data/homeData'

usePageSEO()

const router = useRouter()
const trialCtaTexts = new Set(['免费试用', '立即免费试用', '立即咨询', 'CRM免费试用', '免费使用'])

// 首页 Banner 轮播 — 优先使用后台广告数据，API 不可用时回退到硬编码
const { items: bannerAds } = useAds(AD_POSITION.HOME_BANNER)
const heroSlides = computed(() => adsToBannerSlides(bannerAds.value))

/** CTA 按钮路由映射（按 ord），与 slideVisualByOrd 中的视觉样式一一对应 */
const routeActionsByOrd: Record<number, { primary: string; secondary: string }> = {
  1: { primary: 'channel_products', secondary: 'list_contact' },
  2: { primary: 'channel_products', secondary: '' },
  3: { primary: 'list_cases', secondary: 'channel_qudao' },
  4: { primary: 'single_mfsy', secondary: 'list_contact' },
}

const navigateToClientPage = async (pageKey: string) => {
  if (!pageKey) return
  await router.push(toPagePath(pageKey))
}

const navigateToLiuziPage = async () => {
  await router.push('/liuzi')
}

const handleHeroAction = async (slide: BannerSlide, action: 'primary' | 'secondary') => {
  const text = action === 'primary' ? slide.primaryCta : slide.secondaryCta
  if (text && trialCtaTexts.has(text.trim())) {
    await navigateToClientPage('single_mfsy')
    return
  }

  // 优先按 ord 查找路由（广告数据），fallback 按 key 查找（硬编码数据）
  const target =
    routeActionsByOrd[slide.ord ?? 0]?.[action] ||
    heroBannerSection.routeActions[slide.key]?.[action]
  if (target) await navigateToClientPage(target)
}
</script>
