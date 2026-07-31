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
        :src="image"
        :alt="title"
        class="block w-full h-full object-cover transition-transform duration-glide ease group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
      />
      <!-- 播放按钮 -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="flex items-center justify-center size-[60px] rounded-full bg-white/70 backdrop-blur-sm shadow-subtle transition-transform duration-fast ease group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="ml-0.5"
          >
            <path
              d="M11.333 6.275c-1.16-.67-2.61.165-2.61 1.503v16.444c0 1.338 1.45 2.173 2.61 1.503l14.222-8.222c1.16-.67 1.16-2.337 0-3.007L11.333 6.275Z"
              fill="#ff6400"
            />
          </svg>
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
