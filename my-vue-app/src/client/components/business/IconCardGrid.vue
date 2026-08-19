<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <h2
        class="text-[36px] text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3"
      >
        <template v-if="titleParts">
          {{ titleParts.before
          }}<span
            :class="[
              'business-section-title-highlight',
              titleParts.isShort ? 'business-section-title-highlight--short' : '',
            ]"
            :data-text="titleParts.highlight"
          >
            {{ titleParts.highlight }}</span
          >{{ titleParts.after }}
        </template>
        <template v-else>
          {{ title }}
        </template>
      </h2>
      <p
        v-if="subtitle"
        class="mt-4 max-w-150 text-body text-text-tertiary leading-body max-lg:text-body"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- 顶部图片区域（可选） -->
    <div
      v-if="topImages && topImages.length > 0"
      class="mt-10 grid grid-cols-2 gap-8 max-lg:grid-cols-1 max-lg:gap-6"
    >
      <img
        v-for="(img, index) in topImages"
        :key="index"
        :src="img.src"
        :alt="img.alt ?? ''"
        class="w-full h-auto rounded-card border border-border-subtle shadow-subtle"
      />
    </div>

    <!-- 分隔线 -->
    <hr v-if="topImages && topImages.length > 0" class="mt-10 border-0 h-px bg-border-subtle" />

    <!-- ===== 变体：capability-card（图标 + 多段说明 + 底部预览） ===== -->
    <div
      v-if="variant === 'capability-card'"
      :class="['mt-14 grid gap-6 max-lg:mt-10 max-lg:gap-5', capabilityGridColsClass]"
    >
      <article
        v-for="(feature, index) in features"
        :key="feature.key ?? `${feature.title}-${index}`"
        class="group flex min-h-130 flex-col overflow-hidden rounded-[20px] border px-[22px] py-8 text-left transition-[transform,border-color,box-shadow] duration-normal [background:var(--icon-card-grid-capability-card-bg)] [border-color:var(--icon-card-grid-capability-border)] hover:-translate-y-1 hover:[border-color:var(--icon-card-grid-capability-accent)] hover:shadow-subtle max-xl:min-h-125 max-lg:min-h-120 max-md:min-h-0 max-md:px-6"
        :style="getCapabilityCardStyle(index)"
      >
        <div
          v-if="feature.iconImage || feature.icon"
          class="flex h-18 w-18 items-center justify-center rounded-[18px] [background:var(--icon-card-grid-capability-icon-bg)] [color:var(--icon-card-grid-capability-accent)]"
        >
          <img
            v-if="feature.iconImage"
            :src="feature.iconImage"
            :alt="feature.iconAlt ?? feature.title"
            class="h-11 w-11 object-contain"
            loading="lazy"
          />
          <component
            v-else-if="feature.icon"
            :is="feature.icon"
            :size="38"
            :stroke-width="2.4"
            aria-hidden="true"
          />
        </div>

        <h3 class="mt-5 text-h2 font-bold leading-title text-text-primary max-lg:text-h3">
          {{ feature.title }}
        </h3>
        <p
          v-if="feature.intro"
          class="mt-2 text-[15px] leading-body text-text-tertiary whitespace-pre-line"
        >
          {{ feature.intro }}
        </p>
        <p
          v-if="feature.description"
          class="mt-5 text-[15px] leading-1.8 text-text-secondary whitespace-pre-line"
        >
          {{ feature.description }}
        </p>

        <div class="mt-auto pt-8">
          <div class="capability-preview">
            <div
              v-if="getCapabilityPreviewType(feature, index) === 'customer-list'"
              class="preview-list"
            >
              <div class="preview-row">
                <div class="preview-avatar">张</div>
                <span class="preview-name">张建国</span>
                <span class="preview-status preview-status--hot">高意向</span>
              </div>
              <div class="preview-row">
                <div class="preview-avatar preview-avatar--blue">李</div>
                <span class="preview-name">李明华</span>
                <span class="preview-status preview-status--active">跟进中</span>
              </div>
              <div class="preview-row">
                <div class="preview-avatar preview-avatar--green">王</div>
                <span class="preview-name">王淑芬</span>
                <span class="preview-status preview-status--active">新线索</span>
              </div>
            </div>

            <template v-else-if="getCapabilityPreviewType(feature, index) === 'funnel'">
              <div class="preview-funnel-chart">
                <div class="funnel-bar-v funnel-bar-v--primary">
                  <span class="bar-label">1284</span>
                </div>
                <div class="funnel-bar-v funnel-bar-v--secondary">
                  <span class="bar-label">926</span>
                </div>
                <div class="funnel-bar-v funnel-bar-v--tertiary">
                  <span class="bar-label">617</span>
                </div>
                <div class="funnel-bar-v funnel-bar-v--blue">
                  <span class="bar-label">359</span>
                </div>
              </div>
              <div class="preview-axis-labels">
                <span>线索</span>
                <span>商机</span>
                <span>意向</span>
                <span>成交</span>
              </div>
            </template>

            <template v-else-if="getCapabilityPreviewType(feature, index) === 'tags'">
              <div class="preview-tags">
                <span class="mkt-tag mkt-tag--highlight">广告投放</span>
                <span class="mkt-tag">内容营销</span>
                <span class="mkt-tag">活动管理</span>
                <span class="mkt-tag mkt-tag--highlight">SEO优化</span>
                <span class="mkt-tag">社群运营</span>
                <span class="mkt-tag">邮件营销</span>
              </div>
              <div class="preview-metric">
                本月获客 <strong>1,284</strong> 条，转化率 <strong>28%</strong>
              </div>
            </template>

            <div
              v-else-if="getCapabilityPreviewType(feature, index) === 'chart'"
              class="preview-chart-bars"
            >
              <div class="chart-bar chart-bar--subtle-35"></div>
              <div class="chart-bar chart-bar--mid-55"></div>
              <div class="chart-bar chart-bar--subtle-45"></div>
              <div class="chart-bar chart-bar--primary-75"></div>
              <div class="chart-bar chart-bar--secondary-65"></div>
              <div class="chart-bar chart-bar--primary-90"></div>
            </div>

            <template v-else>
              <div class="preview-flow">
                <div class="flow-node flow-node--start">提交</div>
                <span class="flow-arrow">→</span>
                <div class="flow-node">审批</div>
                <span class="flow-arrow">→</span>
                <div class="flow-node">执行</div>
                <span class="flow-arrow">→</span>
                <div class="flow-node flow-node--end">完成</div>
              </div>
              <div class="preview-flow-note">审批流程平均耗时 <strong>1.2 小时</strong></div>
            </template>
          </div>
        </div>
      </article>
    </div>

    <!-- ===== 变体：icon-tile（图标方块 + 标题下置） ===== -->
    <div
      v-if="variant === 'icon-tile'"
      :class="['mt-12 grid gap-6 max-lg:mt-10 max-lg:gap-5', tileGridColsClass]"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="flex flex-col items-center text-center"
      >
        <div
          :class="[
            'flex w-full max-w-50 aspect-square items-center justify-center p-3',
            colorScheme === 'clean'
              ? 'bg-transparent shadow-none'
              : 'bg-surface-primary shadow-subtle',
          ]"
        >
          <div class="flex h-full w-full items-center justify-center" :style="getTileStyle(index)">
            <img
              v-if="feature.image"
              :src="feature.image"
              :alt="feature.imageAlt ?? feature.title"
              :class="[
                'max-h-[72%] object-contain',
                colorScheme === 'clean' ? 'max-w-[60%]' : 'max-w-[72%]',
              ]"
              loading="lazy"
            />
            <component
              :is="feature.icon"
              v-else-if="feature.icon"
              :size="64"
              theme="outline"
              :stroke-width="2.6"
              aria-hidden="true"
            />
          </div>
        </div>
        <h3
          class="mt-6 text-h2 text-text-primary leading-subtitle whitespace-pre-line max-lg:text-h3"
        >
          {{ feature.title }}
        </h3>
        <p
          v-if="feature.description"
          class="mt-2 max-w-64 text-small text-text-secondary leading-small whitespace-pre-line"
        >
          {{ feature.description }}
        </p>
      </div>
    </div>

    <!-- ===== 变体：icon-badge-protruding（凸出式徽章） ===== -->
    <div
      v-if="variant === 'icon-badge-protruding'"
      :class="['mt-12 grid gap-8 max-lg:mt-10 max-lg:gap-6', protrudingGridColsClass]"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="relative rounded-card border border-border-subtle bg-surface-primary p-6 pt-8 shadow-subtle"
      >
        <!-- 凸出 Badge -->
        <div
          class="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full"
          :class="getBadgeBg(index)"
        >
          <component
            :is="feature.icon"
            v-if="feature.icon"
            :size="24"
            class="text-white"
            :stroke-width="3"
          />
        </div>
        <h3 class="text-h3 text-text-primary leading-subtitle whitespace-pre-line max-lg:text-body">
          {{ feature.title }}
        </h3>
        <p class="mt-2 text-small text-text-secondary leading-small">
          {{ feature.description }}
        </p>
      </div>
    </div>

    <!-- ===== 其他变体：icon-badge / plain / accent-strip ===== -->
    <CardGrid
      v-if="
        variant !== 'capability-card' &&
        variant !== 'icon-badge-protruding' &&
        variant !== 'icon-tile'
      "
      :cols="columns"
      :gap="columns === 2 ? 'loose' : 'default'"
      class="mt-12"
    >
      <Card v-for="(feature, index) in features" :key="index" variant="default">
        <!-- 变体：彩色顶部强调线 -->
        <div
          v-if="variant === 'accent-strip'"
          class="-mx-6 -mt-6 mb-4 h-1 rounded-t-card"
          :style="{ backgroundColor: feature.accentColor ?? themeColor }"
        />

        <div class="flex flex-col gap-3">
          <!-- 变体：IconBadge + 标题同行 -->
          <div v-if="variant === 'icon-badge' && feature.icon" class="flex items-center gap-3">
            <IconBadge size="md" :variant="iconBadgeVariant" v-slot="{ iconSizeClass }">
              <component
                :is="feature.icon"
                :class="iconSizeClass"
                class="text-white"
                :stroke-width="2.2"
              />
            </IconBadge>
            <h3
              class="text-h3 text-text-primary leading-subtitle whitespace-pre-line max-lg:text-body"
            >
              {{ feature.title }}
            </h3>
          </div>

          <!-- 变体：纯文字标题（默认 / icon-badge 无图标时回退） -->
          <h3
            v-else
            class="text-h3 text-text-primary leading-subtitle whitespace-pre-line max-lg:text-body"
          >
            {{ feature.title }}
          </h3>

          <p
            :class="[
              'text-small text-text-secondary leading-small',
              variant === 'icon-badge' && feature.icon ? 'ml-11' : '',
            ]"
          >
            {{ feature.description }}
          </p>
        </div>
      </Card>
    </CardGrid>

    <div v-if="ctaText && ctaHref" class="mt-12 flex justify-center max-lg:mt-10">
      <UiButton :href="ctaHref" variant="hero" :color="ctaButtonColor" size="lg">
        {{ ctaText }}
      </UiButton>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component, CSSProperties } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import Card from '@/client/components/ui/Card.vue'
