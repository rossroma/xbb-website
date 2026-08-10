<template>
  <div class="flex flex-col gap-6">
    <!-- 分类一：基础规范                                                        -->
    <!-- ================================================================ -->
    <div id="cat-foundations" class="scroll-mt-14 lg:scroll-mt-0">
      <div class="mb-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded bg-brand-primary-soft text-brand-primary text-caption font-bold uppercase tracking-wider"
          >基础规范</span
        >
      </div>
    </div>

    <!-- ===== 1.1 品牌色板 ===== -->
    <Card id="colors" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.1 品牌色板</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md Section 1.1 — 品牌橙 + 蓝紫辅助 + 中性色。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">主色 — 品牌橙</h3>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            v-for="c in brandPrimaryColors"
            :key="c.name"
            class="rounded-card overflow-hidden border border-border-subtle"
          >
            <div :class="c.bg" class="h-16 flex items-end p-3">
              <span :class="c.text" class="text-[11px] font-semibold">{{ c.label }}</span>
            </div>
            <div class="p-3">
              <div class="text-caption font-semibold text-text-primary font-mono break-all">
                {{ c.name }}
              </div>
              <div class="text-[11px] text-text-tertiary font-mono mt-1">{{ c.hex }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">辅助色 — 蓝紫</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="c in brandAccentColors"
            :key="c.name"
            class="rounded-card overflow-hidden border border-border-subtle"
          >
            <div :class="c.bg" class="h-16 flex items-end p-3">
              <span :class="c.text" class="text-[11px] font-semibold">{{ c.label }}</span>
            </div>
            <div class="p-3">
              <div class="text-caption font-semibold text-text-primary font-mono break-all">
                {{ c.name }}
              </div>
              <div class="text-[11px] text-text-tertiary font-mono mt-1">{{ c.hex }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 class="text-body font-semibold text-text-secondary mb-3">中性色 + 表面色</h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="c in neutralAndSurfaceColors"
              :key="c.name"
              class="flex items-center gap-3 p-3 bg-surface-secondary rounded-inner"
            >
              <div
                :class="[c.swatch, 'w-8 h-8 rounded-inner shrink-0 border border-border-subtle']"
              />
              <div class="min-w-0">
                <div class="text-[13px] font-semibold text-text-primary font-mono truncate">
                  {{ c.name }}
                </div>
                <div class="text-[11px] text-text-tertiary">{{ c.usage }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-body font-semibold text-text-secondary mb-3">文字色 + 边框色 + 状态色</h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="c in textAndStatusColors"
              :key="c.name"
              class="flex items-center gap-3 p-3 bg-surface-secondary rounded-inner"
            >
              <div
                :class="[c.swatch, 'w-8 h-8 rounded-inner shrink-0 border border-border-subtle']"
              />
              <div class="min-w-0">
                <div class="text-[13px] font-semibold text-text-primary font-mono truncate">
                  {{ c.name }}
                </div>
                <div class="text-[11px] text-text-tertiary">{{ c.usage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- ===== 1.1b 渐变色 ===== -->
    <Card id="colors-gradients" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.1b 渐变色</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md Section 1.1 — 品牌渐变、AI 辅助渐变、指标数字渐变及使用场景。
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="rounded-card overflow-hidden border border-border-subtle">
          <div class="h-20 flex items-end p-3 bg-brand-primary-gradient">
            <span class="text-[11px] font-semibold text-white">brand-primary-gradient</span>
          </div>
          <div class="p-3">
            <div class="text-caption font-semibold text-text-primary">品牌渐变</div>
            <div class="text-[11px] text-text-tertiary font-mono mt-1">
              135deg, #ff6400 → #ff7a24
            </div>
            <div class="flex gap-2 mt-2">
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-primary-soft text-brand-primary text-[10px] font-medium"
                >CTA 按钮</span
              >
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-primary-soft text-brand-primary text-[10px] font-medium"
                >图标徽章</span
              >
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-primary-soft text-brand-primary text-[10px] font-medium"
                >Hero 按钮</span
              >
            </div>
          </div>
        </div>
        <div class="rounded-card overflow-hidden border border-border-subtle">
          <div class="h-20 flex items-end p-3 bg-brand-accent-button-gradient">
            <span class="text-[11px] font-semibold text-white">brand-accent-button-gradient</span>
          </div>
          <div class="p-3">
            <div class="text-caption font-semibold text-text-primary">AI 辅助渐变</div>
            <div class="text-[11px] text-text-tertiary font-mono mt-1">
              135deg, #5b61ff → #6670ff
            </div>
            <div class="flex gap-2 mt-2">
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-accent-soft text-brand-accent text-[10px] font-medium"
                >AI Logo</span
              >
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-accent-soft text-brand-accent text-[10px] font-medium"
                >浮动 pill</span
              >
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-accent-soft text-brand-accent text-[10px] font-medium"
                >装饰元素</span
              >
            </div>
          </div>
        </div>
        <div class="rounded-card overflow-hidden border border-border-subtle">
          <div class="h-20 flex items-end p-3 bg-metrics-gradient">
            <span class="text-[11px] font-semibold text-white">metrics-gradient</span>
          </div>
          <div class="p-3">
            <div class="text-caption font-semibold text-text-primary">指标数字渐变</div>
            <div class="text-[11px] text-text-tertiary font-mono mt-1">
              90deg, #ff6400 → #ff9a4d
            </div>
            <div class="flex gap-2 mt-2">
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-primary-soft text-brand-primary text-[10px] font-medium"
                >KPI 数字</span
              >
              <span
                class="px-2 py-0.5 rounded-pill bg-brand-primary-soft text-brand-primary text-[10px] font-medium"
                >百分比</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-secondary rounded-inner p-5">
        <h3 class="text-small font-semibold text-text-primary mb-3">渐变使用示例</h3>
        <div class="flex flex-wrap gap-4 items-end">
          <div class="text-center">
            <div
              class="w-30 h-[46px] rounded-pill flex items-center justify-center text-white text-small font-semibold shadow-button-brand bg-brand-primary-gradient"
            >
              主按钮
            </div>
            <span class="block text-[11px] text-text-tertiary mt-2">Button primary</span>
          </div>
          <div class="text-center">
            <div
              class="w-11 h-11 rounded-full flex items-center justify-center text-white text-body font-black shadow-ai-logo bg-brand-accent-hero-gradient"
            >
              AI
            </div>
            <span class="block text-[11px] text-text-tertiary mt-2">AI Logo</span>
          </div>
          <div class="text-center">
            <span
              class="text-[48px] font-bold leading-0.9 bg-metrics-gradient bg-clip-text text-transparent"
              >87%</span
            >
            <span class="block text-[11px] text-text-tertiary mt-2">Metrics 数字</span>
          </div>
          <div class="text-center">
            <div class="w-[26px] h-2 rounded-pill bg-brand-primary-gradient"></div>
            <span class="block text-[11px] text-text-tertiary mt-2">轮播指示点</span>
          </div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用方式</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            作为背景：<code>bg-brand-primary-gradient</code> /
            <code>bg-brand-accent-button-gradient</code> / <code>bg-metrics-gradient</code>
          </li>
          <li>作为文字：<code>bg-clip-text text-transparent</code> + 渐变背景</li>
          <li>品牌渐变用于 CTA，AI 渐变用于 AI 相关装饰，指标渐变用于数字展示</li>
        </ul>
      </div>
    </Card>

    <!-- ===== 1.2 排版 ===== -->
    <Card id="typography" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.2 排版</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md Section 1.2 — 7 个层级，含字间距规范。
      </p>

      <div class="border border-border-subtle rounded-card overflow-hidden">
        <div
          v-for="t in typeScale"
          :key="t.name"
          class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-6 py-4 border-b border-border-subtle last:border-b-0"
        >
          <div class="shrink-0 sm:w-50">
            <div class="text-caption font-semibold text-text-primary font-mono">
              {{ t.name }}
            </div>
            <div class="text-[11px] text-text-tertiary">
              {{ t.size }} / {{ t.weight }} · LH {{ t.lineHeight }} · tracking {{ t.tracking }}
            </div>
          </div>
          <div :class="t.class" class="text-text-primary">{{ t.sample }}</div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规则</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>Display 层级每页最多 1 次（Hero 区域）</li>
          <li>H1 用于每个 &lt;section&gt; 主标题</li>
          <li>Body 用于所有正文段落，必须 line-height: 1.8</li>
          <li>大段文字用紧凑行高的标题，正文用宽松行高</li>
        </ul>
      </div>
    </Card>

    <!-- ===== 1.3 间距 + 1.4 圆角 + 1.5 阴影 ===== -->
    <Card id="spacing" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.3 间距</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md Section 1.3 — 基于 4px 基准，12 个间距令牌。
      </p>

      <div class="flex flex-col gap-0 mb-6">
        <div
          v-for="s in spacingScale"
          :key="s.token"
          class="flex items-center gap-4 py-2.5 border-b border-border-subtle last:border-b-0"
        >
          <div class="text-caption font-semibold text-text-primary font-mono w-22 shrink-0">
            {{ s.token }}
          </div>
          <div class="text-caption text-text-tertiary font-mono w-11 shrink-0">
            {{ s.value }}
          </div>
          <div class="bg-brand-primary rounded-inner h-6 shrink-0" :style="{ width: s.value }" />
          <div class="text-caption text-text-secondary hidden sm:block">{{ s.usage }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 class="text-body font-semibold text-text-secondary mb-3">1.4 圆角</h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="r in radiusScale"
              :key="r.token"
              class="flex items-center gap-3 p-3 bg-surface-secondary rounded-inner"
            >
              <div
                class="bg-brand-primary shrink-0"
                :style="{ width: '48px', height: '48px', borderRadius: r.value }"
              />
              <div>
                <div class="text-[13px] font-semibold text-text-primary font-mono">
                  {{ r.token }}
                </div>
                <div class="text-caption text-text-secondary">{{ r.value }} — {{ r.usage }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-body font-semibold text-text-secondary mb-3">1.5 阴影</h3>
          <div class="flex flex-col gap-3">
            <div
              v-for="s in shadowScale"
              :key="s.token"
              class="p-4 bg-surface-secondary rounded-inner"
              :style="{ boxShadow: s.value }"
            >
              <div class="text-[13px] font-semibold text-text-primary font-mono">
                {{ s.token }}
              </div>
              <div class="text-[11px] text-text-tertiary font-mono mt-1 break-all">
                {{ s.value }}
              </div>
              <div class="text-caption text-text-secondary mt-1">{{ s.usage }}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <!-- ===== 1.6 动效 ===== -->
    <Card id="motion" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.6 动效</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md §1.6 — 持续时间 + 缓动曲线 + 12 种动效模式，含交互式演示。
      </p>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">持续时间</h3>
        <div class="flex flex-col gap-2">
          <div
            v-for="t in transitionScale"
            :key="t.token"
            class="flex items-center gap-3 p-3 bg-surface-secondary rounded-inner"
          >
            <div class="text-[13px] font-semibold text-text-primary font-mono w-35 shrink-0">
              {{ t.token }}
            </div>
            <div class="flex-1 h-2 bg-border-default rounded-pill overflow-hidden">
              <div
                class="h-full bg-brand-primary rounded-pill transition-all duration-[2000ms]"
                :style="{ width: t.pct }"
              />
            </div>
            <div class="text-caption text-text-secondary w-20 text-right">{{ t.value }}</div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">缓动曲线</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="e in easingCurves"
            :key="e.name"
            class="bg-surface-secondary rounded-inner p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-semibold text-text-primary font-mono">{{
                e.name
              }}</span>
              <span class="text-[11px] text-text-tertiary">{{ e.value }}</span>
            </div>
            <div
              class="relative h-10 bg-white rounded-inner border border-border-subtle overflow-hidden"
            >
              <div
                class="absolute left-0 top-1/2 w-4 h-4 bg-brand-primary rounded-full -translate-y-1/2"
                :style="{ animation: e.keyframes }"
              />
            </div>
            <div class="text-[11px] text-text-tertiary mt-1">{{ e.usage }}</div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">动效模式演示（hover 触发）</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-surface-secondary rounded-inner p-5 flex flex-col items-center gap-3">
            <span class="text-caption font-medium text-text-tertiary">按钮 hover</span>
            <div
              class="w-35 h-[46px] rounded-pill bg-brand-primary-gradient text-white flex items-center justify-center text-small font-semibold cursor-pointer shadow-button-brand transition-all duration-[240ms] ease-in-out hover:-translate-y-px hover:shadow-button-brand-hover active:translate-y-0 active:shadow-button-pressed motion-reduce:transition-none motion-reduce:transform-none"
            >
              悬停我
            </div>
            <span class="text-[11px] text-text-tertiary">240ms ease-in-out</span>
          </div>
          <div class="bg-surface-secondary rounded-inner p-5 flex flex-col items-center gap-3">
            <span class="text-caption font-medium text-text-tertiary">标准卡片 hover</span>
            <div
              class="w-35 h-25 rounded-card bg-white border border-border-subtle shadow-subtle flex items-center justify-center text-small text-text-primary font-semibold cursor-pointer transition-all duration-[240ms] ease-in-out hover:-translate-y-1 hover:shadow-default motion-reduce:transition-none motion-reduce:transform-none"
            >
              悬停我
            </div>
            <span class="text-[11px] text-text-tertiary">240ms ease-in-out</span>
          </div>
          <div class="bg-surface-secondary rounded-inner p-5 flex flex-col items-center gap-3">
            <span class="text-caption font-medium text-text-tertiary">弹性卡片 hover</span>
            <div
              class="w-35 h-25 rounded-card bg-white border border-border-subtle shadow-subtle flex items-center justify-center text-small text-text-primary font-semibold cursor-pointer transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2.5 hover:scale-1.01 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:transform-none"
            >
              悬停我
            </div>
            <span class="text-[11px] text-text-tertiary">500ms cubic-bezier(.16,1,.3,1)</span>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-body font-semibold text-text-secondary mb-3">轮播动效模拟</h3>
        <div class="bg-surface-secondary rounded-inner p-5">
          <div class="flex items-center gap-4 mb-3">
            <button
              class="px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast cursor-pointer"
              :class="
                carouselIdx === 0
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-text-secondary border border-border-default'
              "
              @click="carouselIdx = 0"
            >
              Hero: 450ms ease
            </button>
            <button
              class="px-4 py-1.5 rounded-pill text-[13px] font-medium transition-colors duration-fast cursor-pointer"
              :class="
                carouselIdx === 1
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-text-secondary border border-border-default'
              "
              @click="carouselIdx = 1"
            >
              Case: 550ms cubic-bezier
            </button>
          </div>
          <div
            class="relative overflow-hidden rounded-card bg-white border border-border-subtle h-20"
          >
            <div
              class="flex h-full"
              :class="
                carouselIdx === 0
                  ? 'transition-transform duration-[450ms] ease-linear'
                  : 'transition-transform duration-[550ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]'
              "
              :style="{ transform: `translateX(-${carouselSlide * 100}%)` }"
            >
              <div
                v-for="i in 3"
                :key="i"
                class="w-full shrink-0 flex items-center justify-center text-body font-semibold"
                :class="[
                  'text-white',
                  i === 1 ? 'bg-brand-primary' : i === 2 ? 'bg-brand-accent' : 'bg-[#ff9a4d]',
                ]"
              >
                Slide {{ i }}
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              v-for="i in 3"
              :key="i"
              class="w-2 h-2 rounded-pill transition-all duration-[200ms] cursor-pointer"
              :class="
                carouselSlide === i - 1
                  ? 'w-[26px] bg-brand-primary-gradient'
                  : 'bg-[rgba(15,23,42,0.16)]'
              "
              @click="carouselSlide = i - 1"
            />
          </div>
        </div>
      </div>

      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">prefers-reduced-motion 支持</h4>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="reducedMotion" class="accent-brand-primary w-4 h-4" />
            <span class="text-[13px] text-text-secondary">开启 reduced-motion（模拟系统设置）</span>
          </label>
        </div>
        <div class="mt-3 flex gap-3">
          <div
            :class="[
              'w-30 h-[46px] rounded-pill bg-brand-primary-gradient text-white flex items-center justify-center text-small font-semibold',
              reducedMotion
                ? 'transition-none transform-none'
                : 'transition-all duration-[240ms] ease-in-out hover:-translate-y-px hover:shadow-button-brand-hover shadow-button-brand',
            ]"
          >
            {{ reducedMotion ? '动效关闭' : 'hover 动效' }}
          </div>
          <div
            :class="[
              'w-30 h-20 rounded-card bg-white border border-border-subtle shadow-subtle flex items-center justify-center text-small text-text-primary font-semibold',
              reducedMotion
                ? 'transition-none transform-none'
                : 'transition-all duration-[240ms] ease-in-out hover:-translate-y-1 hover:shadow-default',
            ]"
          >
            {{ reducedMotion ? '动效关闭' : 'hover 动效' }}
          </div>
        </div>
        <p class="text-caption text-text-tertiary mt-2">
          Tailwind: <code>motion-reduce:transition-none motion-reduce:transform-none</code>
        </p>
      </div>
    </Card>

    <!-- ===== 1.8 断点 ===== -->
    <Card id="breakpoints" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.8 断点</h2>
      <p class="text-small text-text-secondary mb-6">
        DESIGN.md §1.8 — 桌面端优先策略，通过 <code>max-*</code> 前缀向下覆盖。
      </p>
      <div class="flex flex-col gap-2">
        <div
          v-for="b in breakpointScale"
          :key="b.token"
          class="flex items-center gap-3 p-3 bg-surface-secondary rounded-inner"
        >
          <div class="text-[13px] font-semibold text-text-primary font-mono w-25 shrink-0">
            {{ b.token }}
          </div>
          <div class="text-caption text-text-secondary">{{ b.label }} — {{ b.columns }} 列</div>
        </div>
      </div>
      <div class="mt-4 p-3 bg-surface-secondary rounded-inner">
        <div class="text-caption text-text-tertiary mb-2">Tailwind 前缀映射</div>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="b in breakpointBadges" :key="b.token" :variant="b.variant">{{
            b.label
          }}</Badge>
        </div>
      </div>
      <div class="bg-surface-tertiary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">桌面端优先规则</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li>
            默认样式 = 桌面端（≥1181px），通过 <code>max-xl:</code> / <code>max-lg:</code> /
            <code>max-md:</code> 向下覆盖
          </li>
          <li>禁止混用 <code>min-</code> 前缀（防止优先级冲突）</li>
          <li>示例：<code>grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1</code></li>
        </ul>
      </div>
    </Card>

    <!-- ===== 1.9 Icon 图标库 ===== -->
    <Card id="icons" class="scroll-mt-14 lg:scroll-mt-0">
      <h2 class="text-h2 font-bold text-text-primary mb-2">1.9 Icon 图标库</h2>
      <p class="text-small text-text-secondary mb-6">
        基于
        <a
          href="https://remixicon.com"
          target="_blank"
          class="text-brand-primary hover:underline"
          >Remix Icon</a
        >
        — 开源矢量图标库。项目使用
        <code>@/client/components/ui/remixIcons</code> 按需导入，并通过统一封装兼容常用图标属性。
      </p>

      <!-- 使用方式 -->
      <div class="bg-surface-tertiary rounded-inner p-4 mb-6">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用方式</h4>
        <div class="bg-white rounded-inner p-4 border border-border-subtle">
          <code class="text-[13px] text-text-primary"
            >import { Home, Wechat, Search } from '@/client/components/ui/remixIcons'</code
          >
          <div class="mt-2 text-[13px] text-text-secondary">
            &lt;Home size="24" color="#ff6400" /&gt;
          </div>
          <p class="mt-2 text-caption text-text-tertiary">
            支持 <code>size</code>、<code>color</code>、<code>fill</code>、<code>class</code> 等常用属性，页面内统一从本地封装导入。
          </p>
        </div>
      </div>

      <!-- 颜色选择 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="t in iconColorSchemes"
          :key="t.key"
          :class="[
            'px-4 py-2 rounded-pill text-[13px] font-medium transition-all duration-fast',
            iconColor === t.key
              ? 'bg-brand-primary text-white'
              : 'text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-primary',
          ]"
          @click="iconColor = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 颜色展示卡片 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div
          v-for="t in iconColorSchemes"
          :key="t.key"
          :class="[
            'p-4 rounded-inner border text-center cursor-pointer transition-all duration-fast',
            iconColor === t.key
              ? 'border-brand-primary bg-brand-primary-soft'
              : 'border-border-subtle bg-white hover:border-border-default',
          ]"
          @click="iconColor = t.key"
        >
          <component
            :is="iconColorSample"
            :size="32"
            :color="t.color"
          />
          <p class="mt-2 text-caption font-medium text-text-primary">{{ t.label }}</p>
          <p class="text-[11px] text-text-tertiary">{{ t.desc }}</p>
        </div>
      </div>

      <!-- 搜索 -->
      <div class="relative flex-1 mb-4">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          size="18"
        />
        <input
          v-model="iconSearch"
          type="text"
          placeholder="搜索图标名称（如 home、user、wechat）..."
          class="w-full h-[42px] pl-10 pr-4 border border-border-default rounded-pill bg-white text-small text-text-primary outline-none placeholder:text-text-tertiary focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(255,100,0,0.08)] transition-all duration-fast"
        />
      </div>

      <!-- 图标网格 -->
      <div class="border border-border-subtle rounded-card overflow-hidden">
        <div v-if="filteredRemixIcons.length === 0" class="p-10 text-center">
          <Search class="text-text-tertiary mx-auto mb-3" size="40" />
          <p class="text-small text-text-tertiary">未找到匹配的图标</p>
        </div>
        <div
          v-else
          class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-px bg-border-subtle"
        >
          <button
            v-for="ic in filteredRemixIcons.slice(0, iconDisplayLimit)"
            :key="ic.name"
            :class="[
              'flex flex-col items-center justify-center gap-2 p-3 bg-white hover:bg-surface-secondary transition-colors duration-[120ms] cursor-pointer group',
              copiedIcon === ic.name ? 'bg-brand-primary-soft' : '',
            ]"
            :title="ic.name"
            @click="copyIcon(ic.name)"
          >
            <component
              :is="ic.component"
              :size="22"
              :color="copiedIcon === ic.name ? '#ff6400' : selectedIconColor"
              :class="copiedIcon === ic.name ? 'text-brand-primary' : 'text-text-primary'"
            />
            <span
              class="text-[10px] text-text-tertiary leading-tight text-center truncate max-w-full group-hover:text-text-secondary transition-colors duration-[120ms]"
            >
              {{ copiedIcon === ic.name ? '已复制!' : ic.name }}
            </span>
          </button>
        </div>
      </div>

      <!-- 加载更多 -->
      <button
        v-if="filteredRemixIcons.length > iconDisplayLimit"
        class="mt-4 mx-auto block px-6 py-2 rounded-pill border border-border-default text-[13px] font-medium text-text-secondary hover:text-brand-primary hover:border-brand-primary transition-all duration-fast"
        @click="iconDisplayLimit += 96"
      >
        显示更多（{{ filteredRemixIcons.length - iconDisplayLimit }} 个剩余）
      </button>

      <!-- 品牌图标 -->
      <div class="bg-surface-secondary rounded-inner p-4 mt-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">中国社交品牌图标</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div
            v-for="b in brandIcons"
            :key="b.name"
            class="flex flex-col items-center gap-2 p-3 bg-white rounded-inner border border-border-subtle"
          >
            <component
              :is="b.component"
              :size="28"
              :color="selectedIconColor"
              class="text-text-primary"
            />
            <span class="text-[11px] text-text-tertiary">{{ b.name }}</span>
          </div>
        </div>
      </div>
    </Card>

    <!-- ================================================================ -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Round,
  Monitor,
  Home,
  Help,
  Inbox,
  Mail,
  Phone,
  Rocket,
  Fire,
  Magic,
  People,
  Robot,
  Trend,
  Branch,
  Download,
  Check,
  Caution,
  Loading,
  Hamburger,
  Wechat,
  Tiktok,
  Weibo,
  TencentQq,
  Alipay,
  FileSettings,
  Setting,
  SettingConfig,
  SettingComputer,
  Star,
  Heart,
  Lock,
  Shield,
  User,
  Eyes,
  Delete,
  Plus,
  Edit,
  Info,
  Copy,
} from '@/client/components/ui/remixIcons'
import Card from '@/client/components/ui/Card.vue'
import Badge from '@/client/components/ui/Badge.vue'

