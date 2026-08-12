<template>
  <SectionBlock spacing="default">
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
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

    <div
      v-if="variant === 'image-card'"
      :class="['mt-14 grid gap-6 max-lg:mt-10 max-lg:gap-5', gridColsClass]"
    >
      <article
        v-for="(card, index) in cards"
        :key="card.key ?? `${card.title}-${index}`"
        class="group flex flex-col overflow-visible rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-lg:min-h-84 max-md:px-6"
        :style="getImageCardStyle(index)"
      >
        <h3
          class="text-h2 font-bold leading-title whitespace-pre-line max-lg:text-h3"
          :style="getImageCardTitleStyle(index)"
        >
          {{ card.title }}
        </h3>
        <p
          v-if="card.description"
          class="mt-3 text-small text-text-secondary leading-small whitespace-pre-line"
        >
          {{ card.description }}
        </p>
        <div v-if="card.image" class="-mx-8 -mb-7 mt-2 overflow-visible max-md:-mx-6">
          <img
            :src="getOSSImageUrl(card.image, 350)"
            :alt="card.imageAlt ?? card.title"
            class="block w-full max-w-none object-contain transition-transform duration-normal group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
            loading="lazy"
          />
        </div>
      </article>
    </div>

    <div v-else :class="['mt-14 grid gap-6 max-lg:mt-10 max-lg:gap-5', gridColsClass]">
      <article
        v-for="(card, index) in cards"
        :key="card.key ?? `${card.title}-${index}`"
        :class="[
          'image-card-grid-panel',
          isWideFeaturePanelCard(index) ? 'image-card-grid-panel--wide col-span-full' : '',
        ]"
        :style="getPanelStyle(index)"
      >
        <div class="image-card-grid-panel__meta">
          <span>{{ card.number ?? formatPanelNumber(index) }}</span>
          <span>{{ card.module ?? title }}</span>
        </div>
        <div class="image-card-grid-panel__divider"></div>
        <div class="image-card-grid-panel__content">
          <h3>{{ card.title }}</h3>
          <p v-if="card.description">{{ card.description }}</p>
        </div>
        <div v-if="card.image" class="image-card-grid-panel__image">
          <img :src="getOSSImageUrl(card.image, 500)" :alt="card.imageAlt ?? card.title" loading="lazy" />
        </div>
      </article>
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
  /** feature-panel 视觉中左上角序号，未传时按索引自动生成 01/02 */
  number?: string
  /** feature-panel 视觉中右上角所属模块 */
  module?: string
}

type ImageCardGridVariant = 'image-card' | 'feature-panel'
type ImageCardGridColorScheme = 'brand' | 'accent' | 'mint' | 'neutral' | 'clean'

const props = withDefaults(
  defineProps<{
    title: string
    titleHighlight?: string
    subtitle?: string
    cards: readonly ImageCardGridItem[]
    columns?: 2 | 3 | 4
    variant?: ImageCardGridVariant
    colorScheme?: ImageCardGridColorScheme
  }>(),
  {
    columns: 3,
    variant: 'image-card',
    colorScheme: 'brand',
  },
)

