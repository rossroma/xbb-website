import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/admin/layout/index.vue'
import { useAuthStore } from '@/admin/stores/auth'
import { getToken } from '@/shared/utils/token'
import { hasMenuPermission, getPermissionContext, type MenuPermissionMeta } from '@/admin/utils/admin-permissions'
import { PERMISSION_TOKENS } from '@/admin/config/menuConfig'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页
    {
      path: '/login',
      component: () => import('@/admin/views/login/index.vue'),
    },

    // 管理端主布局
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/admin/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'House', requiresAuth: true },
        },
      ],
    },

    // 栏目管理
    {
      path: '/category',
      component: Layout,
      redirect: '/category/list',
      meta: { title: '栏目管理', icon: 'Folder', requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'CategoryList',
          component: () => import('@/admin/views/category/list.vue'),
          meta: { title: '栏目列表', icon: 'List', requiresAuth: true },
        },
      ],
    },

    // 广告管理
    {
      path: '/ads',
      component: Layout,
      redirect: '/ads/types',
      meta: { title: '广告管理', icon: 'Picture', requiresAuth: true },
      children: [
        {
          path: 'types',
          name: 'AdsTypes',
          component: () => import('@/admin/views/ads/types.vue'),
          meta: { title: '广告位管理', icon: 'Setting', requiresAuth: true },
        },
        {
          path: 'types/:bid/items',
          name: 'AdsItemsByType',
          component: () => import('@/admin/views/ads/list.vue'),
          meta: { title: '广告信息管理', icon: 'List', requiresAuth: true },
        },
      ],
    },

    // 系统设置
    {
      path: '/settings',
      component: Layout,
      redirect: '/settings/index',
      meta: { title: '系统设置', icon: 'Setting', requiresAuth: true },
      children: [
        {
          path: 'index',
          name: 'Settings',
          component: () => import('@/admin/views/settings/index.vue'),
          meta: { title: '系统设置', icon: 'Setting', requiresAuth: true },
        },
      ],
    },

    // 内容管理
    {
      path: '/content',
      component: Layout,
      meta: { title: '内容管理', icon: 'Files', requiresAuth: true },
      children: [
        {
          path: '',
          name: 'ContentList',
          component: () => import('@/admin/views/content/ContentList.vue'),
          meta: { title: '内容管理', requiresAuth: true },
        },
        {
          path: 'edit/:id',
          name: 'ContentEdit',
          component: () => import('@/admin/views/content/ContentEdit.vue'),
          meta: { title: '编辑文章', requiresAuth: true },
        },
        {
          path: 'create',
          name: 'ContentCreate',
          component: () => import('@/admin/views/content/ContentEdit.vue'),
          meta: { title: '新增文章', requiresAuth: true },
        },
        {
          path: 'trash',
          name: 'ContentTrash',
          component: () => import('@/admin/views/content/ContentTrash.vue'),
          meta: { title: '回收站', requiresAuth: true },
        },
      ],
    },

    // 系统管理
    {
      path: '/system',
      component: Layout,
      redirect: '/system/admins',
      meta: { title: '系统管理', icon: 'User', requiresAuth: true },
      children: [
        {
          path: 'admins',
          name: 'AdminManagement',
          component: () => import('@/admin/views/system/AdminManagement.vue'),
          meta: { title: '管理员管理', icon: 'UserFilled', requiresAuth: true },
        },
        {
          path: 'groups',
          name: 'GroupManagement',
          component: () => import('@/admin/views/system/GroupManagement.vue'),
          meta: { title: '用户组管理', icon: 'Avatar', requiresAuth: true },
        },
      ],
    },

    // 留言管理
    {
      path: '/message',
      component: Layout,
      meta: { title: '留言管理', icon: 'ChatDotRound', requiresAuth: true },
      children: [
        {
          path: '',
          name: 'MessageManagement',
          component: () => import('@/admin/views/message/MessageManagement.vue'),
          meta: { title: '留言管理', icon: 'List', requiresAuth: true },
        },
        {
          path: ':cateid',
          name: 'MessageManagementCategory',
          component: () => import('@/admin/views/message/MessageManagement.vue'),
          meta: { title: '留言管理', icon: 'List', requiresAuth: true },
        },
      ],
    },

    // 日志管理
    {
      path: '/logs',
      component: Layout,
      redirect: '/logs/operations',
      meta: { title: '日志管理', icon: 'Document', requiresAuth: true },
      children: [
        {
          path: 'operations',
          name: 'OperationLogs',
          component: () => import('@/admin/views/logs/OperationLogs.vue'),
          meta: { title: '操作日志', icon: 'List', requiresAuth: true },
        },
        {
          path: 'logins',
          name: 'LoginLogs',
          component: () => import('@/admin/views/logs/LoginLogs.vue'),
          meta: { title: '登录日志', icon: 'User', requiresAuth: true },
        },
      ],
    },

    
    // 旧路由重定向（/admin/* → /*）
    // 保留对旧书签和外链的兼容
    {
      path: '/admin/:pathMatch(.*)*',
      redirect: (to) => {
        const newPath = to.path.replace(/^\/admin/, '') || '/dashboard'
        return newPath
      },
    },

    // 后台 404 兜底 — 嵌套在 Layout 内以保留侧边栏和顶栏
    {
      path: '/:pathMatch(.*)*',
      component: Layout,
      children: [
        {
          path: '',
          name: 'AdminNotFound',
          component: () => import('@/admin/views/NotFound.vue'),
        },
      ],
    },
  ],
})

