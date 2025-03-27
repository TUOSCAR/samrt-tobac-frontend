<template>
  <div class="task-edit">
    <el-page-header @back="goBack" :title="isEdit ? '编辑任务' : '创建任务'"></el-page-header>
    
    <div class="form-container" v-loading="loading">
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="100px"
        label-position="right"
        class="task-form"
      >
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          
          <el-form-item label="任务编号" prop="code" required>
            <el-input v-model="form.code" placeholder="请输入任务编号" :disabled="isEdit" />
          </el-form-item>
          
          <el-form-item label="任务名称" prop="name" required>
            <el-input v-model="form.name" placeholder="请输入任务名称" />
          </el-form-item>
          
          <el-form-item label="任务类型" prop="type" required>
            <el-select v-model="form.type" placeholder="请选择任务类型" style="width: 100%">
              <el-option 
                v-for="item in taskTypes" 
                :key="item.code" 
                :label="item.name" 
                :value="item.code"
              >
                <div class="task-type-option">
                  <span>{{ item.name }}</span>
                  <el-tooltip :content="item.description" placement="right" effect="light">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="生长阶段" prop="growingPhase" required>
            <el-select v-model="form.growingPhase" placeholder="请选择生长阶段" style="width: 100%">
              <el-option 
                v-for="(label, value) in growingPhaseOptions" 
                :key="value" 
                :label="label" 
                :value="value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="优先级" prop="priority" required>
            <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
              <el-option 
                v-for="(label, value) in priorityOptions" 
                :key="value" 
                :label="label" 
                :value="value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="计划时间" prop="scheduledDate" required>
            <el-date-picker
              v-model="form.scheduledDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="任务描述" prop="description">
            <el-input 
              v-model="form.description" 
              type="textarea" 
              :rows="3" 
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-card>
        
        <el-card class="mt-20">
          <template #header>
            <div class="card-header">
              <span>选择地块</span>
            </div>
          </template>
          
          <div class="field-selection">
            <div class="field-filter">
              <el-input
                v-model="fieldFilterKeyword"
                placeholder="搜索地块名称"
                clearable
                class="field-search"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
            
            <el-table
              :data="filteredFields"
              @selection-change="handleFieldSelectionChange"
              style="width: 100%"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" label="地块名称" />
              <el-table-column prop="area" label="面积(亩)" width="100" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getFieldStatusType(row.status)">
                    {{ getFieldStatusLabel(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        
        <div class="form-actions">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { InfoFilled, Search } from '@element-plus/icons-vue'
import { 
  getTaskDetail, createTask, updateTask, getTaskTypes,
} from '@/api/task'
import { TaskStatus, TaskPriority, GrowingPhase } from '@/types/task'
import { FieldStatus } from '@/types/field'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// 判断是编辑还是创建
const isEdit = computed(() => !!route.params.id)

// 加载和提交状态
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const form = reactive({
  id: '',
  code: '',
  name: '',
  type: '',
  growingPhase: GrowingPhase.GROWING,
  priority: TaskPriority.MEDIUM,
  scheduledDate: [null, null] as [string | null, string | null],
  description: '',
  fields: [] as { id: string }[]
})

// 表单验证规则
const rules = reactive<FormRules>({
  code: [
    { required: true, message: '请输入任务编号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9-_]{3,20}$/, message: '编号格式不正确', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  growingPhase: [
    { required: true, message: '请选择生长阶段', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  scheduledDate: [
    { required: true, message: '请选择计划时间', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        if (!value || !value[0] || !value[1]) {
          callback(new Error('请选择完整的时间范围'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
})

// 任务类型列表
const taskTypes = ref<any[]>([
  { code: 'field_survey', name: '田间调查', description: '对烟田进行实地调查和记录' },
  { code: 'growth_monitoring', name: '生长监测', description: '监测烟草植株的生长状况' },
  { code: 'pest_detection', name: '病虫害检测', description: '检测烟草植株的病虫害情况' },
  { code: 'harvest_estimation', name: '产量估算', description: '估算烟草的收获产量' }
])

// 生长阶段选项
const growingPhaseOptions = {
  [GrowingPhase.TRANSPLANTING]: '移栽期',
  [GrowingPhase.GROWING]: '旺长期',
  [GrowingPhase.TOPPING]: '打顶期',
  [GrowingPhase.HARVESTING]: '成熟采收期'
}

// 优先级选项
const priorityOptions = {
  [TaskPriority.HIGH]: '高',
  [TaskPriority.MEDIUM]: '中',
  [TaskPriority.LOW]: '低'
}

// 地块数据
const allFields = ref<any[]>([
  { id: '1', name: '东山1号烟田', area: 8.5, status: FieldStatus.ACTIVE },
  { id: '2', name: '西峰2号烟田', area: 6.2, status: FieldStatus.ACTIVE },
  { id: '3', name: '北湖3号烟田', area: 7.8, status: FieldStatus.ACTIVE },
  { id: '4', name: '南坡4号烟田', area: 5.3, status: FieldStatus.ACTIVE },
  { id: '5', name: '中心5号烟田', area: 9.1, status: FieldStatus.ACTIVE }
])

// 地块筛选
const fieldFilterKeyword = ref('')
const filteredFields = computed(() => {
  if (!fieldFilterKeyword.value) {
    return allFields.value
  }
  return allFields.value.filter(f => 
    f.name.toLowerCase().includes(fieldFilterKeyword.value.toLowerCase())
  )
})

// 地块选择变更
const handleFieldSelectionChange = (selectedFields: any[]) => {
  form.fields = selectedFields.map(field => ({ id: field.id }))
}

// 获取地块状态类型
const getFieldStatusType = (status: FieldStatus) => {
  const map: Record<string, string> = {
    [FieldStatus.ACTIVE]: 'success',
    [FieldStatus.INACTIVE]: 'warning',
    [FieldStatus.ARCHIVED]: 'info'
  }
  return map[status] || 'info'
}

// 获取地块状态标签
const getFieldStatusLabel = (status: FieldStatus) => {
  const map: Record<string, string> = {
    [FieldStatus.ACTIVE]: '正常',
    [FieldStatus.INACTIVE]: '停用',
    [FieldStatus.ARCHIVED]: '归档'
  }
  return map[status] || status
}

// 返回列表页
const goBack = () => {
  router.push('/tasks')
}

// 加载任务详情
const loadTaskDetail = async (id: string) => {
  loading.value = true
  try {
    const res = await getTaskDetail(id)
    const taskData = res.data || res
    
    // 填充表单数据
    form.id = taskData.id
    form.code = taskData.code
    form.name = taskData.name
    form.type = taskData.type
    form.growingPhase = taskData.growingPhase
    form.priority = taskData.priority
    form.description = taskData.description || ''
    form.scheduledDate = [taskData.scheduledStartDate, taskData.scheduledEndDate]
    
    // 设置已选地块
    if (taskData.fields && taskData.fields.length > 0) {
      form.fields = taskData.fields.map((field: any) => ({ id: field.id }))
      
      // 设置表格选中状态
      // 这里需要在表格渲染完成后设置
      setTimeout(() => {
        const fieldIds = new Set(taskData.fields?.map((f: any) => f.id) || [])
        const selection = allFields.value.filter(f => fieldIds.has(f.id))
        // TODO: 设置表格选中
      }, 200)
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

// 加载任务类型
const loadTaskTypes = async () => {
  try {
    const res = await getTaskTypes()
    taskTypes.value = res.data || res
  } catch (error) {
    console.error('获取任务类型失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 准备提交数据
    const [scheduledStartDate, scheduledEndDate] = form.scheduledDate
    const submitData: any = {
      ...form,
      scheduledStartDate: scheduledStartDate || '',
      scheduledEndDate: scheduledEndDate || '',
      scheduledDate: undefined
    }
    
    if (isEdit.value) {
      // 更新任务
      await updateTask(form.id, submitData)
      ElMessage.success('任务更新成功')
    } else {
      // 创建任务
      await createTask(submitData)
      ElMessage.success('任务创建成功')
    }
    
    // 返回列表页
    router.push('/tasks')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('表单验证失败或提交出错')
  } finally {
    submitting.value = false
  }
}

// 生命周期钩子
onMounted(async () => {
  // 加载任务类型列表
  await loadTaskTypes()
  
  // 如果是编辑模式，加载任务详情
  if (isEdit.value) {
    const id = route.params.id as string
    if (id) {
      await loadTaskDetail(id)
    }
  }
})
</script>

<style scoped>
.task-edit {
  padding: 20px;
}

.form-container {
  margin-top: 20px;
}

.task-form {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-weight: bold;
}

.field-selection {
  margin-top: 10px;
}

.field-search {
  margin-bottom: 15px;
  width: 300px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.task-type-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}
</style> 