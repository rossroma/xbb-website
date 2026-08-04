import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页入口 — 重定向到管理后台（独立入口，全页跳转）
    {
      path: '/login',
      redirect: () => {
        window.location.href = '/admin.html'
        // 返回空字符串满足 TypeScript 类型检查（实际不会执行到这里）
        return '/'
      },
    },
    {
      path: '/ui-kit',
      component: () => import('@/client/views/ui-kit/UiKitLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/ui-kit/foundations',
        },
        {
          path: 'foundations',
          name: 'UiKitFoundations',
          component: () => import('@/client/views/ui-kit/FoundationsPage.vue'),
        },
        {
          path: 'components',
          name: 'UiKitComponents',
          component: () => import('@/client/views/ui-kit/ComponentsPage.vue'),
        },
        {
          path: 'business',
          name: 'UiKitBusiness',
          component: () => import('@/client/views/ui-kit/BusinessPage.vue'),
        },
        {
          path: 'layout',
          name: 'UiKitLayout',
          component: () => import('@/client/views/ui-kit/LayoutPage.vue'),
        },
        {
          path: 'composite',
          name: 'UiKitComposite',
          component: () => import('@/client/views/ui-kit/CompositePage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/client/views/ClientLayout.vue'),
      children: [
        {
          path: '',
          name: 'ClientHome',
          component: () => import('@/client/views/Home.vue'),
        },
        {
          path: 'mianfeishiyong',
          name: 'ClientFreeTrial',
          component: () => import('@/client/views/trial/TrialPage.vue'),
          meta: { hideStickyFormBar: true },
        },
        {
          path: 'liuzi',
          name: 'LeadCapturePage',
          component: () => import('@/client/views/liuzi/LeadCapturePage.vue'),
          meta: { hideStickyFormBar: true },
        },
        {
          path: 'chanpin',
          name: 'ClientProducts',
          component: () => import('@/client/views/product/ProductOverview.vue'),
        },
        {
          path: 'lianxiwomen',
          name: 'ClientContact',
          component: () => import('@/client/views/contact/ContactUs.vue'),
        },
        {
          path: 'xiazaizhongxin',
          name: 'ClientDownload',
          component: () => import('@/client/views/download/DownloadCenter.vue'),
        },
        {
          path: 'youzhifuwu',
          name: 'ClientService',
          component: () => import('@/client/views/service/ServicePage.vue'),
        },
        {
          path: 'huobanhezuo',
          name: 'ClientQudao',
          component: () => import('@/client/views/partner/PartnerCooperation.vue'),
        },
        {
          path: 'jianzheyoufen',
          name: 'ClientTuiguang',
          component: () => import('@/client/views/ambassador/AmbassadorPage.vue'),
        },
        {
          path: 'kehuguanli',
          name: 'CustomerManagement',
          component: () => import('@/client/views/customer/CustomerManagement.vue'),
        },
        {
          path: 'xiaoshouguanli',
          name: 'SalesManagement',
          component: () => import('@/client/views/sales/SalesManagement.vue'),
        },
        {
          path: 'gongsidongtai',
          name: 'ClientNews',
          component: () => import('@/client/views/news/NewsPage.vue'),
        },
        {
          path: 'gongsidongtai/:id',
          name: 'ClientNewsDetail',
          component: () => import('@/client/views/news/ArticleDetail.vue'),
        },
        {
          path: 'zhishiwenda',
          name: 'KnowledgeQnA',
          component: () => import('@/client/views/knowledge/KnowledgeQnA.vue'),
        },
        {
          path: 'zhishiwenda/:slug',
          name: 'KnowledgeQnADetail',
          component: () => import('@/client/views/knowledge/KnowledgeArticleDetail.vue'),
        },
        {
          path: 'hangyeanli',
          name: 'ClientCases',
          component: () => import('@/client/views/cases/CasesPage.vue'),
        },
        {
          path: 'hangyeanli/:id',
          name: 'ClientCaseDetail',
          component: () => import('@/client/views/cases/CaseDetail.vue'),
        },
        {
          path: 'yonghuxinsheng',
          name: 'ClientVoices',
          component: () => import('@/client/views/voices/VoicesPage.vue'),
        },
        {
          path: 'gongsijianjie',
          name: 'CompanyIntro',
          component: () => import('@/client/views/about/CompanyIntro.vue'),
        },
        {
          path: 'shichangguanli',
          name: 'MarketManagement',
          component: () => import('@/client/views/market/MarketManagement.vue'),
        },
        {
          path: 'bi',
          name: 'BIAnalysis',
          component: () => import('@/client/views/bi/BIAnalysis.vue'),
        },
        {
          path: 'paas',
          name: 'PaaSPage',
          component: () => import('@/client/views/paas/PaaS.vue'),
        },
        {
          path: 'ai',
          name: 'AISalesAssistant',
          component: () => import('@/client/views/ai/AISalesAssistant.vue'),
        },
        {
          path: 'dingtalk',
          name: 'DingTalkPage',
          component: () => import('@/client/views/dingtalk/DingTalkPage.vue'),
        },
        {
          path: 'feishubanben',
          name: 'FeishuPage',
          component: () => import('@/client/views/feishu/FeishuPage.vue'),
        },
        {
          path: 'qiweibanben',
          name: 'QiweiPage',
          component: () => import('@/client/views/qiwei/QiweiPage.vue'),
        },
        // 404 兜底 — 放在 ClientLayout 内以复用头尾公共组件
        {
          path: ':pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/client/views/NotFound.vue'),
        },
      ],
    },
  ],
})

// 路由切换前，瞬间将滚动容器归零，避免过渡动画期间出现滚动条跳动
router.beforeEach((to, _from) => {
  // hash 跳转保留给 ClientLayout 的 scrollToHash 处理
  if (to.hash) return

  const container = document.querySelector('.client-layout')
  if (!(container instanceof HTMLElement)) return

  // 临时禁用 CSS scroll-behavior: smooth，确保 scrollTop 赋值瞬间生效
  container.style.scrollBehavior = 'auto'
  container.scrollTop = 0
  // 强制重排，确保浏览器在 auto 模式下处理滚动
  void container.offsetHeight
  container.style.scrollBehavior = ''
})

export default router
