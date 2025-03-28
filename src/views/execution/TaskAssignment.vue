<template>
  <div class="task-assignment-container">
    <div class="page-header">
      <div class="back-button" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <h2>执行任务分配</h2>
    </div>

    <el-card class="filter-card">
      <el-form :model="filterForm" label-width="80px" inline>
        <el-form-item label="字段">
          <el-select v-model="filterForm.field_id" placeholder="选择烟田" clearable>
            <el-option
              v-for="field in fieldList"
              :key="field.id"
              :label="field.name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
            <el-option
              v-for="(label, value) in statusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="filterForm.priority" placeholder="选择优先级" clearable>
            <el-option
              v-for="(label, value) in priorityMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchTasks">
            <el-icon><Search /></el-icon>筛选
          </el-button>
          <el-button @click="resetFilter">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="assignment-section">
      <el-card class="assignment-card">
        <template #header>
          <div class="card-header">
            <span>待分配任务</span>
            <div class="header-actions">
              <el-button 
                type="primary" 
                :disabled="selectedTasks.length === 0 || !selectedUser"
                @click="assignTasksToUser"
              >
                <el-icon><Check /></el-icon>分配给所选用户
              </el-button>
            </div>
          </div>
        </template>

        <el-table 
          v-loading="loading"
          :data="tasks" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="task_code" label="任务编号" width="120" />
          <el-table-column label="烟田" width="120">
            <template #default="scope">
              {{ getFieldName(scope.row.field_id) }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template #default="scope">
              {{ taskTypeMap[scope.row.task_type] || '未知类型' }}
            </template>
          </el-table-column>
          <el-table-column prop="task_content" label="任务内容" min-width="200" show-overflow-tooltip />
          <el-table-column label="优先级" width="100">
            <template #default="scope">
              <el-tag :type="getPriorityTag(scope.row.priority)">
                {{ priorityMap[scope.row.priority] || '未知' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusTag(scope.row.status)">
                {{ statusMap[scope.row.status] || '未知状态' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="due_date" label="截止日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.due_date) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="viewTaskDetail(scope.row.id)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <el-card class="users-card">
        <template #header>
          <div class="card-header">
            <span>选择用户</span>
            <div class="header-actions">
              <el-radio-group v-model="userRole" @change="fetchUsers">
                <el-radio-button label="farmer">烟农</el-radio-button>
                <el-radio-button label="technician">技术员</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>

        <el-table 
          v-loading="usersLoading"
          :data="users" 
          style="width: 100%"
          highlight-current-row
          @current-change="handleUserChange"
        >
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column label="角色" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.role === 'farmer' ? 'success' : 'warning'">
                {{ scope.row.role === 'farmer' ? '烟农' : '技术员' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="selectUser(scope.row)"
              >
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-dialog
      v-model="assignDialogVisible"
      title="确认任务分配"
      width="500px"
    >
      <div class="assign-confirm">
        <p>您将把以下 {{ selectedTasks.length }} 个任务分配给 <strong>{{ selectedUser?.name }}</strong></p>
        <div v-if="selectedTasks.length <= 5">
          <p v-for="task in selectedTasks" :key="task.id" class="task-item">
            {{ task.task_code }}: {{ task.task_content }}
          </p>
        </div>
        <p v-else>
          任务过多，请确认您已仔细审核所选任务。
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAssignment" :loading="assignLoading">
            确认分配
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Search, Refresh, Check } from '@element-plus/icons-vue'
import { 
  fetchExecutionTasks, 
  assignTasks,
  getExecutionUsers,
  EXECUTION_STATUS,
  PRIORITY,
  EXECUTION_TYPES
} from '@/mock/execution'
import { fetchFieldList } from '@/mock/data'
import { ExecutionTask, ExecutionTaskStatus, Priority, User, UserAssignmentData } from '@/types/execution'
import { formatDate } from '@/utils/date'

const router = useRouter()

// 状态映射
const statusMap: Record<ExecutionTaskStatus, string> = {
  created: '已创建',
  assigned: '已分配',
  notified: '已通知',
  in_progress: '进行中',
  feedback_submitted: '已提交反馈',
  feedback_validated: '已验证反馈',
  verified: '已验证',
  completed: '已完成'
}

// 优先级映射
const priorityMap: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低'
}

// 任务类型映射
const taskTypeMap: Record<string, string> = {
  fertilization: '施肥',
  pest_control: '病虫害防治',
  irrigation: '灌溉',
  topping: '打顶',
  weeding: '除草',
  harvesting: '收获'
}

// 字段列表
const fieldList = ref<{ id: number; name: string }[]>([])

// 任务数据
const tasks = ref<ExecutionTask[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedTasks = ref<ExecutionTask[]>([])

// 用户数据
const users = ref<User[]>([])
const usersLoading = ref(false)
const userRole = ref('farmer')
const selectedUser = ref<User | null>(null)

// 分配对话框
const assignDialogVisible = ref(false)
const assignLoading = ref(false)

// 筛选条件
const filterForm = reactive({
  field_id: undefined as number | undefined,
  status: EXECUTION_STATUS.CREATED as ExecutionTaskStatus,
  priority: undefined as Priority | undefined
})

// 获取烟田列表
const fetchFields = async () => {
  try {
    const res = await fetchFieldList()
    if (res.success) {
      fieldList.value = res.data
    }
  } catch (error) {
    console.error('获取烟田列表失败', error)
  }
}

// 获取任务列表
const fetchTasks = async () => {
  loading.value = true
  try {
    const params = {
      field_id: filterForm.field_id,
      status: filterForm.status,
      priority: filterForm.priority,
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    const res = await fetchExecutionTasks(params)
    if (res.success) {
      tasks.value = res.data
      total.value = res.meta.total
    }
  } catch (error) {
    console.error('获取任务列表失败', error)
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 获取用户列表
const fetchUsers = async () => {
  usersLoading.value = true
  try {
    const res = await getExecutionUsers(userRole.value)
    if (res.success) {
      users.value = res.data
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    usersLoading.value = false
  }
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.field_id = undefined
  filterForm.status = EXECUTION_STATUS.CREATED
  filterForm.priority = undefined
  fetchTasks()
}

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchTasks()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTasks()
}

// 处理任务选择变化
const handleSelectionChange = (val: ExecutionTask[]) => {
  selectedTasks.value = val
}

// 处理用户选择变化
const handleUserChange = (val: User) => {
  selectedUser.value = val
}

// 选择用户
const selectUser = (user: User) => {
  selectedUser.value = user
}

// 获取烟田名称
const getFieldName = (fieldId: number) => {
  const field = fieldList.value.find(f => f.id === fieldId)
  return field ? field.name : `烟田${fieldId}`
}

// 获取优先级标签类型
const getPriorityTag = (priority: Priority) => {
  const map: Record<Priority, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority]
}

// 获取状态标签类型
const getStatusTag = (status: ExecutionTaskStatus) => {
  const map: Record<ExecutionTaskStatus, string> = {
    created: 'info',
    assigned: 'warning',
    notified: 'warning',
    in_progress: 'primary',
    feedback_submitted: 'success',
    feedback_validated: 'success',
    verified: 'success',
    completed: 'success'
  }
  return map[status]
}

// 查看任务详情
const viewTaskDetail = (taskId: number) => {
  router.push(`/execution/tasks/${taskId}`)
}

// 分配任务给用户
const assignTasksToUser = () => {
  if (selectedTasks.value.length === 0 || !selectedUser.value) {
    ElMessage.warning('请选择任务和用户')
    return
  }
  
  assignDialogVisible.value = true
}

// 确认分配
const confirmAssignment = async () => {
  if (selectedTasks.value.length === 0 || !selectedUser.value) {
    ElMessage.warning('请选择任务和用户')
    return
  }
  
  assignLoading.value = true
  
  try {
    const data: UserAssignmentData = {
      task_ids: selectedTasks.value.map(task => task.id),
      user_id: selectedUser.value.id,
      assigned_by: 1 // 假设当前用户ID为1
    }
    
    const res = await assignTasks(data)
    
    if (res.success) {
      ElMessage.success(res.message)
      assignDialogVisible.value = false
      fetchTasks() // 刷新任务列表
    } else {
      ElMessage.error(res.message || '分配任务失败')
    }
  } catch (error) {
    console.error('分配任务失败', error)
    ElMessage.error('分配任务失败')
  } finally {
    assignLoading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  fetchFields()
  fetchTasks()
  fetchUsers()
})
</script>

<style scoped>
.task-assignment-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 20px;
  color: var(--el-color-primary);
}

.filter-card {
  margin-bottom: 20px;
}

.assignment-section {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.task-item {
  margin: 5px 0;
  padding: 5px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.assign-confirm {
  margin-bottom: 20px;
}
</style> 