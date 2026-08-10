<template>
  <div
    class="relative motion-reduce:transition-none"
    :aria-label="ariaLabel"
    :aria-roledescription="ariaRoleDescription"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <slot :current-index="currentIndex" :slide="slide" :go-to="goTo" />

    <template v-if="showArrows">
      <slot name="arrow-left" :slide="() => slide(-1)">
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-[50px] h-[50px] rounded-pill border border-border-subtle bg-white/88 text-h2 leading-none shadow-subtle backdrop-blur-[14px] transition-all duration-normal hover:scale-1.04 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          :aria-label="ariaPrevLabel"
          @click="slide(-1)"
        >
          <Left :size="22" aria-hidden="true" />
        </button>
      </slot>
      <slot name="arrow-right" :slide="() => slide(1)">
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-[50px] h-[50px] rounded-pill border border-border-subtle bg-white/88 text-h2 leading-none shadow-subtle backdrop-blur-[14px] transition-all duration-normal hover:scale-1.04 cursor-pointer"
          :aria-label="ariaNextLabel"
          @click="slide(1)"
        >
          <Right :size="22" aria-hidden="true" />
        </button>
      </slot>
    </template>

    <div
      v-if="showDots"
      class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5"
      :class="dotsPosition === 'inside' ? 'bottom-[18px]' : '-bottom-8'"
    >
      <slot name="dots" :current-index="currentIndex" :go-to="goTo" :total="totalSlides">
        <button
          v-for="i in totalSlides"
          :key="i"
          type="button"
          :class="[
            'h-2 rounded-pill border-0 cursor-pointer transition-all duration-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
            currentIndex === i - 1
              ? 'w-[26px] bg-brand-primary-gradient'
              : 'w-2 bg-brand-neutral/16',
          ]"
          :aria-label="`第 ${i} 张`"
          @click="goTo(i - 1)"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Left, Right } from '@/client/components/ui/remixIcons'

const props = withDefaults(
  defineProps<{
    totalSlides: number
    autoPlay?: boolean
    interval?: number
    showArrows?: boolean
    showDots?: boolean
    dotsPosition?: 'inside' | 'outside'
    ariaLabel?: string
    ariaRoleDescription?: string
    ariaPrevLabel?: string
    ariaNextLabel?: string
  }>(),
  {
    autoPlay: false,
    interval: 5000,
    showArrows: false,
    showDots: false,
    dotsPosition: 'inside',
    ariaLabel: '轮播',
    ariaRoleDescription: 'carousel',
    ariaPrevLabel: '上一张',
    ariaNextLabel: '下一张',
  },
)

const emit = defineEmits<{
  'slide-change': [index: number]
}>()

const currentIndex = ref(0)
let timer: ReturnType<typeof window.setInterval> | null = null

const slide = (direction: number) => {
  if (!props.totalSlides) return
  currentIndex.value = (currentIndex.value + direction + props.totalSlides) % props.totalSlides
}

const goTo = (index: number) => {
  if (index >= 0 && index < props.totalSlides) {
    currentIndex.value = index
  }
}

const startAutoPlay = () => {
  if (!props.autoPlay || timer) return
  timer = window.setInterval(() => slide(1), props.interval)
}

const pauseAutoPlay = () => {
  if (!timer) return
  window.clearInterval(timer)
  timer = null
}

const resumeAutoPlay = () => startAutoPlay()

watch(currentIndex, (val) => emit('slide-change', val))

onMounted(() => startAutoPlay())
onUnmounted(() => pauseAutoPlay())
</script>
