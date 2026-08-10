<!--
  复用度：高（通用组件）
  可复用场景：任何需要选项卡切换的场景，如页面内导航、内容筛选、视图切换等
-->
<template>
  <div :class="containerClasses" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.key"
      :ref="(el) => (tabRefs[index] = el as HTMLElement | null)"
      role="tab"
      :aria-selected="isActive(tab.key)"
      :aria-disabled="tab.disabled"
      :tabindex="isActive(tab.key) ? 0 : -1"
      :disabled="tab.disabled"
      :class="getTabClasses(tab)"
      @click="selectTab(tab.key)"
      @keydown.left.prevent="navigate(-1)"
      @keydown.right.prevent="navigate(1)"
      @keydown.home.prevent="navigateTo(0)"
      @keydown.end.prevent="navigateTo(tabs.length - 1)"
    >
      <!-- icon-top：图标在上，文字在下 -->
      <template v-if="layout === 'icon-top' && tab.icon">
        <span :class="lc.iconSize" :style="iconStyle(tab, index)" class="leading-0">
          <component :is="tab.icon" theme="filled" />
        </span>
        <span class="leading-tight" :class="{ 'font-semibold': isActive(tab.key) }">{{
          tab.label
        }}</span>
      </template>

      <!-- icon-left：图标在左，文字在右 -->
      <template v-else-if="layout === 'icon-left' && tab.icon">
        <span :class="lc.iconSize" :style="iconStyle(tab, index)" class="leading-0">
          <component :is="tab.icon" theme="filled" />
        </span>
        <span :class="{ 'font-semibold': isActive(tab.key) }">{{ tab.label }}</span>
      </template>

      <!-- text-only：纯文字 -->
      <template v-else>
        <span :class="{ 'font-semibold': isActive(tab.key) }">{{ tab.label }}</span>
      </template>

      <!-- 徽章 -->
      <span
        v-if="tab.badge !== undefined"
        :class="[
          'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full',
          'text-[10px] font-semibold leading-none',
          isActive(tab.key)
            ? 'bg-brand-primary text-white'
            : 'bg-text-tertiary/20 text-text-tertiary',
        ]"
      >
        {{ tab.badge }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component, StyleValue } from 'vue'

// ===== 图标颜色预设 =====

const DEFAULT_ICON_COLORS = [
  '#ff6400', // 品牌橙
  '#5b61ff', // 蓝紫
  '#16a34a', // 成功绿
  '#f59e0b', // 警告黄
  '#2563eb', // 信息蓝
  '#d1242f', // 错误红
]

// ===== 类型定义 =====

interface TabItem {
  key: string
  label: string
  icon?: Component
  /** 指定图标颜色，覆盖自动分配 */
  iconColor?: string
  disabled?: boolean
  badge?: string | number
}

interface Props {
  tabs: TabItem[]
  modelValue?: string
  /** 内容布局风格，默认 'text-only'；尺寸随布局自动切换 */
  layout?: 'text-only' | 'icon-left' | 'icon-top'
  /** 选中项圆角矩形背景色，默认 'gray' */
  activeBg?: 'gray' | 'brand' | 'accent' | 'white'
  /** 水平对齐，默认 'start' */
  alignment?: 'start' | 'center' | 'end'
  /** 是否撑满容器宽度 */
  fullWidth?: boolean
  /** 无障碍标签 */
  ariaLabel?: string
}

// ===== Props & Emits =====

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  layout: 'text-only',
  activeBg: 'gray',
  alignment: 'start',
  fullWidth: false,
})

const emit = defineEmits<{
  'update:modelValue': [key: string]
}>()

// ===== 状态 =====

const tabRefs = ref<(HTMLElement | null)[]>([])

// ===== 计算属性 =====

const isActive = (key: string) => props.modelValue !== undefined && props.modelValue === key

// ---- 选中项背景色 ----

type ActiveBgKey = 'gray' | 'brand' | 'accent' | 'white'

const activeBgMap: Record<ActiveBgKey, string> = {
  gray: 'bg-surface-secondary',
  brand: 'bg-brand-primary-soft',
  accent: 'bg-brand-accent-soft',
  white: 'bg-surface-primary shadow-subtle',
}

