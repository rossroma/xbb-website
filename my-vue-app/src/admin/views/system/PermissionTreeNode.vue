<template>
  <div class="perm-group">
    <div class="perm-group-header">
      <el-checkbox
        :model-value="isAllChecked"
        :indeterminate="isIndeterminate"
        :disabled="isLeafView"
        @change="(val: boolean) => handleToggle(val)"
      >
        <span class="perm-group-title">{{ nodeTitle }}</span>
      </el-checkbox>
    </div>
    <div v-if="children.length" class="perm-group-children">
      <PermissionTreeNode
        v-for="child in children"
        :key="childKey(child)"
        :node="child"
        :selected-rules="selectedRules"
        @toggle-node="(n, val) => emit('toggleNode', n, val)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TreeNode {
  id: number | string
  action_code: string
  action_name: string
  type: 'group' | 'crud'
  children: TreeNode[]
}

const props = defineProps<{
  node: TreeNode
  selectedRules: string[]
}>()

const emit = defineEmits<{
  toggleNode: [node: TreeNode, checked: boolean]
}>()

const nodeTitle = computed(() => props.node.action_name)
const children = computed(() => props.node.children || [])

// 是否为 view 叶子节点（不可手动切换）
const isLeafView = computed(() =>
  props.node.type === 'crud' && props.node.action_code.endsWith('.view')
)

// 收集所有后代 CRUD 节点
const getCrudDescendants = (node: TreeNode): TreeNode[] => {
  return node.type === 'crud'
    ? [node]
    : node.children.flatMap(child => getCrudDescendants(child))
}

const isAllChecked = computed(() => {
  const crud = getCrudDescendants(props.node)
  // 叶子节点
  if (crud.length === 1 && crud[0] === props.node) {
    return props.selectedRules.includes(props.node.action_code)
  }
  return crud.every(n => props.selectedRules.includes(n.action_code))
})

const isIndeterminate = computed(() => {
  const crud = getCrudDescendants(props.node)
  // 叶子节点
  if (crud.length === 1 && crud[0] === props.node) return false

  const checked = crud.filter(n => props.selectedRules.includes(n.action_code)).length
  return checked > 0 && checked < crud.length
})

const handleToggle = (checked: boolean) => {
  emit('toggleNode', props.node, checked)
}

const childKey = (child: TreeNode) => {
  return `${child.type}-${child.action_code || child.id}`
}
</script>

<style scoped>
.perm-group {
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.perm-group-header {
  background: #f5f7fa;
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;
}

.perm-group-title {
  font-weight: 600;
  color: #303133;
}

.perm-group-children {
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}
</style>