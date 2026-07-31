<template>
  <RouterView v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup lang="ts">
// 管理端根组件
</script>
