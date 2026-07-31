#!/usr/bin/env node
/**
 * 文档一致性检查脚本
 *
 * 检查以下跨文件一致性：
 * 1. README.md 中列出的测试命令在 package.json 中存在
 * 2. architecture.md 中的路由结构与 router.ts 一致
 * 3. 关键配置文件的基本完整性
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

let errors = 0

function error(msg) {
  console.error(`  ❌ ${msg}`)
  errors++
}

function ok(msg) {
  console.log(`  ✅ ${msg}`)
}

// ---- 1. package.json 脚本一致性 ----
console.log('\n📋 检查 package.json 脚本一致性...')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))
const scripts = Object.keys(pkg.scripts)

// 检查 README.md 中提到的命令是否都存在
const readme = readFileSync(join(root, 'README.md'), 'utf-8')
// 提取所有 bash 代码块和 inline code 中的 pnpm 命令
const readmeCommands = new Set()
// 匹配 inline code: `pnpm xxx`
for (const m of readme.matchAll(/`pnpm\s+([a-z][a-z0-9:._-]+)`/g)) {
  readmeCommands.add(m[1])
}
// 匹配 bash 代码块中的 pnpm 命令
const bashBlocks = readme.matchAll(/```bash\n([\s\S]*?)```/g)
for (const block of bashBlocks) {
  for (const m of block[1].matchAll(/pnpm\s+([a-z][a-z0-9:._-]+)/g)) {
    readmeCommands.add(m[1])
  }
}
for (const cmd of readmeCommands) {
  if (cmd === 'install') continue // 跳过 pnpm install（不是脚本）
  if (!scripts.includes(cmd)) {
    error(`README.md 引用了不存在的命令: pnpm ${cmd}`)
  } else {
    ok(`pnpm ${cmd}`)
  }
}

// 检查 CLAUDE.md 中提到的命令
const claude = readFileSync(join(root, 'CLAUDE.md'), 'utf-8')
const claudeCommands = new Set()
for (const m of claude.matchAll(/`pnpm\s+([a-z][a-z0-9:._-]+)`/g)) {
  claudeCommands.add(m[1])
}
const claudeBashBlocks = claude.matchAll(/```bash\n([\s\S]*?)```/g)
for (const block of claudeBashBlocks) {
  for (const m of block[1].matchAll(/pnpm\s+([a-z][a-z0-9:._-]+)/g)) {
    claudeCommands.add(m[1])
  }
}
for (const cmd of claudeCommands) {
  if (cmd === 'install') continue
  if (!scripts.includes(cmd)) {
    error(`CLAUDE.md 引用了不存在的命令: pnpm ${cmd}`)
  }
}

// ---- 2. pre-commit hook 一致性 ----
console.log('\n📋 检查 pre-commit hook 一致性...')
const precommitPath = join(root, '.husky', 'pre-commit')
if (existsSync(precommitPath)) {
  const precommit = readFileSync(precommitPath, 'utf-8').trim()
  // 检查 pre-commit 中引用的命令是否在 package.json 中存在
  const hookCmds = precommit
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  for (const cmd of hookCmds) {
    if (cmd.startsWith('npx ')) {
      const bin = cmd.replace('npx ', '').split(' ')[0]
      if (bin === 'lint-staged') {
        if (pkg['lint-staged']) {
          ok(`pre-commit → npx lint-staged（lint-staged 配置已存在）`)
        } else {
          error(`pre-commit 使用 lint-staged 但 package.json 中无 lint-staged 配置`)
        }
      }
    } else if (cmd.startsWith('npm ') || cmd.startsWith('pnpm ')) {
      const scriptName = cmd.split(' ')[1]
      if (!scripts.includes(scriptName)) {
        error(`pre-commit 引用了不存在的脚本: ${cmd}`)
      } else {
        ok(`pre-commit → ${cmd}`)
      }
    }
  }
} else {
  error('.husky/pre-commit 不存在')
}

// ---- 3. 路由结构一致性 ----
console.log('\n📋 检查路由文档一致性...')
const routerPath = join(root, 'src', 'client', 'router.ts')
if (existsSync(routerPath)) {
  const routerContent = readFileSync(routerPath, 'utf-8')
  const routePaths = [...routerContent.matchAll(/path:\s*['"](\/[^'"]*)/g)].map(
    (m) => m[1]
  )

  // 检查 architecture.md 中是否覆盖了所有路由
  const archContent = readFileSync(
    join(root, '.claude', 'memory', 'architecture.md'),
    'utf-8'
  )
  for (const route of routePaths) {
    if (route === '/:pathMatch(.*)*' || route === '/:pageSlug' || route === '/:pageSlug/:id') {
      continue // 动态路由兜底，不需要严格检查
    }
    if (!archContent.includes(route)) {
      error(`architecture.md 缺少路由: ${route}`)
    }
  }
  ok('路由结构检查完成')

  // 检查 README.md
  for (const route of routePaths) {
    if (route === '/:pathMatch(.*)*' || route === '/:pageSlug' || route === '/:pageSlug/:id') {
      continue
    }
    if (!readme.includes(route)) {
      error(`README.md 缺少路由: ${route}`)
    }
  }
  ok('README.md 路由检查完成')
}

// ---- 4. index.html 基本检查 ----
console.log('\n📋 检查 HTML 入口文件...')
const indexHtml = readFileSync(join(root, 'index.html'), 'utf-8')
if (!indexHtml.includes('lang="zh-CN"')) {
  error('index.html 缺少 lang="zh-CN"')
} else {
  ok('index.html lang="zh-CN"')
}
if (indexHtml.includes('<title>Vite App</title>')) {
  error('index.html 使用了默认标题 "Vite App"')
} else {
  ok('index.html 标题已设置')
}

// ---- 5. lint-staged glob 检查 ----
console.log('\n📋 检查 lint-staged 配置...')
const lintStaged = pkg['lint-staged']
if (lintStaged) {
  for (const [glob, _commands] of Object.entries(lintStaged)) {
    if (glob.startsWith('*.')) {
      error(`lint-staged glob "${glob}" 只匹配根目录，应使用 "**/${glob}"`)
    } else {
      ok(`lint-staged glob: ${glob}`)
    }
  }
}

// ---- 6. 技术栈一致性 ----
console.log('\n📋 检查技术栈文档一致性...')
const archContent = readFileSync(
  join(root, '.claude', 'memory', 'architecture.md'),
  'utf-8'
)
const deps = { ...pkg.dependencies, ...pkg.devDependencies }

// 检查 architecture.md 中提到的技术是否在 package.json 中有对应依赖
const techMentions = [
  { name: 'Playwright', dep: '@playwright/test', optional: true },
  { name: 'Cypress', dep: 'cypress' },
  { name: 'Vitest', dep: 'vitest' },
  { name: 'Tailwind CSS v4', dep: 'tailwindcss' },
  { name: 'Element Plus', dep: 'element-plus' },
  { name: 'Pinia', dep: 'pinia' },
  { name: 'Vue Router', dep: 'vue-router' },
]
for (const { name, dep, optional } of techMentions) {
  if (archContent.includes(name)) {
    if (!deps[dep]) {
      if (!optional) {
        error(`architecture.md 提到 "${name}" 但 package.json 中无 "${dep}" 依赖`)
      }
    } else {
      ok(`"${name}" ↔ "${dep}"`)
    }
  }
}

// ---- 总结 ----
console.log('\n' + '='.repeat(50))
if (errors > 0) {
  console.error(`❌ 文档一致性检查失败: ${errors} 个错误`)
  process.exit(1)
} else {
  console.log('✅ 文档一致性检查通过')
}