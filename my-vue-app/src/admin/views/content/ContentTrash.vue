<template>
  <div class="content-trash">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button :icon="ArrowLeft" @click="goBack">返回内容管理</el-button>
        <h2>回收站</h2>
      </div>
      <div class="toolbar-right">
        <el-button
          type="primary"
          :disabled="selectedIds.length === 0"
          @click="handleBatchRestore"
        >
          批量还原
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchPermanentDelete"
        >
          批量彻底删除
        </el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="articles"
      v-loading="loading"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="标题" min-width="200">
        <template #default="{ row }">
          <span>{{ row.title || '(无标题)' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" width="130">
        <template #default="{ row }">
          {{ getCategoryName(row.bid) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160">
        <template #default="{ row }">
          {{ formatTime(row.updatetime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleRestore(row)">还原</el-button>
          <el-button size="small" type="danger" @click="handlePermanentDelete(row)">
            彻底删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="pagination.total"
      @size-change="loadArticles"
      @current-change="loadArticles"
      style="margin-top: 16px; justify-content: flex-end"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getAdminArticles } from '@/shared/api/article'
import {
  restoreArticle,
  permanentDeleteArticle,
  batchRestoreArticles,
  batchPermanentDeleteArticles,
} from '@/shared/api/article'
import { getAdminCategories } from '@/shared/api/category'
import { formatTime } from '@/shared/utils/formatTime'

const router = useRouter()

/** 回收站文章状态标识 */
const TRASH_STATUS = -1

// ==================== 分类 ====================

const allCategories = ref<any[]>([])

/** 分类 ID → 名称映射（O(1) 查找） */
const categoryNameMap = ref<Map<number, string>>(new Map())

const getCategoryName = (bid: number) => {
  return (categoryNameMap.value.get(bid) ?? String(bid)) || '-'
}

// ==================== 文章列表 ====================

const loading = ref(false)
const tableRef = ref()
const articles = ref<any[]>([])
const selectedIds = ref<number[]>([])

const pagination = reactive({ page: 1, limit: 10, total: 0 })

const handleSelectionChange = (rows: any[]) => {
  selectedIds.value = rows.map((r) => r.id)
}

const loadCategories = async () => {
  try {
    const result = await getAdminCategories({ limit: 999 })
    const items = result?.items || []
    allCategories.value = items
    categoryNameMap.value = new Map(items.map((c: any) => [c.id, c.title]))
  } catch {
    // 静默处理
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const result = await getAdminArticles({
      page: pagination.page,
      limit: pagination.limit,
      status: TRASH_STATUS,
    })
    articles.value = result?.items || []
    pagination.total = result?.total || 0
  } catch {
    ElMessage.error('加载回收站列表失败')
  } finally {
    loading.value = false
  }
}

// ==================== 操作 ====================

const handleRestore = async (row: any) => {
  try {
    await restoreArticle(row.id)
    ElMessage.success('文章已恢复')
    loadArticles()
  } catch {
    ElMessage.error('恢复失败')
  }
}

const handlePermanentDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要彻底删除「${row.title}」吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
    await permanentDeleteArticle(row.id)
    ElMessage.success('已彻底删除')
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

const handleBatchRestore = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要批量还原 ${selectedIds.value.length} 篇文章吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      },
    )
    await batchRestoreArticles(selectedIds.value)
    ElMessage.success(`成功恢复 ${selectedIds.value.length} 篇文章`)
    selectedIds.value = []
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('批量恢复失败')
  }
}

const handleBatchPermanentDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要彻底删除 ${selectedIds.value.length} 篇文章吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
    await batchPermanentDeleteArticles(selectedIds.value)
    ElMessage.success(`成功彻底删除 ${selectedIds.value.length} 篇文章`)
    selectedIds.value = []
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('批量删除失败')
  }
}

const goBack = () => router.push('/content')

onMounted(async () => {
  await loadCategories()
  loadArticles()
})
</script>

<style scoped>
.content-trash {
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: 4px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-left h2 {
  margin: 0;
  font-size: 18px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}
</style>