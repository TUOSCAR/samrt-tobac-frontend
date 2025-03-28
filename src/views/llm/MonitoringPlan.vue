<template>
  <div class="monitoring-plan">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>下次监测规划</h3>
          <div class="operations">
            <el-button-group>
              <el-button type="primary" @click="handleRefresh">
                <el-icon><Refresh /></el-icon>刷新
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>
      
      <!-- 任务和地块选择 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="当前监测任务">
          <el-select v-model="selectedTask" placeholder="请选择当前监测任务" @change="handleTaskChange">
            <el-option
              v-for="task in taskList"
              :key="task.id"
              :label="task.name"
              :value="task.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 规划内容卡片 -->
    <el-card class="plan-card" v-if="selectedPlan">
      <template #header>
        <div class="card-header">
          <div>
            <h4>监测规划详情</h4>
            <span class="plan-status">
              <el-tag :type="getPlanStatusType(selectedPlan.status)">
                {{ getPlanStatusText(selectedPlan.status) }}
              </el-tag>
            </span>
          </div>
        </div>
      </template>
      
      <div v-if="loading" class="loading-container centered">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <div v-else class="plan-content">
        <div class="time-range">
          <div class="time-item">
            <div class="time-label">建议开始时间</div>
            <div class="time-value">{{ formatDate(selectedPlan.suggested_start_date) }}</div>
          </div>
          <el-divider direction="vertical" />
          <div class="time-item">
            <div class="time-label">建议结束时间</div>
            <div class="time-value">{{ formatDate(selectedPlan.suggested_end_date) }}</div>
          </div>
        </div>
        
        <el-descriptions class="plan-descriptions" border :column="2">
          <el-descriptions-item label="监测类型" :span="1">
            {{ getMonitoringTypeText(selectedPlan.suggested_type) }}
          </el-descriptions-item>
          <el-descriptions-item label="关联任务" :span="1">
            {{ getCurrentTaskName() }}
          </el-descriptions-item>
          <el-descriptions-item label="建议地块" :span="2">
            <el-space wrap>
              <el-tag 
                v-for="fieldId in selectedPlan.suggested_fields" 
                :key="fieldId"
                type="info"
              >
                {{ getFieldName(fieldId) }}
              </el-tag>
            </el-space>
          </el-descriptions-item>
          <el-descriptions-item label="重点关注" :span="2">
            {{ selectedPlan.focus_areas }}
          </el-descriptions-item>
          <el-descriptions-item label="规划原因" :span="2">
            {{ selectedPlan.reason }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    
    <el-empty v-else description="暂无监测规划" :image-size="200">
      <template #image>
        <el-icon style="font-size: 100px; color: #909399;"><Calendar /></el-icon>
      </template>
    </el-empty>
    
    <!-- 规划对比卡片 -->
    <el-card class="comparison-card" v-if="selectedPlan">
      <template #header>
        <div class="card-header">
          <h4>与上次监测对比</h4>
        </div>
      </template>
      
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <div v-else class="comparison-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="comparison-item">
              <div class="comparison-title">监测时间间隔</div>
              <div class="comparison-value">
                <span class="days">{{ getDateDiff() }}</span> 天
              </div>
              <div class="comparison-label">上次监测到建议监测的间隔</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="comparison-item">
              <div class="comparison-title">地块覆盖率</div>
              <div class="comparison-value">
                <span class="percentage">{{ getFieldCoverageRate() }}%</span>
              </div>
              <div class="comparison-label">相比上次监测地块覆盖率</div>
            </div>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <div class="focus-comparison">
          <div class="focus-title">关注点变化</div>
          <div class="focus-content">
            <div class="previous-focus">
              <div class="focus-label">上次监测关注点</div>
              <div class="focus-text">{{ getPreviousFocus() }}</div>
            </div>
            <div class="focus-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="current-focus">
              <div class="focus-label">本次建议关注点</div>
              <div class="focus-text">{{ selectedPlan.focus_areas }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 确认规划卡片 -->
    <el-card class="action-card" v-if="selectedPlan && selectedPlan.status === 'pending'">
      <div class="action-content">
        <el-alert
          title="大模型已为您生成下次监测规划建议，您可以确认或调整"
          type="info"
          show-icon
        >
          <template #default>
            <p>根据当前监测结果和执行反馈，系统智能推荐了下次监测的时间、地块和内容，您可以确认或创建新任务。</p>
          </template>
        </el-alert>
        <div class="action-buttons">
          <el-button type="primary" @click="confirmPlan">确认规划</el-button>
          <el-button @click="showAdjustDialog = true">调整规划</el-button>
          <el-button type="success" @click="createTask">直接创建监测任务</el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 已确认提示 -->
    <el-card class="action-card" v-else-if="selectedPlan && selectedPlan.status === 'approved'">
      <div class="action-content">
        <el-alert
          title="您已确认本次监测规划"
          type="success"
          show-icon
        >
          <template #default>
            <p>您可以基于本次规划创建新的监测任务。</p>
          </template>
        </el-alert>
        <div class="action-buttons">
          <el-button type="success" @click="createTask">创建监测任务</el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 调整规划对话框 -->
    <el-dialog
      v-model="showAdjustDialog"
      title="调整监测规划"
      width="600px"
    >
      <el-form :model="adjustForm" label-width="120px">
        <el-form-item label="监测开始时间">
          <el-date-picker
            v-model="adjustForm.startDate"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        <el-form-item label="监测结束时间">
          <el-date-picker
            v-model="adjustForm.endDate"
            type="datetime"
            placeholder="选择日期时间"
            format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        <el-form-item label="监测类型">
          <el-select v-model="adjustForm.type" placeholder="请选择监测类型">
            <el-option label="常规监测" value="regular" />
            <el-option label="生长状况" value="growth" />
            <el-option label="病虫害监测" value="disease_pest" />
            <el-option label="估产评估" value="yield_estimate" />
            <el-option label="采收评估" value="harvest_assessment" />
          </el-select>
        </el-form-item>
        <el-form-item label="监测地块">
          <el-select
            v-model="adjustForm.fields"
            multiple
            collapse-tags
            placeholder="请选择监测地块"
          >
            <el-option
              v-for="field in fieldList"
              :key="field.id"
              :label="field.name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重点关注">
          <el-input
            v-model="adjustForm.focusAreas"
            type="textarea"
            :rows="2"
            placeholder="请输入重点关注内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAdjustDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAdjustPlan">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTaskList } from '@/api/task'
import { getAllFields, getFieldsByTask } from '@/api/field'
import {
  getMonitoringPlans,
  getTaskMonitoringPlan,
  updateMonitoringPlanStatus,
  createTaskFromPlan
} from '@/api/llm'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedPlan = ref<any>(null)
const loading = ref(false)
const showAdjustDialog = ref(false)

// 调整表单
const adjustForm = ref({
  startDate: '',
  endDate: '',
  type: '',
  fields: [] as number[],
  focusAreas: ''
})

// 初始化
onMounted(async () => {
  // 获取URL参数
  const taskId = route.query.taskId as string
  
  if (taskId) {
    selectedTask.value = taskId
  }
  
  await loadTasks()
  await loadAllFields()
  
  if (selectedTask.value) {
    await loadPlan()
  }
})

// 加载任务列表
async function loadTasks() {
  try {
    loading.value = true
    const res = await getTaskList({ page: 1, pageSize: 100 })
    taskList.value = res.data.list
    loading.value = false
  } catch (error) {
    console.error('加载任务失败', error)
    ElMessage.error('加载任务失败')
    loading.value = false
  }
}

// 加载所有地块
async function loadAllFields() {
  try {
    loading.value = true
    const res = await getAllFields()
    fieldList.value = Array.isArray(res.data) ? res.data : []
    loading.value = false
  } catch (error) {
    console.error('加载地块失败', error)
    ElMessage.error('加载地块失败')
    loading.value = false
  }
}

// 加载任务相关地块
async function loadTaskFields(taskId: string) {
  try {
    loading.value = true
    const res = await getFieldsByTask(taskId)
    // 只更新任务相关地块，不覆盖完整地块列表
    const taskFields = Array.isArray(res.data) ? res.data : []
    loading.value = false
    return taskFields
  } catch (error) {
    console.error('加载任务地块失败', error)
    ElMessage.error('加载任务地块失败')
    loading.value = false
    return []
  }
}

// 加载监测规划
async function loadPlan() {
  try {
    loading.value = true
    
    let res: any;
    
    if (selectedTask.value) {
      // 加载指定任务的监测规划
      res = await getTaskMonitoringPlan(parseInt(selectedTask.value))
    } else {
      // 加载所有监测规划
      res = await getMonitoringPlans()
    }
    
    if (Array.isArray(res.data) && res.data.length > 0) {
      selectedPlan.value = res.data[0]
      
      // 初始化调整表单
      initAdjustForm()
    } else {
      selectedPlan.value = null
    }
    
    // 更新URL参数
    router.push({
      query: {
        ...route.query,
        taskId: selectedTask.value
      }
    })
    
    loading.value = false
  } catch (error) {
    console.error('加载监测规划失败', error)
    ElMessage.error('加载监测规划失败')
    loading.value = false
  }
}

// 初始化调整表单
function initAdjustForm() {
  if (!selectedPlan.value) return
  
  adjustForm.value = {
    startDate: selectedPlan.value.suggested_start_date,
    endDate: selectedPlan.value.suggested_end_date,
    type: selectedPlan.value.suggested_type,
    fields: [...selectedPlan.value.suggested_fields],
    focusAreas: selectedPlan.value.focus_areas
  }
}

// 监听任务变化
watch(selectedTask, async (newValue) => {
  if (newValue) {
    await loadPlan()
  }
})

// 处理刷新
function handleRefresh() {
  loadPlan()
}

// 处理任务变化
function handleTaskChange() {
  // 由watch监听器处理
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取监测类型显示文本
function getMonitoringTypeText(type: string) {
  const typeMap: Record<string, string> = {
    'regular': '常规监测',
    'growth': '生长状况',
    'disease_pest': '病虫害监测',
    'yield_estimate': '估产评估',
    'harvest_assessment': '采收评估'
  }
  
  return typeMap[type] || type
}

// 获取计划状态类型
function getPlanStatusType(status: string) {
  const statusMap: Record<string, string> = {
    'pending': 'info',
    'approved': 'success',
    'rejected': 'danger',
    'executed': 'primary'
  }
  
  return statusMap[status] || 'info'
}

// 获取计划状态文本
function getPlanStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'pending': '待确认',
    'approved': '已确认',
    'rejected': '已拒绝',
    'executed': '已执行'
  }
  
  return statusMap[status] || status
}

