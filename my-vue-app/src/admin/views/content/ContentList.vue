<template>
  <div class="content-list">
    <div class="page-header">
      <h2>内容管理 - {{ categoryTitle }}</h2>
      <el-button type="primary" @click="handleCreate">添加</el-button>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入标题"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="searchForm.bid" placeholder="全部" clearable style="width: 150px">
            <el-option
              v-for="cat in subCategories"
              :key="cat.id"
              :label="cat.title"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadArticles">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="articles" v-loading="loading" border>
      <el-table-column type="selection" width="45" />
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
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminArticles } from '@/shared/api/article'
import { getAdminCategories } from '@/shared/api/category'
import request from '@/shared/api/request'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const articles = ref<any[]>([])
const allCategories = ref<any[]>([])

const pagination = reactive({ page: 1, limit: 10, total: 0 })

const searchForm = reactive({
  title: '',
  bid: undefined as number | undefined,
  status: undefined as number | undefined,
})

const currentBid = computed(() => {
  const bid = route.params.bid
  return bid ? parseInt(bid as string) : undefined
})

const categoryTitle = computed(() => {
  if (!currentBid.value) return ''
  const cat = allCategories.value.find((c) => c.id === currentBid.value)
  return cat?.title || ''
})

const subCategories = computed(() => {
  if (!currentBid.value) return allCategories.value
  return allCategories.value.filter((c) => c.id === currentBid.value || c.pid === currentBid.value)
})

const getCategoryName = (bid: number) => {
  const cat = allCategories.value.find((c) => c.id === bid)
  return cat?.title || bid || '-'
}

const formatTime = (ts: number) => {
  if (!ts) return '-'
  return new Date(ts * 1000).toLocaleString('zh-CN', { hour12: false })
}

const loadArticles = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm,
    }
    if (currentBid.value && !searchForm.bid) {
      params.bid = currentBid.value
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

const loadCategories = async () => {
  try {
    const result = await getAdminCategories({ limit: 999 })
    allCategories.value = result?.items || []
  } catch {}
}

const resetSearch = () => {
  Object.assign(searchForm, { title: '', bid: undefined, status: undefined })
  pagination.page = 1
  loadArticles()
}

const handleCreate = () => {
  router.push(`/admin/content/${currentBid.value}/create`)
}

const handleEdit = (row: any) => {
  router.push(`/admin/content/${currentBid.value}/edit/${row.id}`)
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
    loadArticles()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  }
}

watch(
  () => route.params.bid,
  () => {
    pagination.page = 1
    searchForm.bid = undefined
    loadArticles()
  },
)

onMounted(async () => {
  await loadCategories()
  loadArticles()
})
</script>

<style scoped>
.content-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  background: #f5f5f5;
  padding: 16px 20px 4px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.article-title {
  color: #303133;
}
</style>