import IconBadge from '@/client/components/ui/IconBadge.vue'
import UiButton from '@/client/components/ui/Button.vue'

type CapabilityPreviewType = 'customer-list' | 'funnel' | 'tags' | 'chart' | 'flow'

/** 能力卡片项 */
export interface FeatureItem {
  key?: string
  title: string
  description: string
  /** 图标组件（IconCardGrid variant="icon-badge" | "icon-badge-protruding" 时使用） */
  icon?: Component
  /** capability-card 视觉中的图标图片路径 */
  iconImage?: string
  /** capability-card 视觉中的图标图片 alt 文本 */
  iconAlt?: string
  /** 图片路径（IconCardGrid variant="icon-tile" 时使用） */
  image?: string
  /** 图片图标 alt 文本 */
  imageAlt?: string
  /** capability-card 视觉中标题下方的短描述 */
  intro?: string
  /** capability-card 视觉中的底部轻量预览类型，不传时按卡片顺序自动匹配 */
  previewType?: CapabilityPreviewType
  /** 强调色，覆盖 IconCardGrid colorScheme 默认值（variant="accent-strip" 时使用） */
  accentColor?: string
}

/** 顶部图片 */
export interface TopImage {
  src: string
  alt?: string
}

/** 卡片视觉风格（扁平化，无幽灵组合） */
type CardVariant =
  | 'plain'
  | 'icon-badge'
  | 'icon-badge-protruding'
  | 'accent-strip'
  | 'icon-tile'
  | 'capability-card'
