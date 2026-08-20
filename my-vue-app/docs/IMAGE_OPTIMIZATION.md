# 本地静态图片优化审计

> 基准日期：2026-08-20。审计范围为 `public/images/`（共 297 个文件）以及 `src/` 中对 `/images/` 的静态引用；不包含 API、CMS 和富文本动态图片。

## 文档定位

- 本文档只维护需要处理的图片、缺失引用和统一判定标准，不再逐项记录已达标的小图片。
- 页面图片是否为正式素材、Mock 或占位图，可参考 [`IMAGE_INVENTORY.md`](./IMAGE_INVENTORY.md)；该清单仍含部分历史路径，实际路径、尺寸和引用状态以当前仓库为准。
- 图片的实际尺寸和文件大小以仓库文件为准。完成压缩、替换或删除后，应同步更新本文档。
- `src/client/views/ui-kit/BusinessPage.vue` 是组件演示页，其中的缺失图片引用单独标注，不等同于线上业务页面故障。

## 一、优化标准

| 类型           | 建议标准                             | 说明                                         |
| -------------- | ------------------------------------ | -------------------------------------------- |
| 全宽 Hero 背景 | 1920px 宽；优先 WebP/AVIF            | 无需为普通桌面端保留 2880px 或 5120px 原图   |
| 大尺寸业务图   | 按实际最大显示尺寸导出（1x）         | Hero、CTA、Tab 和宽度 ≥680px 的图片不使用 2x |
| 小尺寸业务图   | 默认 1x；必要时最多 2x               | 仅限显示宽度 ≤400px 且体积达标的关键细节图   |
| 照片/复杂渐变  | 优先 JPEG、WebP 或 AVIF              | 不需要透明通道时避免使用超大 PNG             |
| UI 截图/透明图 | PNG 或 WebP                          | 先无损压缩，再评估有损 WebP                  |
| 小图标         | 优先 SVG；位图最多 2x                | 64px 图标通常不应保留 600px 原图             |
| 单文件体积     | 首屏建议 ≤300KiB，非首屏建议 ≤500KiB | 达到 1000KiB 默认进入 P0，除非有明确视觉依据 |

> 目标尺寸必须结合组件实际显示尺寸确定。当前常用组件基准见文末“组件尺寸速查”。

## 二、P0：达到 1000KiB 的图片资源

以下文件会显著增加页面加载或仓库存储成本，应优先处理。清单覆盖仓库中的全部大文件，但不代表每个文件都仍被业务源码引用；疑似遗留资源应先确认引用再删除。

| 图片路径                                  |  当前尺寸 | 当前大小（KiB） | 使用位置/建议                                        |
| ----------------------------------------- | --------: | --------------: | ---------------------------------------------------- |
| `images/service/youzhibg3.png`            | 5120×2876 |           6,525 | 优质服务页；按组件最大显示尺寸导出并转 WebP/AVIF     |
| `images/service/youzhibg2.png`            | 5120×2876 |           5,942 | 同上                                                 |
| `images/service/youzhibg1.png`            | 5120×2876 |           4,425 | 同上                                                 |
| `images/cust-choise.png`                  | 4680×2604 |           4,330 | 首页视频区；按约 600×400 的实际显示尺寸导出          |
| `images/cases/hangye_img-2.jpg`           | 4300×3010 |           3,578 | 案例列表封面；按 ContentList 最大显示尺寸导出        |
| `images/liuzi/ability-1.png`              | 1792×1604 |           3,320 | 留咨页能力卡；按组件比例裁切后以实际显示尺寸导出     |
| `images/banner3.png`                      |  2880×840 |           3,056 | 首页旧 Banner 资产；先确认是否仍需保留，再压缩/删除  |
| `images/cservice.png`                     | 1251×2156 |           2,568 | 全站浮动服务图；按实际显示尺寸导出                   |
| `images/company/research-strength-07.png` | 1583×2233 |           1,776 | 公司介绍画廊；优先转照片格式                         |
| `images/cases/hero-banner.png`            | 5120×1332 |           1,699 | 案例页首屏；缩至 1920px 宽并转 WebP/AVIF             |
| `images/cases/hangye_img-3.jpg`           | 5000×3750 |           1,658 | 案例列表封面；按 ContentList 最大显示尺寸导出        |
| `images/company/research-strength-06.png` | 1626×2195 |           1,555 | 公司介绍画廊；优先转照片格式                         |
| `images/news/hero-banner.png`             | 5120×1332 |           1,540 | 新闻页首屏；缩至 1920px 宽并压缩                     |
| `images/paas/blank-showcase.png`          |  1360×840 |           1,504 | PaaS 页面占位图；降至 680×420 或复用轻量 SVG         |
| `images/qiwei/hero-banner.png`            |  1920×500 |           1,496 | 企微页首屏；尺寸合理但体积过大                       |
| `images/service-hours.png`                | 1472×2656 |           1,412 | 首页服务体系；按组件比例裁切，导出画布不超过 360×400 |
| `images/consultant.png`                   |  848×1264 |           1,387 | 首页服务体系；按组件比例裁切，导出画布不超过 360×400 |
| `images/banner2.png`                      |  2880×840 |           1,368 | 首页旧 Banner 资产；先确认是否仍需保留，再压缩/删除  |
| `images/sales/pdca-loop.png`              |  1360×840 |           1,181 | 销售管理 Tab；降至 680×420 并压缩                    |
| `images/banner4.png`                      |  2880×840 |           1,153 | 首页当前 Banner；缩至 1920×560 并压缩                |
| `images/sales/tab-report-4.png`           |  1360×840 |           1,143 | 销售管理 Tab；降至 680×420 并压缩                    |
| `images/sales/track-trace.png`            |  1360×840 |           1,092 | 销售管理 Tab；降至 680×420 并压缩                    |
| `images/customer/dedup-report-new.png`    |  1360×840 |           1,091 | 客户管理 Tab；降至 680×420 并压缩                    |
| `images/paas/opportunity-process.png`     |  1360×840 |           1,074 | PaaS Tab；降至 680×420 并压缩                        |
| `images/2-2.png`                          | 1024×1024 |           1,069 | 首页解决方案卡；按组件比例裁切后以 276×200 导出      |
| `images/sales/tab-report-3.png`           |  1360×840 |           1,039 | 销售管理 Tab；降至 680×420 并压缩                    |
| `images/customer/dedup-rules-new.png`     |  1360×840 |           1,021 | 客户管理 Tab；降至 680×420 并压缩                    |
| `images/customer/dedup-collision-new.png` |  1360×840 |           1,001 | 客户管理 Tab；降至 680×420 并压缩                    |

