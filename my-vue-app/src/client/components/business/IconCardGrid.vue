<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
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

    <!-- ===== 变体：icon-tile（图标方块 + 标题下置） ===== -->
    <div
      v-if="variant === 'icon-tile'"
      :class="['mt-14 grid gap-6 max-lg:mt-10 max-lg:gap-5', tileGridColsClass]"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="flex flex-col items-center text-center"
      >
        <div
          class="flex w-full max-w-50 aspect-square items-center justify-center bg-surface-primary p-3 shadow-subtle"
        >
          <div class="flex h-full w-full items-center justify-center" :style="getTileStyle(index)">
            <component
              :is="feature.icon"
              v-if="feature.icon"
              :size="64"
              theme="outline"
              :stroke-width="2.6"
              aria-hidden="true"
            />
          </div>
        </div>
        <h3 class="mt-6 text-h2 text-text-primary leading-subtitle max-lg:text-h3">
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
      :class="['mt-14 grid gap-8 max-lg:mt-10 max-lg:gap-6', protrudingGridColsClass]"
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
        <h3 class="text-h3 text-text-primary leading-subtitle max-lg:text-body">
          {{ feature.title }}
        </h3>
        <p class="mt-2 text-small text-text-secondary leading-small">
          {{ feature.description }}
        </p>
      </div>
    </div>

    <!-- ===== 其他变体：icon-badge / plain / accent-strip ===== -->
    <CardGrid
      v-if="variant !== 'icon-badge-protruding' && variant !== 'icon-tile'"
      :cols="columns"
      :gap="columns === 2 ? 'loose' : 'default'"
      :class="gridMarginClass"
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
            <h3 class="text-h3 text-text-primary leading-subtitle max-lg:text-body">
              {{ feature.title }}
            </h3>
          </div>

          <!-- 变体：纯文字标题（默认 / icon-badge 无图标时回退） -->
          <h3 v-else class="text-h3 text-text-primary leading-subtitle max-lg:text-body">
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
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import Card from '@/client/components/ui/Card.vue'
import IconBadge from '@/client/components/ui/IconBadge.vue'

/** 能力卡片项 */
export interface FeatureItem {
  title: string
  description: string
  /** IconPark 图标组件（IconCardGrid variant="icon-badge" | "icon-badge-protruding" 时使用） */
  icon?: Component
  /** 强调色，覆盖 IconCardGrid colorScheme 默认值（variant="accent-strip" 时使用） */
  accentColor?: string
}

/** 顶部图片 */
export interface TopImage {
  src: string
  alt?: string
}

/** 卡片视觉风格（扁平化，无幽灵组合） */
type CardVariant = 'plain' | 'icon-badge' | 'icon-badge-protruding' | 'accent-strip' | 'icon-tile'
/** 色彩方案（所有变体一致生效） */
type ColorScheme = 'brand' | 'accent' | 'neutral'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    topImages?: readonly TopImage[]
    features: readonly FeatureItem[]
    columns?: 2 | 3 | 4 | 5 | 7
    /** 视觉风格 */
    variant?: CardVariant
    /** 色彩方案：brand（品牌橙）| accent（蓝紫）| neutral（中性灰） */
    colorScheme?: ColorScheme
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
  }
  return map[props.colorScheme]
})

/** IconBadge 变体（来自 colorScheme 映射） */
const iconBadgeVariant = computed(() => {
  const map: Record<ColorScheme, 'gradient' | 'accent' | 'neutral'> = {
    brand: 'gradient',
    accent: 'accent',
    neutral: 'neutral',
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
}

function getBadgeBg(index: number): string {
  const palette = BADGE_PALETTES[props.colorScheme]
  return palette[index % palette.length]!
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
}

function getTileStyle(index: number): { backgroundColor: string; color: string } {
  const palette = TILE_COLORS[props.colorScheme]
  const color = palette[index % palette.length]!
  return {
    backgroundColor: color.bg,
    color: color.color,
  }
}

const gridMarginClass = computed(() => {
  return 'mt-10'
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
