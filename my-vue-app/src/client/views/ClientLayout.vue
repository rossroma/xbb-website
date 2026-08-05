<template>
  <div class="client-layout">
    <SiteHeader :nav-items="siteNavItems" :trial-route="trialRoute" :hotline="siteHotline" />
    <main class="client-layout__main">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <SiteFooter
      v-if="!route.meta.hideStickyFormBar"
      :footer-columns="footerColumns"
      :socials="socials"
      :hotline="footerHotline"
      :email="footerEmail"
      :copyright="copyrightText"
    />
    <StickyFormBar v-if="!route.meta.hideStickyFormBar" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import StickyFormBar from '@/client/components/layout/StickyFormBar.vue'
import SiteFooter from '@/client/components/layout/SiteFooter.vue'
import SiteHeader from '@/client/components/layout/SiteHeader.vue'
import { siteNavItems, trialRoute, siteHotline } from '@/client/data/siteNavData'
import {
  footerColumns,
  socials,
  footerHotline,
  footerEmail,
  copyrightText,
} from '@/client/data/siteFooterData'
import { captureSemData } from '@/shared/utils/semData'

// 全局 SEM 数据捕获 — 确保所有页面（含 StickyFormBar）提交时能携带 SEM 推广数据
captureSemData()

const route = useRoute()

const scrollContainerToTop = () => {
  const container = document.querySelector('.client-layout')
  if (container instanceof HTMLElement) {
    container.scrollTo({ top: 0, behavior: 'auto' })
  }
}

const waitForNextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const scrollToHash = async (hash: string) => {
  await nextTick()

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const target = document.querySelector(hash)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    await waitForNextFrame()
  }
}

const syncRoutePosition = async () => {
  if (route.hash) {
    await scrollToHash(route.hash)
    return
  }

  scrollContainerToTop()
}

onMounted(syncRoutePosition)
watch(() => route.fullPath, syncRoutePosition, { flush: 'post' })
</script>

<style scoped>
.client-layout {
  --client-header-height: 76px;
  --client-theme-primary: #4f46e5;
  --client-theme-primary-strong: #4338ca;
  --client-theme-secondary: #2563eb;
  --client-theme-accent: #ff6400;
  --client-theme-text: #24324b;
  --client-theme-text-soft: #5b6478;
  --client-theme-panel: rgba(255, 255, 255, 0.94);
  --client-theme-panel-soft: #eef2ff;
  --client-theme-border: rgba(99, 102, 241, 0.18);
  --client-theme-cta: linear-gradient(135deg, #5b5bd6 0%, #2563eb 100%);
  --client-theme-cta-hover: linear-gradient(135deg, #4338ca 0%, #1d4ed8 100%);
  --client-bottom-bar-height: 60px;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  background: #ffffff;
}

.client-layout__main {
  min-height: calc(100vh - var(--client-header-height));
}

@media (max-width: 960px) {
  .client-layout {
    --client-header-height: 68px;
    --client-bottom-bar-height: 0px;
  }
}
</style>