## 三、P1：尺寸明显超标或体积接近 500–1000KiB

### 3.1 尺寸明显超标

| 图片路径                                           |  当前尺寸 | 当前大小 | 建议                                             |
| -------------------------------------------------- | --------: | -------: | ------------------------------------------------ |
| `images/liuzi/analysis.png`                        | 4320×2700 |    404KB | 显示宽度约 500px，最多保留 1000px 宽             |
| `images/new2022/products/banner-large.jpg`         |  5040×580 |     59KB | 缩至 1920px 宽，防止解码内存浪费                 |
| `images/youzhikehubg.png`                          |  5081×581 |     55KB | 缩至 1920px 宽；当前服务页主视觉引用该文件       |
| `images/AI/ai-intro.png`、`images/ai/ai-intro.png` | 2952×1872 | 各 367KB | 存在大小写目录重复，确认唯一规范路径后去重       |
| `images/download/xbbup.png`                        | 1801×1801 |     39KB | 下载图标显示约 200px，保留 400×400 即可          |
| `images/liuzi/2-5.png`                             |   600×600 |    424KB | 实际作为约 40–64px 标题图标，改用 128×128 或 SVG |

### 3.2 主要 P1 资源系列

以下系列中的主要文件接近或处于 500–1000KiB。现有图片多为 1360×840，但页面显示通常约为 680×420，应优先降至 1x 后再做格式转换或压缩。为便于同系列统一治理，也包含少量低于 500KiB 的文件：

- `images/customer/tab-*-new.png`、`images/customer/dedup-*-new.png`
- `images/sales/*.png` 中的业务截图
- `images/paas/*.png` 中的业务截图
- `images/BI/*.png` 中的业务截图
- `images/company/research-strength-*` 与 `images/company/honor.png`
- `images/dingtalk/hero-banner.png`、`images/feishu/hero-banner.png`
- `images/market/market-customer.png`、`images/market/hero-banner.png`

## 四、源码引用但文件缺失

### 4.1 业务页面引用

| 缺失路径                              | 引用位置                    | 影响/建议                                            |
| ------------------------------------- | --------------------------- | ---------------------------------------------------- |
| `images/customer/tab-showcase-bg.png` | `CustomerManagement.vue`    | 客户管理 Tab 背景请求 404；补图或移除 CSS 背景       |
| `images/free-trial/hero.png`          | `trialData.ts`              | 免费试用页主视觉缺失；优先补充                       |
| `images/customer/hero.png`            | `partnerCooperationData.ts` | 伙伴合作页主视觉缺失；替换为正式素材                 |
| `images/sales/hero.png`               | `salesManagementData.ts`    | 销售管理配置仍引用缺失主视觉；确认组件是否展示后修正 |