/** 色彩方案（所有变体一致生效） */
type ColorScheme = 'brand' | 'accent' | 'neutral' | 'clean'

const props = withDefaults(
  defineProps<{
    title: string
    titleHighlight?: string
    subtitle?: string
    topImages?: readonly TopImage[]
    features: readonly FeatureItem[]
    columns?: 2 | 3 | 4 | 5 | 7
    /** 视觉风格 */
    variant?: CardVariant
    /** 色彩方案：brand（品牌橙）| accent（蓝紫）| neutral（中性灰）| clean（无底色图标） */
    colorScheme?: ColorScheme
    /** 可选 CTA 文案 */
    ctaText?: string
    /** 可选 CTA 链接 */
    ctaHref?: string
  }>(),
  {
    columns: 4,
    variant: 'plain',
    colorScheme: 'brand',
  },
)

/** 强调色（来自 colorScheme 映射） */
const themeColor = computed(() => {
  const map: Record<ColorScheme, string> = {
    brand: '#ff6400',
    accent: '#5b61ff',
    neutral: '#86909c',
    clean: '#ff6400',
  }
  return map[props.colorScheme]
})

const titleParts = computed(() => {
  const highlight = props.titleHighlight?.trim()
  if (!highlight) return null

  const index = props.title.indexOf(highlight)
  if (index < 0) return null

  return {
    //取高亮文字前面的文字
    before: props.title.slice(0, index),
    highlight,
    //取高亮后面的文字
    after: props.title.slice(index + highlight.length),
    //高亮文字是否较短，长度小于等于 2 个字符时使用短下划线样式
    isShort: highlight.length <= 2,
  }
})

