# 本地静态图片尺寸优化清单

> 盘点项目中所有从 `public/images/` 引用的本地静态图片，标注当前尺寸、文件大小，以及根据页面实际渲染尺寸推算的目标尺寸。

---

## 一、Hero Banner 大图（背景图）

这些图片作为 CSS `background-image` 使用，覆盖全宽区域。视口最大 1920px，实际渲染宽度通常 ≤1920px。

| 图片路径                            | 当前尺寸  | 当前大小 | 目标尺寸  | 说明                             |
| ----------------------------------- | --------- | -------- | --------- | -------------------------------- |
| `images/banner2.png`                | 2880×840  | 1,368KB  | 1920×560  | 首页 banner，2 倍图过大，降为 1x |
| `images/banner3.png`                | 2880×840  | 3,056KB  | 1920×560  | 同上，文件巨大需压缩             |
| `images/banner4.png`                | 2880×840  | 1,153KB  | 1920×560  | 同上                             |
| `images/cust-choise.png`            | 4680×2604 | 4,330KB  | 1920×1068 | 客户选择背景，尺寸严重超标       |
| `images/cservice.png`               | 1251×2156 | 2,568KB  | 628×1080  | 服务图片，高度过大               |
| `images/consultant.png`             | 848×1264  | 1,387KB  | 424×632   | 顾问图片，可缩小 50%             |
| `images/market/hero-banner.png`     | 1920×500  | 1,527KB  | 1920×500  | 尺寸合理但文件过大，需压缩       |
| `images/sales/hero-banner.png`      | 1920×500  | 1,190KB  | 1920×500  | 同上                             |
| `images/paas/hero-banner.jpg`       | 1920×560  | 414KB    | 1920×560  | 尺寸合理，适当压缩               |
| `images/liuzi/pc_banner.png`        | 1920×840  | 487KB    | 1920×840  | 尺寸合理，适当压缩               |
| `images/liuzi/background-image.jpg` | 1920×1120 | 252KB    | 1920×1120 | 尺寸合理                         |
| `images/liuzi/logo.jpg`             | 1920×150  | 76KB     | 1920×150  | 尺寸合理                         |
| `images/customer/hero-banner.png`   | 1920×560  | 949KB    | 1920×560  | 需压缩                           |
| `images/customer/banner.png`        | 1920×560  | 949KB    | 1920×560  | 需压缩                           |
| `images/customer/customer.png`      | 1920×932  | 132KB    | 1920×932  | 尺寸合理                         |
| `images/youzhibg1.png`              | 1920×580  | 22KB     | 1920×580  | ✅ 已优化                        |
| `images/youzhibg2.png`              | 1920×580  | 25KB     | 1920×580  | ✅ 已优化                        |
| `images/youzhibg3.png`              | 1920×580  | 30KB     | 1920×580  | ✅ 已优化                        |
| `images/youzhikehubg.png`           | 5081×581  | 55KB     | 1920×219  | 宽度严重超标，需缩小             |

---

## 二、产品截图（ImageShowcase 组件）

ImageShowcase 组件渲染尺寸：`max-w-170`（680px）× `aspect-[680/420]`（420px 高）。

### 2.1 钉钉页面（`/images/dingtalk/`）

| 图片路径                         | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                       |
| -------------------------------- | --------- | -------- | -------- | -------------------------- |
| `images/dingtalk/dingtalk03.png` | 1366×1178 | 84KB     | 680×587  | 宽度减半，可降至 2x Retina |
| `images/dingtalk/dingtalk04.png` | 1572×820  | 65KB     | 680×355  | 同上                       |
| `images/dingtalk/dingtalk05.png` | 1882×976  | 76KB     | 680×353  | 同上                       |
| `images/dingtalk/dingtalk06.png` | 1450×802  | 65KB     | 680×376  | 同上                       |
| `images/dingtalk/dingtalk07.png` | 1260×778  | 69KB     | 680×420  | 同上                       |

### 2.2 飞书页面（`/images/feishu/`）

| 图片路径                        | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                              |
| ------------------------------- | --------- | -------- | -------- | --------------------------------- |
| `images/feishu/feishu-1@2x.png` | 1208×1086 | 80KB     | 680×611  | 含 @2x 标记，但实际到 1360px 渲染 |
| `images/feishu/feishu-2@2x.png` | 1052×1038 | 86KB     | 680×671  | 同上                              |
| `images/feishu/feishu-3@2x.png` | 1020×1032 | 73KB     | 680×688  | 同上                              |
| `images/feishu/feishu-4@2x.png` | 1074×968  | 84KB     | 680×612  | 同上                              |

