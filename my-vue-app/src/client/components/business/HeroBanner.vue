<template>
  <!-- 单页模式：无轮播，简化布局，适合子页面 Hero -->
  <section
    v-if="mode === 'single' && singleSlide"
    class="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] min-h-125 max-lg:min-h-115 max-md:min-h-100 flex items-center border-t overflow-x-hidden"
    :class="{
      'hero-banner-single--form-background': singleVariant === 'form-background',
      'hero-banner-single--vertical': singleLayout === 'vertical',
    }"
    :style="{
      background: singleSlide.bg,
      borderTopColor: singleSlide.line ?? 'rgba(116, 129, 255, 0.16)',
      borderBottomColor: singleSlide.line ?? 'rgba(116, 129, 255, 0.16)',
    }"
  >
    <div
      :class="[
        'w-[min(1200px,calc(100%-48px))] mx-auto grid gap-16 max-lg:gap-6 items-center py-16 max-lg:py-12 max-md:py-8',
        singleLayout === 'vertical'
          ? 'grid-cols-1 text-center'
          : 'grid-cols-[1.15fr_0.85fr] max-lg:grid-cols-1 max-lg:text-center',
        {
          'hero-banner-single__inner--vertical': singleLayout === 'vertical',
        },
        singleVariant === 'form-background'
          ? 'w-[min(1600px,calc(100%-80px))] grid-cols-[minmax(0,1fr)_500px] gap-8 py-0 max-[1200px]:w-[min(1000px,calc(100%-48px))] max-[1200px]:grid-cols-1 max-[1200px]:py-12 max-[500px]:w-[min(500px,calc(100%-32px))] max-[500px]:py-8'
          : '',
        singleLayout !== 'vertical' && !$slots['single-visual'] && !!singleSlide.visualImage
          ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
          : '',
      ]"
    >
      <!-- 左侧文案 -->
      <div
        :class="[
          'flex flex-col justify-center ',
          singleLayout === 'vertical'
            ? 'items-center text-center'
            : 'max-lg:ml-0 max-lg:items-center max-lg:text-center',
        ]"
      >
        <div
          v-if="singleSlide.eyebrow"
          :class="[
            'hero-banner-single__eyebrow self-start inline-flex mb-7 items-center rounded-pill px-3.5 py-1.5 text-body font-semibold leading-none [background:var(--hero-banner-single-eyebrow-bg)] [color:var(--hero-banner-single-eyebrow-color)] max-lg:mb-8 max-md:mb-6 max-md:px-5 max-md:py-3 max-md:text-[18px]',
            singleLayout === 'vertical' ? 'mx-auto' : 'max-lg:mx-auto',
          ]"
          :style="getSingleEyebrowStyle(singleSlide)"
        >
          <span>{{ singleSlide.eyebrow }}</span>
        </div>
        <h1
          v-if="singleSlide.title"
          :data-text="isSingleTitleHighlighted ? singleSlide.title : undefined"
          :class="[
            'text-display font-bold text-hero-title leading-display whitespace-pre-line max-lg:text-h1 max-md:text-h2',
            singleTitleClass,
            isSingleTitleHighlighted ? 'hero-banner-single__text-gradient' : '',
            isSingleTitleHighlighted && shouldShowSingleHighlightUnderline
              ? 'hero-banner-single__text-gradient--underline'
              : '',
          ]"
        >
          {{ singleSlide.title }}
        </h1>
        <p
          v-if="singleSlide.subtitle"
          :data-text="isSingleSubtitleHighlighted ? singleSlide.subtitle : undefined"
          :class="[
            'mt-2 max-md:mt-3 text-display font-bold text-hero-title leading-display whitespace-pre-line max-lg:text-h1 max-md:text-h2',
            singleSubtitleClass,
            isSingleSubtitleHighlighted ? 'hero-banner-single__text-gradient' : '',
            isSingleSubtitleHighlighted && shouldShowSingleHighlightUnderline
              ? 'hero-banner-single__text-gradient--underline'
              : '',
          ]"
        >
          {{ singleSlide.subtitle }}
        </p>
        <p
          v-if="singleSlide.desc"
          :class="[
            'mt-6 max-w-135 text-body !text-[#646566] leading-body whitespace-pre-line max-md:mt-4',
            singleLayout === 'vertical' ? 'mx-auto' : 'max-lg:mx-auto',
          ]"
        >
          {{ singleSlide.desc }}
        </p>
        <div
          v-if="singleSlide.primaryCta || singleSlide.secondaryCta"
          :class="[
            'flex gap-4 mt-10 max-lg:mt-8 max-md:mt-6 max-sm:flex-col max-sm:items-center',
            singleLayout === 'vertical' ? 'justify-center' : 'max-lg:justify-center',
          ]"
        >
          <Button
            v-if="singleSlide.primaryCta"
            variant="hero"
            size="lg"
            :class="[
              '!h-[49px] w-36! !rounded-[99px] !px-9 !py-3 !text-[18px]',
              singlePrimaryBtnClass,
            ]"
            @click="handleSingleAction(singleSlide, 'primary')"
            >{{ singleSlide.primaryCta }}</Button
          >
          <Button
            v-if="singleSlide.secondaryCta"
            variant="hero-outline"
            size="lg"
            :class="[
              '!h-[49px] w-36! !rounded-[99px] !px-9 !py-3 !text-[18px]',
              singleSecondaryBtnClass,
            ]"
            @click="handleSingleAction(singleSlide, 'secondary')"
            >{{ singleSlide.secondaryCta }}</Button
          >
        </div>
      </div>

      <!-- 右侧图片 -->
      <div
        v-if="$slots['single-visual'] || singleSlide.visualImage"
        :class="[
          'flex items-center justify-center',
          singleLayout === 'vertical'
            ? 'w-full'
            : $slots['single-visual']
              ? ''
              : 'max-lg:w-full max-lg:mt-2',
          singleLayout !== 'vertical' && !$slots['single-visual'] && singleSlide.visualImage
            ? 'min-h-110 justify-end overflow-visible max-lg:min-h-0 max-lg:justify-center'
            : '',
        ]"
      >
        <slot name="single-visual" :slide="singleSlide">
          <img
            v-if="singleSlide.visualImage"
            :src="getOSSImageUrl(singleSlide.visualImage, 700)"
            :alt="singleSlide.visualImageAlt ?? singleSlide.title"
            :class="[
              'hero-banner-single__visual-image max-w-full h-auto object-contain',
              singleLayout === 'vertical'
                ? 'w-[min(100%,980px)] max-h-none'
                : 'max-h-105 max-lg:max-h-85',
              singleLayout !== 'vertical' && !$slots['single-visual'] && singleSlide.visualImage
                ? 'w-[min(136%,700px)] max-w-none max-h-125 translate-x-14 scale-1.08 origin-right max-[1200px]:w-[min(126%,680px)] max-[1200px]:translate-x-6 max-[1200px]:scale-1.04 max-lg:w-[min(100%,720px)] max-lg:max-w-full max-lg:max-h-95 max-lg:translate-x-0 max-lg:scale-100 max-md:w-[min(100%,520px)] max-md:max-h-70'
                : '',
            ]"
          />
        </slot>
      </div>
    </div>
  </section>

  <!-- 展示轮播模式：复刻 single_liuzi.php 第四/第五模块 -->
  <section
    v-else-if="mode === 'showcase-carousel'"
    :class="[
      'management-showcase',
      showcaseLayout === 'text-left'
        ? 'management-showcase--featured'
        : 'management-showcase--plain',
    ]"
  >
    <div class="management-showcase__container">
      <p v-if="showcaseTitle" class="row__title management-showcase__section-title">
        {{ showcaseTitle }}
      </p>
      <div class="swiper-father">
        <Carousel
          class="management-showcase__carousel"
          :total-slides="showcaseSlides.length"
          :auto-play="true"
          :interval="5000"
          aria-label="管理能力轮播"
        >
          <template #default="{ currentIndex, goTo }">
            <div class="overflow-hidden">
              <div
                class="swiper-wrapper"
                :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
              >
                <div
                  v-for="slide in showcaseSlides"
                  :key="slide.key"
                  :class="[
                    'row__content swiper-slide',
                    showcaseLayout === 'text-left'
                      ? 'management-showcase__panel'
                      : 'management-showcase__slide',
                  ]"
                  :data-slide-key="slide.key"
                >
                  <template v-if="showcaseLayout === 'text-left'">
                    <p class="row__title management-showcase__panel-title">
                      {{ slide.title }}
                    </p>
                    <div class="management-showcase__panel-body">
                      <div class="row__content--text">
                        <dl :class="{ 'management-showcase__checklist': isChecklistSlide(slide) }">
                          <template
                            v-for="item in slide.items"
                            :key="item.title ?? item.description"
                          >
                            <dt v-if="item.title">
                              <template
                                v-for="(line, lineIndex) in splitShowcaseLines(item.title)"
                                :key="`${line}-${lineIndex}`"
                              >
                                {{ line
                                }}<br
                                  v-if="lineIndex < splitShowcaseLines(item.title).length - 1"
                                />
                              </template>
                            </dt>
                            <dd v-if="item.description">
                              <template
                                v-for="(line, lineIndex) in splitShowcaseLines(item.description)"
                                :key="`${line}-${lineIndex}`"
                              >
                                {{ line
                                }}<br
                                  v-if="lineIndex < splitShowcaseLines(item.description).length - 1"
                                />
                              </template>
                            </dd>
                            <br
                              v-for="breakIndex in item.afterBreaks ?? 0"
                              :key="`break-${item.title ?? item.description}-${breakIndex}`"
                            />
                          </template>
                        </dl>
                        <div class="hangye_bottom management-showcase__actions">
                          <a
                            v-if="slide.primaryCta"
                            :href="
                              getActionHref(slide.primaryCta, slide.primaryHref) ??
                              'javascript:void(0)'
                            "
                            class="btn"
                          >
                            {{ slide.primaryCta }}
                          </a>
                          <a
                            v-if="slide.secondaryCta"
                            :href="
                              getActionHref(slide.secondaryCta, slide.secondaryHref) ??
                              'javascript:void(0)'
                            "
                            class="btn btn-show"
                          >
                            {{ slide.secondaryCta }}
                          </a>
                        </div>
                      </div>

                      <div class="row__content--img">
                        <img
                          :src="getOSSImageUrl(slide.image, 500)"
                          :alt="slide.imageAlt ?? slide.title"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="row__content--img">
                      <img
                        class="management-showcase__image"
                        :src="getOSSImageUrl(slide.image, 500)"
                        :alt="slide.imageAlt ?? slide.title"
                        loading="lazy"
                      />
                    </div>
                    <div class="row__content--text">
                      <p class="row__title management-showcase__item-title">
                        <img
                          v-if="isImageSource(slide.titleIcon)"
                          :src="slide.titleIcon"
                          :alt="slide.titleIconAlt ?? ''"
                          class="management-showcase__item-title-icon"
                          loading="lazy"
                        />
                        <component
                          :is="slide.titleIcon"
                          v-else-if="slide.titleIcon"
                          :size="36"
                          class="management-showcase__item-title-icon text-brand-primary"
                          aria-hidden="true"
                        />
                        <span class="management-showcase__item-title-text">{{ slide.title }}</span>
                      </p>
                      <p v-if="slide.description" class="management-showcase__description">
                        {{ slide.description }}
                      </p>
                      <dl :class="{ 'management-showcase__checklist': isChecklistSlide(slide) }">
                        <template v-for="item in slide.items" :key="item.title ?? item.description">
                          <dt v-if="item.title">
                            <template
                              v-for="(line, lineIndex) in splitShowcaseLines(item.title)"
                              :key="`${line}-${lineIndex}`"
                            >
                              {{ line
                              }}<br v-if="lineIndex < splitShowcaseLines(item.title).length - 1" />
                            </template>
                          </dt>
                          <dd v-if="item.description">
                            <template
                              v-for="(line, lineIndex) in splitShowcaseLines(item.description)"
                              :key="`${line}-${lineIndex}`"
                            >
                              {{ line
                              }}<br
                                v-if="lineIndex < splitShowcaseLines(item.description).length - 1"
                              />
                            </template>
                          </dd>
                          <br
                            v-for="breakIndex in item.afterBreaks ?? 0"
                            :key="`break-${item.title ?? item.description}-${breakIndex}`"
                          />
                        </template>
                      </dl>
                      <div class="hangye_bottom management-showcase__actions">
                        <a
                          v-if="slide.primaryCta"
                          :href="
                            getActionHref(slide.primaryCta, slide.primaryHref) ??
                            'javascript:void(0)'
                          "
                          class="btn btn-show"
                        >
                          {{ slide.primaryCta }}
                        </a>
                        <a
                          v-if="slide.secondaryCta"
                          :href="
                            getActionHref(slide.secondaryCta, slide.secondaryHref) ??
                            'javascript:void(0)'
                          "
                          class="btn"
                        >
                          {{ slide.secondaryCta }}
                        </a>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="swiper_wrap_box">
              <div
                :class="[
                  'swiper-pagination',
                  showcaseLayout === 'text-left'
                    ? 'swiper-pagination-top'
                    : 'swiper-pagination-bottom',
                ]"
              >
                <button
                  v-for="(_, index) in showcaseSlides"
                  :key="index"
                  type="button"
                  :class="[
                    'swiper-pagination-bullet',
                    currentIndex === index ? 'swiper-pagination-bullet-active' : '',
                  ]"
                  :aria-label="`第 ${index + 1} 张`"
                  @click="goTo(index)"
                />
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </div>
  </section>

  <!-- 轮播模式：多 Slide 轮播，适合首页 -->
  <!-- 骨架屏：首次加载无数据时显示，API 返回后淡出 -->
  <section
    v-else-if="loading && slides.length === 0"
    class="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden"
    aria-hidden="true"
  >
    <div
      class="min-h-140 max-lg:min-h-130 max-md:min-h-115 flex items-center"
      style="background: linear-gradient(135deg, #f7faff 0%, #edf4ff 52%, #f6f2ff 100%)"
    >
      <div
        class="w-[min(1200px,calc(100%-48px))] mx-auto grid grid-cols-[0.35fr_0.65fr] gap-9 max-lg:grid-cols-1 animate-pulse"
      >
        <div class="flex flex-col gap-6 max-lg:items-center max-lg:text-center">
          <div class="h-12 w-3/4 rounded-lg bg-white/60 max-lg:h-10" />
          <div class="h-4 w-1/2 rounded bg-white/40" />
          <div class="mt-2 space-y-2">
            <div class="h-3 w-full rounded bg-white/40" />
            <div class="h-3 w-5/6 rounded bg-white/40" />
          </div>
          <div class="mt-6 flex gap-3">
            <div class="h-12 w-32 rounded-full bg-white/50" />
            <div class="h-12 w-32 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 轮播模式：多 Slide 轮播，适合首页 -->
  <section v-else class="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
    <Carousel
      class="hero-banner-carousel"
      :total-slides="slides.length"
      :auto-play="false"
      show-dots
      aria-label="Banner 轮播"
    >
      <template #default="{ currentIndex }">
        <div class="relative overflow-hidden">
          <div
            class="flex w-full transition-transform duration-glide ease will-change-transform motion-reduce:transition-none"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <article
              v-for="slide in slides"
              :key="slide.key"
              class="relative min-h-140 max-lg:min-h-130 max-md:min-h-115 w-full shrink-0 block p-0 border-t border-b overflow-hidden"
              :class="{ 'cursor-pointer': !!slide.primaryHref }"
              :style="{
                background: slide.bg,
                borderTopColor: slide.line,
                borderBottomColor: slide.line,
              }"
              :role="slide.primaryHref ? 'link' : undefined"
              :tabindex="slide.primaryHref ? 0 : undefined"
              :aria-label="slide.primaryHref ? slide.title : undefined"
              @click="handleBannerClick(slide)"
              @keydown.enter="handleBannerClick(slide)"
            >
              <div
                :class="[
                  'relative min-h-140 max-lg:min-h-130 max-md:min-h-115 grid gap-9 max-lg:gap-6 items-center px-0 z-10 w-[min(1200px,calc(100%-48px))] mx-auto',
                  slide.showVisual === false
                    ? 'grid-cols-[1fr]'
                    : 'grid-cols-[0.35fr_0.65fr] max-lg:grid-cols-1',
                ]"
              >
                <!-- Copy -->
                <div
                  :class="[
                    'flex  flex-col justify-center self-stretch relative z-10  max-lg:pt-12 max-md:pt-8 max-lg:items-center max-lg:text-center',
                    slide.showVisual === false ? 'max-w-180' : '',
                  ]"
                >
                  <h2
                    class="mt-9 max-md:mt-6 text-display font-bold text-hero-title leading-display whitespace-pre-line max-lg:text-h1 max-lg:mt-6 max-md:text-h2"
                  >
                    {{ slide.title }}
                  </h2>
                  <h3
                    v-if="slide.subtitle"
                    class="mt-2.5 text-h2 font-semibold text-hero-subtitle leading-heading whitespace-pre-line max-lg:text-h3 max-md:text-body"
                  >
                    {{ slide.subtitle }}
                  </h3>
                  <p
                    class="mt-4 max-w-110 text-body text-hero-desc leading-body whitespace-pre-line max-lg:mt-8 max-md:mt-6 max-lg:max-w-full"
                  >
                    {{ slide.desc }}
                  </p>
                  <div
                    v-if="slide.primaryCta || slide.secondaryCta"
                    class="flex gap-3 mt-10 max-lg:mt-6 max-lg:justify-center max-sm:flex-col max-sm:items-center"
                  >
                    <Button
                      v-if="slide.primaryCta"
                      variant="hero"
                      size="lg"
                      class="!text-[18px]"
                      tabindex="-1"
                      >{{ slide.primaryCta }}</Button
                    >
                    <Button
                      v-if="slide.secondaryCta"
                      variant="hero-outline"
                      size="lg"
                      class="!text-[18px]"
                      tabindex="-1"
                      >{{ slide.secondaryCta }}</Button
                    >
                  </div>
                </div>

                <!-- Visual -->
                <div
                  v-if="slide.showVisual !== false"
                  class="relative flex min-h-99 items-center justify-center max-lg:mt-2 max-lg:min-h-0 max-lg:pb-12 max-md:pb-10"
                >
                  <div
                    v-if="slide.mediaType === 'video'"
                    class="ml-auto min-h-[254px] w-[90%] overflow-hidden rounded-large border border-hero-video-border bg-hero-video-bg shadow-hero-video backdrop-blur-[18px] max-lg:mx-auto max-lg:aspect-video max-lg:min-h-0 max-lg:w-full max-lg:max-w-170 max-md:max-w-none"
                  >
                    <video
                      class="block w-full h-full object-cover"
                      :src="slide.visualImage || brandVideo"
                      muted
                      autoplay
                      loop
                      playsinline
                      preload="metadata"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </template>

      <template #dots="{ currentIndex, goTo, total }">
        <div class="flex items-center gap-2.5 py-3" @click.stop>
          <button
            v-for="i in total"
            :key="i"
            type="button"
            :class="[
              'hero-banner-progress-dot',
              currentIndex === i - 1 ? 'hero-banner-progress-dot--active' : '',
            ]"
            :aria-label="`第 ${i} 张`"
            @click="goTo(i - 1)"
          >
            <span
              class="hero-banner-progress-dot__fill"
              aria-hidden="true"
              @animationend="currentIndex === i - 1 ? goTo(i % total) : undefined"
            />
          </button>
        </div>
      </template>
    </Carousel>
  </section>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/client/components/ui/Button.vue'
