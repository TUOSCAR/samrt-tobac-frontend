<template>
  <div class="evaluation-container">
    <div class="page-header">
      <div class="back-button" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <h2>执行情况分析与评估</h2>
    </div>

    <div v-loading="loading" class="evaluation-content">
      <!-- 关键指标卡片 -->
      <el-row :gutter="20" class="dashboard-cards">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="indicator-card">
            <div class="indicator-value">{{ evaluationData.completion_rate }}%</div>
            <div class="indicator-title">任务完成率</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="indicator-card">
            <div class="indicator-value">{{ evaluationData.effectiveness }}</div>
            <div class="indicator-title">平均效果评分</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="indicator-card">
            <div class="indicator-value">{{ evaluationData.on_time_rate }}%</div>
            <div class="indicator-title">按时完成率</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="indicator-card">
            <div class="indicator-value">
              {{ 
                Object.values(evaluationData.task_count_by_status).reduce((a, b) => a + b, 0) 
              }}
            </div>
            <div class="indicator-title">任务总数</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 任务类型分布图表 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :md="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>任务类型分布</span>
              </div>
            </template>
            <div class="chart-container" ref="taskTypeChartRef"></div>
          </el-card>
        </el-col>
        <el-col :md="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>任务状态统计</span>
              </div>
            </template>
            <div class="chart-container" ref="taskStatusChartRef"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 任务完成趋势图表 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :span="24">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>任务完成趋势分析</span>
              </div>
            </template>
            <div class="chart-container" ref="trendChartRef"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 烟农表现评估表格 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>烟农表现评估</span>
          </div>
        </template>
        <el-table :data="evaluationData.farmer_performance" border stripe>
          <el-table-column prop="name" label="烟农姓名" />
          <el-table-column prop="completed" label="完成任务数" />
          <el-table-column prop="on_time" label="按时完成数" />
          <el-table-column label="按时率">
            <template #default="scope">
              {{ Math.round(scope.row.on_time / scope.row.completed * 100) || 0 }}%
            </template>
          </el-table-column>
          <el-table-column prop="avg_rating" label="平均评分">
            <template #default="scope">
              <el-rate
                v-model="scope.row.avg_rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
            </template>
          </el-table-column>
          <el-table-column label="表现评级">
            <template #default="scope">
              <el-tag :type="getFarmerPerformanceTag(scope.row.avg_rating)">
                {{ getFarmerPerformanceLabel(scope.row.avg_rating) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getExecutionEvaluationData } from '@/mock/execution'
import { EffectivenessEvaluationData } from '@/types/execution'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册echarts组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
])

const router = useRouter()
const loading = ref(false)

// 任务类型映射
const taskTypeMap: Record<string, string> = {
  fertilization: '施肥',
  pest_control: '病虫害防治',
  irrigation: '灌溉',
  topping: '打顶',
  weeding: '除草',
  harvesting: '收获'
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

// 图表引用
const taskTypeChartRef = ref<HTMLElement | null>(null)
const taskStatusChartRef = ref<HTMLElement | null>(null)
const trendChartRef = ref<HTMLElement | null>(null)

// 图表实例
let taskTypeChart: echarts.ECharts | null = null
let taskStatusChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

// 评估数据
const evaluationData = reactive<EffectivenessEvaluationData>({
  completion_rate: 0,
  effectiveness: 0,
  on_time_rate: 0,
  task_count_by_type: {
    fertilization: 0,
    pest_control: 0,
    irrigation: 0,
    topping: 0,
    weeding: 0,
    harvesting: 0
  },
  task_count_by_status: {
    created: 0,
    assigned: 0,
    notified: 0,
    in_progress: 0,
    feedback_submitted: 0,
    feedback_validated: 0,
    verified: 0,
    completed: 0
  },
  task_completion_trends: [],
  farmer_performance: []
})

// 获取评估数据
const fetchEvaluationData = async () => {
  loading.value = true
  try {
    const res = await getExecutionEvaluationData()
    if (res.success) {
      Object.assign(evaluationData, res.data)
      // 初始化图表
      setTimeout(() => {
        initTaskTypeChart()
        initTaskStatusChart()
        initTrendChart()
      }, 0)
    } else {
      ElMessage.error('获取评估数据失败')
    }
  } catch (error) {
    console.error('获取评估数据失败', error)
    ElMessage.error('获取评估数据失败')
  } finally {
    loading.value = false
  }
}

// 初始化任务类型分布图表
const initTaskTypeChart = () => {
  if (!taskTypeChartRef.value) return
  
  taskTypeChart = echarts.init(taskTypeChartRef.value)
  
  const typeData = Object.entries(evaluationData.task_count_by_type).map(([key, value]) => ({
    name: taskTypeMap[key] || key,
    value
  }))
  
  taskTypeChart.setOption({
    title: {
      text: '任务类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: typeData.map(item => item.name)
    },
    series: [
      {
        name: '任务类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: typeData
      }
    ]
  })
}

// 初始化任务状态统计图表
const initTaskStatusChart = () => {
  if (!taskStatusChartRef.value) return
  
  taskStatusChart = echarts.init(taskStatusChartRef.value)
  
  const statusData = Object.entries(evaluationData.task_count_by_status).map(([key, value]) => ({
    name: statusMap[key] || key,
    value
  }))
  
  taskStatusChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
      data: statusData.map(item => item.name)
    },
    series: [
      {
        name: '任务数量',
        type: 'bar',
        data: statusData.map(item => item.value)
      }
    ]
  })
}

// 初始化任务完成趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChart = echarts.init(trendChartRef.value)
  
  const trendData = evaluationData.task_completion_trends
  
  trendChart.setOption({
    title: {
      text: '任务完成趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['已完成任务', '总任务数'],
      bottom: '0%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.map(item => item.month)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已完成任务',
        type: 'line',
        data: trendData.map(item => item.completed),
        areaStyle: {}
      },
      {
        name: '总任务数',
        type: 'line',
        data: trendData.map(item => item.total)
      }
    ]
  })
}

// 获取烟农表现评级标签
const getFarmerPerformanceTag = (rating: number) => {
  if (rating >= 4.5) return 'success'
  if (rating >= 3.5) return 'warning'
  return 'danger'
}

// 获取烟农表现评级标签文字
const getFarmerPerformanceLabel = (rating: number) => {
  if (rating >= 4.5) return '优秀'
  if (rating >= 3.5) return '良好'
  if (rating >= 2.5) return '一般'
  return '需改进'
}

// 处理窗口大小变化
const handleResize = () => {
  taskTypeChart?.resize()
  taskStatusChart?.resize()
  trendChart?.resize()
}

// 组件挂载后获取数据并初始化图表
onMounted(() => {
  fetchEvaluationData()
  window.addEventListener('resize', handleResize)
})

// 组件卸载前清理图表实例和事件监听
onBeforeUnmount(() => {
  taskTypeChart?.dispose()
  taskStatusChart?.dispose()
  trendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.evaluation-container {
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

.dashboard-cards {
  margin-bottom: 20px;
}

.indicator-card {
  text-align: center;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
}

.indicator-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 10px;
}

.indicator-title {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style> 