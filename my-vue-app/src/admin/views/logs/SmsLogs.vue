<template>
  <div class="sms-logs">
    <div class="page-header">
      <h2>短信日志</h2>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="搜索手机号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="发送状态">
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
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="status" label="发送状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
            {{ row.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMsg" label="错误信息" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.errorMsg" class="error-msg">{{ row.errorMsg }}</span>
          <span v-else class="no-error">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column prop="userAgent" label="User-Agent" min-width="200" show-overflow-tooltip />
      <el-table-column prop="created_at" label="发送时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.created_at) }}
        </template>
      </el-table-column>
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
import { getSmsLogs } from '@/shared/api/sms'
import type { SmsLogItem } from '@/shared/api/sms'

const loading = ref(false)
const logs = ref<SmsLogItem[]>([])
const dateRange = ref<string[]>([])

const searchForm = reactive({
  phone: '',
  status: '',
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const loadLogs = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: pagination.page,
      limit: pagination.limit,
      phone: searchForm.phone,
      status: searchForm.status,
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    const result = await getSmsLogs(params as any)
    logs.value = result.list || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('加载短信日志失败:', error)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.phone = ''
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
.sms-logs {
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

.error-msg {
  color: #f56c6c;
}

.no-error {
  color: #c0c4cc;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>