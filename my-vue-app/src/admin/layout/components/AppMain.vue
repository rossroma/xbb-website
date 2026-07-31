<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-main {
  flex: 1;
  overflow: auto;
  overscroll-behavior: contain;
  background-color: #f0f2f5;
  padding: 20px;
}

/* fade-transform — 页面左右滑动过渡 */
.fade-transform-enter-active {
  transition:
    opacity 0.36s ease-out,
    transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.fade-transform-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
