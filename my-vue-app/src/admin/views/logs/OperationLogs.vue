<template>
  <div class="operation-logs">
    <div class="page-header">
      <h2>操作日志</h2>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索操作内容" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.action_type" placeholder="请选择" clearable style="width: 150px">
            <el-option label="新增" value="create" />
            <el-option label="修改" value="update" />
            <el-option label="删除" value="delete" />
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
      <el-table-column prop="operator" label="操作人" width="120" />
      <el-table-column prop="action" label="操作类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getActionTypeTag(row.action)">{{ row.action_text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="module" label="操作模块" width="120" />
      <el-table-column prop="content" label="操作内容" min-width="200" />
      <el-table-column prop="ip" label="IP地址" width="140" />
      <el-table-column prop="formatted_time" label="操作时间" width="160" />
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getOperationLogs } from '@/shared/api/logs'

interface LogItem {
  id: number
  operator: string
  action: string
  action_text: string
  module: string
  content: string
  ip: string
  formatted_time: string
}

const loading = ref(false)
const logs = ref<LogItem[]>([])
const dateRange = ref<string[]>([])

const searchForm = reactive({
  keyword: '',
  action_type: ''
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
      keyword: searchForm.keyword,
      action_type: searchForm.action_type,
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    const result = await getOperationLogs(params)
    logs.value = (result.items as unknown as LogItem[]) || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('加载操作日志失败:', error)
    ElMessage.error('加载操作日志失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.action_type = ''
  dateRange.value = []
  pagination.page = 1
  loadLogs()
}

const getActionTypeTag = (action: string) => {
  const typeMap: Record<string, string> = {
    create: 'success',
    update: 'warning',
    delete: 'danger'
  }
  return typeMap[action] || 'info'
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
.operation-logs {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
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

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>