// ===== 品牌色板 =====
const brandPrimaryColors = [
  {
    name: 'brand-primary',
    label: 'Primary',
    hex: '#ff6400',
    bg: 'bg-brand-primary',
    text: 'text-white',
  },
  {
    name: 'brand-primary-hover',
    label: 'Hover',
    hex: '#ff7a24',
    bg: 'bg-brand-primary-hover',
    text: 'text-white',
  },
  {
    name: 'brand-primary-active',
    label: 'Active',
    hex: '#e55a00',
    bg: 'bg-brand-primary-active',
    text: 'text-white',
  },
  {
    name: 'brand-primary-soft',
    label: 'Soft',
    hex: 'rgba(255,100,0,0.08)',
    bg: 'bg-brand-primary-soft',
    text: 'text-brand-primary',
  },
  {
    name: 'brand-primary-glow',
    label: 'Glow',
    hex: 'rgba(255,100,0,0.18)',
    bg: 'bg-brand-primary-glow',
    text: 'text-white',
  },
]

const brandAccentColors = [
  {
    name: 'brand-accent',
    label: 'Accent',
    hex: '#5b61ff',
    bg: 'bg-brand-accent',
    text: 'text-white',
  },
  {
    name: 'brand-accent-hover',
    label: 'Hover',
    hex: '#6670ff',
    bg: 'bg-brand-accent-hover',
    text: 'text-white',
  },
  {
    name: 'brand-accent-soft',
    label: 'Soft',
    hex: 'rgba(91,97,255,0.08)',
    bg: 'bg-brand-accent-soft',
    text: 'text-brand-accent',
  },
  {
    name: 'brand-accent-glow',
    label: 'Glow',
    hex: 'rgba(91,97,255,0.18)',
    bg: 'bg-brand-accent-glow',
    text: 'text-white',
  },
]

