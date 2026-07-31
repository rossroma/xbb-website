<!--
  复用度：高（业务场景组件）
  可复用场景：帮助中心、常见问题页、产品 FAQ、知识库等问答列表展示场景
  功能特性：
    - 左侧分类过滤 + 右侧搜索 + FAQ 折叠列表
    - 手风琴展开（同一时间仅展开一项）或平铺展示（全部展开）
    - 支持搜索过滤（问题 + 答案内容）
    - 支持隐藏分类侧边栏 / 搜索框
    - 响应式：移动端分类切换为水平滚动
-->
<template>
  <SectionBlock spacing="default">
    <!-- 标题区 -->
    <div v-if="title" class="text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-4 text-body text-text-secondary leading-body">
        {{ subtitle }}
      </p>
    </div>

    <!-- 主体：左侧分类 + 右侧内容 -->
    <div
      :class="[
        'flex',
        showCategories ? 'gap-16 max-lg:flex-col max-lg:gap-8' : '',
        title ? 'mt-14 max-lg:mt-10 max-md:mt-8' : '',
      ]"
    >
      <!-- ===== 左侧分类导航 ===== -->
      <nav v-if="showCategories" class="shrink-0 w-52 max-lg:w-full" aria-label="问题分类">
        <!-- 桌面端：垂直列表 -->
        <ul class="flex flex-col gap-1 max-lg:hidden">
          <li v-for="cat in categories" :key="cat.key">
            <button :class="getCategoryClasses(cat.key)" @click="selectCategory(cat.key)">
              <span class="truncate">{{ cat.label }}</span>
              <span
                v-if="activeCategory === cat.key"
                class="ml-auto shrink-0 w-1 h-5 rounded-pill bg-brand-primary"
              />
            </button>
          </li>
        </ul>

        <!-- 移动端：水平滚动 -->
        <div class="hidden max-lg:flex gap-2 overflow-x-auto pb-1 -mx-2 px-2">
          <button
            v-for="cat in categories"
            :key="cat.key"
            :class="[
              'shrink-0 px-4 py-2 rounded-pill text-small font-medium whitespace-nowrap',
              'transition-all duration-fast ease',
              'motion-reduce:transition-none',
              'cursor-pointer',
              activeCategory === cat.key
                ? 'bg-brand-primary text-white shadow-button-brand'
                : 'bg-surface-secondary text-text-secondary hover:bg-brand-primary-soft hover:text-brand-primary',
            ]"
            @click="selectCategory(cat.key)"
          >
            {{ cat.label }}
          </button>
        </div>
      </nav>

      <!-- ===== 右侧内容区 ===== -->
      <div class="flex-1 min-w-0">
        <!-- 搜索框 -->
        <div
          v-if="showSearch"
          class="relative flex items-center rounded-card border border-border-default bg-surface-primary transition-all duration-normal ease focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 motion-reduce:transition-none"
        >
          <span class="absolute left-5 text-text-tertiary pointer-events-none" aria-hidden="true">
            <Search :size="20" :stroke-width="2.5" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full bg-transparent border-none outline-none py-4 pl-13 pr-5 text-body text-text-primary placeholder:text-text-tertiary max-md:py-3.5 max-md:pl-11 max-md:text-small"
            :aria-label="searchPlaceholder"
            @input="handleSearch"
          />
          <!-- 清空按钮 -->
          <button
            v-if="searchQuery"
            class="absolute right-4 p-1 rounded-full text-text-tertiary hover:text-text-secondary transition-colors duration-fast cursor-pointer"
            aria-label="清空搜索"
            @click="clearSearch"
          >
            <CloseSmall :size="16" :stroke-width="3" />
          </button>
        </div>

        <!-- FAQ 列表 -->
        <div class="mt-6 max-md:mt-4">
          <!-- 空状态：无匹配结果 -->
          <EmptyState
            v-if="filteredItems.length === 0"
            :message="
              searchQuery ? '未找到匹配的问题，请尝试其他关键词搜索' : '该分类下暂无常见问题'
            "
          />

          <!-- FAQ 列表项 -->
          <div
            v-else
            class="divide-y divide-border-subtle rounded-card border border-border-subtle bg-surface-primary overflow-hidden"
          >
            <div
              v-for="(item, index) in filteredItems"
              :key="item.id"
              :class="[
                'transition-colors duration-fast ease',
                'motion-reduce:transition-none',
                expandMode === 'flat' || expandedId === item.id
                  ? 'bg-brand-primary-soft/40'
                  : 'hover:bg-surface-secondary',
              ]"
            >
              <!-- 问题行：点击展开/折叠（平铺模式下不可点击） -->
              <button
                :class="[
                  'flex items-center gap-4 w-full px-6 py-5 text-left',
                  expandMode === 'flat' ? 'cursor-default' : 'cursor-pointer',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary',
                  'max-md:px-4 max-md:py-4 max-md:gap-3',
                ]"
                :aria-expanded="expandMode === 'flat' ? true : expandedId === item.id"
                :aria-controls="`faq-answer-${item.id}`"
                :disabled="expandMode === 'flat'"
                @click="expandMode === 'single' && toggleItem(item.id)"
              >
                <!-- 序号徽章 -->
                <span
                  :class="[
                    'shrink-0 flex items-center justify-center w-9 h-9 rounded-card text-small font-bold',
                    'transition-all duration-fast ease',
                    'motion-reduce:transition-none',
                    expandMode === 'flat' || expandedId === item.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface-secondary text-text-tertiary',
                  ]"
                  aria-hidden="true"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>

                <!-- 问题文本 -->
                <span
                  :class="[
                    'flex-1 text-body font-semibold text-text-primary leading-body transition-colors duration-fast',
                    'max-md:text-small',
                    expandMode === 'flat' || expandedId === item.id ? 'text-brand-primary' : '',
                  ]"
                >
                  {{ item.question }}
                </span>

                <!-- 展开/折叠箭头（平铺模式隐藏） -->
                <span
                  v-if="expandMode === 'single'"
                  :class="[
                    'shrink-0 transition-transform duration-normal ease',
                    'motion-reduce:transition-none',
                    expandedId === item.id ? 'text-brand-primary rotate-180' : 'text-text-tertiary',
                  ]"
                  aria-hidden="true"
                >
                  <Down :size="20" :stroke-width="3" />
                </span>
              </button>

              <!-- 答案内容：手风琴展开时显示 / 平铺模式始终显示 -->
              <div
                v-if="expandMode === 'flat' || expandedId === item.id"
                :id="`faq-answer-${item.id}`"
                role="region"
                :aria-label="`${item.question} 的答案`"
                class="px-6 pb-6 max-md:px-4 max-md:pb-4"
              >
                <div class="flex gap-4 max-md:gap-3">
                  <!-- 左侧占位（与序号徽章对齐） -->
                  <span class="shrink-0 w-9 max-md:hidden" aria-hidden="true" />
                  <!-- 答案文本 -->
                  <div
                    class="flex-1 text-body text-text-secondary leading-body bg-surface-secondary rounded-card px-6 py-5 max-md:text-small max-md:px-4 max-md:py-4"
                  >
                    <!-- 支持 HTML 富文本答案 -->
                    <p v-if="typeof item.answer === 'string'" v-html="item.answer" />
                    <p v-else>{{ item.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Down, CloseSmall } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import EmptyState from '@/client/components/ui/EmptyState.vue'

// ===== 类型定义 =====

/** FAQ 分类 */
export interface FaqCategory {
  /** 分类唯一标识 */
  key: string
  /** 分类显示名称 */
  label: string
}

/** FAQ 问答项 */
export interface FaqItem {
  /** 唯一标识 */
  id: string | number
  /** 问题文本 */
  question: string
  /** 答案文本（支持 HTML） */
  answer: string
  /** 所属分类 key */
  category: string
}

// ===== Props & Emits =====

const props = withDefaults(
  defineProps<{
    /** 区块标题 */
    title?: string
    /** 区块副标题 */
    subtitle?: string
    /** 分类列表 */
    categories: FaqCategory[]
    /** FAQ 问答数据 */
    items: FaqItem[]
    /** 搜索框占位文本 */
    searchPlaceholder?: string
    /** 默认选中分类，默认取第一个分类 */
    defaultCategory?: string
    /** 是否显示分类侧边栏 */
    showCategories?: boolean
    /** 是否显示搜索框 */
    showSearch?: boolean
    /** 展开模式：single（手风琴，默认）| flat（平铺，全部展开） */
    expandMode?: 'single' | 'flat'
  }>(),
  {
    searchPlaceholder: '搜索问题关键词',
    showCategories: true,
    showSearch: true,
    expandMode: 'single',
  },
)

const emit = defineEmits<{
  /** 分类切换 */
  categoryChange: [key: string]
  /** 问题项展开/折叠 */
  toggle: [id: string | number, expanded: boolean]
  /** 搜索文本变化 */
  search: [query: string]
}>()

// ===== 状态 =====

const activeCategory = ref<string>(props.defaultCategory ?? props.categories[0]?.key ?? 'all')
const searchQuery = ref('')
const expandedId = ref<string | number | null>(null)

// ===== 计算属性 =====

/** 过滤后的 FAQ 列表 */
const filteredItems = computed(() => {
  let result = props.items

  // 分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter((item) => item.category === activeCategory.value)
  }

  // 搜索过滤
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    )
  }

  return result
})

// ===== 方法 =====

/** 选择分类 */
function selectCategory(key: string): void {
  if (key === activeCategory.value) return
  activeCategory.value = key
  expandedId.value = null
  emit('categoryChange', key)
}

/** 切换展开/折叠（手风琴模式） */
function toggleItem(id: string | number): void {
  const isExpanding = expandedId.value !== id
  expandedId.value = isExpanding ? id : null
  emit('toggle', id, isExpanding)
}

/** 搜索输入处理 */
function handleSearch(): void {
  expandedId.value = null
  emit('search', searchQuery.value)
}

/** 清空搜索 */
function clearSearch(): void {
  searchQuery.value = ''
  expandedId.value = null
  emit('search', '')
}

/** 获取分类按钮样式类 */
function getCategoryClasses(key: string): string[] {
  const base = [
    'flex items-center gap-2 w-full px-4 py-2.5 rounded-card text-left text-body',
    'transition-all duration-fast ease',
    'motion-reduce:transition-none',
    'cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
  ]

  if (key === activeCategory.value) {
    base.push('bg-brand-primary-soft text-brand-primary font-semibold')
  } else {
    base.push('text-text-secondary hover:bg-surface-secondary hover:text-text-primary')
  }

  return base
}
</script>
