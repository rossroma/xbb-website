<template>
  <RouterView v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
// 客户端根组件 - 无状态纯静态页面
</script>