const neutralAndSurfaceColors = [
  { name: 'brand-neutral', swatch: 'bg-brand-neutral', usage: '标题、正文' },
  { name: 'brand-neutral-soft', swatch: 'bg-brand-neutral-soft', usage: '辅助文字' },
  { name: 'brand-neutral-muted', swatch: 'bg-brand-neutral-muted', usage: '弱化文字' },
  { name: 'surface-primary', swatch: 'bg-surface-primary', usage: '页面主背景' },
  { name: 'surface-secondary', swatch: 'bg-surface-secondary', usage: '次级模块背景' },
  { name: 'surface-tertiary', swatch: 'bg-surface-tertiary', usage: '品牌暖色背景' },
  { name: 'surface-elevated', swatch: 'bg-surface-elevated', usage: '浮层/卡片背景' },
]

const textAndStatusColors = [
  { name: 'text-primary', swatch: 'bg-brand-neutral', usage: '标题、正文' },
  { name: 'text-secondary', swatch: 'bg-brand-neutral-soft', usage: '辅助文字' },
  { name: 'text-tertiary', swatch: 'bg-brand-neutral-muted', usage: '弱化/占位文字' },
  { name: 'border-default', swatch: 'bg-[rgba(0,0,0,0.06)]', usage: '默认边框' },
  { name: 'border-subtle', swatch: 'bg-[rgba(0,0,0,0.04)]', usage: '细微边框' },
  { name: 'status-success', swatch: 'bg-status-success', usage: '成功/正向' },
  { name: 'status-warning', swatch: 'bg-status-warning', usage: '警告' },
  { name: 'status-error', swatch: 'bg-status-error', usage: '错误/危险' },
  { name: 'status-info', swatch: 'bg-status-info', usage: '信息提示' },
]