/** IconBadge 变体（来自 colorScheme 映射） */
const iconBadgeVariant = computed(() => {
  const map: Record<ColorScheme, 'gradient' | 'accent' | 'neutral'> = {
    brand: 'gradient',
    accent: 'accent',
    neutral: 'neutral',
    clean: 'gradient',
  }
  return map[props.colorScheme]
})

/** protruding 变体的 Badge 背景色板（按 colorScheme 区分） */
const BADGE_PALETTES: Record<ColorScheme, readonly string[]> = {
  brand: [
    'bg-fs-icon-orange',
    'bg-fs-icon-amber',
    'bg-fs-icon-green',
    'bg-fs-icon-teal',
    'bg-fs-icon-purple',
  ],
  accent: [
    'bg-fs-icon-blue',
    'bg-fs-icon-indigo',
    'bg-fs-icon-purple',
    'bg-fs-icon-teal',
    'bg-fs-icon-sky',
  ],
  neutral: [
    'bg-fs-icon-slate',
    'bg-fs-icon-plain',
    'bg-fs-icon-slate',
    'bg-fs-icon-plain',
    'bg-fs-icon-slate',
  ],
  clean: [
    'bg-fs-icon-orange',
    'bg-fs-icon-amber',
    'bg-fs-icon-green',
    'bg-fs-icon-teal',
    'bg-fs-icon-purple',
  ],
}

function getBadgeBg(index: number): string {
  const palette = BADGE_PALETTES[props.colorScheme]
  return palette[index % palette.length]!
}

type CapabilityTone = {
  cardBackground: string
  iconBackground: string
  imageBackground: string
  borderColor: string
  accentColor: string
}

