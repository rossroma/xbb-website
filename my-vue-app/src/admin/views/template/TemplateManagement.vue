<template>
  <div class="template-management">
    <div class="page-header">
      <h2>模板管理</h2>
      <el-button type="primary" @click="showCreateDialog">新增模板</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索模板名称、描述"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="searchForm.type" placeholder="请选择" clearable style="width: 140px">
            <el-option label="单页模板" value="page" />
            <el-option label="列表模板" value="list" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadTemplates">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 模板列表 -->
    <el-table :data="templates" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="模板名称" min-width="150" />
      <el-table-column prop="template_name" label="模板标识" min-width="120" />
      <el-table-column prop="type_text" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'page' ? 'primary' : 'success'">
            {{ row.type_text }}
          </el-tag>
        </template>
      </el-table-column>
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
      <el-table-column prop="status_text" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="descs" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="360" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button type="warning" size="small" @click="openTemplateSettings(row)"
            >模板设置</el-button
          >
          <el-button type="info" size="small" @click="handlePreview(row)">预览</el-button>
          <el-button
            type="success"
            size="small"
            @click="handleApply(row)"
            :disabled="row.status !== 1"
            >应用</el-button
          >
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
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="90%"
      top="5vh"
      @close="resetForm"
    >
      <el-tabs v-model="activeEditTab">
        <el-tab-pane label="基本信息" name="base">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="模板名称" prop="title">
                  <el-input v-model="form.title" placeholder="请输入模板名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模板标识" prop="template_name">
                  <el-input v-model="form.template_name" placeholder="请输入模板标识" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="模板类型" prop="type">
                  <el-select v-model="form.type" placeholder="请选择模板类型" style="width: 100%">
                    <el-option label="单页模板" value="page" />
                    <el-option label="列表模板" value="list" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="模板地址">
              <el-input v-model="form.link" placeholder="请输入模板地址" />
            </el-form-item>
            <el-form-item label="缩略图">
              <ImageUploader v-model="form.simg" />
            </el-form-item>
            <el-form-item label="PC缩略图尺寸">
              <el-input v-model="form.remarks" placeholder="请输入PC缩略图尺寸" />
            </el-form-item>
            <el-form-item label="栏目备注">
              <el-input v-model="form.category_remarks" placeholder="请输入栏目备注" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="form.descs"
                type="textarea"
                :rows="3"
                placeholder="请输入模板描述"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="模板设置" name="settings">
          <div class="settings-layout">
            <div class="settings-help">
              <h3>模板变量示例</h3>
              <p>
                支持 Handlebars/Mustache 语法，例如
                <code>&#123;&#123;title&#125;&#125;</code>、
                <code>&#123;&#123;#each items&#125;&#125;...&#123;&#123;/each&#125;&#125;</code>。
              </p>
              <p v-if="!isEdit" class="settings-warning">请先保存基本信息，再编辑模板源码。</p>
              <div v-else class="sample-controls">
                <el-form label-width="86px" size="small">
                  <el-form-item label="示例模式">
                    <el-select v-model="sampleMode" style="width: 100%" @change="reloadSampleData">
                      <el-option label="全局(仅站点)" value="global" />
                      <el-option label="列表页(栏目+items)" value="list" />
                      <el-option label="详情页(栏目+article)" value="detail" />
                      <el-option label="单页(栏目内容)" value="page" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="选择栏目">
                    <el-select
                      v-model="sampleCategoryId"
                      clearable
                      filterable
                      style="width: 100%"
                      @change="reloadSampleData"
                    >
                      <el-option
                        v-for="c in categoriesForSample"
                        :key="c.id"
                        :label="c.title"
                        :value="c.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="reloadSampleData">刷新示例</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <pre>{{ JSON.stringify(settingsPreviewData, null, 2) }}</pre>
            </div>
            <div class="settings-editor">
              <CodeMirror
                v-model="templateContent"
                :basic="true"
                :lang="editorLang"
                :extensions="editorExtensions"
                :dark="true"
                :tab="true"
                :wrap="true"
                :disabled="!isEdit"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <template v-if="activeEditTab === 'base'">
            <el-button type="primary" @click="handleSubmit">保存基本信息</el-button>
          </template>
          <template v-else>
            <el-button
              :loading="settingsLoading"
              :disabled="!isEdit"
              @click="handleFormatTemplateContent"
              >格式化</el-button
            >
            <el-button
              type="primary"
              :loading="settingsLoading"
              :disabled="!isEdit"
              @click="handleSaveTemplateContent"
              >保存草稿</el-button
            >
            <el-button
              type="info"
              :loading="settingsLoading"
              :disabled="!isEdit"
              @click="handlePreviewTemplateContent"
              >预览</el-button
            >
            <el-button
              type="success"
              :loading="settingsLoading"
              :disabled="!isEdit"
              @click="handlePublishTemplate"
              >发布</el-button
            >
          </template>
        </span>
      </template>
    </el-dialog>

    <!-- 预览对话框 -->
    <TemplatePreviewDialog v-model:visible="previewVisible" :preview-data="previewData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CodeMirror from 'vue-codemirror6'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateContent,
  getTemplateSampleData,
  saveTemplateContent,
  previewTemplate,
  applyTemplate,
  publishTemplate,
} from '@/shared/api/template'
import ImageUploader from '../../components/ImageUploader.vue'
import TemplatePreviewDialog from './components/TemplatePreviewDialog.vue'
import { getCategories } from '@/shared/api/admin'

