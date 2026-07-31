import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/admin/layout/index.vue'
import { useAuthStore } from '@/admin/stores/auth'
import { getToken } from '@/shared/utils/token'
import { hasMenuPermission, type MenuPermissionMeta } from '@/admin/utils/admin-permissions'
import { PERMISSION_TOKENS } from '@/admin/config/menuConfig'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页
    {
      path: '/login',
      component: () => import('@/admin/views/login/index.vue'),
    },

    // 管理端主布局
    {
      path: '/admin',
      component: Layout,
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/admin/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'House', requiresAuth: true },
        },
      ],
    },

    // 文章管理
    {
      path: '/admin/article',
      component: Layout,
      redirect: '/admin/article/list',
      meta: { title: '文章管理', icon: 'Document', requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'ArticleList',
          component: () => import('@/admin/views/article/list.vue'),
          meta: { title: '文章列表', icon: 'List', requiresAuth: true },
        },
      ],
    },

    // 栏目管理
    {
      path: '/admin/category',
      component: Layout,
      redirect: '/admin/category/list',
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
      path: '/admin/ads',
      component: Layout,
      redirect: '/admin/ads/types',
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
      path: '/admin/settings',
      component: Layout,
      redirect: '/admin/settings/index',
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
      path: '/admin/content',
      component: Layout,
      redirect: '/admin/dashboard',
      meta: { title: '内容管理', icon: 'Files', requiresAuth: true },
      children: [
        {
          path: ':bid',
          name: 'ContentList',
          component: () => import('@/admin/views/content/ContentList.vue'),
          meta: { title: '内容管理', icon: 'Document', requiresAuth: true },
        },
        {
          path: ':bid/edit/:id',
          name: 'ContentEdit',
          component: () => import('@/admin/views/content/ContentEdit.vue'),
          meta: { title: '编辑文章', requiresAuth: true },
        },
        {
          path: ':bid/create',
          name: 'ContentCreate',
          component: () => import('@/admin/views/content/ContentEdit.vue'),
          meta: { title: '新增文章', requiresAuth: true },
        },
      ],
    },

    // 系统管理
    {
      path: '/admin/system',
      component: Layout,
      redirect: '/admin/system/admins',
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
      path: '/admin/message',
      component: Layout,
      redirect: '/admin/message/list',
      meta: { title: '留言管理', icon: 'ChatDotRound', requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'MessageManagement',
          component: () => import('@/admin/views/message/MessageManagement.vue'),
          meta: { title: '留言管理', icon: 'List', requiresAuth: true },
        },
        {
          path: ':cateid',
          name: 'MessageManagementCategory',
          component: () => import('@/admin/views/message/MessageManagement.vue'),
          meta: { title: '留言分类', icon: 'List', requiresAuth: true },
        },
      ],
    },

    // 日志管理
    {
      path: '/admin/logs',
      component: Layout,
      redirect: '/admin/logs/operations',
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
        {
          path: 'statistics',
          name: 'LogsStatistics',
          component: () => import('@/admin/views/logs/LogsStatistics.vue'),
          meta: { title: '日志统计', icon: 'DataAnalysis', requiresAuth: true },
        },
      ],
    },

    // 图片集管理
    {
      path: '/admin/gallery',
      component: Layout,
      redirect: '/admin/gallery/images',
      meta: { title: '图片集管理', icon: 'Picture', requiresAuth: true },
      children: [
        {
          path: 'images',
          name: 'GalleryManagement',
          component: () => import('@/admin/views/gallery/GalleryManagement.vue'),
          meta: { title: '图片集管理', icon: 'PictureRounded', requiresAuth: true },
        },
        {
          path: 'images2',
          name: 'Gallery2Management',
          component: () => import('@/admin/views/gallery/Gallery2Management.vue'),
          meta: { title: '图片组2管理', icon: 'PictureRounded', requiresAuth: true },
        },
        {
          path: 'images3',
          name: 'Gallery3Management',
          component: () => import('@/admin/views/gallery/Gallery3Management.vue'),
          meta: { title: '图片组3管理', icon: 'PictureRounded', requiresAuth: true },
        },
        {
          path: 'show-info',
          name: 'ShowInfoManagement',
          component: () => import('@/admin/views/gallery/ShowInfoManagement.vue'),
          meta: { title: '展示信息管理', icon: 'InfoFilled', requiresAuth: true },
        },
      ],
    },

    // 模板管理
    {
      path: '/admin/templates',
      component: Layout,
      redirect: '/admin/templates/index',
      meta: { title: '模板管理', icon: 'Files', requiresAuth: true },
      children: [
        {
          path: 'index',
          name: 'TemplateManagement',
          component: () => import('@/admin/views/template/TemplateManagement.vue'),
          meta: { title: '模板管理', icon: 'Document', requiresAuth: true },
        },
      ],
    },

    // 兜底：admin.html 入口页及其他未匹配路径重定向到登录页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

const canAccessAdminRoute = (path: string, admin: any) => {
  if (!admin) return false
  if (admin.type === 1) return true
  if (path === '/admin/dashboard') return true

  const checks: Array<[boolean, boolean]> = [
    [
      path.startsWith('/admin/article'),
      hasMenuPermission(admin, PERMISSION_TOKENS.article as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/category'),
      hasMenuPermission(admin, PERMISSION_TOKENS.category as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/ads'),
      hasMenuPermission(admin, PERMISSION_TOKENS.ads as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/settings'),
      hasMenuPermission(admin, PERMISSION_TOKENS.settings as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/system/admins'),
      hasMenuPermission(admin, PERMISSION_TOKENS.adminManagement as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/system/groups'),
      hasMenuPermission(admin, PERMISSION_TOKENS.groupManagement as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/logs/operations'),
      hasMenuPermission(admin, PERMISSION_TOKENS.operationLogs as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/logs/logins'),
      hasMenuPermission(admin, PERMISSION_TOKENS.loginLogs as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/logs/statistics'),
      hasMenuPermission(admin, PERMISSION_TOKENS.operationLogs as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/templates'),
      hasMenuPermission(admin, PERMISSION_TOKENS.template as MenuPermissionMeta),
    ],
    [
      path.startsWith('/admin/gallery'),
      hasMenuPermission(admin, PERMISSION_TOKENS.gallery as MenuPermissionMeta),
    ],
  ]

  for (const [match, allowed] of checks) {
    if (match) return allowed
  }

  if (path.startsWith('/admin/message')) {
    const cateid = Number(path.split('/').pop())
    const msgTokens = PERMISSION_TOKENS.message as Record<number, MenuPermissionMeta>
    if (cateid in msgTokens) {
      return hasMenuPermission(admin, msgTokens[cateid])
    }
    return Object.values(msgTokens).some((tokens) => hasMenuPermission(admin, tokens))
  }

  if (path.startsWith('/admin/content')) {
    const parts = path.split('/').filter(Boolean)
    const bid = Number(parts[2])
    return Number.isNaN(bid) ? false : hasMenuPermission(admin, { categoryIds: [bid] })
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
      return '/admin/dashboard'
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
        return '/admin/dashboard'
      }

      return
    } else {
      return '/login'
    }
  }
})

export default router
