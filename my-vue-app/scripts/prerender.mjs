/**
 * 构建后预渲染脚本 — 使用 Puppeteer 渲染每个静态路由并输出 HTML 文件。
 *
 * 用法：node scripts/prerender.mjs
 *
 * 前提：
 *   1. 已执行 `vite build`（生成 dist/ 目录）
 *   2. 后端 API 可访问（否则使用 SEO fallback 值）
 *   3. 系统已安装 Chrome 或 Chromium
 *
 * 工作流程：
 *   1. 启动静态文件服务器（localhost:9753）服务 dist/ 目录
 *   2. 使用 Puppeteer 逐个访问路由，等待 `prerender-ready` 事件
 *   3. 将渲染后的 HTML 写入 dist/<route>/index.html
 */

import { createServer } from 'node:http'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = resolve(__dirname, '..', 'dist')
const PORT = 9753

// 与 router.ts 保持同步的静态路由列表
const ROUTES = [
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
]

// ========== 静态文件服务器 ==========

function getContentType(pathname) {
  if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) return 'application/javascript'
  if (pathname.endsWith('.css')) return 'text/css'
  if (pathname.endsWith('.html')) return 'text/html'
  if (pathname.endsWith('.json')) return 'application/json'
  if (pathname.endsWith('.svg')) return 'image/svg+xml'
  if (pathname.endsWith('.png')) return 'image/png'
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg'
  if (pathname.endsWith('.ico')) return 'image/x-icon'
  return 'application/octet-stream'
}

const server = createServer((req, res) => {
  let pathname = req.url?.split('?')[0] || '/'

  // SPA fallback: 所有非静态资源路径返回 index.html
  const ext = pathname.split('.').pop()
  if (!ext || ext === pathname || ext === '/') {
    pathname = '/index.html'
  }

  const filePath = resolve(DIST_DIR, `.${pathname}`)

  try {
    const content = readFileSync(filePath)
    res.writeHead(200, { 'Content-Type': getContentType(pathname) })
    res.end(content)
  } catch {
    // 404 → 返回 SPA index.html（Vue Router 处理客户端路由）
    try {
      const fallback = readFileSync(resolve(DIST_DIR, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(fallback)
    } catch {
      res.writeHead(404)
      res.end('Not Found')
    }
  }
})

// ========== 预渲染逻辑 ==========

async function prerender() {
  // 0. 检查 Chromium 是否可用（本地开发环境可能没有安装）
  const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  if (!executablePath) {
    console.warn('[prerender] ⚠️  PUPPETEER_EXECUTABLE_PATH 未设置，跳过预渲染（本地开发可忽略）')
    server.close()
    return
  }

  // 1. 启动静态文件服务器
  await new Promise((resolve) => server.listen(PORT, resolve))
  console.log(`[prerender] Static server: http://localhost:${PORT}`)

  // 2. 启动浏览器
  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  let success = 0
  let failed = 0

  try {
    // 3. 逐个渲染路由（限制并发为 4）
    const CONCURRENCY = 4
    for (let i = 0; i < ROUTES.length; i += CONCURRENCY) {
      const batch = ROUTES.slice(i, i + CONCURRENCY)
      await Promise.all(
        batch.map(async (route) => {
          const page = await browser.newPage()
          try {
            const url = `http://localhost:${PORT}${route}`
            console.log(`[prerender] Rendering ${route}...`)

            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

            // 等待 prerender-ready 事件
            try {
              await page.waitForFunction(
                () => (window).__PRERENDER_READY__ === true,
                { timeout: 10000 },
              )
            } catch {
              // 超时也继续 — 使用 fallback 值
              console.warn(`[prerender] ⚠️  ${route}: prerender-ready timeout, using fallback`)
            }

            const html = await page.content()

            // 写入 dist/<route>/index.html
            const outputDir = resolve(DIST_DIR, `.${route}`)
            mkdirSync(outputDir, { recursive: true })
            writeFileSync(resolve(outputDir, 'index.html'), html, 'utf8')

            console.log(`[prerender] ✅ ${route} → dist${route}/index.html`)
            success++
          } catch (err) {
            console.error(`[prerender] ❌ ${route}: ${err.message}`)
            failed++
          } finally {
            await page.close()
          }
        }),
      )
    }
  } finally {
    await browser.close()
    server.close()
  }

  console.log(`\n[prerender] Done: ${success} succeeded, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

prerender()