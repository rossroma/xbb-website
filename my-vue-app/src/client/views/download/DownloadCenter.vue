<template>
  <div class="download-center">
    <h1 class="sr-only">下载中心 - 销帮帮 CRM</h1>
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
