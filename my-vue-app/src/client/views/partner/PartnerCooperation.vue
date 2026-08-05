<template>
  <div class="partner-cooperation">
    <HeroBanner mode="single" :slides="[heroBannerSlide]" />

    <IconCardGrid
      :title="partnerTypeSection.title"
      :subtitle="partnerTypeSection.subtitle"
      :features="partnerTypeSection.features"
      :columns="3"
      variant="icon-badge-protruding"
      color-scheme="accent"
    />

    <FeatureList
      :title="partnerBenefitSection.title"
      :subtitle="partnerBenefitSection.subtitle"
      :cards="partnerBenefitSection.cards"
      :columns="3"
      variant="title-pill"
    />

    <FeatureList
      :title="whyChooseSection.title"
      :subtitle="whyChooseSection.subtitle"
      :cards="whyChooseSection.cards"
      :columns="3"
    />

    <FlowSteps :title="onboardingSection.title" :steps="onboardingSection.steps" variant="simple" />

    <SectionBlock id="partner-contact" class="scroll-mt-[92px]" spacing="default">
      <div class="flex flex-col items-center text-center">
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ contactSection.title }}
        </h2>
        <p class="mt-4 max-w-150 text-body text-text-secondary leading-body">
          {{ contactSection.subtitle }}
        </p>
      </div>

      <div class="mt-10 grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <a
          v-for="contact in contactSection.contacts"
          :key="contact.phone"
          class="group flex items-center justify-between gap-6 rounded-card border border-[#e7ddff] bg-[#fbf9ff] px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:border-[#c7b6ff] hover:shadow-subtle max-sm:flex-col max-sm:items-start"
          :href="`tel:${contact.phone}`"
        >
          <div class="flex items-center gap-4">
            <span
              class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ede7ff] text-ai-primary"
              aria-hidden="true"
            >
              <PhoneTelephone :size="22" :stroke-width="2.6" />
            </span>
            <span>
              <span class="block text-h3 text-text-primary leading-subtitle">
                {{ contact.name }}
              </span>
              <span class="mt-1 block text-small text-text-tertiary">渠道合作咨询</span>
            </span>
          </div>
          <span class="text-h3 font-semibold text-brand-accent leading-subtitle">
            {{ contact.phone }}
          </span>
        </a>
      </div>
    </SectionBlock>

    <SectionBlock spacing="default">
      <div
        class="rounded-large border border-[#e2dcff] bg-[linear-gradient(135deg,#fbf9ff_0%,#f3f6ff_52%,#fff8f1_100%)] px-8 py-16 text-center max-md:px-6 max-md:py-12"
      >
        <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
          {{ partnerQuerySection.title }}
        </h2>
        <p class="mt-4 text-body text-text-secondary leading-body">
          {{ partnerQuerySection.subtitle }}
        </p>

        <!-- 搜索栏 -->
        <div class="mx-auto mt-8 flex w-full max-w-160 items-center gap-3">
          <label
            class="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-pill border border-[#d8cffd] bg-white px-5 text-left shadow-subtle transition-colors duration-fast focus-within:border-ai-primary"
          >
            <Search class="shrink-0 text-ai-primary" :size="22" :stroke-width="2.4" />
            <span class="sr-only">{{ partnerQuerySection.subtitle }}</span>
            <input
              v-model="keyword"
              type="search"
              class="h-full min-w-0 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-tertiary"
              :placeholder="partnerQuerySection.placeholder"
              :disabled="queryState === 'loading'"
              @keyup.enter="handleSearch"
            />
          </label>
          <button
            class="inline-flex h-14 shrink-0 items-center gap-2 rounded-pill bg-brand-accent px-6 text-body font-semibold text-white shadow-button-accent transition-all duration-fast hover:bg-brand-accent-hover hover:shadow-button-accent-hover active:shadow-button-pressed disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!keyword.trim() || queryState === 'loading'"
            @click="handleSearch"
          >
            <span
              v-if="queryState === 'loading'"
              class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
            <span v-else>查询</span>
          </button>
        </div>

        <!-- 查询结果区域 -->
        <div v-if="queryState !== 'idle'" class="mt-10">
          <!-- 加载状态 -->
          <div v-if="queryState === 'loading'" class="flex items-center justify-center py-16">
            <span
              class="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-[#d8cffd] border-t-brand-accent"
              aria-hidden="true"
            />
            <span class="ml-3 text-body text-text-tertiary">查询中...</span>
          </div>

          <!-- 空结果 -->
          <div v-else-if="queryState === 'empty'" class="py-16 text-center">
            <div
              class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f0ff]"
            >
              <Search class="text-ai-primary" :size="28" :stroke-width="2.4" />
            </div>
            <p class="text-h3 text-text-primary">未找到相关合作伙伴信息</p>
            <p class="mt-2 text-small text-text-tertiary">请检查输入的企业名称或编号是否正确</p>
          </div>

          <!-- 查询失败 -->
          <div v-else-if="queryState === 'error'" class="py-16 text-center">
            <div
              class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fef2f2]"
            >
              <span class="text-3xl text-status-error" aria-hidden="true">!</span>
            </div>
            <p class="text-h3 text-text-primary">查询失败</p>
            <p class="mt-2 text-small text-text-tertiary">{{ errorMessage }}</p>
            <button
              class="mt-6 inline-flex h-10 items-center rounded-pill bg-brand-accent px-6 text-small font-semibold text-white shadow-button-accent transition-all duration-fast hover:bg-brand-accent-hover"
              @click="handleSearch"
            >
              重新查询
            </button>
          </div>

          <!-- 查询成功 — 结果表格 -->
          <div v-else-if="queryState === 'success'" class="text-left">
            <p class="mb-4 text-small text-text-tertiary">
              共找到
              <span class="font-semibold text-text-primary">{{ resultList.length }}</span> 条结果
            </p>

            <!-- 桌面端表格 -->
            <div class="hidden overflow-hidden rounded-card border border-[#e2dcff] md:block">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-[#e2dcff] bg-[#fbf9ff]">
                    <th class="px-6 py-4 text-left text-small font-semibold text-text-secondary">
                      伙伴名称
                    </th>
                    <th class="px-6 py-4 text-left text-small font-semibold text-text-secondary">
                      合作开始日期
                    </th>
                    <th class="px-6 py-4 text-left text-small font-semibold text-text-secondary">
                      合作结束日期
                    </th>
                    <th class="px-6 py-4 text-left text-small font-semibold text-text-secondary">
                      状态
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in resultList"
                    :key="index"
                    class="border-b border-[#f0ecff] bg-white transition-colors duration-fast last:border-b-0 hover:bg-[#fbf9ff]"
                  >
                    <td class="px-6 py-4 text-body text-text-primary">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 text-body text-text-secondary">
                      {{ item.startDate }}
                    </td>
                    <td class="px-6 py-4 text-body text-text-secondary">
                      {{ item.endDate }}
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-block rounded-pill px-3 py-1 text-small font-medium"
                        :class="getStatusClass(item.status)"
                      >
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 移动端卡片列表 -->
            <div class="space-y-4 md:hidden">
              <div
                v-for="(item, index) in resultList"
                :key="index"
                class="rounded-card border border-[#e2dcff] bg-white p-5"
              >
                <div class="flex items-start justify-between gap-3">
                  <span class="text-body font-semibold text-text-primary">{{ item.name }}</span>
                  <span
                    class="inline-block shrink-0 rounded-pill px-3 py-0.5 text-small font-medium"
                    :class="getStatusClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>
                <div class="mt-3 space-y-1.5 text-small text-text-secondary">
                  <div class="flex justify-between">
                    <span class="text-text-tertiary">合作开始</span>
                    <span>{{ item.startDate }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-text-tertiary">合作结束</span>
                    <span>{{ item.endDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'
import { PhoneTelephone, Search } from '@icon-park/vue-next'
import HeroBanner from '@/client/components/business/HeroBanner.vue'
import IconCardGrid from '@/client/components/business/IconCardGrid.vue'
import FeatureList from '@/client/components/business/FeatureList.vue'
import FlowSteps from '@/client/components/business/FlowSteps.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { queryPartner, type PartnerInfo } from '@/shared/api/partner'
import {
  contactSection,
  heroBannerSlide,
  onboardingSection,
  partnerBenefitSection,
  partnerCooperationSeo,
  partnerQuerySection,
  partnerTypeSection,
  whyChooseSection,
} from './partnerCooperationData'

useHead({
  title: partnerCooperationSeo.title,
  meta: [
    {
      name: 'description',
      content: partnerCooperationSeo.description,
    },
  ],
})

// ==================== 查询状态管理 ====================

type QueryState = 'idle' | 'loading' | 'success' | 'empty' | 'error'

const keyword = ref('')
const queryState = ref<QueryState>('idle')
const errorMessage = ref('')
const resultList = ref<PartnerInfo[]>([])

/**
 * 执行合作伙伴查询
 */
async function handleSearch() {
  const trimmed = keyword.value.trim()
  if (!trimmed) return

  queryState.value = 'loading'
  errorMessage.value = ''
  resultList.value = []

  try {
    const result = await queryPartner({ keyword: trimmed })
    if (result.list.length === 0) {
      queryState.value = 'empty'
    } else {
      resultList.value = result.list
      queryState.value = 'success'
    }
  } catch (err: unknown) {
    queryState.value = 'error'
    errorMessage.value =
      typeof err === 'string'
        ? err
        : (err as { message?: string })?.message || '网络异常，请稍后重试'
  }
}

/**
 * 状态标签样式映射
 *
 * 根据状态文本返回对应的 Tailwind 类名：
 * - 有效 / 正常 → 绿色
 * - 无效 / 已过期 / 已终止 → 灰色
 * - 待审核 / 审核中 → 橙色
 * - 其他 → 蓝色（默认）
 */
function getStatusClass(status: string): string {
  const normalized = status.trim()
  if (/有效|正常|进行中|合作中/.test(normalized)) {
    return 'bg-status-success-soft text-status-success'
  }
  if (/无效|过期|终止|已结束|取消/.test(normalized)) {
    return 'bg-[#f3f4f6] text-text-tertiary'
  }
  if (/待审核|审核中|待确认/.test(normalized)) {
    return 'bg-status-warning-soft text-status-warning'
  }
  return 'bg-status-info-soft text-status-info'
}

// ==================== 页面级滚动锁定 ====================

const scrollLockClass = 'partner-cooperation-scroll-lock'

onMounted(() => {
  document.body.classList.add(scrollLockClass)
})

onUnmounted(() => {
  document.body.classList.remove(scrollLockClass)
})
</script>

<style>
body.partner-cooperation-scroll-lock {
  overflow-y: hidden;
}
</style>
