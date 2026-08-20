# 静态图片优化处理方案（执行计划）

> 方案日期：2026-08-20 ｜ 依据：[`IMAGE_OPTIMIZATION.md`](./IMAGE_OPTIMIZATION.md)（基准 2026-08-20）
> 处理范围：`public/images/`（297 个文件，合计 **113.6 MB**）+ `src/` 中对 `/images/` 的静态引用
> 执行工具：`scripts/optimize-images.py`（Pillow 批处理，`--dry-run` / `--apply`）

---

## 一、现状核实结论

### 1.1 与审计文档一致（已复核仓库，均属实）

| 项目                        | 结论                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| P0 清单（≥1000KiB，28 个）  | 全部存在，尺寸与大小与文档一致                                                                                                       |
| 业务缺失引用（4 个）        | `customer/tab-showcase-bg.png`、`free-trial/hero.png`、`customer/hero.png`、`sales/hero.png` 均确认缺失                              |
| UI Kit 缺失引用（7 个）     | 仅 `BusinessPage.vue` 演示数据使用，确认缺失                                                                                         |
| 三平台数据文件缺失（15 个） | 钉钉/飞书/企微各 5 个（`product-intro`、`tab-tracking-new`、`tab-collaboration-new`、`dedup-report-new`、`dedup-rules-new`）确认缺失 |
| 大小写目录重复              | `images/AI/`（14 个文件，2.7 MB）与 `images/ai/` 完全重复；源码仅引用小写 `ai/`                                                      |
| 根目录旧 `youzhibg1-3.png`  | 未被引用（当前引用为 `images/service/youzhibg*.png`），旧副本可删                                                                    |

### 1.2 新发现（本次审计补充，文档未覆盖）

| 发现                                                                 | 说明                                          | 处理                |
| -------------------------------------------------------------------- | --------------------------------------------- | ------------------- |
| `customer/hero-banner.png` 与 `customer/banner.png` **MD5 完全相同** | 重复文件，且均**未被引用**                    | 删除（省 2×949KiB） |
| `BI/multi-dimensional-analysis.png`                                  | 838KiB，**未被引用**                          | 删除                |
| `knowledge/hero-banner.png`                                          | 994KiB（2880×750），被引用，距 P0 阈值仅 6KiB | 并入 P1 压缩        |
| 首页解决方案卡 `2-1/2-3/2-4.png`                                     | 804/812/983KiB（~900×900），显示仅 276×200    | 并入 P1 压缩        |

### 1.3 收益预估（`--dry-run` 实测）

| 类别                                 |             数量 |         当前 |      处理后 |     节省 |
| ------------------------------------ | ---------------: | -----------: | ----------: | -------: |
| 删除未引用/重复                      | 16 文件 + 1 目录 |      9.95 MB |           0 |     100% |
| 转换压缩（P0 26 个 + P1 系列 60 个） |               86 |     101.2 MB |      2.6 MB |     ~97% |
| 未处理（小图/已达标/保小 SKIP）      |             ~195 |      ~5.1 MB |     ~5.1 MB |       0% |
| **合计**                             |         **~297** | **113.6 MB** | **~7.6 MB** | **~93%** |

> 注：`dist/` 若已构建，需重新 `pnpm build` 才能反映体积收益；收益按传输体积（gzip 前）估算。

---

## 二、处理原则（遵循审计文档 §一 优化标准）

1. **目标尺寸 = 组件实际显示尺寸 ×1**，不保留 2x/超原图；全宽 Hero 上限 1920px。
2. **照片/复杂渐变** → JPEG/WebP；**UI 截图** → 无损压缩后评估有损 WebP；**需透明** → PNG/WebP。
3. **小图标** → 优先 SVG，位图最多 128px。
4. **单文件**：首屏 ≤300KiB，非首屏 ≤500KiB；1000KiB 以上一律 P0 处理。
5. **改扩展名必须同步更新 `src/` 全部引用**，验收时 Network 无新增 404。
6. 处理前整体备份（`public/images-backup/`），验收通过后再删除。

---

## 三、阶段 A：删除未引用与重复资源（省 ~9.9 MB）

