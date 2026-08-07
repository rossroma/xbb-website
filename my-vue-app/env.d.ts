/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // SSR 由 vite/client 提供，此处仅为补全自定义变量
}

declare module '@wangeditor/editor-for-vue' {
  import type { Component } from 'vue'
  export const Editor: Component
  export const Toolbar: Component
}
