<template>
  <footer class="pt-6 pb-6 border-t border-footer-border-strong bg-footer-gradient">
    <div class="w-[min(1280px,calc(100%-48px))] mx-auto">
      <!-- 导航网格 -->
      <div
        class="grid grid-cols-6 max-lg:grid-cols-3 max-md:grid-cols-2 gap-x-12 gap-y-5 items-start"
      >
        <!-- 导航列 -->
        <div v-for="col in footerColumns" :key="col.title" class="min-w-0">
          <h4 class="text-body font-semibold text-heading mb-4">{{ col.title }}</h4>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in col.links" :key="link.text">
              <a
                :href="link.href"
                class="text-small text-text-secondary hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none no-underline"
                >{{ link.text }}</a
              >
            </li>
          </ul>
          <div v-if="col.actions && col.actions.length > 0" class="flex flex-col gap-3 mt-4">
            <Button
              v-for="action in col.actions"
              :key="action.text"
              variant="primary"
              size="xs"
              :href="action.href"
              >{{ action.text }}</Button
            >
          </div>
        </div>
      </div>

      <!-- 分割线 + 底部信息栏 -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-footer-border max-md:flex-col max-md:items-start"
      >
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex gap-3">
            <!-- 社交图标 — group 模式实现 QR hover -->
            <div
              v-for="social in socials"
              :key="social.label"
              class="group relative w-8 h-8 rounded-full border border-footer-social-border bg-white/72 inline-flex items-center justify-center text-body leading-none cursor-pointer transition-all duration-normal motion-reduce:transition-none hover:border-footer-social-border-hover hover:shadow-footer-social-hover"
              :title="social.label"
            >
              <span class="flex items-center justify-center">
                <component :is="social.icon" theme="filled" fill="#646a73" />
              </span>
              <!-- QR 弹出层 --><span
                class="absolute left-1/2 bottom-[calc(100%+12px)] -translate-x-1/2 translate-y-2 w-31 p-2 rounded-inner bg-white shadow-footer-qr border border-footer-qr-border opacity-0 invisible pointer-events-none z-10 transition-all duration-normal motion-reduce:transition-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"
              >
                <img
                  :src="social.qr"
                  :alt="social.label + '二维码'"
                  class="block w-full h-auto rounded-lg"
                />
                <span class="block w-full h-px my-2.5 bg-footer-qr-divider"></span>
                <span
                  class="block text-caption leading-small text-text-secondary text-center whitespace-pre-line"
                  >{{ social.qrText }}</span
                >
                <!-- 箭头三角 -->
                <span
                  class="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-footer-qr-border -translate-x-1/2 rotate-45"
                ></span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <a :href="`tel:${displayHotline}`" class="flex flex-col gap-1 no-underline">
            <span class="text-caption text-text-tertiary">服务热线</span>
            <span class="text-body text-heading">{{ displayHotline }}</span>
          </a>
          <a :href="`mailto:${displayEmail}`" class="flex flex-col gap-1 no-underline">
            <span class="text-caption text-text-tertiary">企业邮箱</span>
            <span class="text-body text-heading">{{ displayEmail }}</span>
          </a>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-4 pt-3 border-t border-footer-border-light text-center">
        <p class="text-small text-text-tertiary leading-relaxed">
          <span class="text-small">COPYRIGHT</span> ©<span class="text-small">
            {{ displayCopyright }}&nbsp;&nbsp;&nbsp;<a
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802003191"
              target="_blank"
              rel="nofollow"
              class="text-text-tertiary hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none no-underline"
              >浙公网安备 33010802003191 号</a
            >&nbsp;&nbsp;CRM,CRM系统,CRM软件&nbsp;&nbsp;<a
              href="https://beian.miit.gov.cn"
              target="_blank"
              rel="nofollow"
              class="text-text-tertiary hover:text-brand-primary transition-colors duration-fast motion-reduce:transition-none no-underline"
              >ICP证：浙ICP备15012475号-1</a
            >&nbsp;&nbsp;&nbsp;&nbsp;</span
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/client/components/ui/Button.vue'
import { Mail } from '@icon-park/vue-next'
import type { FooterColumn, SocialItem } from '@/client/data/siteFooterData'
import { useSiteSettingsStore } from '@/client/stores/siteSettings'

const store = useSiteSettingsStore()

const props = withDefaults(
  defineProps<{
    footerColumns?: readonly FooterColumn[]
    socials?: readonly SocialItem[]
    hotline?: string
    email?: string
    copyright?: string
  }>(),
  {
    footerColumns: () => [],
    socials: () => [],
    hotline: '',
    email: '',
    copyright: '',
  },
)

/** 优先使用 Store 中的值，未配置时回退到 props */
const displayHotline = computed(() => store.tel || props.hotline)
const displayEmail = computed(() => store.email || props.email)
const displayCopyright = computed(() => store.copyright || props.copyright)
</script>
