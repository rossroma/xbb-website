<!--
  用户心声页面 — 展示各行业客户的真实评价
  页面结构：Banner → 分类 Tab → 评价卡片列表
-->
<template>
  <div class="voices-page">
    <!-- ===== Banner 区 ===== -->
    <HeroBanner mode="single" :slides="[voicesBannerSlide]" />

    <!-- ===== 分类 Tab 区 + 评价卡片列表 ===== -->
    <SectionBlock spacing="none" paddingBottom="default" class="mt-5">
      <!-- 分类 Tab -->
      <Tabs v-model="activeTabKey" :tabs="categoryTabs" layout="text-only" active-bg="brand" />

      <!-- 空态：当前分类无评价 -->
      <EmptyState v-if="filteredCards.length === 0" message="暂无该行业的客户评价" class="mt-6" />

      <!-- 评价卡片列表 -->
      <ReviewCardGrid v-else title="" :cards="filteredCards" :columns="2" />
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import Tabs from '@/client/components/ui/Tabs.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import ReviewCardGrid from '@/client/components/business/ReviewCardGrid.vue'
import type { ReviewCard } from '@/client/components/business/ReviewCardGrid.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'
import {
  voicesPageSeo,
  voicesBannerSlide,
  VOICE_CATEGORY_TABS,
  INDUSTRY_KEY_MAP,
  REVIEW_CARDS,
} from './voicesData'

// ==================== SEO ====================

useHead({
  title: voicesPageSeo.title,
  meta: [
    {
      name: 'description',
      content: voicesPageSeo.description,
    },
  ],
})

// ==================== 状态 ====================

/** 分类 Tab 列表 */
const categoryTabs = VOICE_CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label }))

/** 当前选中的 Tab key */
const activeTabKey = ref('all')

/** 根据当前 Tab 筛选评价卡片 */
const filteredCards = computed<ReviewCard[]>(() => {
  if (activeTabKey.value === 'all') return REVIEW_CARDS
  const industryName = INDUSTRY_KEY_MAP[activeTabKey.value]
  return industryName ? REVIEW_CARDS.filter((card) => card.industry === industryName) : []
})
</script>
