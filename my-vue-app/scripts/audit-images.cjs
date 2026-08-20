#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * 图片审计工具：实测全站图片"自然尺寸 vs 渲染尺寸"，找出超配（过大）图片。
 *
 * 用法：
 *   # 1. 先启动 dev server: pnpm dev（或 vite --port 5175）
 *   node scripts/audit-images.cjs                # 全站扫描，输出超配清单
 *   node scripts/audit-images.cjs --base http://localhost:5173
 *   node scripts/audit-images.cjs --shots        # 追加关键页面截图抽查（/tmp/shot-*.png）
 *   node scripts/audit-images.cjs --ratio 2      # 超配阈值（默认 2.5x）
 *
 * 原理：puppeteer 打开每个路由 → 慢速滚动触发懒加载 → 读取所有 img 的
 * naturalWidth/naturalHeight（图片像素）与 getBoundingClientRect（渲染像素）。
 * 渲染为 0x0 的隐藏图片（tab/轮播内）会尝试点击祖先元素展开后重测。
 *
 * 判定超配的标准：自然宽 >= 300px 且 自然宽/渲染宽 > 阈值。
 * 高分屏按 2x DPR 算，阈值可适当放宽到 4。
 *
 * 依赖：项目内 puppeteer-core + 系统 Chrome（/Applications/Google Chrome.app）。
 * 发现超配后，用 scripts/optimize-images.py 的 CONVERT 规格表等比缩小。
 */
const puppeteer = require('puppeteer-core');

// ---- 参数 ----
const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith('--base=')) || '--base=http://localhost:5175').split('=')[1];
const DO_SHOTS = args.includes('--shots');
const RATIO_THRESHOLD = parseFloat((args.find((a) => a.startsWith('--ratio=')) || '--ratio=2.5').split('=')[1]);

// 全站路由（新增页面时在此追加）
const ROUTES = [
  '/', '/gongsijianjie', '/youzhifuwu', '/kehuguanli', '/xiaoshouguanli',
  '/paas', '/bi', '/liuzi', '/shichangguanli', '/hangyeanli', '/zhishiwenda',
  '/gongsidongtai', '/huobanhezuo', '/lianxiwomen', '/xiazaizhongxin',
  '/yonghuxinsheng', '/jianzheyoufen', '/mianfeishiyong', '/ai', '/chanpin',
  '/dingtalk', '/qiweibanben', '/feishubanben',
];

// 截图抽查的页面（--shots 时生效）
const SHOTS = [
  { route: '/', name: 'home' },
  { route: '/gongsijianjie', name: 'company' },
  { route: '/xiazaizhongxin', name: 'download' },
  { route: '/liuzi', name: 'liuzi' },
  { route: '/ai', name: 'ai' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollPage(page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= h; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(100);
  }
  await sleep(1200);
  return h;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const byImg = new Map();

  for (const route of ROUTES) {
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(2000);
      await scrollPage(page);

      const imgs = await page.evaluate(async () => {
        const out = [];
        for (const img of document.querySelectorAll('img')) {
          let rect = img.getBoundingClientRect();
          let w = rect.width, h = rect.height;

          // 隐藏图片（0x0）：向上找可点击的祖先（tab/轮播按钮）点开再测
          if ((!w || !h) && img.naturalWidth) {
            let el = img.parentElement, clicks = 0;
            while ((!w || !h) && el && clicks < 8) {
              const clickable = el.closest('button, [role="tab"], [class*="tab"], [class*="swiper"], a');
              if (clickable && clickable !== document.body) {
                clickable.click();
                await new Promise((r) => setTimeout(r, 400));
                rect = img.getBoundingClientRect();
                w = rect.width; h = rect.height;
                clicks++;
              } else break;
              el = el.parentElement;
            }
          }

          out.push({
            src: img.currentSrc || img.src || '',
            naturalW: img.naturalWidth,
            naturalH: img.naturalHeight,
            renderW: Math.round(w),
            renderH: Math.round(h),
          });
        }
        return out;
      });

      let counted = 0;
      for (const im of imgs) {
        if (!im.src || !im.naturalW || im.src.startsWith('data:')) continue;
        // 跳过远程/上传图，只审计本地静态资源
        if (!new URL(im.src, BASE).pathname.startsWith('/images/')) continue;
        const path = new URL(im.src, BASE).pathname;
        const ratio = im.naturalW / (im.renderW || 1);
        if (!byImg.has(path)) {
          byImg.set(path, { natural: `${im.naturalW}x${im.naturalH}`, render: `${im.renderW}x${im.renderH}`, ratio, pages: new Set() });
        }
        byImg.get(path).pages.add(route);
        if (im.naturalW >= 300 && ratio > RATIO_THRESHOLD) counted++;
      }
      console.log(`[OK] ${route} — imgs=${imgs.length}, 超配=${counted}`);
    } catch (e) {
      console.log(`[FAIL] ${route} — ${e.message.slice(0, 80)}`);
    }
  }

  // ---- 汇总报告 ----
  console.log(`\n===== 超配图片清单（自然宽>=300 且 自然/渲染 > ${RATIO_THRESHOLD}x）=====`);
  const over = [...byImg.entries()]
    .filter(([, d]) => d.render !== '0x0' && d.ratio > RATIO_THRESHOLD)
    .sort((a, b) => b[1].ratio - a[1].ratio);
  for (const [img, d] of over) {
    console.log(
      `${img.padEnd(55)} 自然=${d.natural.padEnd(12)} 渲染=${d.render.padEnd(10)} 超配=${d.ratio.toFixed(1)}x  (${d.pages.size}页)`
    );
  }

  console.log('\n===== 渲染 0x0（未测到显示尺寸，可能藏于深层交互）=====');
  for (const [img, d] of byImg.entries()) {
    if (d.render === '0x0') console.log(`${img.padEnd(55)} 自然=${d.natural}`);
  }

  // ---- 截图抽查 ----
  if (DO_SHOTS) {
    console.log('\n===== 页面截图 =====');
    for (const s of SHOTS) {
      try {
        await page.goto(BASE + s.route, { waitUntil: 'networkidle2', timeout: 30000 });
        const h = await scrollPage(page);
        await page.screenshot({ path: `/tmp/shot-${s.name}.png` });
        console.log(`[OK] ${s.route} -> /tmp/shot-${s.name}.png (高${h}px)`);
      } catch (e) {
        console.log(`[FAIL] ${s.route} — ${e.message.slice(0, 60)}`);
      }
    }
  }

  await browser.close();
  console.log(`\n完成：${byImg.size} 张图片，${over.length} 张超配。`);
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
