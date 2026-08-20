<template>
  <SectionBlock spacing="default">
    <div class="mx-auto w-full" :style="containerStyle">
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
          class="mt-4 max-w-240 text-body text-text-tertiary leading-body max-lg:text-body"
        >
          {{ subtitle }}
        </p>
      </div>

      <template v-if="variant === 'image-card'">
        <div
          v-for="(row, rowIndex) in cardRows"
          :key="`row-${rowIndex}`"
          :class="[
            'grid gap-6 max-lg:gap-5',
            rowIndex === 0 ? 'mt-12 max-lg:mt-10' : 'mt-6',
            row.splitGroup ? 'lg:grid-cols-2' : getGridColsClass(row.cols),
          ]"
        >
          <!-- 新版式：单卡 + 双卡垂直排列（layout=feature-left / feature-right，行内 3 卡时生效） -->
          <template v-if="row.splitGroup">
            <article
              :class="[
                'group flex flex-col overflow-hidden rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-md:px-6',
                row.splitGroup.featureIndex === row.startIndex ? '' : 'lg:order-2',
              ]"
              :style="getImageCardStyle(row.splitGroup.featureIndex)"
            >
              <h3
                class="text-h2 font-bold leading-title whitespace-pre-line max-lg:text-h3"
                :style="getImageCardTitleStyle(row.splitGroup.featureIndex)"
              >
                {{ row.splitGroup.featureCard.title }}
              </h3>
              <p
                v-if="row.splitGroup.featureCard.description"
                class="mt-3 text-small text-text-secondary leading-small whitespace-pre-line"
              >
                {{ row.splitGroup.featureCard.description }}
              </p>
              <div
                v-if="row.splitGroup.featureCard.image"
                class="-mx-8 -mb-7 mt-6 flex flex-1 items-end overflow-hidden max-md:-mx-6"
              >
                <img
                  :src="getOSSImageUrl(row.splitGroup.featureCard.image, 600)"
                  :alt="row.splitGroup.featureCard.imageAlt ?? row.splitGroup.featureCard.title"
                  class="block w-full max-w-none object-contain rounded-b-card transition-transform duration-normal group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                  loading="lazy"
                />
              </div>
            </article>
            <div
              :class="[
                'flex flex-col gap-6 max-lg:gap-5',
                row.splitGroup.featureIndex === row.startIndex ? '' : 'lg:order-1',
              ]"
            >
              <article
                v-for="side in row.splitGroup.sideCards"
                :key="side.card.key ?? `${side.card.title}-${side.index}`"
                class="group flex h-[300px] flex-col overflow-hidden rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-md:px-6"
                :style="getImageCardStyle(side.index)"
              >
                <h3
                  class="text-h2 font-bold leading-title whitespace-pre-line max-lg:text-h3"
                  :style="getImageCardTitleStyle(side.index)"
                >
                  {{ side.card.title }}
                </h3>
                <p
                  v-if="side.card.description"
                  class="mt-3 text-small text-text-secondary leading-small whitespace-pre-line"
                >
                  {{ side.card.description }}
                </p>
                <div
                  v-if="side.card.image"
                  class="-mx-8 -mb-7 mt-auto flex-1 overflow-hidden max-md:-mx-6"
                >
                  <img
                    :src="getOSSImageUrl(side.card.image, 420)"
                    :alt="side.card.imageAlt ?? side.card.title"
                    class="block h-full w-full max-w-none object-contain rounded-b-card transition-transform duration-normal group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                    loading="lazy"
                  />
                </div>
              </article>
            </div>
          </template>

          <!-- 竖排卡片：上文下图（行内多列时使用） -->
          <template v-else-if="row.cols > 1">
            <article
              v-for="(card, cardIndex) in row.cards"
              :key="card.key ?? `${card.title}-${row.startIndex + cardIndex}`"
              class="group flex flex-col overflow-hidden rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-lg:min-h-84 max-md:px-6"
              :style="getImageCardStyle(row.startIndex + cardIndex)"
            >
              <h3
                class="text-h2 font-bold leading-title whitespace-pre-line max-lg:text-h3"
                :style="getImageCardTitleStyle(row.startIndex + cardIndex)"
              >
                {{ card.title }}
              </h3>
              <p
                v-if="card.description"
                class="mt-3 text-small text-text-secondary leading-small whitespace-pre-line"
              >
                {{ card.description }}
              </p>
              <div v-if="card.image" class="-mx-8 -mb-7 mt-6 overflow-hidden max-md:-mx-6">
                <img
                  :src="getOSSImageUrl(card.image, 400)"
                  :alt="card.imageAlt ?? card.title"
                  class="block w-full max-w-none object-contain rounded-b-card transition-transform duration-normal group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                  loading="lazy"
                />
              </div>
            </article>
          </template>

          <!-- 横排卡片：左文右图（image-card 且单列行时自动启用） -->
          <template v-else>
            <article
              v-for="(card, cardIndex) in row.cards"
              :key="card.key ?? `${card.title}-${row.startIndex + cardIndex}`"
              class="group flex items-stretch gap-8 overflow-hidden rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-lg:min-h-84 max-md:flex-col max-md:gap-5 max-md:px-6"
              :style="getImageCardStyle(row.startIndex + cardIndex)"
            >
              <div class="flex min-w-0 flex-1 flex-col justify-center">
                <h3
                  class="text-h2 font-bold leading-title whitespace-pre-line max-lg:text-h3"
                  :style="getImageCardTitleStyle(row.startIndex + cardIndex)"
                >
                  {{ card.title }}
                </h3>
                <p
                  v-if="card.description"
                  class="mt-3 text-small text-text-secondary leading-small whitespace-pre-line"
                >
                  {{ card.description }}
                </p>
              </div>
              <div
                v-if="card.image"
                class="-my-7 -mr-8 flex w-[600px] shrink-0 items-center justify-end overflow-hidden max-md:-mx-6 max-md:mb-[-1.75rem] max-md:mt-0 max-md:w-[calc(100%+3rem)]"
              >
                <img
                  :src="getOSSImageUrl(card.image, 600)"
                  :alt="card.imageAlt ?? card.title"
                  class="h-full max-h-full w-full object-contain object-right transition-transform duration-normal group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none max-md:h-auto max-md:object-center"
                  loading="lazy"
                />
              </div>
            </article>
          </template>
        </div>
      </template>

      <template v-else>
        <div
          v-for="(row, rowIndex) in cardRows"
          :key="`row-${rowIndex}`"
          :class="[
            'grid gap-6 max-lg:gap-5',
            rowIndex === 0 ? 'mt-14 max-lg:mt-10' : 'mt-6',
            getGridColsClass(row.cols),
          ]"
        >
          <article
            v-for="(card, cardIndex) in row.cards"
            :key="card.key ?? `${card.title}-${row.startIndex + cardIndex}`"
            :class="[
              'flex flex-col overflow-hidden rounded-[20px] border [background:var(--image-card-grid-panel-bg)] [border-color:var(--image-card-grid-panel-border)] [box-shadow:0_18px_44px_var(--image-card-grid-panel-shadow)] [color:var(--image-card-grid-panel-text)] transition-[transform,box-shadow] duration-normal hover:-translate-y-1 hover:[box-shadow:0_24px_54px_var(--image-card-grid-panel-shadow)] max-lg:min-h-140 max-md:min-h-125 max-md:rounded-card',
              isWideFeaturePanelCard(row.startIndex + cardIndex)
                ? 'col-span-full min-h-110 max-lg:min-h-125 max-md:min-h-115'
                : '',
            ]"
            :style="getPanelStyle(row.startIndex + cardIndex)"
          >
            <div
              class="flex items-center justify-between gap-5 px-[34px] pt-8 text-caption font-bold leading-none tracking-[0.08em] [color:var(--image-card-grid-panel-muted)] max-md:px-6 max-md:pt-[26px] max-md:text-small"
            >
              <span>{{ card.number ?? formatPanelNumber(row.startIndex + cardIndex) }}</span>
              <span>{{ card.module ?? title }}</span>
            </div>
            <div
              class="mx-[34px] mt-[15px] h-px [background:var(--image-card-grid-panel-divider)] max-md:mx-6 max-md:mt-[22px]"
            ></div>
            <div
              :class="[
                'px-[34px] pt-[27px] max-md:px-6 max-md:pt-7',
                isWideFeaturePanelCard(row.startIndex + cardIndex) ? 'pt-[30px]' : '',
              ]"
            >
              <h3
                :class="[
                  'm-0 text-[30px]  font-extrabold leading-1.16 whitespace-pre-line [color:var(--image-card-grid-panel-text)] max-lg:text-h1 max-md:text-[26px]',
                  isWideFeaturePanelCard(row.startIndex + cardIndex)
                    ? 'max-w-170 max-md:max-w-full'
                    : '',
                ]"
              >
                {{ card.title }}
              </h3>
              <p
                v-if="card.description"
                class="mt-2 text-[13px] leading-1.8 whitespace-pre-line [color:var(--image-card-grid-panel-muted)] max-md:mt-[18px] max-md:text-small"
              >
                {{ card.description }}
              </p>
            </div>
            <div
              v-if="card.visual?.type === 'conversion-funnel'"
              class="image-card-grid-funnel"
              :aria-label="card.visual.ariaLabel ?? card.imageAlt ?? card.title"
            >
              <div class="image-card-grid-funnel__headline">
                <span>{{ card.visual.headline }}</span>
              </div>
              <div class="image-card-grid-funnel__body">
                <div
                  v-for="stage in card.visual.stages"
                  :key="`${card.title}-${stage.label}`"
                  class="image-card-grid-funnel__stage"
                  :class="getFunnelStageClasses(stage)"
                  :style="getFunnelStageStyle(stage)"
                >
                  <span>{{ stage.label }}： {{ stage.value }}</span>
                </div>
              </div>
            </div>
            <img
              v-else-if="card.image"
              :src="getOSSImageUrl(card.image, isWideFeaturePanelCard(row.startIndex + cardIndex) ? 760 : 460)"
              :alt="card.imageAlt ?? card.title"
              :class="[
                'block h-auto w-full object-contain object-bottom mt-6',
                isWideFeaturePanelCard(row.startIndex + cardIndex)
                  ? 'max-h-80 max-md:max-h-70'
                  : '',
              ]"
              loading="lazy"
            />
          </article>
        </div>
      </template>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'
