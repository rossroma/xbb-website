<template>
  <div class="mx-6 mb-6 bg-[#1e293b] rounded-inner overflow-hidden">
    <!-- 顶部栏 -->
    <div class="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)]">
      <span class="text-[11px] text-[rgba(255,255,255,0.4)] font-mono uppercase tracking-wider">代码</span>
      <button
        class="text-[11px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] transition-colors duration-fast font-mono"
        @click="copyCode"
      >
        {{ copied ? '已复制!' : '复制' }}
      </button>
    </div>
    <!-- 代码内容 -->
    <pre class="p-4 text-[13px] leading-[1.7] overflow-x-auto"><code class="text-[#e2e8f0] font-mono">{{ codeText }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CodeSnippetProps {
  tag: string
  props: Record<string, string>
  selfClosing?: boolean
  slotContent?: string
}

const props = withDefaults(defineProps<CodeSnippetProps>(), {
  selfClosing: false,
  slotContent: '',
})

const copied = ref(false)

// 生成代码文本
const codeText = computed(() => {
  const propEntries = Object.entries(props.props)
  const propLines = propEntries.map(([key, value]) => `  ${key}="${value}"`)

  const tag = props.tag || 'Component'

  if (props.selfClosing) {
    if (propLines.length === 0) {
      return `<${tag} />`
    }
    return `<${tag}\n${propLines.join('\n')}\n/>`
  }

  if (propLines.length === 0) {
    if (props.slotContent) {
      return `<${tag}>\n  ${props.slotContent}\n</${tag}>`
    }
    return `<${tag}>...</${tag}>`
  }

  if (props.slotContent) {
    return `<${tag}\n${propLines.join('\n')}\n>\n  ${props.slotContent}\n</${tag}>`
  }

  return `<${tag}\n${propLines.join('\n')}\n>`
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeText.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
  }
}
</script>