<template>
  <div class="flex flex-col items-center gap-4 py-20 px-4" role="alert">
    <Caution
      :size="120"
      theme="filled"
      :strokeWidth="5"
      class="opacity-40 text-status-error"
      aria-hidden="true"
    />
    <p class="text-body text-text-tertiary">{{ title }}{{ message ? '：' + message : '' }}</p>
    <Button variant="outline" size="sm" @click="$emit('retry')">重试</Button>
  </div>
</template>

<script setup lang="ts">
import { Caution } from '@icon-park/vue-next'
import Button from './Button.vue'

interface ErrorStateProps {
  title?: string
  message?: string
}

withDefaults(defineProps<ErrorStateProps>(), {
  title: '加载失败',
  message: '',
})

defineEmits<{
  retry: []
}>()
</script>
