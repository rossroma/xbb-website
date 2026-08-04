<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.sortBy" style="width: 150px" class="filter-item">
        <el-option label="最新创建" value="id_desc" />
        <el-option label="最早创建" value="id_asc" />
        <el-option label="排序号升序" value="ord_asc" />
        <el-option label="排序号降序" value="ord_desc" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="Plus" @click="handleCreate">
        新增广告位
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="广告位名称" prop="title" min-width="150" />
      <el-table-column label="PC尺寸" prop="width_height" align="center" width="120" />
      <el-table-column label="手机尺寸" prop="wap_width_height" align="center" width="120" />
      <el-table-column label="排序" prop="ord" align="center" width="80" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="row.is_show === 1 ? 'success' : 'danger'">
            {{ row.is_show === 1 ? '显示' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280" fixed="right">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="handleManage(row)"> 信息管理 </el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.limit"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="fetchList"
      @current-change="fetchList"
      style="margin-top: 16px; justify-content: flex-end"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增广告位' : '编辑广告位'"
      width="600px"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="广告位名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入广告位名称" />
        </el-form-item>
        <el-form-item label="PC图片尺寸">
          <el-input v-model="formData.width_height" placeholder="例如: 1920x500" />
        </el-form-item>
        <el-form-item label="手机图片尺寸">
          <el-input v-model="formData.wap_width_height" placeholder="例如: 750x400" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.ord" :min="0" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="formData.is_show">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.content" type="textarea" :rows="3" placeholder="请输入描述" />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getAdminAdsTypes,
  getAdminAdsTypeDetail,
  createAdminAdsType,
  updateAdminAdsType,
  deleteAdminAdsType,
  type AdsType,
} from '@/shared/api/ads'

const router = useRouter()

const listLoading = ref(false)
const list = ref<AdsType[]>([])
const total = ref(0)

const listQuery = ref({
  page: 1,
  limit: 10,
  sortBy: 'id_desc',
})

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const formData = ref<Partial<AdsType>>({
  title: '',
  width_height: '',
  wap_width_height: '',
  ord: 10,
  content: '',
  is_show: 1,
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }],
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const res = await getAdminAdsTypes(listQuery.value)
    list.value = (res.items as unknown as AdsType[]) || (res as unknown as AdsType[])
    total.value = res.total || list.value.length
  } finally {
    listLoading.value = false
  }
}

const handleCreate = () => {
  dialogType.value = 'create'
  formData.value = {
    title: '',
    width_height: '',
    wap_width_height: '',
    ord: 10,
    content: '',
    is_show: 1,
  }
  dialogVisible.value = true
}

const handleEdit = async (row: AdsType) => {
  dialogType.value = 'edit'
  const data = await getAdminAdsTypeDetail(row.id)
  formData.value = { ...data }
  dialogVisible.value = true
}

const handleManage = (row: AdsType) => {
  router.push(`/ads/types/${row.id}/items`)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (dialogType.value === 'create') {
        await createAdminAdsType(formData.value)
        ElMessage.success('创建成功')
      } else {
        await updateAdminAdsType(formData.value.id!, formData.value)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    }
  })
}

const handleDelete = (row: AdsType) => {
  ElMessageBox.confirm('确定要删除这个广告位吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteAdminAdsType(row.id)
    ElMessage.success('删除成功')
    fetchList()
  }).catch(() => {})
}

onMounted(() => {
  fetchList()
})
</script>


<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 16px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
