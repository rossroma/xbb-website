<!--
  复用度：中（业务场景组件）
  可复用场景：公司发展历程、产品迭代时间线、项目里程碑、品牌历史等需要按时间线展示阶段性信息的场景
-->
<template>
  <SectionBlock
    spacing="default"
    style="background: url('/images/company/timeLine.png') center / cover no-repeat"
  >
    <SectionHeading :title="title" :subtitle="subtitle" align="center" />

    <div
      class="relative mt-14 [--timeline-arrow-icon:clamp(18px,1.7vw,24px)] [--timeline-arrow-size:clamp(38px,4vw,50px)] max-lg:mt-10"
    >
      <button
        type="button"
        class="absolute left-[calc(var(--timeline-arrow-size)/-2)] top-[43px] z-3 inline-flex size-[var(--timeline-arrow-size)] items-center justify-center rounded-full border-0 bg-white text-brand-accent shadow-[0_16px_34px_rgba(91,97,255,0.16)] cursor-pointer max-md:hidden"
        aria-label="向左查看更多年份"
        @click="scrollTimeline(-1)"
      >
        <Left size="var(--timeline-arrow-icon)" :stroke-width="2.8" aria-hidden="true" />
      </button>

      <div
        ref="trackViewport"
        class="overflow-x-auto overflow-y-visible py-[18px] pb-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:overflow-visible max-md:py-0 max-md:pb-0"
      >
        <div
          ref="track"
          class="relative grid min-w-[max(100%,calc(var(--timeline-count)*150px))] items-end before:absolute before:inset-x-0 before:bottom-[13px] before:h-px before:bg-[rgba(6,15,26,0.22)] max-lg:min-w-[calc(var(--timeline-count)*132px)] max-md:block max-md:min-w-0 max-md:space-y-6 max-md:before:inset-x-auto max-md:before:left-[7px] max-md:before:right-auto max-md:before:top-2 max-md:before:bottom-2 max-md:before:h-auto max-md:before:w-px max-md:before:bg-[rgba(39,200,207,0.28)]"
          style="grid-template-columns: repeat(var(--timeline-count), minmax(120px, 1fr))"
          :style="{ '--timeline-count': String(displayMilestones.length) }"
        >
          <button
            v-for="(milestone, index) in displayMilestones"
            :key="`${milestone.year}-${index}`"
            type="button"
            class="relative flex min-h-[62px] flex-col items-center justify-end gap-2.5 border-0 bg-transparent px-3.5 text-[#556070] cursor-pointer max-md:z-1 max-md:min-h-0 max-md:w-full max-md:flex-row max-md:items-start max-md:justify-start max-md:gap-4 max-md:px-0 max-md:text-left"
            @mouseenter="setActiveIndex(index)"
            @focus="setActiveIndex(index)"
            @click="setActiveIndex(index)"
          >
            <span
              :class="[
                'absolute bottom-[25px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[18px] font-medium leading-none transition-colors duration-fast max-md:static max-md:order-2 max-md:flex-1 max-md:translate-x-0 max-md:whitespace-normal max-md:leading-normal max-md:text-[#384454]',
                activeIndex === index ? 'text-brand-accent max-md:text-[#384454]' : '',
              ]"
            >
              <span class="max-md:hidden">{{ formatYearLabel(milestone.year) }}</span>
              <span class="hidden max-md:block">
                <span class="block text-[18px] font-medium leading-1.55">
                  {{ formatYearLabel(milestone.year) }} {{ milestone.title }}
                </span>
                <span class="mt-1.5 block text-[15px] font-normal leading-1.75 text-[#5f6b7a]">
                  <template v-for="(seg, segIdx) in milestone.description" :key="segIdx">
                    <span v-if="typeof seg === 'string'">{{ seg }}</span>
                    <span v-else :class="seg.highlight ? 'font-semibold text-brand-primary' : ''">
                      {{ seg.text }}
                    </span>
                  </template>
                </span>
              </span>
            </span>
            <span
              :class="[
                'absolute bottom-2 left-1/2 z-1 ml-[-6px] size-3 cursor-pointer rounded-full border-[3px] border-[#edf7f7] bg-brand-accent transition-all duration-300 max-md:static max-md:order-1 max-md:mt-[7px] max-md:ml-0 max-md:size-3.5 max-md:shrink-0 max-md:border-[4px] max-md:border-[#d9f5f7] max-md:bg-[#27c8cf]',
                activeIndex === index ? 'border-brand-accent bg-white' : '',
              ]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        class="absolute right-[calc(var(--timeline-arrow-size)/-2)] top-[43px] z-3 inline-flex size-[var(--timeline-arrow-size)] items-center justify-center rounded-full border-0 bg-white text-brand-accent shadow-[0_16px_34px_rgba(91,97,255,0.16)] cursor-pointer max-md:hidden"
        aria-label="向右查看更多年份"
        @click="scrollTimeline(1)"
      >
        <Right size="var(--timeline-arrow-icon)" :stroke-width="2.8" aria-hidden="true" />
      </button>

      <Transition
        mode="out-in"
        enter-active-class="transition-[opacity,transform] duration-[220ms] ease-out"
        leave-active-class="transition-[opacity,transform] duration-[220ms] ease-out"
        enter-from-class="translate-y-2.5 opacity-0"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <article
          v-if="activeMilestone"
          :key="`${activeMilestone.year}-${activeIndex}`"
          class="relative min-h-[214px] overflow-hidden rounded-[10px] border border-[rgba(91,97,255,0.1)] bg-white bg-cover bg-center shadow-[0_20px_48px_rgba(91,97,255,0.1)] max-md:hidden"
          style="background-image: url('/images/company/timeLine-card.png')"
        >
          <div class="relative z-1 max-w-195 p-[52px_64px] max-lg:p-10 max-md:p-[30px_24px]">
            <p
              class="m-0 text-[32px] font-extrabold leading-none text-brand-accent max-md:text-[34px]"
            >
              {{ formatYearLabel(activeMilestone.year) }}
            </p>
            <h3 class="mt-[22px] text-h2 font-bold leading-1.4 text-text-primary max-md:text-h3">
              {{ activeMilestone.title }}
            </h3>
            <p class="mt-3.5 text-[18px] leading-1.8 text-[#4b5563] max-md:text-body">
              <template v-for="(seg, segIdx) in activeMilestone.description" :key="segIdx">
                <span v-if="typeof seg === 'string'">{{ seg }}</span>
                <span v-else :class="seg.highlight ? 'font-bold text-brand-primary' : ''">
                  {{ seg.text }}
                </span>
              </template>
            </p>
          </div>
        </article>
      </Transition>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Left, Right } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

