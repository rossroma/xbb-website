<template>
  <SectionBlock spacing="compact">
    <SectionHeading
      v-if="heading"
      :title="heading"
      :subtitle="subheading"
      :clickable="true"
      @click="$emit('headingClick')"
    />
    <CardGrid :cols="4" gap="default" :class="['justify-items-center', heading ? 'mt-14' : '']">
      <component
        :is="card.linkHref ? 'a' : 'article'"
        v-for="card in cards"
        :key="card.title"
        :href="card.linkHref"
        :class="[
          'group mx-auto flex w-full flex-col overflow-hidden border border-border-subtle rounded-card bg-surface-primary shadow-subtle transition-all duration-glide ease hover:-translate-y-2.5 hover:scale-1.01 hover:border-transparent hover:shadow-card-hover motion-reduce:transition-none motion-reduce:transform-none max-lg:max-w-82',
          card.linkHref ? 'cursor-pointer' : '',
        ]"
        :role="card.linkHref ? undefined : 'button'"
        :tabindex="card.linkHref ? undefined : 0"
        :aria-label="card.linkHref ? undefined : `查看 ${card.title} 详情`"
        @click="handleClick(card)"
        @keydown="handleKeydown($event, card)"
      >
        <div class="relative aspect-square overflow-hidden">
          <img
            :src="card.image"
            :alt="card.title"
            class="block size-full object-cover transition-transform duration-glide ease scale-110 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
        <div class="flex flex-1 flex-col gap-2.5 p-5 pb-6 bg-surface-primary max-lg:px-6 max-lg:py-5 max-md:px-5 max-md:py-4">
          <span
            class="inline-flex w-fit items-center px-2.5 py-0.5 rounded-md bg-brand-primary-soft text-brand-primary text-caption font-semibold"
            >{{ card.kicker }}</span
          >
          <div class="flex items-center justify-between gap-3">
            <h3
              :class="[
                'm-0 text-h3 font-extrabold text-card-title leading-subtitle',
                card.linkHref
                  ? 'transition-colors duration-fast ease group-hover:text-brand-primary'
                  : '',
              ]"
            >
              {{ card.title }}
            </h3>
            <IconBadge
              size="md"
              variant="gradient"
              class="transition-all duration-slow ease group-hover:-translate-y-0.5 group-hover:scale-1.08 motion-reduce:transition-none motion-reduce:transform-none"
              v-slot="{ iconSizeClass }"
            >
              <component
                :is="card.icon"
                :class="iconSizeClass"
                class="text-white"
                :stroke-width="2.2"
              />
            </IconBadge>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2 max-md:gap-1.5">
            <span
              v-for="point in card.points"
              :key="point"
              class="px-2.5 py-2 border border-card-point-border rounded-md bg-card-point-bg text-text-tertiary text-caption font-medium text-center whitespace-normal leading-tight max-md:px-2 max-md:py-1.5"
              >{{ point }}</span
            >
          </div>
        </div>
      </component>
    </CardGrid>
  </SectionBlock>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import IconBadge from '@/client/components/ui/IconBadge.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

interface FeatureImageCard {
  title: string
  kicker: string
  image: string
  icon: Component
  points: string[]
  /** 链接地址，传入后整卡变为可点击的 <a> 标签，标题 hover 变品牌色 */
  linkHref?: string
}

defineProps<{
  heading?: string
  subheading?: string
  cards: FeatureImageCard[]
}>()

const emit = defineEmits<{
  headingClick: []
  cardClick: [title: string]
}>()

function handleClick(card: FeatureImageCard) {
  if (!card.linkHref) {
    emit('cardClick', card.title)
  }
}

function handleKeydown(e: KeyboardEvent, card: FeatureImageCard) {
  if (card.linkHref) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('cardClick', card.title)
  }
}
</script>