// 响应式数据
const loading = ref(false)
const templates = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const previewVisible = ref(false)
const settingsLoading = ref(false)
const activeEditTab = ref<'base' | 'settings'>('base')
const dialogTitle = ref('新增模板')
const isEdit = ref(false)
const editId = ref(0)
const previewData = ref<null | {
  id: number
  title: string
  content: string
  variables: Record<string, unknown>
}>(null)
const templateContent = ref('')
const editorLang = html()
const currentTemplateId = computed(() => (isEdit.value ? editId.value : 0))
const settingsPreviewData = reactive<Record<string, unknown>>({})
const categoriesForSample = ref<Array<{ id: number; title: string; english: string }>>([])
const sampleMode = ref<'global' | 'list' | 'detail' | 'page'>('page')
const sampleCategoryId = ref<number | undefined>(undefined)

const setDefaultSampleData = () => {
  Object.assign(settingsPreviewData, {
    title: '示例标题',
    description: '示例描述',
    site_name: '演示站点',
    items: [{ title: '示例列表项 1' }, { title: '示例列表项 2' }],
  })
}

setDefaultSampleData()

const fetchSampleCategories = async () => {
  try {
    const result = await getCategories({ limit: 9999, sortBy: 'ord_asc' })
    categoriesForSample.value = (result.items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      english: item.english,
    }))
  } catch {
    categoriesForSample.value = []
  }
}

const reloadSampleData = async () => {
  if (!isEdit.value || !currentTemplateId.value) {
    return
  }

  try {
    const sample = (await getTemplateSampleData(currentTemplateId.value, {
      mode: sampleMode.value,
      categoryId: sampleCategoryId.value,
    })) as unknown as {
      templateId: number
      data: Record<string, unknown>
    }
    if (sample?.data) {
      Object.keys(settingsPreviewData).forEach((key) => {
        delete (settingsPreviewData as Record<string, unknown>)[key]
      })
      Object.assign(settingsPreviewData, sample.data)
    }
  } catch (error) {
    console.error('加载示例数据失败:', error)
  }
}

