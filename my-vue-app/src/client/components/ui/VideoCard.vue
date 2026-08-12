<!--
  复用度：高（UI Kit 组件）
  可复用场景：视频列表、课程卡片、案例展示、帮助中心等任何需要视频封面卡片的场景
-->
<template>
  <article
    :class="[
      'flex flex-col w-68 overflow-hidden rounded-card border border-border-subtle bg-surface-elevated shadow-subtle',
      'transition-all duration-normal ease',
      'group',
      clickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-card-hover' : '',
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="clickable ? title : undefined"
    @click="clickable && $emit('click')"
    @keydown.enter="clickable && $emit('click')"
    @keydown.space.prevent="clickable && $emit('click')"
  >
    <!-- 封面图区域 -->
    <div
      :class="[
        'relative overflow-hidden',
        aspectRatio === '1:1' ? 'aspect-[1/1]' : 'aspect-[16/10]',
      ]"
    >
      <img
        :src="getOSSImageUrl(image, 272)"
        :alt="title"
        class="block w-full h-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
      />
      <!-- 播放按钮 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="flex items-center justify-center size-[60px] rounded-full bg-white/70 backdrop-blur-sm shadow-subtle transition-transform duration-fast ease group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <Play :size="26" color="#ff6400" class="ml-0.5" aria-hidden="true" />
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex flex-1 flex-col p-6">
      <!-- 标签 -->
      <span
        v-if="tag"
        class="inline-block self-start px-2.5 py-1 mb-2 rounded-pill text-caption font-medium leading-caption text-brand-primary bg-brand-primary-soft"
      >
        {{ tag }}
      </span>
      <!-- 标题 -->
      <h3 class="text-h3 font-bold text-text-primary leading-subtitle">
        {{ title }}
      </h3>
      <!-- 描述 -->
      <p v-if="description" class="mt-2 text-small text-text-secondary leading-small line-clamp-2">
        {{ description }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Play } from '@/client/components/ui/remixIcons'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

withDefaults(
  defineProps<{
    /** 封面图 URL */
    image: string
    /** 视频标题 */
    title: string
    /** 封面比例，默认 16:10 */
    aspectRatio?: '16:10' | '1:1'
    /** 标签（选填） */
    tag?: string
    /** 描述（选填） */
    description?: string
    /** 是否可点击 */
    clickable?: boolean
  }>(),
  {
    aspectRatio: '16:10',
    clickable: false,
  },
)

defineEmits<{
  /** 卡片点击 */
  click: []
}>()
</script>
