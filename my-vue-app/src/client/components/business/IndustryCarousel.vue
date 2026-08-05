<template>
  <SectionBlock spacing="default">
    <div
      class="flex justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-6"
      role="button"
      tabindex="0"
      @click="$emit('headingClick')"
      @keydown.enter="$emit('headingClick')"
      @keydown.space.prevent="$emit('headingClick')"
    >
      <h2 class="text-h1 text-text-primary max-lg:text-h2 max-md:text-h3">
        {{ heading }}
      </h2>
    </div>
  </SectionBlock>

  <div class="relative mt-8 w-full overflow-hidden px-7 py-3">
    <Carousel :total-slides="cards.length" show-arrows @slide-change="onSlideChange">
      <template #default>
        <!-- Gradient masks -->
        <div
          class="absolute left-0 top-0 bottom-0 w-55 z-10 pointer-events-none bg-case-gradient-left"
        />
        <div
          class="absolute right-0 top-0 bottom-0 w-55 z-10 pointer-events-none bg-case-gradient-right"
        />

        <div ref="viewportRef" class="overflow-hidden min-w-0 py-3 px-0">
          <div
            class="flex gap-7 transition-transform duration-carousel ease will-change-transform motion-reduce:transition-none"
            :style="trackStyle"
          >
            <article
              v-for="(card, index) in displayCards"
              :key="`${card.key}-${index}`"
              :class="[
                'shrink-0 box-border p-[22px] rounded-card bg-case-card-gradient border border-case-card-border flex flex-col transition-all duration-glide ease motion-reduce:transition-none',
                getCardClass(index),
              ]"
              :style="{ width: `${cardWidth}px` }"
            >
              <div class="mb-4">
                <div class="text-h2 font-semibold text-center text-text-primary leading-subtitle">
                  {{ card.industry }}
                </div>
                <p class="min-h-12 text-small text-text-secondary leading-body">
                  {{ card.summary }}
                </p>
              </div>
              <div class="grid grid-cols-3 gap-2.5 flex-1">
                <div
                  v-for="logo in card.logos"
                  :key="logo.name"
                  class="h-[78px] rounded-badge border border-case-logo-border bg-surface-primary/92 p-4 flex justify-center items-center transition-all duration-normal hover:border-brand-accent-ring hover:bg-surface-primary hover:-translate-y-0.5 hover:shadow-case-logo-hover motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <img
                    :src="logo.src"
                    :alt="logo.name"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </template>

      <template #arrow-left="{ slide: doSlide }">
        <button
          class="absolute left-10 top-1/2 -translate-y-1/2 z-20 w-[42px] h-[42px] rounded-pill border border-case-arrow-border bg-surface-primary/98 flex items-center justify-center p-0 cursor-pointer shadow-case-arrow transition-all duration-normal hover:scale-1.04 hover:shadow-case-arrow-hover motion-reduce:transition-none motion-reduce:transform-none max-md:left-2"
          aria-label="上一个案例"
          @click="doSlide()"
        >
          <Left :size="24" :stroke-width="4" />
        </button>
      </template>

      <template #arrow-right="{ slide: doSlide }">
        <button
          class="absolute right-10 top-1/2 -translate-y-1/2 z-20 w-[42px] h-[42px] rounded-pill border border-case-arrow-border bg-surface-primary/98 flex items-center justify-center p-0 cursor-pointer shadow-case-arrow transition-all duration-normal hover:scale-1.04 hover:shadow-case-arrow-hover motion-reduce:transition-none motion-reduce:transform-none max-md:right-2"
          aria-label="下一个案例"
          @click="doSlide()"
        >
          <Right :size="24" :stroke-width="4" />
        </button>
      </template>
    </Carousel>
  </div>

  <!-- CTA -->
  <div v-if="ctaText" class="flex items-center justify-center w-full h-full mt-[38px]">
    <Button variant="outline-neutral" size="lg" class="min-h-13 px-5" @click="$emit('ctaClick')">
      {{ ctaText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Left, Right } from '@icon-park/vue-next'
import Button from '@/client/components/ui/Button.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Carousel from '@/client/components/ui/Carousel.vue'

interface LogoItem {
  name: string
  src: string
}

interface IndustryCarouselCard {
  key: string
  industry: string
  summary: string
  logos: LogoItem[]
}

const props = defineProps<{
  heading: string
  cards: readonly IndustryCarouselCard[]
  ctaText?: string
}>()

defineEmits<{
  headingClick: []
  ctaClick: []
}>()

const CARD_WIDTH = 560
const CAROUSEL_GAP = 28

const currentIdx = ref(0)
const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)

const onSlideChange = (index: number) => {
  currentIdx.value = index
}

const cardWidth = computed(() => {
  const vp = viewportWidth.value
  if (!vp) return CARD_WIDTH
  if (vp <= 768) return Math.min(CARD_WIDTH, Math.max(280, vp - 48))
  if (vp <= 1180) return Math.min(CARD_WIDTH, Math.max(360, vp - 160))
  return CARD_WIDTH
})

const displayCards = computed(() => {
  const first = props.cards[0]
  const last = props.cards[props.cards.length - 1]
  if (!first || !last) return [...props.cards]
  return [last, ...props.cards, first] as IndustryCarouselCard[]
})

const trackStyle = computed(() => {
  const step = cardWidth.value + CAROUSEL_GAP
  const centerOffset = Math.max(0, (viewportWidth.value - cardWidth.value) / 2)
  const offset = (currentIdx.value + 1) * step - centerOffset
  return { transform: `translateX(-${offset}px)` }
})

const getCardClass = (index: number) => {
  const active = currentIdx.value + 1
  if (index === active) return 'opacity-100 scale-100 shadow-default z-10'
  if (index === active - 1 || index === active + 1) return 'opacity-50 scale-95 shadow-case-edge'
  return 'opacity-20 scale-90 shadow-none pointer-events-none'
}

const updateLayout = () => {
  viewportWidth.value = viewportRef.value?.clientWidth ?? 0
}

onMounted(() => {
  nextTick(updateLayout)
  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
})
</script>
