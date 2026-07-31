<!--
  复用度：高（通用组件）
  可复用场景：文章详情、产品详情、客户案例等任何需要上下篇导航的详情页
-->
<template>
  <nav class="page-nav mt-3" aria-label="文章导航">
    <div class="border-t border-border-subtle pt-6">
      <div class="rounded-card border border-border-subtle bg-surface-primary p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <!-- 上一篇 -->
          <router-link
            v-if="prevLink"
            :to="prevLink"
            class="group flex-1 min-w-0 flex items-center gap-3 no-underline"
            @click="scrollToTop"
          >
            <span
              class="shrink-0 text-text-tertiary group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none"
            >
              <Left :size="16" :stroke-width="4" />
            </span>
            <div class="min-w-0">
              <span class="text-caption text-text-tertiary block mb-1">{{ prevLabel }}</span>
              <span
                class="text-body text-text-primary group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none line-clamp-1"
                >{{ prevTitle }}</span
              >
            </div>
          </router-link>

          <!-- 上一篇空态 -->
          <div v-else class="flex-1 min-w-0 flex items-center gap-3">
            <span class="shrink-0 text-text-tertiary/40">
              <Left :size="16" :stroke-width="4" />
            </span>
            <div class="min-w-0">
              <span class="text-caption text-text-tertiary block mb-1">{{ prevLabel }}</span>
              <span class="text-body text-text-tertiary">{{ emptyLabel }}</span>
            </div>
          </div>

          <!-- 分隔线 -->
          <div
            class="hidden sm:block w-px bg-border-subtle shrink-0"
            :class="{ 'opacity-0': !prevLink && !nextLink }"
          />

          <!-- 下一篇 -->
          <router-link
            v-if="nextLink"
            :to="nextLink"
            class="group flex-1 min-w-0 flex items-center justify-end gap-3 no-underline"
            @click="scrollToTop"
          >
            <div class="min-w-0 text-right">
              <span class="text-caption text-text-tertiary block mb-1">{{ nextLabel }}</span>
              <span
                class="text-body text-text-primary group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none line-clamp-1"
                >{{ nextTitle }}</span
              >
            </div>
            <span
              class="shrink-0 text-text-tertiary group-hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none"
            >
              <Right :size="16" :stroke-width="4" />
            </span>
          </router-link>

          <!-- 下一篇空态 -->
          <div v-else class="flex-1 min-w-0 flex items-center justify-end gap-3">
            <div class="min-w-0 text-right">
              <span class="text-caption text-text-tertiary block mb-1">{{ nextLabel }}</span>
              <span class="text-body text-text-tertiary">{{ emptyLabel }}</span>
            </div>
            <span class="shrink-0 text-text-tertiary/40">
              <Right :size="16" :stroke-width="4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Left, Right } from '@icon-park/vue-next'

// ==================== 类型 ====================

interface PageNavProps {
  /** 上一篇链接 */
  prevLink?: string
  /** 上一篇标题 */
  prevTitle?: string
  /** 下一篇链接 */
  nextLink?: string
  /** 下一篇标题 */
  nextTitle?: string
  /** 上一篇标签文字 */
  prevLabel?: string
  /** 下一篇标签文字 */
  nextLabel?: string
  /** 无内容时的占位文字 */
  emptyLabel?: string
}

// ==================== Props ====================

withDefaults(defineProps<PageNavProps>(), {
  prevLabel: '上一篇',
  nextLabel: '下一篇',
  emptyLabel: '没有了',
})

// ==================== 方法 ====================

/** 点击导航时滚动到页面顶部 */
function scrollToTop() {
  const container = document.querySelector('.client-layout')
  if (container instanceof HTMLElement) {
    container.scrollTo({ top: 0, behavior: 'auto' })
  }
}
</script>
