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
      <el-table-column :label="isBannerCtx ? '背景图' : '缩略图'" align="center" width="120">
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
      <el-table-column :label="isBannerCtx ? '前景媒体' : '缩略图2'" align="center" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.simg2 && !isVideoUrl(row.simg2)"
            :src="row.simg2"
            :preview-src-list="[row.simg2]"
            fit="cover"
            style="width: 80px; height: 60px"
            preview-teleported
            :z-index="9999"
          />
          <el-tag v-else-if="isVideoUrl(row.simg2)" type="success" size="small">视频</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column :label="isBannerCtx ? '主标题' : '广告名称'" prop="title" min-width="150" />
      <el-table-column label="广告位" align="center" width="120">
        <template #default="{ row }">
          {{ getAdsTypeName(row.bid) }}
        </template>
      </el-table-column>
      <el-table-column :label="isBannerCtx ? '跳转链接' : '链接地址'" prop="url" min-width="200" show-overflow-tooltip />
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
        <el-form-item :label="fieldLabel('title', '广告名称')" prop="title">
          <el-input v-model="formData.title" :placeholder="fieldPlaceholder('title', '请输入广告名称')" />
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
        <el-form-item :label="fieldLabel('subtitle', '副标题')">
          <el-input v-model="formData.subtitle" :placeholder="fieldPlaceholder('subtitle', '请输入副标题')" />
        </el-form-item>
        <el-form-item :label="fieldLabel('url', '链接地址')">
          <el-input v-model="formData.url" :placeholder="fieldPlaceholder('url', '请输入链接地址')" />
        </el-form-item>
        <el-form-item :label="fieldLabel('target', '打开方式')">
          <el-radio-group v-model="formData.target">
            <el-radio label="_blank">新窗口</el-radio>
            <el-radio label="_self">当前窗口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="fieldLabel('simg', '缩略图')">
          <ImageUploader v-model="formData.simg" :thumb="true" />
        </el-form-item>
        <el-form-item :label="fieldLabel('simg2', '缩略图2')">
          <ImageUploader v-model="formData.simg2" :thumb="true" />
        </el-form-item>
        <el-form-item :label="fieldLabel('wap_simg', '手机缩略图')">
          <ImageUploader v-model="formData.wap_simg" :thumb="true" />
        </el-form-item>
        <el-form-item v-if="!isHomeBanner" :label="fieldLabel('width_height', '图片尺寸')">
          <el-input v-model="formData.width_height" placeholder="例如: 1920x500" />
        </el-form-item>
        <el-form-item :label="fieldLabel('content', '详细内容')">
          <el-input v-model="formData.content" :placeholder="fieldPlaceholder('content', '')" />
        </el-form-item>
        <el-form-item :label="fieldLabel('download', '上传资料')">
          <el-input v-model="formData.download" :placeholder="fieldPlaceholder('download', '')" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.ord" :min="0" />
        </el-form-item>
        <el-form-item :label="fieldLabel('descs', '描述')">
          <el-input v-model="formData.descs" type="textarea" :rows="3" :placeholder="fieldPlaceholder('descs', '请输入描述')" />
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
  width_height: '',
  download: '',
  content: '',
  target: '_blank',
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
  bid: [{ required: true, message: '请选择广告位', trigger: 'change' }],
}

/** 首页 Banner 轮播的广告位 ID */
const HOME_BANNER_BID = 1

/** 当前是否为首页 Banner 轮播广告位 */
const isHomeBanner = computed(() => formData.value.bid === HOME_BANNER_BID)

/** 列表页面当前是否在浏览首页 Banner 广告位 */
const isBannerCtx = computed(() => (listQuery.value.bid ?? activeBid.value) === HOME_BANNER_BID)

/** 判断 URL 是否为视频 */
function isVideoUrl(url?: string): boolean {
  if (!url) return false
  const match = url.match(/\.([a-z0-9]+)(?:\?|#|$)/i)
  if (!match) return false
  return ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(`.${match[1]!.toLowerCase()}`)
}

/**
 * 首页 Banner 轮播(bid=1) 专用字段标签映射
 * 其他广告位保持通用名称
 */
const HOME_BANNER_LABELS: Record<string, string> = {
  title: '主标题',
  subtitle: '副标题',
  descs: '描述',
  simg: '背景图',
  simg2: '前景图/视频',
  content: '主按钮文字',
  download: '次按钮文字',
  url: '跳转链接',
  target: '打开方式',
}

const HOME_BANNER_PLACEHOLDERS: Record<string, string> = {
  title: '请输入主标题',
  subtitle: '请输入副标题',
  descs: '请输入描述文字',
  simg: '背景图 URL，留空使用默认渐变',
  simg2: '支持图片(.jpg/.png) 或视频(.mp4/.webm)，自动识别',
  content: '主按钮显示文字',
  download: '次按钮显示文字，留空不显示次按钮',
  url: '点击整个 Banner 跳转的链接',
  target: '链接打开方式',
}

function fieldLabel(field: string, fallback: string): string {
  return isHomeBanner.value ? (HOME_BANNER_LABELS[field] ?? fallback) : fallback
}

function fieldPlaceholder(field: string, fallback: string): string {
  return isHomeBanner.value ? (HOME_BANNER_PLACEHOLDERS[field] ?? fallback) : fallback
}

const fetchList = async () => {
  listLoading.value = true
  try {
    const response = await getAdminAds(listQuery.value)
    list.value = response.items
    total.value = response.total
  } finally {
    listLoading.value = false
  }
}

const fetchAdsTypes = async () => {
  const res = await getAdminAdsTypes({ limit: 999 })
  adsTypes.value = (res.items as unknown as AdsType[]) || (res as unknown as AdsType[])
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
    width_height: '',
    download: '',
    content: '',
    target: '_blank',
  }
  dialogVisible.value = true
}

const handleEdit = async (row: Ads) => {
  dialogType.value = 'edit'
  const data = await getAdminAdsDetail(row.id)
  formData.value = { ...data }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (dialogType.value === 'create') {
        await createAdminAds(formData.value)
        ElMessage.success('创建成功')
      } else {
        await updateAdminAds(formData.value.id!, formData.value)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchList()
    }
  })
}

const handleDelete = (row: Ads) => {
  ElMessageBox.confirm('确定要删除这条广告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteAdminAds(row.id)
    ElMessage.success('删除成功')
    fetchList()
  }).catch(() => {})
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
