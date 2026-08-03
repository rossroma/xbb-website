<template>
  <div class="not-found-container">
    <el-result icon="warning" title="404" sub-title="您访问的页面不存在或已被移除">
      <template #extra>
        <div class="action-buttons">
          <el-button type="primary" @click="goDashboard">返回工作台</el-button>
          <el-button @click="goBack">返回上页</el-button>
        </div>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goDashboard = () => {
  router.push('/dashboard')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 40px 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>