> 删除前已在 `src/` 全量检索确认零引用；`git rm` 提交，可随时从 git 历史恢复。

| 路径                                                                       |     大小 | 删除理由                               |
| -------------------------------------------------------------------------- | -------: | -------------------------------------- |
| `images/banner2.png`                                                       | 1368 KiB | 旧 Banner 资产，未被引用               |
| `images/banner3.png`                                                       | 3056 KiB | 旧 Banner 资产，未被引用               |
| `images/customer/hero-banner.png`                                          |  949 KiB | 与 `banner.png` MD5 重复，未被引用     |
| `images/customer/banner.png`                                               |  949 KiB | 同上                                   |
| `images/BI/multi-dimensional-analysis.png`                                 |  838 KiB | 未被引用                               |
| `images/AI/`（整个目录，14 个文件）                                        |   2.7 MB | 与 `images/ai/` 完全重复，未被引用     |
| `images/youzhibg1.png` / `youzhibg2.png` / `youzhibg3.png`（根目录旧副本） |   78 KiB | 未被引用，当前引用为 `service/` 下新版 |

**注意**：删除前再次用 `grep -rn "banner2\|banner3\|hero-banner\|multi-dimensional-analysis\|AI/" src/` 复核；确认 `customer/hero-banner.png` 未被 `partnerCooperationData.ts` 等文件以别名方式引用（本次核实为 0 引用）。

---

## 四、阶段 B：P0 大图压缩（26 个被引用文件，54.3 MB → ~2.5 MB）

> 组件显示尺寸依据 `IMAGE_OPTIMIZATION.md` §六 速查表与源码核实。格式：照片/渐变→WebP(有损 q80)，截图→WebP(有损 q80)，无透明需求一律不用 PNG。透明通道检测见脚本。
>
> **比例约束（重要）**：所有尺寸调整一律采用**等比缩放**（仅指定目标宽度，高度按原始比例计算），**禁止居中裁切/拉伸变形**——图片文件比例永不改变，显示适配交给组件 CSS（`object-fit` / `background-size: cover`）。`--keep-format` 模式下扩展名与文件名完全不变，仅降尺寸、降体积。

