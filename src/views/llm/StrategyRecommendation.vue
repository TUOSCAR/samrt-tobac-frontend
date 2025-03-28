<template>
  <div class="strategy-recommendation">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>策略推演</h3>
          <div class="operations">
            <el-button-group>
              <el-button type="primary" @click="handleExport">
                <el-icon><Download /></el-icon>导出
              </el-button>
              <el-button @click="handleRefresh">
                <el-icon><Refresh /></el-icon>刷新
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>
      
      <!-- 任务和地块选择 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="监测任务">
          <el-select v-model="selectedTask" placeholder="请选择监测任务" @change="handleTaskChange">
            <el-option
              v-for="task in taskList"
              :key="task.id"
              :label="task.name"
              :value="task.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地块">
          <el-select v-model="selectedField" placeholder="请选择地块" @change="handleFieldChange">
            <el-option
              v-for="field in fieldList"
              :key="field.id"
              :label="field.name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 策略概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>策略类型</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedStrategy && selectedStrategy.recommendation_type" class="stats-content">
            <el-tag :type="getStrategyTypeTag(selectedStrategy.recommendation_type)" size="large">
              {{ getStrategyTypeName(selectedStrategy.recommendation_type) }}
            </el-tag>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>优先级</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedStrategy && selectedStrategy.priority" class="stats-content">
            <el-tag :type="getPriorityTag(selectedStrategy.priority)" size="large">
              {{ getPriorityName(selectedStrategy.priority) }}
            </el-tag>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>执行期限</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedStrategy && selectedStrategy.execution_deadline" class="stats-content">
            <div class="stats-value" :class="getDeadlineClass(selectedStrategy.execution_deadline)">
              {{ formatDate(selectedStrategy.execution_deadline) }}
            </div>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 策略详情 -->
    <el-card class="strategy-card">
      <template #header>
        <div class="card-header">
          <h4>策略详情</h4>
          <div v-if="selectedStrategy && selectedStrategy.confidence_score" class="confidence-badge">
            <el-tooltip content="AI分析置信度" placement="top">
              <div class="confidence-score">
                置信度: {{ (selectedStrategy.confidence_score * 100).toFixed(0) }}%
              </div>
            </el-tooltip>
          </div>
        </div>
      </template>
      <div v-if="loading" class="loading-container centered">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <div v-else-if="selectedStrategy && selectedStrategy.recommendation_content" class="strategy-content">
        <div class="strategy-steps">
          <div v-for="(step, index) in formattedSteps" :key="index" class="strategy-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">{{ step }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无策略建议</div>
    </el-card>

    <!-- 优先级可视化 -->
    <el-card class="priority-card">
      <template #header>
        <div class="card-header">
          <h4>优先级可视化</h4>
        </div>
      </template>
      <div class="priority-container">
        <div v-if="loading" class="loading-container centered">
          <el-icon class="is-loading"><Loading /></el-icon>
        </div>
        <div v-else-if="strategyList.length > 0" class="priority-visualizer">
          <div id="priority-chart" class="priority-chart"></div>
        </div>
        <div v-else class="no-data">暂无优先级数据</div>
      </div>
    </el-card>

    <!-- 执行时间线 -->
    <el-card class="timeline-card">
      <template #header>
        <div class="card-header">
          <h4>执行时间线</h4>
        </div>
      </template>
      <div class="timeline-container">
        <div v-if="loading" class="loading-container centered">
          <el-icon class="is-loading"><Loading /></el-icon>
        </div>
        <div v-else-if="selectedStrategy" class="timeline">
          <el-timeline>
            <el-timeline-item
              timestamp="监测完成"
              placement="top"
              :type="timelineItemType('created')"
              color="#409EFF"
            >
              <div class="timeline-content">
                <h5>监测分析完成</h5>
                <p>{{ formatDate(selectedStrategy.created_at) }}</p>
                <p>通过大模型分析，生成针对性策略建议</p>
              </div>
            </el-timeline-item>
            
            <el-timeline-item
              timestamp="任务创建"
              placement="top"
              :type="timelineItemType('assigned')"
              color="#67C23A"
            >
              <div class="timeline-content">
                <h5>创建执行任务</h5>
                <p>{{ formatDate(addDays(selectedStrategy.created_at, 1)) }}</p>
                <p>根据策略建议创建具体执行任务，并分配给相关人员</p>
              </div>
            </el-timeline-item>
            
            <el-timeline-item
              timestamp="执行中"
              placement="top"
              :type="timelineItemType('executing')"
              color="#E6A23C"
            >
              <div class="timeline-content">
                <h5>执行任务实施</h5>
                <p>{{ formatDateRange(addDays(selectedStrategy.created_at, 1), getExecutionEndDate()) }}</p>
                <p>按照策略要点进行实施，需要在执行期限前完成</p>
              </div>
            </el-timeline-item>
            
            <el-timeline-item
              timestamp="执行期限"
              placement="top"
              :type="timelineItemType('deadline')"
              color="#F56C6C"
            >
              <div class="timeline-content">
                <h5>执行期限</h5>
                <p>{{ formatDate(selectedStrategy.execution_deadline) }}</p>
                <p>所有策略建议需要在此日期前完成执行</p>
              </div>
            </el-timeline-item>
            
            <el-timeline-item
              timestamp="反馈与评估"
              placement="top"
              :type="timelineItemType('feedback')"
              color="#909399"
            >
              <div class="timeline-content">
                <h5>执行反馈与效果评估</h5>
                <p>{{ formatDate(addDays(selectedStrategy.execution_deadline, 7)) }}</p>
                <p>收集执行情况反馈，评估执行效果</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else class="no-data">暂无时间线数据</div>
      </div>
    </el-card>

    <!-- 决策执行链接 -->
    <el-card class="action-card">
      <div class="action-content">
        <el-alert
          title="根据策略推演结果，您可以创建执行任务并分配给相关人员"
          type="success"
          show-icon
        >
          <template #default>
            <p>系统会自动将策略内容转化为具体的执行步骤，您可以进一步调整任务详情和负责人。</p>
          </template>
        </el-alert>
        <div class="action-buttons">
          <el-button type="primary" @click="goToExecution">创建执行任务</el-button>
          <el-button @click="goToReport">查看完整分析报告</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getTaskList } from '@/api/task'
