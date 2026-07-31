<template>
  <div class="flex flex-col gap-6">
    <!-- 分类四：Layout 组件                                                    -->
    <!-- ================================================================ -->
    <div id="cat-layout" class="scroll-mt-14 lg:scroll-mt-0 mt-6">
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded bg-status-warning-soft text-status-warning text-caption font-bold uppercase tracking-wider"
          >Layout 组件</span
        >
      </div>
    </div>

    <!-- ===== SiteHeader ===== -->
    <Card id="site-header" class="scroll-mt-14 lg:scroll-mt-0 !p-0 overflow-hidden">
      <div class="p-6 pb-0">
        <h2 class="text-h2 font-bold text-text-primary mb-1">SiteHeader 网站头部</h2>
        <p class="text-small text-text-secondary mb-4">
          固定顶部导航栏，含 Logo、产品中心 Mega Menu、下拉菜单、移动端抽屉、CTA 按钮。
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant="brand">sticky top-0</Badge>
          <Badge variant="accent">Mega Menu</Badge>
          <Badge variant="info">移动端抽屉</Badge>
          <Badge variant="success">RouterLink 支持</Badge>
        </div>
      </div>
      <div class="border-t border-border-subtle">
        <SiteHeader :nav-items="siteNavItems" :trial-route="trialRoute" :hotline="siteHotline" />
      </div>
    </Card>

    <!-- ===== SiteFooter ===== -->
    <Card id="site-footer" class="scroll-mt-14 lg:scroll-mt-0 !p-0 overflow-hidden">
      <div class="p-6 pb-0">
        <h2 class="text-h2 font-bold text-text-primary mb-1">SiteFooter 网站底部</h2>
        <p class="text-small text-text-secondary mb-4">
          6 列导航网格，CTA 区域，社交图标（QR 码弹出），版权信息，渐变背景。
        </p>
        <div class="flex flex-wrap gap-2 mb-4">
          <Badge variant="brand">径向渐变背景</Badge>
          <Badge variant="accent">QR 码弹出</Badge>
          <Badge variant="info">响应式 6→2 列</Badge>
          <Badge variant="success">Button 组件</Badge>
        </div>
      </div>
      <div class="border-t border-border-subtle">
        <SiteFooter
          :footer-columns="footerColumns"
          :socials="socials"
          :hotline="footerHotline"
          :email="footerEmail"
          :copyright="copyrightText"
        />
      </div>
    </Card>

    <!-- ===== FloatingToolbar ===== -->
    <Card id="floating-toolbar" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">FloatingToolbar 浮动工具栏</h2>
      <p class="text-small text-text-secondary mb-6">
        右侧固定悬浮，客服入口 + 微信咨询 + 热线 + 体验 + 回到顶部，移动端隐藏。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">fixed 定位</Badge>
        <Badge variant="accent">hover 弹出</Badge>
        <Badge variant="info">max-[780px]:hidden</Badge>
        <Badge variant="warning">需在页面层级使用</Badge>
      </div>
      <div class="relative min-h-80 bg-surface-secondary rounded-inner flex items-center">
        <FloatingToolbar
          :top-service="{
            icon: floatingToolbarData.serviceIcon,
            label: '在线客服',
            link: floatingToolbarData.customerServiceLink,
          }"
          :items="floatingToolbarData.items"
        />
        <p class="text-small text-text-tertiary mx-auto text-center">
          该组件为 fixed 定位（右侧悬浮），<br />实际使用时在整个页面层级渲染。
        </p>
      </div>
    </Card>

    <!-- ===== StickyFormBar ===== -->
    <Card id="sticky-form-bar" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">StickyFormBar 底部固定表单栏</h2>
      <p class="text-small text-text-secondary mb-6">
        底部固定试用表单，企业名称 + 手机号 + 验证码 + 提交，max-md 隐藏。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">fixed bottom-0</Badge>
        <Badge variant="accent">表单验证</Badge>
        <Badge variant="info">max-md:hidden</Badge>
        <Badge variant="warning">需在页面层级使用</Badge>
      </div>
      <div class="relative min-h-20 bg-surface-secondary rounded-inner">
        <StickyFormBar />
        <p class="text-[13px] text-text-tertiary text-center pt-2">
          该组件为 fixed 定位（底部），<br />实际使用时整个页面层级渲染。
        </p>
      </div>
    </Card>

    <!-- ===== Breadcrumb ===== -->
    <Card id="breadcrumb" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">Breadcrumb 面包屑</h2>
      <p class="text-small text-text-secondary mb-6">
        页面面包屑导航，支持多级路由链接，末级为当前页纯文本展示。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">router-link</Badge>
        <Badge variant="accent">多级层级</Badge>
        <Badge variant="info">无障碍</Badge>
      </div>
      <div class="space-y-4 bg-surface-secondary rounded-inner p-6">
        <div>
          <p class="text-caption text-text-tertiary mb-2">三级面包屑（含首页图标）：</p>
          <Breadcrumb
            :items="[
              { label: '首页', to: '/' },
              { label: '产品中心', to: '/product' },
              { label: 'CRM 系统' },
            ]"
            spacing="none"
            show-home-icon
          />
        </div>
        <div>
          <p class="text-caption text-text-tertiary mb-2">两级面包屑：</p>
          <Breadcrumb :items="[{ label: '首页', to: '/' }, { label: '关于我们' }]" spacing="none" />
        </div>
      </div>
    </Card>

    <!-- ===== PageNav ===== -->
    <Card id="page-nav" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">PageNav 上下翻页</h2>
      <p class="text-small text-text-secondary mb-6">
        详情页底部上下篇导航，支持上一篇/下一篇链接。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">上下篇导航</Badge>
        <Badge variant="info">链接为空时隐藏</Badge>
      </div>
      <div class="space-y-6 bg-surface-secondary rounded-inner p-6">
        <div>
          <p class="text-caption text-text-tertiary mb-2">完整状态（有上下篇）：</p>
          <PageNav
            prev-link="/demo/prev"
            prev-title="上一篇文章标题示例"
            next-link="/demo/next"
            next-title="下一篇文章标题示例"
          />
        </div>
        <div>
          <p class="text-caption text-text-tertiary mb-2">仅有下一篇（第一篇）：</p>
          <PageNav next-link="/demo/next" next-title="下一篇文章标题示例" />
        </div>
        <div>
          <p class="text-caption text-text-tertiary mb-2">仅有上一篇（最后一篇）：</p>
          <PageNav prev-link="/demo/prev" prev-title="上一篇文章标题示例" />
        </div>
      </div>
    </Card>

    <!-- ================================================================ -->
  </div>
</template>

<script setup lang="ts">
import Card from '@/client/components/ui/Card.vue'
import Badge from '@/client/components/ui/Badge.vue'
import SiteHeader from '@/client/components/layout/SiteHeader.vue'
import SiteFooter from '@/client/components/layout/SiteFooter.vue'
import FloatingToolbar from '@/client/components/layout/FloatingToolbar.vue'
import StickyFormBar from '@/client/components/layout/StickyFormBar.vue'
import Breadcrumb from '@/client/components/layout/Breadcrumb.vue'
import PageNav from '@/client/components/layout/PageNav.vue'
import { floatingToolbarData } from '@/client/data/siteConfigData'
import { siteNavItems, trialRoute, siteHotline } from '@/client/data/siteNavData'
import {
  footerColumns,
  socials,
  footerHotline,
  footerEmail,
  copyrightText,
} from '@/client/data/siteFooterData'
</script>
