<template>
  <div class="contact-us-page">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <SectionBlock spacing="default">
      <div class="rounded-large border border-[#dfe7ff] bg-surface-primary shadow-subtle">
        <ContactCard
          :hotline="contactInfoSection.hotline"
          :email="contactInfoSection.email"
          :socials="contactInfoSection.socials"
          layout="vertical"
        />
      </div>
    </SectionBlock>

    <div
      class="mt-[60px] w-screen pb-20 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] max-lg:mt-[80px] max-lg:py-16 max-md:mt-[60px] max-md:py-12"
    >
      <ContentCardGrid
        class="!mt-0"
        :title="addressSection.title"
        :cards="addressSection.cards"
        :columns="4"
        variant="address"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import ContactCard from '@/client/components/business/ContactCard.vue'
import ContentCardGrid from '@/client/components/business/ContentCardGrid.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { addressSection, contactInfoSection, heroBannerSlide } from './contactUsData'

usePageSEO()
</script>
