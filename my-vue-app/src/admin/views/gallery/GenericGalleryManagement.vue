<template>
  <div class="gallery-generic-management">
    <div class="page-header">
      <h2>{{ label }}管理</h2>
      <el-button type="primary" @click="showCreateDialog">新增{{ label }}</el-button>
    </div>

    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索标题、描述"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="栏目ID">
          <el-input
            v-model="searchForm.bid"
            placeholder="输入栏目ID"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.sortBy" style="width: 150px">
            <el-option label="排序号升序" value="ord_asc" />
            <el-option label="排序号降序" value="ord_desc" />
            <el-option label="最新创建" value="id_desc" />
            <el-option label="最早创建" value="id_asc" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="150" />
      <el-table-column prop="subtitle" label="副标题" min-width="120" />
      <el-table-column prop="bid" label="栏目ID" width="100" />
      <el-table-column prop="simg" label="缩略图" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.simg"
            :src="row.simg"
            :preview-src-list="[row.simg]"
            style="width: 60px; height: 40px"
            fit="cover"
            preview-teleported
            :z-index="9999"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="descs" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="ord" label="排序" width="80" />
      <el-table-column prop="formatted_addtime" label="创建时间" width="180" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="pagination.total"
      @size-change="loadList"
      @current-change="loadList"
      style="margin-top: 16px; justify-content: flex-end"
    />

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="栏目ID">
          <el-input-number v-model="form.bid" :min="0" />
        </el-form-item>
        <el-form-item label="缩略图">
          <ImageUploader v-model="form.simg" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.descs" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.ord" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PaginatedResult } from '@/shared/api/types'
import type { ComponentPublicInstance } from 'vue'
import ImageUploader from '../../components/ImageUploader.vue'

interface GalleryApi {
  getList: (params?: Record<string, unknown>) => Promise<PaginatedResult<Record<string, unknown>>>
  create: (data: Record<string, unknown>) => Promise<Record<string, unknown>>
  update: (id: number, data: Record<string, unknown>) => Promise<Record<string, unknown>>
  delete: (id: number) => Promise<void>
}

interface Props {
  label: string
  api: GalleryApi
}

const props = defineProps<Props>()

const loading = ref(false)
const list = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(0)
const formRef = ref<ComponentPublicInstance | null>(null)

const searchForm = reactive({ keyword: '', bid: '', sortBy: 'ord_asc' })
const pagination = reactive({ page: 1, limit: 10, total: 0 })

const form = reactive({
  title: '',
  subtitle: '',
  bid: 0,
  simg: '',
  descs: '',
  url: '',
  ord: 10,
  content: '',
})

const rules = { title: [{ required: true, message: '请输入标题', trigger: 'blur' }] }

const dialogTitle = computed(() => (isEdit.value ? `编辑${props.label}` : `新增${props.label}`))

const loadList = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: pagination.page, limit: pagination.limit }
    const sortMap: Record<string, Record<string, string>> = {
      ord_asc: { sort: 'ord', order: 'ASC' },
      ord_desc: { sort: 'ord', order: 'DESC' },
      id_desc: { sort: 'id', order: 'DESC' },
      id_asc: { sort: 'id', order: 'ASC' },
    }
    Object.assign(params, sortMap[searchForm.sortBy] || sortMap.ord_asc)
    if (searchForm.keyword) params.keyword = searchForm.keyword
    if (searchForm.bid) params.bid = searchForm.bid
    const result = await props.api.getList(params)
    list.value = result.items || []
    pagination.total = result.total || 0
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  Object.assign(searchForm, { keyword: '', bid: '', sortBy: 'ord_asc' })
  pagination.page = 1
  loadList()
}

const showCreateDialog = () => {
  isEdit.value = false
  editId.value = 0
  Object.assign(form, {
    title: '',
    subtitle: '',
    bid: 0,
    simg: '',
    descs: '',
    url: '',
    ord: 10,
    content: '',
  })
  dialogVisible.value = true
}

const showEditDialog = (row: Record<string, unknown>) => {
  isEdit.value = true
  editId.value = row.id as number
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await (
    formRef.value as unknown as { validate: (cb: (valid: boolean) => Promise<void>) => void }
  ).validate(async (valid: boolean) => {
    if (!valid) return
    try {
      if (isEdit.value) {
        await props.api.update(editId.value, form as unknown as Record<string, unknown>)
        ElMessage.success('更新成功')
      } else {
        await props.api.create(form as unknown as Record<string, unknown>)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadList()
    } catch {
      ElMessage.error('操作失败')
    }
  })
}

const handleDelete = async (row: Record<string, unknown>) => {
  try {
    await ElMessageBox.confirm(`确定删除"${row.title}"吗？`, '提示', { type: 'warning' })
    await props.api.delete(row.id as number)
    ElMessage.success('删除成功')
    loadList()
  } catch (e: unknown) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const resetForm = () => {
  const el = formRef.value as unknown as { resetFields: () => void } | null
  el?.resetFields()
}

onMounted(loadList)
</script>

<style scoped>
.gallery-generic-management {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search-area {
  margin-bottom: 16px;
}
</style>