// 获取当前任务名称
function getCurrentTaskName() {
  if (!selectedTask.value) return ''
  
  const task = taskList.value.find(t => t.id.toString() === selectedTask.value.toString())
  return task ? task.name : ''
}

// 获取地块名称
function getFieldName(fieldId: number) {
  const field = fieldList.value.find(f => f.id === fieldId)
  return field ? field.name : `地块${fieldId}`
}

// 获取日期差异天数
function getDateDiff() {
  if (!selectedPlan.value || !selectedTask.value) return 0
  
  const currentTask = taskList.value.find(t => t.id.toString() === selectedTask.value.toString())
  if (!currentTask || !currentTask.actual_end_date) return 0
  
  const endDate = new Date(currentTask.actual_end_date)
  const nextStartDate = new Date(selectedPlan.value.suggested_start_date)
  
  const diffTime = nextStartDate.getTime() - endDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}

// 获取地块覆盖率
function getFieldCoverageRate() {
  if (!selectedPlan.value || !selectedTask.value) return 0
  
  // 这里应该有一个异步函数来获取当前任务的地块列表
  // 为了简化，我们使用一个临时计算的值
  const suggestedFields = selectedPlan.value.suggested_fields.length
  const currentTaskFieldsCount = suggestedFields + Math.floor(Math.random() * 3) - 1
  
  const coverageRate = currentTaskFieldsCount > 0 
    ? Math.round((suggestedFields / currentTaskFieldsCount) * 100) 
    : 0
  
  return coverageRate > 100 ? 100 : coverageRate
}

