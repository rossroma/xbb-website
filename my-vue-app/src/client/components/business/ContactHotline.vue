<template>
  <SectionBlock spacing="default">
    <div v-if="title || subtitle" class="flex flex-col items-center text-center">
      <h2
        v-if="title"
        class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3"
      >
        {{ title }}
      </h2>
      <p
        v-if="subtitle"
        class="mt-4 max-w-180 text-body text-text-secondary leading-body max-md:text-small"
      >
        {{ subtitle }}
      </p>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-6 max-md:mt-8">
      <component
        :is="linkHref ? 'a' : 'article'"
        class="group mx-auto flex w-full max-w-180 items-center justify-between gap-6 rounded-card border px-8 py-7 text-left transition-all duration-normal hover:-translate-y-1 hover:shadow-subtle max-sm:flex-col max-sm:items-start max-sm:px-6 max-sm:py-6"
        :class="[themeClass.card, themeClass.cardHover]"
        :href="linkHref || undefined"
      >
        <div class="flex items-center gap-4">
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            :class="[themeClass.iconBg, themeClass.text]"
            aria-hidden="true"
          >
            <component :is="icon || PhoneTelephone" :size="22" :stroke-width="2.6" />
          </span>
          <span>
            <span class="block text-h3 text-text-primary leading-subtitle max-sm:text-body">
              {{ label }}
            </span>
            <span v-if="description" class="mt-1 block text-small text-text-tertiary">
              {{ description }}
            </span>
          </span>
        </div>

        <span
          class="text-h3 font-semibold leading-subtitle max-sm:text-body"
          :class="themeClass.text"
        >
          {{ displayPhone || phone }}
        </span>
      </component>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { PhoneTelephone } from '@/client/components/ui/remixIcons'

export type ContactHotlineTheme = 'brand' | 'accent' | 'blue'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    label?: string
    description?: string
    phone: string
    displayPhone?: string
    href?: string
    icon?: Component
    theme?: ContactHotlineTheme
  }>(),
  {
    title: '',
    subtitle: '',
    label: '客服热线',
    description: '',
    displayPhone: '',
    href: '',
    icon: undefined,
    theme: 'brand',
  },
)

const themeClasses = {
  brand: {
    card: 'border-[#ffd8bd] bg-[#fff8f3]',
    cardHover: 'hover:border-[#ffb27a]',
    iconBg: 'bg-[#fff0e6]',
    text: 'text-brand-primary',
  },
  accent: {
    card: 'border-[#e7ddff] bg-[#fbf9ff]',
    cardHover: 'hover:border-[#c7b6ff]',
    iconBg: 'bg-[#ede7ff]',
    text: 'text-brand-accent',
  },
  blue: {
    card: 'border-[#d7e6ff] bg-[#f6f9ff]',
    cardHover: 'hover:border-[#9ec4ff]',
    iconBg: 'bg-[#eaf3ff]',
    text: 'text-[#1568ff]',
  },
} satisfies Record<
  ContactHotlineTheme,
  {
    card: string
    cardHover: string
    iconBg: string
    text: string
  }
>

const themeClass = computed(() => themeClasses[props.theme])

const linkHref = computed(() => {
  if (props.href) return props.href
  const tel = props.phone.replace(/[^\d-]/g, '')
  return tel ? `tel:${tel}` : ''
})
</script>