// ---- 布局风格 → tab 项样式（尺寸随布局自动切换）----

type LayoutKey = 'text-only' | 'icon-left' | 'icon-top'

interface LayoutConfig {
  flex: string
  padding: string
  gap: string
  text: string
  /** Remix 图标使用 width="1em"，通过 font-size 控制实际尺寸 */
  iconSize: string
}

const layoutConfig: Record<LayoutKey, LayoutConfig> = {
  'text-only': {
    flex: 'flex-row',
    padding: 'px-7 py-2',
    gap: 'gap-1.5',
    text: 'text-body',
    iconSize: 'text-lg',
  },
  'icon-left': {
    flex: 'flex-row',
    padding: 'px-7 py-2.5',
    gap: 'gap-2',
    text: 'text-body',
    iconSize: 'text-xl',
  },
  'icon-top': {
    flex: 'flex-col',
    padding: 'px-7 py-4',
    gap: 'gap-1.5',
    text: 'text-body',
    iconSize: 'text-3xl',
  },
}

const lc = computed(() => layoutConfig[props.layout as LayoutKey])

// ---- 图标颜色（自动分配或手动指定）----

const getIconColor = (tab: TabItem, index: number): string => {
  if (tab.iconColor) return tab.iconColor
  return (DEFAULT_ICON_COLORS[index % DEFAULT_ICON_COLORS.length] ?? DEFAULT_ICON_COLORS[0])!
}

/** 仅图标的内联颜色样式，不影响文字 */
const iconStyle = (tab: TabItem, index: number): StyleValue => {
  if (!tab.icon) return {}
  return { color: getIconColor(tab, index) }
}

// ---- 容器样式 ----

const containerClasses = computed(() => {
  const classes: string[] = ['items-center gap-1']

  const align = props.alignment ?? 'start'

  if (props.fullWidth) {
    classes.push('flex w-full')
  } else if (align === 'start') {
    classes.push('inline-flex')
  } else {
    // 居中或右对齐需要块级容器
    classes.push('flex w-full')
  }

  const alignMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }
  classes.push(alignMap[align]!)

  return classes
})

// ---- 生成单个 tab 的 class ----

const getTabClasses = (tab: TabItem) => {
  const active = isActive(tab.key)
  const cfg = layoutConfig[props.layout as LayoutKey]

  const classes = [
    // 基础样式
    'inline-flex items-center rounded-pill',
    'transition-all duration-normal ease-in-out',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
    'motion-reduce:transition-none motion-reduce:transform-none',
    'cursor-pointer',
    // 布局方向 + 间距 + 字号 + 内边距
    cfg.flex,
    cfg.gap,
    cfg.text,
    cfg.padding,
    // 文字颜色固定，默认 normal 字重（选中后仅文字 span 加粗）
    'text-text-primary',
  ]

  // 选中态：仅添加圆角矩形背景
  if (active) {
    classes.push(activeBgMap[props.activeBg as ActiveBgKey])
  }

  // 禁用态
  if (tab.disabled) {
    classes.push('opacity-50 pointer-events-none')
  }

  // 全宽模式
  if (props.fullWidth) {
    classes.push('flex-1 justify-center')
  }

  return classes
}

// ===== 方法 =====

const selectTab = (key: string) => {
  const tab = props.tabs.find((t) => t.key === key)
  if (!tab || tab.disabled) return
  emit('update:modelValue', key)
}

const navigate = (direction: number) => {
  const enabled = props.tabs
    .map((t, i) => ({ index: i, tab: t }))
    .filter(({ tab }) => !tab.disabled)

  if (enabled.length === 0) return

  const currentIdx = enabled.findIndex(({ tab }) => tab.key === props.modelValue)
  const targetIdx =
    currentIdx === -1 ? 0 : (currentIdx + direction + enabled.length) % enabled.length
  const target = enabled[targetIdx]
  if (!target) return
  selectTab(target.tab.key)
  tabRefs.value[target.index]?.focus()
}

const navigateTo = (index: number) => {
  const tab = props.tabs[index]
  if (!tab || tab.disabled) return
  selectTab(tab.key)
  tabRefs.value[index]?.focus()
}
</script>