import Carousel from '@/client/components/ui/Carousel.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'
import type { BannerSlide } from '@/client/data/homeData'
import { toPagePath } from '@/client/data/routePaths'

export interface HeroShowcaseItem {
  title?: string
  description?: string
  afterBreaks?: number
}

export interface HeroShowcaseSlide {
  key: string
  title: string
  description?: string
  titleIcon?: string | Component
  titleIconAlt?: string
  image: string
  imageAlt?: string
  items: HeroShowcaseItem[]
  primaryCta?: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
}

export type HeroBannerHighlightMode = 'none' | 'title' | 'subtitle' | 'both'

export type HeroBannerSlide = BannerSlide & {
  /** Only used by mode="single" to highlight title/subtitle text. */
  highlightMode?: HeroBannerHighlightMode
  /** Whether to show the underline image below highlighted text. Defaults to true. */
  highlightUnderline?: boolean
  /** Only used by mode="single" to render a badge above the title. */
  eyebrowBackground?: string
  eyebrowColor?: string
}

const props = withDefaults(
  defineProps<{
    /** 轮播模式 */
    mode?: 'carousel' | 'single' | 'showcase-carousel'
    slides?: HeroBannerSlide[]
    brandVideo?: string
    /** 是否正在加载（用于骨架屏显示） */
    loading?: boolean
    /** 单页 Hero 变体：form-background 用于整张背景图右侧表单场景 */
    singleVariant?: 'default' | 'form-background'
    singleLayout?: 'horizontal' | 'vertical'
    /** 单页模式下标题自定义 class */
    singleTitleClass?: string
    /** 单页模式下副标题自定义 class */
    singleSubtitleClass?: string
    /** 单页模式下主要按钮自定义 class */
    singlePrimaryBtnClass?: string
    /** 单页模式下次要按钮自定义 class */
    singleSecondaryBtnClass?: string
    /** 展示轮播标题 */
    showcaseTitle?: string
    /** 展示轮播布局：text-left 对应第四模块，text-right 对应第五模块 */
    showcaseLayout?: 'text-left' | 'text-right'
    /** 展示轮播数据 */
    showcaseSlides?: HeroShowcaseSlide[]
  }>(),
  {
    mode: 'carousel',
    slides: () => [],
    loading: false,
    singleVariant: 'default',
    singleLayout: 'horizontal',
    showcaseTitle: '',
    showcaseLayout: 'text-left',
    showcaseSlides: () => [],
  },
)