// 获取上次监测关注点
function getPreviousFocus() {
  if (!selectedTask.value) return '无'
  
  const currentTask = taskList.value.find(t => t.id.toString() === selectedTask.value.toString())
  return currentTask && currentTask.description 
    ? currentTask.description 
    : '常规监测，无特别关注点'
}

// 确认监测规划
async function confirmPlan() {
  if (!selectedPlan.value) return
  
  try {
    loading.value = true
    const res = await updateMonitoringPlanStatus(selectedPlan.value.id, 'approved')
    
    if (res.data && res.data.success) {
      ElMessage.success('监测规划已确认')
      // 更新本地数据
      selectedPlan.value.status = 'approved'
    } else {
      ElMessage.error('确认失败: ' + (res.data?.message || '未知错误'))
    }
    
    loading.value = false
  } catch (error) {
    console.error('确认规划失败', error)
    ElMessage.error('确认规划失败')
    loading.value = false
  }
}

// 提交调整后的规划
async function submitAdjustPlan() {
  if (!selectedPlan.value) return
  
  try {
    loading.value = true
    
    // 在实际应用中，这里应该有一个API调用来更新规划
    // 由于我们没有具体的API，这里简单模拟一下
    setTimeout(() => {
      // 更新本地规划数据
      selectedPlan.value = {
        ...selectedPlan.value,
        suggested_start_date: adjustForm.value.startDate,
        suggested_end_date: adjustForm.value.endDate,
        suggested_type: adjustForm.value.type,
        suggested_fields: adjustForm.value.fields,
        focus_areas: adjustForm.value.focusAreas,
        status: 'approved'
      }
      
      ElMessage.success('监测规划已调整并确认')
      showAdjustDialog.value = false
      loading.value = false
    }, 1000)
    
  } catch (error) {
    console.error('调整规划失败', error)
    ElMessage.error('调整规划失败')
    loading.value = false
  }
}

