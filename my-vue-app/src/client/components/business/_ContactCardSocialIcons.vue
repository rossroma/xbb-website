<!--
  内部组件：ContactCard 社交平台图标行（含 QR 弹出层）
  不与 ContactCard 分开注册，仅 ContactCard 内部使用
-->
<template>
  <div class="flex gap-3">
    <div
      v-for="social in socials"
      :key="social.label"
      class="group relative w-8 h-8 rounded-full border border-border-subtle bg-white inline-flex items-center justify-center cursor-pointer transition-all duration-normal motion-reduce:transition-none hover:border-brand-primary hover:shadow-footer-social-hover"
      :title="social.label"
    >
      <span class="flex items-center justify-center">
        <component :is="social.icon" theme="filled" :size="16" fill="#646a73" />
      </span>
      <!-- QR 弹出层 -->
      <span
        class="absolute left-1/2 bottom-[calc(100%+10px)] -translate-x-1/2 translate-y-2 w-32 p-2 rounded-inner bg-white shadow-prominent border border-border-subtle opacity-0 invisible pointer-events-none z-10 transition-all duration-normal motion-reduce:transition-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
      >
        <img
          :src="social.qr"
          :alt="social.label + '二维码'"
          class="block w-full h-auto rounded-lg"
        />
        <span class="block w-full h-px my-2.5 bg-border-subtle"></span>
        <span class="block text-caption text-text-secondary text-center whitespace-pre-line">
          {{ social.qrText }}
        </span>
        <!-- 箭头三角 -->
        <span
          class="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-border-subtle -translate-x-1/2 rotate-45"
        ></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SocialItem } from '@/client/data/siteFooterData'

defineProps<{
  /** 社交平台列表 */
  socials: SocialItem[]
}>()
</script>
