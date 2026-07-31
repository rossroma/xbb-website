<template>
  <div class="image-uploader">
    <div
      class="upload-area"
      :class="{ 'has-image': modelValue, 'is-dragging': isDragging }"
      @click="triggerUpload"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <template v-if="modelValue">
        <img :src="previewUrl" class="preview-img" />
        <div class="overlay">
          <el-icon class="overlay-icon" @click.stop="handleRemove"><Delete /></el-icon>
          <el-icon class="overlay-icon" @click.stop="triggerUpload"><Upload /></el-icon>
        </div>
      </template>
      <template v-else>
        <div class="placeholder">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <span class="upload-text">{{ uploading ? '上传中...' : '点击或拖拽上传' }}</span>
          <span class="upload-hint">支持 JPG / PNG / GIF，最大 10MB</span>
        </div>
      </template>
      <el-progress v-if="uploading" :percentage="progress" class="upload-progress" />
    </div>

    <div class="url-input">
      <el-input
        :model-value="modelValue"
        placeholder="或直接输入图片 URL"
        clearable
        @update:model-value="handleUrlInput"
      >
        <template #prepend>URL</template>
      </el-input>
    </div>

    <div v-if="thumbUrl" class="thumb-info">
      <el-image :src="thumbUrl" style="width: 60px; height: 45px; border-radius: 4px;" fit="cover" preview-teleported :preview-src-list="[thumbUrl]" :z-index="9999" />
      <span class="thumb-label">缩略图已生成</span>
      <el-button link type="primary" size="small" @click="copyThumbUrl">复制URL</el-button>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Upload, Plus } from '@element-plus/icons-vue'
import { getToken } from '@/shared/utils/token'

const props = withDefaults(defineProps<{
  modelValue?: string
  thumb?: boolean
}>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'thumb-url': [url: string]
}>()

const fileInputRef = ref<HTMLInputElement>()
const uploading = ref(false)
const isDragging = ref(false)
const progress = ref(0)
const thumbUrl = ref('')

const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue.startsWith('http') || props.modelValue.startsWith('/')) {
    return props.modelValue
  }
  return props.modelValue
})

const triggerUpload = () => fileInputRef.value?.click()

const handleRemove = () => {
  emit('update:modelValue', '')
  thumbUrl.value = ''
}

const handleUrlInput = (val: string) => {
  emit('update:modelValue', val)
  thumbUrl.value = ''
}

const copyThumbUrl = () => {
  navigator.clipboard.writeText(thumbUrl.value)
  ElMessage.success('缩略图 URL 已复制')
}

const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只允许上传图片文件')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return
  }

  uploading.value = true
  progress.value = 0

  const formData = new FormData()
  formData.append('file', file)

  try {
    const token = getToken() || ''
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100)
    }

    await new Promise<void>((resolve, reject) => {
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText)
        if (res.code === 200 && res.data?.url) {
          emit('update:modelValue', res.data.url)
          if (res.data.thumb_url) {
            thumbUrl.value = res.data.thumb_url
            emit('thumb-url', res.data.thumb_url)
          }
          ElMessage.success('上传成功')
          resolve()
        } else {
          reject(new Error(res.message || '上传失败'))
        }
      }
      xhr.onerror = () => reject(new Error('网络错误'))
      xhr.open('POST', `/v1/admin/upload${props.thumb ? '?thumb=1' : ''}`)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(formData)
    })
  } catch (e: any) {
    ElMessage.error(e.message || '上传失败')
  } finally {
    uploading.value = false
    progress.value = 0
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  position: relative;
  width: 200px;
  height: 150px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
  background: #fafafa;
}

.upload-area:hover,
.upload-area.is-dragging {
  border-color: #409eff;
  background: #f0f7ff;
}

.upload-area.has-image {
  border-style: solid;
  border-color: #e4e7ed;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 6px;
  color: #909399;
}

.upload-icon {
  font-size: 32px;
  color: #c0c4cc;
}

.upload-text {
  font-size: 13px;
  color: #606266;
}

.upload-hint {
  font-size: 11px;
  color: #c0c4cc;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.upload-area:hover .overlay {
  opacity: 1;
}

.overlay-icon {
  font-size: 22px;
  color: #fff;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s;
}

.overlay-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.upload-progress {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
}

.url-input {
  margin-top: 8px;
  width: 100%;
}

.thumb-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 10px;
  background: #f0f9eb;
  border: 1px solid #b3e19d;
  border-radius: 4px;
  font-size: 12px;
  color: #67c23a;
}

.thumb-label {
  flex: 1;
  color: #529b2e;
}
</style>
