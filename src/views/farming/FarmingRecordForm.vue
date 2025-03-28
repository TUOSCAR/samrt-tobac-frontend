<template>
  <div class="farming-record-form" v-loading="loading">
    <div class="page-header">
      <div class="title-container">
        <el-page-header @back="goBack" />
        <h2>{{ isEdit ? '编辑农事记录' : '添加农事记录' }}</h2>
      </div>
    </div>
    
    <el-card>
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="地块" prop="field_id">
          <el-select 
            v-model="form.field_id" 
            placeholder="选择地块" 
            style="width: 100%" 
            filterable
            clearable
          >
            <el-option 
              v-for="field in fields" 
              :key="field.id" 
              :label="field.field_name" 
              :value="field.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="操作类型" prop="operation_type">
          <el-select 
            v-model="form.operation_type" 
            placeholder="选择操作类型" 
            style="width: 100%" 
            filterable
            clearable
          >
            <el-option 
              v-for="type in operationTypes" 
              :key="type.type_code" 
              :label="type.type_name" 
              :value="type.type_code">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="操作日期" prop="operation_date">
          <el-date-picker
            v-model="form.operation_date"
            type="datetime"
            placeholder="选择日期和时间"
            style="width: 100%"
            value-format="YYYY-MM-DDTHH:mm:ss.sssZ"
            format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        
        <el-form-item label="作业面积(亩)" prop="operation_area">
          <el-input-number 
            v-model="form.operation_area" 
            :precision="2" 
            :step="0.1" 
            :min="0" 
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="使用物料">
          <el-input v-model="form.materials_used" placeholder="请输入使用的物料" />
        </el-form-item>
        
        <el-form-item label="使用剂量">
          <el-input v-model="form.dosage" placeholder="请输入使用剂量" />
        </el-form-item>
        
        <el-form-item label="天气条件">
          <el-input v-model="form.weather_condition" placeholder="请输入操作时的天气条件" />
        </el-form-item>
        
        <el-form-item label="作业费用">
          <el-input-number 
            v-model="form.cost" 
            :precision="2" 
            :step="100" 
            :min="0" 
            style="width: 100%"
            placeholder="请输入作业费用"
          />
        </el-form-item>
        
        <el-form-item label="执行人" prop="performed_by">
          <el-select 
            v-model="form.performed_by" 
            placeholder="选择执行人员" 
            style="width: 100%" 
            filterable
            clearable
          >
            <el-option 
              v-for="user in users" 
              :key="user.id" 
              :label="user.username" 
              :value="user.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="相关任务">
          <el-select 
            v-model="form.execution_task_id" 
            placeholder="关联执行任务" 
            style="width: 100%" 
            filterable
            clearable
          >
            <el-option 
              v-for="task in executionTasks" 
              :key="task.id" 
              :label="`任务 #${task.id}: ${task.task_type}`" 
              :value="task.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="操作详情" prop="operation_details">
          <el-input 
            v-model="form.operation_details" 
            type="textarea" 
            :rows="5" 
            placeholder="请详细描述操作过程和情况"
          />
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input 
            v-model="form.notes" 
            type="textarea" 
            :rows="3" 
            placeholder="其他需要备注的信息"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { 
  getFarmingOperationById, 
  getFarmingOperationTypeList,
  createFarmingOperationRecord,
  updateFarmingOperationRecord
} from '@/api/farming'
import { getAllFields } from '@/api/field'
import { getUsers } from '@/api/system'
import { fetchExecutionTasks } from '@/api/execution'
import { useUserStore } from '@/store/user'
import type { ExecutionTaskStatus } from '@/types/execution'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const fields = ref<any[]>([])
const operationTypes = ref<any[]>([])
const users = ref<any[]>([])
const executionTasks = ref<any[]>([])
const taskLoading = ref(false)

// 判断是否是编辑模式
const isEdit = computed(() => {
  return route.path.includes('/edit/')
})

// 表单数据
const form = reactive({
  id: null as number | null,
  field_id: null as number | null,
  operation_type: '',
  operation_date: new Date().toISOString(),
  operation_details: '',
  operation_area: 0,
  materials_used: '',
  dosage: '',
  weather_condition: '',
  performed_by: userStore.user?.id || null,
  recorded_by: null as number | null,
  execution_task_id: null as number | null,
  cost: 0,
  notes: ''
})

