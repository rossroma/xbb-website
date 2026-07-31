<!--
  复用度：高（通用组件）
  可复用场景：文章详情、产品详情、客户案例等任何需要面包屑导航的详情页
-->
<template>
  <nav class="breadcrumb" aria-label="面包屑导航" :class="{ 'mt-5': spacing !== 'none' }">
    <ol
      class="flex items-center gap-1.5 text-body w-full min-w-0 pb-3 border-b border-border-subtle shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <template v-for="(item, index) in items" :key="index">
        <!-- 分隔符 -->
        <li v-if="index > 0" aria-hidden="true" class="select-none text-text-tertiary/40">›</li>
        <li :class="{ 'min-w-0': !item.to }">
          <router-link
            v-if="item.to"
            :to="item.to"
            class="inline-flex items-center gap-1 text-text-tertiary hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none no-underline shrink-0"
          >
            <Home v-if="showHomeIcon && index === 0" :size="16" :stroke-width="4" />
            {{ item.label }}
          </router-link>
          <span
            v-else
            class="inline-flex items-center gap-1 text-text-secondary truncate"
            :title="item.label"
          >
            <Home v-if="showHomeIcon && index === 0" :size="16" :stroke-width="4" />
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { Home } from '@icon-park/vue-next'

// ==================== 类型 ====================

export interface BreadcrumbItem {
  /** 显示的文本 */
  label: string
  /** 可选的路由地址，无 to 即为当前页（纯文本展示，不可点击） */
  to?: string
}

interface BreadcrumbProps {
  /** 面包屑层级列表，最后一项无 to 即为当前页 */
  items: readonly BreadcrumbItem[]
  /** 顶部间距控制，默认有间距 */
  spacing?: 'default' | 'none'
  /** 是否在首项前显示首页图标 */
  showHomeIcon?: boolean
}

// ==================== Props ====================

withDefaults(defineProps<BreadcrumbProps>(), {
  spacing: 'default',
  showHomeIcon: false,
})
</script>
