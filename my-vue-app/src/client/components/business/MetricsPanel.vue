<!--
  复用度：高（通用组件）
  可复用场景：首页数据展示、企业实力展示、SaaS 平台数据驾驶舱等需要展示统计指标的场景
-->
<template>
  <SectionBlock spacing="compact" :width="variant === 'detail' ? 'default' : 'narrow'">
    <!-- 标题区 -->
    <h2 class="text-center text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-4 text-center text-body text-text-secondary leading-body">
      {{ subtitle }}
    </p>

    <!-- 指标卡片网格 -->
    <div
      :class="['relative mt-7 overflow-hidden', variant === 'detail' ? 'px-0 py-0' : 'px-6 py-5']"
    >
      <div class="relative z-10">
        <CardGrid :cols="columns" gap="loose">
          <template v-if="variant === 'default'">
            <MetricItem
              v-for="m in metrics"
              :key="m.label"
              :value="m.value"
              :unit="m.unit"
              :label="m.label"
              :highlighted="m.highlighted"
            />
          </template>
          <template v-else>
            <article
              v-for="m in metrics"
              :key="m.label"
              class="min-h-48 rounded-card border border-transparent bg-surface-primary px-7 py-6 text-left shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
            >
              <strong class="inline-flex items-end gap-1">
                <span
                  class="text-[46px] font-bold leading-none tracking-normal bg-metrics-gradient bg-clip-text text-transparent max-md:text-metrics-unit"
                >
                  {{ m.value }}
                </span>
                <span
                  v-if="m.unit"
                  class="text-[28px] font-bold leading-none bg-metrics-gradient bg-clip-text text-transparent max-md:text-[22px]"
                >
                  {{ m.unit }}
                </span>
              </strong>
              <h3 class="mt-5 text-h3 font-semibold text-text-primary leading-subtitle">
                {{ m.label }}
              </h3>
              <p v-if="m.description" class="mt-3 text-body text-text-secondary leading-body">
                {{ m.description }}
              </p>
            </article>
          </template>
        </CardGrid>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import MetricItem from '@/client/components/ui/MetricItem.vue'

interface Metric {
  value: string
  label: string
  unit?: string
  description?: string
  /** 是否高亮背景（蓝色渐变），默认 false */
  highlighted?: boolean
}

withDefaults(
  defineProps<{
    title: string
    /** 副标题（选填），来自 DataDashboard */
    subtitle?: string
    metrics: Metric[]
    /** 网格列数，默认 4 */
    columns?: 3 | 4
    /** default 为紧凑指标，detail 为大数字 + 标题 + 描述卡片 */
    variant?: 'default' | 'detail'
  }>(),
  {
    columns: 4,
    variant: 'default',
  },
)
</script>