const canAccessAdminRoute = (path: string, admin: any) => {
  if (!admin) return false
  if (admin.type === 1) return true
  if (path === '/dashboard') return true

  const checks: Array<[boolean, boolean]> = [
    [
      path.startsWith('/category'),
      hasMenuPermission(admin, PERMISSION_TOKENS.category as MenuPermissionMeta),
    ],
    [
      path.startsWith('/ads'),
      hasMenuPermission(admin, PERMISSION_TOKENS.ads as MenuPermissionMeta),
    ],
    [
      path.startsWith('/settings'),
      hasMenuPermission(admin, PERMISSION_TOKENS.settings as MenuPermissionMeta),
    ],
    [
      path.startsWith('/system/admins'),
      hasMenuPermission(admin, PERMISSION_TOKENS.adminManagement as MenuPermissionMeta),
    ],
    [
      path.startsWith('/system/groups'),
      hasMenuPermission(admin, PERMISSION_TOKENS.groupManagement as MenuPermissionMeta),
    ],
    [
      path.startsWith('/logs/operations'),
      hasMenuPermission(admin, PERMISSION_TOKENS.operationLogs as MenuPermissionMeta),
    ],
    [
      path.startsWith('/logs/logins'),
      hasMenuPermission(admin, PERMISSION_TOKENS.loginLogs as MenuPermissionMeta),
    ],
      ]

  for (const [match, allowed] of checks) {
    if (match) return allowed
  }

  if (path.startsWith('/message')) {
    const msgTokens = PERMISSION_TOKENS.message as Record<number, MenuPermissionMeta>
    const allMsgTokens = Object.values(msgTokens)
    return allMsgTokens.some(token => hasMenuPermission(admin, token))
  }

  if (path.startsWith('/content')) {
    const parts = path.split('/').filter(Boolean)
    // /content — 超级管理员直接放行，普通管理员检查是否有任何分类权限
    if (parts.length === 1) {
      const { isSuperAdmin, categorySet } = getPermissionContext(admin)
      if (isSuperAdmin) return true
      return categorySet.size > 0
    }
    // /content/trash — 回收站需要与内容管理相同的权限
    if (parts[1] === 'trash') {
      const { isSuperAdmin, categorySet } = getPermissionContext(admin)
      if (isSuperAdmin) return true
      return categorySet.size > 0
    }
    // /content/edit/:id 或 /content/create — 允许访问（后端校验）
    return true
  }

  return false
}

// 路由守卫
router.beforeEach(async (to) => {
  const token = getToken()
  const authStore = useAuthStore()

  // 登录页
  if (to.path === '/login') {
    if (token) {
      return '/dashboard'
    }
    return
  }

  // 管理端路由需要认证
  if (to.meta.requiresAuth) {
    if (token) {
      if (!authStore.admin) {
        try {
          await authStore.fetchProfile()
        } catch {
          return '/login'
        }
      }

      if (!canAccessAdminRoute(to.path, authStore.admin)) {
        return '/dashboard'
      }

      return
    } else {
      return '/login'
    }
  }
})

export default router