<!--
  复用度：中（业务场景组件）
  可复用场景：联系我们页面、关于我们页面、各子页面底部联系方式区
  数据来源：与 SiteFooter 底部信息栏共享 siteFooterData 数据
-->
<template>
  <div class="p-8 lg:px-12 lg:py-10">
    <!-- ===== 水平布局（默认）：图标左、文字右 ===== -->
    <div
      v-if="layout === 'horizontal'"
      class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-center"
    >
      <!-- 服务热线 -->
      <div class="flex items-center gap-4">
        <div
          class="flex-shrink-0 w-11 h-11 rounded-full bg-brand-primary-gradient flex items-center justify-center shadow-button-brand"
        >
          <Phone theme="outline" :size="21" fill="#fff" />
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-caption text-text-tertiary">服务热线</span>
          <a
            :href="`tel:${hotline}`"
            class="text-h3 font-bold text-text-primary no-underline hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none truncate"
          >
            {{ hotline }}
          </a>
        </div>
      </div>

      <!-- 企业邮箱 -->
      <div class="flex items-center gap-4">
        <div
          class="flex-shrink-0 w-11 h-11 rounded-full bg-brand-accent-button-gradient flex items-center justify-center shadow-button-accent"
        >
          <Mail theme="outline" :size="21" fill="#fff" />
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-caption text-text-tertiary">企业邮箱</span>
          <a
            :href="`mailto:${email}`"
            class="text-h3 font-bold text-text-primary no-underline hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none truncate"
          >
            {{ email }}
          </a>
        </div>
      </div>

      <!-- 社交平台 -->
      <div class="flex items-center gap-4">
        <div
          class="flex-shrink-0 w-11 h-11 rounded-full bg-fs-icon-green flex items-center justify-center"
        >
          <ShareSys theme="outline" :size="21" fill="#fff" />
        </div>
        <div class="flex flex-col gap-1.5 min-w-0">
          <span class="text-caption text-text-tertiary">社交平台</span>
          <SocialIcons :socials="socials" />
        </div>
      </div>
    </div>

    <!-- ===== 垂直布局：图标上、文字下（居中） ===== -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 items-start">
      <!-- 服务热线 -->
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-14 h-14 rounded-full bg-brand-primary-gradient flex items-center justify-center shadow-button-brand"
        >
          <Phone theme="outline" :size="28" fill="#fff" />
        </div>
        <div class="flex flex-col items-center gap-0.5 min-w-0">
          <span class="text-caption text-text-tertiary">服务热线</span>
          <a
            :href="`tel:${hotline}`"
            class="text-h3 font-bold text-text-primary no-underline hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none truncate"
          >
            {{ hotline }}
          </a>
        </div>
      </div>

      <!-- 企业邮箱 -->
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-14 h-14 rounded-full bg-brand-accent-button-gradient flex items-center justify-center shadow-button-accent"
        >
          <Mail theme="outline" :size="28" fill="#fff" />
        </div>
        <div class="flex flex-col items-center gap-0.5 min-w-0">
          <span class="text-caption text-text-tertiary">企业邮箱</span>
          <a
            :href="`mailto:${email}`"
            class="text-h3 font-bold text-text-primary no-underline hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none truncate"
          >
            {{ email }}
          </a>
        </div>
      </div>

      <!-- 社交平台 -->
      <div class="flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-fs-icon-green flex items-center justify-center">
          <ShareSys theme="outline" :size="28" fill="#fff" />
        </div>
        <div class="flex flex-col items-center gap-2.5 min-w-0">
          <span class="text-caption text-text-tertiary">社交平台</span>
          <SocialIcons :socials="socials" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, Mail, ShareSys } from '@icon-park/vue-next'
import type { SocialItem } from '@/client/data/siteFooterData'
import SocialIcons from './_ContactCardSocialIcons.vue'

withDefaults(
  defineProps<{
    /** 服务热线电话 */
    hotline: string
    /** 企业邮箱地址 */
    email: string
    /** 社交平台列表（图标 + 二维码） */
    socials: SocialItem[]
    /** 图标布局方向：horizontal（左右，默认）| vertical（上下） */
    layout?: 'horizontal' | 'vertical'
  }>(),
  {
    layout: 'horizontal',
  },
)
</script>