export interface ImageCardGridItem {
  key?: string
  title: string
  description?: string
  image?: string
  imageAlt?: string
  visual?: ImageCardGridVisual
  /** feature-panel 视觉中左上角序号，未传时按索引自动生成 01/02 */
  number?: string
  /** feature-panel 视觉中右上角所属模块 */
  module?: string
}

export type ImageCardGridFunnelStageShape = 'bar' | 'wide-trapezoid' | 'narrow-bar' | 'terminal'
export type ImageCardGridFunnelStageTone = 'blue' | 'sky' | 'cyan' | 'green'

export interface ImageCardGridFunnelStage {
  label: string
  value: string
  shape?: ImageCardGridFunnelStageShape
  tone?: ImageCardGridFunnelStageTone
  width?: number
}

export interface ImageCardGridFunnelVisual {
  type: 'conversion-funnel'
  headline: string
  ariaLabel?: string
  stages: readonly ImageCardGridFunnelStage[]
}

export type ImageCardGridVisual = ImageCardGridFunnelVisual

type ImageCardGridVariant = 'image-card' | 'feature-panel'
type ImageCardGridColorScheme = 'brand' | 'accent' | 'mint' | 'neutral' | 'clean' | 'gray'
/** 布局模式：grid 常规网格；feature-left 单卡居左 + 双卡垂直居右；feature-right 双卡垂直居左 + 单卡居右 */
type ImageCardGridLayout = 'grid' | 'feature-left' | 'feature-right'