const handleFormatTemplateContent = async () => {
  if (!isEdit.value || !currentTemplateId.value) {
    ElMessage.warning('请先保存基本信息，再格式化模板')
    return
  }

  if (!templateContent.value.trim()) {
    ElMessage.warning('模板内容为空，无需格式化')
    return
  }

  settingsLoading.value = true
  try {
    const prettier = await import('prettier/standalone')
    const htmlPlugin = await import('prettier/plugins/html')
    const plugin = (htmlPlugin as unknown as { default?: unknown }).default ?? htmlPlugin

    // 目标：更展开、可读性更强。
    // Prettier 的 `glimmer/handlebars` 在模板里偏“保持空白”，对一行压缩内容不会主动插入换行。
    // 这里采用占位符 + `html` parser 的方式做真正的 HTML 展开，然后再还原 Handlebars。
    const tokens: string[] = []
    const tokenPrefix = '__HB_EXPR_'
    const tokenSuffix = '__'

    const replaced = templateContent.value.replace(/{{{[\s\S]*?}}}|{{[\s\S]*?}}/g, (match) => {
      const index = tokens.length
      tokens.push(match)
      return `${tokenPrefix}${String(index).padStart(4, '0')}${tokenSuffix}`
    })

    const pretty = await prettier.format(replaced, {
      parser: 'html',
      plugins: [plugin],
      printWidth: 80,
      tabWidth: 2,
      htmlWhitespaceSensitivity: 'css',
      bracketSameLine: false,
      singleAttributePerLine: true,
    })

    const restored = pretty.replace(/__HB_EXPR_\d{4}__/g, (token) => {
      const index = Number(token.slice(tokenPrefix.length, token.length - tokenSuffix.length))
      return tokens[index] ?? token
    })

    templateContent.value = restored.trimEnd() + '\n'
    ElMessage.success('已格式化')
  } catch (error) {
    console.error('格式化失败:', error)
    ElMessage.error(String(error || '格式化失败'))
  } finally {
    settingsLoading.value = false
  }
}

