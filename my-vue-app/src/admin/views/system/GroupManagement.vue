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
        <!-- 全选/全不选/反选（仅对功能权限 CRUD 节点生效） -->
        <div class="perm-footer-actions perm-top-actions">
          <span class="perm-footer-label">批量操作</span>
          <el-checkbox @change="selectAll">全选</el-checkbox>
          <el-checkbox @change="selectNone">全不选</el-checkbox>
          <el-checkbox @change="invertSelect">反选</el-checkbox>
          <span class="perm-footer-hint">（仅影响功能权限，不影响栏目分类）</span>
        </div>

        <!-- 递归渲染权限树 -->
        <PermissionTreeNode
          v-for="node in actionTree"
          :key="node.action_code"
          :node="node"
          :selected-rules="selectedRules"
          :selected-category-rules="selectedCategoryRules"
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
import { getAdminCategories } from '@/shared/api/category'
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

interface CategoryNode {
  id: number
  pid: number
  title: string
  status: number
  children: CategoryNode[]
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const permLoading = ref(false)
const adminGroups = ref<Record<string, unknown>[]>([])
const formRef = ref()
const selectedRules = ref<string[]>([])
const selectedCategoryRules = ref<string[]>([])
const currentGroupId = ref<number | null>(null)

// 权限树：将后端数据 + 动态注入的栏目分类转换为统一 TreeNode 格式
const actionTree = ref<TreeNode[]>([])
// 原始后端数据（用于提取 CRUD 节点等操作）
const rawActionTree = ref<ActionNode[]>([])

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

const getRulesCount = (rules: string) => {
  if (!rules) return 0
  return rules.split(',').filter((r: string) => r.trim()).length
}

// ==================== 用户组 CRUD ====================

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
    // ElMessageBox 取消或 API 错误（全局拦截器已处理）
  }
}

const resetForm = () => {
  Object.assign(form, { id: undefined, title: '', status: 1 })
  formRef.value?.resetFields()
}

// ==================== 权限树 ====================

/**
 * 将 ActionNode 树转换为统一 TreeNode 格式
 * 叶子节点（无 children）标记为 type='crud'，非叶子节点标记为 type='group'
 */
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

/**
 * 构建栏目分类树
 */
const buildCategoryTree = (
  items: any[],
  pid = 0,
  visited: Set<number> = new Set(),
  depth: number = 0,
): CategoryNode[] => {
  if (depth > 50 || visited.has(pid)) return []
  visited.add(pid)
  return items
    .filter((item: any) => Number(item.pid || 0) === pid)
    .sort(
      (a: any, b: any) => Number(a.ord || 0) - Number(b.ord || 0) || Number(a.id) - Number(b.id),
    )
    .map((item: any) => ({
      id: Number(item.id),
      pid: Number(item.pid || 0),
      title: item.title,
      status: Number(item.status ?? 1),
      children: buildCategoryTree(items, Number(item.id), new Set(visited), depth + 1),
    }))
}

/**
 * 将 CategoryNode 树转换为 TreeNode 格式（type='category'）
 */
const convertCategoryNode = (node: CategoryNode): TreeNode => {
  const hasChildren = node.children && node.children.length > 0
  return {
    id: node.id,
    action_code: String(node.id),
    action_name: node.title,
    type: 'category',
    children: hasChildren ? node.children.map(convertCategoryNode) : [],
  }
}

/**
 * 加载权限树 + 栏目分类，合并为统一 TreeNode 树
 */
const loadPermissionTree = async () => {
  permLoading.value = true
  try {
    // 加载功能权限树
    const result = await getAdminActions()
    const rawActions = (result as unknown as ActionNode[]) || []
    rawActionTree.value = rawActions
    const tree = rawActions.map(convertActionNode)

    // 加载栏目分类树
    const catResult = await getAdminCategories({ limit: 999 })
    const catItems = catResult?.items || []
    const catTree = buildCategoryTree(catItems)

    // 将栏目分类注入到「内容管理」节点下
    if (catTree.length > 0) {
      const contentNode = findNodeByCode(tree, 'content_manage')
      if (contentNode) {
        const categoryNodes = catTree.map(convertCategoryNode)
        contentNode.children.push(...categoryNodes)
      }
    }

    actionTree.value = tree
  } finally {
    permLoading.value = false
  }
}