const emit = defineEmits<{
  action: [slide: HeroBannerSlide, action: 'primary' | 'secondary']
}>()

/** 单页模式下的 Slide 数据 */
const router = useRouter()
const trialPagePath = toPagePath('single_mfsy')
const trialCtaTexts = new Set(['免费试用', '立即免费试用', '立即咨询', 'CRM免费试用', '免费使用'])

const singleSlide = computed(() => props.slides[0] ?? null)
const isSingleTitleHighlighted = computed(() => {
  const mode = singleSlide.value?.highlightMode
  return mode === 'title' || mode === 'both'
})
const isSingleSubtitleHighlighted = computed(() => {
  const mode = singleSlide.value?.highlightMode
  return mode === 'subtitle' || mode === 'both'
})
const shouldShowSingleHighlightUnderline = computed(() => {
  return singleSlide.value?.highlightUnderline !== false
})

function isImageSource(value: HeroShowcaseSlide['titleIcon']): value is string {
  return typeof value === 'string'
}

function getSingleEyebrowStyle(slide: HeroBannerSlide): CSSProperties {
  return {
    '--hero-banner-single-eyebrow-bg': slide.eyebrowBackground ?? 'rgba(91, 82, 255, 0.1)',
    '--hero-banner-single-eyebrow-color': slide.eyebrowColor ?? '#5b61ff',
  } as CSSProperties
}