// ===== 排版 =====
const typeScale = [
  {
    name: '--font-size-display',
    size: '38px',
    weight: '700',
    lineHeight: '1.18',
    tracking: '-0.025em',
    class: 'text-display font-bold leading-display tracking-display',
    sample: '懂客户，更懂增长',
  },
  {
    name: '--font-size-h1',
    size: '30px',
    weight: '700',
    lineHeight: '1.24',
    tracking: '-0.015em',
    class: 'text-h1 font-bold leading-heading tracking-h1',
    sample: 'AI CRM，无处不在',
  },
  {
    name: '--font-size-h2',
    size: '24px',
    weight: '700',
    lineHeight: '1.32',
    tracking: '-0.005em',
    class: 'text-h2 font-bold leading-title tracking-h2',
    sample: 'AI 过程管理',
  },
  {
    name: '--font-size-h3',
    size: '20px',
    weight: '700',
    lineHeight: '1.5',
    tracking: '0',
    class: 'text-h3 font-bold leading-subtitle',
    sample: '销售增长',
  },
  {
    name: '--font-size-body',
    size: '16px',
    weight: '400',
    lineHeight: '1.7',
    tracking: '0',
    class: 'text-body leading-body',
    sample: '从获客到成交复购，AI 帮你看准每一个商机，不浪费任何一个潜在机会。',
  },
  {
    name: '--font-size-small',
    size: '14px',
    weight: '400',
    lineHeight: '1.6',
    tracking: '0',
    class: 'text-small leading-small',
    sample: '打通线上会议、面议、电话、微信和跟进数据，自动发现每一次跟进风险。',
  },
  {
    name: '--font-size-caption',
    size: '12px',
    weight: '500',
    lineHeight: '1.5',
    tracking: '0',
    class: 'text-caption font-medium leading-caption',
    sample: '提升销售成交率',
  },
]