const CAPABILITY_CARD_TONES: Record<ColorScheme, readonly CapabilityTone[]> = {
  brand: [
    {
      cardBackground: '#ffffff',
      iconBackground: '#eaf3ff',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#3b82f6',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#eef7ff',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#1687d9',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#e6fbf6',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#079b96',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#f1edff',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#6352cf',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#fff4df',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#d96b00',
    },
  ],
  accent: [
    {
      cardBackground: '#ffffff',
      iconBackground: '#edf2ff',
      imageBackground: '#f7f8fc',
      borderColor: '#e3e7f1',
      accentColor: '#5b61ff',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#eef6ff',
      imageBackground: '#f7f8fc',
      borderColor: '#e3e7f1',
      accentColor: '#2f80ed',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#e9fbf7',
      imageBackground: '#f7f8fc',
      borderColor: '#e3e7f1',
      accentColor: '#0f9f9b',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#f0edff',
      imageBackground: '#f7f8fc',
      borderColor: '#e3e7f1',
      accentColor: '#6d5bd0',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#fff4e4',
      imageBackground: '#f7f8fc',
      borderColor: '#e3e7f1',
      accentColor: '#e36b00',
    },
  ],
  neutral: [
    {
      cardBackground: '#ffffff',
      iconBackground: '#f2f5f9',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#475569',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#edf2ff',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#5b61ff',
    },
    {
      cardBackground: '#ffffff',
      iconBackground: '#e9fbf7',
      imageBackground: '#f6f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#0f9f9b',
    },
  ],
  clean: [
    {
      cardBackground: '#ffffff',
      iconBackground: '#f5f7fb',
      imageBackground: '#f7f8fb',
      borderColor: '#e5e8f0',
      accentColor: '#5b61ff',
    },
  ],
}

function getCapabilityTone(index: number): CapabilityTone {
  const palette = CAPABILITY_CARD_TONES[props.colorScheme]
  return palette[index % palette.length]!
}

function getCapabilityCardStyle(index: number): CSSProperties {
  const tone = getCapabilityTone(index)
  return {
    '--icon-card-grid-capability-card-bg': tone.cardBackground,
    '--icon-card-grid-capability-icon-bg': tone.iconBackground,
    '--icon-card-grid-capability-image-bg': tone.imageBackground,
    '--icon-card-grid-capability-border': tone.borderColor,
    '--icon-card-grid-capability-accent': tone.accentColor,
  } as CSSProperties
}

const DEFAULT_CAPABILITY_PREVIEW_TYPES: readonly CapabilityPreviewType[] = [
  'customer-list',
  'funnel',
  'tags',
  'chart',
  'flow',
]

function getCapabilityPreviewType(feature: FeatureItem, index: number): CapabilityPreviewType {
  return (
    feature.previewType ??
    DEFAULT_CAPABILITY_PREVIEW_TYPES[index % DEFAULT_CAPABILITY_PREVIEW_TYPES.length]!
  )
}

const TILE_COLORS: Record<ColorScheme, readonly { bg: string; color: string }[]> = {
  brand: [
    { bg: '#fff2e8', color: '#ff6400' },
    { bg: '#fff7ed', color: '#f59e0b' },
    { bg: '#fef3f2', color: '#e55a00' },
    { bg: '#f8f5fb', color: '#ff6400' },
    { bg: '#fffaf0', color: '#f59e0b' },
  ],
  accent: [
    { bg: '#eaf6ff', color: '#2563eb' },
    { bg: '#eef4ff', color: '#4a7fd9' },
    { bg: '#eef9f2', color: '#0ea5a9' },
    { bg: '#f7efff', color: '#6366f1' },
    { bg: '#fffaf0', color: '#64748b' },
  ],
  neutral: [
    { bg: '#f4f7fb', color: '#64748b' },
    { bg: '#f7f8fa', color: '#1f2329' },
    { bg: '#f1f5f9', color: '#64748b' },
    { bg: '#f8fafc', color: '#1f2329' },
    { bg: '#f6f6fb', color: '#64748b' },
  ],
  clean: [
    { bg: 'transparent', color: '#ff6400' },
    { bg: 'transparent', color: '#f59e0b' },
    { bg: 'transparent', color: '#e55a00' },
    { bg: 'transparent', color: '#ff6400' },
    { bg: 'transparent', color: '#f59e0b' },
  ],
}

function getTileStyle(index: number): { backgroundColor: string; color: string } {
  const palette = TILE_COLORS[props.colorScheme]
  const color = palette[index % palette.length]!
  return {
    backgroundColor: color.bg,
    color: color.color,
  }
}

const ctaButtonColor = computed<'brand' | 'accent'>(() => {
  return props.colorScheme === 'accent' ? 'accent' : 'brand'
})