function isInternalLink(href?: string): href is string {
  return !!href && href.startsWith('/') && !href.startsWith('//')
}

function getDefaultHrefByText(text?: string) {
  return text && trialCtaTexts.has(text.trim()) ? trialPagePath : undefined
}

function getActionHref(text?: string, href?: string) {
  return getDefaultHrefByText(text) ?? href
}

/** 轮播模式：点击整个 Banner 区域统一跳转 */
function handleBannerClick(slide: BannerSlide) {
  if (!slide.primaryHref) return
  if (slide.primaryTarget === '_blank') {
    window.open(slide.primaryHref, '_blank', 'noopener,noreferrer')
  } else {
    router.push(slide.primaryHref)
  }
}

function handleSingleAction(slide: HeroBannerSlide, action: 'primary' | 'secondary') {
  const text = action === 'primary' ? slide.primaryCta : slide.secondaryCta
  const configuredHref = action === 'primary' ? slide.primaryHref : slide.secondaryHref
  const href = getActionHref(text, configuredHref)
  const target = action === 'primary' ? slide.primaryTarget : slide.secondaryTarget

  if (isInternalLink(href)) {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(href)
    return
  }

  if (href) {
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    window.location.href = href
    return
  }

  emit('action', slide, action)
}

function isChecklistSlide(slide: HeroShowcaseSlide): boolean {
  return slide.items.every((item) => !item.title)
}

