<!--
  复用度：高（业务场景组件）
  可复用场景：客户案例、产品列表、资源展示、图文功能等卡片网格场景

  支持两种布局：
    - vertical（默认）：垂直卡片网格，图片在上 → 内容在下
    - horizontal：水平图文排列，图片在左 → 文字在右

  支持四种展示形态：
    - case（案例展示）：图片 4:3，Tag 在内容区，品牌色
    - product（产品列表）：图片 3:2，Tag 在内容区，强调色，浅灰底
    - resource（资源展示）：图片 16:10，含描述 + 底部链接按钮
    - square（正方形卡片）：卡片 1:1，图片 4:3，标题 + 描述（2行）
    - address（地址卡片）：地图图片在上，地址标题与详情居中展示

  支持圆角开关：
    - rounded（默认 true）：开启圆角（rounded-card）
    - rounded=false：关闭圆角（rounded-none）
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题 + 副标题 -->
    <SectionHeading v-if="title" :title="title" :subtitle="subtitle" align="center" />

    <!-- ===== 布局：vertical（垂直卡片网格） ===== -->
    <div
      v-if="layout === 'vertical'"
      :class="[
        'mt-14 grid gap-6 max-lg:mt-10 max-lg:gap-5 max-md:mt-8 max-md:gap-4',
        gridColsClass,
      ]"
    >
      <component
        :is="card.linkHref ? 'a' : 'div'"
        v-for="(card, index) in cards"
        :key="index"
        :href="card.linkHref"
        :class="[
          'group flex flex-col overflow-hidden',
          variant === 'address'
            ? 'border border-transparent bg-surface-primary shadow-[0_10px_28px_rgba(15,23,42,0.08)]'
            : 'border border-border-subtle',
          rounded ? 'rounded-card' : 'rounded-none',
          'transition-all duration-normal ease',
          variant === 'address'
            ? 'hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,23,42,0.12)]'
            : 'hover:-translate-y-1 hover:shadow-card-hover',
          'motion-reduce:transition-none motion-reduce:transform-none',
          card.linkHref ? 'cursor-pointer' : '',
          cardBgClass,
          variant === 'square' ? 'aspect-square' : '',
        ]"
        :role="card.linkHref || variant === 'address' ? undefined : 'button'"
        :tabindex="card.linkHref || variant === 'address' ? undefined : 0"
        @keydown="(e: KeyboardEvent) => handleCardKeydown(e, card)"
        @click="!card.linkHref && variant !== 'address' && $emit('cardClick', card.title)"
      >
        <!-- 封面图片 -->
        <div
          :class="[
            'relative overflow-hidden',
            variant === 'address' ? 'bg-surface-primary p-4 pb-0' : imageAspectClass,
          ]"
        >
          <img
            :src="card.image"
            :alt="card.imageAlt ?? card.title"
            :class="[
              'block w-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none',
              variant === 'address' ? 'aspect-[321/136]' : 'h-full',
            ]"
            loading="lazy"
          />
        </div>

        <!-- 内容区 -->
        <div
          :class="[
            'flex flex-1 flex-col',
            variant === 'address'
              ? 'items-center px-6 pb-9 pt-7 text-center max-lg:px-5 max-lg:pb-8 max-md:px-4'
              : 'p-6 max-lg:p-5 max-md:p-4',
          ]"
        >
          <!-- Tag 标签（case/product 变体） -->
          <span
            v-if="variant !== 'resource' && variant !== 'square' && card.tag"
            :class="[
              'inline-flex w-fit items-center rounded-pill px-3 py-1 text-caption font-medium',
              tagColorClass(),
            ]"
          >
            {{ card.tag }}
          </span>

          <!-- 标题 -->
          <h3
            :class="[
              'text-h3 text-text-primary leading-subtitle max-lg:text-h3 max-md:text-body',
              card.linkHref
                ? 'transition-colors duration-fast ease group-hover:text-brand-primary'
                : '',
              variant !== 'resource' && variant !== 'square' && card.tag ? 'mt-3' : '',
              variant === 'address' ? 'font-medium text-brand-primary' : '',
            ]"
          >
            {{ card.title }}
          </h3>

          <!-- 描述（resource/address 变体） -->
          <p
            v-if="(variant === 'resource' || variant === 'address') && card.description"
            :class="[
              'mt-3 text-small text-text-secondary leading-small',
              variant === 'address'
                ? 'max-w-68 text-body leading-body text-[#536583] max-md:text-small'
                : '',
            ]"
          >
            {{ card.description }}
          </p>

          <!-- 描述（square 变体，始终显示 2 行） -->
          <p
            v-if="variant === 'square' && card.description"
            class="mt-2 text-small text-text-secondary leading-small line-clamp-2"
          >
            {{ card.description }}
          </p>

          <!-- 链接按钮（resource 变体） -->
          <div v-if="variant === 'resource'" class="mt-auto pt-5">
            <a
              :href="card.linkHref ?? 'javascript:void(0)'"
              class="inline-flex items-center gap-1.5 text-small text-text-secondary font-medium transition-all duration-fast ease group-hover:text-brand-primary motion-reduce:transition-none"
              @click.prevent="!card.linkHref && $emit('cardClick', card.title)"
            >
              <span>{{ card.linkText ?? '了解详情' }}</span>
              <component
                :is="RightIcon"
                :stroke-width="3"
                class="w-4 h-4 transition-transform duration-fast ease group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </a>
          </div>
        </div>
      </component>
    </div>

    <!-- ===== 布局：horizontal（水平图文排列） ===== -->
    <div
      v-if="layout === 'horizontal'"
      :class="[
        'mt-14 grid gap-6 max-lg:mt-10 max-md:mt-8',
        effectiveColumns === 1 ? 'grid-cols-1' : 'grid-cols-2 max-lg:grid-cols-1',
      ]"
    >
      <component
        :is="card.linkHref ? 'a' : 'div'"
        v-for="card in cards"
        :key="card.title"
        :href="card.linkHref"
        :class="[
          'group grid overflow-hidden',
          rounded ? 'rounded-card' : 'rounded-none',
          card.linkHref ? 'cursor-pointer' : '',
          effectiveColumns === 1 ? 'grid-cols-[1fr_3fr]' : 'grid-cols-[2fr_3fr]',
          'max-md:grid-cols-1',
        ]"
      >
        <!-- 图片区域 -->
        <div :class="['overflow-hidden aspect-[16/10]', effectiveColumns === 1 ? 'max-h-44' : '']">
          <img
            :src="card.image"
            :alt="card.imageAlt ?? card.title"
            class="block h-full w-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
            loading="lazy"
          />
        </div>

        <!-- 文字区域 -->
        <div
          :class="[
            'flex flex-col justify-center',
            effectiveColumns === 1 ? 'px-6 py-5' : 'p-8 max-lg:p-6',
            'max-md:p-5',
          ]"
        >
          <!-- 标签 -->
          <span
            v-if="card.tag"
            class="self-start inline-flex items-center rounded-pill px-3 py-1 text-caption font-medium bg-brand-primary-soft text-brand-primary"
          >
            {{ card.tag }}
          </span>

          <!-- 标题 -->
          <h3
            :class="[
              'text-h3 text-text-primary leading-subtitle line-clamp-2',
              effectiveColumns === 2 ? 'min-h-[2lh]' : '',
              card.linkHref
                ? 'transition-colors duration-fast ease group-hover:text-brand-primary'
                : '',
              card.tag ? 'mt-3' : '',
            ]"
          >
            {{ card.title }}
          </h3>

          <!-- 文章摘要（仅单列模式） -->
          <p
            v-if="effectiveColumns === 1 && card.description"
            class="mt-3 text-body text-text-secondary leading-body line-clamp-2"
          >
            {{ card.description }}
          </p>

          <!-- 发布时间 -->
          <time
            v-if="card.publishDate"
            :datetime="card.publishDate"
            :class="[
              'text-small text-text-tertiary',
              effectiveColumns === 1 && card.description ? 'mt-3' : 'mt-4',
            ]"
          >
            {{ card.publishDate }}
          </time>
        </div>
      </component>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Right } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