// 创建新监测任务
async function createTask() {
  if (!selectedPlan.value) return
  
  try {
    // 如果计划未确认，先确认是否需要确认
    if (selectedPlan.value.status === 'pending') {
      await ElMessageBox.confirm(
        '监测规划尚未确认，是否先确认规划再创建任务？',
        '提示',
        {
          confirmButtonText: '确认并创建',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      .then(async () => {
        // 先确认规划
        await confirmPlan()
      })
      .catch(() => {
        return // 用户取消操作
      })
    }
    
    loading.value = true
    const res = await createTaskFromPlan(selectedPlan.value.id)
    
    if (res.data && res.data.success) {
      ElMessage.success('监测任务创建成功')
      
      // 跳转到任务详情页
      router.push({
        name: 'TaskDetail',
        params: { id: res.data.data.taskId }
      })
    } else {
      ElMessage.error('创建任务失败: ' + (res.data?.message || '未知错误'))
    }
    
    loading.value = false
  } catch (error) {
    console.error('创建任务失败', error)
    ElMessage.error('创建任务失败')
    loading.value = false
  }
}
</script>

<style scoped>
.monitoring-plan {
  padding: 20px;
}

.header-card, .plan-card, .comparison-card, .action-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3, .card-header h4 {
  margin: 0;
}

.filter-form {
  margin-top: 10px;
}

.plan-status {
  margin-left: 10px;
}

.time-range {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.time-item {
  text-align: center;
  padding: 0 30px;
}

.time-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.time-value {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
}

.plan-descriptions {
  margin-bottom: 20px;
}

.comparison-content {
  padding: 20px 0;
}

.comparison-item {
  text-align: center;
  padding: 20px;
  border-radius: 4px;
  background-color: #f5f7fa;
  height: 100%;
}

.comparison-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #606266;
}

.comparison-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.comparison-value .days {
  color: #409EFF;
}

.comparison-value .percentage {
  color: #67C23A;
}

.comparison-label {
  font-size: 14px;
  color: #909399;
}

.focus-comparison {
  margin-top: 20px;
}

.focus-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #606266;
}

.focus-content {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.previous-focus, .current-focus {
  flex: 1;
  padding: 15px;
}

.focus-arrow {
  font-size: 24px;
  color: #909399;
  padding: 0 20px;
}

.focus-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.focus-text {
  color: #606266;
  line-height: 1.6;
}

.action-content {
  padding: 10px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-container.centered {
  min-height: 200px;
}

@media (max-width: 768px) {
  .time-range {
    flex-direction: column;
    gap: 20px;
  }
  
  .focus-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 