<!--
  复用度：中（业务场景组件）
  可复用场景：产品使用流程、合作对接流程、服务交付流程、操作步骤引导等需要展示多步骤流程的场景
-->
<template>
  <SectionBlock spacing="default">
    <SectionHeading :title="title" :subtitle="description" align="center" />

    <div
      v-if="variant === 'simple'"
      class="mt-12 grid grid-rows-[auto_auto_auto] max-lg:mt-10 max-md:flex max-md:flex-col max-md:gap-6"
      :style="{ '--flow-step-count': String(steps.length) }"
    >
      <div
        class="grid grid-cols-[repeat(var(--flow-step-count),minmax(0,1fr))] items-end mb-12 max-lg:mb-[34px] max-md:hidden"
        aria-hidden="true"
      >
        <div v-for="(step, index) in steps" :key="`icon-${index}`" class="flex justify-center">
          <div
            class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[4px_4px_8px_#4b7dc233,-4px_-4px_8px_#fdfeff] max-lg:h-[78px] max-lg:w-[78px]"
          >
            <component
              v-if="step.icon"
              :is="step.icon"
              :size="34"
              class="text-brand-accent"
              :stroke-width="2.4"
            />
          </div>
        </div>
      </div>

      <div
        class="relative grid min-h-5 grid-cols-[repeat(var(--flow-step-count),minmax(0,1fr))] max-md:hidden before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-[repeating-linear-gradient(to_right,rgba(49,119,255,0.2)_0_8px,transparent_8px_14px)] before:content-['']"
        aria-hidden="true"
      >
        <div
          v-for="(_, index) in steps"
          :key="`dot-${index}`"
          class="relative z-1 size-3.5 self-center justify-self-center rounded-full bg-[#3177ff] shadow-[0_0_0_4px_rgba(49,119,255,0.08)]"
        />
      </div>

      <div
        class="mt-[42px] grid grid-cols-[repeat(var(--flow-step-count),minmax(0,1fr))] max-lg:mt-7 max-md:mt-0 max-md:grid-cols-1 max-md:gap-5"
      >
        <div
          v-for="(step, index) in steps"
          :key="`content-${index}`"
          class="text-center max-md:rounded-2xl max-md:border max-md:border-[rgba(49,119,255,0.12)] max-md:bg-white max-md:p-5 max-md:text-left"
        >
          <span class="block text-2xl font-medium leading-1.15 text-[#3177ff] max-lg:text-2xl">
            step.{{ index + 1 }}
          </span>
          <h3 class="mt-2.5 text-[18px] font-medium leading-1.35 text-text-primary max-lg:text-[18px]">
            {{ step.title }}
          </h3>
        </div>
      </div>
    </div>

    <div
      v-if="variant === 'rich'"
      class="mt-14 grid items-stretch gap-10 [grid-template-columns:repeat(var(--flow-step-count),minmax(0,1fr))] max-xl:gap-7 max-lg:mt-10 max-lg:flex max-lg:flex-col max-lg:gap-6 max-md:mt-8"
      :style="{ '--flow-step-count': String(steps.length) }"
    >
      <article
        v-for="(step, index) in steps"
        :key="index"
        class="relative min-w-0 pt-[58px] max-lg:min-h-0 max-lg:pl-[82px] max-lg:pt-0 max-md:pl-[70px]"
      >
        <div
          v-if="index < steps.length - 1"
          class="pointer-events-none absolute left-[calc(50%+55px)] top-[47px] z-0 h-[22px] w-[calc(100%+40px-110px)] max-xl:w-[calc(100%+28px-110px)] max-lg:left-8 max-lg:top-[74px] max-lg:h-[calc(100%+24px-56px)] max-lg:w-0.5 max-md:left-7 max-md:top-[66px]"
          aria-hidden="true"
        >
          <span
            class="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-pill bg-brand-accent-soft max-lg:inset-y-0 max-lg:left-1/2 max-lg:h-auto max-lg:w-0.5 max-lg:-translate-x-1/2 max-lg:translate-y-0"
          ></span>
          <span
            class="absolute left-[-2px] top-px h-5 w-1 rounded-pill bg-brand-accent-soft max-lg:hidden"
          ></span>
          <span
            class="absolute right-[-2px] top-px h-5 w-1 rounded-pill bg-brand-accent-soft max-lg:hidden"
          ></span>
        </div>

        <div
          class="absolute left-1/2 top-0 z-2 size-[94px] -translate-x-1/2 rounded-pill border border-brand-accent-soft bg-brand-accent-soft shadow-prominent max-lg:left-0 max-lg:size-[66px] max-lg:translate-x-0 max-md:size-[58px]"
          aria-hidden="true"
        >
          <svg
            class="absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient :id="`flow-step-glass-${index}`" cx="35%" cy="50%" r="72%">
                <stop offset="0%" stop-color="var(--color-brand-accent)" stop-opacity="0.4" />
                <stop offset="65%" stop-color="var(--color-brand-accent)" stop-opacity="0.24" />
                <stop offset="100%" stop-color="var(--color-surface-primary)" stop-opacity="0.64" />
              </radialGradient>
            </defs>
            <path
              d="M20 23c-6 0-10 5-10 12v30c0 7 4 12 11 12l41-13V36L20 23Z"
              fill="var(--color-brand-accent)"
            />
            <path
              d="M65 20c-6 0-10 5-10 11v38c0 6 4 11 10 11l20-13V33L65 20Z"
              :fill="`url(#flow-step-glass-${index})`"
            />
          </svg>
          <span
            class="absolute inset-y-0 left-0 z-1 flex w-2/3 items-center justify-center text-h2 font-extrabold italic leading-none tracking-normal text-white max-lg:text-[17px] max-md:text-[15px]"
            >{{ formatStepNumber(index) }}</span
          >
        </div>

        <div
          class="relative z-1 flex min-h-75 flex-col items-center justify-center overflow-hidden rounded-card border border-brand-primary-soft bg-surface-primary px-8 pb-8 pt-18 text-center shadow-subtle max-xl:min-h-70 max-xl:px-6 max-lg:min-h-0 max-lg:items-start max-lg:p-6 max-lg:text-left max-md:p-5"
        >
          <div
            v-if="step.icon || step.image"
            class="mb-[18px] inline-flex size-[46px] items-center justify-center rounded-badge bg-brand-primary-soft text-brand-primary max-lg:mb-3.5 max-lg:size-10"
            aria-hidden="true"
          >
            <component
              v-if="step.icon"
              :is="step.icon"
              :size="24"
              class="text-brand-primary"
              :stroke-width="2.2"
            />
            <img
              v-else-if="step.image"
              :src="step.image"
              :alt="step.imageAlt ?? step.title"
              class="block size-full rounded-badge object-cover"
              loading="lazy"
            />
          </div>

          <h3 class="m-0 text-h3 font-bold leading-subtitle text-text-primary max-lg:text-body">
            {{ step.title }}
          </h3>
          <p
            v-if="step.description"
            class="mt-3.5 max-w-70 text-small leading-small text-text-secondary max-lg:mt-2 max-lg:max-w-none"
          >
            {{ step.description }}
          </p>
        </div>
      </article>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

interface FlowStep {
  title: string
  description?: string
  icon?: Component
  image?: string
  imageAlt?: string
}

type FlowVariant = 'simple' | 'rich'

withDefaults(
  defineProps<{
    title: string
    description?: string
    steps: readonly FlowStep[]
    variant?: FlowVariant
  }>(),
  {
    variant: 'simple',
  },
)

function formatStepNumber(index: number): string {
  return String(index + 1).padStart(2, '0')
}
</script>
