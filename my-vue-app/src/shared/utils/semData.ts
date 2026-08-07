/**
 * SEM 推广数据提取工具
 *
 * 对应旧版 page.php 中 setSemParams() 的完整行为：
 * 1. 从 URL 参数中读取 bd_vid、bd、plan、unit、keyword、channel
 * 2. 缓存到 localStorage（bd_vid/bd 60 分钟，plan/unit/keyword/channel 24 小时）
 * 3. 提交时从 localStorage 读取
 *
 * 关键细节：
 * - plan 参数是启动条件——只有 URL 中有 plan 时，才会缓存 unit/keyword/channel
 * - bd_vid 和 bd 不依赖 plan，独立缓存
 */

/** SEM 推广数据 */
export interface SemData {
  plan: string
  unit: string
  keyword: string
  channel: string
  bdVid: string
  bd: string
}

/**
 * 从 URL 参数中提取 SEM 数据并缓存到 localStorage
 *
 * 应在页面加载时立即调用（放在 <script setup> 顶层），
 * 与旧版 page.php 中 setSemParams() 的调用时机一致。
 */
export function captureSemData(): void {
  // SSG 构建时跳过（无浏览器环境）
  if (import.meta.env.SSR) return

  try {
    const params = new URLSearchParams(window.location.search)

    // bd_vid 和 bd 独立缓存（60 分钟），不依赖 plan
    const bdVid = params.get('bd_vid')
    const bd = params.get('bd')
    if (bdVid) localStorage.setItem('bd_vid', bdVid)
    if (bd) localStorage.setItem('bd', bd)

    // plan 是启动条件：只有 URL 中有 plan 时，才缓存 unit/keyword/channel
    const plan = params.get('plan')
    if (!plan) return

    const unit = params.get('unit')
    const keyword = params.get('keyword')
    const channel = params.get('channel')

    if (plan) localStorage.setItem('sem-plan', plan)
    if (unit) localStorage.setItem('sem-unit', unit)
    if (keyword) localStorage.setItem('sem-keyword', keyword)
    if (channel) localStorage.setItem('sem-channel', channel)
  } catch {
    // localStorage 不可用时静默失败（隐私模式等场景）
  }
}

/**
 * 从 localStorage 读取缓存的 SEM 数据
 *
 * 在表单提交时调用，将数据一同提交到后端。
 */
export function getSemData(): SemData {
  try {
    return {
      plan: localStorage.getItem('sem-plan') || '',
      unit: localStorage.getItem('sem-unit') || '',
      keyword: localStorage.getItem('sem-keyword') || '',
      channel: localStorage.getItem('sem-channel') || '',
      bdVid: localStorage.getItem('bd_vid') || '',
      bd: localStorage.getItem('bd') || '',
    }
  } catch {
    return { plan: '', unit: '', keyword: '', channel: '', bdVid: '', bd: '' }
  }
}
