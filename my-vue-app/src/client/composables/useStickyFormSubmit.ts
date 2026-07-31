import { reactive, ref } from 'vue'
import { submitTrial } from '@/shared/api/message'
import { sendSms, verifySms } from '@/shared/api/sms'
import { getSemData } from '@/shared/utils/semData'

/** 表单字段值 */
export interface StickyFormValues {
  title: string
  tel: string
  regcode: string
}

/** useStickyFormSubmit 选项 */
interface UseStickyFormSubmitOptions {
  /** 提交成功后的回调 */
  onSuccess?: () => void
  /** 提交失败后的回调 */
  onError?: (message: string) => void
}

/**
 * 底部固定表单栏的提交逻辑 composable
 * 封装了表单验证、SMS 发送/验证、API 调用、反馈状态管理、频率限制
 *
 * SMS 流程：
 * handleGetCode → 校验手机号 → 触发 onRequestCaptcha（父组件显示算式验证码浮窗）
 *   → confirmCaptchaAndSend（输入算式结果 → 调用发送短信 API → 开始倒计时）
 *   → handleSubmit（输入短信验证码 → 调用验证 API → 提交表单）
 *
 * 提交端点：统一使用 /v1/client/trials（含 SEM 数据 + 数据中心推送）
 */
export function useStickyFormSubmit(options: UseStickyFormSubmitOptions = {}) {
  const submitting = ref(false)
  const feedback = ref('')
  const feedbackType = ref<'success' | 'error'>('success')

  const form = reactive<StickyFormValues>({
    title: '',
    tel: '',
    regcode: '',
  })

  // ==================== SMS 状态 ====================

  /** 倒计时秒数（0 = 可发送） */
  const countdown = ref(0)
  /** 算式验证码 JWT Token */
  const captchaToken = ref('')
  /** 是否正在等待算式验证码确认 */
  const captchaLoading = ref(false)
  /** 算式验证码错误信息 */
  const captchaError = ref('')

  const phonePattern = /^1\d{10}$/

  const setFeedback = (message: string, type: 'success' | 'error') => {
    feedback.value = message
    feedbackType.value = type
  }

  /** 清除反馈消息 */
  const clearFeedback = () => {
    feedback.value = ''
  }

  const resetForm = () => {
    form.title = ''
    form.tel = ''
    form.regcode = ''
  }

  // ==================== 倒计时 ====================

  let countdownTimer: ReturnType<typeof setInterval> | null = null

  const startCountdown = (seconds = 60) => {
    countdown.value = seconds
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearCountdown()
      }
    }, 1000)
  }

  const clearCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
    countdown.value = 0
  }

  // ==================== 获取验证码 ====================

  /**
   * 点击"获取验证码"按钮
   * 校验手机号后，触发 onRequestCaptcha 回调让父组件显示算式验证码浮窗
   */
  const handleGetCode = () => {
    // 倒计时中不可重复点击
    if (countdown.value > 0) return

    if (!phonePattern.test(form.tel)) {
      setFeedback('请输入正确手机号码', 'error')
      return
    }

    setFeedback('', 'success')
    captchaError.value = ''
    // 触发父组件的回调，显示算式验证码浮窗
    onRequestCaptchaCallback?.()
  }

  /**
   * 算式验证码确认后，发送短信
   * 由父组件 CaptchaModal 的 @confirm 事件调用
   */
  const confirmCaptchaAndSend = async (captcha: string, token: string) => {
    captchaLoading.value = true
    captchaError.value = ''

    try {
      await sendSms({
        tel: form.tel,
        captcha,
        token,
      })

      // 发送成功，开始倒计时
      captchaLoading.value = false
      setFeedback('验证码已发送', 'success')
      startCountdown(60)
      // 通知父组件关闭浮窗
      onCaptchaSuccessCallback?.()
    } catch (error) {
      captchaLoading.value = false
      const msg = typeof error === 'string' ? error : (error as Error)?.message || '发送失败'
      captchaError.value = msg
      onCaptchaErrorCallback?.(msg)
    }
  }

  /** 保存 CaptchaModal 的 captchaToken */
  const setCaptchaToken = (token: string) => {
    captchaToken.value = token
  }

  // ==================== 回调注册 ====================

  let onRequestCaptchaCallback: (() => void) | null = null
  let onCaptchaSuccessCallback: (() => void) | null = null
  let onCaptchaErrorCallback: ((msg: string) => void) | null = null

  /**
   * 注册回调 - 由父组件调用，连接 CaptchaModal
   */
  const onRequestCaptcha = (cb: () => void) => {
    onRequestCaptchaCallback = cb
  }

  const onCaptchaSuccess = (cb: () => void) => {
    onCaptchaSuccessCallback = cb
  }

  const onCaptchaError = (cb: (msg: string) => void) => {
    onCaptchaErrorCallback = cb
  }

  // ==================== 频率限制 ====================

  const RATE_LIMIT_KEY = 'free_trial_timestamps'
  const MAX_SUBMISSIONS = 3
  const WINDOW_MS = 60_000

  /** 检查提交频率限制，超限返回 false */
  function checkRateLimit(): boolean {
    try {
      const stored = localStorage.getItem(RATE_LIMIT_KEY)
      const timestamps: number[] = stored ? JSON.parse(stored) : []
      const now = Date.now()
      const valid = timestamps.filter((t) => now - t < WINDOW_MS)

      if (valid.length >= MAX_SUBMISSIONS) {
        return false
      }

      valid.push(now)
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(valid))
      return true
    } catch {
      // localStorage 不可用时放行（隐私模式等场景）
      return true
    }
  }

  // ==================== 表单提交 ====================

  const handleSubmit = async () => {
    // 手机号自动过滤非数字字符
    form.tel = form.tel.replace(/\D/g, '')

    if (!form.title) {
      setFeedback('请输入完整企业名称', 'error')
      return
    }
    if (!phonePattern.test(form.tel)) {
      setFeedback('请输入正确手机号码', 'error')
      return
    }
    if (!form.regcode) {
      setFeedback('请输入短信验证码', 'error')
      return
    }

    // 频率限制检查
    if (!checkRateLimit()) {
      setFeedback('提交过于频繁，请稍后再试。', 'error')
      return
    }

    submitting.value = true
    setFeedback('', 'success')

    try {
      // 1. 校验短信验证码
      await verifySms({ tel: form.tel, code: form.regcode })

      // 2. 提交表单（统一使用 /v1/client/trials，含 SEM 数据 + 数据中心推送）
      const semData = getSemData()
      await submitTrial({
        title: form.title,
        mname: form.title,
        tel: form.tel,
        ...semData,
      })

      setFeedback('提交成功，我们会尽快与您联系。', 'success')
      resetForm()
      options.onSuccess?.()
    } catch (error) {
      const message =
        typeof error === 'string' ? error : (error as Error)?.message || '提交失败，请稍后重试'
      setFeedback(message, 'error')
      options.onError?.(message)
    } finally {
      submitting.value = false
    }
  }

  return {
    /** 表单数据 */
    form,
    /** 是否正在提交 */
    submitting,
    /** 反馈消息 */
    feedback,
    /** 反馈类型 */
    feedbackType,
    /** 倒计时秒数（0 = 可发送） */
    countdown,
    /** 算式验证码 JWT Token */
    captchaToken,
    /** 算式验证码加载中 */
    captchaLoading,
    /** 算式验证码错误信息 */
    captchaError,

    /** 处理获取验证码（校验手机号 → 触发 onRequestCaptcha） */
    handleGetCode,
    /** 确认算式验证码并发送短信 */
    confirmCaptchaAndSend,
    /** 设置算式验证码 Token */
    setCaptchaToken,
    /** 处理表单提交 */
    handleSubmit,
    /** 清除反馈消息 */
    clearFeedback,

    /** 注册回调 */
    onRequestCaptcha,
    onCaptchaSuccess,
    onCaptchaError,
  }
}
