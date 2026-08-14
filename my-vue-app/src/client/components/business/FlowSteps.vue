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
          <h3 class="mt-2.5 text-[18px] font-medium leading-1.35 text-[#33476a] max-lg:text-[18px]">
            {{ step.title }}
          </h3>
        </div>
      </div>
    </div>

    <div
      v-if="variant === 'rich'"
      class="mt-12 flex items-start justify-center max-lg:flex-col max-lg:items-stretch max-lg:mt-10"
    >
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="flex flex-1 flex-col items-center text-center max-lg:flex-row max-lg:text-left max-lg:gap-4 max-lg:items-start"
          :class="index < steps.length - 1 ? 'flex-1' : 'flex-shrink-0'"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-gradient text-white text-h3 font-bold leading-subtitle max-lg:text-body"
          >
            {{ index + 1 }}
          </div>

          <h3 class="mt-4 text-h3 text-text-primary leading-subtitle max-lg:mt-0 max-lg:text-body">
            {{ step.title }}
          </h3>

          <div
            class="mt-6 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-surface-secondary max-lg:hidden"
          >
            <component
              v-if="step.icon"
              :is="step.icon"
              :size="48"
              class="text-text-tertiary"
              :stroke-width="2"
            />
            <img
              v-else-if="step.image"
              :src="step.image"
              :alt="step.imageAlt ?? step.title"
              class="h-full w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>

          <p
            v-if="step.description"
            class="mt-4 max-w-60 text-small text-text-secondary leading-small max-lg:mt-0"
          >
            {{ step.description }}
          </p>
        </div>

        <div
          v-if="index < steps.length - 1"
          class="flex shrink-0 items-center justify-center w-16 mt-1.5 max-lg:w-auto max-lg:mt-0 max-lg:py-2"
          aria-hidden="true"
        >
          <component
            :is="Right"
            :size="28"
            class="text-text-tertiary max-lg:hidden"
            :stroke-width="3"
          />
          <component
            :is="Down"
            :size="28"
            class="hidden text-text-tertiary max-lg:block"
            :stroke-width="3"
          />
        </div>
      </template>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Down, Right } from '@/client/components/ui/remixIcons'
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
</script>
