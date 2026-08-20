<template>
  <SectionBlock spacing="default" class="bg-surface-secondary">
    <div class="relative">
      <div class="relative mx-auto w-full px-26 max-lg:px-21 max-md:px-[58px]">
        <div
          class="overflow-hidden rounded-card border border-border-subtle bg-surface-primary shadow-subtle"
        >
          <Transition :name="slideTransitionName" mode="out-in">
            <div :key="slideTransitionKey" class="grid grid-cols-2 max-lg:grid-cols-1">
              <div class="overflow-hidden p-8 max-lg:p-6 max-md:p-5 max-lg:max-h-80">
                <img
                  :src="getOSSImageUrl(currentCase.image, 600)"
                  :alt="currentCase.imageAlt ?? currentCase.title"
                  class="h-full w-full rounded-inner object-cover"
                />
              </div>

              <div class="flex flex-col p-8 max-lg:p-6 max-md:p-5">
                <div class="mb-7 flex h-14 items-center justify-end">
                  <img
                    :src="getOSSImageUrl(currentCase.logo, 160)"
                    :alt="currentCase.logoAlt ?? ''"
                    class="h-14 max-w-full object-contain"
                  />
                </div>

                <p class="mb-13 h-27 text-body leading-body text-text-secondary line-clamp-5">
                  {{ currentCase.description }}
                </p>

                <hr class="mb-4.5 border-t border-border-default" />

                <h1
                  class="mb-2 min-h-[2.64em] text-h2 font-semibold leading-title text-text-primary line-clamp-2 max-lg:text-h3"
                >
                  {{ currentCase.title }}
                </h1>

                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="tag in currentCase.tags"
                    :key="tag"
                    variant="brand"
                    class="!rounded-[5px] px-4 !text-body"
                  >
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <template v-if="showControls">
          <button
            type="button"
            class="absolute left-0 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-brand-primary bg-surface-primary text-brand-primary shadow-none transition-all duration-normal hover:bg-brand-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary max-md:h-11 max-md:w-11"
            aria-label="上一个案例"
            @click="goToSlide(-1)"
          >
            <ChevronLeft :size="30" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="absolute right-0 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-brand-primary bg-surface-primary text-brand-primary shadow-none transition-all duration-normal hover:bg-brand-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary max-md:h-11 max-md:w-11"
            aria-label="下一个案例"
            @click="goToSlide(1)"
          >
            <ChevronRight :size="30" aria-hidden="true" />
          </button>
        </template>
      </div>

      <div
        v-if="showPagination"
        class="mt-6 flex items-center justify-center gap-2.5"
        aria-label="案例分页器"
      >
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          class="h-2 w-2 rounded-full border-0 p-0 transition-colors duration-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          :class="index === currentIndex ? 'bg-[#7b8794]' : 'bg-[#c5ccd2] hover:bg-[#9da7af]'"
          :aria-label="`切换到第 ${index + 1} 个案例`"
          :aria-current="index === currentIndex ? 'true' : 'false'"
          @click="goToIndex(index)"
        />
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Badge from '@/client/components/ui/Badge.vue'
import { ChevronLeft, ChevronRight } from '@/client/components/ui/remixIcons'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

export interface CaseDetailHeaderItem {
  image: string
  imageAlt?: string
  logo: string
  logoAlt?: string
  description: string
  title: string
  tags: string[]
}

const EMPTY_CASE: CaseDetailHeaderItem = {
  image: '',
  logo: '',
  description: '',
  title: '',
  tags: [],
}

const props = withDefaults(
  defineProps<{
    cases?: readonly CaseDetailHeaderItem[]
    image?: string
    imageAlt?: string
    logo?: string
    logoAlt?: string
    description?: string
    title?: string
    tags?: string[]
    showArrows?: boolean
  }>(),
  {
    tags: () => [],
    showArrows: true,
  },
)

const currentIndex = ref(0)
const slideDirection = ref<1 | -1>(1)
const transitionSeed = ref(0)

const slides = computed<CaseDetailHeaderItem[]>(() => {
  if (props.cases?.length) return [...props.cases]

  if (!props.image && !props.logo && !props.description && !props.title && !props.tags?.length) {
    return []
  }

  return [
    {
      image: props.image ?? '',
      imageAlt: props.imageAlt,
      logo: props.logo ?? '',
      logoAlt: props.logoAlt,
      description: props.description ?? '',
      title: props.title ?? '',
      tags: props.tags ?? [],
    },
  ]
})

const currentCase = computed(() => slides.value[currentIndex.value] ?? EMPTY_CASE)
const hasMultipleSlides = computed(() => slides.value.length > 1)
const showControls = computed(
  () => props.showArrows && props.cases !== undefined && hasMultipleSlides.value,
)
const showPagination = computed(() => props.cases !== undefined && hasMultipleSlides.value)
const slideTransitionName = computed(() =>
  slideDirection.value === 1 ? 'case-detail-header-slide-next' : 'case-detail-header-slide-prev',
)
const slideTransitionKey = computed(
  () => `${currentIndex.value}-${transitionSeed.value}-${currentCase.value.title}`,
)

function goToSlide(direction: 1 | -1) {
  const total = slides.value.length
  if (!total) return

  slideDirection.value = direction
  currentIndex.value = (currentIndex.value + direction + total) % total
  transitionSeed.value += 1
}

function goToIndex(index: number) {
  if (index < 0 || index >= slides.value.length || index === currentIndex.value) return

  slideDirection.value = index > currentIndex.value ? 1 : -1
  currentIndex.value = index
  transitionSeed.value += 1
}

watch(
  () => slides.value.length,
  (length) => {
    if (currentIndex.value >= length) {
      currentIndex.value = 0
    }
  },
)
</script>

<style scoped>
.case-detail-header-slide-next-enter-active,
.case-detail-header-slide-next-leave-active,
.case-detail-header-slide-prev-enter-active,
.case-detail-header-slide-prev-leave-active {
  transition:
    opacity 320ms ease,
    transform 320ms ease;
}

.case-detail-header-slide-next-enter-from,
.case-detail-header-slide-prev-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.case-detail-header-slide-next-leave-to,
.case-detail-header-slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

@media (prefers-reduced-motion: reduce) {
  .case-detail-header-slide-next-enter-active,
  .case-detail-header-slide-next-leave-active,
  .case-detail-header-slide-prev-enter-active,
  .case-detail-header-slide-prev-leave-active {
    transition: none;
  }
}
</style>
