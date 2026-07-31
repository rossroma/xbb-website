<template>
  <div
    :class="[
      'grid h-screen transition-all duration-normal',
      collapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[220px_1fr]',
    ]"
  >
    <!-- ====== Mobile: Horizontal Tab Bar ====== -->
    <div
      class="lg:hidden sticky top-0 z-10 bg-surface-primary border-b border-border-subtle px-4 py-3 overflow-x-auto"
    >
      <nav class="flex gap-2 whitespace-nowrap pr-8" style="-webkit-overflow-scrolling: touch">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="[
            'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast shrink-0',
            isCategoryActive(cat)
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
          ]"
          @click="navigateToCategory(cat)"
        >
          {{ cat.label }}
        </button>
      </nav>
    </div>

    <!-- ====== Desktop: Sticky Sidebar ====== -->
    <aside
      :class="[
        'flex-col overflow-y-auto py-10 border-r border-border-subtle transition-all duration-normal',
        collapsed ? 'hidden' : 'hidden lg:flex',
      ]"
    >
      <nav class="pr-6 flex-1">
        <h2 class="text-[13px] font-semibold text-text-tertiary uppercase tracking-wider mb-4 px-1">
          组件目录
        </h2>
        <ul class="flex flex-col gap-4">
          <li v-for="cat in categories" :key="cat.id">
            <button
              :class="[
                'w-full text-left px-4 py-2.5 rounded-inner text-[13px] font-semibold transition-colors duration-fast uppercase tracking-wide',
                isCategoryActive(cat)
                  ? 'bg-brand-primary-soft text-brand-primary'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-surface-secondary',
              ]"
              @click="navigateToCategory(cat)"
            >
              {{ cat.label }}
            </button>
            <ul class="flex flex-col gap-0.5 mt-1 pl-2">
              <li v-for="item in cat.items" :key="item.id">
                <button
                  :class="[
                    'w-full text-left px-4 py-2 rounded-inner text-small transition-colors duration-fast',
                    activeSection === item.id
                      ? 'bg-brand-primary-soft text-brand-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary',
                  ]"
                  @click="scrollToSection(item.id)"
                >
                  {{ item.label }}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- ====== Collapsed Sidebar Toggle ====== -->
    <button
      v-if="collapsed"
      class="fixed left-4 top-4 z-20 inline-flex items-center justify-center w-9 h-9 rounded-card border border-border-default bg-surface-primary text-text-secondary shadow-subtle hover:text-brand-primary hover:border-brand-primary transition-all duration-fast"
      title="展开侧边栏"
      @click="collapsed = false"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- ====== Collapse Toggle（侧边栏展开时固定在左上角）===== -->
    <button
      v-if="!collapsed"
      class="fixed left-59 top-4 z-20 hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-card border border-border-default bg-surface-primary text-text-tertiary hover:text-brand-primary hover:border-brand-primary transition-all duration-fast"
      title="折叠侧边栏"
      @click="collapsed = true"
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- ====== Main Content ====== -->
    <div class="lg:overflow-y-auto py-6 lg:py-10 lg:pl-8">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sections, categoryMeta, categoryBySectionId, type CategoryId } from './registry'

interface CategoryItem {
  id: string
  label: string
}

interface Category {
  id: string
  label: string
  path: string
  items: CategoryItem[]
}

// 从 registry 动态生成 categories
const categories = computed<Category[]>(() => {
  return (Object.entries(categoryMeta) as [CategoryId, (typeof categoryMeta)[CategoryId]][]).map(
    ([catId, meta]) => ({
      id: meta.id,
      label: meta.label,
      path: meta.path,
      items: sections.filter((s) => s.category === catId).map((s) => ({ id: s.id, label: s.name })),
    }),
  )
})

const route = useRoute()
const router = useRouter()
const activeSection = ref<string>('')
const collapsed = ref(false)

// 路由变化后，如果 URL 有 hash，滚动到对应 section
watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    const hash = route.hash
    if (hash) {
      const id = hash.replace('#', '')
      activeSection.value = id
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  },
  { immediate: true },
)

function isCategoryActive(cat: Category): boolean {
  return route.path === cat.path
}

function navigateToCategory(cat: Category) {
  router.push(cat.path)
}

function scrollToSection(id: string) {
  activeSection.value = id
  // 从 registry 查找该 section 所属的分类
  const catId = categoryBySectionId.get(id)
  if (!catId) return

  const targetPath = categoryMeta[catId].path

  // 如果当前页面不是目标页面，先导航
  if (route.path !== targetPath) {
    router.push({ path: targetPath, hash: `#${id}` })
    return
  }

  // 在当前页面，直接滚动
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    router.replace({ hash: `#${id}` })
  }
}
</script>
