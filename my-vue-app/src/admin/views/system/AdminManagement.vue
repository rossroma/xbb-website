<template>
  <div class="admin-management">
    <div class="page-header">
      <h2>管理员管理</h2>
      <el-button type="primary" @click="showCreateDialog">新增管理员</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择类型"
            clearable
            style="width: 140px"
          >
            <el-option label="超级管理员" :value="1" />
            <el-option label="普通管理员" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.sortBy" style="width: 150px">
            <el-option label="最新创建" value="id_desc" />
            <el-option label="最早创建" value="id_asc" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadAdmins">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 管理员列表 -->
    <el-table :data="admins" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="group_name" label="用户组" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="row.type === 1 ? 'danger' : 'primary'">
            {{ row.type === 1 ? '超级管理员' : '普通管理员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
            :disabled="row.type === 1"
          >
            删除
          </el-button>
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

    <!-- 创建/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="用户组" prop="group_id">
          <el-select v-model="form.group_id" placeholder="请选择用户组" style="width: 100%">
            <el-option
              v-for="group in adminGroups"
              :key="group.id"
              :label="group.title"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="普通管理员" :value="0" />
            <el-option label="超级管理员" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminGroups,
} from '@/shared/api/admin'

// 类型定义
interface AdminListResponse {
  items: Record<string, unknown>[]
  total: number
  page: number
  limit: number
}

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const admins = ref<Record<string, unknown>[]>([])
const adminGroups = ref<Record<string, unknown>[]>([])
const formRef = ref()

// 搜索表单
const searchForm = reactive({
  username: '',
  status: undefined,
  type: undefined,
  sortBy: 'id_desc',
})

// 分页
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// 表单数据
const form = reactive({
  id: undefined,
  username: '',
  password: '',
  group_id: undefined,
  type: 0,
  status: 1,
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 计算属性
const dialogTitle = computed(() => {
  return form.id ? '编辑管理员' : '新增管理员'
})

// 加载管理员列表
const loadAdmins = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm,
    }
    const result = (await getAdmins(params)) as unknown as AdminListResponse
    admins.value = result?.items || []
    pagination.total = result?.total || 0
  } catch (err) {
    console.error('加载管理员列表失败:', err)
    ElMessage.error('加载管理员列表失败')
  } finally {
    loading.value = false
  }
}

// 加载用户组列表
const loadAdminGroups = async () => {
  try {
    const result = await getAdminGroups({ limit: 999 })
    adminGroups.value = result?.items || (Array.isArray(result) ? result : [])
  } catch (err) {
    console.error('加载用户组列表失败:', err)
    ElMessage.error('加载用户组列表失败')
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  resetForm()
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (row: Record<string, unknown>) => {
  Object.assign(form, {
    id: row.id,
    username: row.username,
    password: '',
    group_id: row.group_id,
    type: row.type,
    status: row.status,
  })
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (form.id) {
      await updateAdmin(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createAdmin(form)
      ElMessage.success('创建成功')
    }

    dialogVisible.value = false
    loadAdmins()
  } catch (err) {
    console.error('操作失败:', err)
    const errorMessage = typeof err === 'string' ? err : '操作失败'
    ElMessage.error(errorMessage)
  } finally {
    submitting.value = false
  }
}

// 删除管理员
const handleDelete = async (row: Record<string, unknown>) => {
  try {
    await ElMessageBox.confirm('确定要删除这个管理员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await deleteAdmin(row.id as number)
    ElMessage.success('删除成功')
    loadAdmins()
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除失败:', err)
      ElMessage.error('删除失败')
    }
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.limit = size
  pagination.page = 1
  loadAdmins()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadAdmins()
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    username: '',
    password: '',
    group_id: undefined,
    type: 0,
    status: 1,
  })
  formRef.value?.resetFields()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    username: '',
    status: undefined,
    type: undefined,
    sortBy: 'id_desc',
  })
  pagination.page = 1
  loadAdmins()
}

// 组件挂载时加载数据
onMounted(() => {
  loadAdmins()
  loadAdminGroups()
})
</script>

<style scoped>
.admin-management {
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
</style>