// ===== 间距 =====
const spacingScale = [
  { token: '--space-1', value: '4px', usage: '极小间距（图标与文字紧贴）' },
  { token: '--space-2', value: '8px', usage: '图标与文字' },
  { token: '--space-3', value: '12px', usage: '标签组间距' },
  { token: '--space-4', value: '16px', usage: '卡片内边距' },
  { token: '--space-5', value: '20px', usage: '中等间距' },
  { token: '--space-6', value: '24px', usage: '卡片间距' },
  { token: '--space-8', value: '32px', usage: '模块内边距' },
  { token: '--space-10', value: '40px', usage: '大间距' },
  { token: '--space-12', value: '48px', usage: '紧凑 section 间距' },
  { token: '--space-16', value: '64px', usage: '较大 section 间距' },
  { token: '--space-20', value: '80px', usage: '标准 section 间距' },
  { token: '--space-24', value: '96px', usage: '宽松 section 间距' },
]

// ===== 圆角 =====
const radiusScale = [
  { token: '--radius-pill', value: '999px', usage: '按钮、标签、药丸形组件' },
  { token: '--radius-card', value: '16px', usage: '卡片' },
  { token: '--radius-inner', value: '12px', usage: '卡片内部元素' },
  { token: '--radius-large', value: '32px', usage: '大容器（Hero 区域）' },
]

