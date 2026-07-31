<template>
  <div class="content-edit">
    <div class="page-header">
      <div class="header-left">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <h2>{{ isEdit ? '编辑文章' : '新增文章' }} - {{ categoryTitle }}</h2>
      </div>
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" v-loading="loading">
      <el-tabs v-model="activeTab" class="edit-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="tab-content">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入标题（1-60个字符）"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="所属分类" prop="bid">
              <el-select v-model="form.bid" placeholder="请选择分类" style="width: 360px">
                <el-option
                  v-for="item in flatCategoryOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="权重">
              <el-input-number v-model="form.ord" :min="0" :max="999" />
              <span class="form-tip">越小越靠前</span>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="1">显示</el-radio>
                <el-radio :value="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="详细内容">
              <div class="wang-editor-container">
                <Toolbar
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  mode="default"
                  style="border-bottom: 1px solid #ccc"
                />
                <Editor
                  v-model="form.content"
                  :defaultConfig="editorConfig"
                  mode="default"
                  style="height: 450px; overflow-y: hidden"
                  @onCreated="handleEditorCreated"
                />
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- SEO设置 -->
        <el-tab-pane label="SEO设置" name="seo">
          <div class="tab-content">
            <el-form-item label="SEO标题">
              <el-input
                v-model="form.seoTitle"
                placeholder="标题长度10-180个字符"
                maxlength="180"
                show-word-limit
              />
              <div class="seo-tip">标题最好包含有关键词或分类名称，长度建议20-30个字符以内。</div>
            </el-form-item>
            <el-form-item label="SEO关键词">
              <el-input
                v-model="form.seoKeyword"
                type="textarea"
                :rows="4"
                placeholder="请输入SEO关键词"
                maxlength="200"
                show-word-limit
              />
              <div class="seo-tip">
                关键词最好有出现在标题、描述和内容中，标题关键词最佳包含1-3个。
              </div>
            </el-form-item>
            <el-form-item label="SEO描述">
              <el-input
                v-model="form.setDescription"
                type="textarea"
                :rows="4"
                placeholder="描述长度50-400个字符"
                maxlength="400"
                show-word-limit
              />
              <div class="seo-tip">描述尽可能突出内容，最好包含关键词和分类名称。</div>
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- 高级信息 -->
        <el-tab-pane label="高级信息" name="advanced">
          <div class="tab-content">
            <el-form-item label="英文标题">
              <el-input v-model="form.title_en" placeholder="请输入英文标题" style="width: 400px" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="form.subtitle" placeholder="请输入副标题" style="width: 400px" />
            </el-form-item>
            <el-form-item label="信息描述">
              <el-input
                v-model="form.descs"
                type="textarea"
                :rows="4"
                placeholder="描述长度，如需换行，可用 &lt;br&gt; 标签"
                maxlength="300"
                show-word-limit
                style="width: 500px"
              />
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="请输入作者" style="width: 200px" />
            </el-form-item>
            <el-form-item label="来源">
              <el-input v-model="form.source" placeholder="请输入来源" style="width: 200px" />
            </el-form-item>
            <el-form-item label="访问量">
              <el-input-number v-model="form.hit" :min="0" style="width: 150px" />
            </el-form-item>
            <el-form-item label="缩略图">
              <div class="simg-upload">
                <el-input v-model="form.simg" placeholder="图片路径" style="width: 350px" />
                <el-upload
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :on-success="handleImgUpload"
                  :on-error="handleImgError"
                  accept="image/*"
                >
                  <el-button type="success" style="margin-left: 8px">上传图片</el-button>
                </el-upload>
                <span class="form-tip">建议尺寸: 380×239 像素</span>
              </div>
              <div v-if="form.simg" class="simg-preview">
                <el-image
                  :src="form.simg"
                  style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px"
                  fit="cover"
                />
              </div>
            </el-form-item>
            <el-form-item label="推荐类型">
              <el-checkbox v-model="isRecommended">推荐</el-checkbox>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker
                v-model="publishTime"
                type="datetime"
                placeholder="选择发布时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 220px"
              />
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { getAdminCategories } from '@/shared/api/category'
import request from '@/shared/api/request'
import { getToken } from '@/shared/utils/token'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const activeTab = ref('basic')
const formRef = ref()
const editorRef = shallowRef()
const allCategories = ref<any[]>([])

const currentBid = computed(() => parseInt(route.params.bid as string))
const articleId = computed(() =>
  route.params.id ? parseInt(route.params.id as string) : undefined,
)
const isEdit = computed(() => !!articleId.value)

const categoryTitle = computed(() => {
  const cat = allCategories.value.find((c) => c.id === currentBid.value)
  return cat?.title || ''
})

const buildCategoryTree = (items: any[], pid: number): any[] => {
  return items
    .filter((c) => c.pid === pid)
    .map((c) => ({ ...c, children: buildCategoryTree(items, c.id) }))
}