// 表单验证规则
const rules = reactive({
  field_id: [
    { required: true, message: '请选择地块', trigger: 'change' }
  ],
  operation_type: [
    { required: true, message: '请选择操作类型', trigger: 'change' }
  ],
  operation_date: [
    { required: true, message: '请选择操作日期', trigger: 'change' }
  ],
  operation_details: [
    { required: true, message: '请输入操作详情', trigger: 'blur' }
  ],
  operation_area: [
    { required: true, message: '请输入作业面积', trigger: 'blur' }
  ],
  performed_by: [
    { required: true, message: '请选择执行人', trigger: 'change' }
  ]
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 重置表单
const resetForm = () => {
  if (isEdit.value) {
    // 如果是编辑模式，重新加载记录
    loadRecord()
  } else {
    // 如果是创建模式，清空表单
    formRef.value?.resetFields()
    
    // 设置默认值
    form.operation_date = new Date().toISOString()
    form.performed_by = userStore.user?.id || null
    form.recorded_by = null
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    
    // 设置记录人为当前用户
    form.recorded_by = userStore.user?.id ? Number(userStore.user.id) : null
    
    let res
    if (isEdit.value) {
      // 更新记录
      res = await updateFarmingOperationRecord(form.id!, form)
    } else {
      // 创建记录
      res = await createFarmingOperationRecord(form)
    }
    
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: `${isEdit.value ? '更新' : '创建'}农事记录成功`,
        duration: 2000,
        onClose: () => {
          router.push('/farming/records')
        }
      })
    } else {
      ElMessage.error(`${isEdit.value ? '更新' : '创建'}农事记录失败: ${res.message}`)
    }
  } catch (error) {
    console.error(`${isEdit.value ? '更新' : '创建'}农事记录出错`, error)
    ElMessage.error(`${isEdit.value ? '更新' : '创建'}农事记录出错`)
  } finally {
    loading.value = false
  }
}

// 加载地块列表
const loadFields = async () => {
  try {
    const res = await getAllFields()
    if (res.success) {
      fields.value = res.data
    }
  } catch (error) {
    console.error('加载地块列表出错', error)
  }
}

// 加载操作类型列表
const loadOperationTypes = async () => {
  try {
    const res = await getFarmingOperationTypeList()
    if (res.success) {
      operationTypes.value = res.data
    }
  } catch (error) {
    console.error('加载操作类型列表出错', error)
  }
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const res = await getUsers()
    users.value = res.data || []
  } catch (error) {
    console.error('加载用户列表失败', error)
  }
}

// 加载执行任务列表
const loadExecutionTasks = async () => {
  taskLoading.value = true
  try {
    // 获取执行任务列表
    const response = await fetchExecutionTasks({
      field_id: form.field_id ? String(form.field_id) : undefined,
      status: 'in_progress,completed' as ExecutionTaskStatus
    })
    
    executionTasks.value = response.data || []
  } catch (error) {
    console.error('加载执行任务失败', error)
    ElMessage.error('加载执行任务列表失败')
  } finally {
    taskLoading.value = false
  }
}

// 加载农事记录详情（编辑模式）
const loadRecord = async () => {
  if (!isEdit.value) return
  
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  try {
    loading.value = true
    const res = await getFarmingOperationById(id)
    
    if (res.success) {
      // 将获取的记录数据填充到表单中
      Object.assign(form, res.data)
    } else {
      ElMessage.error('获取农事记录详情失败')
    }
  } catch (error) {
    console.error('加载农事记录详情出错', error)
    ElMessage.error('加载农事记录详情出错')
  } finally {
    loading.value = false
  }
}

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadFields(),
    loadOperationTypes(),
    loadUsers(),
    loadExecutionTasks()
  ])
  
  // 如果是编辑模式，加载记录详情
  if (isEdit.value) {
    loadRecord()
  }
})
</script>

<style scoped>
.farming-record-form {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container h2 {
  margin: 0 0 0 20px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-textarea__inner) {
  font-family: inherit;
}
</style> 