function splitShowcaseLines(text: string): string[] {
  return text.split('\n')
}
</script>

<style scoped>
.hero-banner-single__text-gradient {
  position: relative;
  z-index: 1;
  isolation: isolate;
  width: fit-content;
  max-width: 100%;
  padding: 0 0.04em;
  color: #ffffff;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0em;
  -webkit-text-fill-color: transparent;
}

.hero-banner-single__text-gradient::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: linear-gradient(281deg, #1574ff 2%, #5952ff 51%, #a969fe 96%);
  background-clip: text;
  color: transparent;
  white-space: inherit;
  pointer-events: none;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-banner-single__text-gradient--underline::after {
  content: '';
  position: absolute;
  right: -0.08em;
  bottom: -0.46em;
  left: -0.08em;
  z-index: 0;
  width: 94.74%;
  height: 72.73%;
  background-image: url('/images/customer/digital-management-underline.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  pointer-events: none;
}

.hero-banner-progress-dot {
  position: relative;
  display: block;
  width: 44px;
  height: 6px;
  padding: 0;
  overflow: hidden;
  appearance: none;
  cursor: pointer;
  border: 0;
  border-radius: 999px;
  background: rgba(139, 166, 204, 0.24);
}

.hero-banner-progress-dot__fill {
  position: absolute;
  inset: 0;
  display: block;
  width: 0;
  border-radius: inherit;
  background: #1687ff;
}

.hero-banner-progress-dot--active .hero-banner-progress-dot__fill {
  animation: hero-banner-progress-fill 5000ms linear forwards;
}

.hero-banner-carousel:hover .hero-banner-progress-dot--active .hero-banner-progress-dot__fill {
  animation-play-state: paused;
}

@keyframes hero-banner-progress-fill {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

.management-showcase {
  --main-color: #ff6400;
  --text-color-2: #29241F;
  --text-color-light-2: #5e6d82;
  --white: #ffffff;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  height: 540px;
  padding-top: 40px;
  padding-bottom: 0;
  overflow: hidden;
}

.management-showcase__container {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}

.row__title {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  font-size: 44px;
  letter-spacing: -1px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1;
}

.management-showcase .row__title {
  text-align: left;
  font-size: 2.4rem;
  margin-bottom: 6px;
}

.management-showcase__carousel {
  width: 100% !important;
}

.swiper-father {
  position: relative;
}

.swiper-wrapper {
  display: flex;
  width: 100%;
  transition: transform 0.35s ease;
  will-change: transform;
}

.swiper-slide {
  flex: 0 0 100%;
  width: 100%;
}

.management-showcase .row__content {
  display: flex;
  justify-content: center;
}

.management-showcase .row__content--text,
.management-showcase .row__content--img {
  padding: 0 25px;
}

.management-showcase .row__content--text {
  flex: 0 0 50%;
}

.management-showcase .row__content--img {
  flex: 0 0 50%;
}

.management-showcase__panel-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.management-showcase .management-showcase__image {
  width: auto;
  max-width: 100%;
  max-height: 420px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.management-showcase .row__content--img img {
  max-width: 100%;
}

.row__title img {
  padding-right: 15px;
}

.management-showcase__item-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.management-showcase__item-title img,
.management-showcase__item-title-icon {
  flex: 0 0 auto;
  padding-right: 0;
}

.management-showcase__item-title-text {
  min-width: 0;
}

.management-showcase .management-showcase__description {
  text-align: left;
  font-size: 16px;
  line-height: 26px;
}

.management-showcase dl {
  margin-top: 10px;
  padding-left: 30px;
}

.management-showcase dl dt {
  line-height: 40px;
  height: 40px;
  position: relative;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color-2);
}

.management-showcase dl dt::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 10px;
  width: 18px;
  height: 18px;
  background: var(--main-color);
  border-radius: 50%;
  transition: all 0.5s ease-in-out;
}

.management-showcase dl dt::after {
  content: '✓';
  position: absolute;
  left: -30px;
  top: 10px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}

.management-showcase dl dd {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-color-light-2);
}

.management-showcase dl.management-showcase__checklist {
  margin-top: 40px;
}

.management-showcase dl.management-showcase__checklist dd {
  position: relative;
  font-size: 14px;
  margin-bottom: 30px;
}

.management-showcase dl.management-showcase__checklist dd::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 2px;
  width: 18px;
  height: 18px;
  background: var(--main-color);
  border-radius: 50%;
  transition: all 0.5s ease-in-out;
}

