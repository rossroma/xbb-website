<template>
  <div class="home">
    <HeroBanner
      :slides="heroBannerSection.slides"
      :brand-video="heroBrandVideo"
      @action="handleHeroAction"
    />

    <FeatureImageCard
      :heading="solutionCardsSection.heading"
      :subheading="solutionCardsSection.subheading"
      :cards="solutionCardsSection.cards"
      @heading-click="navigateToClientPage(solutionCardsSection.headingPageKey)"
      @card-click="(title: string) => navigateToClientPage(solutionCardsSection.routeMap[title]!)"
    />

    <GradientCardGrid
      :title="aiFeatureCardsSection.title"
      :cards="aiFeatureCardsSection.cards"
      @card-click="(title: string) => navigateToClientPage(aiFeatureCardsSection.routeMap[title]!)"
    >
      <template #visual="{ card }">
        <!-- Mock: 拓客 → 窗口模拟 + 浮动提示 -->
        <template v-if="card.type === 'prospecting'">
          <div
            class="absolute left-1/2 bottom-[-2px] w-[76%] h-[210px] -translate-x-1/2 border-2 border-ai-border rounded-t-hero bg-ai-mock-bg shadow-ai-mock overflow-hidden"
            aria-hidden="true"
          >
            <div class="absolute z-10 left-[42px] top-9 w-30 h-[26px] rounded-pill bg-ai-bg" />
            <div
              class="absolute z-10 left-[42px] right-[42px] top-21 h-[26px] rounded-pill bg-ai-bg"
            />
            <div
              class="absolute z-10 left-[42px] right-[42px] top-33 h-[26px] rounded-pill bg-ai-bg-light"
            />
          </div>
          <div
            class="absolute left-[22px] bottom-18 flex items-center gap-2.5 px-[18px] py-[13px] rounded-pill bg-ai-float-gradient text-white text-small shadow-ai-float-pill"
            aria-hidden="true"
          >
            超级助手 <span class="text-ai-float-text-muted">正在找客...</span>
          </div>
        </template>

        <!-- Mock: 过程管理 → 风险列表 -->
        <template v-else-if="card.type === 'process'">
          <div
            class="absolute left-1/2 bottom-[-2px] w-[76%] h-[210px] -translate-x-1/2 border-2 border-ai-border rounded-t-hero bg-ai-mock-bg shadow-ai-mock overflow-hidden p-[26px_22px]"
            aria-hidden="true"
          >
            <div class="flex items-center justify-between mb-[18px]">
              <span class="text-body text-ai-process-title">跟进风险</span>
              <span
                class="px-[9px] py-[5px] rounded-pill bg-ai-process-danger-soft text-ai-process-danger text-caption"
                >3项待处理</span
              >
            </div>
            <div class="grid gap-3">
              <div
                v-for="(item, i) in card.processItems"
                :key="i"
                class="grid grid-cols-[12px_1fr_auto] items-center gap-2.5 min-h-[42px] px-3 rounded-badge bg-ai-mock-bg-solid shadow-ai-process text-caption text-ai-process-text"
              >
                <span
                  :class="[
                    'w-3 h-3 rounded-full shrink-0',
                    item.statusClass === 'process-panel__item--danger'
                      ? 'bg-ai-process-danger shadow-[0_0_0_4px_rgba(240,91,66,0.1)]'
                      : 'bg-ai-process-success shadow-[0_0_0_4px_rgba(32,178,107,0.1)]',
                  ]"
                />
                <span>{{ item.label }}</span>
                <strong
                  :class="[
                    'text-caption font-medium',
                    item.statusClass === 'process-panel__item--danger'
                      ? 'text-ai-process-danger'
                      : 'text-ai-process-success-text',
                  ]"
                  >{{ item.status }}</strong
                >
              </div>
            </div>
          </div>
        </template>

        <!-- Mock: 陪练 → 窗口模拟 + 生成提示 -->
        <template v-else-if="card.type === 'coach'">
          <div
            class="absolute left-1/2 bottom-[-2px] w-[76%] h-[210px] -translate-x-1/2 border-2 border-ai-border rounded-t-hero bg-ai-mock-bg shadow-ai-mock overflow-hidden"
            aria-hidden="true"
          >
            <div class="absolute z-10 left-[42px] top-9 w-30 h-[26px] rounded-pill bg-ai-bg" />
            <div
              class="absolute z-10 left-[42px] right-[42px] top-21 h-[26px] rounded-pill bg-ai-bg"
            />
            <div
              class="absolute z-10 left-[42px] right-[42px] top-33 h-[26px] rounded-pill bg-ai-bg-light"
            />
            <div
              class="absolute z-20 left-1/2 bottom-[30px] w-[84%] -translate-x-1/2 flex items-center justify-center gap-3 min-h-[54px] px-[18px] py-2 rounded-pill bg-ai-mock-bg-light shadow-ai-coach text-small text-ai-coach-text leading-tight"
            >
              <span class="text-[25px] text-ai-primary-light">✦</span> 正在生成陪练话术
            </div>
          </div>
        </template>

        <!-- Mock: 分析师 → 推荐模板列表 -->
        <template v-else-if="card.type === 'analyst'">
          <div
            class="absolute left-1/2 bottom-[-2px] w-[82%] h-[210px] -translate-x-1/2 px-[18px] pt-5 border-2 border-ai-border rounded-t-ai-analyst bg-ai-mock-bg-analyst shadow-ai-mock overflow-hidden"
            aria-hidden="true"
          >
            <div
              class="pb-3 mb-3 border-b-2 border-dashed border-ai-border-light text-small text-ai-muted"
            >
              推荐应用模板
            </div>
            <div class="grid gap-2.5">
              <div
                v-for="(prompt, i) in card.prompts"
                :key="i"
                class="flex items-center gap-2 min-h-[34px] px-3 border border-ai-border-lighter rounded-pill bg-surface-primary shadow-ai-prompt text-caption text-ai-prompt-text whitespace-nowrap"
              >
                <span
                  class="grid place-items-center shrink-0 w-5 h-5 rounded-full border-2 border-brand-accent text-brand-accent text-caption font-black"
                  >AI</span
                >
                <span>{{ prompt }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </GradientCardGrid>

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

    <FloatingToolbar
      :top-service="{
        icon: floatingToolbarData.serviceIcon,
        label: '在线客服',
        link: floatingToolbarData.customerServiceLink,
      }"
      :items="floatingToolbarData.items"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { toPagePath } from '@/client/data/routePaths'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import GradientCardGrid from '@/client/components/business/GradientCardGrid.vue'
