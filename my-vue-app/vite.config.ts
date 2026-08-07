import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:3000'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
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