const editorExtensions = [
  oneDark,
  keymap.of([
    {
      key: 'Mod-Shift-f',
      run: () => {
        void handleFormatTemplateContent()
        return true
      },
    },
  ]),
]

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: '',
  status: undefined as number | undefined,
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 表单数据
const form = reactive({
  title: '',
  template_name: '',
  type: 'page',
  status: 1,
  link: '',
  simg: '',
  remarks: '',
  category_remarks: '',
  attribute_type: '0,4,9,16',
  attribute: '',
  descs: '',
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
}

// 表单引用
const formRef = ref()

type TemplateRow = {
  id: number
  title: string
  template_name: string
  type: string
  type_text: string
  status: number
  status_text: string
  simg: string
  descs: string
  link: string
  remarks: string
  category_remarks: string
  attribute_type: string
  attribute: string
}

// 加载模板列表
const loadTemplates = async () => {
  loading.value = true
  try {
    const params: Record<string, string | number> = {
      page: pagination.page,
      limit: pagination.limit,
    }

    // 只添加非空的搜索参数
    if (searchForm.keyword) {
      params.keyword = searchForm.keyword
    }
    if (searchForm.type) {
      params.type = searchForm.type
    }
    if (searchForm.status !== undefined) {
      params.status = searchForm.status
    }

    const result = (await getTemplates(params)) as unknown as {
      items: TemplateRow[]
      total: number
    }
    templates.value = result.items || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('加载模板失败:', error)
    ElMessage.error('加载模板失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadTemplates()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadTemplates()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    keyword: '',
    type: '',
    status: undefined,
  })
  pagination.page = 1
  loadTemplates()
}

// 显示新增对话框
const showCreateDialog = () => {
  dialogTitle.value = '新增模板'
  isEdit.value = false
  activeEditTab.value = 'base'
  setDefaultSampleData()
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = async (row: {
  id: number
  title: string
  template_name: string
  type: string
  status: number
  link: string
  simg: string
  remarks: string
  category_remarks: string
  attribute_type: string
  attribute: string
  descs: string
}) => {
  dialogTitle.value = '编辑模板'
  isEdit.value = true
  editId.value = row.id
  activeEditTab.value = 'base'
  Object.assign(form, {
    title: row.title,
    template_name: row.template_name,
    type: row.type,
    status: row.status,
    link: row.link,
    simg: row.simg,
    remarks: row.remarks,
    category_remarks: row.category_remarks,
    attribute_type: row.attribute_type,
    attribute: row.attribute,
    descs: row.descs,
  })

  dialogVisible.value = true

  await fetchSampleCategories()

  if (row.template_name) {
    settingsLoading.value = true
    try {
      const result = (await getTemplateContent(row.id)) as unknown as {
        content: string
      }
      templateContent.value = result.content || ''

      sampleMode.value = row.type === 'list' ? 'list' : 'page'
      sampleCategoryId.value = undefined
      await reloadSampleData()
    } catch (error) {
      console.error('加载模板内容失败:', error)
      ElMessage.warning('已进入编辑页，但模板源码加载失败')
    } finally {
      settingsLoading.value = false
    }
  } else {
    templateContent.value = ''
    setDefaultSampleData()
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    title: '',
    template_name: '',
    type: 'page',
    status: 1,
    link: '',
    simg: '',
    remarks: '',
    category_remarks: '',
    attribute_type: '0,4,9,16',
    attribute: '',
    descs: '',
  })
  activeEditTab.value = 'base'
  templateContent.value = ''
  formRef.value?.resetFields()
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()

    if (isEdit.value) {
      await updateTemplate(editId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createTemplate(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadTemplates()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

const openTemplateSettings = async (row: TemplateRow) => {
  await showEditDialog(row)
  activeEditTab.value = 'settings'
}

const handleSaveTemplateContent = async () => {
  if (!isEdit.value || !currentTemplateId.value) {
    ElMessage.warning('请先保存基本信息，再保存模板源码')
    return
  }

  settingsLoading.value = true
  try {
    await saveTemplateContent(currentTemplateId.value, templateContent.value)
    ElMessage.success('模板草稿保存成功')
  } catch (error) {
    console.error('保存模板失败:', error)
    ElMessage.error(String(error || '保存模板失败'))
  } finally {
    settingsLoading.value = false
  }
}

const handlePreviewTemplateContent = async () => {
  if (!isEdit.value || !currentTemplateId.value) {
    ElMessage.warning('请先保存基本信息，再预览模板')
    return
  }

  settingsLoading.value = true
  try {
    const result = (await previewTemplate(currentTemplateId.value, {
      content: templateContent.value,
      data: settingsPreviewData,
    })) as unknown as {
      id: number
      title: string
      content: string
      variables: Record<string, unknown>
    }

    previewData.value = result
    previewVisible.value = true
  } catch (error) {
    console.error('预览模板失败:', error)
    ElMessage.error(String(error || '预览模板失败'))
  } finally {
    settingsLoading.value = false
  }
}

const handlePublishTemplate = async () => {
  if (!isEdit.value || !currentTemplateId.value) {
    ElMessage.warning('请先保存基本信息，再发布模板')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要发布模板"${form.title || ''}"吗？`, '确认发布', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('发布已取消')
    }
    return
  }

  settingsLoading.value = true
  try {
    const result = (await publishTemplate(currentTemplateId.value)) as unknown as {
      published: boolean
      message: string
    }
    if (result.published) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
    loadTemplates()
  } catch (error) {
    console.error('发布模板失败:', error)
    ElMessage.error(String(error || '发布模板失败'))
  } finally {
    settingsLoading.value = false
  }
}

// 预览模板
const handlePreview = async (row: { id: number; title: string }) => {
  try {
    const result = (await previewTemplate(row.id)) as unknown as {
      id: number
      title: string
      content: string
      variables: Record<string, unknown>
    }
    previewData.value = result
    previewVisible.value = true
  } catch (error) {
    console.error('预览失败:', error)
    ElMessage.error('预览失败')
  }
}

// 应用模板
const handleApply = async (row: { id: number; title: string }) => {
  try {
    await ElMessageBox.confirm(`确定要应用模板"${row.title}"吗？`, '确认应用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const result = (await applyTemplate(row.id)) as unknown as {
      applied: boolean
      message: string
    }

    if (result.applied) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('应用失败:', error)
      ElMessage.error('应用失败')
    }
  }
}

// 删除模板
const handleDelete = async (row: { id: number; title: string }) => {
  try {
    await ElMessageBox.confirm(`确定要删除模板"${row.title}"吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteTemplate(row.id)
    ElMessage.success('删除成功')
    loadTemplates()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.template-management {
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
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}

.settings-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
}

.settings-help {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 12px;
}

.settings-warning {
  color: #c0392b;
  margin: 8px 0;
}

.settings-help pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  max-height: 420px;
  overflow-y: auto;
}

.sample-controls {
  margin: 10px 0;
  padding: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.settings-editor {
  min-height: 420px;
}

.settings-editor :deep(.cm-editor) {
  min-height: 420px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.settings-editor :deep(.cm-scroller) {
  min-height: 420px;
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
}
</style>