import FeatureImageCard from '@/client/components/business/FeatureImageCard.vue'
import MetricsPanel from '@/client/components/business/MetricsPanel.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import PromoBanner from '@/client/components/business/PromoBanner.vue'
import IndustryCarousel from '@/client/components/business/IndustryCarousel.vue'
import SplitCardLayout from '@/client/components/business/SplitCardLayout.vue'
import FloatingToolbar from '@/client/components/layout/FloatingToolbar.vue'
import {
  heroBannerSection,
  solutionCardsSection,
  aiFeatureCardsSection,
  metricsPanelSection,
  ecosystemPartnersSection,
  enterpriseVideoSection,
  caseCarouselSection,
  serviceCardsSection,
  homeSeo,
  heroBrandVideo,
} from '@/client/data/homeData'
import { floatingToolbarData } from '@/client/data/siteConfigData'
import type { BannerSlide } from '@/client/data/homeData'

useHead({
  title: homeSeo.title,
  meta: [
    {
      name: 'description',
      content: homeSeo.description,
    },
  ],
})

const router = useRouter()

const navigateToClientPage = async (pageKey: string) => {
  if (!pageKey) return
  await router.push(toPagePath(pageKey))
}

const handleHeroAction = async (slide: BannerSlide, action: 'primary' | 'secondary') => {
  const href = action === 'primary' ? slide.primaryHref : slide.secondaryHref
  const hrefTarget = action === 'primary' ? slide.primaryTarget : slide.secondaryTarget

  if (href) {
    if (hrefTarget === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    if (href.startsWith('/') && !href.startsWith('//')) {
      await router.push(href)
      return
    }

    window.location.href = href
    return
  }

  const routeTarget = heroBannerSection.routeActions[slide.key]?.[action]
  if (routeTarget) await navigateToClientPage(routeTarget)
}
</script>
