# 导航菜单与页面路由对应关系

> 生成日期：2026-07-23 | 最后更新：2026-07-24
> 用途：梳理顶部/底部导航菜单中的所有链接，作为路由命名规范的权威参考。

---

## 一、顶部导航（SiteHeader）

### 1.1 一级菜单

| 一级菜单 | 默认路由          | 二级菜单         | 二级路由 | 目标组件   |
| -------- | ----------------- | ---------------- | -------- | ---------- |
| 首页     | `/`               | 无               | —        | `Home.vue` |
| 产品中心 | `/chanpin`        | 见下方 Mega Menu | 见下方   | —          |
| 案例中心 | `/hangyeanli`     | 见下方下拉       | 见下方   | —          |
| 客户服务 | `/youzhifuwu`     | 见下方下拉       | 见下方   | —          |
| 下载中心 | `/xiazaizhongxin` | 无               | —        | —          |
| 关于我们 | `/guanyuwomen`    | 见下方下拉       | 见下方   | —          |
| 渠道合作 | `/qudao`          | 见下方下拉       | —        | —          |

### 1.2 产品中心 — Mega Menu

**产品概览（左列）：**

| 入口     | 路由                                                                 | 类型 |
| -------- | -------------------------------------------------------------------- | ---- |
| 产品概述 | `/chanpin`                                                           | page |
| 模板中心 | https://module-center.xbongbong.com/preview.html#/application#wz_141 | 外部 |
| 产品功能 | `/chanpinjiage`                                                      | page |
| 更新日志 | `http://help.xbongbong.com/?cat=24`                                  | 外部 |
| 体验产品 | `/mianfeishiyong`                                                    | page |

**功能模块（右列）：**

| 入口              | 路由              | 说明 |
| ----------------- | ----------------- | ---- |
| 客户管理          | `/kehuguanli`     | page |
| 销售管理          | `/xiaoshouguanli` | page |
| 市场管理          | `/shichangguanli` | page |
| PaaS              | `/paas`           | page |
| AI销售助理        | `/ai`             | page |
| BI                | `/bi`             | page |
| 销帮帮 X 钉钉     | `/dingtalk`       | page |
| 销帮帮 X 飞书     | `/feishubanben`   | page |
| 销帮帮 X 企业微信 | `/qiweibanben`    | page |

### 1.3 案例中心 — 下拉菜单

| 入口     | 路由              | 类型 |
| -------- | ----------------- | ---- |
| 行业案例 | `/kehuanliliuzi`  | list |
| 客户心声 | `/yonghuxinsheng` | list |

### 1.4 客户服务 — 下拉菜单

| 入口     | 路由                                      | 类型 |
| -------- | ----------------------------------------- | ---- |
| 优质服务 | `/youzhifuwu`                             | page |
| 常见问题 | `https://help.xbongbong.com/?p=306#wz_25` | 外部 |

### 1.5 关于我们 — 下拉菜单

| 入口     | 路由             | 类型 |
| -------- | ---------------- | ---- |
| 公司介绍 | `/gongsijianjie` | page |
| 新闻动态 | `/gongsidongtai` | list |
| 联系我们 | `/lianxiwomen`   | page |

### 1.6 渠道合作 — 下拉菜单

| 入口     | 路由        | 类型 |
| -------- | ----------- | ---- |
| 伙伴合作 | `/qudao`    | page |
| 推广大使 | `/tuiguang` | page |

### 1.7 右侧操作区

| 按钮     | 路由                                                       | 类型 |
| -------- | ---------------------------------------------------------- | ---- |
| 登录     | https://appwebfront.xbongbong.com/stand-alone-login.html#/ | 外部 |
| 免费试用 | `/mianfeishiyong`                                          | page |

---

## 二、底部导航（SiteFooter）

### 2.1 导航列

**产品中心：**

| 链接     | 路由       |
| -------- | ---------- |
| 产品功能 | `/chanpin` |
| AI CRM   | `/chanpin` |

**案例中心：**

| 链接     | 路由              |
| -------- | ----------------- |
| 模板中心 | `/hangyeanli`     |
| 行业案例 | `/kehuanliliuzi`  |
| 客户心声 | `/yonghuxinsheng` |

**客户服务：**

| 链接     | 路由                                      |
| -------- | ----------------------------------------- |
| 优质服务 | `/youzhifuwu`                             |
| 使用教程 | `/youzhifuwu`                             |
| 常见问题 | `https://help.xbongbong.com/?p=306#wz_25` |

**下载中心：**

| 链接    | 路由              |
| ------- | ----------------- |
| 钉钉版  | `/xiazaizhongxin` |
| 企微版  | `/xiazaizhongxin` |
| 飞书版  | `/xiazaizhongxin` |
| 独立版  | `/xiazaizhongxin` |
| AI 助理 | `/xiazaizhongxin` |

**关于我们：**

| 链接     | 路由             |
| -------- | ---------------- |
| 公司介绍 | `/gongsijianjie` |
| 新闻动态 | `/gongsidongtai` |
| 联系我们 | `/lianxiwomen`   |

**了解更多：**

| 链接             | 路由              |
| ---------------- | ----------------- |
| 伙伴合作         | `/qudao`          |
| 推广大使         | `/tuiguang`       |
| 下载销帮帮AI CRM | `/xiazaizhongxin` |
| 联系您的专属顾问 | `/lianxiwomen`    |

### 2.2 CTA 按钮

| 按钮         | 路由              |
| ------------ | ----------------- |
| 立即免费试用 | `/mianfeishiyong` |
| 预约产品演示 | `/lianxiwomen`    |

---

## 三、侧边浮动工具栏（FloatingToolbar）

| 入口     | 行为                 | 路由               |
| -------- | -------------------- | ------------------ |
| 在线客服 | 百度商桥（外部链接） | —                  |
| 微信咨询 | 二维码弹窗           | —                  |
| 客服热线 | 拨打电话             | `tel:4000-464-288` |
| 立即体验 | 跳转留言表单         | `/message`         |
| 回到顶部 | 页面滚动             | —                  |

---

## 四、底部试用栏（StickyFormBar）

| 说明                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- |
| 固定在页面底部的免费试用表单（企业名称 + 手机号 + 验证码），提交到 `/v1/message` 接口。仅在桌面端显示（`max-md:hidden`）。无需独立路由页面。 |

---

## 五、遗留路由别名（Legacy Aliases）

以下旧版 CMS 页面 key 已通过 `routePaths.ts` 映射到新路由：

| 旧版 Key                                                 | 映射到         |
| -------------------------------------------------------- | -------------- |
| `single_common`、`single_xbb`、`single_xbb2`、`xbb_paas` | `/chanpin`     |
| `channel_shuzihuaxcs`、`single_shuzihua`、`single_sf`    | `/guanyuwomen` |
| `single_service`、`single_live`、`list_services`         | `/youzhifuwu`  |
| `single_tuiguang`、`list_tuiguang`                       | `/tuiguang`    |
| `single_market`                                          | `/guanyuwomen` |
