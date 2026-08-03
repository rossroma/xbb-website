import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 多页应用 history 模式路由回退插件
 *
 * Vite 默认 SPA fallback 将所有路径回退到 index.html，
 * 导致 /admin/* 路径刷新时进入前台 404。该插件在 Vite 内置
 * HTML fallback 之前拦截请求，将 /admin* 和 /login 路径
 * 回退到 admin.html。
 */
function multiPageHistoryFallback() {
  return {
    name: 'multi-page-history-fallback',
    configureServer(server: any) {
      return () => {
        server.middlewares.use((req: any, _res: any, next: any) => {
          // 仅处理 GET 请求且接受 HTML 的请求，避免影响静态资源
          if (
            req.method === 'GET' &&
            req.headers.accept &&
            req.headers.accept.includes('text/html')
          ) {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
            const pathname = url.pathname

            if (pathname.startsWith('/admin') || pathname === '/login') {
              req.url = '/admin.html'
            }
          }
          next()
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      multiPageHistoryFallback(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/v1': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
  }
})
