<template>
  <div class="navbar">
    <div class="left-menu">
      <span class="title">{{ systemTitle }}</span>
    </div>
    <div class="right-menu">
      <div class="quick-actions">
        <a class="quick-action" href="/" target="_blank" rel="noopener noreferrer">
          <el-icon><Eyes /></el-icon>
          <span>查看前台</span>
        </a>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="32" :src="avatarUrl">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="identity-text">
            <span class="username">{{ username }}</span>
            <span v-if="groupTitle" class="group-title">{{ groupTitle }}</span>
          </div>
          <el-icon class="el-icon--right"><Down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><Logout /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Down, Logout, Eyes } from '@/client/components/ui/remixIcons'
import { getAllSettings } from '@/shared/api/settings'
import { useAuthStore } from '@/admin/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const companyName = ref('销帮帮CRM')

const systemTitle = computed(() => `${companyName.value || '销帮帮CRM'}后台管理系统`)

const username = computed(() => authStore.admin?.username || '未登录')
const groupTitle = computed(() => authStore.admin?.group_info?.title || '')

const avatarUrl = computed(() => '')

const loadSystemTitle = async () => {
  try {
    const result = await getAllSettings() as any
    companyName.value = result?.base?.company || '销帮帮CRM'
  } catch {
    companyName.value = '销帮帮CRM'
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    authStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  loadSystemTitle()
  if (authStore.token && !authStore.admin) {
    authStore.fetchProfile().catch(() => undefined)
  }
})
</script>

<style scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.left-menu {
  display: flex;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.right-menu {
  display: flex;
  align-items: center;
   gap: 12px;
  height: 100%;
}

.quick-actions {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 18px;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(180deg, #27b2c8 0%, #1f9bb2 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.08);
  transition: filter 0.2s ease;
}

.quick-action:hover {
  filter: brightness(1.05);
}

.quick-action :deep(.el-icon) {
  font-size: 18px;
}

.quick-action span {
  font-size: 14px;
  font-weight: 600;
}

.avatar-container {
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  transition: background-color 0.3s;
  border-radius: 4px;
}

.identity-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.avatar-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.username {
  font-size: 14px;
  color: #606266;
}

.group-title {
  font-size: 12px;
  color: #909399;
}
</style>