.management-showcase dl.management-showcase__checklist dd::after {
  content: '✓';
  position: absolute;
  left: -30px;
  top: 2px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}

.management-showcase__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 30px;
}

.hangye_bottom a {
  display: block;
  width: 156px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 21px;
  border-radius: 4px;
  background-color: #fe5e01;
}

.management-showcase__actions .btn {
  display: inline-flex;
  width: 156px;
  justify-content: center;
  align-items: center;
}

.management-showcase__actions .btn-show {
  color: var(--color-text-primary);
  background-color: #f7f8fd;
}

.btn {
  margin: 0 auto;
}

.swiper_wrap_box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.swiper-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  display: inline-block;
  margin: 0 6px;
  border: 0;
  border-radius: 100%;
  padding: 0;
  appearance: none;
  background: #000;
  cursor: pointer;
  opacity: 0.2;
}

.swiper-pagination-bullet-active {
  opacity: 1;
  background-color: var(--text-color-light-2);
}

.management-showcase__slide {
  background-image: linear-gradient(#fbfcff, #eaefff);
  height: 510px;
}

.management-showcase--plain {
  height: auto;
}

.management-showcase--plain .management-showcase__slide {
  background-image: linear-gradient(#fbfcff, #eaefff);
  height: 530px;
  padding: 40px;
}

.management-showcase--plain [data-slide-key='analysis'] .management-showcase__item-title img,
.management-showcase--plain [data-slide-key='analysis'] .management-showcase__item-title-icon {
  width: 64px;
}

.management-showcase--plain [data-slide-key='follow-up'] .management-showcase__image,
.management-showcase--plain [data-slide-key='follow-up'] .management-showcase__item-title img,
.management-showcase--plain [data-slide-key='follow-up'] .management-showcase__item-title-icon {
  max-width: 85%;
}

.management-showcase__section-title {
  text-align: center !important;
  margin-bottom: 100px !important;
}

.management-showcase--featured {
  background: url('/images/liuzi/background-image.jpg') no-repeat center center !important;
  background-size: cover !important;
  height: 670px !important;
}

.management-showcase--featured .swiper-slide.management-showcase__panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background: none !important;
  padding-bottom: 0 !important;
}

.management-showcase--featured .swiper-slide.management-showcase__panel .row__title {
  text-align: center;
  margin-bottom: 100px;
}

.management-showcase--featured .management-showcase__panel-body {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/images/liuzi/1-bg.png') no-repeat center center !important;
  border-radius: 20px;
  height: 400px;
}

.management-showcase--featured .management-showcase__panel-body .row__content--text,
.management-showcase--featured .management-showcase__panel-body .row__content--img {
  padding: 40px 55px;
}

.management-showcase--featured .management-showcase__panel-body .row__content--text {
  flex: 0 0 40%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
  background: #fff;
  border-radius: 19px 0 0 19px;
  box-shadow: 5px 0 25px rgba(101, 106, 142, 0.3);
  z-index: 1;
}

.management-showcase--featured .management-showcase__panel-body .row__content--img {
  flex: 0 0 60%;
  align-self: stretch;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  background: transparent !important;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
  padding-bottom: 0;
}

.management-showcase--featured .management-showcase__panel-body .row__content--img::before {
  content: '';
  position: absolute;
  inset: 40px 32px 0 0;
  background: #fff;
  z-index: 0;
}

.management-showcase--featured .management-showcase__panel-body .row__content--img img {
  position: relative;
  z-index: 1;
  display: block;
  width: 620px;
  height: 360px;
}

.management-showcase--featured .management-showcase__panel-body dl {
  margin-top: 30px;
}

.management-showcase--featured .management-showcase__panel-body .management-showcase__actions {
  margin-top: auto;
  padding-top: 30px;
}

@media (max-width: 1200px) {
  .management-showcase {
    height: 1000px;
    box-sizing: content-box;
    padding: 40px 40px 0 !important;
  }

  .management-showcase .row__content--text {
    flex: 1 1 100%;
    width: 100%;
    padding: 25px 25px 25px 150px;
  }

  .management-showcase--featured .management-showcase__panel-body {
    flex-wrap: wrap;
    padding: 30px 20px;
  }

  .management-showcase--featured .management-showcase__panel-body .row__content--text {
    padding: 25px 25px 25px 150px;
  }
}

@media (max-width: 993px) {
  .management-showcase {
    height: 740px;
    padding: 40px 0 0 !important;
  }

  .management-showcase .row__content--text {
    padding: 40px 10px 0 !important;
  }

  .management-showcase--featured .management-showcase__panel-body .row__content--text {
    padding: 40px 10px 0 !important;
  }
}

@media (max-width: 500px) {
  .row__title {
    font-size: 26px;
  }

  .management-showcase {
    height: 620px;
  }

  .management-showcase .row__content {
    padding-top: 0;
    padding-right: 0;
  }

  .management-showcase .row__content--text {
    padding-top: 0 !important;
  }

  .management-showcase dl {
    margin-top: 20px;
  }

  .management-showcase .row__content--img {
    flex: 0 0 220px;
    height: 220px;
  }

  .management-showcase--featured .swiper-slide.management-showcase__panel .row__title {
    margin-bottom: 16px;
  }

  .management-showcase--featured .management-showcase__panel-body {
    padding: 20px 15px;
  }

  .management-showcase--featured .management-showcase__panel-body .row__content--text {
    padding-top: 0 !important;
  }
}
</style>
