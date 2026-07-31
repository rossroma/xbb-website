<template>
  <div class="message-form-page">
    <!-- 添加导航栏 -->
    <header class="site-header">
      <div class="container-header">
        <h1>我的博客</h1>
        <nav class="main-nav">
          <router-link to="/client">文章</router-link>
          <router-link to="/client/message" class="active">联系我们</router-link>
          <router-link to="/login">管理后台</router-link>
        </nav>
      </div>
    </header>

    <div class="container">
      <div class="form-header">
        <h2>联系我们</h2>
        <p>如有任何问题或建议，请留言给我们，我们会尽快回复您。</p>
      </div>

      <div class="form-container">
        <el-form
          ref="messageFormRef"
          :model="messageForm"
          :rules="messageRules"
          label-width="100px"
          class="message-form"
        >
          <el-form-item label="留言标题" prop="title">
            <el-input
              v-model="messageForm.title"
              placeholder="请输入留言标题（可选）"
              maxlength="200"
            />
          </el-form-item>

          <el-form-item label="姓名" prop="mname">
            <el-input
              v-model="messageForm.mname"
              placeholder="请输入您的姓名"
              maxlength="50"
            />
          </el-form-item>

          <el-form-item label="手机号" prop="tel">
            <el-input
              v-model="messageForm.tel"
              placeholder="请输入您的手机号"
              maxlength="11"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="messageForm.email"
              placeholder="请输入您的邮箱（可选）"
              maxlength="100"
            />
          </el-form-item>

          <el-form-item label="地址" prop="address">
            <el-input
              v-model="messageForm.address"
              placeholder="请输入您的地址（可选）"
              maxlength="200"
            />
          </el-form-item>

          <el-form-item label="留言内容" prop="content">
            <el-input
              v-model="messageForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入您的留言内容"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              @click="handleSubmit"
              :loading="submitting"
              class="submit-btn"
            >
              提交留言
            </el-button>
            <el-button size="large" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 成功提示对话框 -->
    <el-dialog
      title="提交成功"
      v-model="successDialogVisible"
      width="400px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="success-content">
        <el-icon class="success-icon" color="#67C23A" size="48">
          <Check />
        </el-icon>
        <p>您的留言已成功提交！</p>
        <p class="success-tip">我们会尽快处理并回复您，感谢您的留言。</p>
        <p class="message-id" v-if="submittedMessageId">
          留言编号：{{ submittedMessageId }}
        </p>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleSuccessClose">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@icon-park/vue-next'
import { submitMessage } from '@/shared/api/message'

// 响应式数据
const messageFormRef = ref()
const submitting = ref(false)
const successDialogVisible = ref(false)
const submittedMessageId = ref<number | null>(null)

// 留言表单
const messageForm = reactive({
  title: '',
  mname: '',
  tel: '',
  email: '',
  address: '',
  content: ''
})

// 表单验证规则
const messageRules = {
  mname: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '留言内容长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 提交留言
const handleSubmit = async () => {
  if (!messageFormRef.value) return

  try {
    await messageFormRef.value.validate()
    submitting.value = true

    const result = await submitMessage(messageForm) as unknown as { id: number }
    submittedMessageId.value = result.id
    successDialogVisible.value = true

    // 重置表单
    handleReset()
  } catch (error) {
    console.error('提交留言失败:', error)
    ElMessage.error('提交留言失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  if (messageFormRef.value) {
    messageFormRef.value.resetFields()
  }
}

// 成功对话框关闭
const handleSuccessClose = () => {
  successDialogVisible.value = false
  submittedMessageId.value = null
}
</script>

<style scoped>
.message-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.site-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.container-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-header h1 {
  margin: 0;
  color: #333;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.main-nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.main-nav a.active,
.main-nav a:hover {
  background-color: #007bff;
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.form-header p {
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.6;
}

.form-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.message-form {
  max-width: 600px;
  margin: 0 auto;
}

.submit-btn {
  width: 120px;
  margin-right: 20px;
}

.success-content {
  text-align: center;
  padding: 20px;
}

.success-icon {
  margin-bottom: 16px;
}

.success-content p {
  margin: 8px 0;
  font-size: 16px;
}

.success-tip {
  color: #666;
  font-size: 14px;
}

.message-id {
  color: #409EFF;
  font-weight: bold;
  margin-top: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>
