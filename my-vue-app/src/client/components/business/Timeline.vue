<!--
  复用度：中（业务场景组件）
  可复用场景：公司发展历程、产品迭代时间线、项目里程碑、品牌历史等需要按时间线展示阶段性信息的场景
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题区 -->
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-4 max-w-2xl text-body text-text-secondary leading-body">
        {{ subtitle }}
      </p>
    </div>

    <!-- 时间线 -->
    <div class="relative mt-14 max-lg:mt-10">
      <!-- 中央垂直分割线（桌面端）/ 左侧分割线（移动端） -->
      <div
        class="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2 bg-border-default max-lg:left-4"
        aria-hidden="true"
      />

      <div class="flex flex-col gap-14 max-lg:gap-10">
        <div
          v-for="(milestone, index) in milestones"
          :key="index"
          class="relative flex items-start"
          :class="[index % 2 === 0 ? 'justify-start' : 'justify-end', 'max-lg:justify-start']"
        >
          <!-- ===== 内容区（桌面端左右交替，移动端全右） ===== -->
          <div
            class="w-1/2 max-lg:w-full"
            :class="
              index % 2 === 0
                ? 'pr-16 text-right max-lg:pr-0 max-lg:pl-12 max-lg:text-left'
                : 'pl-16 text-left max-lg:pl-12'
            "
          >
            <!-- 年份 -->
            <div
              class="text-display font-bold leading-none text-brand-primary max-lg:text-h1"
              :style="{ fontFamily: 'inherit' }"
            >
              {{ milestone.year }}
            </div>

            <!-- 标题 -->
            <h3 class="mt-3 text-h3 text-text-primary leading-subtitle max-lg:text-h3">
              {{ milestone.title }}
            </h3>

            <!-- 描述（支持高亮文本段） -->
            <p class="mt-3 text-body text-text-secondary leading-body">
              <template v-for="(seg, segIdx) in milestone.description" :key="segIdx">
                <span v-if="typeof seg === 'string'" class="text-text-secondary">{{ seg }}</span>
                <span v-else-if="seg.highlight" class="text-brand-primary font-semibold">{{
                  seg.text
                }}</span>
                <span v-else class="text-text-secondary">{{ seg.text }}</span>
              </template>
            </p>
          </div>

          <!-- ===== 时间线圆点 ===== -->
          <div
            class="absolute left-1/2 top-2 w-3.5 h-3.5 rounded-full bg-brand-primary -translate-x-1/2 ring-4 ring-surface-primary max-lg:left-4"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'

/** 高亮文本段 */
interface TimelineSegment {
  /** 文本内容 */
  text: string
  /** 是否高亮（品牌橙色） */
  highlight?: boolean
}

/** 单个里程碑节点 */
interface TimelineMilestone {
  /** 年份，如 "2017" */
  year: string
  /** 阶段标题 */
  title: string
  /** 描述文本，支持纯文本与高亮标记混合（如 ["产品正式发布，", { text: "首年付费客户突破 1000 家", highlight: true }]） */
  description: readonly (string | TimelineSegment)[]
}

defineProps<{
  /** 区域标题，如 "发展历程" */
  title: string
  /** 区域副标题（可选） */
  subtitle?: string
  /** 里程碑列表（建议 3-4 个） */
  milestones: readonly TimelineMilestone[]
}>()
</script>