/**
 * 在 TreeNode 树中按 action_code 查找节点
 */
const findNodeByCode = (nodes: TreeNode[], code: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.action_code === code) return node
    if (node.children.length > 0) {
      const found = findNodeByCode(node.children, code)
      if (found) return found
    }
  }
  return null
}

/**
 * 收集树中所有 CRUD 类型节点（不含 category）
 */
const collectCrudNodes = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.flatMap(node => {
    if (node.type === 'crud') return [node]
    if (node.type === 'group' || node.type === 'category') {
      return [node, ...collectCrudNodes(node.children)]
    }
    return []
  })
}

// ==================== 权限选择逻辑 ====================

/**
 * 收集节点的所有后代节点
 */
const getAllDescendants = (node: TreeNode): TreeNode[] => {
  return [node, ...node.children.flatMap(child => getAllDescendants(child))]
}

/**
 * 处理节点勾选/取消
 */
const handleToggleNode = (node: TreeNode, checked: boolean) => {
  if (node.type === 'crud') {
    // CRUD 叶子节点
    if (checked) {
      if (!selectedRules.value.includes(node.action_code)) {
        selectedRules.value = [...selectedRules.value, node.action_code]
      }
    } else {
      selectedRules.value = selectedRules.value.filter(r => r !== node.action_code)
    }
  } else if (node.type === 'category') {
    // 栏目分类节点
    if (checked) {
      if (!selectedCategoryRules.value.includes(node.action_code)) {
        selectedCategoryRules.value = [...selectedCategoryRules.value, node.action_code]
      }
    } else {
      selectedCategoryRules.value = selectedCategoryRules.value.filter(r => r !== node.action_code)
    }
  } else if (node.type === 'group') {
    // 分组节点：级联勾选/取消所有后代
    const descendants = getAllDescendants(node)
    const crudCodes = descendants.filter(d => d.type === 'crud').map(d => d.action_code)
    const catIds = descendants.filter(d => d.type === 'category').map(d => d.action_code)

    if (checked) {
      selectedRules.value = [...new Set([...selectedRules.value, ...crudCodes])]
      selectedCategoryRules.value = [...new Set([...selectedCategoryRules.value, ...catIds])]
    } else {
      selectedRules.value = selectedRules.value.filter(r => !crudCodes.includes(r))
      selectedCategoryRules.value = selectedCategoryRules.value.filter(r => !catIds.includes(r))
    }
  }
}

/**
 * 全选：仅勾选所有 CRUD 节点（不包含栏目分类）
 */
const selectAll = () => {
  const crudNodes = collectCrudNodes(actionTree.value)
  selectedRules.value = [...new Set(crudNodes.map(n => n.action_code))]
}

/**
 * 全不选：仅取消所有 CRUD 节点（不包含栏目分类）
 */
const selectNone = () => {
  selectedRules.value = []
}

/**
 * 反选：仅反转所有 CRUD 节点（不包含栏目分类）
 */
const invertSelect = () => {
  const crudNodes = collectCrudNodes(actionTree.value)
  const allCrudCodes = crudNodes.map(n => n.action_code)
  selectedRules.value = allCrudCodes.filter(code => !selectedRules.value.includes(code))
}

// ==================== 权限对话框 ====================

const parseRulesCategory = (value?: string | null): string[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean)
    }
  } catch {
    // fallback below
  }
  return value
    .split(',')
    .map((item) => item.replace(/[[\]"]+/g, '').trim())
    .filter(Boolean)
}

const showPermissionDialog = async (row: any) => {
  currentGroupId.value = row.id
  selectedRules.value = row.rules
    ? row.rules
        .split(',')
        .map((r: string) => r.trim())
        .filter((r: string) => r)
    : []
  selectedCategoryRules.value = parseRulesCategory(row.rules_category)
  permDialogVisible.value = true
  if (actionTree.value.length === 0) await loadPermissionTree()
}

const resetPermForm = () => {
  selectedRules.value = []
  selectedCategoryRules.value = []
  currentGroupId.value = null
}

const handlePermSubmit = async () => {
  if (!currentGroupId.value) return
  submitting.value = true
  try {
    const rules = selectedRules.value.join(',')
    await updateAdminGroup(currentGroupId.value, {
      rules,
      rules_category: JSON.stringify(selectedCategoryRules.value),
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

.perm-footer-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
</style>