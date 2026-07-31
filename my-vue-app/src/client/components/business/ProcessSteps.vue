<!--
  复用度：中（业务场景组件）
  可复用场景：产品使用流程、合作对接流程、服务交付流程、操作步骤引导等需要展示多步骤流程的场景
  特点：每个步骤由上卡片（序号+标题+描述+特性列表）和下卡片（总结标题）构成，步骤间由 SVG 箭头连接
-->
<template>
  <SectionBlock spacing="loose">
    <!-- 标题 + 副标题 -->
    <div class="flex flex-col items-center text-center">
      <h2 class="text-h1 text-text-primary leading-heading max-lg:text-h2 max-md:text-h3">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-4 max-w-2xl text-body text-text-secondary leading-body">
        {{ subtitle }}
      </p>
    </div>

    <!-- 流程区域 -->
    <div class="mt-14 max-lg:mt-10">
      <!-- ===== 桌面端：两行布局 ===== -->
      <div class="hidden lg:block">
        <!-- 上行：上卡片 + 箭头 -->
        <div class="flex items-stretch">
          <template v-for="(step, index) in steps" :key="step.title">
            <!-- 上卡片 -->
            <div
              class="flex-1 min-w-0 rounded-card border border-border-subtle bg-surface-primary p-6 shadow-subtle"
            >
              <!-- 序号圆标 -->
              <div
                :class="[
                  'inline-flex items-center justify-center w-11 h-11 rounded-full text-white text-h3 font-bold leading-subtitle',
                  numberBadgeClass(step.theme),
                ]"
                aria-hidden="true"
              >
                {{ step.number ?? index + 1 }}
              </div>

              <!-- 标题 -->
              <h3 class="mt-5 text-h3 text-text-primary leading-subtitle">
                {{ step.title }}
              </h3>

              <!-- 描述 -->
              <p class="mt-3 text-body text-text-secondary leading-body">
                {{ step.description }}
              </p>

              <!-- 特性列表 -->
              <ul v-if="step.features && step.features.length > 0" class="mt-5 space-y-2.5">
                <li
                  v-for="feat in step.features"
                  :key="feat"
                  class="flex items-start gap-2.5 text-small text-text-secondary leading-small"
                >
                  <component
                    :is="CheckSmall"
                    :size="16"
                    class="shrink-0 mt-0.5"
                    :style="{ color: primaryColor(step.theme) }"
                    :stroke-width="3"
                  />
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <!-- 箭头 -->
            <div
              v-if="index < steps.length - 1"
              class="flex shrink-0 items-center self-center px-2"
              :class="reverse ? 'scale-x-[-1]' : ''"
              aria-hidden="true"
            >
              <!-- 简洁直线 -->
              <svg
                v-if="arrowStyle === 'line'"
                width="48"
                height="16"
                viewBox="0 0 48 16"
                fill="none"
                :style="{ color: primaryColor(step.theme) }"
              >
                <path
                  d="M4 8 L32 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M28 3.5 L36 8 L28 12.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <!-- 实心填充 -->
              <svg
                v-else-if="arrowStyle === 'filled'"
                width="48"
                height="18"
                viewBox="0 0 48 18"
                fill="none"
                :style="{ color: primaryColor(step.theme) }"
              >
                <path
                  d="M3 5 L26 5 L26 2 L38 9 L26 16 L26 13 L3 13 Z"
                  fill="currentColor"
                  opacity="0.12"
                />
                <path
                  d="M3 5 L26 5 L26 2 L38 9 L26 16 L26 13 L3 13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
              <!-- 渐变渐隐 -->
              <svg
                v-else-if="arrowStyle === 'gradient'"
                width="48"
                height="16"
                viewBox="0 0 48 16"
                fill="none"
                :style="{ color: primaryColor(step.theme) }"
              >
                <defs>
                  <linearGradient :id="`ps-grad-${index}`" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="currentColor" stop-opacity="0.1" />
                    <stop offset="50%" stop-color="currentColor" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="currentColor" stop-opacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 8 L30 8"
                  :stroke="`url(#ps-grad-${index})`"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="M28 3.5 L36 8 L28 12.5"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <!-- 双 V 形 -->
              <svg
                v-else-if="arrowStyle === 'chevron'"
                width="48"
                height="16"
                viewBox="0 0 48 16"
                fill="none"
                :style="{ color: primaryColor(step.theme) }"
              >
                <path
                  d="M8 3.5 L16 8 L8 12.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
                <path
                  d="M16 3.5 L24 8 L16 12.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
                <path
                  d="M28 3.5 L34 8 L28 12.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </template>
        </div>

        <!-- 下行：下卡片 -->
        <div class="flex items-stretch mt-5">
          <template v-for="(step, index) in steps" :key="step.title">
            <!-- 下卡片：主题色总结卡片 -->
            <div
              :class="[
                'flex-1 min-w-0 rounded-card px-5 py-3.5 text-center',
                numberBadgeClass(step.theme),
              ]"
            >
              <span class="text-small font-semibold leading-small text-white">
                {{ step.summary }}
              </span>
            </div>

            <!-- 箭头占位间距 -->
            <div
              v-if="index < steps.length - 1"
              class="shrink-0 px-2"
              style="width: 64px"
              aria-hidden="true"
            />
          </template>
        </div>
      </div>

      <!-- ===== 移动端：纵向堆叠 ===== -->
      <div class="lg:hidden flex flex-col items-center gap-6">
        <template v-for="(step, index) in steps" :key="step.title">
          <div class="w-full max-w-95 flex flex-col items-center">
            <!-- 上卡片 -->
            <div
              class="w-full rounded-card border border-border-subtle bg-surface-primary p-6 shadow-subtle"
            >
              <div
                :class="[
                  'inline-flex items-center justify-center w-11 h-11 rounded-full text-white text-h3 font-bold leading-subtitle',
                  numberBadgeClass(step.theme),
                ]"
                aria-hidden="true"
              >
                {{ step.number ?? index + 1 }}
              </div>
              <h3 class="mt-5 text-h3 text-text-primary leading-subtitle">
                {{ step.title }}
              </h3>
              <p class="mt-3 text-body text-text-secondary leading-body">
                {{ step.description }}
              </p>
              <ul v-if="step.features && step.features.length > 0" class="mt-5 space-y-2.5">
                <li
                  v-for="feat in step.features"
                  :key="feat"
                  class="flex items-start gap-2.5 text-small text-text-secondary leading-small"
                >
                  <component
                    :is="CheckSmall"
                    :size="16"
                    class="shrink-0 mt-0.5"
                    :style="{ color: primaryColor(step.theme) }"
                    :stroke-width="3"
                  />
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <div class="h-4" aria-hidden="true" />

            <!-- 下卡片 -->
            <div
              :class="['w-full rounded-card px-5 py-3.5 text-center', numberBadgeClass(step.theme)]"
            >
              <span class="text-small font-semibold leading-small text-white">
                {{ step.summary }}
              </span>
            </div>
          </div>

          <!-- 移动端纵向箭头 -->
          <div
            v-if="index < steps.length - 1"
            class="flex items-center justify-center"
            aria-hidden="true"
          >
            <!-- 简洁直线 -->
            <svg
              v-if="arrowStyle === 'line'"
              width="16"
              height="32"
              viewBox="0 0 16 32"
              fill="none"
              :style="{ color: primaryColor(step.theme) }"
            >
              <path d="M8 4 L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path
                d="M3.5 18 L8 24 L12.5 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <!-- 实心填充 -->
            <svg
              v-else-if="arrowStyle === 'filled'"
              width="18"
              height="36"
              viewBox="0 0 18 36"
              fill="none"
              :style="{ color: primaryColor(step.theme) }"
            >
              <path
                d="M5 3 L5 24 L2 24 L9 36 L16 24 L13 24 L13 3 Z"
                fill="currentColor"
                opacity="0.12"
              />
              <path
                d="M5 3 L5 24 L2 24 L9 36 L16 24 L13 24 L13 3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
            <!-- 渐变渐隐 -->
            <svg
              v-else-if="arrowStyle === 'gradient'"
              width="16"
              height="32"
              viewBox="0 0 16 32"
              fill="none"
              :style="{ color: primaryColor(step.theme) }"
            >
              <defs>
                <linearGradient :id="`ps-m-grad-${index}`" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.1" />
                  <stop offset="50%" stop-color="currentColor" stop-opacity="0.45" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M8 4 L8 22"
                :stroke="`url(#ps-m-grad-${index})`"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M3.5 18 L8 24 L12.5 18"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <!-- 双 V 形 -->
            <svg
              v-else-if="arrowStyle === 'chevron'"
              width="16"
              height="32"
              viewBox="0 0 16 32"
              fill="none"
              :style="{ color: primaryColor(step.theme) }"
            >
              <path
                d="M3.5 6 L8 14 L12.5 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M3.5 14 L8 22 L12.5 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M3.5 20 L8 26 L12.5 20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </template>
      </div>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { CheckSmall } from '@icon-park/vue-next'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import { type Theme, THEME_ICON_BADGE_CLASS, THEME_PRIMARY_COLOR } from './theme'