### 4.2 UI Kit 演示页引用

以下缺失路径只在 `src/client/views/ui-kit/BusinessPage.vue` 中作为演示数据使用：

- `images/customer/hero.svg`
- `images/customer/product-intro.svg`
- `images/customer/tab-unified.svg`
- `images/customer/tab-tracking.svg`
- `images/customer/tab-retention.svg`
- `images/customer/tab-collaboration.svg`
- `images/nnlx_mimg.jpg`

应替换为现有资源或显式使用统一占位图，避免 UI Kit 控制台出现 404。

### 4.3 数据文件中的同目录缺失引用

钉钉、飞书和企微数据文件均引用了本目录下尚不存在的 `product-intro.png`、`tab-tracking-new.png`、`tab-collaboration-new.png`、`dedup-report-new.png`、`dedup-rules-new.png`。这些引用不应通过复制客户管理图片来掩盖，应补充对应平台的正式截图或调整页面数据。

## 五、已确认的历史记录修正

- `images/sales/tab-report-1.png` 至 `tab-report-4.png` 已存在，尺寸均为 1360×840；旧文档将其标为“文件缺失”已不准确。
- `images/dingtalk/dingtalk03.png`、`images/feishu/feishu-1@2x.png`、`images/qiwei/qiwei-1@2x.png` 当前不存在，且对应页面数据已改为 `product-intro.png`；不再作为当前优化对象。
- `images/paas/hero-banner.jpg` 当前为 1920×560、约 76KiB，已达标，不再列入 P1。
- 旧的根目录 `images/youzhibg1.png` 至 `youzhibg3.png` 虽然体积很小，但当前服务页引用的是 `images/service/youzhibg*.png`；后者均为 4–7MB，应优先处理，并在确认无引用后删除旧副本。
- `images/customer/dedup-1.png` 和 `dedup-2.png` 当前实际为 560×374，并非旧记录中的 680×420。
- `images/market/hero-banner.png` 当前约 407KiB，并非旧记录中的 1,527KiB。

## 六、组件尺寸速查

| 组件/场景             |  显示尺寸（约） | 建议导出尺寸 | 高密度图策略                 |
| --------------------- | --------------: | -----------: | ---------------------------- |
| HeroBanner 背景       |       1920×auto |    1920×auto | 仅 1x                        |
| HeroBanner 主视觉     |         510×420 |      510×420 | 仅 1x                        |
| CTASection            |         920×575 |      920×575 | 仅 1x                        |
| TabShowcase           | 680–756×420–467 |      680×420 | 仅 1x                        |
| ImageShowcase         |         680×420 |      680×420 | 仅 1x                        |
| FeatureImageCard      |         276×200 |      276×200 | 默认 1x，关键细节可评估 2x   |
| GradientCardGrid      |         276×173 |      276×173 | 默认 1x，关键细节可评估 2x   |
| ContentList 封面      |      约 400×240 |      400×240 | 默认 1x                      |
| PlatformDownload 图标 |         200×200 |      200×200 | 小图可在体积达标时提供 2x    |
| 小图标                |         40–64px |        64×64 | 优先 SVG；位图最多提供 128px |

## 七、更新与验收流程

1. 确认图片的实际使用页面、CSS 显示尺寸和是否需要透明通道。
2. 导出优化版本；若改扩展名，同步修改所有源码引用。
3. 对比关键断点的清晰度，不允许为追求体积造成可见失真。
4. 运行 `pnpm type-check`、`pnpm build`、`pnpm check-docs` 和生产预览下受影响页面的浏览器验证。
5. 检查浏览器 Network：无新增 404，记录优化前后的传输体积和解码尺寸；首屏图片还应复测 LCP。
6. 改用 WebP/AVIF 时，确认目标浏览器兼容范围和回退策略。
7. 更新本文档中的基准日期、P0/P1 清单和缺失引用。

可使用以下脚本快速重新生成大文件清单（需本机安装 Pillow）：

```bash
python3 - <<'PY'
from pathlib import Path
from PIL import Image

root = Path('public/images')
for path in sorted(root.rglob('*'), key=lambda item: item.stat().st_size if item.is_file() else 0, reverse=True):
    if not path.is_file() or path.stat().st_size < 500 * 1024:
        continue
    try:
        with Image.open(path) as image:
            dimensions = f'{image.width}×{image.height}'
    except OSError:
        dimensions = '—'
    print(f'{path.relative_to(root)}\t{dimensions}\t{path.stat().st_size / 1024:.0f}KiB')
PY
```
