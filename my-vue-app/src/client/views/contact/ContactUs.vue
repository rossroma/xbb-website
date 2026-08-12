<template>
  <div class="contact-us-page">
    <h1 class="sr-only">联系我们 - 销帮帮AI CRM</h1>
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
      class="mt-15 w-screen pb-20 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] max-lg:mt-20 max-lg:py-16 max-md:mt-15 max-md:py-12"
    >
      <ContentCardGrid
        class="!mt-0"
        :title="addressSection.title"
        :cards="addressCards"
        :columns="4"
        variant="address"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import { useAds, AD_POSITION } from '@/client/composables/usePageAds'
import ContactCard from '@/client/components/business/ContactCard.vue'
import ContentCardGrid from '@/client/components/business/ContentCardGrid.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { addressSection, contactInfoSection, heroBannerSlide, adsToAddressCards } from './contactUsData'

// 公司地址 — 优先使用后台广告数据，API 不可用时回退到硬编码
const { items: addressAds } = useAds(AD_POSITION.CONTACT_ADDRESS)
const addressCards = computed(() => adsToAddressCards(addressAds.value))

usePageSEO()
</script>
