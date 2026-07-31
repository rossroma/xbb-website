<template>
  <div class="message-management">
    <div class="page-header">
      <h2>{{ pageTitle }}</h2>
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">总留言</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number unread">{{ stats.unread }}</div>
            <div class="stat-label">未读</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number unchecked">{{ stats.unchecked }}</div>
            <div class="stat-label">未审核</div>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number replied">{{ stats.replied }}</div>
            <div class="stat-label">已回复</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索姓名、内容、手机号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="读取状态">
          <el-select v-model="searchForm.read_status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="未读" :value="0" />
            <el-option label="已读" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.check_status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="未审核" :value="0" />
            <el-option label="已审核" :value="1" />
            <el-option label="已拒绝" :value="2" />
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
          <el-select v-model="searchForm.sortBy" style="width: 150px">
            <el-option label="最新创建" value="id_desc" />
            <el-option label="最早创建" value="id_asc" />
            <el-option label="时间降序" value="addtime_desc" />
            <el-option label="时间升序" value="addtime_asc" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadMessages">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedMessages.length > 0">
      <el-button size="small" @click="batchMarkAsRead">批量标记已读</el-button>
      <el-button size="small" @click="batchApprove">批量审核通过</el-button>
      <el-button size="small" type="danger" @click="batchDelete">批量删除</el-button>
    </div>

    <!-- 留言列表 -->
    <el-table
      :data="messages"
      v-loading="loading"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" width="150">
        <template #default="{ row }">
          <span>{{ row.title || '(无标题)' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mname" label="姓名" width="100" />
      <el-table-column prop="tel" label="手机号" width="120" />
      <el-table-column prop="content" label="留言内容" min-width="200">
        <template #default="{ row }">
          <div class="message-content">
            {{ row.content.length > 50 ? row.content.substring(0, 50) + '...' : row.content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="read_status" label="读取状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.read_status === 1 ? 'success' : 'warning'">
            {{ row.read_status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="check_status" label="审核状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getCheckStatusType(row.check_status)">
            {{ row.check_status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="formatted_addtime" label="提交时间" width="150" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button size="small" @click="viewMessage(row)">查看</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="row.read_status === 1"
              @click="markAsRead(row)"
            >已读</el-button>
            <el-button
              size="small"
              type="success"
              :disabled="row.check_status === 1"
              @click="approve(row)"
            >通过</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <!-- 留言详情对话框 -->
    <el-dialog
      title="留言详情"
      v-model="detailDialogVisible"
      width="600px"
    >
      <div v-if="currentMessage" class="message-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题" :span="2">{{ currentMessage.title || '(无标题)' }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ currentMessage.mname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentMessage.tel }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentMessage.email || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ currentMessage.address || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="公司规模" v-if="currentMessage.scale">{{ currentMessage.scale }}</el-descriptions-item>
          <el-descriptions-item label="所属行业" v-if="currentMessage.industry">{{ currentMessage.industry }}</el-descriptions-item>
          <el-descriptions-item label="数据来源" v-if="currentMessage.source">{{ currentMessage.source }}</el-descriptions-item>
          <el-descriptions-item label="来源文章ID" v-if="currentMessage.article_id">{{ currentMessage.article_id }}</el-descriptions-item>
          <el-descriptions-item label="文章评分" v-if="currentMessage.article_score">{{ currentMessage.article_score }} 分</el-descriptions-item>
          <el-descriptions-item label="读取状态">
            <el-tag :type="currentMessage.read_status === 1 ? 'success' : 'warning'" size="small">
              {{ currentMessage.read_status_text }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getCheckStatusType(currentMessage.check_status)" size="small">
              {{ currentMessage.check_status_text }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间" :span="2">{{ currentMessage.formatted_addtime }}</el-descriptions-item>
          <el-descriptions-item label="留言内容" :span="2">
            <div class="message-content-full">{{ currentMessage.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="回复内容" :span="2" v-if="currentMessage.reply_content">
            <div class="reply-content">
              <p>{{ currentMessage.reply_content }}</p>
              <small>回复时间: {{ currentMessage.formatted_reply_time }}</small>
              <small>回复人: {{ currentMessage.reply_admin_name }}</small>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessageStats,
  batchUpdateMessageStatus
} from '@/shared/api/message'

const route = useRoute()

const MESSAGE_CATEGORIES: Record<number, string> = {
  1: '在线留言',
  2: '加入我们',
  3: '在线申请',
  4: '免费注册'
}

// 定义接口
interface MessageItem {
  id: number
  bid?: number
  title?: string
  mname: string
  tel: string
  email?: string
  address?: string
  content: string
  read_status: number
  check_status: number
  source?: string
  article_id?: number
  article_score?: number
  scale?: string
  industry?: string
  reply_content?: string
  formatted_addtime: string
  formatted_reply_time?: string
  reply_admin_name?: string
  read_status_text: string
  check_status_text: string
}

interface MessageListResponse {
  items: MessageItem[]
  total: number
}

const activeBid = computed<number | undefined>(() => {
  const raw = route.params.cateid
  if (!raw) return undefined
  const cateid = Number(raw)
  return cateid in MESSAGE_CATEGORIES ? cateid : undefined
})

const pageTitle = computed(() => {
  if (activeBid.value === undefined) return '留言管理'
  return `留言管理 - ${MESSAGE_CATEGORIES[activeBid.value]}`
})

const loading = ref(false)
const detailDialogVisible = ref(false)
const messages = ref<MessageItem[]>([])
const selectedMessages = ref<MessageItem[]>([])
const currentMessage = ref<MessageItem | null>(null)
const dateRange = ref<string[]>([])

// 统计数据
const stats = reactive({
  total: 0,
  unread: 0,
  unchecked: 0,
  replied: 0
})

// 搜索表单
const searchForm = reactive({
  keyword: '',
  read_status: undefined as number | undefined,
  check_status: undefined as number | undefined,
  start_date: '',
  end_date: '',
  sortBy: 'id_desc'
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

// 加载留言列表
const loadMessages = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    }

    if (activeBid.value !== undefined) {
      params.bid = activeBid.value
    }

    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }

    const result = await getMessages(params) as unknown as MessageListResponse
    messages.value = result.items || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('加载留言列表失败:', error)
    ElMessage.error('加载留言列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const result = await getMessageStats()
    Object.assign(stats, result)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 查看留言详情
const viewMessage = async (row: MessageItem) => {
  try {
    const result = await getMessage(row.id) as unknown as MessageItem
    currentMessage.value = result
    detailDialogVisible.value = true

    // 刷新列表以更新读取状态
    loadMessages()
    loadStats()
  } catch (error) {
    console.error('获取留言详情失败:', error)
    ElMessage.error('获取留言详情失败')
  }
}

const markAsRead = async (row: MessageItem) => {
  try {
    await updateMessage(row.id, { read_status: 1 })
    ElMessage.success('已标记为已读')
    loadMessages()
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const approve = async (row: MessageItem) => {
  try {
    await updateMessage(row.id, { check_status: 1 })
    ElMessage.success('审核通过')
    loadMessages()
    loadStats()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除留言
const handleDelete = async (row: MessageItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteMessage(row.id)
    ElMessage.success('删除成功')
    loadMessages()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 选择变化
const handleSelectionChange = (selection: MessageItem[]) => {
  selectedMessages.value = selection
}

// 批量标记已读
const batchMarkAsRead = async () => {
  try {
    const ids = selectedMessages.value.map(item => item.id)
    await batchUpdateMessageStatus({ ids, status: { read_status: 1 } })
    ElMessage.success('批量标记已读成功')
    loadMessages()
    loadStats()
  } catch (error) {
    console.error('批量操作失败:', error)
    ElMessage.error('批量操作失败')
  }
}

// 批量审核通过
const batchApprove = async () => {
  try {
    const ids = selectedMessages.value.map(item => item.id)
    await batchUpdateMessageStatus({ ids, status: { check_status: 1 } })
    ElMessage.success('批量审核通过成功')
    loadMessages()
    loadStats()
  } catch (error) {
    console.error('批量操作失败:', error)
    ElMessage.error('批量操作失败')
  }
}

// 批量删除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedMessages.value.length} 条留言吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    for (const message of selectedMessages.value) {
      await deleteMessage(message.id)
    }

    ElMessage.success('批量删除成功')
    loadMessages()
    loadStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadMessages()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadMessages()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    keyword: '',
    read_status: undefined,
    check_status: undefined,
    start_date: '',
    end_date: '',
    sortBy: 'id_desc'
  })
  dateRange.value = []
  pagination.page = 1
  loadMessages()
}

// 获取审核状态类型
const getCheckStatusType = (status: number) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

watch(
  () => route.params.cateid,
  () => {
    pagination.page = 1
    selectedMessages.value = []
    loadMessages()
  }
)

// 组件挂载时加载数据
onMounted(() => {
  loadMessages()
  loadStats()
})
</script>

<style scoped>
.message-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-top: 20px;
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

.stat-number.unread {
  color: #E6A23C;
}

.stat-number.unchecked {
  color: #F56C6C;
}

.stat-number.replied {
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

.batch-actions {
  margin-bottom: 20px;
  padding: 10px;
  background: #f0f9ff;
  border-radius: 4px;
}

.message-content {
  line-height: 1.5;
}

.message-content-full {
  line-height: 1.6;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0;
}
</style>
