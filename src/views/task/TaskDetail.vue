<template>
  <div class="task-detail" v-loading="loading">
    <el-page-header @back="goBack" :title="task ? task.name : '任务详情'">
      <template #extra>
        <el-button-group>
          <el-button @click="handleEdit" type="primary" :disabled="!canEdit">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <el-button @click="handleDelete" type="danger" :disabled="!canDelete">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </el-button-group>
      </template>
    </el-page-header>

    <div class="detail-content" v-if="task">
      <!-- 任务基本信息卡片 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>任务基本信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="任务编号" :span="1">
            {{ task.code }}
          </el-descriptions-item>
          <el-descriptions-item label="任务名称" :span="2">
            {{ task.name }}
          </el-descriptions-item>
          <el-descriptions-item label="任务类型" :span="1">
            {{ getTaskTypeName(task.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="生长阶段" :span="1">
            <el-tag :type="getGrowingPhaseType(task.growingPhase)">
              {{ getGrowingPhaseLabel(task.growingPhase) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级" :span="1">
            <el-tag :type="getPriorityType(task.priority)">
              {{ getPriorityLabel(task.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计划时间" :span="1">
            {{ task.scheduledStartDate }} 至 {{ task.scheduledEndDate }}
          </el-descriptions-item>
          <el-descriptions-item label="实际时间" :span="1">
            {{ task.actualStartDate || '-' }} 至 {{ task.actualEndDate || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="1">
            {{ task.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="3">
            {{ task.description || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建者" :span="1">
            {{ task.createdBy ? task.createdBy.username : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 任务状态跟踪卡片 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>任务状态</span>
            <el-button v-if="canUpdateStatus" @click="handleStatusChange" type="primary" size="small">
              更新状态
            </el-button>
          </div>
        </template>
        <el-steps :active="getStatusStep(task.status)" finish-status="success" process-status="process">
          <el-step title="已创建" description="任务已创建，等待开始" />
          <el-step title="数据采集" description="正在采集监测数据" />
          <el-step title="数据验证" description="对采集的数据进行验证" />
          <el-step title="基础分析" description="执行基础分析任务" />
          <el-step title="智能分析" description="执行大模型智能分析" />
          <el-step title="决策制定" description="制定处理方案和决策" />
          <el-step title="执行阶段" description="指导执行处理方案" />
          <el-step title="反馈收集" description="收集执行反馈" />
          <el-step title="已完成" description="任务完成归档" />
        </el-steps>
        <div class="status-current">
          <div class="status-label">当前状态：</div>
          <el-tag :type="getStatusType(task.status)" size="large">
            {{ getStatusLabel(task.status) }}
          </el-tag>
        </div>
        <div class="status-note">
          <el-alert
            :title="getStatusNote(task.status)"
            :type="getStatusAlertType(task.status)"
            show-icon
          />
        </div>
      </el-card>

      <!-- 地块信息卡片 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>地块信息</span>
            <el-button @click="handleManageFields" type="primary" size="small" :disabled="!canEdit">
              管理地块
            </el-button>
          </div>
        </template>
        <el-table v-if="task.fields && task.fields.length > 0" :data="task.fields" style="width: 100%">
          <el-table-column prop="id" label="地块ID" width="100" />
          <el-table-column prop="name" label="地块名称" min-width="180" />
          <el-table-column prop="area" label="面积(亩)" width="120" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.status === 'normal'" type="success">正常</el-tag>
              <el-tag v-else-if="row.status === 'warning'" type="warning">异常</el-tag>
              <el-tag v-else-if="row.status === 'offline'" type="info">离线</el-tag>
              <span v-else>{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button @click="viewField(row)" size="small" type="primary">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else description="暂无相关地块" />
      </el-card>

      <!-- 分析结果卡片 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>分析结果</span>
          </div>
        </template>
        <el-tabs>
          <el-tab-pane label="烟株计数">
            <div class="analysis-placeholder">
              <el-empty description="暂无烟株计数分析结果">
                <el-button type="primary">开始分析</el-button>
              </el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="长势分析">
            <div class="analysis-placeholder">
              <el-empty description="暂无长势分析结果">
                <el-button type="primary">开始分析</el-button>
              </el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="估产分析">
            <div class="analysis-placeholder">
              <el-empty description="暂无估产分析结果">
                <el-button type="primary">开始分析</el-button>
              </el-empty>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <el-empty v-else description="未找到任务信息" />

    <!-- 更新状态对话框 -->
    <el-dialog v-model="statusDialogVisible" title="更新任务状态" width="500px">
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusType(task?.status)">{{ getStatusLabel(task?.status) }}</el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="statusForm.status" style="width: 100%">
            <el-option
              v-for="status in getNextPossibleStatuses(task?.status)"
              :key="status"
              :label="getStatusLabel(status)"
              :value="status"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStatusChange">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 管理地块对话框 -->
    <el-dialog v-model="fieldsDialogVisible" title="管理地块" width="800px">
      <div class="field-manager">
        <div class="selected-fields">
          <h4>已选择地块</h4>
          <el-table :data="task?.fields || []" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="地块名称" min-width="150" />
            <el-table-column prop="area" label="面积" width="100" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="danger" size="small" @click="removeField(row)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="available-fields">
          <h4>可选地块</h4>
          <el-input v-model="fieldSearchKeyword" placeholder="搜索地块" clearable class="field-search" />
          <el-table :data="filteredAvailableFields" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="地块名称" min-width="150" />
            <el-table-column prop="area" label="面积" width="100" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="addField(row)">
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fieldsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFields">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTaskDetail, updateTaskStatus, getTaskTypes, updateTask, deleteTask } from '@/api/task'
import { TaskStatus, TaskPriority, GrowingPhase, type Task, type TaskType } from '@/types/task'
import { FieldStatus, type Field } from '@/types/field'

const route = useRoute()
const router = useRouter()

// 加载状态
const loading = ref(false)

// 任务数据
const task = ref<Task | null>(null)

// 任务类型列表
const taskTypes = ref<any[]>([])

// 权限控制
const canEdit = computed(() => {
  if (!task.value) return false
  return task.value.status === TaskStatus.CREATED
})

const canDelete = computed(() => {
  if (!task.value) return false
  return task.value.status === TaskStatus.CREATED
})

const canUpdateStatus = computed(() => {
  return !!task.value
})

// 状态对话框
const statusDialogVisible = ref(false)
const statusForm = ref({
  status: ''
})

// 获取下一可能状态
const getNextPossibleStatuses = (currentStatus?: TaskStatus) => {
  if (!currentStatus) return []

  const statusFlow: Record<TaskStatus, TaskStatus[]> = {
    [TaskStatus.CREATED]: [TaskStatus.DATA_COLLECTING],
    [TaskStatus.DATA_COLLECTING]: [TaskStatus.DATA_VALIDATING],
    [TaskStatus.DATA_VALIDATING]: [TaskStatus.BASIC_ANALYZING],
    [TaskStatus.BASIC_ANALYZING]: [TaskStatus.LLM_ANALYZING],
    [TaskStatus.LLM_ANALYZING]: [TaskStatus.DECISION_MAKING],
    [TaskStatus.DECISION_MAKING]: [TaskStatus.EXECUTING],
    [TaskStatus.EXECUTING]: [TaskStatus.FEEDBACK_COLLECTING],
    [TaskStatus.FEEDBACK_COLLECTING]: [TaskStatus.COMPLETED, TaskStatus.PLANNING_NEXT],
    [TaskStatus.COMPLETED]: [],
    [TaskStatus.PLANNING_NEXT]: [TaskStatus.CREATED]
  }

  return statusFlow[currentStatus] || []
}

// 地块管理对话框
const fieldsDialogVisible = ref(false)
const fieldSearchKeyword = ref('')
const availableFields = ref<Partial<Field>[]>([
  { id: '1', name: '东山1号烟田', area: 8.5, status: FieldStatus.ACTIVE },
  { id: '2', name: '西峰2号烟田', area: 6.2, status: FieldStatus.ACTIVE },
  { id: '3', name: '北湖3号烟田', area: 7.8, status: FieldStatus.ACTIVE },
  { id: '4', name: '南坡4号烟田', area: 5.3, status: FieldStatus.ACTIVE },
  { id: '5', name: '中心5号烟田', area: 9.1, status: FieldStatus.ACTIVE }
])

// 过滤可用地块
const filteredAvailableFields = computed(() => {
  const selectedIds = new Set((task.value?.fields || []).map(f => f.id))
  let filtered = availableFields.value.filter(f => !selectedIds.has(f.id))
  
  if (fieldSearchKeyword.value) {
    filtered = filtered.filter(f => 
      f.name && f.name.toLowerCase().includes(fieldSearchKeyword.value.toLowerCase())
    )
  }
  
  return filtered
})

// 获取任务类型名称
const getTaskTypeName = (typeCode: string) => {
  const type = taskTypes.value.find(item => item.code === typeCode)
  return type ? type.name : typeCode
}

// 获取生长阶段类型
const getGrowingPhaseType = (phase: string) => {
  const typeMap: Record<string, string> = {
    transplanting: 'success',
    growing: 'primary',
    topping: 'warning',
    harvesting: 'danger'
  }
  return typeMap[phase] || 'info'
}

// 获取生长阶段标签
const getGrowingPhaseLabel = (phase: string) => {
  const labelMap: Record<string, string> = {
    transplanting: '移栽期',
    growing: '旺长期',
    topping: '打顶期',
    harvesting: '成熟采收期'
  }
  return labelMap[phase] || phase
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labelMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return labelMap[priority] || priority
}

// 获取状态类型
const getStatusType = (status?: TaskStatus) => {
  if (!status) return 'info'
  
  const statusMap: Record<string, string> = {
    created: 'info',
    data_collecting: 'warning',
    data_validating: 'warning',
    basic_analyzing: 'primary',
    llm_analyzing: 'primary',
    decision_making: 'primary',
    executing: 'success',
    feedback_collecting: 'success',
    completed: 'success',
    planning_next: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status?: TaskStatus) => {
  if (!status) return '-'
  
  const statusMap: Record<string, string> = {
    created: '已创建',
    data_collecting: '数据采集中',
    data_validating: '数据验证中',
    basic_analyzing: '基础分析中',
    llm_analyzing: '智能分析中',
    decision_making: '决策制定中',
    executing: '执行中',
    feedback_collecting: '反馈收集中',
    completed: '已完成',
    planning_next: '规划下次监测'
  }
  return statusMap[status] || status
}

// 获取状态步骤
const getStatusStep = (status: TaskStatus) => {
  const statusSteps: Record<TaskStatus, number> = {
    created: 0,
    data_collecting: 1,
    data_validating: 2,
    basic_analyzing: 3,
    llm_analyzing: 4,
    decision_making: 5,
    executing: 6,
    feedback_collecting: 7,
    completed: 8,
    planning_next: 8
  }
  return statusSteps[status] || 0
}

// 获取状态提示
const getStatusNote = (status: TaskStatus) => {
  const statusNotes: Record<TaskStatus, string> = {
    created: '任务已创建，请准备开始数据采集',
    data_collecting: '正在进行数据采集，请确保按时完成',
    data_validating: '请验证数据的完整性和准确性',
    basic_analyzing: '系统正在执行基础分析，请耐心等待',
    llm_analyzing: '大模型智能分析进行中，这可能需要一些时间',
    decision_making: '请根据分析结果制定相应决策',
    executing: '请按照决策方案执行相关操作',
    feedback_collecting: '请收集执行反馈信息',
    completed: '任务已完成，可以查看所有结果',
    planning_next: '正在规划下次监测任务'
  }
  return statusNotes[status] || '状态未知'
}

// 获取状态提示类型
const getStatusAlertType = (status: TaskStatus) => {
  const alertTypes: Record<TaskStatus, string> = {
    created: 'info',
    data_collecting: 'warning',
    data_validating: 'warning',
    basic_analyzing: 'info',
    llm_analyzing: 'info',
    decision_making: 'warning',
    executing: 'warning',
    feedback_collecting: 'warning',
    completed: 'success',
    planning_next: 'info'
  }
  return alertTypes[status] || 'info'
}

// 返回列表
const goBack = () => {
  router.push('/tasks')
}

// 编辑任务
const handleEdit = () => {
  router.push(`/tasks/edit/${task.value?.id}`)
}

// 删除任务
const handleDelete = () => {
  if (!task.value) return
  
  ElMessageBox.confirm('确认删除该任务吗？删除后无法恢复！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTask(task.value!.id)
      ElMessage.success('删除成功')
      router.push('/tasks')
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 更新状态
const handleStatusChange = () => {
  if (!task.value) return
  
  statusForm.value.status = getNextPossibleStatuses(task.value.status)[0] || ''
  statusDialogVisible.value = true
}

// 提交状态变更
const submitStatusChange = async () => {
  if (!task.value || !statusForm.value.status) return
  
  try {
    await updateTaskStatus(task.value.id, statusForm.value.status)
    ElMessage.success('状态更新成功')
    await fetchTaskDetail()
    statusDialogVisible.value = false
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 管理地块
const handleManageFields = () => {
  fieldsDialogVisible.value = true
}

// 添加地块
const addField = (field: any) => {
  if (!task.value) return
  
  if (!task.value.fields) {
    task.value.fields = []
  }
  
  task.value.fields.push({ ...field })
}

// 移除地块
const removeField = (field: any) => {
  if (!task.value || !task.value.fields) return
  
  const index = task.value.fields.findIndex(f => f.id === field.id)
  if (index !== -1) {
    task.value.fields.splice(index, 1)
  }
}

// 保存地块配置
const saveFields = async () => {
  if (!task.value) return
  
  try {
    const fieldIds = task.value.fields?.map(f => f.id) || []
    await updateTask(task.value.id, { fields: fieldIds } as any)
    ElMessage.success('地块更新成功')
    fieldsDialogVisible.value = false
  } catch (error) {
    console.error('地块更新失败:', error)
    ElMessage.error('地块更新失败')
  }
}

// 查看地块详情
const viewField = (field: any) => {
  router.push(`/fields/${field.id}`)
}

// 获取任务详情
const fetchTaskDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少任务ID')
    return
  }
  
  loading.value = true
  try {
    const res = await getTaskDetail(id)
    task.value = res.data || res
  } catch (error) {
    console.error('获取任务详情失败:', error)
    ElMessage.error('获取任务详情失败')
  } finally {
    loading.value = false
  }
}

// 获取任务类型列表
const loadTaskTypes = async () => {
  try {
    const res = await getTaskTypes()
    taskTypes.value = res.data || res
  } catch (error) {
    console.error('获取任务类型失败:', error)
    ElMessage.error('获取任务类型失败')
  }
}

// 生命周期钩子
onMounted(() => {
  fetchTaskDetail()
  loadTaskTypes()
})
</script>

<style scoped>
.task-detail {
  padding: 20px;
}

.detail-content {
  margin-top: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-current {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.status-label {
  margin-right: 8px;
  font-weight: bold;
}

.status-note {
  margin: 20px 0;
}

.field-manager {
  display: flex;
  gap: 20px;
}

.selected-fields,
.available-fields {
  flex: 1;
}

.field-search {
  margin-bottom: 15px;
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
}

.analysis-placeholder {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-step__title) {
  font-size: 14px !important;
}

:deep(.el-step__description) {
  font-size: 12px !important;
}
</style> 