<template>
  <div class="app-container">
    <div class="page-header" v-if="currentAdsTypeTitle">
      <h2>{{ currentAdsTypeTitle }}</h2>
    </div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="广告名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.bid"
        placeholder="广告位"
        :clearable="activeBid === undefined"
        :disabled="activeBid !== undefined"
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in adsTypes" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sortBy" style="width: 150px" class="filter-item">
        <el-option label="最新创建" value="id_desc" />
        <el-option label="最早创建" value="id_asc" />
        <el-option label="排序号升序" value="ord_asc" />
        <el-option label="排序号降序" value="ord_desc" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="Plus" @click="handleCreate">
        新增广告
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
      <el-table-column label="缩略图" align="center" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.simg"
            :src="row.simg"
            :preview-src-list="[row.simg]"
            fit="cover"
            style="width: 80px; height: 60px"
            preview-teleported
            :z-index="9999"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="广告名称" prop="title" min-width="150" />
      <el-table-column label="广告位" align="center" width="120">
        <template #default="{ row }">
          {{ getAdsTypeName(row.bid) }}
        </template>
      </el-table-column>
      <el-table-column label="链接地址" prop="url" min-width="200" show-overflow-tooltip />
      <el-table-column label="排序" prop="ord" align="center" width="80" />
      <el-table-column label="浏览量" prop="hit" align="center" width="100" />
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新增广告' : '编辑广告'"
      width="800px"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="广告名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入广告名称" />
        </el-form-item>
        <el-form-item label="广告位" prop="bid">
          <el-select
            v-model="formData.bid"
            placeholder="请选择广告位"
            style="width: 100%"
            :disabled="activeBid !== undefined"
          >
            <el-option
              v-for="item in adsTypes"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="formData.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="formData.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="打开方式">
          <el-radio-group v-model="formData.target">
            <el-radio label="_blank">新窗口</el-radio>
            <el-radio label="_self">当前窗口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缩略图">
          <ImageUploader
            v-model="formData.simg"
            :thumb="true"
            @thumb-url="
              (url: string) => {
                if (!formData.wap_simg) formData.wap_simg = url
              }
            "
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.ord" :min="0" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.descs" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="详细内容">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="5"
            placeholder="请输入详细内容"
          />
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getAdminAds,
  getAdminAdsDetail,
  createAdminAds,
  updateAdminAds,
  deleteAdminAds,
  getAdminAdsTypes,
  type Ads,
  type AdsType,
} from '@/shared/api/ads'
import ImageUploader from '../../components/ImageUploader.vue'

const route = useRoute()

const listLoading = ref(false)
const list = ref<Ads[]>([])
const total = ref(0)
const adsTypes = ref<AdsType[]>([])

const listQuery = ref({
  page: 1,
  limit: 10,
  title: '',
  bid: undefined as number | undefined,
  sortBy: 'id_desc',
})

const activeBid = computed<number | undefined>(() => {
  const raw = route.params.bid
  if (!raw) return undefined
  const bid = Number(raw)
  return Number.isNaN(bid) ? undefined : bid
})

const currentAdsTypeTitle = computed(() => {
  if (activeBid.value === undefined) return ''
  const adsType = adsTypes.value.find((item) => item.id === activeBid.value)
  return adsType?.title || `广告位 ${activeBid.value}`
})

const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const formData = ref<Partial<Ads>>({
  title: '',
  subtitle: '',
  descs: '',
  bid: undefined,
  url: '',
  ord: 10,
  simg: '',
  simg2: '',
  wap_simg: '',
  content: '',
  target: '_blank',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
  bid: [{ required: true, message: '请选择广告位', trigger: 'change' }],
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const response = await getAdminAds(listQuery.value)
    list.value = response.items
    total.value = response.total
  } catch (error) {
    ElMessage.error('获取广告列表失败')
  } finally {
    listLoading.value = false
  }
}

const fetchAdsTypes = async () => {
  try {
    const res = await getAdminAdsTypes({ limit: 999 })
    adsTypes.value = (res.items as unknown as AdsType[]) || (res as unknown as AdsType[])
  } catch (error) {
    ElMessage.error('获取广告位列表失败')
  }
}

const getAdsTypeName = (bid: number) => {
  const adsType = adsTypes.value.find((item) => item.id === bid)
  return adsType ? adsType.title : '-'
}

const handleFilter = () => {
  listQuery.value.page = 1
  fetchList()
}

const handleSizeChange = (val: number) => {
  listQuery.value.limit = val
  fetchList()
}

const handleCurrentChange = (val: number) => {
  listQuery.value.page = val
  fetchList()
}

const handleCreate = () => {
  dialogType.value = 'create'
  formData.value = {
    title: '',
    subtitle: '',
    descs: '',
    bid: activeBid.value,
    url: '',
    ord: 10,
    simg: '',
    simg2: '',
    wap_simg: '',
    content: '',
    target: '_blank',
  }
  dialogVisible.value = true
}

const handleEdit = async (row: Ads) => {
  dialogType.value = 'edit'
  try {
    const data = await getAdminAdsDetail(row.id)
    formData.value = { ...data }
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取广告详情失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'create') {
          await createAdminAds(formData.value)
          ElMessage.success('创建成功')
        } else {
          await updateAdminAds(formData.value.id!, formData.value)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = (row: Ads) => {
  ElMessageBox.confirm('确定要删除这条广告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteAdminAds(row.id)
      ElMessage.success('删除成功')
      fetchList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  fetchAdsTypes().then(() => {
    if (activeBid.value !== undefined) {
      listQuery.value.bid = activeBid.value
    }
    fetchList()
  })
})

watch(
  () => route.params.bid,
  () => {
    listQuery.value.page = 1
    listQuery.value.bid = activeBid.value
    fetchList()
  },
)
</script>


<style scoped>
.app-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.filter-container {
  margin-bottom: 16px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
