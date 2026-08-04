<template>
  <div class="login-logs">
    <div class="page-header">
      <h2>登录日志</h2>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="搜索用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="登录状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
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
          <el-button type="primary" @click="loadLogs">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="logs" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="status" label="登录状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
            {{ row.status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column prop="user_agent" label="浏览器/设备" min-width="200" />
      <el-table-column prop="formatted_time" label="登录时间" width="160" />
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoginLogs } from '@/shared/api/logs'

interface LoginLogItem {
  id: number
  username: string
  status: string
  status_text: string
  ip: string
  user_agent: string
  formatted_time: string
}

const loading = ref(false)
const logs = ref<LoginLogItem[]>([])
const dateRange = ref<string[]>([])

const searchForm = reactive({
  username: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const loadLogs = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: pagination.page,
      limit: pagination.limit,
      username: searchForm.username,
      status: searchForm.status,
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    const result = await getLoginLogs(params)
    logs.value = (result.items as unknown as LoginLogItem[]) || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('加载登录日志失败:', error)
    ElMessage.error('加载登录日志失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.username = ''
  searchForm.status = ''
  dateRange.value = []
  pagination.page = 1
  loadLogs()
}

const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadLogs()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadLogs()
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.login-logs {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.search-area {
  margin-bottom: 16px;
}

.search-form {
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>