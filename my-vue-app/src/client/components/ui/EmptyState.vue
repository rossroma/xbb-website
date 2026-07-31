<template>
  <div class="flex flex-col items-center gap-4 py-20 px-4" role="status">
    <Inbox
      :size="120"
      theme="filled"
      :strokeWidth="5"
      class="opacity-40 text-text-tertiary"
      aria-hidden="true"
    />
    <p class="text-body text-text-tertiary">{{ message }}</p>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from '@icon-park/vue-next'

interface EmptyStateProps {
  message?: string
}

withDefaults(defineProps<EmptyStateProps>(), {
  message: '暂无数据',
})
</script>