interface TimelineSegment {
  text: string
  highlight?: boolean
}

interface TimelineMilestone {
  year: string
  title: string
  description: readonly (string | TimelineSegment)[]
}

const props = defineProps<{
  title: string
  subtitle?: string
  milestones: readonly TimelineMilestone[]
}>()

const activeIndex = ref(0)
const trackViewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const showControls = ref(false)

const displayMilestones = computed(() =>
  [...props.milestones].sort((a, b) => Number.parseInt(a.year, 10) - Number.parseInt(b.year, 10)),
)

const activeMilestone = computed(() => displayMilestones.value[activeIndex.value])

function setActiveIndex(index: number) {
  activeIndex.value = index
}

function formatYearLabel(year: string) {
  return `${year}\u5e74`
}

function updateOverflowState() {
  const viewport = trackViewport.value
  const content = track.value
  if (!viewport || !content) return
  showControls.value = content.scrollWidth > viewport.clientWidth + 2
}

function scrollTimeline(direction: -1 | 1) {
  const viewport = trackViewport.value
  if (!viewport) return
  viewport.scrollBy({
    left: direction * Math.max(280, viewport.clientWidth * 0.55),
    behavior: 'smooth',
  })
}

function handleResize() {
  updateOverflowState()
}

onMounted(async () => {
  await nextTick()
  updateOverflowState()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