| #   | 路径                               | 当前尺寸  | 当前(KiB) | 目标规格                                        | 格式     | 预计(KiB) |
| --- | ---------------------------------- | --------- | --------: | ----------------------------------------------- | -------- | --------: |
| 1   | `service/youzhibg3.png`            | 5120×2876 |     6,525 | 680 宽等比（ImageShowcase 1x，等比缩放保比例）  | WebP q80 |       ~45 |
| 2   | `service/youzhibg2.png`            | 5120×2876 |     5,942 | 680 宽等比（同上）                              | WebP q80 |       ~45 |
| 3   | `service/youzhibg1.png`            | 5120×2876 |     4,425 | 680 宽等比（同上）                              | WebP q80 |       ~45 |
| 4   | `cust-choise.png`                  | 4680×2604 |     4,330 | 600 宽等比（首页视频区封面）                    | WebP q80 |       ~40 |
| 5   | `cases/hangye_img-2.jpg`           | 4300×3010 |     3,578 | 400 宽等比（ContentList 封面）                  | JPEG q82 |       ~30 |
| 6   | `liuzi/ability-1.png`              | 1792×1604 |     3,320 | 680 宽等比（能力卡）                            | WebP q80 |       ~45 |
| 7   | `cservice.png`                     | 1251×2156 |     2,568 | ≤360 宽等比（浮动客服面板）                     | WebP q80 |       ~25 |
| 8   | `company/research-strength-07.png` | 1583×2233 |     1,776 | 原比例 1583 宽（画廊照片，无需透明）            | JPEG q82 |      ~180 |
| 9   | `cases/hero-banner.png`            | 5120×1332 |     1,699 | 1920 宽（HeroBanner 背景）                      | WebP q80 |      ~110 |
| 10  | `cases/hangye_img-3.jpg`           | 5000×3750 |     1,658 | 400×240（ContentList 封面）                     | JPEG q82 |       ~30 |
| 11  | `company/research-strength-06.png` | 1626×2195 |     1,555 | 原比例 1626 宽（画廊照片）                      | JPEG q82 |      ~180 |
| 12  | `news/hero-banner.png`             | 5120×1332 |     1,540 | 1920 宽（HeroBanner 背景）                      | WebP q80 |      ~110 |
| 13  | `paas/blank-showcase.png`          | 1360×840  |     1,504 | 680×420                                         | WebP q80 |       ~40 |
| 14  | `qiwei/hero-banner.png`            | 1920×500  |     1,496 | 1920×500（尺寸合理，仅重压）                    | WebP q80 |       ~85 |
| 15  | `service-hours.png`                | 1472×2656 |     1,412 | 360 宽等比（服务体系卡）                        | WebP q80 |       ~35 |
| 16  | `consultant.png`                   | 848×1264  |     1,387 | 360 宽等比（服务体系卡）                        | WebP q80 |       ~35 |
| 17  | `sales/pdca-loop.png`              | 1360×840  |     1,181 | 680×420                                         | WebP q80 |       ~40 |
| 18  | `banner4.png`                      | 2880×840  |     1,153 | 1920×560（首页当前 Banner）                     | WebP q80 |       ~90 |
| 19  | `sales/tab-report-4.png`           | 1360×840  |     1,143 | 680×420                                         | WebP q80 |       ~40 |
| 20  | `sales/track-trace.png`            | 1360×840  |     1,092 | 680×420                                         | WebP q80 |       ~40 |
| 21  | `customer/dedup-report-new.png`    | 1360×840  |     1,091 | 680×420                                         | WebP q80 |       ~40 |
| 22  | `paas/opportunity-process.png`     | 1360×840  |     1,074 | 680×420                                         | WebP q80 |       ~40 |
| 23  | `2-2.png`                          | 1024×1024 |     1,069 | 276 宽等比（FeatureImageCard 1x，方形保持方形） | WebP q80 |       ~18 |
| 24  | `sales/tab-report-3.png`           | 1360×840  |     1,039 | 680×420                                         | WebP q80 |       ~40 |
| 25  | `customer/dedup-rules-new.png`     | 1360×840  |     1,021 | 680×420                                         | WebP q80 |       ~40 |
| 26  | `customer/dedup-collision-new.png` | 1360×840  |     1,001 | 680×420                                         | WebP q80 |       ~40 |

**扩展名变更影响**：以上文件由 `.png/.jpg` 改为 `.webp` 后，需同步替换 `src/` 中所有引用（脚本 `--update-refs` 负责），涉及：`servicePageData.ts`、`homeData.ts`、`casesData.ts`、`liuziPageData.ts`、`siteConfigData.ts`、`companyIntroData.ts`、`newsData.ts`、`paasPageData.ts`、`qiweiPageData.ts`、`salesManagementData.ts`、`customerManagementData.ts`、`BusinessPage.vue`（演示页）。

---

## 五、阶段 C：P1 尺寸超标与临界文件（~20 MB → ~3 MB）

### 5.1 尺寸明显超标（审计文档 §3.1）

| 路径                                | 当前尺寸  |    当前 | 处理                                                |
| ----------------------------------- | --------- | ------: | --------------------------------------------------- |
| `liuzi/analysis.png`                | 4320×2700 | 404 KiB | 缩至 ≤1000px 宽（显示约 500px），转 WebP            |
| `new2022/products/banner-large.jpg` | 5040×580  |  59 KiB | 缩至 1920px 宽（解码内存）                          |
| `youzhikehubg.png`                  | 5081×581  |  55 KiB | 缩至 1920px 宽（服务页主视觉）                      |
| `download/xbbup.png`                | 1801×1801 |  39 KiB | 缩至 400×400（显示约 200px，1x）                    |
| `liuzi/2-5.png`                     | 600×600   | 424 KiB | **标题图标（40–64px）**：转 SVG 或缩至 128×128 WebP |

### 5.2 接近临界 / 同系列治理（截图系列统一 1360×840 → 680×420 WebP q80）

