<template>
  <div class="contact-us-page">
    <h1 class="sr-only">联系我们 - 销帮帮AI CRM</h1>
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <ContactCard :cards="contactInfoSection.cards" />

    <AddressTabs class="!mt-0" :title="addressSection.title" :items="addressCards" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import { useAds, AD_POSITION } from '@/client/composables/usePageAds'
import ContactCard from '@/client/components/business/ContactCard.vue'
import AddressTabs from '@/client/components/business/AddressTabs.vue'
import { addressSection, contactInfoSection, heroBannerSlide, adsToAddressCards } from './contactUsData'

// 公司地址 — 优先使用后台广告数据，API 不可用时回退到硬编码
const { items: addressAds } = useAds(AD_POSITION.CONTACT_ADDRESS)
const addressCards = computed(() => adsToAddressCards(addressAds.value))

usePageSEO()
</script>