interface CardRow {
  cards: readonly ImageCardGridItem[]
  cols: number
  startIndex: number
}

interface SplitSideCard {
  card: ImageCardGridItem
  index: number
}

interface SplitGroup {
  featureCard: ImageCardGridItem
  featureIndex: number
  sideCards: SplitSideCard[]
}

interface RenderCardRow extends CardRow {
  splitGroup: SplitGroup | null
}

const props = withDefaults(
  defineProps<{
    title: string
    titleHighlight?: string
    subtitle?: string
    cards: readonly ImageCardGridItem[]
    columns?: 2 | 3 | 4 | 5
    /** 每行列数配置，最大 3 行。如 [3, 2, 2] 第1行3列、第2行2列、第3行2列 */
    rows?: number[]
    variant?: ImageCardGridVariant
    colorScheme?: ImageCardGridColorScheme
    /** 布局模式，见 ImageCardGridLayout */
    layout?: ImageCardGridLayout
    /** 模块内容最大宽度（px），不传则使用 SectionBlock 默认宽度 */
    maxWidth?: number
  }>(),
  {
    columns: 3,
    variant: 'image-card',
    colorScheme: 'brand',
    layout: 'grid',
  },
)

const containerStyle = computed(() => (props.maxWidth ? { maxWidth: `${props.maxWidth}px` } : {}))

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

