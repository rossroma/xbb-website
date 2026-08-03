<template>
  <div class="content-management">
    <!-- 左栏：分类树 -->
    <div class="left-panel">
      <div class="panel-header">
        <h3>栏目分类</h3>
      </div>
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          :data="categoryTree"
          :props="treeProps"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleCategoryClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <span class="tree-node-label">{{ data.title }}</span>
              <span v-if="articleCounts[data.id]" class="tree-node-count">{{ articleCounts[data.id] }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <!-- 右栏：文章列表 -->
    <div class="right-panel">
      <!-- 顶部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input
            v-model="searchForm.title"
            placeholder="搜索标题"
            clearable
            style="width: 220px"
            @keyup.enter="handleSearch"
          />
          <el-select
            v-model="searchForm.status"
            placeholder="状态"
            clearable
            style="width: 120px; margin-left: 10px"
            @change="handleSearch"
          >
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
          <el-button type="primary" style="margin-left: 10px" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <div class="toolbar-right">
          <el-button type="primary" @click="handleCreate">新增</el-button>
        </div>
      </div>

      <!-- 文章表格 -->
      <el-table :data="articles" v-loading="loading" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <span class="article-title">{{ row.title || '(无标题)' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属分类" width="130">
          <template #default="{ row }">
            {{ getCategoryName(row.bid) }}
          </template>
        </el-table-column>
        <el-table-column prop="ord" label="排序" width="70" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.addtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminArticles, getArticleCounts } from '@/shared/api/article'
import { getAdminCategories } from '@/shared/api/category'
import request from '@/shared/api/request'

const router = useRouter()

// ==================== 分类树 ====================

const treeRef = ref()
const allCategories = ref<any[]>([])
const categoryTree = ref<any[]>([])
const selectedBid = ref<number | undefined>(undefined)
const articleCounts = ref<Record<number, number>>({})

const treeProps = {
  children: 'children',
  label: 'title',
}

/** 将扁平分类列表转为嵌套树结构 */
const buildCategoryTree = (items: any[], pid: number = 0): any[] => {
  return items
    .filter((c) => c.pid === pid)
    .sort((a, b) => (a.ord ?? 10) - (b.ord ?? 10))
    .map((c) => ({
      ...c,
      children: buildCategoryTree(items, c.id),
    }))
}

/** 根据分类 ID 查找分类名称 */
const getCategoryName = (bid: number) => {
  const cat = allCategories.value.find((c: any) => c.id === bid)
  return cat?.title || String(bid) || '-'
}

/** 点击分类树节点 */
const handleCategoryClick = (data: any) => {
  selectedBid.value = data.id
  pagination.page = 1
  loadArticles()
}

// ==================== 文章列表 ====================

const loading = ref(false)
const articles = ref<any[]>([])

const pagination = reactive({ page: 1, limit: 10, total: 0 })

const searchForm = reactive({
  title: '',
  status: undefined as number | undefined,
})

const formatTime = (ts: number) => {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString('zh-CN', { hour12: false })
}

const loadCategories = async () => {
  try {
    const result = await getAdminCategories({ limit: 999 })
    allCategories.value = result?.items || []
    categoryTree.value = buildCategoryTree(allCategories.value, 0)
  } catch {
    // 静默处理
  }
}

const loadArticleCounts = async () => {
  try {
    articleCounts.value = await getArticleCounts()
  } catch {
    // 静默处理
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
    }
    if (searchForm.title) {
      params.title = searchForm.title
    }
    if (searchForm.status !== undefined) {
      params.status = searchForm.status
    }
    if (selectedBid.value) {
      params.bid = selectedBid.value
    }
    const result = await getAdminArticles(params)
    articles.value = result?.items || []
    pagination.total = result?.total || 0
  } catch {
    ElMessage.error('加载文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadArticles()
}

const handleReset = () => {
  Object.assign(searchForm, { title: '', status: undefined })
  pagination.page = 1
  loadArticles()
}

const handleCreate = () => {
  const bid = selectedBid.value
  const query = bid ? `?bid=${bid}` : ''
  router.push(`/admin/content/create${query}`)
}

const handleEdit = (row: any) => {
  router.push(`/admin/content/edit/${row.id}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除「${row.title}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await request.delete(`/v1/admin/articles/${row.id}`)
    ElMessage.success('删除成功')
    loadArticleCounts()
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadArticleCounts()])
  loadArticles()
})
</script>

<style scoped>
.content-management {
  display: flex;
  gap: 16px;
  height: calc(100vh - 50px - 40px); /* navbar(~50px) + AppMain padding(20px*2) */
}

/* ====== 左栏：分类树 ====== */
.left-panel {
  width: 250px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.tree-wrapper {
  flex: 1;
  overflow: auto;
  padding: 8px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding-right: 4px;
}

.tree-node-label {
  font-size: 13px;
  color: #303133;
}

.tree-node-count {
  font-size: 11px;
  color: #909399;
  background: #f0f2f5;
  border-radius: 10px;
  padding: 0 6px;
  min-width: 20px;
  text-align: center;
  line-height: 18px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* ====== 右栏：文章列表 ====== */
.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.article-title {
  color: #303133;
}
</style>