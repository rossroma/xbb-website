<template>
  <SectionBlock spacing="loose"
    ><SectionHeading
      :title="heading"
      align="center"
      :heading-class="headingClass"
      class="mb-12"
    />
    <CardGrid :cols="4" gap="tight">
      <article
        v-for="item in items"
        :key="item.title"
        class="flex flex-col items-center text-center p-6 pb-5 min-h-full"
      >
        <div class="w-[110px] h-[110px] flex items-center justify-center mb-4">
          <img
            :src="getOSSImageUrl(item.icon, 110)"
            :alt="item.title || item.desc"
            :class="[
              'w-auto object-contain transition duration-normal motion-reduce:transition-none',
              item.logoHeight ?? 'h-15',
            ]"
          />
        </div>
        <p v-if="item.title" class="text-h2 font-medium text-eco-title leading-none mb-2.5">
          {{ item.title }}
        </p>
        <p
          :class="[
            'text-small text-eco-desc leading-small whitespace-pre-line',
            !item.title
              ? 'mt-[18px] max-w-[270px] text-body text-eco-1688 font-medium leading-body'
              : '',
          ]"
        >
          {{ item.desc }}
        </p>
      </article>
    </CardGrid>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

interface LogoItem {
  title: string
  desc: string
  icon: string
  /** 图标高度覆盖（默认 h-15），部分 logo 需要更高尺寸，如 "h-[70px]" */
  logoHeight?: string
}

defineProps<{
  heading: string
  items: LogoItem[]
  headingClass?: string
}>()
</script>
