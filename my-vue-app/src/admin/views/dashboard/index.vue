<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff">
              <el-icon :size="32"><DocDetail /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalArticles }}</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon :size="32"><Folder /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCategories }}</div>
              <div class="stat-label">栏目总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon :size="32"><Eyes /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalViews }}</div>
              <div class="stat-label">总浏览量</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon :size="32"><Edit /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.publishedArticles }}</div>
              <div class="stat-label">已发布文章</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" @click="$router.push('/content/create')">
              创建文章
            </el-button>
            <el-button type="success" :icon="Checklist" @click="$router.push('/content')">
              内容管理
            </el-button>
            <el-button type="warning" :icon="Folder" @click="$router.push('/category/list')">
              栏目管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DocDetail, Folder, Eyes, Edit, Plus, Checklist } from '@/client/components/ui/remixIcons'
import { getArticles, getCategories } from '@/shared/api/admin'

const stats = ref({
  totalArticles: 0,
  totalCategories: 0,
  totalViews: 0,
  publishedArticles: 0
})

const fetchStats = async () => {
  try {
    const [articlesRes, categoriesRes] = await Promise.all([
      getArticles(),
      getCategories()
    ])

    stats.value.totalArticles = articlesRes.total || 0
    stats.value.totalCategories = categoriesRes.total || 0
    stats.value.publishedArticles = articlesRes.items?.filter((item: any) => item.status === 1).length || 0
    stats.value.totalViews = articlesRes.items?.reduce((sum: number, item: any) => sum + (item.hit || 0), 0) || 0
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>