### 2.3 企业微信页面（`/images/qiwei/`）

| 图片路径                      | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                |
| ----------------------------- | --------- | -------- | -------- | ------------------- |
| `images/qiwei/qiwei-1@2x.png` | 1468×1072 | 91KB     | 680×497  | 宽度过大，降至 680× |
| `images/qiwei/qiwei-2@2x.png` | 1432×882  | 58KB     | 680×419  | 同上                |
| `images/qiwei/qiwei-3@2x.png` | 1136×760  | 42KB     | 680×455  | 同上                |
| `images/qiwei/qiwei-4@2x.png` | 1194×754  | 87KB     | 680×430  | 同上                |
| `images/qiwei/qiwei-5@2x.png` | 1196×902  | 66KB     | 680×513  | 同上                |

---

## 三、Tab 切换面板截图（TabShowcase 组件）

TabShowcase 渲染尺寸：`aspect-[680/420]`（宽 680px × 高 420px），新版本（`*-new.png`）是 2x Retina 版本。

### 3.1 客户管理页面

| 图片路径                                    | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                 |
| ------------------------------------------- | --------- | -------- | -------- | -------------------- |
| `images/customer/tab-collaboration-new.png` | 1360×840  | 700KB    | 1360×840 | 2x 尺寸合理，需压缩  |
| `images/customer/tab-retention-new.png`     | 1360×840  | 679KB    | 1360×840 | 同上                 |
| `images/customer/tab-tracking-new.png`      | 1360×840  | 476KB    | 1360×840 | 同上                 |
| `images/customer/tab-unified-new.png`       | 1360×840  | 648KB    | 1360×840 | 同上                 |
| `images/customer/dedup-collision-new.png`   | 1360×840  | 1,001KB  | 1360×840 | 需压缩               |
| `images/customer/dedup-prevent-new.png`     | 1360×840  | 723KB    | 1360×840 | 需压缩               |
| `images/customer/dedup-report-new.png`      | 1360×840  | 1,091KB  | 1360×840 | 需压缩               |
| `images/customer/dedup-rules-new.png`       | 1360×840  | 1,021KB  | 1360×840 | 需压缩               |
| `images/customer/dedup-1.png`               | 680×420   | 28KB     | 680×420  | ✅ 已优化（1x 版本） |
| `images/customer/dedup-2.png`               | 680×420   | 28KB     | 680×420  | ✅ 已优化（1x 版本） |
| `images/customer/public-sea-assign.png`     | 1360×840  | 179KB    | 1360×840 | 尺寸合理，适当压缩   |
| `images/customer/public-sea-limit.png`      | 1360×840  | 90KB     | 1360×840 | ✅ 已优化            |
| `images/customer/public-sea-recycle.png`    | 1360×840  | 77KB     | 1360×840 | ✅ 已优化            |
| `images/customer/public-sea-tiered.png`     | 1360×840  | 69KB     | 1360×840 | ✅ 已优化            |
| `images/customer/tab-collaboration.png`     | 680×420   | 41KB     | 680×420  | ✅ 已优化（1x 版本） |
| `images/customer/tab-tracking.png`          | 680×425   | 44KB     | 680×425  | ✅ 已优化（1x 版本） |
| `images/customer/tab-retention.png`         | 680×489   | 28KB     | 680×489  | ✅ 已优化（1x 版本） |
| `images/customer/tab-unified.png`           | 680×619   | 59KB     | 680×619  | ✅ 已优化（1x 版本） |
| `images/customer/product-intro.png`         | 1840×1150 | 97KB     | 920×575  | 宽度过大，可降至一半 |

### 3.2 销售管理页面（图片文件不存在于磁盘）

以下图片在 `salesManagementData.ts` 中被引用，但 `public/images/sales/` 下缺少对应文件：

