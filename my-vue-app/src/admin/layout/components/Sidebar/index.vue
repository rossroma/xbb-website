<template>
  <div class="sidebar">
    <div class="logo-container">
      <h1 class="logo-title">{{ companyName }}</h1>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <SidebarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSiteInfo } from '@/shared/api/settings'
import { useAuthStore } from '@/admin/stores/auth'
import { hasMenuPermission, getPermissionContext, type MenuPermissionMeta } from '@/admin/utils/admin-permissions'
import { PERMISSION_TOKENS } from '@/admin/config/menuConfig'

const SidebarItem = defineAsyncComponent(() => import('./SidebarItem.vue'))

const route = useRoute()
const authStore = useAuthStore()
const companyName = ref('销帮帮CRM')

const activeMenu = computed(() => route.path)

const loadCompanyName = async () => {
  try {
    const result = await getSiteInfo()
    companyName.value = result?.company || '销帮帮CRM'
  } catch {
    companyName.value = '销帮帮CRM'
  }
}

const contentChildren = computed(() => {
  const { isSuperAdmin, ruleSet, categorySet } = getPermissionContext(authStore.admin)
  // 内容菜单可见性：超级管理员直接放行，或拥有 content_manage.* 权限，或拥有分类权限
  const hasContentRule = PERMISSION_TOKENS.content.ruleTokens.some(token => ruleSet.has(token))
  const hasCategoryAccess = categorySet.size > 0
  if (!isSuperAdmin && !hasContentRule && !hasCategoryAccess) return []
  return [
    {
      path: '/content',
      meta: { title: '内容管理', icon: 'Document' },
    },
  ]
})

const messageChildren = [
  {
    path: '/message',
    meta: { title: '留言管理', icon: 'List' },
    permission: {
      ruleTokens: Array.from(Object.values(PERMISSION_TOKENS.message)).flatMap(
        (m) => m.ruleTokens,
      ),
    },
  },
]

const filterMenus = (items: any[]): any[] => {
  return items
    .map((item) => {
      const children = item.children ? filterMenus(item.children) : undefined
      const selfVisible = hasMenuPermission(
        authStore.admin,
        item.permission as MenuPermissionMeta | undefined,
      )

      if (children) {
        if (children.length === 0) {
          return item.permission && selfVisible ? { ...item, children } : null
        }
        return { ...item, children }
      }

      return selfVisible ? item : null
    })
    .filter(Boolean) as any[]
}

const routes = computed(() =>
  filterMenus([
    {
      path: '/dashboard',
      meta: { title: '首页', icon: 'House' },
      hidden: false,
    },
    {
      path: '/content',
      meta: { title: '内容管理', icon: 'Files' },
      children: contentChildren.value,
    },
    {
      path: '/category',
      meta: { title: '栏目管理', icon: 'Folder' },
      permission: PERMISSION_TOKENS.category,
      children: [
        {
          path: '/category/list',
          meta: { title: '栏目列表', icon: 'List' },
          permission: PERMISSION_TOKENS.category,
        },
      ],
    },
    {
      path: '/ads',
      meta: { title: '广告管理', icon: 'Picture' },
      permission: PERMISSION_TOKENS.ads,
      children: [
        {
          path: '/ads/types',
          meta: { title: '广告位管理', icon: 'Setting' },
          permission: PERMISSION_TOKENS.ads,
        },
      ],
    },
    {
      path: '/settings',
      meta: { title: '系统设置', icon: 'Setting' },
      permission: PERMISSION_TOKENS.settings,
      children: [
        {
          path: '/settings/index',
          meta: { title: '系统设置', icon: 'Setting' },
          permission: PERMISSION_TOKENS.settings,
        },
      ],
    },
    {
      path: '/system',
      meta: { title: '系统管理', icon: 'User' },
      permission: {
        ruleTokens: [
          ...PERMISSION_TOKENS.adminManagement.ruleTokens,
          ...PERMISSION_TOKENS.groupManagement.ruleTokens,
          ...PERMISSION_TOKENS.operationLogs.ruleTokens,
          ...PERMISSION_TOKENS.loginLogs.ruleTokens,
          ...PERMISSION_TOKENS.smsLogs.ruleTokens,
        ],
      },
      children: [
        {
          path: '/system/admins',
          meta: { title: '管理员管理', icon: 'UserFilled' },
          permission: PERMISSION_TOKENS.adminManagement,
        },
        {
          path: '/system/groups',
          meta: { title: '用户组管理', icon: 'Avatar' },
          permission: PERMISSION_TOKENS.groupManagement,
        },
        {
          path: '/logs/operations',
          meta: { title: '操作日志', icon: 'List' },
          permission: PERMISSION_TOKENS.operationLogs,
        },
        {
          path: '/logs/logins',
          meta: { title: '登录日志', icon: 'User' },
          permission: PERMISSION_TOKENS.loginLogs,
        },
        {
          path: '/logs/sms',
          meta: { title: '短信日志', icon: 'ChatDotSquare' },
          permission: PERMISSION_TOKENS.smsLogs,
        },
      ],
    },
    {
      path: '/message',
      meta: { title: '留言管理', icon: 'ChatDotRound' },
      permission: {
        ruleTokens: Array.from(Object.values(PERMISSION_TOKENS.message)).flatMap(
          (m) => m.ruleTokens,
        ),
      },
      children: messageChildren,
    },
        ]),
)

onMounted(() => {
  loadCompanyName()
})
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b2f3a;
}

.logo-title {
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.el-scrollbar {
  flex: 1;
}

:deep(.el-menu) {
  border: none;
}
</style>
