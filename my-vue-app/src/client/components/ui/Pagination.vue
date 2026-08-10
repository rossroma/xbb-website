<!--
  复用度：高（通用组件）
  可复用场景：文章列表、搜索结果、数据表格等任何需要分页的场景
-->
<template>
  <nav class="flex flex-col sm:flex-row items-center gap-3" :aria-disabled="disabled || undefined">
    <!-- 左侧：总数 -->
    <span v-if="showTotal && total > 0" class="text-small text-text-secondary shrink-0">
      共 {{ total }} 条
    </span>

    <!-- 中间：页码区域 -->
    <div class="flex items-center gap-1">
      <!-- 上一页按钮 -->
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded-full text-text-secondary transition-all duration-fast hover:bg-brand-primary-soft hover:text-brand-primary motion-reduce:transition-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="isPrevDisabled"
        aria-label="上一页"
        @click="goTo(currentPage - 1)"
      >
        <Left class="w-4 h-4" />
      </button>

      <!-- 页码按钮 + 省略号 -->
      <template v-for="item in pageNumbers" :key="item">
        <button
          v-if="item !== '...'"
          class="inline-flex items-center justify-center w-9 h-9 rounded-full text-small font-medium transition-all duration-fast motion-reduce:transition-none cursor-pointer"
          :class="
            item === currentPage
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary hover:bg-brand-primary-soft hover:text-brand-primary'
          "
          :aria-current="item === currentPage ? 'page' : undefined"
          :disabled="disabled"
          @click="goTo(item as number)"
        >
          {{ item }}
        </button>
        <span
          v-else
          class="inline-flex items-center justify-center w-9 h-9 text-text-tertiary text-small"
          aria-hidden="true"
        >
          ...
        </span>
      </template>

      <!-- 下一页按钮 -->
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded-full text-text-secondary transition-all duration-fast hover:bg-brand-primary-soft hover:text-brand-primary motion-reduce:transition-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="isNextDisabled"
        aria-label="下一页"
        @click="goTo(currentPage + 1)"
      >
        <Right class="w-4 h-4" />
      </button>
    </div>

    <!-- 右侧：每页条数 + 快速跳转 -->
    <div v-if="showSizeChanger || showQuickJumper" class="flex items-center gap-2 shrink-0">
      <!-- 每页条数选择器 -->
      <select
        v-if="showSizeChanger"
        :value="pageSize"
        class="h-8 px-2 text-small text-text-secondary bg-surface-primary border border-border-default rounded-pill cursor-pointer focus:outline-2 focus:outline-offset-1 focus:outline-brand-primary appearance-none"
        :disabled="disabled"
        :aria-label="`每页条数，当前 ${pageSize} 条`"
        @change="handleSizeChange"
      >
        <option v-for="size in pageSizes" :key="size" :value="size">{{ size }} 条/页</option>
      </select>

      <!-- 快速跳转 -->
      <div v-if="showQuickJumper" class="flex items-center gap-1">
        <label class="text-small text-text-secondary">跳至</label>
        <input
          ref="jumperInput"
          v-model="jumpInput"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-14 h-8 px-2 text-small text-text-primary text-center bg-surface-primary border border-border-default rounded-pill focus:outline-2 focus:outline-offset-1 focus:outline-brand-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          :disabled="disabled"
          aria-label="跳转页码"
          @keydown.enter="handleJump"
        />
        <button
          class="inline-flex items-center justify-center h-8 px-2.5 text-small font-medium text-text-secondary bg-surface-primary border border-border-default rounded-pill transition-all duration-fast hover:bg-surface-secondary motion-reduce:transition-none disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="disabled || !jumpInput"
          @click="handleJump"
        >
          跳转
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Left, Right } from '@/client/components/ui/remixIcons'

// ==================== Props ====================

interface PaginationProps {
  /** 当前页码（1-based） */
  currentPage?: number
  /** 数据总条数 */
  total?: number
  /** 每页条数 */
  pageSize?: number
  /** 可选每页条数列表 */
  pageSizes?: number[]
  /** 是否显示每页条数切换器 */
  showSizeChanger?: boolean
  /** 是否显示快速跳转输入框 */
  showQuickJumper?: boolean
  /** 是否显示"共 X 条" */
  showTotal?: boolean
  /** 是否禁用整个组件 */
  disabled?: boolean
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  total: 0,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  showSizeChanger: false,
  showQuickJumper: false,
  showTotal: true,
  disabled: false,
})

// ==================== Emits ====================

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  change: [page: number, size: number]
}>()

// ==================== Computed ====================

/** 总页数 */
const totalPages = computed(() => {
  if (props.total <= 0) return 0
  return Math.ceil(props.total / props.pageSize)
})

/** 上一页是否禁用 */
const isPrevDisabled = computed(() => props.disabled || props.currentPage <= 1)

/** 下一页是否禁用 */
const isNextDisabled = computed(() => props.disabled || props.currentPage >= totalPages.value)

/**
 * 生成带省略号的页码数组
 * - 总页数 ≤ 7：全部显示
 * - 总页数 > 7：首尾各显示 1 个，中间显示当前页附近，其余用省略号
 */
const pageNumbers = computed<(number | string)[]>(() => {
  const tp = totalPages.value
  if (tp <= 7) {
    return Array.from({ length: tp }, (_, i) => i + 1)
  }

  const cp = props.currentPage
  const pages: (number | string)[] = []

  // 始终显示第 1 页
  pages.push(1)

  // 计算当前页附近的页码范围
  let start = Math.max(2, cp - 1)
  let end = Math.min(tp - 1, cp + 1)

  // 靠近边缘时扩展范围
  if (cp <= 3) {
    end = Math.min(5, tp - 1)
  } else if (cp >= tp - 2) {
    start = Math.max(tp - 4, 2)
  }

  // 左侧省略号
  if (start > 2) {
    pages.push('...')
  }

  // 中间页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // 右侧省略号
  if (end < tp - 1) {
    pages.push('...')
  }

  // 始终显示最后一页
  pages.push(tp)

  return pages
})

// ==================== 快速跳转 ====================

const jumperInput = ref<HTMLInputElement | null>(null)
const jumpInput = ref('')

// ==================== 方法 ====================

/** 翻到指定页 */
function goTo(page: number) {
  if (props.disabled) return
  if (page < 1 || page > totalPages.value) return
  if (page === props.currentPage) return

  emit('update:currentPage', page)
  emit('change', page, props.pageSize)
}

/** 每页条数变化 */
function handleSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const size = Number(target.value)
  if (size === props.pageSize) return

  emit('update:pageSize', size)
  emit('change', 1, size)
}

/** 快速跳转 */
function handleJump() {
  if (props.disabled) return
  const val = jumpInput.value.trim()
  if (!val) return

  const parsed = parseInt(val, 10)
  if (isNaN(parsed)) return

  const page = Math.max(1, Math.min(parsed, totalPages.value))
  jumpInput.value = ''

  // 聚焦回输入框以便连续跳转
  jumperInput.value?.focus()

  if (page === props.currentPage) return

  emit('update:currentPage', page)
  emit('change', page, props.pageSize)
}
</script>
