<!--
  案例详情页头部卡片组件
  复用场景：案例详情页顶部，展示案例配图、logo、描述、标题和标签
  建议图片比例：左侧配图 4:3 或 16:10，logo 建议宽度 120–160px
-->
<template>
  <SectionBlock spacing="default">
    <div
      class="overflow-hidden rounded-card border border-border-subtle bg-surface-secondary shadow-subtle"
    >
      <div class="grid grid-cols-2 max-lg:grid-cols-1">
        <!-- ===== 左半部分：案例配图 ===== -->
        <div class="overflow-hidden p-8 max-lg:p-6 max-md:p-5 max-lg:max-h-80">
          <img
            :src="getOSSImageUrl(image, 600)"
            :alt="imageAlt ?? title"
            class="h-full w-full rounded-inner object-cover"
          />
        </div>

        <!-- ===== 右半部分：案例信息 ===== -->
        <div class="flex flex-col gap-6 p-8 max-lg:p-6 max-md:p-5">
          <!-- 案例 Logo（右对齐） -->
          <img
            :src="getOSSImageUrl(logo, 160)"
            :alt="logoAlt ?? ''"
            class="ml-auto h-10 w-auto max-w-40 object-contain"
          />

          <!-- 案例描述 -->
          <p class="text-body leading-body text-text-secondary min-h-[8.5em] line-clamp-5">
            {{ description }}
          </p>

          <!-- 分割线 -->
          <hr class="border-t border-border-default" />

          <!-- 案例标题 -->
          <h1
            class="text-h2 font-semibold leading-title text-text-primary min-h-[2.64em] line-clamp-2 max-lg:text-h3"
          >
            {{ title }}
          </h1>

          <!-- 标签列表 -->
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tag in tags" :key="tag" variant="brand">
              {{ tag }}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import Badge from '@/client/components/ui/Badge.vue'
import { getOSSImageUrl } from '@/shared/utils/ossImage'

defineProps<{
  /** 左侧配图 URL */
  image: string
  /** 左侧配图替代文本 */
  imageAlt?: string
  /** 案例 logo URL（右半部分顶部，右对齐） */
  logo: string
  /** 案例 logo 替代文本 */
  logoAlt?: string
  /** 案例描述 */
  description: string
  /** 案例标题 */
  title: string
  /** 标签列表 */
  tags: string[]
}>()
</script>
