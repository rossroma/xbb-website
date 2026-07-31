<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- 装饰性背景光晕 -->
    <div class="relative">
      <div
        class="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style="background: radial-gradient(circle, rgba(255, 100, 0, 0.15) 0%, transparent 70%)"
      />

      <!-- 404 数字 -->
      <p
        class="relative text-[120px] font-extrabold leading-none tracking-tight select-none max-md:text-[80px]"
        style="
          background: linear-gradient(135deg, #ff6400 0%, #ff8f4d 40%, #5b61ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        "
      >
        404
      </p>
    </div>

    <!-- 分割装饰线 -->
    <div class="flex items-center gap-4 mt-4 mb-6">
      <span class="block w-12 h-px bg-gradient-to-r from-transparent to-border-default" />
      <span class="w-1.5 h-1.5 rounded-full bg-brand-primary" />
      <span class="block w-12 h-px bg-gradient-to-l from-transparent to-border-default" />
    </div>

    <!-- 文案 -->
    <h1 class="text-h2 text-text-primary mb-2">页面未找到</h1>
    <p class="text-body text-text-secondary max-w-md mb-8">
      您访问的页面不存在或已被移除，请检查网址是否正确，或返回首页。
    </p>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-3">
      <Button variant="primary" size="md" to="/">返回首页</Button>
      <Button variant="outline" size="md" @click="goBack">返回上页</Button>
    </div>

    <!-- 底部快捷链接 -->
    <div class="mt-12 pt-8 border-t border-border-default">
      <p class="text-caption text-text-tertiary mb-4">您可能想找：</p>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="px-4 py-1.5 rounded-pill text-small text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft transition-colors duration-fast motion-reduce:transition-none no-underline"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/client/components/ui/Button.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}

const quickLinks = [
  { label: '首页', to: '/' },
  { label: '产品中心', to: '/chanpin' },
  { label: '免费试用', to: '/mianfeishiyong' },
  { label: '联系我们', to: '/lianxiwomen' },
]
</script>
