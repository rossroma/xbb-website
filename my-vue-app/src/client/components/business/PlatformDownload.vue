<!--
  复用度：中（业务场景组件）
  可复用场景：各平台软件下载页面、产品下载页、移动端下载引导页
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题区 -->
    <div v-if="title" class="text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-4 max-w-180 mx-auto text-body text-text-secondary leading-body">
        {{ subtitle }}
      </p>
    </div>

    <!-- 平台卡片网格 -->
    <div :class="[gridColsClass, 'grid gap-6', title ? 'mt-12 max-lg:mt-8' : '']">
      <div
        v-for="platform in platforms"
        :key="platform.name"
        class="flex flex-col items-center gap-4"
      >
        <!-- 3D 翻转卡片 -->
        <div
          class="group w-full max-w-[175px] aspect-[20/23] [perspective:1000px] cursor-pointer"
          role="button"
          :aria-label="`查看 ${platform.name} 下载二维码`"
          tabindex="0"
          @keydown.enter.prevent=""
          @keydown.space.prevent=""
        >
          <div
            class="relative w-full h-full transition-transform duration-glide [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)] motion-reduce:transition-none"
          >
            <!-- 正面：平台图标 -->
            <div
              class="backface-hidden absolute inset-0 flex items-center justify-center rounded-card bg-surface-secondary p-3 shadow-subtle"
            >
              <img
                :src="platform.icon"
                :alt="platform.iconAlt ?? platform.name"
                class="max-w-[60%] max-h-[40%] object-contain"
              />
            </div>
            <!-- 背面：二维码 -->
            <div
              class="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-card bg-surface-primary p-4 shadow-subtle [transform:rotateY(180deg)]"
            >
              <img
                :src="platform.qrCode"
                :alt="platform.qrCodeAlt ?? `${platform.name} 下载二维码`"
                class="max-w-[86%] max-h-[80%] object-contain"
              />
              <span class="text-caption text-text-tertiary">扫码下载</span>
            </div>
          </div>
        </div>

        <!-- 平台名称 -->
        <span class="text-body font-medium text-text-primary">{{ platform.name }}</span>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'

/** 平台下载卡片 */
export interface PlatformDownloadCard {
  /** 平台名称（如"钉钉"、"飞书"） */
  name: string
  /** 平台图标/Logo 图片 URL */
  icon: string
  /** 二维码图片 URL */
  qrCode: string
  /** 图标 alt 文本，默认取 name */
  iconAlt?: string
  /** 二维码 alt 文本，默认取「{name} 下载二维码」 */
  qrCodeAlt?: string
}

const props = defineProps<{
  /** 主标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 平台卡片列表（4-6 张） */
  platforms: PlatformDownloadCard[]
}>()

/** 根据卡片数量动态计算响应式网格列数 */
const gridColsClass = computed(() => {
  const count = props.platforms.length
  if (count <= 4) return 'grid-cols-2 sm:grid-cols-4'
  if (count === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
})
</script>
