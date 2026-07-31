<template>
  <div class="app-container">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="文章标题">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入文章标题"
            clearable
            @keyup.enter="handleQuery"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="栏目">
          <el-select
            v-model="queryParams.bid"
            placeholder="请选择栏目"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.title"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="已发布" :value="1" />
            <el-option label="草稿" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select
            v-model="queryParams.sortBy"
            placeholder="排序方式"
            clearable
            style="width: 150px"
          >
            <el-option label="最新创建" value="addtime_desc" />
            <el-option label="最早创建" value="addtime_asc" />
            <el-option label="浏览量高" value="hit_desc" />
            <el-option label="浏览量低" value="hit_asc" />
            <el-option label="排序号升序" value="ord_asc" />
            <el-option label="排序号降序" value="ord_desc" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table v-loading="loading" :data="articleList" border>
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="标题" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column label="作者" prop="author" width="120" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" prop="hit" width="100" align="center" />
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatDate(row.addtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="View" @click="handleView(row)"> 查看 </el-button>
            <el-button link type="primary" :icon="Edit" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button link type="danger" :icon="Delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="queryParams.page"
        :page-size="queryParams.limit"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="
          (size: number) => {
            queryParams.limit = size
            handlePageChange()
          }
        "
        @current-change="
          (page: number) => {
            queryParams.page = page
            handlePageChange()
          }
        "
      />
    </el-card>

    <!-- 文章表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      fullscreen
      @close="handleClose"
      class="article-edit-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="描述" prop="descs">
          <el-input v-model="form.descs" type="textarea" :rows="3" placeholder="请输入文章描述" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div class="wang-editor-container">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="editorMode"
              style="border-bottom: 1px solid #ccc"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              :mode="editorMode"
              style="height: 500px; overflow-y: hidden"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">已发布</el-radio>
            <el-radio :label="0">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="ord">
          <el-input-number v-model="form.ord" :min="0" :max="9999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 文章查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看文章"
      width="1200px"
      :close-on-click-modal="false"
    >
      <div class="article-view">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="文章ID">
            {{ viewArticle.id }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="viewArticle.status === 1 ? 'success' : 'info'">
              {{ viewArticle.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文章标题" :span="2">
            {{ viewArticle.title }}
          </el-descriptions-item>
          <el-descriptions-item label="作者">
            {{ viewArticle.author || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="来源">
            {{ viewArticle.source || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="浏览量">
            {{ viewArticle.hit || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="排序">
            {{ viewArticle.ord }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(viewArticle.addtime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(viewArticle.updatetime) }}
          </el-descriptions-item>
          <el-descriptions-item label="文章描述" :span="2">
            <div class="article-desc">
              {{ viewArticle.descs || '无描述' }}
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">文章内容</el-divider>
        <div class="article-content">
          <div v-if="viewArticle.content" v-html="sanitizedViewContent"></div>
          <div v-else class="no-content">暂无内容</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEditFromView">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete } from '@element-plus/icons-vue'
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
} from '@/shared/api/admin'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import DOMPurify from 'dompurify'
import { getToken } from '@/shared/utils/token'
import '@wangeditor/editor/dist/css/style.css'

// WangEditor 实例
const editorRef = shallowRef()
const editorMode = 'default' // 或 'simple'

const loading = ref(false)
const submitLoading = ref(false)
const articleList = ref<Record<string, unknown>[]>([])
const categories = ref<Record<string, unknown>[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref<FormInstance>()
const viewArticle = ref<Record<string, any>>({})
const sanitizedViewContent = computed(() =>
  viewArticle.value.content ? DOMPurify.sanitize(viewArticle.value.content) : '',
)

const queryParams = reactive<{
  page: number
  limit: number
  title: string
  status: number | undefined
  bid: number | undefined
  sortBy: string
}>({
  page: 1,
  limit: 10,
  title: '',
  status: undefined,
  bid: undefined,
  sortBy: 'addtime_desc',
})

const form = reactive({
  id: undefined,
  title: '',
  author: '',
  descs: '',
  content: '',
  status: 1,
  ord: 10,
  bid: 1,
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
})

// WangEditor 配置
const toolbarConfig = {
  excludeKeys: ['fullScreen'],
}

const editorConfig = {
  placeholder: '请输入文章内容...',
  MENU_CONF: {
    uploadImage: {
      server: '/v1/admin/upload',
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      headers: {
        Authorization: `Bearer ${getToken() || ''}`,
      },
      customInsert(res: any, insertFn: any) {
        if (res.code === 200 && res.data) {
          insertFn(res.data.url, res.data.filename || 'image', res.data.url)
        } else {
          ElMessage.error(res.message || '图片上传失败')
        }
      },
    },
    uploadVideo: {
      server: '/v1/admin/upload',
      fieldName: 'file',
      maxFileSize: 100 * 1024 * 1024, // 100MB
      headers: {
        Authorization: `Bearer ${getToken() || ''}`,
      },
      customInsert(res: any, insertFn: any) {
        if (res.code === 200 && res.data) {
          insertFn(res.data.url)
        } else {
          ElMessage.error(res.message || '视频上传失败')
        }
      },
    },
  },
}

// WangEditor 创建回调
const handleCreated = (editor: any) => {
  editorRef.value = editor
}

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

const fetchList = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: queryParams.page,
      limit: queryParams.limit,
    }
    if (queryParams.title) params.title = queryParams.title
    if (queryParams.status !== undefined) params.status = queryParams.status
    if (queryParams.bid) params.bid = queryParams.bid
    if (queryParams.sortBy) params.sortBy = queryParams.sortBy
    const result = await getArticles(params)
    articleList.value = result.items || []
    total.value = result.total || 0
  } catch (error: any) {
    ElMessage.error(error || '获取文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.page = 1
  fetchList()
}

const resetQuery = () => {
  queryParams.title = ''
  queryParams.status = undefined
  queryParams.bid = undefined
  queryParams.sortBy = 'addtime_desc'
  handleQuery()
}

const handlePageChange = () => {
  fetchList()
}

const handleCreate = () => {
  resetForm()
  dialogTitle.value = '新增文章'
  dialogVisible.value = true
}

const handleEdit = async (row: any) => {
  resetForm()
  try {
    // 调用详情接口获取完整数据（包括 content 字段）
    const articleDetail = await getArticle(row.id)
    Object.assign(form, articleDetail)
    dialogTitle.value = '编辑文章'
    dialogVisible.value = true
  } catch (error: any) {
    ElMessage.error(error || '获取文章详情失败')
  }
}

const handleView = async (row: any) => {
  try {
    // 获取文章详情
    const articleDetail = await getArticle(row.id)
    viewArticle.value = articleDetail
    viewDialogVisible.value = true
  } catch (error: any) {
    ElMessage.error(error || '获取文章详情失败')
  }
}

const handleEditFromView = () => {
  // 从查看对话框切换到编辑对话框
  viewDialogVisible.value = false
  resetForm()
  Object.assign(form, viewArticle.value)
  dialogTitle.value = '编辑文章'
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章"${row.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error || '删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (form.id) {
          await updateArticle(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await createArticle(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (error: any) {
        ElMessage.error(error || '操作失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
}

const resetForm = () => {
  form.id = undefined
  form.title = ''
  form.author = ''
  form.descs = ''
  form.content = ''
  form.status = 1
  form.ord = 10
  form.bid = 1
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

const fetchCategories = async () => {
  try {
    const result = await getCategories()
    categories.value = result.items || []
  } catch (error: any) {
    console.error('获取栏目列表失败:', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.mb8 {
  margin-bottom: 8px;
}

:deep(.el-pagination) {
  margin-top: 20px;
  justify-content: flex-end;
}

.article-view {
  max-height: 600px;
  overflow-y: auto;
}

.article-desc {
  max-height: 100px;
  overflow-y: auto;
  line-height: 1.5;
  color: #666;
}

.article-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fafafa;
  line-height: 1.6;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.no-content {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 40px 0;
}

/* WangEditor 样式 */
.wang-editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.wang-editor-container :deep(.w-e-toolbar) {
  background-color: #fafafa;
}

.wang-editor-container :deep(.w-e-text-container) {
  background-color: #fff;
}

.wang-editor-container :deep(.w-e-text-placeholder) {
  color: #c0c4cc;
}

/* 全屏编辑对话框优化 */
.article-edit-dialog :deep(.el-dialog__body) {
  padding: 20px 40px;
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.article-edit-dialog :deep(.el-form) {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