const capabilityGridColsClass = computed(() => {
  if (props.columns === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (props.columns === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (props.columns === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  if (props.columns === 7) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})

const tileGridColsClass = computed(() => {
  if (props.columns === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (props.columns === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (props.columns === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
  if (props.columns === 7) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})

const protrudingGridColsClass = computed(() => {
  if (props.columns === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (props.columns === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (props.columns === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
  if (props.columns === 7) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})
</script>

<style scoped>
.capability-preview {
  min-height: 120px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #f2f3f5;
  border-radius: 12px;
  background: var(--icon-card-grid-capability-image-bg);
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border: 1px solid #f2f3f5;
  border-radius: 6px;
  background: #ffffff;
}

.preview-avatar {
  width: 22px;
  height: 22px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0eeff;
  color: var(--icon-card-grid-capability-accent);
  font-size: 9px;
  font-weight: 700;
}

.preview-avatar--blue {
  background: #e8f3ff;
  color: #378add;
}

.preview-avatar--green {
  background: #f6ffed;
  color: #389e0d;
}

.preview-name {
  min-width: 0;
  flex: 1;
  color: #1d2129;
  font-size: 11px;
  font-weight: 600;
}

.preview-status {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 100px;
  font-size: 9px;
  font-weight: 600;
}

.preview-status--hot {
  background: #fff7e6;
  color: #d46b08;
}

.preview-status--active {
  background: #f0eeff;
  color: var(--icon-card-grid-capability-accent);
}

.preview-funnel-chart {
  height: 70px;
  padding-top: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
}

.funnel-bar-v {
  width: 24px;
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  border-radius: 4px 4px 0 0;
}

.funnel-bar-v--primary {
  height: 80%;
  background: var(--icon-card-grid-capability-accent);
}

.funnel-bar-v--secondary {
  height: 62%;
  background: #6b5fd9;
}

.funnel-bar-v--tertiary {
  height: 42%;
  background: #8b82e3;
}

.funnel-bar-v--blue {
  height: 24%;
  background: #378add;
}

.bar-label {
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
}

.preview-axis-labels {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 10px;
  color: #86909c;
  font-size: 9px;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.mkt-tag {
  padding: 3px 8px;
  border: 1px solid #f2f3f5;
  border-radius: 100px;
  background: #ffffff;
  color: #4e5969;
  font-size: 10px;
  font-weight: 500;
}

.mkt-tag--highlight {
  border-color: #f0eeff;
  background: #f0eeff;
  color: var(--icon-card-grid-capability-accent);
}

.preview-metric {
  margin-top: 10px;
  padding: 5px 8px;
  border: 1px solid #f2f3f5;
  border-radius: 6px;
  background: #ffffff;
  color: #4e5969;
  font-size: 10px;
}

.preview-metric strong,
.preview-flow-note strong {
  color: var(--icon-card-grid-capability-accent);
  font-weight: 700;
}

.preview-chart-bars {
  height: 60px;
  padding: 8px 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 4px;
}

.chart-bar {
  min-width: 12px;
  flex: 1;
  border-radius: 4px 4px 0 0;
}

.chart-bar--subtle-35 {
  height: 35%;
  background: #f0eeff;
}

.chart-bar--mid-55 {
  height: 55%;
  background: #d4d0f7;
}

.chart-bar--subtle-45 {
  height: 45%;
  background: #f0eeff;
}

.chart-bar--primary-75 {
  height: 75%;
  background: var(--icon-card-grid-capability-accent);
}

.chart-bar--secondary-65 {
  height: 65%;
  background: #6b5fd9;
}

.chart-bar--primary-90 {
  height: 90%;
  background: var(--icon-card-grid-capability-accent);
}

.preview-flow {
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.flow-node {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  background: #ffffff;
  color: #4e5969;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.flow-node--start {
  border-color: var(--icon-card-grid-capability-accent);
  background: #f0eeff;
  color: var(--icon-card-grid-capability-accent);
}

.flow-node--end {
  border-color: #00b42a;
  background: #f6ffed;
  color: #00b42a;
}

.flow-arrow {
  color: #86909c;
  font-size: 12px;
}

.preview-flow-note {
  margin-top: 8px;
  text-align: center;
  color: #86909c;
  font-size: 10px;
}

@media (max-width: 640px) {
  .capability-preview {
    padding: 14px;
  }

  .preview-flow {
    gap: 2px;
  }

  .flow-node {
    padding-inline: 8px;
  }
}
</style>
