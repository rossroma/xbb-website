<template>
  <div class="app-container">
    <el-card class="category-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus" @click="handleCreate(0)">新增根栏目</el-button>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索栏目名称、英文名称..."
            clearable
            style="width: 280px"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
        <div class="toolbar-right">共 {{ flatList.length }} 个栏目</div>
      </div>

      <el-table v-loading="loading" :data="flatList" border row-key="id">
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="栏目名称" min-width="280">
          <template #default="{ row }">
            <span :style="{ paddingLeft: (row._level - 1) * 20 + 'px' }" class="level-title">
              <span class="level-badge" :class="`level-${Math.min(row._level, 4)}`"
                >[{{ row._level }}级]</span
              >
              {{ row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" prop="english" width="180" />
        <el-table-column label="权重" prop="ord" width="90" align="center" />
        <el-table-column label="类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 'list' ? 'primary' : 'warning'" size="small">
              {{ row.type === 'list' ? '列表类型' : '单页类型' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-icon :color="row.status === 1 ? '#67c23a' : '#f56c6c'" size="18">
              <Check v-if="row.status === 1" />
              <Close v-else />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.is_lower === 1"
              type="success"
              size="small"
              @click="handleCreate(row.id)"
              >添加</el-button
            >
            <el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
            <el-button
              v-if="row.is_delete === 1"
              type="danger"
              size="small"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1100px"
      top="4vh"
      @close="handleClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="category-form">
        <el-tabs v-model="activeEditTab" class="edit-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <div class="tab-grid two-col">
              <el-form-item label="栏目名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入栏目名称" />
              </el-form-item>
              <el-form-item label="别名" prop="english">
                <div class="slug-field">
                  <el-input v-model="form.english" placeholder="请输入访问别名" />
                  <el-button @click="generateSlug">生成别名</el-button>
                </div>
              </el-form-item>
              <el-form-item label="上级栏目">
                <el-select
                  v-model="form.pid"
                  placeholder="不选则为根栏目"
                  clearable
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in parentOptions"
                    :key="item.id"
                    :label="`${'　'.repeat((item._level ?? 1) - 1)}[${item._level ?? 1}级] ${item.title}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="form.ord" :min="0" :max="9999" style="width: 100%" />
              </el-form-item>
              <el-form-item label="栏目副标题">
                <el-input v-model="form.subtitle" placeholder="请输入栏目副标题" />
              </el-form-item>
            </div>
            <el-form-item label="详细内容">
              <div class="editor-wrap">
                <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
                <Editor
                  v-model="form.content"
                  :defaultConfig="editorConfig"
                  mode="default"
                  style="height: 320px"
                  @onCreated="handleEditorCreated"
                />
              </div>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="SEO设置" name="seo">
            <div class="tab-grid one-col">
              <el-form-item label="SEO标题">
                <el-input
                  v-model="form.seoTitle"
                  maxlength="180"
                  show-word-limit
                  placeholder="建议包含栏目名称或核心关键词"
                />
                <div class="field-hint">建议 20-30 个字符内，长度上限 180。</div>
              </el-form-item>
              <el-form-item label="SEO关键词">
                <el-input
                  v-model="form.seoKeyword"
                  type="textarea"
                  :rows="4"
                  placeholder="多个关键词请用逗号分隔"
                />
              </el-form-item>
              <el-form-item label="SEO描述">
                <el-input
                  v-model="form.setDescription"
                  type="textarea"
                  :rows="5"
                  placeholder="概括栏目内容，避免堆砌关键词"
                />
                <div class="field-hint">描述尽量与栏目内容一致，可读性优先。</div>
              </el-form-item>
            </div>
          </el-tab-pane>

          <el-tab-pane label="高级信息" name="advanced">
            <div class="tab-grid two-col">
              <el-form-item label="分页数量">
                <el-input-number v-model="form.pagesize" :min="1" :max="999" style="width: 100%" />
              </el-form-item>
              <el-form-item label="栏目状态">
                <el-select v-model.number="form.status" style="width: 100%">
                  <el-option label="启用" :value="1" />
                  <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="允许添加下级">
                <el-switch v-model="form.is_lower" :active-value="1" :inactive-value="0" />
              </el-form-item>
              <el-form-item label="允许删除">
                <el-switch v-model="form.is_delete" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </div>
            <div class="image-grid">
              <el-form-item label="缩略图">
                <ImageUploader v-model="form.simg" />
              </el-form-item>
              <el-form-item label="PC Banner">
                <ImageUploader v-model="form.banner" />
              </el-form-item>
              <el-form-item label="手机 Banner">
                <ImageUploader v-model="form.wap_banner" />
              </el-form-item>
            </div>
            <el-form-item label="信息描述">
              <el-input
                v-model="form.descs"
                type="textarea"
                :rows="5"
                placeholder="用于前台摘要或栏目说明"
              />
            </el-form-item>
            <el-form-item label="补充内容">
              <el-input
                v-model="form.content2"
                type="textarea"
                :rows="4"
                placeholder="可用于扩展说明或备用内容"
              />
            </el-form-item>
          </el-tab-pane>

          </el-tabs>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Check, Close, Plus } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import ImageUploader from '@/admin/components/ImageUploader.vue'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/shared/api/admin'

interface CategoryItem {
  id: number
  pid: number
  title: string
  english: string
  title_en?: string
  subtitle?: string
  ord: number
  type: string
  pagesize?: number
  link?: string
  link_out?: string
  seoTitle?: string
  seoKeyword?: string
  setDescription?: string
  simg?: string
  banner?: string
  wap_banner?: string
  descs?: string
  content?: string
  content2?: string
  status: number
  is_nav: number
  is_lower: number
  is_delete: number
  _children?: CategoryItem[]
  _level?: number
}


const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const searchKeyword = ref('')
const activeEditTab = ref('basic')
const allCategories = ref<CategoryItem[]>([])
const formRef = ref<FormInstance>()
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入栏目详细内容...' }

const form = reactive({
  id: undefined as number | undefined,
  pid: 0,
  title: '',
  english: '',
  subtitle: '',
  ord: 10,
  pagesize: 10,
  seoTitle: '',
  seoKeyword: '',
  setDescription: '',
  simg: '',
  banner: '',
  wap_banner: '',
  descs: '',
  content: '',
  content2: '',
  status: 1,
  is_lower: 0,
  is_delete: 1,
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
  english: [{ required: true, message: '请输入栏目别名', trigger: 'blur' }],
})

const buildFlatTree = (items: CategoryItem[], keyword = ''): CategoryItem[] => {
  const map = new Map<number, CategoryItem>()
  items.forEach((item) => map.set(item.id, { ...item, _children: [] }))

  const roots: CategoryItem[] = []
  map.forEach((item) => {
    if (item.pid === 0 || !map.has(item.pid)) roots.push(item)
    else map.get(item.pid)!._children!.push(item)
  })

  const result: CategoryItem[] = []
  const traverse = (nodes: CategoryItem[], level: number) => {
    nodes.sort((a, b) => a.ord - b.ord || a.id - b.id)
    nodes.forEach((node) => {
      node._level = level
      if (!keyword || node.title.includes(keyword) || node.english.includes(keyword))
        result.push(node)
      if (node._children?.length) traverse(node._children, level + 1)
    })
  }
  traverse(roots, 1)
  return result
}

const flatList = computed(() => buildFlatTree(allCategories.value, searchKeyword.value.trim()))

const parentOptions = computed(() =>
  buildFlatTree(allCategories.value).filter((item) => item.id !== form.id),
)

const generateSlug = () => {
  form.english =
    form.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[\u4e00-\u9fa5]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || form.english
}

const handleEditorCreated = (editor: any) => {
  editorRef.value = editor
}

const fetchList = async () => {
  loading.value = true
  try {
    const result = await getCategories({ limit: 9999, sortBy: 'ord_asc' })
    allCategories.value = (result.items as unknown as CategoryItem[]) || []
  } catch {
    ElMessage.error('获取栏目列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchKeyword.value = searchKeyword.value.trim()
}

const handleReset = () => {
  searchKeyword.value = ''
}

const resetForm = () => {
  form.id = undefined
  form.pid = 0
  form.title = ''
  form.english = ''
  form.subtitle = ''
  form.ord = 10
  form.pagesize = 10
  form.seoTitle = ''
  form.seoKeyword = ''
  form.setDescription = ''
  form.simg = ''
  form.banner = ''
  form.wap_banner = ''
  form.descs = ''
  form.content = ''
  form.content2 = ''
  form.status = 1
  form.is_lower = 0
  form.is_delete = 1
  activeEditTab.value = 'basic'
}

const handleCreate = (pid: number) => {
  resetForm()
  form.pid = pid
  dialogTitle.value = pid === 0 ? '新增根栏目' : '新增子栏目'
  dialogVisible.value = true
}

const handleEdit = (row: CategoryItem) => {
  resetForm()
  Object.assign(form, {
    id: row.id,
    pid: row.pid,
    title: row.title || '',
    english: row.english || '',
    subtitle: row.subtitle || '',
    ord: row.ord ?? 10,
    pagesize: row.pagesize ?? 10,
    seoTitle: row.seoTitle || '',
    seoKeyword: row.seoKeyword || '',
    setDescription: row.setDescription || '',
    simg: row.simg || '',
    banner: row.banner || '',
    wap_banner: row.wap_banner || '',
    descs: row.descs || '',
    content: row.content || '',
    content2: row.content2 || '',
    status: row.status ?? 1,
    is_lower: row.is_lower ?? 0,
    is_delete: row.is_delete ?? 1,
  })
  dialogTitle.value = '编辑栏目'
  dialogVisible.value = true
}

const handleDelete = async (row: CategoryItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除栏目“${row.title}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e || '删除失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      const payload = { ...form }
      if (payload.id) {
        await updateCategory(payload.id, payload)
        ElMessage.success('更新成功')
      } else {
        await createCategory(payload)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      fetchList()
    } catch (e: any) {
      ElMessage.error(e || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  activeEditTab.value = 'basic'
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.category-card {
  border-radius: 14px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar-right {
  color: #909399;
  font-size: 13px;
}

.level-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.level-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
}

.level-1 {
  color: #409eff;
  background: #ecf5ff;
}
.level-2 {
  color: #e6a23c;
  background: #fdf6ec;
}
.level-3 {
  color: #67c23a;
  background: #f0f9eb;
}
.level-4 {
  color: #909399;
  background: #f4f4f5;
}

.category-form {
  margin-top: -8px;
}

.edit-tabs :deep(.el-tabs__content) {
  padding-top: 12px;
}

.tab-grid {
  display: grid;
  gap: 12px 18px;
}

.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.one-col {
  grid-template-columns: minmax(0, 1fr);
}

.slug-field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  width: 100%;
}

.field-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.block-hint {
  margin-top: 4px;
}

.editor-wrap {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.editor-wrap :deep(.w-e-toolbar) {
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 18px;
}

@media (max-width: 960px) {
  .two-col,
  .image-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