/** 图文内容卡片数据 */
export interface ContentCard {
  /** 封面图片 URL */
  image: string
  /** 图片 alt 文本，默认取 title */
  imageAlt?: string
  /** 卡片标题 */
  title: string
  /** 标签文字（case/product 可选，resource 不使用） */
  tag?: string
  /** 描述文字（resource 变体 / horizontal 单列模式使用） */
  description?: string
  /** 链接按钮文案（resource 变体使用，默认「了解详情」） */
  linkText?: string
  /** 发布时间（horizontal 布局使用） */
  publishDate?: string
  /** 链接地址，为空时不渲染链接，改为触发 cardClick 事件 */
  linkHref?: string
}

/** 卡片展示形态 */
type CardVariant = 'case' | 'product' | 'resource' | 'square' | 'address'
/** 卡片布局方向 */
type CardLayout = 'vertical' | 'horizontal'

const props = withDefaults(
  defineProps<{
    /** 区块标题 */
    title?: string
    /** 区块副标题 */
    subtitle?: string
    /** 卡片数据列表 */
    cards: ContentCard[]
    /** 展示形态：case（案例）| product（产品）| resource（资源）| square（正方形） */
    variant?: CardVariant
    /** 布局方向：vertical（默认）| horizontal */
    layout?: CardLayout
    /** 网格列数（vertical=3/4/5，horizontal=1/2） */
    columns?: 1 | 2 | 3 | 4 | 5
    /** 是否开启圆角（默认 true） */
    rounded?: boolean
  }>(),
  {
    variant: 'case',
    layout: 'vertical',
    columns: 4,
    rounded: true,
  },
)

