<!--
  复用场景：联系页面、关于我们页面、各子页面底部联系方式区
  数据来源：可由页面数据或后台接口映射为 cards 数组
-->
<template>
  <SectionBlock spacing="default">
    <div class="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-0">
      <component :is="card.href ? 'a' : 'article'" v-for="card in resolvedCards" :key="card.title" :href="card.href"
        :target="card.external ? '_blank' : undefined" :rel="card.external ? 'noreferrer' : undefined"
        class="block rounded-inner bg-surface-primary p-7.5 text-left shadow-[0_6px_20px_0_rgba(0,0,0,0.06)] transition-transform duration-normal hover:-translate-y-0.5 max-md:rounded-none max-md:border-b max-md:border-[#dfe2eb] max-md:px-3 max-md:py-6 max-md:shadow-none max-md:hover:translate-y-0">
        <span class="flex items-center gap-3">
          <component :is="resolveIcon(card.icon)" :class="card.iconClass || card.valueClass || 'text-brand-primary'"
            :size="32" />
          <span class="text-[18px] font-medium text-text-primary leading-none max-md:text-[18px]">
            {{ card.title }}
          </span>
        </span>

        <div v-if="card.description" class="mt-6 flex flex-col gap-3 max-md:mt-7 max-md:gap-2">
          <span v-for="item in descriptionItems(card.description)" :key="item"
            class="text-small whitespace-pre-line text-text-secondary leading-body">
            {{ item }}
          </span>
        </div>


        <span v-if="card.type === 'socials'" class="mt-6 block max-md:mt-5">
          <SocialIcons :socials="card.socials || socials" />
        </span>
        <span v-else-if="card.value" class="mt-6 flex items-center gap-3 text-small font-semibold leading-none max-md:mt-5"
          :class="card.valueClass || 'text-brand-primary'">
          <component v-if="card.valueIcon" :is="resolveIcon(card.valueIcon)" class="shrink-0" :size="22" />
          <span>{{ card.value }}</span>
        </span>
      </component>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import {
  Headset,
  Mail,
  Message,
  Phone,
  ShareSys,
} from '@/client/components/ui/remixIcons'
import type { SocialItem } from '@/client/data/siteFooterData'
import SocialIcons from './_ContactCardSocialIcons.vue'

export type ContactCardIcon = 'message' | 'headset' | 'mail' | 'phone' | 'share' | Component
export type ContactCardType = 'link' | 'socials'

export interface ContactCardItem {
  title: string
  description?: string | string[]
  value?: string
  href?: string
  external?: boolean
  type?: ContactCardType
  icon?: ContactCardIcon
  valueIcon?: ContactCardIcon
  iconClass?: string
  valueClass?: string
  socials?: SocialItem[]
}

const props = withDefaults(
  defineProps<{
    /** 推荐：后台或页面数据映射后的联系方式卡片 */
    cards?: readonly ContactCardItem[]
    /** 兼容旧用法：服务热线电话 */
    hotline?: string
    /** 兼容旧用法：企业邮箱地址 */
    email?: string
    /** 兼容旧用法：社交平台列表（图标 + 二维码） */
    socials?: SocialItem[]
  }>(),
  {
    cards: undefined,
    hotline: '',
    email: '',
    socials: () => [],
  },
)

const iconMap = {
  message: Message,
  headset: Headset,
  mail: Mail,
  phone: Phone,
  share: ShareSys,
} satisfies Record<Exclude<ContactCardIcon, Component>, Component>

const fallbackCards = computed<ContactCardItem[]>(() => [
  {
    title: '售前咨询',
    description: '了解产品详情、定制专属方案',
    value: props.hotline,
    href: props.hotline ? `tel:${props.hotline}` : undefined,
    icon: 'message',
    valueIcon: 'phone',
    iconClass: 'text-[#31c4d1]',
    valueClass: 'text-[#31c4d1]',
  },
  {
    title: '售后服务',
    description: '产品应用操作、全天候陪伴服务',
    value: props.hotline,
    href: props.hotline ? `tel:${props.hotline}` : undefined,
    icon: 'headset',
    valueIcon: 'phone',
    valueClass: 'text-brand-accent',
  },
  {
    title: '官方邮箱',
    description: '商务合作、媒体沟通与其他事务咨询',
    value: props.email,
    href: props.email ? `mailto:${props.email}` : undefined,
    icon: 'mail',
    valueIcon: 'mail',
    valueClass: 'text-brand-primary',
  },
  {
    title: '社交平台',
    description: '关注官方账号，获取产品资讯与活动动态',
    type: 'socials',
    icon: 'share',
    iconClass: 'text-fs-icon-green',
    socials: props.socials,
  },
])

const resolvedCards = computed(() =>
  props.cards && props.cards.length > 0 ? [...props.cards] : fallbackCards.value,
)

function resolveIcon(icon: ContactCardIcon | undefined) {
  if (!icon) return Message
  return typeof icon === 'string' ? iconMap[icon] : icon
}

/** 将 description（字符串或数组）统一转为数组，避免 v-for 逐字符遍历字符串 */
function descriptionItems(description: string | string[] | undefined): string[] {
  if (!description) return []
  return Array.isArray(description) ? description : [description]
}
</script>
