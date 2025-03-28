<template>
  <div class="task-edit-container">
    <div class="page-header">
      <div class="back-button" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <h2>编辑执行任务</h2>
    </div>

    <el-card v-loading="loading" class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ taskData ? `编辑任务: ${taskData.task_code}` : '加载中...' }}</span>
        </div>
      </template>

      <el-form 
        v-if="taskData"
        ref="formRef" 
        :model="taskForm" 
        :rules="formRules" 
        label-width="120px"
        label-position="right"
        status-icon
      >
        <el-form-item label="烟田" prop="field_id">
          <el-select 
            v-model="taskForm.field_id" 
            placeholder="选择烟田" 
            style="width: 100%"
          >
            <el-option
              v-for="field in fieldList"
              :key="field.id"
              :label="field.name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务类型" prop="task_type">
          <el-select 
            v-model="taskForm.task_type" 
            placeholder="选择任务类型" 
            style="width: 100%"
          >
            <el-option
              v-for="(label, value) in taskTypeMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务内容" prop="task_content">
          <el-input
            v-model="taskForm.task_content"
            type="textarea"
            :rows="3"
            placeholder="请输入详细的任务内容、执行方法等"
          />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-select 
            v-model="taskForm.priority" 
            placeholder="选择优先级" 
            style="width: 100%"
          >
            <el-option
              v-for="(label, value) in priorityMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="截止日期" prop="due_date">
          <el-date-picker
            v-model="taskForm.due_date"
            type="datetime"
            placeholder="选择截止日期时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select 
            v-model="taskForm.status" 
            placeholder="选择状态" 
            style="width: 100%"
          >
            <el-option
              v-for="(label, value) in statusMap"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="完成百分比" prop="completion_percentage">
          <el-slider
            v-model="taskForm.completion_percentage"
            :step="5"
            :marks="{0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%'}"
          />
        </el-form-item>

        <el-form-item label="指派用户" prop="assigned_to">
          <el-select 
            v-model="taskForm.assigned_to" 
            placeholder="选择指派用户（可选）" 
            style="width: 100%"
            clearable
          >
            <el-option-group label="烟农">
              <el-option
                v-for="user in farmerList"
                :key="user.id"
                :label="user.name"
                :value="user.id"
              />
            </el-option-group>
            <el-option-group label="技术员">
              <el-option
                v-for="user in technicianList"
                :key="user.id"
                :label="user.name"
                :value="user.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            保存修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
      <div v-else class="empty-tips">
        <p>任务数据加载中或未找到...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { 
  fetchExecutionTaskDetail, 
  updateExecutionTask, 
  getExecutionUsers,
  EXECUTION_TYPES, 
  PRIORITY,
  EXECUTION_STATUS
} from '@/mock/execution'
import { fetchFieldList } from '@/mock/data'
import { ExecutionTask, ExecutionTaskType, ExecutionTaskStatus, Priority, User } from '@/types/execution'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const taskId = ref(parseInt(route.params.id as string))
const loading = ref(false)
const submitting = ref(false)
const taskData = ref<ExecutionTask | null>(null)

// 烟田列表
const fieldList = ref<{ id: number; name: string }[]>([])

// 用户列表
const farmerList = ref<User[]>([])
const technicianList = ref<User[]>([])

// 任务类型映射
const taskTypeMap: Record<string, string> = {
  fertilization: '施肥',
  pest_control: '病虫害防治',
  irrigation: '灌溉',
  topping: '打顶',
  weeding: '除草',
  harvesting: '收获'
}

// 优先级映射
const priorityMap: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低'
}

// 状态映射
const statusMap: Record<string, string> = {
  created: '已创建',
  assigned: '已分配',
  notified: '已通知',
  in_progress: '进行中',
  feedback_submitted: '已提交反馈',
  feedback_validated: '已验证反馈',
  verified: '已验证',
  completed: '已完成'
}

// 任务表单数据
const taskForm = reactive({
  field_id: undefined as number | undefined,
  task_type: '' as ExecutionTaskType,
  task_content: '',
  priority: 'medium' as Priority,
  due_date: '',
  status: 'created' as ExecutionTaskStatus,
  completion_percentage: 0,
  assigned_to: undefined as number | undefined
})

// 表单验证规则
const formRules = {
  field_id: [{ required: true, message: '请选择烟田', trigger: 'change' }],
  task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  task_content: [{ required: true, message: '请输入任务内容', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  due_date: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 加载任务详情
const loadTaskDetail = async () => {
  loading.value = true
  try {
    const res = await fetchExecutionTaskDetail(taskId.value)
    if (res.success && res.data) {
      taskData.value = res.data
      // 填充表单数据
      Object.assign(taskForm, {
        field_id: res.data.field_id,
        task_type: res.data.task_type,
        task_content: res.data.task_content,
        priority: res.data.priority,
        due_date: res.data.due_date,
        status: res.data.status,
        completion_percentage: res.data.completion_percentage,
        assigned_to: res.data.assigned_to || undefined
      })
    } else {
      ElMessage.error('任务不存在或已被删除')
      router.push('/execution/tasks')
    }
  } catch (error) {
    console.error('获取任务详情失败', error)
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

// 加载烟田列表
const loadFieldList = async () => {
  try {
    const res = await fetchFieldList()
    if (res.success) {
      fieldList.value = res.data
    }
  } catch (error) {
    console.error('获取烟田列表失败', error)
    ElMessage.error('获取烟田列表失败')
  }
}

// 加载用户列表
const loadUserList = async () => {
  try {
    // 获取技术员列表
    const techRes = await getExecutionUsers('technician')
    if (techRes.success) {
      technicianList.value = techRes.data
    }
    
    // 获取烟农列表
    const farmerRes = await getExecutionUsers('farmer')
    if (farmerRes.success) {
      farmerList.value = farmerRes.data
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value || !taskData.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      
      try {
        const res = await updateExecutionTask(taskId.value, {
          field_id: taskForm.field_id,
          task_type: taskForm.task_type,
          task_content: taskForm.task_content,
          priority: taskForm.priority,
          due_date: taskForm.due_date,
          status: taskForm.status,
          completion_percentage: taskForm.completion_percentage,
          assigned_to: taskForm.assigned_to || 0
        })
        
        if (res.success) {
          ElMessage.success('任务更新成功')
          router.push(`/execution/tasks/${taskId.value}`)
        } else {
          ElMessage.error(res.message || '任务更新失败')
        }
      } catch (error) {
        console.error('更新任务失败', error)
        ElMessage.error('更新任务失败')
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.warning('请完善表单信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (!taskData.value) return
  
  // 重置为原始数据
  Object.assign(taskForm, {
    field_id: taskData.value.field_id,
    task_type: taskData.value.task_type,
    task_content: taskData.value.task_content,
    priority: taskData.value.priority,
    due_date: taskData.value.due_date,
    status: taskData.value.status,
    completion_percentage: taskData.value.completion_percentage,
    assigned_to: taskData.value.assigned_to || undefined
  })
}

// 页面加载时获取数据
onMounted(() => {
  loadTaskDetail()
  loadFieldList()
  loadUserList()
})
</script>

<style scoped>
.task-edit-container {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.empty-tips {
  text-align: center;
  padding: 30px;
  color: var(--el-text-color-secondary);
}
</style> 