<template>
  <div class="company-intro-page">
    <h1 class="sr-only">公司介绍 - 销帮帮AI CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <CompanyOverview
      :title="aboutSection.title"
      :paragraphs="aboutSection.paragraphs"
      :video="aboutSection.video"
      :metrics="aboutSection.metrics"
    />

    <Timeline
      :title="timelineSection.title"
      :subtitle="timelineSection.subtitle"
      :milestones="timelineSection.milestones"
    />

    <ResearchStrengthSection
      :title="technologySection.title"
      :paragraphs="researchStrengthSection.intro"
      :images="researchStrengthSection.images"
    />

    <RecognitionSection
      :title="recognitionSection.title"
      :subtitle="recognitionSection.subtitle"
      :image="recognitionSection.image"
      :image-alt="recognitionSection.imageAlt"
      :marquee-images="recognitionCarouselImages"
    />

    <PartnerGrid :heading="ecosystemSection.heading" :items="ecosystemSection.items" />

    <IndustryCarousel :heading="listedCompanySection.heading" :cards="listedCompanySection.cards" />
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import CompanyOverview from '@/client/components/business/CompanyOverview.vue'
import Timeline from '@/client/components/business/Timeline.vue'
import ResearchStrengthSection from '@/client/components/business/ResearchStrengthSection.vue'
import RecognitionSection from '@/client/components/business/RecognitionSection.vue'
import PartnerGrid from '@/client/components/business/PartnerGrid.vue'
import IndustryCarousel from '@/client/components/business/IndustryCarousel.vue'
import {
  aboutSection,
  ecosystemSection,
  heroBannerSlide,
  listedCompanySection,
  recognitionSection,
  researchStrengthSection,
  technologySection,
  timelineSection,
} from './companyIntroData'

const recognitionCarouselImages = recognitionSection.carouselImages.filter(
  (item) => item.src !== '/images/company/honor-12.png',
)

usePageSEO()
</script>
