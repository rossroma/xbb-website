import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 从 node_modules 模块路径中提取包名，用于 manualChunks 精确匹配。
 *
 * 支持的路径格式：
 * - pnpm: node_modules/.pnpm/vue-router@5.0.3/node_modules/vue-router/dist/...
 * - pnpm scoped: node_modules/.pnpm/@unhead+vue@1.11.20/node_modules/@unhead/vue/dist/...
 * - 标准: node_modules/vue-router/dist/...
 *
 * 返回包名（如 'vue-router'、'@unhead/vue'），非 node_modules 模块返回 null。
 */
function extractPackageName(id: string): string | null {
  // 匹配 node_modules/ 后的包名部分
  // pnpm 结构: node_modules/.pnpm/<encoded>.../node_modules/<actual-pkg-name>
  // 标准结构: node_modules/<pkg-name>
  const match = id.match(/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@?[^/]+(?:\/[^/]+)?)/)
  return match ? match[1] : null
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3000'
  const uploadsTarget = env.VITE_UPLOADS_TARGET || 'https://bbs.xbongbong.com'

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
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
        '/Uploads': {
          target: uploadsTarget,
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
        output: {
          manualChunks(id) {
            // 从 node_modules 路径中提取包名，精确匹配避免子串误伤
            // 支持 pnpm 结构（.pnpm/pkg@version/node_modules/pkg-name）和标准结构
            const pkg = extractPackageName(id)
            if (!pkg) return

            // Vue 运行时核心：vue-router、pinia、@vue/runtime-core 等
            if (pkg === 'vue-router' || pkg === 'pinia' || pkg.startsWith('@vue/')) {
              return 'vue-vendor'
            }
            // Head 管理：@unhead/* + unhead
            if (pkg.startsWith('@unhead/') || pkg === 'unhead') {
              return 'head-vendor'
            }
          },
        },
      },
    },
    ssgOptions: {
      // 预渲染的静态路由列表（与旧 prerender.mjs 的 ROUTES 保持一致）
      includedRoutes: () => [
        '/',
        '/chanpin',
        '/kehuguanli',
        '/xiaoshouguanli',
        '/shichangguanli',
        '/bi',
        '/ai',
        '/paas',
        '/dingtalk',
        '/feishubanben',
        '/qiweibanben',
        '/gongsidongtai',
        '/hangyeanli',
        '/yonghuxinsheng',
        '/zhishiwenda',
        '/gongsijianjie',
        '/lianxiwomen',
        '/mianfeishiyong',
        '/liuzi',
        '/huobanhezuo',
        '/jianzheyoufen',
        '/youzhifuwu',
        '/xiazaizhongxin',
      ],
    },
  }
})
