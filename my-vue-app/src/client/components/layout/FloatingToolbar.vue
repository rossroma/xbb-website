<template>
  <aside
    class="fixed top-1/2 right-3 z-12 -translate-y-1/2 flex flex-col items-center gap-1.5 max-[1199px]:right-0 max-[1199px]:gap-1 max-[780px]:hidden"
    aria-label="快捷操作"
  >
    <!-- 客服入口（顶部大图标） -->
    <a
      v-if="topService"
      :href="topService.link"
      target="_blank"
      rel="noreferrer"
      aria-describedby="top-service-tooltip"
      class="group w-17 max-[1199px]:w-12 relative block no-underline hover:opacity-90 transition-opacity duration-fast motion-reduce:transition-none"
    >
      <img :src="topService.icon" :alt="topService.label" class="w-full h-auto block" />
      <span
        id="top-service-tooltip"
        role="tooltip"
        class="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 rounded-inner bg-white px-3 py-2 text-caption leading-none text-toolbar-icon shadow-toolbar whitespace-nowrap opacity-0 invisible transition-all duration-fast motion-reduce:transition-none group-hover:opacity-100 group-hover:visible group-focus-visible:opacity-100 group-focus-visible:visible"
        >点击进入在线客服</span
      >
      <span
        class="absolute mr-3 left-1/2 bottom-1.5 -translate-x-1/2 min-w-14 leading-6 px-2 rounded-pill bg-toolbar-scroll-top-gradient text-white text-caption font-semibold text-center whitespace-nowrap shadow-toolbar-service-label max-[1199px]:min-w-10 max-[1199px]:leading-4 max-[1199px]:px-1.5 max-[1199px]:text-caption max-[1199px]:bottom-1"
        >{{ topService.label }}</span
      >
    </a>

    <!-- 面板 -->
    <div
      class="w-13 bg-white pt-2.5 pb-13 rounded-pill shadow-toolbar relative max-[1199px]:w-9 max-[1199px]:pt-2 max-[1199px]:pb-8"
    >
      <template v-for="item in items" :key="item.key">
        <!-- 二维码类型 -->
        <button
          v-if="item.type === 'qrcode'"
          type="button"
          class="group w-full text-center py-2.5 px-0 border-0 bg-transparent cursor-pointer relative block max-[1199px]:py-1.5"
          @mouseenter="visibleMap[item.key] = true"
          @mouseleave="visibleMap[item.key] = false"
        >
          <div
            class="flex justify-center text-h3 leading-none max-[1199px]:text-body text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none"
          >
            <component :is="item.icon" />
          </div>
          <p
            class="text-caption leading-caption text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none max-[1199px]:hidden"
          >
            {{ item.label }}
          </p>
          <span
            :class="[
              'w-30 h-30 rounded-lg absolute right-8 top-1/2 -mt-17 bg-white shadow-toolbar z-3 transition-all duration-glide ease-in-out motion-reduce:transition-none max-[1199px]:w-24 max-[1199px]:h-24 max-[1199px]:right-[18px] max-[1199px]:-mt-14',
              visibleMap[item.key]
                ? 'opacity-100 right-15 visible max-[1199px]:right-11'
                : 'opacity-0 invisible',
            ]"
            :style="{
              backgroundImage: `url(${item.qrImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }"
          />
        </button>

        <!-- 电话类型 -->
        <button
          v-else-if="item.type === 'phone'"
          type="button"
          class="group w-full text-center py-2.5 px-0 border-0 bg-transparent cursor-pointer relative block max-[1199px]:py-1.5"
          @mouseenter="visibleMap[item.key] = true"
          @mouseleave="visibleMap[item.key] = false"
        >
          <div
            class="flex justify-center text-h3 leading-none max-[1199px]:text-body text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none"
          >
            <component :is="item.icon" />
          </div>
          <p
            class="text-caption leading-caption text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none max-[1199px]:hidden"
          >
            {{ item.label }}
          </p>
          <span
            :class="[
              'leading-12 h-12 text-toolbar-icon text-caption px-6 rounded-inner absolute right-8 top-1/2 -translate-y-1/2 bg-white shadow-toolbar z-0 transition-all duration-glide ease-in-out motion-reduce:transition-none whitespace-nowrap max-[1199px]:leading-9 max-[1199px]:h-9 max-[1199px]:text-caption max-[1199px]:px-5 max-[1199px]:right-[18px] max-[1199px]:-translate-y-1/2',
              visibleMap[item.key]
                ? 'opacity-100 right-15 visible max-[1199px]:right-11'
                : 'opacity-0 invisible',
            ]"
            >{{ item.phoneNumber }}</span
          >
        </button>

        <!-- 路由类型 -->
        <RouterLink
          v-else-if="item.type === 'route'"
          :to="item.routeTo ?? '/'"
          class="group w-full text-center pt-2.5 pb-2 px-0 border-0 bg-transparent cursor-pointer relative block no-underline max-[1199px]:py-1.5"
        >
          <div
            class="flex justify-center text-h3 leading-none max-[1199px]:text-body text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none"
          >
            <component :is="item.icon" />
          </div>
          <p
            class="text-caption leading-caption text-toolbar-icon group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none max-[1199px]:hidden"
          >
            {{ item.label }}
          </p>
        </RouterLink>
      </template>

      <!-- 回到顶部 -->
      <button
        type="button"
        class="w-11 h-11 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-toolbar-scroll-top shadow-toolbar-scroll-top border-0 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-fast motion-reduce:transition-none motion-reduce:transform-none max-[1199px]:w-8 max-[1199px]:h-8 max-[1199px]:bottom-1.5"
        aria-label="回到顶部"
        @click.stop="scrollToTop"
      >
        <span class="text-h3 leading-none text-white flex max-[1199px]:text-body">
          <Up />
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Up } from '@/client/components/ui/remixIcons'
import type { ToolbarItem } from '@/client/data/siteConfigData'

interface TopService {
  icon: string
  label: string
  link: string
}

withDefaults(
  defineProps<{
    /** 顶部客服入口（可选） */
    topService?: TopService
    /** 面板工具栏项 */
    items?: readonly ToolbarItem[]
  }>(),
  {
    items: () => [],
  },
)

/** 每个 item 的 hover 可见状态 */
const visibleMap = reactive<Record<string, boolean>>({})

const scrollToTop = () => {
  const container = document.querySelector('.client-layout')
  if (container instanceof HTMLElement) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
