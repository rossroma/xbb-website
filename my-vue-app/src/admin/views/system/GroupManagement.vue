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
          <span class="perm-footer-label">功能权限</span>
          <el-checkbox @change="selectAll">全选</el-checkbox>
          <el-checkbox @change="selectNone">全不选</el-checkbox>
          <el-checkbox @change="invertSelect">反选</el-checkbox>
        </div>

        <div v-for="group in actionTree" :key="group.id" class="perm-group">
          <div class="perm-group-header">
            <el-checkbox
              :model-value="isGroupAllChecked(group)"
              :indeterminate="isGroupIndeterminate(group)"
              @change="(val: boolean) => toggleGroup(group, val)"
            >
              <span class="perm-group-title">{{ group.action_name }}</span>
            </el-checkbox>
          </div>
          <div class="perm-group-children" v-if="group.children && group.children.length">
            <el-checkbox
              v-for="child in group.children"
              :key="child.id"
              :model-value="selectedRules.includes(child.action_code)"
              @change="(val: boolean) => toggleRule(child.action_code, val)"
            >
              {{ child.action_name }}
            </el-checkbox>
          </div>
          <div class="perm-group-children" v-else>
            <el-checkbox
              :model-value="selectedRules.includes(group.action_code)"
              @change="(val: boolean) => toggleRule(group.action_code, val)"
            >
              {{ group.action_name }}
            </el-checkbox>
          </div>
        </div>

        <div class="perm-section-header">
          <div class="perm-section-title">内容板块管理</div>
          <div class="perm-footer-actions category-footer-actions">
            <span class="perm-footer-label">内容板块</span>
            <el-checkbox @change="selectAllCategories">全选</el-checkbox>
            <el-checkbox @change="clearAllCategories">全不选</el-checkbox>
            <el-checkbox @change="invertCategorySelection">反选</el-checkbox>
          </div>
        </div>

        <div v-for="group in categoryTree" :key="`category-${group.id}`" class="perm-group">
          <div class="perm-group-header">
            <el-checkbox
              :model-value="isCategoryGroupAllChecked(group)"
              :indeterminate="isCategoryGroupIndeterminate(group)"
              @change="(val: boolean) => toggleCategoryGroup(group, val)"
            >
              <span class="perm-group-title">{{ group.title }}</span>
            </el-checkbox>
          </div>
          <div class="perm-group-children" v-if="group.children.length">
            <el-checkbox
              v-for="item in flattenCategoryOptions(group.children, 2)"
              :key="item.id"
              :model-value="selectedCategoryRules.includes(item.id)"
              @change="(val: boolean) => toggleCategoryRule(item.id, val)"
            >
              {{ item.label }}
            </el-checkbox>
          </div>
        </div>
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

