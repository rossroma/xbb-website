<!--
  复用度：高（业务场景组件）
  可复用场景：客户评价、用户口碑、案例反馈等评价展示场景

  支持两种布局：
    - 双列（默认）：桌面端 2 列网格，移动端自动切换为 1 列
    - 单列：始终 1 列，适合内容较长的评价

  评价内容支持展开/收起：
    - 默认截断 3 行，内容较长时显示「展开全部」按钮
    - 点击展开后显示完整内容，按钮变为「收起」
    - 双列布局使用 CSS Grid 自然流式布局，展开卡片不影响同行其他卡片
-->
<template>
  <SectionBlock :spacing="title ? 'default' : 'none'">
    <SectionHeading v-if="title" :title="title" :subtitle="subtitle" align="center" />

    <div
      :class="[
        'grid gap-6',
        title ? 'mt-14 max-lg:mt-10 max-md:mt-8' : 'mt-5',
        columns === 1 ? 'grid-cols-1' : 'grid-cols-2 max-md:grid-cols-1',
      ]"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        :class="[
          'group relative flex flex-col rounded-card border border-border-subtle bg-surface-primary p-6 shadow-subtle',
          'transition-all duration-normal ease',
          'hover:-translate-y-1 hover:shadow-card-hover',
          'motion-reduce:transition-none motion-reduce:transform-none',
          'max-lg:p-5 max-md:p-4',
        ]"
      >
        <!-- 顶部品牌 Logo：绝对定位脱离文档流，圆形徽章，仅顶部凸出卡片 -->
        <img
          :src="card.logo"
          :alt="card.logoAlt ?? card.industry"
          class="absolute left-6 -top-6 z-10 h-25 w-25 rounded-full border border-border-subtle bg-surface-primary object-cover shadow-prominent"
          loading="lazy"
        />
        <!-- 行业标签：自然高度右对齐，不参与 logo 占位 -->
        <div class="flex items-center justify-end">
          <span
            class="inline-flex shrink-0 items-center rounded-pill bg-brand-primary-soft px-3 py-1 text-caption font-medium text-brand-primary"
          >
            {{ card.industry }}
          </span>
        </div>

        <!-- 分隔线（避开顶部圆形 logo 占位） -->
        <div class="my-4 ml-29 border-t border-border-subtle max-md:my-3" />

        <!-- 评价内容（文本右移避开 logo） -->
        <div class="ml-29 flex-1">
          <p
            :ref="(el) => setContentRef(index, el)"
            :class="[
              'text-body text-text-secondary leading-body',
              !isExpanded(index) ? 'line-clamp-3' : '',
            ]"
          >
            {{ card.content }}
          </p>

          <!-- 展开/收起按钮（内容较长时显示） -->
          <button
            v-if="needsExpand(index)"
            class="mt-2 inline-flex items-center gap-1 text-small text-brand-primary font-medium transition-colors duration-fast ease hover:text-brand-primary-hover motion-reduce:transition-none"
            @click="toggleExpand(index)"
          >
            <span>{{ isExpanded(index) ? '收起' : '展开全部' }}</span>
            <component :is="isExpanded(index) ? UpIcon : DownIcon" :size="14" :stroke-width="3" />
          </button>
        </div>

        <!-- 底部：用户名 + 星级评分 -->
        <div class="mt-4 flex items-center justify-between gap-3 max-md:mt-3">
          <span class="text-body font-semibold text-text-primary">{{ card.username }}</span>
          <div class="flex items-center gap-0.5">
            <StarFill v-for="star in 5" :key="star" :size="16" class="text-brand-primary" />
          </div>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { StarFill, Down, Up } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

/** 用户评价卡片数据 */
export interface ReviewCard {
  /** 品牌 logo 图片 URL */
  logo: string
  /** logo alt 文本，默认取 industry */
  logoAlt?: string
  /** 所属行业 */
  industry: string
  /** 评价内容 */
  content: string
  /** 评价用户名称 */
  username: string
  /** 评价日期（如 "2026年4月17日"） */
  date?: string
  /** 点赞数 */
  likes?: number
  /** 星级评分（1-5） */
  rating: number
}

const props = withDefaults(
  defineProps<{
    /** 区块标题 */
    title?: string
    /** 区块副标题 */
    subtitle?: string
    /** 评价卡片数据列表 */
    cards: ReviewCard[]
    /** 布局列数：1（单列）| 2（双列，默认） */
    columns?: 1 | 2
  }>(),
  {
    columns: 2,
  },
)

const DownIcon = Down
const UpIcon = Up

/** 展开状态 */
const expandedState = reactive<Record<number, boolean>>({})

/** 内容元素引用（用于判断是否需要展开按钮） */
const contentRefs = reactive<Record<number, HTMLElement | null>>({})

function setContentRef(index: number, el: unknown): void {
  contentRefs[index] = el as HTMLElement | null
}

function isExpanded(index: number): boolean {
  return !!expandedState[index]
}

function toggleExpand(index: number): void {
  expandedState[index] = !expandedState[index]
}

/** 判断是否需要显示展开按钮（内容超过 120 字符） */
function needsExpand(index: number): boolean {
  const card = props.cards[index]
  return card ? card.content.length > 120 : false
}
</script>