const titleParts = computed(() => {
  const highlight = props.titleHighlight?.trim()
  if (!highlight) return null

  const index = props.title.indexOf(highlight)
  if (index < 0) return null

  return {
    before: props.title.slice(0, index),
    highlight,
    after: props.title.slice(index + highlight.length),
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
      titleColor: '#ff6400',
    },
    {
      backgroundColor: '#f6f3ff',
      backgroundImage: 'linear-gradient(135deg, #f0ecff 0%, #fbf9ff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.1)',
      titleColor: '#7c5cff',
    },
    {
      backgroundColor: '#edfaff',
      backgroundImage: 'linear-gradient(135deg, #e7faff 0%, #f7fdff 100%)',
      borderColor: 'rgba(14, 165, 169, 0.1)',
      titleColor: '#0087b8',
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
      titleColor: '#062515',
    },
    {
      backgroundColor: '#f5f2eb',
      backgroundImage: 'linear-gradient(135deg, #f5f2eb 0%, #fffdf8 100%)',
      borderColor: 'rgba(31, 35, 41, 0.08)',
      titleColor: '#101418',
    },
    {
      backgroundColor: '#e9e6f7',
      backgroundImage: 'linear-gradient(135deg, #e4e0f4 0%, #f4f1ff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.1)',
      titleColor: '#111827',
    },
    {
      backgroundColor: '#e7faff',
      backgroundImage: 'linear-gradient(135deg, #dcf7ff 0%, #f6feff 100%)',
      borderColor: 'rgba(14, 165, 233, 0.1)',
      titleColor: '#0f172a',
    },
  ],
  neutral: [
    {
      backgroundColor: '#f6f8fb',
      backgroundImage: 'linear-gradient(135deg, #f2f5f9 0%, #fbfcfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#475569',
    },
    {
      backgroundColor: '#f7f6fb',
      backgroundImage: 'linear-gradient(135deg, #f2f0f8 0%, #fbfbfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#4b5563',
    },
    {
      backgroundColor: '#f5f9fa',
      backgroundImage: 'linear-gradient(135deg, #eff7f8 0%, #fbfefe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.1)',
      titleColor: '#3f5f6b',
    },
  ],
  clean: [
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#1f2329',
    },
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #fffaf6 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#1f2329',
    },
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f7fdff 100%)',
      borderColor: 'rgba(0, 0, 0, 0.04)',
      titleColor: '#1f2329',
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
      textColor: '#1f2329',
      mutedColor: '#6b5a50',
      dividerColor: 'rgba(255, 100, 0, 0.18)',
      shadowColor: 'rgba(255, 100, 0, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #f3f5ff 0%, #fbfbff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.12)',
      textColor: '#111827',
      mutedColor: '#5d6475',
      dividerColor: 'rgba(91, 97, 255, 0.18)',
      shadowColor: 'rgba(91, 97, 255, 0.1)',
    },
    {
      background: 'linear-gradient(180deg, #eafcff 0%, #f8feff 100%)',
      borderColor: 'rgba(14, 165, 169, 0.12)',
      textColor: '#0f172a',
      mutedColor: '#49636a',
      dividerColor: 'rgba(14, 165, 169, 0.18)',
      shadowColor: 'rgba(14, 165, 169, 0.1)',
    },
  ],
  accent: [
    {
      background: 'linear-gradient(180deg, #eef0ff 0%, #fafbff 100%)',
      borderColor: 'rgba(91, 97, 255, 0.14)',
      textColor: '#111827',
      mutedColor: '#596075',
      dividerColor: 'rgba(91, 97, 255, 0.2)',
      shadowColor: 'rgba(91, 97, 255, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #f5efff 0%, #fffaff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.14)',
      textColor: '#171426',
      mutedColor: '#655a75',
      dividerColor: 'rgba(124, 92, 255, 0.2)',
      shadowColor: 'rgba(124, 92, 255, 0.12)',
    },
    {
      background: 'linear-gradient(180deg, #eef9ff 0%, #fbfeff 100%)',
      borderColor: 'rgba(37, 99, 235, 0.12)',
      textColor: '#111827',
      mutedColor: '#53627a',
      dividerColor: 'rgba(37, 99, 235, 0.18)',
      shadowColor: 'rgba(37, 99, 235, 0.1)',
    },
  ],
  mint: [
    {
      background: 'linear-gradient(180deg, #4ade80 0%, #4ade80 100%)',
      borderColor: 'rgba(2, 44, 34, 0.12)',
      textColor: '#03170d',
      mutedColor: 'rgba(3, 23, 13, 0.72)',
      dividerColor: 'rgba(3, 23, 13, 0.16)',
      shadowColor: 'rgba(74, 222, 128, 0.24)',
    },
    {
      background: 'linear-gradient(180deg, #f5f2eb 0%, #fffdf8 100%)',
      borderColor: 'rgba(31, 35, 41, 0.1)',
      textColor: '#06080a',
      mutedColor: '#63615c',
      dividerColor: 'rgba(31, 35, 41, 0.14)',
      shadowColor: 'rgba(31, 35, 41, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #e9e6f7 0%, #f6f3ff 100%)',
      borderColor: 'rgba(124, 92, 255, 0.1)',
      textColor: '#080b12',
      mutedColor: '#636071',
      dividerColor: 'rgba(124, 92, 255, 0.14)',
      shadowColor: 'rgba(124, 92, 255, 0.1)',
    },
  ],
  neutral: [
    {
      background: 'linear-gradient(180deg, #f5f7fb 0%, #ffffff 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#111827',
      mutedColor: '#5f6b7a',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#1f2329',
      mutedColor: '#606a78',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
    {
      background: 'linear-gradient(180deg, #f2f4f7 0%, #fbfcfe 100%)',
      borderColor: 'rgba(100, 106, 115, 0.12)',
      textColor: '#1f2937',
      mutedColor: '#667085',
      dividerColor: 'rgba(100, 106, 115, 0.16)',
      shadowColor: 'rgba(15, 23, 42, 0.08)',
    },
  ],
  clean: [
    {
      background: 'linear-gradient(180deg, #ffffff 0%, #fafbff 100%)',
      borderColor: 'rgba(15, 23, 42, 0.08)',
      textColor: '#1f2329',
      mutedColor: '#646a73',
      dividerColor: 'rgba(15, 23, 42, 0.12)',
      shadowColor: 'rgba(15, 23, 42, 0.07)',
    },
  ],
}