import { getFieldsByTask } from '@/api/field'
import {
  getStrategyRecommendations,
  getTaskStrategyRecommendations,
  getFieldStrategyRecommendations
} from '@/api/llm'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const strategyList = ref<any[]>([])
const selectedStrategy = ref<any>(null)
const loading = ref(false)

// 图表实例
let priorityChart: any = null

// 策略类型映射
const strategyTypeMap = {
  disease_control: { name: '病害防治', tag: 'danger' },
  pest_control: { name: '虫害防治', tag: 'warning' },
  fertilization: { name: '施肥管理', tag: 'success' },
  irrigation: { name: '灌溉管理', tag: 'info' },
  harvest: { name: '采收管理', tag: 'primary' }
}

// 优先级映射
const priorityMap = {
  high: { name: '高', tag: 'danger' },
  medium: { name: '中', tag: 'warning' },
  low: { name: '低', tag: 'info' }
}

// 计算属性
const formattedSteps = computed(() => {
  if (!selectedStrategy.value || !selectedStrategy.value.recommendation_content) {
    return []
  }
  
  // 将推荐内容按换行符拆分，去除空行，提取步骤
  const lines = selectedStrategy.value.recommendation_content
    .trim()
    .split('\n')
    .filter((line: string) => line.trim() !== '')
  
  return lines
})