| 图片路径                             | 状态        | 目标尺寸 |
| ------------------------------------ | ----------- | -------- |
| `images/sales/tab-transparent-1.png` | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-transparent-2.png` | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-visit-1.png`       | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-visit-2.png`       | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-visit-3.png`       | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-checkin-1.png`     | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-checkin-2.png`     | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-checkin-3.png`     | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-checkin-4.png`     | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-report-1.png`      | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-report-2.png`      | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-report-3.png`      | ❌ 文件缺失 | 680×420  |
| `images/sales/tab-report-4.png`      | ❌ 文件缺失 | 680×420  |
| `images/sales/hero.png`              | ❌ 文件缺失 | 700×auto |

---

## 四、留资页（liuzi）功能截图

留资页使用 `AiCrmFeatureGrid`（CSS background-image）和 `ImageCardGrid`（350px 渲染宽度）等组件。

### 4.1 AI 功能卡片（CSS background 渲染）

| 图片路径             | 当前尺寸 | 当前大小 | 目标尺寸 | 说明                  |
| -------------------- | -------- | -------- | -------- | --------------------- |
| `images/liuzi/1.png` | 511×691  | 48KB     | 511×691  | ✅ 尺寸合理，适当压缩 |
| `images/liuzi/2.png` | 511×692  | 48KB     | 511×692  | ✅ 同上               |
| `images/liuzi/3.png` | 511×692  | 49KB     | 511×692  | ✅ 同上               |

### 4.2 功能模块截图（ImageCardGrid 350px 渲染宽度）

| 图片路径                | 当前尺寸  | 当前大小 | 目标尺寸  | 说明     |
| ----------------------- | --------- | -------- | --------- | -------- |
| `images/liuzi/1-1.png`  | 2046×1114 | 119KB    | 1023×557  | 宽度减半 |
| `images/liuzi/1-2.png`  | 2038×944  | 111KB    | 1019×472  | 同上     |
| `images/liuzi/1-3.png`  | 1566×1020 | 47KB     | 783×510   | 同上     |
| `images/liuzi/1-4.png`  | 1610×1060 | 106KB    | 805×530   | 同上     |
| `images/liuzi/1-5.png`  | 1803×913  | 41KB     | 902×457   | 同上     |
| `images/liuzi/1-bg.png` | 1267×482  | 7KB      | ✅ 已优化 |

### 4.3 AI 能力展示（FeatureImageCard 全宽渲染）

| 图片路径                     | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                            |
| ---------------------------- | --------- | -------- | -------- | ------------------------------- |
| `images/liuzi/ability-1.png` | 1792×1604 | 3,320KB  | 896×802  | 尺寸减半，**文件巨大必须压缩**  |
| `images/liuzi/ability-1.svg` | —         | 2KB      | —        | ✅ SVG 图标，替代 PNG 作为 icon |
| `images/liuzi/ability-2.png` | 801×520   | 229KB    | 801×520  | 需压缩                          |
| `images/liuzi/ability-2.svg` | —         | 10KB     | —        | ✅ SVG 图标，替代 PNG 作为 icon |
| `images/liuzi/ability-3.png` | 550×416   | 403KB    | 550×416  | 尺寸合理但文件过大，需压缩      |
| `images/liuzi/ability-3.svg` | —         | 9KB      | —        | ✅ SVG 图标，替代 PNG 作为 icon |

### 4.4 侧边图标（小尺寸）

| 图片路径                          | 当前尺寸 | 当前大小 | 目标尺寸 | 说明      |
| --------------------------------- | -------- | -------- | -------- | --------- |
| `images/liuzi/aiFindCust.png`     | 114×112  | 25KB     | 114×112  | ✅ 小图标 |
| `images/liuzi/aiFindCustIcon.png` | 45×295   | 9KB      | 45×295   | ✅ 小图标 |
| `images/liuzi/aiSales.png`        | 131×130  | 29KB     | 131×130  | ✅ 小图标 |
| `images/liuzi/aiSalesIcon.png`    | 56×301   | 10KB     | 56×301   | ✅ 小图标 |
| `images/liuzi/aiBusiness.png`     | 134×113  | 24KB     | 134×113  | ✅ 小图标 |
| `images/liuzi/aiBusinessIcon.png` | 55×316   | 11KB     | 55×316   | ✅ 小图标 |

### 4.5 AI 功能子模块截图（渲染宽度约 350-500px）

| 图片路径                         | 当前尺寸  | 当前大小 | 目标尺寸 | 说明                                    |
| -------------------------------- | --------- | -------- | -------- | --------------------------------------- |
| `images/liuzi/findCustomer.png`  | 554×636   | 438KB    | 500×574  | 尺寸不大但文件巨大，需压缩              |
| `images/liuzi/biddingInfo.png`   | 540×614   | 444KB    | 500×569  | 同上                                    |
| `images/liuzi/schedule.png`      | 562×638   | 154KB    | 500×568  | 需压缩                                  |
| `images/liuzi/trainPartner.png`  | 535×610   | 115KB    | 500×570  | 需压缩                                  |
| `images/liuzi/followUp.png`      | 574×668   | 147KB    | 500×582  | 需压缩                                  |
| `images/liuzi/analysis.png`      | 4320×2700 | 404KB    | 500×313  | **宽度严重超标**，大幅缩小              |
| `images/liuzi/mobile_banner.png` | 760×900   | 164KB    | —        | ⚠️ 磁盘存在但源代码未引用，疑似遗留文件 |
| `images/liuzi/2-5.png`           | 600×600   | 424KB    | 64×64    | 图标尺寸，文件巨大需压缩                |

### 4.6 小图标（64×64 系列）

| 图片路径               | 当前尺寸 | 当前大小 | 目标尺寸  | 说明 |
| ---------------------- | -------- | -------- | --------- | ---- |
| `images/liuzi/2-1.png` | 64×64    | 6KB      | ✅ 已优化 |
| `images/liuzi/2-3.png` | 64×64    | 9KB      | ✅ 已优化 |
| `images/liuzi/2-4.png` | 64×64    | 8KB      | ✅ 已优化 |
| `images/liuzi/2-6.png` | 64×64    | 8KB      | ✅ 已优化 |

---

## 五、首页 Feature 图

### 5.1 首页 2×2 方块图（CSS background 渲染）

| 图片路径         | 当前尺寸  | 当前大小 | 目标尺寸 | 说明             |
| ---------------- | --------- | -------- | -------- | ---------------- |
| `images/2-1.png` | 902×902   | 804KB    | 451×451  | 尺寸减半，需压缩 |
| `images/2-2.png` | 1024×1024 | 1,069KB  | 512×512  | 同上             |
| `images/2-3.png` | 881×881   | 812KB    | 441×441  | 同上             |
| `images/2-4.png` | 942×942   | 983KB    | 471×471  | 同上             |

### 5.2 首页 SVG 图标

| 图片路径                                  | 当前尺寸 | 当前大小 | 目标尺寸        | 说明 |
| ----------------------------------------- | -------- | -------- | --------------- | ---- |
| `images/feature-showcase/analyst.svg`     | 280×180  | 2KB      | ✅ SVG 无需调整 |
| `images/feature-showcase/coach.svg`       | 280×180  | 2KB      | ✅ SVG 无需调整 |
| `images/feature-showcase/process.svg`     | 280×180  | 3KB      | ✅ SVG 无需调整 |
| `images/feature-showcase/prospecting.svg` | 280×180  | 2KB      | ✅ SVG 无需调整 |

---

## 六、产品介绍页（new2022）

| 图片路径                                        | 当前尺寸 | 当前大小 | 目标尺寸 | 说明         |
| ----------------------------------------------- | -------- | -------- | -------- | ------------ |
| `images/new2022/products/banner-large.jpg`      | 5040×580 | 59KB     | 1920×221 | 宽度严重超标 |
| `images/new2022/products/crm@2x.png`            | 1476×816 | 53KB     | 738×408  | 尺寸减半     |
| `images/new2022/products/gongdanguanli@2x.png`  | 1328×890 | 63KB     | 664×445  | 同上         |
| `images/new2022/products/jxc@2x.png`            | 1366×800 | 38KB     | 683×400  | 同上         |
| `images/new2022/products/shichangguanli@2x.png` | 1300×836 | 30KB     | 650×418  | 同上         |
| `images/new2022/products/zijinguanli@2x.png`    | 1550×776 | 27KB     | 775×388  | 同上         |

---

## 七、下载专区图片

| 图片路径                             | 当前尺寸  | 当前大小 | 目标尺寸        | 说明                            |
| ------------------------------------ | --------- | -------- | --------------- | ------------------------------- |
| `images/download/1688.png`           | 1066×566  | 158KB    | 533×283         | 尺寸减半，需压缩                |
| `images/download/xbbup.png`          | 1801×1801 | 39KB     | 400×400         | 实际渲染 400×460，正方形裁剪    |
| `images/download/xbbup (2).png`      | 893×651   | 63KB     | 400×292         | 多余文件，疑似重复              |
| `images/download/dingup.png`         | 353×481   | 21KB     | 353×481         | ✅ 尺寸合理                     |
| `images/download/dingup.jpg`         | 400×460   | 6KB      | 400×460         | ⚠️ 未引用，与 `dingup.png` 重复 |
| `images/download/flyup.png`          | 455×361   | 23KB     | 400×317         | 尺寸合理                        |
| `images/download/flyup.jpg`          | 400×460   | 7KB      | 400×460         | ⚠️ 未引用，与 `flyup.png` 重复  |
| `images/download/wxup.png`           | 448×361   | 35KB     | 400×322         | 尺寸合理                        |
| `images/download/wxup.jpg`           | 400×460   | 9KB      | 400×460         | ⚠️ 未引用，与 `wxup.png` 重复   |
| `images/download/aidown.png`         | 400×460   | 22KB     | 400×460         | ⚠️ 未引用，疑似遗留文件         |
| `images/download/aiup.png`           | 400×460   | 18KB     | 400×460         | ⚠️ 未引用，疑似遗留文件         |
| `images/download/dingdown.jpg`       | 400×460   | 12KB     | ✅ 已优化       |
| `images/download/flydown.jpg`        | 400×460   | 22KB     | ✅ 已优化       |
| `images/download/wxdown.jpg`         | 400×460   | 38KB     | ✅ 尺寸合理     |
| `images/download/xbbdown.jpg`        | 400×460   | 12KB     | ✅ 已优化       |
| `images/download/placeholder-qr.svg` | 320×320   | 1KB      | ✅ SVG 无需调整 |

---

## 八、侧边栏图片

| 图片路径                                    | 当前尺寸 | 当前大小 | 目标尺寸 | 说明        |
| ------------------------------------------- | -------- | -------- | -------- | ----------- |
| `images/article-sidebar/crm-template.png`   | 645×300  | 65KB     | 645×300  | ✅ 尺寸合理 |
| `images/article-sidebar/sales-template.png` | 653×339  | 88KB     | 653×339  | ✅ 尺寸合理 |

---

## 九、其他图片

| 图片路径                                           | 当前尺寸  | 当前大小 | 目标尺寸        | 说明                                                              |
| -------------------------------------------------- | --------- | -------- | --------------- | ----------------------------------------------------------------- |
| `images/ambassador/reward-rate.png`                | 2126×486  | 72KB     | 1063×243        | 宽度减半                                                          |
| `images/code-douyin.png`                           | 300×300   | 68KB     | 300×300         | 尺寸合理，适当压缩                                                |
| `images/code-wechatVideo.png`                      | 832×836   | 217KB    | 416×418         | 尺寸减半                                                          |
| `images/customer/digital-management-underline.png` | 342×66    | 5KB      | ✅ 已优化       |
| `images/nnlx_mimg.jpg`                             | —         | —        | —               | ❌ **文件缺失**，但源代码中引用（`BusinessPage.vue`）→ 图片已损坏 |
| `images/sdr_contact_me_qr.png`                     | 396×396   | 5KB      | ✅ 已优化       |
| `images/service-hours.png`                         | 1472×2656 | 1,412KB  | 600×1083        | 渲染宽度约 600px，高度过大，需压缩                                |
| `images/wxImg.png`                                 | 98×99     | 11KB     | ✅ 小图标       |
| `images/paas/blank-showcase.svg`                   | 960×540   | 0KB      | ✅ SVG 无需调整 |

---

## 十、公共根目录图片

| 图片路径                                             | 当前尺寸 | 当前大小 | 目标尺寸                           | 说明 |
| ---------------------------------------------------- | -------- | -------- | ---------------------------------- | ---- |
| `ai_icon.png`                                        | 400×400  | 5KB      | ✅ 已优化                          |
| `favicon.ico`                                        | 32×32    | 4KB      | ✅ 已优化                          |
| `logo_blank.png`                                     | 258×60   | 8KB      | ✅ 已优化                          |
| `nnn_tel_ico.png`                                    | 40×40    | 1KB      | ✅ 已优化                          |
| `subMenuFull_01.jpg` ~ `subMenuFull_08.jpg`（缺 05） | 32~52px  | 1KB      | ✅ 01~04/06~08 已优化，**05 缺失** |

---

## 十一、文件缺失清单

以下图片在源代码中被引用，但磁盘上缺少对应文件：

| 缺失路径                                               | 所属页面          | 建议操作                                            |
| ------------------------------------------------------ | ----------------- | --------------------------------------------------- |
| `images/customer/hero.png`                             | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/hero.svg`                             | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/product-intro.svg`                    | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/tab-collaboration.svg`                | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/tab-retention.svg`                    | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/tab-showcase-bg.png`                  | 客户管理          | 补充图片                                            |
| `images/customer/tab-tracking.svg`                     | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/customer/tab-unified.svg`                      | 客户管理          | 补充或改用 OSS 图片                                 |
| `images/free-trial/hero.png`                           | 免费试用          | `images/free-trial/` 目录不存在，需确认是否需要补充 |
| `images/nnlx_mimg.jpg`                                 | BusinessPage 组件 | 图片文件缺失，**页面图片已损坏**，需优先补充        |
| `images/sales/hero.png`                                | 销售管理          | 补充图片                                            |
| `images/sales/tab-checkin-1.png` ~ `tab-checkin-4.png` | 销售管理          | 补充图片                                            |
| `images/sales/tab-report-1.png` ~ `tab-report-4.png`   | 销售管理          | 补充图片                                            |
| `images/sales/tab-transparent-1.png`                   | 销售管理          | 补充图片                                            |
| `images/sales/tab-transparent-2.png`                   | 销售管理          | 补充图片                                            |
| `images/sales/tab-visit-1.png` ~ `tab-visit-3.png`     | 销售管理          | 补充图片                                            |

---

## 十二、优先级建议

### P0 — 文件巨大严重影响加载（必须优先处理）

| 图片                                                | 原因         |
| --------------------------------------------------- | ------------ |
| `images/banner3.png` (3,056KB)                      | 首页首屏加载 |
| `images/cust-choise.png` (4,330KB)                  | 首页首屏加载 |
| `images/liuzi/ability-1.png` (3,320KB)              | 留资页加载   |
| `images/banner2.png` (1,368KB)                      | 首页加载     |
| `images/banner4.png` (1,153KB)                      | 首页加载     |
| `images/service-hours.png` (1,412KB)                | 页面加载     |
| `images/consultant.png` (1,387KB)                   | 页面加载     |
| `images/customer/dedup-report-new.png` (1,091KB)    | Tab 切换加载 |
| `images/2-2.png` (1,069KB)                          | 首页加载     |
| `images/customer/dedup-rules-new.png` (1,021KB)     | Tab 切换加载 |
| `images/customer/dedup-collision-new.png` (1,001KB) | Tab 切换加载 |
| `images/customer/hero-banner.png` (949KB)           | 页面加载     |
| `images/customer/banner.png` (949KB)                | 页面加载     |

### P1 — 尺寸/文件较大（需优化）

| 图片                                                  | 原因                |
| ----------------------------------------------------- | ------------------- |
| 所有 `customer/tab-*-new.png` 系列（476-700KB）       | Tab 切换时加载      |
| `images/liuzi/analysis.png` (4320×2700)               | 尺寸严重超标        |
| `images/new2022/products/banner-large.jpg` (5040×580) | 宽度严重超标        |
| `images/liuzi/biddingInfo.png` (444KB)                | 文件/尺寸比严重偏高 |
| `images/liuzi/findCustomer.png` (438KB)               | 同上                |
| `images/liuzi/2-5.png` (424KB)                        | 同上                |
| `images/liuzi/ability-3.png` (403KB)                  | 同上                |
| `images/liuzi/analysis.png` (404KB)                   | 同上                |
| `images/paas/hero-banner.jpg` (414KB)                 | 首屏加载            |

### P2 — 缺失文件（需补充）

| 图片                                         | 原因                                     |
| -------------------------------------------- | ---------------------------------------- |
| `images/nnlx_mimg.jpg`                       | 源代码引用但文件缺失，**页面图片已损坏** |
| 所有销售管理页面和客户管理页面的缺失图片文件 | 需要设计出图后补充                       |

---

## 目标尺寸速查表

| 组件                  | 渲染宽度 | 渲染高度 | 建议 1x 尺寸 | 建议 2x 尺寸 |
| --------------------- | -------- | -------- | ------------ | ------------ |
| ImageShowcase         | 680px    | 420px    | 680×420      | 1360×840     |
| TabShowcase           | 680px    | 420px    | 680×420      | 1360×840     |
| HeroBanner 视觉区     | 700px    | auto     | 700×auto     | 1400×auto    |
| HeroBanner 背景图     | 1920px   | auto     | 1920×auto    | -            |
| CaseDetailHeader 配图 | 600px    | auto     | 600×auto     | 1200×auto    |
| CaseDetailHeader logo | 160px    | auto     | 160×auto     | 320×auto     |
| ImageCardGrid         | 350px    | auto     | 350×auto     | 700×auto     |
| FeatureImageCard      | 全宽     | auto     | 1920×auto    | -            |
| ContentList 封面      | 280px    | 16:9     | 280×158      | 560×316      |
| 下载图标              | 400px    | 460px    | 400×460      | -            |
| 小图标                | 64px     | 64px     | 64×64        | 128×128      |