const gridColsClass = computed(() => {
  if (props.columns === 2) return 'grid-cols-1 lg:grid-cols-2'
  if (props.columns === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
})

const isWideFeaturePanelLayout = computed(
  () => props.variant === 'feature-panel' && props.columns === 3 && props.cards.length === 7,
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
        textColor: '#111827',
        mutedColor: '#4f6b61',
        dividerColor: 'rgba(16, 185, 129, 0.16)',
        shadowColor: 'rgba(16, 185, 129, 0.1)',
      }
    }

    if (index === 5) {
      return {
        background: 'linear-gradient(180deg, #edf6ff 0%, #f8fbff 100%)',
        borderColor: 'rgba(59, 130, 246, 0.12)',
        textColor: '#111827',
        mutedColor: '#53627a',
        dividerColor: 'rgba(59, 130, 246, 0.16)',
        shadowColor: 'rgba(59, 130, 246, 0.1)',
      }
    }

    if (index === 6) {
      return {
        background: 'linear-gradient(135deg, #fff1e6 0%, #f4f3ff 48%, #eefbff 100%)',
        borderColor: 'rgba(91, 97, 255, 0.12)',
        textColor: '#4f46e5',
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

function formatPanelNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
</script>

<style scoped>
.image-card-grid-panel {
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--image-card-grid-panel-border);
  border-radius: 20px;
  background: var(--image-card-grid-panel-bg);
  color: var(--image-card-grid-panel-text);
  box-shadow: 0 18px 44px var(--image-card-grid-panel-shadow);
  transition:
    transform var(--duration-normal) var(--ease-standard),
    box-shadow var(--duration-normal) var(--ease-standard);
}

.image-card-grid-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 54px var(--image-card-grid-panel-shadow);
}

.image-card-grid-panel__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 32px 34px 0;
  color: var(--image-card-grid-panel-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
}

.image-card-grid-panel__divider {
  height: 1px;
  margin: 15px 34px 0;
  background: var(--image-card-grid-panel-divider);
}

.image-card-grid-panel__content {
  padding: 27px 34px 0;
}

.image-card-grid-panel__content h3 {
  max-width: 520px;
  margin: 0;
  color: var(--image-card-grid-panel-text);
  font-size: 32px;
  font-weight: 800;
  line-height: 1.16;
}

.image-card-grid-panel__content p {
  margin: 26px 0 0;
  color: var(--image-card-grid-panel-muted);
  font-size: 13px;
  line-height: 1.8;
}

.image-card-grid-panel__image {
  width: 100%;
  margin-top: auto;
  padding: 28px 26px 0;
}

.image-card-grid-panel__image img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 280px;
  object-fit: contain;
  object-position: center bottom;
}

.image-card-grid-panel--wide {
  min-height: 440px;
}

.image-card-grid-panel--wide .image-card-grid-panel__content {
  padding-top: 30px;
}

.image-card-grid-panel--wide .image-card-grid-panel__content h3 {
  max-width: 680px;
}

.image-card-grid-panel--wide .image-card-grid-panel__image {
  padding-top: 20px;
}

.image-card-grid-panel--wide .image-card-grid-panel__image img {
  max-height: 320px;
}

@media (max-width: 1024px) {
  .image-card-grid-panel {
    min-height: 560px;
  }

  .image-card-grid-panel--wide {
    min-height: 500px;
  }

  .image-card-grid-panel__content h3 {
    font-size: 30px;
  }
}

@media (max-width: 640px) {
  .image-card-grid-panel {
    min-height: 500px;
    border-radius: 16px;
  }

  .image-card-grid-panel--wide {
    min-height: 460px;
  }

  .image-card-grid-panel__meta {
    padding: 26px 24px 0;
    font-size: 14px;
  }

  .image-card-grid-panel__divider {
    margin: 22px 24px 0;
  }

  .image-card-grid-panel__content {
    padding: 28px 24px 0;
  }

  .image-card-grid-panel__content h3 {
    font-size: 26px;
  }

  .image-card-grid-panel--wide .image-card-grid-panel__content h3 {
    max-width: 100%;
  }

  .image-card-grid-panel__content p {
    margin-top: 18px;
    font-size: 14px;
  }

  .image-card-grid-panel--wide .image-card-grid-panel__image img {
    max-height: 280px;
  }
}
</style>