/** 单个流程步骤数据 */
interface ProcessStep {
  /** 主题色（每个步骤独立控制，默认 'purple'） */
  theme?: Theme
  /** 序号覆盖（默认按索引自动生成 1, 2, 3...） */
  number?: number
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description: string
  /** 特性列表（选填） */
  features?: string[]
  /** 总结/结论标题 */
  summary: string
}

/** 箭头样式 */
type ArrowStyle = 'line' | 'filled' | 'gradient' | 'chevron'

withDefaults(
  defineProps<{
    /** 区域标题 */
    title: string
    /** 区域副标题 */
    subtitle?: string
    /** 流程步骤列表（3-5 个） */
    steps: readonly ProcessStep[]
    /** 箭头方向翻转（水平镜像） */
    reverse?: boolean
    /** 箭头样式：line（直线）| curve（弧线）| dash（虚线）| chevron（双V形） */
    arrowStyle?: ArrowStyle
  }>(),
  {
    reverse: false,
    arrowStyle: 'line',
  },
)

function primaryColor(theme?: Theme): string {
  return THEME_PRIMARY_COLOR[theme ?? 'purple']
}

function numberBadgeClass(theme?: Theme): string {
  return THEME_ICON_BADGE_CLASS[theme ?? 'purple']
}
</script>
