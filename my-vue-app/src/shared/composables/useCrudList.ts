import { ref, reactive, type Ref } from 'vue'
import { ElMessageBox } from 'element-plus'

/**
 * 搜索表单配置
 */
export interface SearchFormConfig {
  /** 搜索表单初始值 */
  defaults: Record<string, unknown>
  /** 构建 fetchFn 额外参数（基于搜索表单） */
  buildParams?: (searchForm: Record<string, unknown>) => Record<string, unknown>
}

/**
 * 通用 CRUD composable — 封装列表加载、分页、搜索、对话框状态、删除确认
 *
 * @param fetchFn — 接收查询参数、返回 { items, total } 的异步函数
 * @param defaultPageSize — 默认每页条数
 * @param searchConfig — 可选搜索表单配置
 */
export function useCrudList<T>(
  fetchFn: (params: Record<string, unknown>) => Promise<{ items: T[]; total: number }>,
  defaultPageSize = 10,
  searchConfig?: SearchFormConfig,
) {
  const loading = ref(false)
  const list = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)

  const pagination = reactive({
    page: 1,
    limit: defaultPageSize,
  })

  // 搜索表单（可选）
  const searchForm = searchConfig
    ? reactive<Record<string, unknown>>({ ...searchConfig.defaults })
    : null

  // 对话框状态
  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const editId = ref<number>(0)

  const fetchList = async (extraParams?: Record<string, unknown>) => {
    loading.value = true
    try {
      const params: Record<string, unknown> = {
        page: pagination.page,
        limit: pagination.limit,
        ...extraParams,
      }
      // 注入搜索表单参数
      if (searchForm && searchConfig?.buildParams) {
        Object.assign(params, searchConfig.buildParams(searchForm))
      }
      const result = await fetchFn(params)
      list.value = result.items || []
      total.value = result.total || 0
    } finally {
      loading.value = false
    }
  }

  const handleQuery = () => {
    pagination.page = 1
    fetchList()
  }

  const handlePageChange = (page: number) => {
    pagination.page = page
    fetchList()
  }

  const handleSizeChange = (size: number) => {
    pagination.limit = size
    pagination.page = 1
    fetchList()
  }

  /** 重置搜索表单 */
  const resetSearch = () => {
    if (searchForm && searchConfig) {
      Object.assign(searchForm, searchConfig.defaults)
    }
    handleQuery()
  }

  /** 打开新增对话框 */
  const showCreateDialog = () => {
    isEdit.value = false
    editId.value = 0
    dialogVisible.value = true
  }

  /** 打开编辑对话框 */
  const showEditDialog = (row: Record<string, unknown>) => {
    isEdit.value = true
    editId.value = row.id as number
    dialogVisible.value = true
  }

  /** 关闭对话框 */
  const closeDialog = () => {
    dialogVisible.value = false
  }

  /** 删除确认对话框 */
  const confirmDelete = async (
    row: Record<string, unknown>,
    labelFn?: (row: Record<string, unknown>) => string,
  ): Promise<boolean> => {
    const label = labelFn ? labelFn(row) : `ID: ${row.id}`
    try {
      await ElMessageBox.confirm(`确定删除"${label}"吗？`, '提示', { type: 'warning' })
      return true
    } catch {
      return false
    }
  }

  return {
    // 列表 + 分页
    loading,
    list,
    total,
    pagination,
    fetchList,
    handleQuery,
    handlePageChange,
    handleSizeChange,
    // 搜索
    searchForm,
    resetSearch,
    // 对话框
    dialogVisible,
    isEdit,
    editId,
    showCreateDialog,
    showEditDialog,
    closeDialog,
    // 删除
    confirmDelete,
  }
}