type ImageCardTone = {
  backgroundColor: string
  backgroundImage: string
  borderColor: string
  titleColor: string
}

const IMAGE_CARD_TONES: Record<ImageCardGridColorScheme, readonly ImageCardTone[]> = {
  brand: [
    {
      backgroundColor: '#fff6ef',
      backgroundImage: 'linear-gradient(135deg, #fff0e5 0%, #fffaf6 100%)',
      borderColor: 'rgba(255, 100, 0, 0.08)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#f6f3ff',
      backgroundImage: 'linear-gradient(135deg, #f0ecff 0%, #fbf9ff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.1)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#edfaff',
      backgroundImage: 'linear-gradient(135deg, #e7faff 0%, #f7fdff 100%)',
      borderColor: 'rgba(14, 165, 169, 0.1)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#fff8e8',
      backgroundImage: 'linear-gradient(135deg, #fff4d8 0%, #fffaf0 100%)',
      borderColor: 'rgba(245, 158, 11, 0.12)',
      titleColor: '#b45309',
    },
  ],
  accent: [
    {
      backgroundColor: '#f3f5ff',
      backgroundImage: 'linear-gradient(135deg, #edf0ff 0%, #fbfbff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.1)',
      titleColor: '#7c3aed',
    },
    {
      backgroundColor: '#fff4ee',
      backgroundImage: 'linear-gradient(135deg, #ffeceb 0%, #fff9f0 100%)',
      borderColor: 'rgba(255, 100, 0, 0.09)',
      titleColor: '#b45309',
    },
    {
      backgroundColor: '#eefbff',
      backgroundImage: 'linear-gradient(135deg, #e7faff 0%, #f6feff 100%)',
      borderColor: 'rgba(14, 165, 233, 0.1)',
      titleColor: '#0087b8',
    },
    {
      backgroundColor: '#f1fcf7',
      backgroundImage: 'linear-gradient(135deg, #e9fbf1 0%, #fbfffd 100%)',
      borderColor: 'rgba(16, 185, 129, 0.1)',
      titleColor: '#059669',
    },
  ],
  mint: [
    {
      backgroundColor: '#53df8e',
      backgroundImage: 'linear-gradient(135deg, #4adb85 0%, #57e49c 100%)',
      borderColor: 'rgba(16, 185, 129, 0.16)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#f5f2eb',
      backgroundImage: 'linear-gradient(135deg, #f5f2eb 0%, #fffdf8 100%)',
      borderColor: 'rgba(31, 35, 41, 0.08)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#e9e6f7',
      backgroundImage: 'linear-gradient(135deg, #e4e0f4 0%, #f4f1ff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.1)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#e7faff',
      backgroundImage: 'linear-gradient(135deg, #dcf7ff 0%, #f6feff 100%)',
      borderColor: 'rgba(14, 165, 233, 0.1)',
      titleColor: '#29241F',
    },
  ],
  neutral: [
    {
      backgroundColor: '#f6f8fb',
      backgroundImage: 'linear-gradient(135deg, #f2f5f9 0%, #fbfcfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#f7f6fb',
      backgroundImage: 'linear-gradient(135deg, #f2f0f8 0%, #fbfbfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#f5f9fa',
      backgroundImage: 'linear-gradient(135deg, #eff7f8 0%, #fbfefe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#29241F',
    },
  ],
  clean: [
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fffaf6 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#29241F',
    },
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f7fdff 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#29241F',
    },
  ],
  gray: [
    {
      backgroundColor: '#f6f6f6',
      backgroundImage: 'none',
      borderColor: 'rgba(31, 35, 41, 0.06)',
      titleColor: '#29241F',
    },
  ],
}

