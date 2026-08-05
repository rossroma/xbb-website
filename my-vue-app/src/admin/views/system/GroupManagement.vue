<template>
  <div class="group-management">
    <div class="page-header">
      <h2>用户组管理</h2>
      <el-button type="primary" @click="showCreateDialog">新增用户组</el-button>
    </div>

    <div style="margin-bottom: 12px; display: flex; gap: 10px; align-items: center">
      <el-select v-model="pagination.sortBy" style="width: 150px" @change="loadAdminGroups">
        <el-option label="最新创建" value="id_desc" />
        <el-option label="最早创建" value="id_asc" />
      </el-select>
    </div>

    <el-table :data="adminGroups" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="用户组名称" min-width="150" />
      <el-table-column label="权限分配" width="200">
        <template #default="{ row }">
          <el-button size="small" type="warning" @click="showPermissionDialog(row)">
            设置权限
            <span v-if="getRulesCount(row.rules) > 0" style="margin-left: 4px">
              ({{ getRulesCount(row.rules) }})
            </span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">修改</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="pagination.total"
      @size-change="loadAdminGroups"
      @current-change="loadAdminGroups"
      style="margin-top: 16px; justify-content: flex-end"
    />

    <!-- 创建/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="400px" @close="resetForm">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="用户组名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入用户组名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限设置对话框 -->
    <el-dialog title="设置权限" v-model="permDialogVisible" width="700px" @close="resetPermForm">
      <div v-loading="permLoading" class="perm-container">
        <div class="perm-footer-actions perm-top-actions">
          <span class="perm-footer-label">批量操作</span>
          <el-checkbox @change="selectAll">全选</el-checkbox>
          <el-checkbox @change="selectNone">全不选</el-checkbox>
          <el-checkbox @change="invertSelect">反选</el-checkbox>
        </div>

        <PermissionTreeNode
          v-for="node in actionTree"
          :key="node.action_code"
          :node="node"
          :selected-rules="selectedRules"
          @toggle-node="handleToggleNode"
        />
      </div>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermSubmit" :loading="submitting">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAdminGroups,
  createAdminGroup,
  updateAdminGroup,
  deleteAdminGroup,
  getAdminActions,
} from '@/shared/api/admin'
import PermissionTreeNode from './PermissionTreeNode.vue'
import type { TreeNode } from './PermissionTreeNode.vue'

interface ActionNode {
  id: number
  parent_id: number
  action_code: string
  action_name: string
  ord: number
  status: number
  children: ActionNode[]
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const permLoading = ref(false)
const adminGroups = ref<Record<string, unknown>[]>([])
const formRef = ref()
const selectedRules = ref<string[]>([])
const currentGroupId = ref<number | null>(null)

const actionTree = ref<TreeNode[]>([])

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  sortBy: 'id_asc',
})

const form = reactive({
  id: undefined as number | undefined,
  title: '',
  status: 1,
})

