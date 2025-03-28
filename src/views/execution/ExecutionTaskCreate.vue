<template>
  <div class="task-create-container">
    <div class="page-header">
      <div class="back-button" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <h2>创建执行任务</h2>
    </div>

    <el-card class="form-card">
      <el-form 
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
            创建任务
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { createExecutionTask, EXECUTION_TYPES, PRIORITY, getExecutionUsers } from '@/mock/execution'
import { fetchFieldList } from '@/mock/data'
import { ExecutionTaskType, Priority, User } from '@/types/execution'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)

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

// 任务表单数据
const taskForm = reactive({
  field_id: undefined as number | undefined,
  task_type: '' as ExecutionTaskType,
  task_content: '',
  priority: 'medium' as Priority,
  due_date: '',
  assigned_to: undefined as number | undefined
})

// 表单验证规则
const formRules = {
  field_id: [{ required: true, message: '请选择烟田', trigger: 'change' }],
  task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  task_content: [{ required: true, message: '请输入任务内容', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  due_date: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
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
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      
      try {
        const res = await createExecutionTask({
          field_id: taskForm.field_id,
          task_type: taskForm.task_type,
          task_content: taskForm.task_content,
          priority: taskForm.priority,
          due_date: taskForm.due_date,
          assigned_to: taskForm.assigned_to || 0
        })
        
        if (res.success) {
          ElMessage.success('任务创建成功')
          router.push('/execution/tasks')
        } else {
          ElMessage.error(res.message || '任务创建失败')
        }
      } catch (error) {
        console.error('创建任务失败', error)
        ElMessage.error('创建任务失败')
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
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadFieldList()
  loadUserList()
})
</script>

<style scoped>
.task-create-container {
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

.form-card {
  max-width: 800px;
  margin: 0 auto;
}
</style> 