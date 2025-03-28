<template>
  <div class="execution-task-list">
    <div class="header">
      <div class="title-wrapper">
        <h2>{{ pageTitle }}</h2>
        <el-tag v-if="taskCount > 0" type="info" effect="plain">共 {{ taskCount }} 个任务</el-tag>
      </div>
      <div class="action-wrapper">
        <el-button type="primary" @click="goToCreateTask">
          <el-icon><Plus /></el-icon>创建任务
        </el-button>
      </div>
    </div>

    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option v-for="(value, key) in statusOptions" :key="key" :label="value" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="filterForm.priority" placeholder="全部优先级" clearable>
            <el-option v-for="(value, key) in priorityOptions" :key="key" :label="value" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配给">
          <el-input v-model="filterForm.assigned_to" placeholder="输入用户ID或名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table 
      v-loading="loading" 
      :data="taskList" 
      border 
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="task_code" label="任务编号" width="120" />
      <el-table-column prop="field_id" label="地块" width="150">
        <template #default="{ row }">
          <span>{{ getFieldName(row.field_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="task_type" label="任务类型" width="120">
        <template #default="{ row }">
          <span>{{ getTaskTypeName(row.task_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="task_content" label="任务内容" show-overflow-tooltip />
      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)">
            {{ getPriorityLabel(row.priority) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="due_date" label="截止日期" width="180">
        <template #default="{ row }">
          <span>{{ formatDate(row.due_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="viewTaskDetail(row.id)">查看</el-button>
          <el-dropdown @command="command => handleCommandWithRow(command, row)" trigger="click">
            <el-button link type="primary">
              更多<el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item 
                  command="feedback" 
                  :disabled="!canSubmitFeedback(row.status)"
                >提交反馈</el-dropdown-item>
                <el-dropdown-item 
                  command="review" 
                  :disabled="!canReviewFeedback(row.status)"
                >审核反馈</el-dropdown-item>
                <el-dropdown-item 
                  command="complete" 
                  :disabled="row.status === 'completed'"
                >标记完成</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="taskCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchExecutionTasks, updateTaskStatus } from '@/api/execution'
import { EXECUTION_STATUS, PRIORITY, EXECUTION_TYPES } from '@/mock/execution'
import type { ExecutionTask, ExecutionTaskStatus, Priority, ExecutionTaskParams } from '@/types/execution'
import { useUserStore } from '@/store/user'

// 接收参数
const props = defineProps({
  filterByPendingFeedback: {
    type: Boolean,
    default: false
  },
  filterByPendingReview: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const taskList = ref<ExecutionTask[]>([])
const taskCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 标题计算属性
const pageTitle = computed(() => {
  if (props.filterByPendingFeedback) {
    return '待提交反馈任务'
  } else if (props.filterByPendingReview) {
    return '待审核反馈任务'
  }
  return '决策执行任务管理'
})

// 筛选表单
const filterForm = reactive({
  status: '' as ExecutionTaskStatus | '',
  priority: '' as Priority | '',
  assigned_to: '' as string | number
})

// 获取任务列表
const fetchTasks = async () => {
  loading.value = true
  try {
    const params: ExecutionTaskParams = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    if (filterForm.status) {
      params.status = filterForm.status as ExecutionTaskStatus
    }
    
    if (filterForm.priority) {
      params.priority = filterForm.priority as Priority
    }
    
    if (filterForm.assigned_to) {
      params.assigned_to = filterForm.assigned_to
    }
    
    const res = await fetchExecutionTasks(params)
    if (res.success) {
      taskList.value = res.data
      taskCount.value = res.meta.total
    } else {
      ElMessage.error(res.message || '获取任务列表失败')
    }
  } catch (error) {
    console.error('获取任务列表出错:', error)
    ElMessage.error('获取任务列表出错')
  } finally {
    loading.value = false
  }
}

// 设置初始过滤条件
const setupInitialFilters = () => {
  // 重置筛选条件
  filterForm.status = ''
  filterForm.priority = ''
  filterForm.assigned_to = ''
  
  // 根据特定视图设置筛选条件
  if (props.filterByPendingFeedback) {
    // 待提交反馈：进行中的任务，分配给当前用户（烟农）
    filterForm.status = EXECUTION_STATUS.IN_PROGRESS
    if (userStore.user) {
      filterForm.assigned_to = userStore.user.id
    }
  } else if (props.filterByPendingReview) {
    // 待审核反馈：已提交反馈的任务
    filterForm.status = EXECUTION_STATUS.FEEDBACK_SUBMITTED
  }
}

// 当过滤条件变化时更新数据
watch(
  [() => props.filterByPendingFeedback, () => props.filterByPendingReview],
  () => {
    setupInitialFilters()
    fetchTasks()
  },
  { immediate: true }
)

// 状态和优先级选项
const statusOptions = {
  [EXECUTION_STATUS.CREATED]: '已创建',
  [EXECUTION_STATUS.ASSIGNED]: '已分配',
  [EXECUTION_STATUS.NOTIFIED]: '已通知',
  [EXECUTION_STATUS.IN_PROGRESS]: '进行中',
  [EXECUTION_STATUS.FEEDBACK_SUBMITTED]: '已提交反馈',
  [EXECUTION_STATUS.FEEDBACK_VALIDATED]: '反馈已审核',
  [EXECUTION_STATUS.VERIFIED]: '已验证',
  [EXECUTION_STATUS.COMPLETED]: '已完成'
}

const priorityOptions = {
  [PRIORITY.HIGH]: '高',
  [PRIORITY.MEDIUM]: '中',
  [PRIORITY.LOW]: '低'
}

const taskTypeOptions = {
  [EXECUTION_TYPES.FERTILIZATION]: '施肥',
  [EXECUTION_TYPES.PEST_CONTROL]: '病虫害防治',
  [EXECUTION_TYPES.IRRIGATION]: '灌溉',
  [EXECUTION_TYPES.TOPPING]: '打顶',
  [EXECUTION_TYPES.WEEDING]: '除草',
  [EXECUTION_TYPES.HARVESTING]: '采收'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  return statusOptions[status] || status
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap = {
    [EXECUTION_STATUS.CREATED]: 'info',
    [EXECUTION_STATUS.ASSIGNED]: 'info',
    [EXECUTION_STATUS.NOTIFIED]: 'warning',
    [EXECUTION_STATUS.IN_PROGRESS]: 'warning',
    [EXECUTION_STATUS.FEEDBACK_SUBMITTED]: 'success',
    [EXECUTION_STATUS.FEEDBACK_VALIDATED]: 'success',
    [EXECUTION_STATUS.VERIFIED]: 'success',
    [EXECUTION_STATUS.COMPLETED]: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  return priorityOptions[priority] || priority
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap = {
    [PRIORITY.HIGH]: 'danger',
    [PRIORITY.MEDIUM]: 'warning',
    [PRIORITY.LOW]: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取任务类型名称
const getTaskTypeName = (type: string) => {
  return taskTypeOptions[type] || type
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 模拟获取地块名称
const getFieldName = (fieldId: number) => {
  const fieldMap: Record<number, string> = {
    1: '东山1号烟田',
    2: '西峰2号烟田',
    3: '北畈3号烟田'
  }
  return fieldMap[fieldId] || `地块 ${fieldId}`
}

// 是否可以提交反馈
const canSubmitFeedback = (status: ExecutionTaskStatus) => {
  return [
    EXECUTION_STATUS.ASSIGNED,
    EXECUTION_STATUS.NOTIFIED,
    EXECUTION_STATUS.IN_PROGRESS
  ].includes(status)
}

// 是否可以审核反馈
const canReviewFeedback = (status: string) => {
  return status === EXECUTION_STATUS.FEEDBACK_SUBMITTED
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  fetchTasks()
}

// 重置筛选
const resetFilter = () => {
  filterForm.status = ''
  filterForm.priority = ''
  filterForm.assigned_to = ''
  currentPage.value = 1
  fetchTasks()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTasks()
}

// 每页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchTasks()
}

// 行点击事件
const handleRowClick = (row: ExecutionTask) => {
  viewTaskDetail(row.id)
}

// 查看任务详情
const viewTaskDetail = (id: number) => {
  router.push(`/execution/tasks/${id}`)
}

// 创建任务
const goToCreateTask = () => {
  router.push('/execution/tasks/create')
}

// 处理下拉菜单命令
const handleCommandWithRow = (command: string, row: ExecutionTask) => {
  switch (command) {
    case 'edit':
      router.push(`/execution/tasks/edit/${row.id}`)
      break
    case 'feedback':
      router.push(`/execution/tasks/${row.id}/feedback`)
      break
    case 'review':
      router.push(`/execution/tasks/${row.id}/review`)
      break
    case 'complete':
      confirmComplete(row)
      break
    default:
      break
  }
}

// 确认完成
const confirmComplete = (task: ExecutionTask) => {
  ElMessageBox.confirm(
    '确定将此任务标记为已完成吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await updateTaskStatus(task.id, {
        status: EXECUTION_STATUS.COMPLETED,
        completion_percentage: 100
      })
      
      if (res.success) {
        ElMessage.success('任务已标记为完成')
        fetchTasks() // 刷新列表
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch (error) {
      console.error('更新任务状态出错:', error)
      ElMessage.error('更新任务状态出错')
    }
  }).catch(() => {
    // 取消操作
  })
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.execution-task-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
}

.title-wrapper h2 {
  margin: 0;
  margin-right: 10px;
}

.filter-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 