type PanelTone = {
  background: string
  borderColor: string
  textColor: string
  mutedColor: string
  dividerColor: string
  shadowColor: string
}

const PANEL_TONES: Record<ImageCardGridColorScheme, readonly PanelTone[]> = {
  brand: [
    {
      background: 'linear-gradient(180deg, #fff1e6 0%, #fff8f2 100%)',
      borderColor: 'rgba(255, 100, 0, 0.12)',
      textColor: '#29241F',
      mutedColor: '#6b5a50',
      dividerColor: 'rgba(255, 100, 0, 0.18)',
      shadowColor: 'rgba(255, 100, 0, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #f3f5ff 0%, #fbfbff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.12)',
      textColor: '#29241F',
      mutedColor: '#5d6475',
      dividerColor: 'rgba(91, 97, 255, 0.18)',
      shadowColor: 'rgba(91, 97, 255, 0.1)',
    },
    {
      background: 'linear-gradient(180deg, #eafcff 0%, #f8feff 100%)',
      borderColor: 'rgba(14, 165, 169, 0.12)',
      textColor: '#29241F',
      mutedColor: '#49636a',
      dividerColor: 'rgba(14, 165, 169, 0.18)',
      shadowColor: 'rgba(14, 165, 169, 0.1)',
    },
  ],
  accent: [
    {
      background: 'linear-gradient(180deg, #eef0ff 0%, #fafbff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.14)',
      textColor: '#29241F',
      mutedColor: '#596075',
      dividerColor: 'rgba(91, 97, 255, 0.2)',
      shadowColor: 'rgba(91, 97, 255, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #f5efff 0%, #fffaff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.14)',
      textColor: '#29241F',
      mutedColor: '#655a75',
      dividerColor: 'rgba(124, 92, 255, 0.2)',
      shadowColor: 'rgba(124, 92, 255, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #eef9ff 0%, #fbfeff 100%)',
      borderColor: 'rgba(37, 99, 235, 0.12)',
      textColor: '#29241F',
      mutedColor: '#53627a',
      dividerColor: 'rgba(37, 99, 235, 0.18)',
      shadowColor: 'rgba(37, 99, 235, 0.1)',
    },
  ],
  mint: [
    {
      background: 'linear-gradient(180deg, #4ade80 0%, #4ade80 100%)',
      borderColor: 'rgba(2, 44, 34, 0.12)',
      textColor: '#29241F',
      mutedColor: 'rgba(3, 23, 13, 0.72)',
      dividerColor: 'rgba(3, 23, 13, 0.16)',
      shadowColor: 'rgba(74, 222, 128, 0.24)',
    },
    {
      background: 'linear-gradient(180deg, #f5f2eb 0%, #fffdf8 100%)',
      borderColor: 'rgba(31, 35, 41, 0.1)',
      textColor: '#29241F',
      mutedColor: '#63615c',
      dividerColor: 'rgba(31, 35, 41, 0.14)',
      shadowColor: 'rgba(31, 35, 41, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #e9e6f7 0%, #f6f3ff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.1)',
      textColor: '#29241F',
      mutedColor: '#636071',
      dividerColor: 'rgba(124, 92, 255, 0.14)',
      shadowColor: 'rgba(124, 92, 255, 0.1)',
    },
  ],
  neutral: [
    {
      background: 'linear-gradient(180deg, #f5f7fb 0%, #ffffff 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#29241F',
      mutedColor: '#5f6b7a',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#29241F',
      mutedColor: '#606a78',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #f2f4f7 0%, #fbfcfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#29241F',
      mutedColor: '#667085',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
  ],
  clean: [
    {
      background: 'linear-gradient(180deg, #ffffff 0%, #fafbff 100%)',
      borderColor: 'rgba(15, 23, 42, 0.08)',
      textColor: '#29241F',
      mutedColor: '#646a73',
      dividerColor: 'rgba(15, 23, 42, 0.12)',
      shadowColor: 'rgba(15, 23, 42, 0.07)',
    },
  ],
  gray: [
    {
      background: '#f6f6f6',
      borderColor: 'rgba(31, 35, 41, 0.06)',
      textColor: '#29241F',
      mutedColor: '#646a73',
      dividerColor: 'rgba(31, 35, 41, 0.12)',
      shadowColor: 'rgba(15, 23, 42, 0.06)',
    },
  ],
}

const effectiveRows = computed(() => {
  if (props.rows && props.rows.length > 0) {
    return props.rows.slice(0, 3)
  }
  return []
})

const useMultiRow = computed(() => effectiveRows.value.length > 0)

/** 单卡 + 双卡垂直布局：仅 image-card 且行内恰 3 张卡片时生效 */
function getSplitGroup(row: CardRow): SplitGroup | null {
  if (props.layout === 'grid' || row.cols !== 3 || row.cards.length !== 3) return null
  if (props.layout === 'feature-left') {
    return {
      featureCard: row.cards[0]!,
      featureIndex: row.startIndex,
      sideCards: [
        { card: row.cards[1]!, index: row.startIndex + 1 },
        { card: row.cards[2]!, index: row.startIndex + 2 },
      ],
    }
  }
  return {
    featureCard: row.cards[2]!,
    featureIndex: row.startIndex + 2,
    sideCards: [
      { card: row.cards[0]!, index: row.startIndex },
      { card: row.cards[1]!, index: row.startIndex + 1 },
    ],
  }
}

/** 每行数据：多行模式按 rows 拆分，单行模式（向后兼容）整行为一个 row */
const cardRows = computed((): RenderCardRow[] => {
  const buildRow = (row: CardRow): RenderCardRow => ({ ...row, splitGroup: getSplitGroup(row) })
  if (useMultiRow.value) {
    const rows: RenderCardRow[] = []
    let start = 0
    for (const cols of effectiveRows.value) {
      const end = start + cols
      rows.push(buildRow({ cards: props.cards.slice(start, end), cols, startIndex: start }))
      start = end
    }
    return rows
  }
  // 向后兼容：未传 rows 时退化为单行，列数由 columns 控制
  return [buildRow({ cards: props.cards, cols: props.columns ?? 3, startIndex: 0 })]
})

function getGridColsClass(cols: number): string {
  if (cols === 1) return 'grid-cols-1'
  if (cols === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (cols === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  if (cols === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
}

const isWideFeaturePanelLayout = computed(
  () =>
    !useMultiRow.value &&
    props.variant === 'feature-panel' &&
    props.columns === 3 &&
    props.cards.length === 7,
)

function getImageCardTone(index: number): ImageCardTone {
  const palette = IMAGE_CARD_TONES[props.colorScheme]
  return palette[index % palette.length]!
}

function getImageCardStyle(index: number): CSSProperties {
  const tone = getImageCardTone(index)
  return {
    backgroundColor: tone.backgroundColor,
    backgroundImage: tone.backgroundImage,
    borderColor: tone.borderColor,
  }
}

function getImageCardTitleStyle(index: number): CSSProperties {
  return {
    color: getImageCardTone(index).titleColor,
  }
}

function getPanelTone(index: number): PanelTone {
  if (isWideFeaturePanelLayout.value && props.colorScheme === 'brand') {
    if (index === 3) {
      return {
        background: 'linear-gradient(180deg, #eefbf4 0%, #f8fdf9 100%)',
        borderColor: 'rgba(16, 185, 129, 0.12)',
        textColor: '#29241F',
        mutedColor: '#4f6b61',
        dividerColor: 'rgba(16, 185, 129, 0.16)',
        shadowColor: 'rgba(16, 185, 129, 0.1)',
      }
    }

    if (index === 5) {
      return {
        background: 'linear-gradient(180deg, #edf6ff 0%, #f8fbff 100%)',
        borderColor: 'rgba(59, 130, 246, 0.12)',
        textColor: '#29241F',
        mutedColor: '#53627a',
        dividerColor: 'rgba(59, 130, 246, 0.16)',
        shadowColor: 'rgba(59, 130, 246, 0.1)',
      }
    }

    if (index === 6) {
      return {
        background: 'linear-gradient(135deg, #fff1e6 0%, #f4f3ff 48%, #eefbff 100%)',
        borderColor: 'rgba(91, 97, 255, 0.12)',
        textColor: '#29241F',
        mutedColor: '#5e6d82',
        dividerColor: 'rgba(91, 97, 255, 0.18)',
        shadowColor: 'rgba(91, 97, 255, 0.12)',
      }
    }
  }

  const palette = PANEL_TONES[props.colorScheme]
  return palette[index % palette.length]!
}

function isWideFeaturePanelCard(index: number): boolean {
  return isWideFeaturePanelLayout.value && index === props.cards.length - 1
}

function getPanelStyle(index: number): CSSProperties {
  const tone = getPanelTone(index)
  return {
    '--image-card-grid-panel-bg': tone.background,
    '--image-card-grid-panel-border': tone.borderColor,
    '--image-card-grid-panel-text': tone.textColor,
    '--image-card-grid-panel-muted': tone.mutedColor,
    '--image-card-grid-panel-divider': tone.dividerColor,
    '--image-card-grid-panel-shadow': tone.shadowColor,
  }
}

function getFunnelStageClasses(stage: ImageCardGridFunnelStage): string[] {
  const classes = [
    `image-card-grid-funnel__stage--${stage.shape ?? 'bar'}`,
    `image-card-grid-funnel__stage--${stage.tone ?? 'blue'}`,
  ]
  if ((stage.width ?? 100) < 18) {
    classes.push('image-card-grid-funnel__stage--compact')
  }
  return classes
}

function getFunnelStageStyle(stage: ImageCardGridFunnelStage): CSSProperties {
  return {
    '--image-card-grid-funnel-stage-width': `${stage.width ?? 100}%`,
  } as CSSProperties
}

function formatPanelNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
</script>

<style scoped>
.image-card-grid-funnel {
  width: calc(100% - 32px);
  max-width: 640px;
  margin: 28px auto 30px;
  padding-top: 8px;
}

.image-card-grid-funnel__headline {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  border: 1px dashed rgba(255, 100, 0, 0.82);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow:
    0 12px 26px rgba(55, 99, 170, 0.1),
    inset 0 -10px 22px rgba(65, 113, 255, 0.06);
  text-align: center;
}

.image-card-grid-funnel__headline span {
  background: linear-gradient(90deg, #9b5cff 0%, #1677ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  white-space: nowrap;
}

.image-card-grid-funnel__body {
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-card-grid-funnel__stage {
  --image-card-grid-funnel-stage-bg: linear-gradient(180deg, #1f7ed7 0%, #1976d2 100%);
  --image-card-grid-funnel-stage-clip: inset(0 round 4px 4px 0 0);

  position: relative;
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  filter: drop-shadow(0 8px 16px rgba(24, 101, 202, 0.16));
}

.image-card-grid-funnel__stage + .image-card-grid-funnel__stage {
  margin-top: -1px;
}

.image-card-grid-funnel__stage::before,
.image-card-grid-funnel__stage::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: var(--image-card-grid-funnel-stage-width);
  clip-path: var(--image-card-grid-funnel-stage-clip);
}

.image-card-grid-funnel__stage::before {
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.94);
}

.image-card-grid-funnel__stage::after {
  top: 1.25px;
  bottom: 1.25px;
  width: max(calc(var(--image-card-grid-funnel-stage-width) - 2.5px), 24px);
  background: var(--image-card-grid-funnel-stage-bg);
}

.image-card-grid-funnel__stage span {
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 1px 5px rgba(15, 23, 42, 0.42);
}

.image-card-grid-funnel__stage--wide-trapezoid {
  --image-card-grid-funnel-stage-clip: polygon(0 0, 100% 0, 75% 100%, 25% 100%);
  height: 64px;
}

.image-card-grid-funnel__stage--narrow-bar {
  --image-card-grid-funnel-stage-clip: inset(0);
}

.image-card-grid-funnel__stage--terminal {
  --image-card-grid-funnel-stage-clip: polygon(0 0, 100% 0, 68% 100%, 32% 100%);
  height: 64px;
}

.image-card-grid-funnel__stage--blue {
  --image-card-grid-funnel-stage-bg: linear-gradient(180deg, #1f82db 0%, #1976d2 100%);
}

.image-card-grid-funnel__stage--sky {
  --image-card-grid-funnel-stage-bg: linear-gradient(180deg, #2da8ff 0%, #2495ee 100%);
}

.image-card-grid-funnel__stage--cyan {
  --image-card-grid-funnel-stage-bg: linear-gradient(180deg, #55baff 0%, #43a7ef 100%);
}

.image-card-grid-funnel__stage--green {
  --image-card-grid-funnel-stage-bg: linear-gradient(180deg, #08cc57 0%, #02ba4d 100%);
}

.image-card-grid-funnel__stage--compact span {
  padding: 5px 8px;
  border: 1px solid rgba(2, 186, 77, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 14px rgba(2, 186, 77, 0.16);
  color: #04723a;
  text-shadow: none;
}

@media (max-width: 767px) {
  .image-card-grid-funnel {
    width: calc(100% - 24px);
    margin-top: 24px;
    margin-bottom: 26px;
  }

  .image-card-grid-funnel__headline {
    min-height: 48px;
    padding: 9px 14px;
    border-radius: 16px;
  }

  .image-card-grid-funnel__headline span {
    font-size: 14px;
    white-space: normal;
  }

  .image-card-grid-funnel__body {
    margin-top: 26px;
  }

  .image-card-grid-funnel__stage {
    height: 48px;
  }

  .image-card-grid-funnel__stage--wide-trapezoid,
  .image-card-grid-funnel__stage--terminal {
    height: 56px;
  }

  .image-card-grid-funnel__stage span {
    font-size: 14px;
  }
}
</style>