const flattenTree = (nodes: any[], level: number): any[] => {
  const result: any[] = []
  for (const node of nodes) {
    const prefix = level === 1 ? '|--- ' : '　'.repeat(level - 1) + '[' + level + '级]'
    result.push({
      id: node.id,
      label:
        level === 1 ? `|--- ${node.title}` : `${'　'.repeat(level - 2)}[${level}级]${node.title}`,
      disabled: node.status === 0,
      isGroup: false,
    })
    if (node.children?.length) {
      result.push(...flattenTree(node.children, level + 1))
    }
  }
  return result
}

const flatCategoryOptions = computed(() => {
  const rootCat = allCategories.value.find((c) => c.id === currentBid.value)
  if (!rootCat) return []
  const children = buildCategoryTree(allCategories.value, currentBid.value)
  return [
    { id: -currentBid.value, label: `--- ${rootCat.title}`, disabled: true },
    { id: currentBid.value, label: rootCat.title, disabled: false },
    ...flattenTree(children, 2),
  ]
})

const form = reactive({
  title: '',
  bid: undefined as number | undefined,
  ord: 10,
  status: 1,
  content: '',
  seoTitle: '',
  seoKeyword: '',
  setDescription: '',
  title_en: '',
  subtitle: '',
  descs: '',
  author: '',
  source: '',
  hit: 0,
  simg: '',
  flag: '',
  addtime: undefined as number | undefined,
})

const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  bid: [{ required: true, message: '请选择分类', trigger: 'change' }],
}

const isRecommended = computed({
  get: () => (form.flag || '').includes('1'),
  set: (val) => {
    form.flag = val ? '1' : ''
  },
})

const publishTime = computed({
  get: () => {
    if (!form.addtime) return ''
    return new Date(form.addtime * 1000).toLocaleString('sv-SE').replace(' ', 'T').replace('T', ' ')
  },
  set: (val) => {
    form.addtime = val ? Math.floor(new Date(val).getTime() / 1000) : undefined
  },
})

const uploadUrl = '/v1/admin/upload'
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${getToken() || ''}`,
}))

const toolbarConfig = { excludeKeys: ['fullScreen'] }
const editorConfig = {
  placeholder: '请输入详细内容...',
  MENU_CONF: {
    uploadImage: {
      server: uploadUrl,
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024,
      headers: { Authorization: `Bearer ${getToken() || ''}` },
      customInsert(res: any, insertFn: any) {
        if (res.code === 200 && res.data)
          insertFn(res.data.url, res.data.filename || 'image', res.data.url)
        else ElMessage.error(res.message || '图片上传失败')
      },
    },
  },
}

const handleEditorCreated = (editor: any) => {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})

const handleImgUpload = (res: any) => {
  if (res.code === 200 && res.data) {
    form.simg = res.data.url
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

const handleImgError = () => ElMessage.error('图片上传失败')

const loadCategories = async () => {
  try {
    const result = await getAdminCategories({ limit: 999 })
    allCategories.value = result?.items || []
  } catch {}
}

const loadArticle = async () => {
  if (!articleId.value) return
  loading.value = true
  try {
    const data = (await request.get(`/v1/admin/articles/${articleId.value}`)) as Record<
      string,
      unknown
    >
    Object.assign(form, {
      title: data.title || '',
      bid: data.bid,
      ord: data.ord ?? 10,
      status: data.status ?? 1,
      content: data.content || '',
      seoTitle: data.seoTitle || '',
      seoKeyword: data.seoKeyword || '',
      setDescription: data.setDescription || '',
      title_en: data.title_en || '',
      subtitle: data.subtitle || '',
      descs: data.descs || '',
      author: data.author || '',
      source: data.source || '',
      hit: data.hit || 0,
      simg: data.simg || '',
      flag: data.flag || '',
      addtime: data.addtime,
    })
  } catch {
    ElMessage.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true
    const payload = { ...form }
    if (isEdit.value) {
      await request.patch(`/v1/admin/articles/${articleId.value}`, payload)
      ElMessage.success('更新成功')
    } else {
      await request.post('/v1/admin/articles', payload)
      ElMessage.success('创建成功')
    }
    goBack()
  } catch (err) {
    if (err !== false) ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const handleReset = async () => {
  if (isEdit.value) {
    await loadArticle()
  } else {
    formRef.value?.resetFields()
    form.content = ''
    form.bid = currentBid.value
  }
}

const goBack = () => router.push(`/admin/content/${currentBid.value}`)

onMounted(async () => {
  await loadCategories()
  if (isEdit.value) {
    await loadArticle()
  } else {
    form.bid = currentBid.value
    form.addtime = Math.floor(Date.now() / 1000)
  }
})
</script>

<style scoped>
.content-edit {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.edit-tabs {
  background: #fff;
  border-radius: 4px;
}

.tab-content {
  padding: 20px 0;
  max-width: 900px;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
}

.seo-tip {
  margin-top: 4px;
  color: #e6a23c;
  font-size: 12px;
  background: #fdf6ec;
  padding: 4px 8px;
  border-radius: 3px;
}

.wang-editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 100%;
}

.simg-upload {
  display: flex;
  align-items: center;
  gap: 4px;
}

.simg-preview {
  margin-top: 8px;
}
</style>
