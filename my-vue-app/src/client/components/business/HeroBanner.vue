<template>
  <!-- 单页模式：无轮播，简化布局，适合子页面 Hero -->
  <section
    v-if="mode === 'single' && singleSlide"
    class="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] min-h-125 max-lg:min-h-115 max-md:min-h-100 flex items-center border-t border-b overflow-x-hidden"
    :style="{
      background: singleSlide.bg,
      borderTopColor: singleSlide.line ?? 'rgba(116, 129, 255, 0.16)',
      borderBottomColor: singleSlide.line ?? 'rgba(116, 129, 255, 0.16)',
    }"
  >
    <div
      class="w-[min(1200px,calc(100%-48px))] mx-auto grid grid-cols-[1.15fr_0.85fr] gap-9 max-lg:gap-6 items-center py-16 max-lg:py-12 max-md:py-8 max-lg:grid-cols-1 max-lg:text-center"
    >
      <!-- 左侧文案 -->
      <div class="flex flex-col justify-center">
        <h1
          class="text-display font-bold text-hero-title leading-display max-lg:text-h1 max-md:text-h2"
        >
          {{ singleSlide.title }}
        </h1>
        <p
          v-if="singleSlide.subtitle"
          class="mt-4 max-md:mt-3 text-h2 font-semibold text-hero-subtitle leading-heading max-lg:text-h3 max-md:text-body"
        >
          {{ singleSlide.subtitle }}
        </p>
        <p
          v-if="singleSlide.desc"
          class="mt-6 max-w-135 text-body text-hero-desc leading-body whitespace-pre-line max-lg:mx-auto max-md:mt-4"
        >
          {{ singleSlide.desc }}
        </p>
        <div
          class="flex gap-3 mt-10 max-lg:mt-8 max-md:mt-6 max-lg:justify-center max-sm:flex-col max-sm:items-center"
        >
          <Button variant="hero" size="lg" @click="$emit('action', singleSlide, 'primary')">{{
            singleSlide.primaryCta
          }}</Button>
          <Button
            v-if="singleSlide.secondaryCta"
            variant="hero-outline"
            size="lg"
            @click="$emit('action', singleSlide, 'secondary')"
            >{{ singleSlide.secondaryCta }}</Button
          >
        </div>
      </div>

      <!-- 右侧图片 -->
      <div class="flex items-center justify-center max-lg:hidden">
        <img
          :src="singleSlide.visualImage"
          :alt="singleSlide.visualImageAlt ?? singleSlide.title"
          class="max-w-full h-auto max-h-105 max-lg:max-h-85 rounded-large shadow-hero-video object-contain"
        />
      </div>
    </div>
  </section>

  <!-- 轮播模式：多 Slide 轮播，适合首页 -->
  <section v-else class="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
    <Carousel
      :total-slides="slides.length"
      :auto-play="true"
      :interval="5000"
      show-arrows
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
              :style="{
                background: slide.bg,
                borderTopColor: slide.line,
                borderBottomColor: slide.line,
              }"
            >
              <div
                :class="[
                  'relative min-h-140 max-lg:min-h-130 max-md:min-h-115 grid gap-9 max-lg:gap-6 items-center px-0 z-10 w-[min(80%,calc(100%-48px))] mx-auto',
                  slide.showVisual === false
                    ? 'grid-cols-[1fr]'
                    : 'grid-cols-[0.35fr_0.65fr] max-lg:grid-cols-1',
                ]"
              >
                <!-- Copy -->
                <div
                  :class="[
                    'flex flex-col justify-start self-stretch relative z-10 pt-23 max-lg:pt-12 max-md:pt-8 max-lg:items-center max-lg:text-center',
                    slide.showVisual === false ? 'max-w-180' : '',
                  ]"
                >
                  <span
                    class="self-start px-[18px] max-md:px-3.5 py-2.5 max-md:py-2 text-h2 text-hero-eyebrow bg-surface-primary/76 border border-hero-eyebrow-border rounded-badge shadow-hero-eyebrow backdrop-blur-[16px] tracking-wider max-lg:self-center max-lg:text-h3 max-md:text-body"
                    >{{ slide.eyebrow }}</span
                  >
                  <h2
                    class="mt-9 max-md:mt-6 text-display font-bold text-hero-title leading-display whitespace-pre-line max-lg:text-h1 max-lg:mt-6 max-md:text-h2"
                  >
                    {{ slide.title }}
                  </h2>
                  <h3
                    v-if="slide.subtitle"
                    class="mt-2.5 text-h2 font-semibold text-hero-subtitle leading-heading max-lg:text-h3 max-md:text-body"
                  >
                    {{ slide.subtitle }}
                  </h3>
                  <p
                    class="mt-12 max-w-110 text-body text-hero-desc leading-body whitespace-pre-line max-lg:mt-8 max-md:mt-6 max-lg:max-w-full"
                  >
                    {{ slide.desc }}
                  </p>
                  <div
                    class="flex gap-3 mt-8 max-lg:mt-6 max-lg:justify-center max-sm:flex-col max-sm:items-center"
                  >
                    <Button variant="hero" size="lg" @click="$emit('action', slide, 'primary')">{{
                      slide.primaryCta
                    }}</Button>
                    <Button
                      v-if="slide.secondaryCta"
                      variant="hero-outline"
                      size="lg"
                      @click="$emit('action', slide, 'secondary')"
                      >{{ slide.secondaryCta }}</Button
                    >
                  </div>
                </div>

                <!-- Visual -->
                <div
                  v-if="slide.showVisual !== false"
                  class="relative min-h-99 max-md:min-h-75 flex items-center justify-center max-lg:hidden"
                >
                  <div
                    v-if="slide.mediaType === 'video'"
                    class="w-[90%] min-h-[254px] max-md:min-h-50 ml-auto rounded-large bg-hero-video-bg border border-hero-video-border shadow-hero-video backdrop-blur-[18px] overflow-hidden"
                  >
                    <video
                      class="block w-full h-full object-cover"
                      :src="brandVideo"
                      controls
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

      <template #arrow-left="{ slide: doSlide }">
        <button
          class="absolute left-15 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-[50px] h-[50px] rounded-pill border border-hero-arrow-border bg-surface-primary/88 text-hero-arrow text-h2 leading-none shadow-hero-arrow backdrop-blur-[14px] pointer-events-auto cursor-pointer transition-all duration-normal hover:text-hero-arrow-hover hover:border-hero-arrow-border-hover hover:bg-surface-primary/96 hover:shadow-hero-arrow-hover motion-reduce:transition-none max-lg:left-8 max-md:left-4 max-sm:left-2 max-sm:w-10 max-sm:h-10"
          aria-label="上一张"
          @click="doSlide()"
        >
          <svg
            class="w-[22px] h-[22px] max-sm:w-[18px] max-sm:h-[18px]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </template>

      <template #arrow-right="{ slide: doSlide }">
        <button
          class="absolute right-15 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-[50px] h-[50px] rounded-pill border border-hero-arrow-border bg-surface-primary/88 text-hero-arrow text-h2 leading-none shadow-hero-arrow backdrop-blur-[14px] pointer-events-auto cursor-pointer transition-all duration-normal hover:text-hero-arrow-hover hover:border-hero-arrow-border-hover hover:bg-surface-primary/96 hover:shadow-hero-arrow-hover motion-reduce:transition-none max-lg:right-8 max-md:right-4 max-sm:right-2 max-sm:w-10 max-sm:h-10"
          aria-label="下一张"
          @click="doSlide()"
        >
          <svg
            class="w-[22px] h-[22px] max-sm:w-[18px] max-sm:h-[18px]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </template>
    </Carousel>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/client/components/ui/Button.vue'
import Carousel from '@/client/components/ui/Carousel.vue'
import type { BannerSlide } from '@/client/data/homeData'

const props = withDefaults(
  defineProps<{
    /** 轮播模式 */
    mode?: 'carousel' | 'single'
    slides: BannerSlide[]
    brandVideo?: string
  }>(),
  {
    mode: 'carousel',
  },
)

defineEmits<{
  action: [slide: BannerSlide, action: 'primary' | 'secondary']
}>()

/** 单页模式下的 Slide 数据 */
const singleSlide = computed(() => props.slides[0] ?? null)
</script>