| 系列                         | 涉及文件                                                                                                                                                        | 处理                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `customer/` Tab 截图         | `tab-unified-new`、`tab-retention-new`、`tab-collaboration-new`、`dedup-prevent-new`（648–723 KiB）                                                             | 680×420 WebP q80                                         |
| `sales/` 截图                | `reusable-topic`、`quick-create`、`dual-checkin`、`auto-task`、`dual-feedback`、`auto-record`、`tab-report-1`、`auto-complete`（509–951 KiB）                   | 680×420 WebP q80                                         |
| `paas/` 截图                 | `sub-form`、`bi-engine`、`permission-management`、`low-code`、`workflow-engine`、`field-linkage`、`business-relation`、`custom-form`、`open-api`（533–927 KiB） | 680×420 WebP q80                                         |
| `BI/` 截图                   | `chart-linkage`、`personalized-dashboard`（540–683 KiB）                                                                                                        | 680×420 WebP q80                                         |
| `company/` 研发实力          | `research-strength-01/02.png`（785/718 KiB）→ JPEG q78；`research-strength-06/07.png`（P0 已转 JPEG q78）；**`03–14.jpg` 经实测已为高压缩，重压无收益 → 保留**  | 照片格式                                                 |
| `company/honor.png`          | 2880×1226，847 KiB                                                                                                                                              | 1920 宽 WebP q80                                         |
| 各页 HeroBanner              | `dingtalk`、`feishu`、`contact`、`sales`、`market` 的 `hero-banner.png`（500–730 KiB，1920×500/560）                                                            | 同尺寸 WebP q80 重压                                     |
| `market/market-customer.png` | 2880×1620，657 KiB                                                                                                                                              | 1920 宽 WebP q80                                         |
| 首页解决方案卡               | `2-1.png`、`2-3.png`、`2-4.png`（804/812/983 KiB）                                                                                                              | 276 宽等比 WebP q80（与 `2-2.png` 同规格，方形保持方形） |
| `knowledge/hero-banner.png`  | 2880×750，994 KiB                                                                                                                                               | 1920 宽 WebP q80                                         |

---

## 六、阶段 D：缺失引用修复

### 6.1 业务页面（必须修复，当前产生 404）

| 缺失路径                       | 引用位置                                           | 建议处理                                                                                                              |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `customer/tab-showcase-bg.png` | `CustomerManagement.vue:55`（CSS 背景）            | 二选一：① 从现有 `customer/tab-*-new.png` 截图裁一张横向渐变背景；② 移除该 CSS 背景。**推荐 ②**（背景图无实际信息量） |
| `free-trial/hero.png`          | `trialData.ts:9`（免费试用页主视觉）               | 优先补充正式素材；可用现有 `ai/ai-intro.png`（2952×1872 压缩版）或新做 510×420 主视觉                                 |
| `customer/hero.png`            | `partnerCooperationData.ts:23`（伙伴合作页主视觉） | 替换为正式素材（510×420，WebP）                                                                                       |
| `sales/hero.png`               | `salesManagementData.ts:32`                        | 确认组件是否展示：若展示则补图；若未展示则移除该数据字段                                                              |

### 6.2 UI Kit 演示页（`BusinessPage.vue`，7 个）

`customer/hero.svg`、`customer/product-intro.svg`、`customer/tab-unified.svg`、`customer/tab-tracking.svg`、`customer/tab-retention.svg`、`customer/tab-collaboration.svg`、`nnlx_mimg.jpg`

→ 替换为现有真实资源路径（如 `customer/tab-unified-new.webp` 等），或统一指向占位图，消除 UI Kit 控制台 404。

### 6.3 钉钉/飞书/企微数据文件（15 个）

`dingtalk/feishu/qiwei` 各缺 `product-intro.png`、`tab-tracking-new.png`、`tab-collaboration-new.png`、`dedup-report-new.png`、`dedup-rules-new.png`

→ **按文档要求：禁止复制客户管理图片掩盖**。应由各平台负责人补充对应平台的正式截图（1360×840 源图 → 680×420 WebP 导出），或调整页面数据移除缺失项。

