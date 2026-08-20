<template>
  <header
    class="sticky top-0 z-100 backdrop-blur-[18px] bg-white/78 border-b border-border-default"
  >
    <div
      class="flex items-center justify-between min-h-16 gap-4 w-[min(95%,calc(100%-48px))] mx-auto"
    >
      <!-- Logo -->
      <RouterLink to="/" class="shrink-0">
        <img :src="store.logo" alt="销帮帮" class="h-8 lg:h-8 w-auto object-contain" />
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-1">
        <ul class="flex items-center gap-1 list-none m-0 p-0">
          <li
            v-for="item in navItems"
            :key="item.label"
            class="relative"
            @mouseenter="openMenu(item)"
            @mouseleave="closeMenu"
          >
            <!-- 有子菜单的一级菜单：不可点击穿透，仅展开/收起下拉 -->
            <span
              v-if="hasSubmenu(item)"
              :class="[
                'inline-flex items-center gap-1 px-4 py-2 rounded-pill text-small font-medium transition-colors duration-fast motion-reduce:transition-none whitespace-nowrap cursor-pointer',
                isActive(item)
                  ? 'text-brand-primary bg-brand-primary-soft'
                  : 'text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft/60',
              ]"
            >
              {{ item.label }}
              <Down
                class="w-3 h-3 transition-transform duration-fast motion-reduce:transition-none"
                :class="{ 'rotate-180': activeMenu === item.label }"
                :stroke-width="2.5"
                aria-hidden="true"
              />
            </span>

            <!-- 无子菜单的项：正常路由跳转 -->
            <RouterLink
              v-else
              :to="getItemTo(item)"
              :class="[
                'inline-flex items-center gap-1 px-4 py-2 rounded-pill text-small font-medium transition-colors duration-fast motion-reduce:transition-none whitespace-nowrap no-underline',
                isActive(item)
                  ? 'text-brand-primary bg-brand-primary-soft'
                  : 'text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft/60',
              ]"
            >
              {{ item.label }}
            </RouterLink>

            <!-- Mega Menu（产品中心） -->
            <div
              v-if="item.mega && activeMenu === item.label"
              class="absolute top-full left-0 bg-white rounded-card shadow-default border border-border-subtle z-50 min-w-200"
            >
              <div class="flex p-6 gap-8">
                <div class="w-52 shrink-0">
                  <div
                    class="text-caption font-semibold text-text-tertiary uppercase tracking-wider mb-4"
                  >
                    产品概览
                  </div>
                  <div class="grid gap-2">
                    <template v-for="entry in item.mega.overview" :key="entry.label">
                      <RouterLink
                        v-if="!isExternal(entry)"
                        :to="getItemTo(entry)"
                        class="block text-left px-4 py-2.5 rounded-inner text-small font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-fast motion-reduce:transition-none no-underline"
                        @click="closeMenu"
                      >
                        <span class="block text-small font-semibold text-text-primary">{{
                          entry.label
                        }}</span>
                        <span class="block text-caption text-text-tertiary mt-0.5">{{
                          entry.desc
                        }}</span>
                      </RouterLink>
                      <a
                        v-else
                        :href="entry.to"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block text-left px-4 py-2.5 rounded-inner text-small font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-fast motion-reduce:transition-none no-underline"
                      >
                        <span class="block text-small font-semibold text-text-primary">{{
                          entry.label
                        }}</span>
                        <span class="block text-caption text-text-tertiary mt-0.5">{{
                          entry.desc
                        }}</span>
                      </a>
                    </template>
                  </div>
                </div>
                <div class="flex-1">
                  <div
                    class="text-caption font-semibold text-text-tertiary uppercase tracking-wider mb-4"
                  >
                    功能模块
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <RouterLink
                      v-for="(entry, index) in item.mega.features"
                      :key="entry.label"
                      :to="getItemTo(entry)"
                      class="flex items-start gap-3 px-3 py-2.5 rounded-inner text-left transition-colors duration-fast motion-reduce:transition-none hover:bg-surface-secondary no-underline"
                      @click="closeMenu"
                    >
                      <component
                        :is="entry.icon.component"
                        v-if="entry.icon?.component"
                        :size="entry.icon.width"
                        :style="{ color: featureIconColors[index % featureIconColors.length] }"
                        class="shrink-0 mt-0.5"
                      />
                      <img
                        v-else-if="entry.icon?.src"
                        :src="entry.icon.src"
                        :style="{
                          width: entry.icon.width + 'px',
                          height: entry.icon.height + 'px',
                          marginRight: (entry.icon.marginRight ?? 0) + 'px',
                          marginLeft: (entry.icon.marginLeft ?? 0) + 'px',
                        }"
                        :alt="entry.label"
                        class="shrink-0 mt-0.5"
                      />
                      <div>
                        <span class="block text-small font-semibold text-text-primary">{{
                          entry.label
                        }}</span>
                        <span class="block text-caption text-text-tertiary mt-0.5">{{
                          entry.desc
                        }}</span>
                      </div>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

            <!-- Regular Dropdown -->
            <div
              v-else-if="hasSubmenu(item) && activeMenu === item.label"
              class="absolute top-full left-0 bg-white rounded-card shadow-default border border-border-subtle z-50 min-w-40 py-2"
            >
              <ul class="list-none m-0 p-0">
                <li v-for="entry in item.children" :key="entry.label">
                  <RouterLink
                    v-if="!isExternal(entry)"
                    :to="getItemTo(entry)"
                    class="block w-full text-left px-5 py-2.5 text-small text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-fast motion-reduce:transition-none whitespace-nowrap no-underline"
                    @click="closeMenu"
                  >
                    {{ entry.label }}
                  </RouterLink>
                  <a
                    v-else
                    :href="entry.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block w-full text-left px-5 py-2.5 text-small text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-fast motion-reduce:transition-none whitespace-nowrap no-underline"
                  >
                    {{ entry.label }}
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center shrink-0">
        <div class="hidden lg:inline-flex items-center mr-4 gap-2.5">
          <a
            :href="`tel:${displayHotline}`"
            class="group relative flex items-center justify-center w-6 h-6 rounded-full bg-brand-neutral shadow-header-phone-icon no-underline"
            :aria-label="`客服电话 ${displayHotline}`"
          >
            <PhoneTelephone :size="16" class="text-white" aria-hidden="true" />
            <span
              class="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-inner bg-text-primary px-3 py-1.5 text-caption font-semibold text-white opacity-0 shadow-default transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {{ displayHotline }}
            </span>
          </a>
        </div>
        <Button
          href="https://appwebfront.xbongbong.com/stand-alone-login.html#/"
          target="_blank"
          variant="outline"
          size="md"
          radius="lg"
          class="hidden mr-3 lg:inline-flex"
        >
          登录
        </Button>
        <Button
          :to="trialRoute"
          variant="primary"
          size="md"
          radius="lg"
          class="hidden mr-3 lg:inline-flex"
        >
          免费试用
        </Button>

        <button
          type="button"
          class="lg:hidden rounded-inner hover:bg-surface-secondary transition-colors duration-fast motion-reduce:transition-none"
          @click="mobileMenuOpen = true"
          aria-label="打开菜单"
        >
          <Hamburger :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Teleport to="body">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-200 bg-brand-neutral/50"
        @click="mobileMenuOpen = false"
      />
      <div
        v-if="mobileMenuOpen"
        class="fixed top-0 right-0 z-210 w-80 h-full bg-white shadow-default overflow-y-auto"
      >
        <div class="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
          <strong class="text-body text-text-primary">页面导航</strong>
          <button
            type="button"
            class="p-1 rounded-inner hover:bg-surface-secondary"
            @click="mobileMenuOpen = false"
            aria-label="关闭菜单"
          >
            <CloseSmall :size="20" aria-hidden="true" />
          </button>
        </div>
        <nav class="p-4">
          <ul class="list-none m-0 p-0">
            <li v-for="item in navItems" :key="`mobile-${item.label}`" class="mb-1">
              <RouterLink
                :to="getItemTo(item)"
                class="block w-full text-left px-4 py-3 rounded-inner text-small font-medium text-text-primary hover:bg-surface-secondary transition-colors duration-fast motion-reduce:transition-none no-underline"
                @click="mobileMenuOpen = false"
              >
                <span class="block">{{ item.label }}</span>
                <small class="block text-caption text-text-tertiary mt-0.5">{{ item.desc }}</small>
              </RouterLink>
              <ul
                v-if="item.mega || hasSubmenu(item)"
                class="ml-4 border-l border-border-subtle list-none m-0 p-0"
              >
                <li v-for="entry in getMobileChildren(item)" :key="`${item.label}-${entry.label}`">
                  <RouterLink
                    v-if="!isExternal(entry)"
                    :to="getItemTo(entry)"
                    class="block w-full text-left px-4 py-2 text-small text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-inner transition-colors duration-fast motion-reduce:transition-none no-underline"
                    @click="mobileMenuOpen = false"
                  >
                    {{ entry.label }}
                  </RouterLink>
                  <a
                    v-else
                    :href="entry.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block w-full text-left px-4 py-2 text-small text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-inner transition-colors duration-fast motion-reduce:transition-none no-underline"
                    @click="mobileMenuOpen = false"
                  >
                    {{ entry.label }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/client/components/ui/Button.vue'
import { CloseSmall, Down, Hamburger, PhoneTelephone } from '@/client/components/ui/remixIcons'
import type { HeaderNavItem, HeaderNavNode } from '@/client/data/siteNavData'
import { useSiteSettingsStore } from '@/client/stores/siteSettings'

const route = useRoute()
const mobileMenuOpen = ref(false)
const activeMenu = ref('')
const store = useSiteSettingsStore()

const props = withDefaults(
  defineProps<{
    navItems?: readonly HeaderNavItem[]
    trialRoute?: string
    hotline?: string
  }>(),
  {
    navItems: () => [],
    trialRoute: '/',
    hotline: '',
  },
)

const displayHotline = computed(() => store.tel || props.hotline)

/** Mega 菜单功能模块面形图标色板（按顺序循环取色） */
const featureIconColors = ['#4361ee', '#7c3aed', '#ea580c', '#059669', '#dc2626', '#0891b2']

const currentHash = computed(() => route.hash)
const hasSubmenu = (item: HeaderNavItem) => Boolean(item.children?.length || item.mega)
const getMobileChildren = (item: HeaderNavItem) => {
  if (item.mega) return [...item.mega.overview, ...item.mega.features]
  return item.children ?? []
}
const openMenu = (item: HeaderNavItem) => {
  activeMenu.value = hasSubmenu(item) ? item.label : ''
}
const closeMenu = () => {
  activeMenu.value = ''
}
/** 判断导航节点是否匹配当前路由 */
const isNodeActive = (node: HeaderNavNode): boolean => {
  if (node.hash) return route.path === '/' && currentHash.value === node.hash
  return node.to === '/' ? route.path === '/' && !currentHash.value : route.path === node.to
}

/** 判断导航项（含子菜单）是否处于激活状态 */
const isActive = (item: HeaderNavItem): boolean => {
  // 自身匹配
  if (isNodeActive(item)) return true

  // 检查二级子菜单（children）
  if (item.children?.length) {
    if (item.children.some(isNodeActive)) return true
  }

  // 检查 Mega 菜单（产品中心）
  if (item.mega) {
    const allMega = [...item.mega.overview, ...item.mega.features]
    if (allMega.some(isNodeActive)) return true
  }

  return false
}

/** 判断导航项是否为外部链接 */
const isExternal = (item: HeaderNavNode) => /^https?:\/\//.test(item.to || '')

/** 获取 RouterLink 的 to 属性值（处理 hash 路由） */
const getItemTo = (item: HeaderNavNode): string | { path: string; hash: string } => {
  if (item.hash) return { path: '/', hash: item.hash }
  return item.to || '/'
}
</script>
