<!--
  PromoBannerCarousel — PromoBanner + Carousel 结合组件
  复用 Carousel 的轮播状态管理 + PromoBanner 的紧凑布局，适合子页面 Hero 区
-->
<template>
  <section class="pt-10 pb-10 max-lg:pt-8 max-lg:pb-8 max-md:pt-6 max-md:pb-6">
    <div class="w-[min(1200px,calc(100%-48px))] mx-auto">
      <Carousel
        :total-slides="slides.length"
        :auto-play="autoPlay"
        :interval="interval"
        show-dots
        dots-position="outside"
        aria-label="案例轮播"
      >
        <template #default="{ currentIndex }">
          <div class="relative overflow-hidden rounded-card">
            <div
              class="flex transition-transform duration-glide ease will-change-transform motion-reduce:transition-none"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div v-for="slide in slides" :key="slide.key" class="w-full shrink-0">
                <div
                  class="flex items-center gap-[77px] bg-surface-secondary rounded-card px-12 py-8 max-lg:flex-col max-lg:gap-8 max-md:px-6"
                >
                  <!-- 左侧文案 -->
                  <div class="flex-1">
                    <p
                      class="text-body text-text-secondary leading-subtitle mb-2 font-normal mt-[15px]"
                    >
                      {{ slide.eyebrow }}
                    </p>
                    <h2
                      class="text-h2 font-semibold text-text-primary leading-subtitle whitespace-pre-wrap max-md:text-h3"
                    >
                      {{ slide.title }}
                    </h2>
                    <Button
                      variant="outline-neutral"
                      size="lg"
                      class="mt-[38px] mb-[15px] inline-flex items-center gap-3"
                      @click="$emit('ctaClick', slide)"
                    >
                      <span>{{ slide.ctaText }}</span>
                      <span class="text-body leading-none">→</span>
                    </Button>
                  </div>

                  <!-- 右侧图片 -->
                  <img
                    :src="getOSSImageUrl(slide.image, 390)"
                    :alt="slide.imageAlt ?? ''"
                    class="w-[390px] h-[217px] max-md:w-full max-md:h-45 rounded-card object-cover shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </section>
</template>

<script setup lang="ts">
import Carousel from '@/client/components/ui/Carousel.vue'
import Button from '@/client/components/ui/Button.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

/** PromoBanner 轮播 Slide 数据 */
export interface PromoBannerSlide {
  key: string
  eyebrow: string
  title: string
  ctaText: string
  image: string
  imageAlt?: string
}

withDefaults(
  defineProps<{
    slides: PromoBannerSlide[]
    autoPlay?: boolean
    interval?: number
  }>(),
  {
    autoPlay: true,
    interval: 5000,
  },
)

defineEmits<{
  ctaClick: [slide: PromoBannerSlide]
}>()
</script>
