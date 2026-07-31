import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminLogin, getAdminProfile, type LoginDto, type ProfileResponse } from '@/shared/api/auth'
import { getToken, setToken, removeToken } from '@/shared/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const admin = ref<ProfileResponse | null>(null)
  const isLoggedIn = ref<boolean>(!!token.value)

  // 登录
  const login = async (loginData: LoginDto) => {
    const response = await adminLogin(loginData)
    token.value = response.access_token
    isLoggedIn.value = true

    // 保存token到localStorage
    setToken(response.access_token)
    await fetchProfile()

    return response
  }

  // 获取用户信息
  const fetchProfile = async () => {
    try {
      const profile = await getAdminProfile()
      admin.value = profile
      return profile
    } catch (error) {
      logout()
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = null
    admin.value = null
    isLoggedIn.value = false
    removeToken()
  }

  // 初始化时检查登录状态
  const checkAuth = async () => {
    if (token.value) {
      try {
        await fetchProfile()
      } catch {
        logout()
      }
    }
  }

  return {
    token,
    admin,
    isLoggedIn,
    login,
    logout,
    fetchProfile,
    checkAuth,
  }
})
