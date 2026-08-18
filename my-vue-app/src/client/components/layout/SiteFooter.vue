<template>
  <footer class="pt-10 pb-16 border-t border-footer-border-strong bg-footer-gradient">
    <div class="w-[min(1280px,calc(100%-48px))] mx-auto">
      <section class="flex flex-col items-center text-center pt-6">
        <div>
          <h2 class="text-h2 font-bold leading-heading text-heading">
            {{ displayCtaSection.title }}
          </h2>
          <p
            v-if="displayCtaSection.subtitle"
            class="mt-2 text-body leading-body text-text-secondary"
          >
            {{ displayCtaSection.subtitle }}
          </p>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            v-if="displayCtaSection.primaryCta"
            :to="getCtaHref(displayCtaSection.primaryCta, displayCtaSection.primaryHref)"
            variant="primary"
            color="brand"
            size="lg"
          >
            {{ displayCtaSection.primaryCta }}
          </Button>
          <Button
            v-if="displayCtaSection.secondaryCta"
            :to="getCtaHref(displayCtaSection.secondaryCta, displayCtaSection.secondaryHref)"
            variant="outline"
            color="brand"
            size="lg"
          >
            {{ displayCtaSection.secondaryCta }}
          </Button>
        </div>
      </section>
      <!-- 导航网格 -->
      <div
        class="grid mt-32 grid-cols-5 max-lg:grid-cols-3 max-md:hidden gap-x-12 gap-y-5 items-start"
      >
        <!-- 导航列 -->
        <div v-for="col in footerColumns" :key="col.title" class="min-w-0 mx-auto">
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
          <div
            v-if="col.actions && col.actions.length > 0"
            class="flex flex-col items-start gap-3 mt-4"
          >
            
          </div>
        </div>
      </div>

      <div class="hidden max-md:mt-10 max-md:flex max-md:flex-col max-md:gap-1">
        <section
          v-for="(col, colIndex) in footerColumns"
          :key="`mobile-${col.title}`"
          class="w-full"
        >
          <button
            type="button"
            class="flex h-12 w-full items-center justify-between rounded-lg px-5 text-left text-h3 font-semibold leading-none text-heading transition-colors duration-fast"
            :class="isMobileFooterColumnOpen(col.title) ? 'bg-[#f0f1f3]' : 'bg-transparent'"
            :aria-expanded="isMobileFooterColumnOpen(col.title)"
            :aria-controls="`footer-mobile-panel-${colIndex}`"
            @click="toggleMobileFooterColumn(col.title)"
          >
            <span>{{ col.title }}</span>
            <component
              :is="isMobileFooterColumnOpen(col.title) ? Up : Down"
              :size="22"
              :stroke-width="4"
              theme="outline"
              aria-hidden="true"
            />
          </button>
          <div
            v-show="isMobileFooterColumnOpen(col.title)"
            :id="`footer-mobile-panel-${colIndex}`"
            class="flex flex-col gap-5 px-10 py-4"
          >
            <a
              v-for="link in col.links"
              :key="link.text"
              :href="link.href"
              class="text-body font-semibold leading-body text-text-secondary no-underline"
            >
              {{ link.text }}
            </a>
            <a
              v-for="action in col.actions ?? []"
              :key="action.text"
              :href="action.href"
              class="text-body font-semibold leading-body text-text-secondary no-underline"
            >
              {{ action.text }}
            </a>
          </div>
        </section>
      </div>

      <!-- 分割线 + 底部信息栏 -->
      <div
        class="flex flex-wrap items-center justify-between gap-4 mt-16 pt-6 border-t border-footer-border max-md:mt-7 max-md:flex-col max-md:items-stretch max-md:gap-6 max-md:border-t-0 max-md:pt-0"
      >
        <div class="flex flex-wrap items-center gap-6 max-md:order-2 max-md:w-full max-md:justify-center max-md:border-t max-md:border-footer-border max-md:pt-7">
          <div class="flex gap-3 max-md:justify-center">
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
        <div class="flex items-center gap-6 max-md:order-1 max-md:w-full max-md:flex-col max-md:items-start max-md:gap-3">
          <a
            :href="`tel:${displayHotline}`"
            class="flex flex-col gap-1 no-underline max-md:flex-row max-md:items-center max-md:gap-3 max-md:px-5"
          >
            <PhoneTelephone
              class="hidden max-md:block text-text-secondary"
              :size="22"
              :stroke-width="4"
              theme="outline"
              aria-hidden="true"
            />
            <span class="text-caption text-text-tertiary max-md:hidden">服务热线</span>
            <span class="text-body text-heading max-md:text-h3 max-md:font-semibold max-md:leading-none max-md:text-text-secondary">
              {{ displayHotline }}
            </span>
          </a>
          <a :href="`mailto:${displayEmail}`" class="flex flex-col gap-1 no-underline max-md:hidden">
            <span class="text-caption text-text-tertiary">企业邮箱</span>
            <span class="text-body text-heading">{{ displayEmail }}</span>
          </a>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-4 pt-3 border-footer-border-light text-center">
        <p class="text-small text-text-tertiary leading-relaxed">
          <span class="text-small">COPYRIGHT</span> ©<span class="text-small" v-html="displayCopyright"></span>&nbsp;&nbsp;&nbsp;<a
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
            >&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Down, PhoneTelephone, Up } from '@/client/components/ui/remixIcons'
import Button from '@/client/components/ui/Button.vue'
import type { FooterColumn, SocialItem } from '@/client/data/siteFooterData'
import { toPagePath } from '@/client/data/routePaths'
import { useSiteSettingsStore } from '@/client/stores/siteSettings'

interface FooterCtaSection {
  title: string
  subtitle?: string
  primaryCta?: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
}

const store = useSiteSettingsStore()
const trialPagePath = toPagePath('single_mfsy')
const liuziPagePath = '/liuzi'
const trialCtaTexts = new Set(['免费试用', '立即免费试用', '立即咨询', 'CRM免费试用', '免费使用'])

const defaultCtaSection: FooterCtaSection = {
  title: '让增长，从这里开始',
  subtitle: '免费试用7天，体验AI驱动的新一代CRM平台',
  primaryCta: '立即免费试用',
  primaryHref: trialPagePath,
  secondaryCta: '预约产品演示',
  secondaryHref: liuziPagePath,
}

const props = withDefaults(
  defineProps<{
    ctaSection?: FooterCtaSection
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
const displayCtaSection = computed(() => props.ctaSection ?? defaultCtaSection)
const openMobileFooterColumn = ref(props.footerColumns[0]?.title ?? null)

const getCtaHref = (text?: string, href?: string) =>
  text && trialCtaTexts.has(text.trim()) ? trialPagePath : href

const isMobileFooterColumnOpen = (title: string) => openMobileFooterColumn.value === title

const toggleMobileFooterColumn = (title: string) => {
  openMobileFooterColumn.value = isMobileFooterColumnOpen(title) ? null : title
}
</script>