// 初始化
onMounted(async () => {
  // 获取URL参数
  const taskId = route.query.taskId as string
  const fieldId = route.query.fieldId as string
  
  if (taskId) {
    selectedTask.value = taskId
  }
  
  await loadTasks()
  
  if (selectedTask.value) {
    await loadFields(selectedTask.value)
    
    if (fieldId) {
      selectedField.value = fieldId
    } else if (fieldList.value.length > 0) {
      selectedField.value = fieldList.value[0].id
    }
    
    await loadResults()
  }
  
  initCharts()
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

// 加载地块列表
async function loadFields(taskId: string) {
  try {
    loading.value = true
    const res = await getFieldsByTask(taskId)
    fieldList.value = Array.isArray(res.data) ? res.data : []
    loading.value = false
  } catch (error) {
    console.error('加载地块失败', error)
    ElMessage.error('加载地块失败')
    loading.value = false
  }
}

// 加载策略推演结果
async function loadResults() {
  try {
    loading.value = true
    
    // 加载策略推演结果
    let res: any
    if (selectedField.value) {
      res = await getFieldStrategyRecommendations(parseInt(selectedField.value))
    } else if (selectedTask.value) {
      res = await getTaskStrategyRecommendations(parseInt(selectedTask.value))
    } else {
      res = await getStrategyRecommendations()
    }
    
    strategyList.value = Array.isArray(res.data) ? res.data : []
    
    // 设置选中的策略
    if (strategyList.value.length > 0) {
      selectedStrategy.value = strategyList.value[0]
    } else {
      selectedStrategy.value = null
    }
    
    // 更新优先级图表
    if (strategyList.value.length > 0) {
      updatePriorityChart()
    }
    
    // 更新URL参数
    router.push({
      query: {
        ...route.query,
        taskId: selectedTask.value,
        fieldId: selectedField.value
      }
    })
    
    loading.value = false
  } catch (error) {
    console.error('加载策略推演结果失败', error)
    ElMessage.error('加载策略推演结果失败')
    loading.value = false
  }
}

// 初始化图表
function initCharts() {
  // 等待下一个渲染周期，确保DOM元素已经渲染
  setTimeout(() => {
    // 初始化优先级图表
    const priorityChartEl = document.getElementById('priority-chart');
    if (priorityChartEl) {
      priorityChart = echarts.init(priorityChartEl);
      updatePriorityChart();
      
      // 窗口大小变化时重新渲染图表
      window.addEventListener('resize', () => {
        priorityChart && priorityChart.resize();
      });
    }
  }, 100);
}

// 更新优先级图表
function updatePriorityChart() {
  if (!priorityChart || !strategyList.value.length) return
  
  // 按照优先级分组策略
  const priorityGroups = {
    high: strategyList.value.filter(item => item.priority === 'high'),
    medium: strategyList.value.filter(item => item.priority === 'medium'),
    low: strategyList.value.filter(item => item.priority === 'low')
  }
  
  // 准备图表数据
  const dataByPriority = Object.entries(priorityGroups).map(([priority, strategies]) => {
    const typeCounts = strategies.reduce((acc: Record<string, number>, strategy: any) => {
      const type = strategy.recommendation_type
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
    
    return {
      priority,
      typeCounts
    }
  })
  
  // 获取所有策略类型
  const allTypes = Array.from(new Set(strategyList.value.map(item => item.recommendation_type)))
  
  // 准备图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const priority = params[0].axisValue
        const priorityLabel = priorityMap[priority as keyof typeof priorityMap]?.name || priority
        
        let result = `<div style="font-weight:bold;margin-bottom:5px;">${priorityLabel}优先级</div>`
        
        params.forEach((param: any) => {
          const type = param.seriesName
          const typeName = strategyTypeMap[type as keyof typeof strategyTypeMap]?.name || type
          result += `${typeName}: ${param.value}<br/>`
        })
        
        return result
      }
    },
    legend: {
      data: allTypes.map(type => strategyTypeMap[type as keyof typeof strategyTypeMap]?.name || type)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['high', 'medium', 'low'].map(priority => priorityMap[priority as keyof typeof priorityMap]?.name || priority),
      axisLine: {
        lineStyle: {
          color: '#E6A23C'
        }
      },
      axisLabel: {
        formatter: function(value: string) {
          return value
        }
      }
    },
    series: allTypes.map(type => {
      return {
        name: strategyTypeMap[type as keyof typeof strategyTypeMap]?.name || type,
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: ['high', 'medium', 'low'].map(priority => {
          const group = dataByPriority.find(item => item.priority === priority)
          return group ? (group.typeCounts[type] || 0) : 0
        })
      }
    })
  }
  
  priorityChart.setOption(option)
}

// 监听任务变化
watch(selectedTask, async (newValue) => {
  if (newValue) {
    await loadFields(newValue)
    selectedField.value = fieldList.value.length > 0 ? fieldList.value[0].id : ''
    await loadResults()
  }
})

// 监听地块变化
watch(selectedField, async (newValue) => {
  if (newValue) {
    await loadResults()
  }
})

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

// 格式化日期范围
function formatDateRange(startStr: string, endStr: string) {
  return `${formatDate(startStr)} 至 ${formatDate(endStr)}`
}

// 在日期上添加天数
function addDays(dateStr: string, days: number) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// 获取执行结束日期
function getExecutionEndDate() {
  if (!selectedStrategy.value || !selectedStrategy.value.execution_deadline) {
    return ''
  }
  
  const deadline = new Date(selectedStrategy.value.execution_deadline)
  const endDate = new Date(deadline)
  endDate.setDate(deadline.getDate() - 1)
  return endDate.toISOString()
}

// 获取时间线项目状态
function timelineItemType(stage: string) {
  if (!selectedStrategy.value) return ''
  
  const currentDate = new Date()
  const createdDate = new Date(selectedStrategy.value.created_at)
  const assignedDate = new Date(createdDate)
  assignedDate.setDate(createdDate.getDate() + 1)
  
  const deadlineDate = new Date(selectedStrategy.value.execution_deadline)
  const executingEndDate = new Date(deadlineDate)
  executingEndDate.setDate(deadlineDate.getDate() - 1)
  
  const feedbackDate = new Date(deadlineDate)
  feedbackDate.setDate(deadlineDate.getDate() + 7)
  
  switch (stage) {
    case 'created':
      return currentDate >= createdDate ? 'primary' : ''
    case 'assigned':
      return currentDate >= assignedDate ? 'primary' : ''
    case 'executing':
      return currentDate >= assignedDate && currentDate <= executingEndDate ? 'primary' : 
             currentDate > executingEndDate ? 'success' : ''
    case 'deadline':
      return currentDate >= deadlineDate ? 'primary' : ''
    case 'feedback':
      return currentDate >= feedbackDate ? 'primary' : ''
    default:
      return ''
  }
}

// 事件处理函数
function handleTaskChange() {
  // 任务变化时由watch监听器处理
}

function handleFieldChange() {
  // 地块变化时由watch监听器处理
}

function handleRefresh() {
  loadResults()
}

function handleExport() {
  ElMessage.success('策略推演导出成功')
}

function goToExecution() {
  ElMessage({
    message: '正在创建执行任务，请稍后...',
    type: 'success'
  })
  // 实际项目中跳转到执行任务创建页面
}

function goToReport() {
  router.push({
    name: 'AnalysisReport',
    query: {
      taskId: selectedTask.value,
      fieldId: selectedField.value
    }
  })
}

// 工具函数
function getStrategyTypeName(type: string) {
  return strategyTypeMap[type as keyof typeof strategyTypeMap]?.name || type
}

function getStrategyTypeTag(type: string) {
  return strategyTypeMap[type as keyof typeof strategyTypeMap]?.tag || ''
}

function getPriorityName(priority: string) {
  return priorityMap[priority as keyof typeof priorityMap]?.name || priority
}

function getPriorityTag(priority: string) {
  return priorityMap[priority as keyof typeof priorityMap]?.tag || ''
}

function getDeadlineClass(deadline: string) {
  if (!deadline) return ''
  
  const deadlineDate = new Date(deadline)
  const currentDate = new Date()
  const diffDays = Math.floor((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-danger'
  if (diffDays <= 3) return 'text-warning'
  return 'text-success'
}
</script>

<style scoped>
.strategy-recommendation {
  padding: 20px;
}

.header-card {
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

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  height: 120px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.stats-header {
  margin-bottom: 15px;
}

.stats-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-value {
  font-size: 20px;
  font-weight: bold;
}

.stats-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
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

.strategy-card, .priority-card, .timeline-card {
  margin-bottom: 20px;
}

.confidence-badge {
  padding: 4px 8px;
  background: #f0f9eb;
  border-radius: 4px;
  font-size: 14px;
}

.confidence-score {
  color: #67C23A;
  font-weight: bold;
}

.strategy-content {
  padding: 20px;
}

.strategy-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.strategy-step {
  display: flex;
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  font-weight: bold;
  margin-right: 16px;
  flex-shrink: 0;
}

.step-content {
  line-height: 1.6;
  padding-top: 5px;
}

.priority-container {
  height: 300px;
}

.priority-chart {
  height: 100%;
  width: 100%;
}

.timeline-container {
  padding: 20px;
}

.timeline-content {
  background-color: #f7f7f7;
  padding: 16px;
  border-radius: 4px;
}

.timeline-content h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.timeline-content p {
  margin: 4px 0;
  color: #606266;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-size: 16px;
}

.action-card {
  margin-bottom: 20px;
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

.text-danger {
  color: #F56C6C;
}

.text-warning {
  color: #E6A23C;
}

.text-success {
  color: #67C23A;
}

@media (max-width: 768px) {
  .stats-row {
    margin-bottom: 10px;
  }
  
  .stats-card, .strategy-card, .priority-card, .timeline-card, .action-card {
    margin-bottom: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 