const emit = defineEmits<{
  /** 卡片点击（linkHref 为空时触发） */
  cardClick: [title: string]
}>()

const RightIcon = Right

/** 图片比例类名，按 variant 映射 */
const imageAspectMap: Record<CardVariant, string> = {
  case: 'aspect-[4/3]',
  product: 'aspect-[3/2]',
  resource: 'aspect-[16/10]',
  square: 'aspect-[4/3]',
  address: 'aspect-[321/136]',
}

const imageAspectClass = computed(() => imageAspectMap[props.variant])

/** 卡片背景色 */
const cardBgMap: Record<CardVariant, string> = {
  case: 'bg-surface-primary',
  product: 'bg-surface-secondary',
  resource: 'bg-surface-secondary',
  square: 'bg-surface-primary',
  address: 'bg-surface-primary',
}

const cardBgClass = computed(() => cardBgMap[props.variant])

/** Tag 颜色 */
const defaultTagColorMap: Record<CardVariant, string> = {
  case: 'bg-brand-primary-soft text-brand-primary',
  product: 'bg-brand-accent-soft text-brand-accent',
  resource: '',
  square: '',
  address: '',
}

function tagColorClass(): string {
  return defaultTagColorMap[props.variant]
}

/** 修正后的有效列数（horizontal 布局下强制上限为 2） */
const effectiveColumns = computed(() => {
  if (props.layout === 'horizontal' && props.columns > 2) {
    if (import.meta.env.DEV) {
      console.warn(
        `[ContentCardGrid] horizontal 布局下 columns 仅支持 1/2，当前值 ${props.columns} 已强制为 2`,
      )
    }
    return 2
  }
  return props.columns
})

/** 响应式网格列数（vertical 布局） */
const gridColsClass = computed(() => {
  if (props.layout === 'horizontal') return ''
  const cols = effectiveColumns.value
  if (cols === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  if (cols === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
})

/** 键盘事件处理：Enter/Space 触发卡片点击 */
function handleCardKeydown(e: KeyboardEvent, card: ContentCard): void {
  if (props.variant === 'address') return
  if (card.linkHref) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('cardClick', card.title)
  }
}
</script>
