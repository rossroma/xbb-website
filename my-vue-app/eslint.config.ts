import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import pluginTailwindcss from 'eslint-plugin-tailwindcss'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  // 全局加载 tailwindcss 插件，使 lint:tailwind / lint:tailwind-strict 脚本的 --rule 标志可用
  {
    name: 'app/tailwindcss-global-plugin',
    plugins: { tailwindcss: pluginTailwindcss },
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '.vite/**',
    '**/cypress/**',
    'src/official/**',
    'src/admin/**',
    'tests/**',
  ]),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // 关闭 multi-word-component-names：UI Kit 组件名如 Button、Card 为单词合理
  {
    name: 'app/disable-multi-word-component-names',
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    ...pluginCypress.configs.recommended,
    files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  // Tailwind CSS 样式规范：覆盖 client 目录下所有文件
  // 使用 no-unnecessary-arbitrary-value：仅拦截有设计令牌可替代的任意值
  // 如 text-[14px] 有 text-small 替代 → 报错；left-[60px] 无对应 token → 放行

  // Tailwind CSS v4 配置：指定 @theme 所在的 CSS 文件路径
  {
    name: 'app/tailwind-settings',
    settings: {
      tailwindcss: {
        config: 'src/client/styles/tailwind.css',
      },
    },
  },

  {
    name: 'app/tailwind-client',
    files: ['src/client/**/*.vue'],
    plugins: { tailwindcss: pluginTailwindcss },
    rules: {
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'warn',
    },
  },

  skipFormatting,
)
