<template>
  <div class="company-intro-page">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <SectionBlock spacing="default">
      <div class="flex flex-col items-center text-center">
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ aboutSection.title }}
        </h2>
      </div>

      <div class="mt-12 grid grid-cols-[0.95fr_1.05fr] gap-10 items-center max-lg:grid-cols-1">
        <div class="flex flex-col gap-4">
          <p
            v-for="paragraph in aboutSection.paragraphs"
            :key="paragraph"
            class="text-body text-text-secondary leading-body"
          >
            {{ paragraph }}
          </p>
        </div>

        <div
          class="overflow-hidden rounded-card border border-border-subtle bg-surface-primary shadow-subtle"
        >
          <video
            class="block w-full aspect-video object-cover"
            :src="aboutSection.video"
            controls
            playsinline
            preload="metadata"
          />
        </div>
      </div>

      <div class="mt-10 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-md:grid-cols-1">
        <article
          v-for="metric in aboutSection.metrics"
          :key="metric.label"
          class="rounded-card border border-[#dfe5ff] bg-[#f8faff] px-6 py-7 text-center"
        >
          <div class="text-display font-bold text-brand-accent leading-none max-lg:text-h1">
            {{ metric.value }}
          </div>
          <div class="mt-3 text-body text-text-secondary leading-body">
            {{ metric.label }}
          </div>
        </article>
      </div>
    </SectionBlock>

    <Timeline
      :title="timelineSection.title"
      :subtitle="timelineSection.subtitle"
      :milestones="timelineSection.milestones"
    />

    <MetricsPanel
      :title="technologySection.title"
      :subtitle="technologySection.subtitle"
      :columns="3"
      :metrics="technologySection.metrics"
      variant="detail"
    />

    <SectionBlock spacing="default">
      <div class="text-center">
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ recognitionSection.title }}
        </h2>
      </div>

      <div
        class="mt-12 grid grid-cols-3 gap-x-16 gap-y-8 max-lg:grid-cols-2 max-lg:gap-x-8 max-md:grid-cols-1"
      >
        <Card
          v-for="item in recognitionItems"
          :key="item"
          clickable
          :aria-label="item"
          class="min-h-[100px] !border-transparent !p-0 !shadow-[0_10px_28px_rgba(15,23,42,0.08)] hover:!shadow-[0_14px_32px_rgba(15,23,42,0.12)]"
        >
          <div class="flex min-h-[100px] items-center justify-center px-6 text-center">
            <span class="text-[18px] font-normal text-[#09233f] leading-subtitle">
              {{ item }}
            </span>
          </div>
        </Card>
      </div>
    </SectionBlock>

    <PartnerGrid :heading="ecosystemSection.heading" :items="ecosystemSection.items" />

    <IndustryCarousel :heading="listedCompanySection.heading" :cards="listedCompanySection.cards" />

    <SectionBlock spacing="default">
      <div class="text-center">
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ successSupportSection.title }}
        </h2>
        <p class="mt-4 text-body text-text-secondary leading-body">
          {{ successSupportSection.subtitle }}
        </p>
      </div>

      <div class="mt-8 grid grid-cols-3 gap-5 max-lg:grid-cols-1">
        <article
          v-for="(point, index) in successSupportSection.points"
          :key="point.title"
          :class="[
            'flex items-center gap-5 rounded-card px-8 py-5 text-left',
            supportCardClass(index),
          ]"
        >
          <span
            class="inline-flex h-2 w-2 shrink-0 rounded-full bg-text-primary"
            aria-hidden="true"
          />
          <component
            :is="point.icon"
            class="shrink-0 text-brand-accent"
            :size="22"
            :stroke-width="2.4"
            aria-hidden="true"
          />
          <span class="min-w-0 text-body text-text-secondary leading-body">
            {{ point.title }}
          </span>
        </article>
      </div>
    </SectionBlock>

    <CTASection
      variant="cool"
      :title="footerCtaSection.title"
      :subtitle="footerCtaSection.subtitle"
      :primary-cta="footerCtaSection.primaryCta"
      :secondary-cta="footerCtaSection.secondaryCta"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import { useAds, AD_POSITION } from '@/client/composables/usePageAds'
import Timeline from '@/client/components/business/Timeline.vue'
import MetricsPanel from '@/client/components/business/MetricsPanel.vue'
import CTASection from '@/client/components/business/CTASection.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import IndustryCarousel from '@/client/components/business/IndustryCarousel.vue'
import Card from '@/client/components/ui/Card.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import {
  aboutSection,
  ecosystemSection,
  footerCtaSection,
  heroBannerSlide,
  listedCompanySection,
  recognitionSection,
  successSupportSection,
  technologySection,
  timelineSection,
  adsToRecognitionItems,
} from './companyIntroData'

// 权威认可 — 优先使用后台广告数据，API 不可用时回退到硬编码
const { items: recognitionAds } = useAds(AD_POSITION.ABOUT_RECOGNITION)
const recognitionItems = computed(() => adsToRecognitionItems(recognitionAds.value))

const supportCardClass = (index: number) => {
  const classes = [
    'bg-[#eef4ff] text-[#4b587c]',
    'bg-[#f4f1ff] text-[#5b587c]',
    'bg-[#fff4fa] text-[#5b587c]',
  ]

  return classes[index % classes.length]
}

usePageSEO()
</script>
