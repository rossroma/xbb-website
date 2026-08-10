<template>
  <div class="flex flex-col gap-6">
    <!-- 分类五：组合组件                                                      -->
    <!-- ================================================================ -->
    <div id="cat-ui-kit" class="scroll-mt-14 lg:scroll-mt-0 mt-6">
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded bg-brand-accent-soft text-brand-accent text-caption font-bold uppercase tracking-wider"
          >组合组件</span
        >
      </div>
    </div>

    <!-- ===== SectionBlock ===== -->
    <Card id="section-block" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">SectionBlock 区块容器</h2>
      <p class="text-small text-text-secondary mb-6">
        标准化区块容器，统一 section 间距和内容宽度。支持
        <code>spacing</code>（default/loose/compact/none）和
        <code>width</code>（default/narrow/wide/full）。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">7 个组件复用</Badge>
        <Badge variant="accent">spacing + width</Badge>
        <Badge variant="info">slot 默认</Badge>
      </div>
      <div class="border border-border-subtle rounded-card overflow-hidden">
        <div class="p-4 bg-surface-secondary border-b border-border-subtle">
          <span class="text-caption font-semibold text-text-tertiary uppercase tracking-wider"
            >spacing="compact" · width="default"</span
          >
        </div>
        <SectionBlock spacing="compact" width="default">
          <div
            class="bg-brand-primary-soft rounded-inner p-6 text-center border border-brand-primary-glow"
          >
            <p class="text-small font-medium text-brand-primary">SectionBlock 容器内容区域</p>
            <p class="text-caption text-text-tertiary mt-1">
              组件负责统一间距和宽度，内容通过 slot 传入
            </p>
          </div>
        </SectionBlock>
        <div class="p-4 bg-surface-secondary border-t border-border-subtle">
          <code class="text-caption text-text-secondary"
            >&lt;SectionBlock spacing="compact" width="default"&gt;...&lt;/SectionBlock&gt;</code
          >
        </div>
      </div>
    </Card>

    <!-- ===== CardGrid ===== -->
    <Card id="card-grid" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">CardGrid 响应式卡片网格</h2>
      <p class="text-small text-text-secondary mb-6">
        响应式卡片网格布局，支持 <code>cols</code>（2/3/4）和
        <code>gap</code>（default/loose/tight）。自动响应 lg/md 断点。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">4 个组件复用</Badge>
        <Badge variant="accent">cols + gap</Badge>
        <Badge variant="info">slot 默认</Badge>
      </div>
      <div class="border border-border-subtle rounded-card overflow-hidden">
        <div class="p-4 bg-surface-secondary border-b border-border-subtle">
          <span class="text-caption font-semibold text-text-tertiary uppercase tracking-wider"
            >cols="4" · gap="default"</span
          >
        </div>
        <div class="p-5">
          <CardGrid :cols="4" gap="default">
            <div
              v-for="i in 4"
              :key="i"
              class="bg-surface-secondary rounded-inner p-5 text-center border border-border-subtle"
            >
              <div
                class="w-10 h-10 rounded-full bg-brand-primary-soft flex items-center justify-center mx-auto mb-3"
              >
                <span class="text-brand-primary text-small font-bold">{{ i }}</span>
              </div>
              <p class="text-small font-semibold text-text-primary">卡片 {{ i }}</p>
              <p class="text-caption text-text-tertiary mt-1">响应式网格单元格</p>
            </div>
          </CardGrid>
        </div>
        <div class="p-4 bg-surface-secondary border-t border-border-subtle">
          <code class="text-caption text-text-secondary"
            >&lt;CardGrid :cols="4" gap="default"&gt;...&lt;/CardGrid&gt;</code
          >
        </div>
      </div>
    </Card>

    <!-- ===== Carousel ===== -->
    <PlaygroundShell
      section-id="carousel"
      title="Carousel 通用轮播"
      description="通用轮播状态机，管理索引、自动播放、暂停/恢复。支持 autoPlay、showArrows、showDots。通过 slot props 暴露 currentIndex、slide()、goTo()。"
      code-tag="Carousel"
      :code-extra-props="carouselCodeExtra"
      :controls="carouselControls"
      :initial-props="carouselDefaults"
      :usage-notes="[
        'Props: totalSlides（必需）；autoPlay?, interval?, showArrows?, showDots?, dotsPosition?',
        '默认: autoPlay=false, interval=5000, showArrows=false, showDots=false, dotsPosition=inside',
        'Emits: slide-change(index)',
        'Slot: default（接收 currentIndex, slide, goTo）；arrow-left / arrow-right（自定义箭头）；dots（自定义指示点）',
        'Hover 暂停自动播放，离开恢复',
        '支持 prefers-reduced-motion 关闭动画',
        '被 HeroBanner、IndustryCarousel、PromoBannerCarousel 等业务组件复用',
      ]"
      v-slot="carouselProps"
    >
      <Carousel
        :total-slides="3"
        :auto-play="carouselProps.autoPlay as boolean"
        :interval="3000"
        :show-arrows="carouselProps.showArrows as boolean"
        :show-dots="carouselProps.showDots as boolean"
        dots-position="outside"
      >
        <template #default="{ currentIndex }">
          <div class="overflow-hidden rounded-card">
            <div
              class="flex transition-transform duration-[450ms] ease-in-out"
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div
                v-for="i in 3"
                :key="i"
                class="w-full shrink-0 h-45 flex flex-col items-center justify-center text-white"
                :class="
                  i === 1 ? 'bg-brand-primary' : i === 2 ? 'bg-brand-accent' : 'bg-status-success'
                "
              >
                <span class="text-[28px] font-bold">Slide {{ i }}</span>
                <span class="text-[13px] opacity-80 mt-1">{{
                  i === 1 ? '品牌主色' : i === 2 ? '辅助蓝紫' : '成功绿'
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </PlaygroundShell>

    <!-- ===== IconBadge ===== -->
    <Card id="icon-badge" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">IconBadge 图标徽章</h2>
      <p class="text-small text-text-secondary mb-6">
        圆形图标容器，支持 <code>size</code>（sm/md/lg）和
        <code>variant</code>（gradient/white）。通过 slot 放置图标组件。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">FeatureImageCard + SplitCardLayout</Badge>
        <Badge variant="accent">gradient / white</Badge>
        <Badge variant="info">slot 默认</Badge>
      </div>
      <div class="bg-surface-secondary rounded-inner p-5 flex items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <span class="text-[11px] text-text-tertiary">gradient</span>
          <IconBadge size="md" variant="gradient" v-slot="{ iconSizeClass }">
            <Rocket :class="iconSizeClass" class="text-white" :stroke-width="2.2" />
          </IconBadge>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-[11px] text-text-tertiary">white</span>
          <IconBadge size="md" variant="white" color="#ff6400" v-slot="{ iconSizeClass }">
            <Fire :class="iconSizeClass" :stroke-width="2.2" />
          </IconBadge>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-[11px] text-text-tertiary">sm</span>
          <IconBadge size="sm" variant="gradient" v-slot="{ iconSizeClass }">
            <Star :class="iconSizeClass" class="text-white" :stroke-width="2.2" />
          </IconBadge>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-[11px] text-text-tertiary">lg</span>
          <IconBadge size="lg" variant="white" color="#5b61ff" v-slot="{ iconSizeClass }">
            <Heart :class="iconSizeClass" :stroke-width="2.2" />
          </IconBadge>
        </div>
      </div>
    </Card>

    <!-- ===== MetricItem ===== -->
    <Card id="metric-item" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">MetricItem 指标展示</h2>
      <p class="text-small text-text-secondary mb-6">
        单条指标展示，含数值 + 单位 + 标签。用于 MetricsPanel 等数据展示场景。
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <Badge variant="brand">MetricsPanel</Badge>
        <Badge variant="accent">value + unit + label</Badge>
      </div>
      <div class="bg-surface-secondary rounded-inner p-5 flex flex-wrap gap-8">
        <MetricItem value="130" unit="万+" label="服务企业数" />
        <MetricItem value="99.9" unit="%" label="系统可用性" />
        <MetricItem value="30" unit="+" label="行业覆盖" />
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Fire, Star, Heart } from '@/client/components/ui/remixIcons'
import Card from '@/client/components/ui/Card.vue'
import Badge from '@/client/components/ui/Badge.vue'
import SectionBlock from '@/client/components/ui/SectionBlock.vue'
import CardGrid from '@/client/components/ui/CardGrid.vue'
import Carousel from '@/client/components/ui/Carousel.vue'
import IconBadge from '@/client/components/ui/IconBadge.vue'
import MetricItem from '@/client/components/ui/MetricItem.vue'
import PlaygroundShell from './components/PlaygroundShell.vue'

// ===== Carousel 交互式控件 =====
const carouselControls = [
  {
    label: 'Auto Play',
    prop: 'autoPlay',
    options: [
      { label: '开启', value: true },
      { label: '关闭', value: false },
    ],
  },
  {
    label: 'Show Arrows',
    prop: 'showArrows',
    options: [
      { label: '显示', value: true },
      { label: '隐藏', value: false },
    ],
  },
  {
    label: 'Show Dots',
    prop: 'showDots',
    options: [
      { label: '显示', value: true },
      { label: '隐藏', value: false },
    ],
  },
]

const carouselDefaults = {
  autoPlay: true,
  showArrows: true,
  showDots: true,
}

const carouselCodeExtra = {
  ':total-slides': '3',
  ':interval': '3000',
  'dots-position': '"outside"',
}
</script>
