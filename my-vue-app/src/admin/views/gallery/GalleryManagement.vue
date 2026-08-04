<template>
  <div class="gallery-management">
    <div class="page-header">
      <h2>图片集管理</h2>
      <el-button type="primary" @click="showCreateDialog">新增图片集</el-button>
    </div>

    <!-- 搜索区域 -->
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
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 图片集列表 -->
    <el-table :data="galleries" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="150" />
      <el-table-column prop="subtitle" label="副标题" min-width="150" />
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
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="栏目ID">
          <el-input-number v-model="form.bid" :min="0" placeholder="请输入栏目ID" />
        </el-form-item>
        <el-form-item label="缩略图">
          <ImageUploader v-model="form.simg" :thumb="true" @thumb-url="(url) => { if (!form.simg2) form.simg2 = url }" />
        </el-form-item>
        <el-form-item label="缩略图2">
          <ImageUploader v-model="form.simg2" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.descs"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.ord" :min="0" placeholder="请输入排序值" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入详细内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGalleries, createGallery, updateGallery, deleteGallery } from '@/shared/api/gallery'
import { useCrudList } from '@/shared/composables/useCrudList'
import ImageUploader from '../../components/ImageUploader.vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  bid: '',
  sortBy: 'ord_asc',
})

// 列表查询
const { loading, list: galleries, total, pagination, fetchList, handleQuery, handlePageChange, handleSizeChange } =
  useCrudList(async (params) => {
    const merged = { ...params, sortBy: searchForm.sortBy }
    if (searchForm.keyword) (merged as Record<string, unknown>).keyword = searchForm.keyword
    if (searchForm.bid) (merged as Record<string, unknown>).bid = searchForm.bid
    const result = await getGalleries(merged) as unknown as { items: Record<string, unknown>[]; total: number }
    return result
  })

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, { keyword: '', bid: '', sortBy: 'ord_asc' })
  handleQuery()
}

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增图片集')
const isEdit = ref(false)
const editId = ref(0)

// 表单数据
const form = reactive({
  title: '',
  subtitle: '',
  bid: 0,
  simg: '',
  simg2: '',
  descs: '',
  url: '',
  ord: 10,
  content: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref()

// 显示新增对话框
const showCreateDialog = () => {
  dialogTitle.value = '新增图片集'
  isEdit.value = false
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (row: {
  id: number
  title: string
  subtitle: string
  bid: number
  simg: string
  simg2: string
  descs: string
  url: string
  ord: number
  content: string
}) => {
  dialogTitle.value = '编辑图片集'
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    subtitle: row.subtitle,
    bid: row.bid,
    simg: row.simg,
    simg2: row.simg2,
    descs: row.descs,
    url: row.url,
    ord: row.ord,
    content: row.content
  })
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    title: '',
    subtitle: '',
    bid: 0,
    simg: '',
    simg2: '',
    descs: '',
    url: '',
    ord: 10,
    content: ''
  })
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    if (isEdit.value) {
      await updateGallery(editId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createGallery(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    fetchList()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

// 删除图片集
const handleDelete = async (row: { id: number; title: string }) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除图片集"${row.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteGallery(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.gallery-management {
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

.search-form {
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.dialog-footer {
  text-align: right;
}
</style>
