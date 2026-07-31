---
name: screenshot
description: 页面截图可视化验证 — 支持单页面截图、响应式截图、基线对比、关键页面巡检
skill_type: workflow
version: 1.0.0
triggers:
  - 用户要求截图、查看页面效果、对比视觉变化
  - 关键词：截图、screenshot、页面效果、视觉对比、基线对比、巡检
---

# /screenshot — 页面截图可视化验证

## 自动触发条件

当用户输入包含以下特征时，自动调用此 Skill：

- 要求截图、查看页面效果、对比视觉变化
- 关键词：「截图」「screenshot」「页面效果」「视觉对比」「基线对比」「巡检」「看看页面」

## 前置 — 服务器检查（复用优先）

```bash
# 先检查 dev server 是否已在运行
if lsof -i :5173 > /dev/null 2>&1; then
  echo "✅ 开发服务器已在运行，直接复用"
else
  echo "🔄 开发服务器未启动，后台启动中..."
  pnpm dev &
  # 等待服务就绪（最多 30 秒）
  for i in $(seq 1 30); do
    curl -s -o /dev/null http://localhost:5173 && break
    sleep 1
  done
fi
```

> **核心原则**：开发服务器是共享资源，不因单次截图而启停。已运行则复用，未运行才启动，截图完成后**保持运行**。

- gstack browse 工具已就绪（`~/.claude/skills/gstack/browse/dist/browse`）

## 命令模式

### 模式一：单页面截图 `/screenshot <路由>`

**流程**：

1. 确认开发服务器运行中
2. 使用 browse 导航到目标页面
3. 执行三个视口截图（desktop 1280×720、tablet 768×1024、mobile 375×812）
4. 检查控制台错误和网络请求
5. 输出截图文件路径

**示例**：

```
/screenshot /          → 首页截图
/screenshot /ui-kit    → UI Kit 展示页截图
/screenshot /chanpin   → 产品中心截图
```

### 模式二：响应式截图 `/screenshot --responsive <路由>`

**流程**：同模式一，但强调响应式对比展示。

### 模式三：基线对比 `/screenshot --diff <路由>`

**流程**：

1. 对目标页面执行三视口截图（保存到临时目录）
2. 与 `.claude/screenshots/baseline/` 中对应基线截图对比
3. 如无基线截图，将当前截图保存为基线
4. 输出差异报告

**基线存储路径**：`.claude/screenshots/baseline/<路由路径>-<视口>.png`

### 模式四：关键页面巡检 `/screenshot --patrol`

**流程**：对以下关键页面依次执行截图，生成巡检报告。

| 优先级 | 页面          | 路由       |
| ------ | ------------- | ---------- |
| P0     | 首页          | `/`        |
| P0     | UI Kit 展示页 | `/ui-kit`  |
| P1     | 产品中心      | `/chanpin` |

## 验证维度

每次截图后，检查以下维度：

### 渲染检查

- [ ] 页面无白屏/空白区域
- [ ] 所有组件正确渲染
- [ ] 图片资源正常加载（无裂图）
- [ ] 图标正常显示

### 控制台检查

```bash
$B console --errors
```

- [ ] 无 JS 运行时错误
- [ ] 无 404 资源加载失败（排除后端 API 预期的 404）

### 网络检查

```bash
$B network
```

- [ ] 核心资源请求均为 200
- [ ] 无 5xx 服务器错误

### SEO 检查

```bash
$B data
```

- [ ] `<title>` 存在且唯一
- [ ] `<meta description>` 存在
- [ ] JSON-LD 结构化数据（首页/产品页需要）

### 响应式检查

- [ ] Desktop (1280×720)：布局正确，无元素重叠
- [ ] Tablet (768×1024)：导航/卡片布局适配正确
- [ ] Mobile (375×812)：可读性良好，无内容溢出

## 基线管理

### 保存基线

将当前截图保存为基线：

```bash
BROWSE="$HOME/.claude/skills/gstack/browse/dist/browse"
# 以首页 desktop 为例
cp /tmp/homepage-desktop.png .claude/screenshots/baseline/home-desktop.png
cp /tmp/homepage-tablet.png .claude/screenshots/baseline/home-tablet.png
cp /tmp/homepage-mobile.png .claude/screenshots/baseline/home-mobile.png
```

### 对比基线

```bash
# 使用 browse diff 命令对比两个 URL
$BROWSE diff <baseline_url> <current_url>
# 或使用 ImageMagick 对比截图
compare baseline.png current.png diff.png
```

## 截图输出

截图默认保存到项目 `.claude/screenshots/` 目录下：

```
.claude/screenshots/
├── baseline/                    # 基线截图（不提交到 git）
│   ├── home-desktop.png
│   ├── home-tablet.png
│   ├── home-mobile.png
│   ├── uikit-desktop.png
│   ├── uikit-tablet.png
│   └── uikit-mobile.png
└── reports/                     # 巡检报告
    └── patrol-YYYY-MM-DD.md
```

## 报告格式

```
## 页面截图巡检报告

**巡检时间**：YYYY-MM-DD HH:MM
**巡检范围**：4 个页面

### 首页 (/)
| 视口 | 截图 | 渲染 | 控制台 | 网络 | SEO |
|------|------|------|--------|------|-----|
| Desktop | <path> | ✅ | ❌ 2 errors | ✅ | ⚠️ |
| Tablet | <path> | ✅ | - | - | - |
| Mobile | <path> | ✅ | - | - | - |

### 问题汇总
| 优先级 | 页面 | 问题 | 建议 |
|--------|------|------|------|
| P0 | / | 后端 404 | 启动后端 |
| P1 | / | 缺少 JSON-LD | 添加结构化数据 |
```

## 完成标准

- [ ] 目标页面全部截图完成
- [ ] 控制台错误已检查
- [ ] 网络请求已检查
- [ ] SEO 数据已检查（如有）
- [ ] 问题已汇总并输出报告
- [ ] 如需基线对比，已输出差异
- [ ] 流程问题已记录（如有）
