<template>
  <div class="download-center">
    <PlatformDownload
      :title="downloadCenterSection.title"
      :subtitle="downloadCenterSection.subtitle"
      :platforms="downloadCenterSection.platforms"
    />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import PlatformDownload from '@/client/components/business/PlatformDownload.vue'
import { downloadCenterSeo, downloadCenterSection } from './downloadCenterData'

useHead({
  title: downloadCenterSeo.title,
  meta: [
    {
      name: 'description',
      content: downloadCenterSeo.description,
    },
  ],
})
</script>
