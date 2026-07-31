/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@wangeditor/editor-for-vue' {
  import type { Component } from 'vue'
  export const Editor: Component
  export const Toolbar: Component
}