const formRules = {
  title: [
    { required: true, message: '请输入用户组名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const dialogTitle = computed(() => (form.id ? '编辑用户组' : '新增用户组'))

// ==================== 用户组 CRUD ====================

const getRulesCount = (rules: string) => {
  if (!rules) return 0
  return rules.split(',').filter((r: string) => r.trim()).length
}

const loadAdminGroups = async () => {
  loading.value = true
  try {
    const result = await getAdminGroups({
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
    })
    adminGroups.value = result.items || (Array.isArray(result) ? result : [])
    pagination.total = result.total || adminGroups.value.length
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  resetForm()
  dialogVisible.value = true
}

const showEditDialog = (row: any) => {
  Object.assign(form, { id: row.id, title: row.title, status: row.status })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    submitting.value = true
    if (form.id) {
      await updateAdminGroup(form.id, { title: form.title, status: form.status })
      ElMessage.success('更新成功')
    } else {
      await createAdminGroup({ title: form.title, status: form.status })
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadAdminGroups()
  } catch (err) {
    if (err !== false) {/* 全局拦截器已处理 */}
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个用户组吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteAdminGroup(row.id)
    ElMessage.success('删除成功')
    loadAdminGroups()
  } catch {
    // ElMessageBox 取消或 API 错误
  }
}

const resetForm = () => {
  Object.assign(form, { id: undefined, title: '', status: 1 })
  formRef.value?.resetFields()
}

// ==================== 权限树加载 ====================

const convertActionNode = (node: ActionNode): TreeNode => {
  const hasChildren = node.children && node.children.length > 0
  return {
    id: node.id,
    action_code: node.action_code,
    action_name: node.action_name,
    type: hasChildren ? 'group' : 'crud',
    children: hasChildren ? node.children.map(convertActionNode) : [],
  }
}

const loadPermissionTree = async () => {
  permLoading.value = true
  try {
    const result = await getAdminActions()
    const rawActions = (result as unknown as ActionNode[]) || []
    actionTree.value = rawActions.map(convertActionNode)
  } finally {
    permLoading.value = false
  }
}

// ==================== 权限选择逻辑 ====================

// 收集节点的所有后代 CRUD 节点
const getCrudDescendants = (node: TreeNode): TreeNode[] => {
  return node.type === 'crud'
    ? [node]
    : node.children.flatMap(child => getCrudDescendants(child))
}

// 获取模块对应的 view action_code
const getViewCode = (node: TreeNode): string | null => {
  if (node.type === 'crud' && node.action_code.endsWith('.view')) return node.action_code
  const descendants = getCrudDescendants(node)
  const viewNode = descendants.find(d => d.action_code.endsWith('.view'))
  return viewNode?.action_code || null
}

// 收集节点下所有非 view 的 CRUD action_code
const getNonViewCrudCodes = (node: TreeNode): string[] => {
  return getCrudDescendants(node)
    .filter(d => !d.action_code.endsWith('.view'))
    .map(d => d.action_code)
}

// 收集节点下所有 CRUD action_code（含 view）
const getAllCrudCodes = (node: TreeNode): string[] => {
  return getCrudDescendants(node).map(d => d.action_code)
}

const handleToggleNode = (node: TreeNode, checked: boolean) => {
  if (node.type === 'crud') {
    // CRUD 叶子节点
    if (node.action_code.endsWith('.view')) {
      // view 节点不可手动切换，忽略
      return
    }
    if (checked) {
      if (!selectedRules.value.includes(node.action_code)) {
        selectedRules.value = [...selectedRules.value, node.action_code]
      }
    } else {
      selectedRules.value = selectedRules.value.filter(r => r !== node.action_code)
    }
    return
  }

  // group 节点：勾选/取消所有后代
  if (checked) {
    // 勾选模块 → 自动附带所有 CRUD（含 view）
    const allCodes = getAllCrudCodes(node)
    selectedRules.value = [...new Set([...selectedRules.value, ...allCodes])]
  } else {
    // 取消模块 → 移除所有 CRUD（含 view）
    const allCodes = getAllCrudCodes(node)
    selectedRules.value = selectedRules.value.filter(r => !allCodes.includes(r))
  }
}

// 收集树中所有模块级 group 节点
const collectModuleNodes = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.flatMap(node => {
    if (node.type === 'group') return [node, ...collectModuleNodes(node.children)]
    return []
  })
}

// 收集所有非 view 的 CRUD 叶子节点
const collectAllNonViewCrudCodes = (nodes: TreeNode[]): string[] => {
  return nodes.flatMap(node => {
    if (node.type === 'crud' && !node.action_code.endsWith('.view')) {
      return [node.action_code]
    }
    if (node.type === 'group') {
      return collectAllNonViewCrudCodes(node.children)
    }
    return []
  })
}

// 全选：勾选所有模块 → 自动附带 view
const selectAll = () => {
  const allNonViewCodes = collectAllNonViewCrudCodes(actionTree.value)
  const allViewCodes = actionTree.value
    .flatMap(node => getAllCrudCodes(node))
    .filter(code => code.endsWith('.view'))
  selectedRules.value = [...new Set([...allNonViewCodes, ...allViewCodes])]
}

// 全不选：清空所有
const selectNone = () => {
  selectedRules.value = []
}

// 反选：反转模块勾选状态
const invertSelect = () => {
  const moduleNodes = collectModuleNodes(actionTree.value)
  const allCodes = new Set<string>()

  for (const module of moduleNodes) {
    const crudCodes = getAllCrudCodes(module)
    const anyChecked = crudCodes.some(code => selectedRules.value.includes(code))

    if (anyChecked) {
      // 当前已勾选 → 取消（移除所有 CRUD 含 view）
      // 不添加到 allCodes
    } else {
      // 当前未勾选 → 勾选（自动附带 view）
      crudCodes.forEach(code => allCodes.add(code))
    }
  }

  selectedRules.value = [...allCodes]
}

// ==================== 权限对话框 ====================

const showPermissionDialog = async (row: any) => {
  currentGroupId.value = row.id
  selectedRules.value = row.rules
    ? row.rules
        .split(',')
        .map((r: string) => r.trim())
        .filter((r: string) => r)
    : []
  permDialogVisible.value = true
  if (actionTree.value.length === 0) await loadPermissionTree()
}

const resetPermForm = () => {
  selectedRules.value = []
  currentGroupId.value = null
}

const handlePermSubmit = async () => {
  if (!currentGroupId.value) return
  submitting.value = true
  try {
    const rules = selectedRules.value.join(',')
    await updateAdminGroup(currentGroupId.value, {
      rules,
      rules_category: JSON.stringify([]),
    })
    ElMessage.success('权限设置成功')
    permDialogVisible.value = false
    loadAdminGroups()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadAdminGroups()
})
</script>

<style scoped>
.group-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.perm-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 4px;
}

.perm-footer-actions {
  margin-top: 12px;
  padding: 10px 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.perm-top-actions {
  margin-top: 0;
  margin-bottom: 12px;
}

.perm-footer-label {
  color: #606266;
  font-weight: 600;
}
</style>