// ===== 阴影 =====
const shadowScale = [
  { token: '--shadow-subtle', value: '0 12px 28px rgba(15,23,42,0.06)', usage: '卡片默认阴影' },
  { token: '--shadow-default', value: '0 24px 60px rgba(15,23,42,0.08)', usage: '卡片悬停阴影' },
  {
    token: '--shadow-prominent',
    value: '0 24px 48px rgba(255,100,0,0.12)',
    usage: '品牌色浮层（下拉菜单、弹窗）',
  },
]

// ===== 动效 =====
const transitionScale = [
  { token: '--transition-fast', value: '180ms', pct: '18%', usage: '微小交互：hover 颜色、图标' },
  { token: '--transition-normal', value: '240ms', pct: '24%', usage: '标准交互：按钮、卡片' },
  { token: '--transition-slow', value: '360ms', pct: '36%', usage: '大幅移动：模态框、抽屉' },
  { token: '--transition-glide', value: '450ms', pct: '45%', usage: '轮播滑动：Hero 轮播' },
  { token: '--transition-carousel', value: '550ms', pct: '55%', usage: '弹性滑动：案例轮播' },
]

const easingCurves = [
  {
    name: 'ease-in-out',
    value: '默认',
    usage: '按钮、卡片、微交互',
    keyframes: 'easeInOut 2s infinite alternate',
  },
  {
    name: 'ease',
    value: '默认',
    usage: '轮播滑动、面板展开',
    keyframes: 'easeDemo 2s infinite alternate',
  },
  {
    name: 'cubic-bezier(.16,1,.3,1)',
    value: '弹性回弹',
    usage: '卡片上浮、图标弹出',
    keyframes: 'springBounce 2s infinite alternate',
  },
  {
    name: 'cubic-bezier(.22,.61,.36,1)',
    value: '平滑弹性',
    usage: '案例轮播滑动',
    keyframes: 'smoothElastic 2s infinite alternate',
  },
]

