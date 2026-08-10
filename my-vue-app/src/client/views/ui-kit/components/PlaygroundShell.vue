<template>
  <div
    :id="sectionId"
    class="bg-surface-elevated border border-border-subtle rounded-card shadow-subtle overflow-hidden scroll-mt-14 lg:scroll-mt-0"
  >
    <!-- 头部 -->
    <div class="p-6 pb-0 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-h2 font-bold text-text-primary mb-1">{{ title }}</h2>
        <p class="text-small text-text-secondary">{{ description }}</p>
      </div>
      <button
        class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[13px] font-medium text-text-secondary border border-border-default hover:text-brand-primary hover:border-brand-primary transition-all duration-fast"
        title="在全屏视口中预览组件"
        @click="openPreview"
      >
        <Fullscreen class="w-3.5 h-3.5" aria-hidden="true" />
        全屏预览
      </button>
    </div>

    <!-- 控制面板 -->
    <div class="px-6 pt-5 pb-0 flex flex-col gap-4">
      <div v-for="ctrl in controls" :key="ctrl.prop" class="flex flex-col gap-2">
        <span class="text-caption font-semibold text-text-tertiary uppercase tracking-wider">{{
          ctrl.label
        }}</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in ctrl.options"
            :key="String(opt.value)"
            :class="[
              'px-4 py-1.5 rounded-pill text-[13px] font-medium transition-all duration-fast',
              currentProps[ctrl.prop] === opt.value
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary border border-border-default hover:text-text-primary hover:border-brand-primary',
            ]"
            @click="setProp(ctrl.prop, opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="p-6">
      <div class="bg-white rounded-card p-6">
        <slot v-bind="currentProps" />
      </div>
    </div>

    <!-- 代码片段 -->
    <CodeSnippet
      :tag="codeTag"
      :props="codeProps"
      :self-closing="codeSelfClosing"
      :slot-content="codeSlotContent"
    />

    <!-- 使用规范 -->
    <div v-if="usageNotes && usageNotes.length > 0" class="px-6 pb-6">
      <div class="bg-surface-tertiary rounded-inner p-4">
        <h4 class="text-small font-semibold text-text-primary mb-2">使用规范</h4>
        <ul class="text-[13px] text-text-secondary space-y-1 list-disc list-inside">
          <li v-for="note in usageNotes" :key="note">{{ note }}</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 全屏预览浮层 -->
  <Teleport to="body">
    <div
      v-if="showPreview"
      class="fixed inset-0 z-50 bg-surface-primary flex flex-col"
      @keydown.escape="closePreview"
    >
      <!-- 顶部工具栏 -->
      <div
        class="shrink-0 flex items-center justify-between px-6 py-3 border-b border-border-subtle bg-surface-primary/95 backdrop-blur-sm"
      >
        <span class="text-small font-medium text-text-secondary">{{ title }} — 全屏预览</span>
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[13px] font-medium text-text-secondary border border-border-default hover:text-text-primary hover:border-text-tertiary transition-all duration-fast"
          @click="closePreview"
        >
          <CloseSmall class="w-3.5 h-3.5" aria-hidden="true" />
          退出预览
        </button>
      </div>
      <!-- 预览内容区 -->
      <div class="flex-1 overflow-auto">
        <slot v-bind="currentProps" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch, onUnmounted } from 'vue'
import { CloseSmall, Fullscreen } from '@/client/components/ui/remixIcons'
import CodeSnippet from './CodeSnippet.vue'

interface PlaygroundControl {
  label: string
  prop: string
  options: { label: string; value: string | number | boolean }[]
}

interface PlaygroundShellProps {
  /** 用于侧边栏定位的 section ID */
  sectionId?: string
  title: string
  description: string
  controls: PlaygroundControl[]
  initialProps: Record<string, unknown>
  /** 代码片段中的组件标签名 */
  codeTag?: string
  /** 额外的代码 props（不参与控制，但显示在代码中） */
  codeExtraProps?: Record<string, string>
  /** 是否为自闭合标签 */
  codeSelfClosing?: boolean
  /** 代码片段中的 slot 内容 */
  codeSlotContent?: string
  usageNotes?: string[]
}

const props = withDefaults(defineProps<PlaygroundShellProps>(), {
  sectionId: '',
  codeTag: '',
  codeSelfClosing: false,
  codeSlotContent: '',
})

// 响应式 props 状态
const currentProps = reactive<Record<string, unknown>>({ ...props.initialProps })

function setProp(key: string, value: unknown) {
  currentProps[key] = value
}

// 全屏预览状态
const showPreview = ref(false)

function openPreview() {
  showPreview.value = true
  document.body.style.overflow = 'hidden'
}

function closePreview() {
  showPreview.value = false
  document.body.style.overflow = ''
}

// ESC 关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showPreview.value) {
    closePreview()
  }
}

watch(showPreview, (val) => {
  if (val) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

// 生成代码片段所需的 props 对象
const codeProps = computed<Record<string, string>>(() => {
  const result: Record<string, string> = {}
  for (const ctrl of props.controls) {
    const val = currentProps[ctrl.prop]
    // 字符串类型加引号，其他直接显示
    if (typeof val === 'string') {
      result[ctrl.prop] = `"${val}"`
    } else {
      result[ctrl.prop] = String(val)
    }
  }
  // 合并额外 props
  if (props.codeExtraProps) {
    Object.assign(result, props.codeExtraProps)
  }
  return result
})
</script>