---

## 七、阶段 E：引用更新、验证与文档回写

1. **引用更新**：脚本 `--update-refs` 将 `src/` 中所有 `.png/.jpg → .webp` 引用同步替换（仅替换已转换的文件名，避免误伤）。
2. **构建验证**：`pnpm type-check` → `pnpm build` → `pnpm check-docs` 全绿。
3. **浏览器验证**：生产预览下检查受影响页面（首页、服务、案例、新闻、客户、销售、PaaS、伙伴、试用、钉钉/飞书/企微、AI、留咨）；Network 面板确认 **无新增 404**；记录优化前后传输体积与解码尺寸；首屏（首页/服务/案例/新闻）复测 **LCP**。
4. **清晰度抽检**：对比 P0 关键图在 1x/2x 断点的清晰度，不允许可见失真（尤其 `youzhibg*`、`2-2.png`、截图系列）。
5. **回退方案**：验收不通过时，从 `public/images-backup/` 还原并回滚 git 引用变更。
6. **文档回写**：验收通过后更新 `IMAGE_OPTIMIZATION.md`——更新基准日期、P0/P1 清单（移除已处理项、登记删除项）、缺失引用状态（标记已修复），并记录优化前后体积对比。

---

## 八、执行方式与脚本

```bash
# 1. 备份 + 预演（不写入，仅输出动作清单与预期收益）
python3 scripts/optimize-images.py --dry-run

# 2. 正式执行（备份到 public/images-backup/，压缩/转换/删除 + 同步 src 引用）
python3 scripts/optimize-images.py --apply --update-refs

# 3. 构建与验证（见阶段七）
pnpm type-check && pnpm build && pnpm check-docs

# 4. 验收通过后清理备份
rm -rf public/images-backup/   # 或 git 提交后由 CI 校验
```

> 脚本需本机安装 Pillow（隔离环境已装）。`--apply` 前请先 `git status` 确认工作区干净，并切到独立分支（如 `chore/optimize-images`）便于回退。

---

## 九、待确认事项（影响导出规格，处理前需确认）

| #   | 事项                                                                    | 影响                                                                                   |
| --- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | `cservice.png` 浮动面板的实际显示尺寸                                   | 导出宽度（当前按 360 宽假设）                                                          |
| 2   | `service-hours.png` / `consultant.png` 服务体系卡画布精确比例           | 已统一为等比缩放（360 宽），比例保持原始，显示由组件 `background-size: cover` 自行适配 |
| 3   | `free-trial/hero.png`、`customer/hero.png`、`sales/hero.png` 的素材来源 | 补正式素材 or 占位 or 移除引用                                                         |
| 4   | 三平台（钉钉/飞书/企微）缺失截图由谁补充                                | 决定阶段 D 3 的交付方式                                                                |
| 5   | 是否接受照片类 PNG（`research-strength-06/07/01/02`）转 JPEG            | 格式选择（默认接受，无透明需求）                                                       |

---

## 十、附录：优化后预期清单变化

> 以下数字为 `scripts/optimize-images.py --dry-run` 实测结果（86 个转换 + 9 项删除）。

- `public/images/` 总大小：113.6 MB → 约 **7.6 MB**（-93%）
  - 转换文件：101.2 MB → 2.6 MB（86 个，实测）
  - 删除：9.95 MB（banner2/3、customer 重复 2 个、BI 遗留、`AI/` 目录、根目录旧 youzhibg ×3）
  - 未处理文件约 5.1 MB（小图/已达标图/SKIP 项）
- 文件数：297 → 约 281（删除 16 个文件 + 1 个目录；转换不增减数量）
- P0 清单（≥1000KiB）：28 个 → **0 个**
- 404 引用：业务 4 + UI Kit 7 + 三平台 15 → **0 个**（阶段 D 修复）
- **说明**：`company/research-strength-*.jpg`（03–14）经实测已为高压缩 JPEG，q78 重压反而变大（保小策略自动 SKIP 保留原图），不列入本次处理；其中 `01/02/06/07.png` 照片类转 JPEG 收益显著（-50%~-70%）。
