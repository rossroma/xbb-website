<template>
  <SectionBlock spacing="default">
    <SectionHeading v-if="title" :title="title" :subtitle="subtitle" align="center" />

    <div
      :class="[
        'flex w-fit max-w-full mx-auto flex-col overflow-hidden',
        title ? 'mt-12 max-lg:mt-10' : '',
      ]"
    >
      <div
        class="inline-flex w-fit max-w-full mx-auto overflow-x-auto border border-[#d7e0ed] rounded-[4px] bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        :aria-label="title || '地址列表'"
      >
        <button
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          type="button"
          class="relative h-[55px] min-w-[106px] cursor-pointer border-0 px-[10px] text-[17px] font-normal leading-none whitespace-nowrap text-[#7b8aa1] transition-[background-color,color] duration-200 ease after:absolute after:right-0 after:top-[calc(50%-12px)] after:h-6 after:w-px after:bg-[#dfe2eb] after:content-[''] after:transition-colors after:duration-200 last:after:hidden max-sm:h-[46px] max-sm:min-w-[86px] max-sm:px-[14px] max-sm:text-small"
          :class="
            activeIndex === index
              ? 'bg-[#006bff] font-medium text-white after:bg-transparent'
              : 'hover:bg-[#d5e5ff]'
          "
          role="tab"
          :aria-selected="activeIndex === index"
          :aria-controls="`address-panel-${index}`"
          @click="activeIndex = index"
        >
          {{ item.title }}
        </button>
      </div>

      <article
        v-if="activeItem"
        :id="`address-panel-${activeIndex}`"
        class="grid w-fit max-w-full mx-auto mt-[30px] grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-[74px] border border-[#e5eaf3] rounded-[6px] bg-white p-[14px_16px] max-lg:w-full max-lg:grid-cols-1 max-lg:gap-7 max-md:p-[10px]"
        role="tabpanel"
      >
        <div
          class="relative min-h-75 overflow-hidden rounded-[2px] bg-[#eef3f8] max-lg:mx-auto max-lg:aspect-[16/10] max-lg:w-[min(420px,100%)] max-lg:min-h-0 max-md:w-[min(340px,100%)]"
        >
          <img
            :src="activeItem.image"
            :alt="activeItem.imageAlt ?? activeItem.title"
            class="block w-130 max-w-full min-h-75 object-cover max-lg:h-full max-lg:w-full max-lg:min-h-0"
          />
        </div>

        <div class="flex min-w-0 flex-col justify-center py-9 pr-5 max-lg:p-[10px_12px_24px]">
          <h3
            class="m-0 mb-[42px] flex items-center gap-[14px] text-h2 font-medium leading-1.2 text-[#111827] max-lg:text-h3 max-md:mb-6"
          >
            <Local class="shrink-0 text-[#1568ff]" :size="42" aria-hidden="true" />
            <span>{{ activeItem.title }}</span>
          </h3>
          <p
            v-if="activeItem.description"
            class="m-0 mb-5 text-small leading-[35px] text-[#4b5563] max-md:text-[15px]"
          >
            地址：{{ activeItem.description }}
          </p>
          <p
            v-if="activeItem.hotline"
            class="m-0 mb-5 text-small leading-[35px] text-[#4b5563] max-md:text-[15px]"
          >
            官方热线：{{ activeItem.hotline }}
          </p>
          <p
            v-if="activeItem.email"
            class="m-0 mb-5 text-small leading-[35px] text-[#4b5563] max-md:text-[15px]"
          >
            客户建议及合作：{{ activeItem.email }}
          </p>
        </div>
      </article>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Local } from '@/client/components/ui/remixIcons'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import SectionHeading from '@/client/components/ui/SectionHeading.vue'

export interface AddressTabItem {
  title: string
  description?: string
  image: string
  imageAlt?: string
  mapLabel?: string
  hotline?: string
  email?: string
}

const props = defineProps<{
  title?: string
  subtitle?: string
  items: readonly AddressTabItem[]
}>()

const activeIndex = ref(0)
const activeItem = computed(() => props.items[activeIndex.value])
</script>