// ===== 断点 =====
const breakpointScale = [
  { token: '--bp-desktop', label: 'Desktop ≥ 1181px', columns: '4' },
  { token: '--bp-tablet', label: 'Tablet 961–1180px', columns: '3' },
  { token: '--bp-tablet-sm', label: 'Small Tablet 769–960px', columns: '2' },
  { token: '--bp-mobile', label: 'Mobile ≤ 768px', columns: '1' },
]

const breakpointBadges = [
  { token: 'xl', label: 'xl: ≥ 1180px', variant: 'brand' as const },
  { token: 'lg', label: 'lg: ≥ 960px', variant: 'accent' as const },
  { token: 'md', label: 'md: ≥ 768px', variant: 'info' as const },
  { token: 'sm', label: 'sm: ≥ 640px', variant: 'success' as const },
]

// ===== 状态 =====
const carouselSlide = ref(0)
const carouselIdx = ref(0)
const reducedMotion = ref(false)

// ===== Icon 图标库 =====
const iconColor = ref<'default' | 'brand' | 'accent' | 'success'>('default')
const iconColorSchemes = [
  { key: 'default', label: '默认 Default', desc: '继承正文颜色', color: 'currentColor' },
  { key: 'brand', label: '品牌 Brand', desc: '品牌橙强调', color: '#ff6400' },
  { key: 'accent', label: '辅助 Accent', desc: '蓝紫辅助色', color: '#5b61ff' },
  { key: 'success', label: '成功 Success', desc: '正向状态色', color: '#16a34a' },
] as const

