<script setup lang="ts">
defineProps<{
  visible: boolean
  previewData: {
    id: number
    title: string
    content: string
    variables: Record<string, unknown>
  } | null
}>()

defineEmits<{
  'update:visible': [value: boolean]
}>()
</script>

<template>
  <el-dialog
    title="模板预览"
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    width="90%"
    top="5vh"
  >
    <div v-if="previewData" class="preview-container">
      <div class="preview-info">
        <h3>{{ previewData.title }}</h3>
        <p><strong>模板变量：</strong></p>
        <pre>{{ JSON.stringify(previewData.variables, null, 2) }}</pre>
      </div>
      <div class="preview-content">
        <iframe
          :srcdoc="previewData.content"
          style="width: 100%; height: 500px; border: 1px solid #ddd"
        ></iframe>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
}

.preview-info pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.preview-content {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
