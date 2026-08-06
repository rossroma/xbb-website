<template>
  <div class="settings-container">
    <el-card class="box-card">
      <template #header>
        <span>系统设置</span>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="base">
          <el-form :model="baseForm" label-width="120px">
            <el-form-item label="公司名称">
              <el-input v-model="baseForm.company" placeholder="请输入公司名称" />
            </el-form-item>
            <el-form-item label="PC LOGO">
              <ImageUploader v-model="baseForm.logo" />
              <div class="field-hint">建议尺寸：212×50 像素</div>
            </el-form-item>
            <el-form-item label="手机站 LOGO">
              <ImageUploader v-model="baseForm.wap_logo" />
              <div class="field-hint">建议尺寸：212×50 像素</div>
            </el-form-item>
            <el-form-item label="ICO 图标">
              <ImageUploader v-model="baseForm.ico_logo" />
              <div class="field-hint">建议尺寸：16×16 或 32×32 像素，.ico 格式</div>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="baseForm.tel" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model="baseForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="电子邮箱">
              <el-input v-model="baseForm.email" placeholder="请输入电子邮箱" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="baseForm.address" placeholder="请输入公司地址" />
            </el-form-item>
            <el-form-item label="传真">
              <el-input v-model="baseForm.fax" placeholder="请输入传真" />
            </el-form-item>
            <el-form-item label="邮编">
              <el-input v-model="baseForm.postcode" placeholder="请输入邮编" />
            </el-form-item>
            <el-form-item label="底部版权信息">
              <el-input
                v-model="baseForm.content2"
                type="textarea"
                :rows="5"
                placeholder="请输入底部版权信息，支持 HTML 标签（如 &lt;a&gt;）"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- SEO 设置 -->
        <el-tab-pane label="SEO 设置" name="seo">
          <el-form :model="baseForm" label-width="120px">
            <el-form-item label="网站标题">
              <el-input v-model="baseForm.title" placeholder="请输入网站标题" />
            </el-form-item>
            <el-form-item label="关键词">
              <el-input
                v-model="baseForm.keyword"
                type="textarea"
                :rows="4"
                placeholder="请输入关键词，多个用逗号分隔"
              />
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input
                v-model="baseForm.descs"
                type="textarea"
                :rows="4"
                placeholder="请输入网站描述"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 统计代码 -->
        <el-tab-pane label="统计代码" name="analytics">
          <el-form :model="baseForm" label-width="150px">
            <el-form-item label="头部代码 [head]">
              <el-input
                v-model="baseForm.toolscode_top"
                type="textarea"
                :rows="8"
                placeholder="粘贴统计代码到此处，将插入到 <head> 标签内"
                style="font-family: monospace; font-size: 13px"
              />
              <div class="field-hint">适用于百度统计、Google Analytics 等头部脚本</div>
            </el-form-item>
            <el-form-item label="底部代码 [body]">
              <el-input
                v-model="baseForm.toolscode_bottom"
                type="textarea"
                :rows="8"
                placeholder="粘贴统计代码到此处，将插入到 </body> 标签前"
                style="font-family: monospace; font-size: 13px"
              />
              <div class="field-hint">适用于需要放在页面底部的统计脚本</div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

              </el-tabs>

      <div class="button-group">
        <el-button type="primary" @click="handleSave" :loading="loading">保存设置</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBase, updateBase } from '@/shared/api/settings'
import ImageUploader from '@/admin/components/ImageUploader.vue'

defineOptions({ name: 'SettingsPage' })

const activeTab = ref('base')
const loading = ref(false)

const baseForm = ref({
  title: '',
  keyword: '',
  descs: '',
  company: '',
  logo: '',
  wap_logo: '',
  ico_logo: '',
  tel: '',
  phone: '',
  email: '',
  address: '',
  fax: '',
  postcode: '',
  content2: '',
  toolscode_top: '',
  toolscode_bottom: '',
})

const loadSettings = async () => {
  const data = await getBase()
  if (data) {
    const b = data as Record<string, string>
    baseForm.value = {
      title: b.title || '',
      keyword: b.keyword || '',
      descs: b.descs || '',
      company: b.company || '',
      logo: b.logo || '',
      wap_logo: b.wap_logo || '',
      ico_logo: b.ico_logo || '',
      tel: b.tel || '',
      phone: b.phone || '',
      email: b.email || '',
      address: b.address || '',
      fax: b.fax || '',
      postcode: b.postcode || '',
      content2: b.content2 || '',
      toolscode_top: b.toolscode_top || '',
      toolscode_bottom: b.toolscode_bottom || '',
    }
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    await updateBase(baseForm.value)
    ElMessage.success('保存成功')
    await loadSettings()
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  loadSettings()
  ElMessage.info('已重置')
}

onMounted(loadSettings)
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.button-group {
  margin-top: 20px;
  text-align: center;
}

.field-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

</style>