interface CategoryOption {
  id: string
  label: string
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const permLoading = ref(false)
const adminGroups = ref<Record<string, unknown>[]>([])
const formRef = ref()
const actionTree = ref<ActionNode[]>([])
const selectedRules = ref<string[]>([])
const categoryTree = ref<CategoryNode[]>([])
const selectedCategoryRules = ref<string[]>([])
const currentGroupId = ref<number | null>(null)

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

const loadActionTree = async () => {
  permLoading.value = true
  try {
    const result = await getAdminActions()
    actionTree.value = (result as unknown as ActionNode[]) || []
  } finally {
    permLoading.value = false
  }
}

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

const loadCategoryTree = async () => {
  try {
    const result = await getAdminCategories({ limit: 999 })
    const items = result?.items || []
    categoryTree.value = buildCategoryTree(items)
  } catch {}
}

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

const flattenCategoryOptions = (nodes: CategoryNode[], level = 1): CategoryOption[] => {
  return nodes.flatMap((node) => {
    const prefix = level === 1 ? '' : `[${level}级]`
    const current = { id: String(node.id), label: `${prefix}${node.title}` }
    return [current, ...flattenCategoryOptions(node.children, level + 1)]
  })
}

const getCategoryLeafIds = (node: CategoryNode): string[] => {
  if (!node.children.length) return [String(node.id)]
  return [String(node.id), ...node.children.flatMap((child) => getCategoryLeafIds(child))]
}

const isCategoryGroupAllChecked = (group: CategoryNode) => {
  const ids = getCategoryLeafIds(group)
  return ids.length > 0 && ids.every((id) => selectedCategoryRules.value.includes(id))
}

const isCategoryGroupIndeterminate = (group: CategoryNode) => {
  const ids = getCategoryLeafIds(group)
  const checked = ids.filter((id) => selectedCategoryRules.value.includes(id))
  return checked.length > 0 && checked.length < ids.length
}

const toggleCategoryGroup = (group: CategoryNode, checked: boolean) => {
  const ids = getCategoryLeafIds(group)
  if (checked) {
    selectedCategoryRules.value = [...new Set([...selectedCategoryRules.value, ...ids])]
  } else {
    selectedCategoryRules.value = selectedCategoryRules.value.filter((id) => !ids.includes(id))
  }
}

const toggleCategoryRule = (id: string, checked: boolean) => {
  if (checked) {
    if (!selectedCategoryRules.value.includes(id)) {
      selectedCategoryRules.value = [...selectedCategoryRules.value, id]
    }
  } else {
    selectedCategoryRules.value = selectedCategoryRules.value.filter((item) => item !== id)
  }
}

const selectAllCategories = () => {
  selectedCategoryRules.value = categoryTree.value.flatMap((group) => getCategoryLeafIds(group))
}

const clearAllCategories = () => {
  selectedCategoryRules.value = []
}

const invertCategorySelection = () => {
  const all = categoryTree.value.flatMap((group) => getCategoryLeafIds(group))
  selectedCategoryRules.value = all.filter((id) => !selectedCategoryRules.value.includes(id))
}

const getAllLeafCodes = (node: ActionNode): string[] => {
  if (!node.children || node.children.length === 0) return [node.action_code]
  return node.children.flatMap((c) => getAllLeafCodes(c))
}

const isGroupAllChecked = (group: ActionNode) => {
  const codes = getAllLeafCodes(group)
  return codes.length > 0 && codes.every((code) => selectedRules.value.includes(code))
}

const isGroupIndeterminate = (group: ActionNode) => {
  const codes = getAllLeafCodes(group)
  const checked = codes.filter((code) => selectedRules.value.includes(code))
  return checked.length > 0 && checked.length < codes.length
}

const toggleGroup = (group: ActionNode, val: boolean) => {
  const codes = getAllLeafCodes(group)
  if (val) {
    selectedRules.value = [...new Set([...selectedRules.value, ...codes])]
  } else {
    selectedRules.value = selectedRules.value.filter((code) => !codes.includes(code))
  }
}

const toggleRule = (code: string, val: boolean) => {
  if (val) {
    if (!selectedRules.value.includes(code)) selectedRules.value = [...selectedRules.value, code]
  } else {
    selectedRules.value = selectedRules.value.filter((r) => r !== code)
  }
}

const selectAll = () => {
  selectedRules.value = actionTree.value.flatMap((g) => getAllLeafCodes(g))
}

const selectNone = () => {
  selectedRules.value = []
}

const invertSelect = () => {
  const all = actionTree.value.flatMap((g) => getAllLeafCodes(g))
  selectedRules.value = all.filter((code) => !selectedRules.value.includes(code))
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
  if (actionTree.value.length === 0) await loadActionTree()
  if (categoryTree.value.length === 0) await loadCategoryTree()
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

.perm-group {
  margin-bottom: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.perm-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.perm-section-header {
  margin: 16px 0 12px;
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

.perm-footer-actions {
  margin-top: 12px;
  padding: 10px 16px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 24px;
}

.perm-top-actions {
  margin-top: 0;
  margin-bottom: 12px;
}

.category-footer-actions {
  margin-top: 8px;
  margin-bottom: 0;
}

.perm-footer-label {
  color: #606266;
  font-weight: 600;
}
</style>
