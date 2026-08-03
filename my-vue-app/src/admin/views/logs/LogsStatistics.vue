<template>
  <div class="logs-statistics">
    <div class="page-header">
      <h2>日志统计</h2>
    </div>

    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.total_operations }}</div>
          <div class="stat-label">总操作数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.total_logins }}</div>
          <div class="stat-label">总登录次数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number warning">{{ stats.failed_logins }}</div>
          <div class="stat-label">登录失败</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number success">{{ stats.active_users }}</div>
          <div class="stat-label">活跃用户</div>
        </div>
      </el-card>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadStats">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-empty description="暂无统计数据" v-if="!loading && stats.total_operations === 0" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getLogsStatistics } from '@/shared/api/logs'

const loading = ref(false)
const dateRange = ref<string[]>([])

const searchForm = reactive({
  start_date: '',
  end_date: ''
})

const stats = reactive({
  total_operations: 0,
  total_logins: 0,
  failed_logins: 0,
  active_users: 0
})

const loadStats = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = {}
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    const result = await getLogsStatistics(params)
    Object.assign(stats, result)
  } catch (error) {
    console.error('加载日志统计失败:', error)
    ElMessage.error('加载日志统计失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.logs-statistics {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-number.warning {
  color: #E6A23C;
}

.stat-number.success {
  color: #67C23A;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.search-area {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}
</style>