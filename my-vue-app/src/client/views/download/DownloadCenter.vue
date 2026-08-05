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
import PlatformDownload from '@/client/components/business/PlatformDownload.vue'
import { usePageSEO } from '@/client/composables/usePageSEO'
import { downloadCenterSection } from './downloadCenterData'

usePageSEO()
</script>
