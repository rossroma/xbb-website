<template>
  <div class="login-page">
    <div class="login-shell">
      <div class="login-hero">
        <div class="hero-badge">销帮帮CRM后台管理系统</div>
        <h1>欢迎回到销帮帮CRM后台管理系统</h1>
        <p>统一管理内容、广告、留言与系统配置。</p>
        <ul class="hero-list">
          <li>内容与栏目统一管理</li>
          <li>广告位与广告内容联动维护</li>
          <li>登录新增算式验证防刷保护</li>
        </ul>
      </div>

      <div class="login-panel">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="top"
        >
          <div class="title-container">
            <h3 class="title">管理员登录</h3>
            <p class="subtitle">请输入账号密码并完成算式校验</p>
          </div>

          <el-form-item prop="username" label="用户名">
            <el-input
              ref="usernameRef"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              ref="passwordRef"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              :prefix-icon="Lock"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #suffix>
                <el-icon class="password-icon" @click="showPassword">
                  <component :is="passwordType === 'password' ? View : Hide" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="captchaCode" label="算式验证">
            <div class="captcha-row">
              <el-input
                v-model="loginForm.captchaCode"
                placeholder="请输入计算结果"
                name="captchaCode"
                maxlength="3"
                tabindex="3"
                size="large"
                @keyup.enter="handleLogin"
              />
              <button
                type="button"
                class="captcha-card"
                @click="refreshCaptcha"
                :disabled="captchaLoading"
              >
                <img v-if="captchaImage" :src="captchaImage" alt="验证码" class="captcha-image" />
                <span v-else class="captcha-placeholder">加载中...</span>
              </button>
            </div>
            <div class="captcha-tip">点击验证码图片可刷新</div>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="login-button"
            @click.prevent="handleLogin"
          >
            登录
          </el-button>

          <div class="tips">
            <span>测试账号: admin</span>
            <span>测试密码: 123456</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getAdminCaptcha } from '@/shared/api/auth'
import { useAuthStore } from '@/admin/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const usernameRef = ref()
const passwordRef = ref()

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captchaId: '',
  captchaCode: '',
})

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaCode: [{ required: true, message: '请输入计算结果', trigger: 'blur' }],
})

const passwordType = ref('password')
const loading = ref(false)
const captchaLoading = ref(false)
const captchaImage = ref('')

const showPassword = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

const refreshCaptcha = async () => {
  captchaLoading.value = true
  try {
    const result = await getAdminCaptcha()
    loginForm.captchaId = result.captchaId
    loginForm.captchaCode = ''
    captchaImage.value = result.image
  } catch (error) {
    ElMessage.error('获取验证码失败，请重试')
  } finally {
    captchaLoading.value = false
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login({ ...loginForm })
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (error: any) {
        ElMessage.error(error || '登录失败')
        await refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.login-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(44, 166, 255, 0.22), transparent 28%),
    radial-gradient(circle at bottom right, rgba(15, 118, 110, 0.26), transparent 26%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 48%, #0f766e 100%);
  padding: 32px;
  overflow: auto;
  overscroll-behavior: contain;
}

.login-shell {
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 25px 80px rgba(15, 23, 42, 0.32);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
}

.login-hero {
  padding: 56px 52px;
  color: #fff;
  background:
    linear-gradient(180deg, rgba(7, 89, 133, 0.15), rgba(15, 23, 42, 0.1)),
    linear-gradient(145deg, #0f766e 0%, #0f172a 100%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-hero h1 {
  margin: 26px 0 14px;
  font-size: 40px;
  line-height: 1.15;
}

.login-hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.hero-list {
  margin: 36px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 16px;
}

.hero-list li {
  position: relative;
  padding-left: 24px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #5eead4;
  box-shadow: 0 0 0 6px rgba(94, 234, 212, 0.16);
}

.login-panel {
  padding: 56px 48px;
  background: rgba(255, 255, 255, 0.94);
}

.login-form {
  max-width: 420px;
  margin: 0 auto;
}

.title-container {
  margin-bottom: 32px;
}

.title {
  margin: 0;
  font-size: 30px;
  color: #111827;
  font-weight: 700;
}

.subtitle {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.password-icon {
  cursor: pointer;
}

.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px;
  gap: 12px;
  width: 100%;
}

.captcha-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
  overflow: hidden;
  padding: 0;
}

.captcha-card:hover {
  border-color: #14b8a6;
  transform: translateY(-1px);
}

.captcha-card:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.captcha-image {
  display: block;
  width: 100px;
  height: 40px;
}

.captcha-placeholder,
.captcha-tip {
  color: #6b7280;
  font-size: 12px;
}

.captcha-tip {
  margin-top: 8px;
}

.login-button {
  width: 100%;
  margin: 8px 0 24px;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

.tips {
  font-size: 13px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  min-height: 46px;
  border-radius: 12px;
}

@media (max-width: 960px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-hero {
    display: none;
  }

  .login-panel {
    padding: 40px 24px;
  }
}
</style>