const iconColorSample = Home
const selectedIconColor = computed(
  () => iconColorSchemes.find((item) => item.key === iconColor.value)?.color ?? 'currentColor',
)

const remixIconItems = [
  { name: 'Home', component: Home },
  { name: 'Inbox', component: Inbox },
  { name: 'Search', component: Search },
  { name: 'Mail', component: Mail },
  { name: 'Phone', component: Phone },
  { name: 'People', component: People },
  { name: 'Robot', component: Robot },
  { name: 'Trend', component: Trend },
  { name: 'Branch', component: Branch },
  { name: 'Download', component: Download },
  { name: 'Check', component: Check },
  { name: 'Caution', component: Caution },
  { name: 'Loading', component: Loading },
  { name: 'Hamburger', component: Hamburger },
  { name: 'Star', component: Star },
  { name: 'Heart', component: Heart },
  { name: 'Lock', component: Lock },
  { name: 'Shield', component: Shield },
  { name: 'User', component: User },
  { name: 'Eyes', component: Eyes },
  { name: 'Delete', component: Delete },
  { name: 'Plus', component: Plus },
  { name: 'Edit', component: Edit },
  { name: 'Info', component: Info },
  { name: 'Copy', component: Copy },
  { name: 'Setting', component: Setting },
  { name: 'SettingConfig', component: SettingConfig },
  { name: 'SettingComputer', component: SettingComputer },
  { name: 'FileSettings', component: FileSettings },
  { name: 'Fire', component: Fire },
  { name: 'Rocket', component: Rocket },
  { name: 'Magic', component: Magic },
  { name: 'Help', component: Help },
  { name: 'Round', component: Round },
  { name: 'Monitor', component: Monitor },
  { name: 'Wechat', component: Wechat },
  { name: 'Tiktok', component: Tiktok },
  { name: 'Weibo', component: Weibo },
  { name: 'TencentQq', component: TencentQq },
  { name: 'Alipay', component: Alipay },
]

const iconSearch = ref('')
const iconDisplayLimit = ref(96)
const copiedIcon = ref('')

const filteredRemixIcons = computed(() => {
  if (!iconSearch.value.trim()) return remixIconItems
  const q = iconSearch.value.toLowerCase()
  return remixIconItems.filter((ic) => ic.name.toLowerCase().includes(q))
})

const brandIcons = [
  { name: '微信', component: Wechat },
  { name: '抖音', component: Tiktok },
  { name: '微博', component: Weibo },
  { name: 'QQ', component: TencentQq },
  { name: '支付宝', component: Alipay },
]

async function copyIcon(name: string) {
  try {
    const importStr = `import { ${name} } from '@/client/components/ui/remixIcons'`
    await navigator.clipboard.writeText(importStr)
    copiedIcon.value = name
    setTimeout(() => {
      copiedIcon.value = ''
    }, 2000)
  } catch {}
}
</script>
