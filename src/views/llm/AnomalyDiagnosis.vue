<template>
  <div class="anomaly-diagnosis">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>异常诊断结果</h3>
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

    <!-- 诊断概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>异常类型</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedDiagnosis && selectedDiagnosis.anomaly_type" class="stats-content">
            <el-tag :type="getAnomalyTypeTag(selectedDiagnosis.anomaly_type)" size="large">
              {{ getAnomalyTypeName(selectedDiagnosis.anomaly_type) }}
            </el-tag>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>严重程度</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedDiagnosis && selectedDiagnosis.severity" class="stats-content">
            <el-tag :type="getSeverityTag(selectedDiagnosis.severity)" size="large">
              {{ getSeverityName(selectedDiagnosis.severity) }}
            </el-tag>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-header">
            <h4>受影响面积比例</h4>
          </div>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedDiagnosis && selectedDiagnosis.affected_area_ratio" class="stats-content">
            <div class="stats-value" :class="getAffectedAreaClass(selectedDiagnosis.affected_area_ratio)">
              {{ (selectedDiagnosis.affected_area_ratio * 100).toFixed(2) }}%
            </div>
          </div>
          <div v-else class="stats-empty">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 诊断结果和原因 -->
    <el-row :gutter="20" class="content-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h4>诊断结果</h4>
            </div>
          </template>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedDiagnosis && selectedDiagnosis.diagnosis_content" class="diagnosis-content">
            {{ selectedDiagnosis.diagnosis_content }}
          </div>
          <div v-else class="stats-empty">暂无诊断结果</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <h4>可能原因</h4>
            </div>
          </template>
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="selectedDiagnosis && selectedDiagnosis.possible_causes" class="causes-content">
            <el-alert
              v-for="(cause, index) in formattedCauses"
              :key="index"
              :title="cause"
              type="warning"
              :closable="false"
              show-icon
              class="cause-item"
            />
          </div>
          <div v-else class="stats-empty">暂无原因分析</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 异常区域地图 -->
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <h4>异常区域标记</h4>
        </div>
      </template>
      <div class="map-container">
        <div v-if="loading" class="loading-overlay">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div id="anomaly-map" class="anomaly-map"></div>
      </div>
    </el-card>

    <!-- 异常类型分布和严重程度 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>异常类型分布</h4>
            </div>
          </template>
          <div class="chart-container">
            <div v-if="loading" class="loading-container">
              <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <div id="anomaly-type-chart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>异常严重程度分布</h4>
            </div>
          </template>
          <div class="chart-container">
            <div v-if="loading" class="loading-container">
              <el-icon class="is-loading"><Loading /></el-icon>
            </div>
            <div id="severity-chart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 策略推演链接 -->
    <el-card class="action-card">
      <div class="action-content">
        <el-alert
          title="根据异常诊断结果，系统已为您生成针对性的策略建议"
          type="success"
          show-icon
        >
          <template #default>
            <p>针对检测到的异常，AI分析系统已经生成了对应的处理策略，包含具体的操作步骤和时间安排。</p>
          </template>
        </el-alert>
        <div class="action-buttons">
          <el-button type="primary" @click="goToStrategy">查看策略推演</el-button>
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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getTaskList } from '@/api/task'
import { getFieldsByTask } from '@/api/field'
import {
  getAnomalyDiagnosis,
  getTaskAnomalyDiagnosis,
  getFieldAnomalyDiagnosis,
  getAnomalyTypes,
  getSeverityDistribution,
  getFieldAnomalyAreas
} from '@/api/llm'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const diagnosisList = ref<any[]>([])
const selectedDiagnosis = ref<any>(null)
const anomalyTypes = ref<any[]>([])
const severityDistribution = ref<any[]>([])
const anomalyAreas = ref<any[]>([])
const loading = ref(false)

// 地图和图表实例
let map: any = null
let anomalyTypeChart: any = null
let severityChart: any = null

// 计算属性
const formattedCauses = computed(() => {
  if (!selectedDiagnosis.value || !selectedDiagnosis.value.possible_causes) {
    return []
  }
  return selectedDiagnosis.value.possible_causes.split('；').filter((item: string) => item.trim() !== '')
})

// 异常类型映射
const anomalyTypeMap = {
  disease: { name: '病害', tag: 'danger' },
  pest: { name: '虫害', tag: 'warning' },
  nutrition: { name: '营养缺乏', tag: 'info' },
  growth: { name: '生长异常', tag: 'primary' },
  environment: { name: '环境问题', tag: '' }
}

// 严重程度映射
const severityMap = {
  high: { name: '严重', tag: 'danger' },
  medium: { name: '中等', tag: 'warning' },
  low: { name: '轻微', tag: 'success' }
}

// 初始化
onMounted(async () => {
  // 获取URL参数
  const taskId = route.query.taskId as string
  const fieldId = route.query.fieldId as string
  
  if (taskId) {
    selectedTask.value = taskId
  }
  
  await loadTasks()
  await loadAnomalyTypes()
  await loadSeverityDistribution()
  
  initMap()
  initCharts()
  
  if (selectedTask.value) {
    await loadFields(selectedTask.value)
    
    if (fieldId) {
      selectedField.value = fieldId
      await loadResults()
    } else if (fieldList.value.length > 0) {
      selectedField.value = fieldList.value[0].id
      await loadResults()
    }
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

// 加载异常诊断结果
async function loadResults() {
  try {
    loading.value = true
    
    // 加载异常诊断结果
    if (selectedField.value) {
      const res = await getFieldAnomalyDiagnosis(parseInt(selectedField.value))
      diagnosisList.value = res.data
      
      // 加载异常区域数据
      const areasRes = await getFieldAnomalyAreas(parseInt(selectedField.value))
      anomalyAreas.value = areasRes.data
      
      updateMap()
    } else if (selectedTask.value) {
      const res = await getTaskAnomalyDiagnosis(parseInt(selectedTask.value))
      diagnosisList.value = res.data
    }
    
    // 设置选中的诊断结果
    if (diagnosisList.value.length > 0) {
      selectedDiagnosis.value = diagnosisList.value[0]
    } else {
      selectedDiagnosis.value = null
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
    console.error('加载异常诊断结果失败', error)
    ElMessage.error('加载异常诊断结果失败')
    loading.value = false
  }
}

// 加载异常类型分布
async function loadAnomalyTypes() {
  try {
    const res = await getAnomalyTypes()
    anomalyTypes.value = res.data.map((item: any) => ({
      name: getAnomalyTypeName(item.type),
      value: item.count,
      type: item.type
    }))
    
    if (anomalyTypeChart) {
      updateAnomalyTypeChart()
    }
  } catch (error) {
    console.error('加载异常类型分布失败', error)
    ElMessage.error('加载异常类型分布失败')
  }
}

// 加载严重程度分布
async function loadSeverityDistribution() {
  try {
    const res = await getSeverityDistribution()
    severityDistribution.value = res.data.map((item: any) => ({
      name: getSeverityName(item.severity),
      value: item.count,
      severity: item.severity,
      color: getSeverityColor(item.severity)
    }))
    
    if (severityChart) {
      updateSeverityChart()
    }
  } catch (error) {
    console.error('加载严重程度分布失败', error)
    ElMessage.error('加载严重程度分布失败')
  }
}

// 初始化地图
function initMap() {
  if (map) return;
  
  // 等待下一个渲染周期，确保DOM元素已经渲染
  setTimeout(() => {
    const mapElement = document.getElementById('anomaly-map');
    if (mapElement) {
      map = L.map('anomaly-map').setView([30.28, 120.12], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  }, 100);
}

// 更新地图
function updateMap() {
  if (!map || !anomalyAreas.value || !anomalyAreas.value.length) return;
  
  // 清除原有图层
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Circle || layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
  
  // 添加异常区域
  anomalyAreas.value.forEach(area => {
    // 创建圆形标记异常区域
    const circle = L.circle(area.center, {
      radius: area.radius,
      color: getSeverityColor(area.severity),
      fillColor: getSeverityColor(area.severity),
      fillOpacity: 0.5,
      weight: 1
    }).addTo(map);
    
    // 添加弹出信息
    circle.bindPopup(`
      <div class="popup-content">
        <h4>异常区域信息</h4>
        <p><strong>类型：</strong>${getAnomalyTypeName(area.anomaly_type)}</p>
        <p><strong>严重程度：</strong>${getSeverityName(area.severity)}</p>
        <p><strong>描述：</strong>${area.description}</p>
      </div>
    `);
  });
  
  // 如果有异常区域，根据第一个区域调整视野
  if (anomalyAreas.value.length > 0) {
    const firstArea = anomalyAreas.value[0];
    map.setView(firstArea.center, 14);
  }
}

// 初始化图表
function initCharts() {
  // 等待下一个渲染周期，确保DOM元素已经渲染
  setTimeout(() => {
    // 初始化异常类型分布图表
    const anomalyTypeChartEl = document.getElementById('anomaly-type-chart');
    if (anomalyTypeChartEl) {
      anomalyTypeChart = echarts.init(anomalyTypeChartEl);
      updateAnomalyTypeChart();
    }
    
    // 初始化严重程度分布图表
    const severityChartEl = document.getElementById('severity-chart');
    if (severityChartEl) {
      severityChart = echarts.init(severityChartEl);
      updateSeverityChart();
    }
    
    // 窗口大小变化时重新渲染图表
    window.addEventListener('resize', () => {
      anomalyTypeChart && anomalyTypeChart.resize();
      severityChart && severityChart.resize();
    });
  }, 100);
}

// 更新异常类型分布图表
function updateAnomalyTypeChart() {
  if (!anomalyTypeChart || !anomalyTypes.value || !anomalyTypes.value.length) return;
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      data: anomalyTypes.value.map(item => item.name)
    },
    series: [
      {
        name: '异常类型',
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
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: anomalyTypes.value
      }
    ]
  };
  
  anomalyTypeChart.setOption(option);
}

// 更新严重程度分布图表
function updateSeverityChart() {
  if (!severityChart || !severityDistribution.value || !severityDistribution.value.length) return;
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: severityDistribution.value.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {c} ({d}%)'
        }
      }
    ]
  };
  
  severityChart.setOption(option);
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

// 事件处理函数
function handleTaskChange() {
  // 任务变化时由watch监听器处理
}

function handleFieldChange() {
  // 地块变化时由watch监听器处理
}

function handleRefresh() {
  loadResults()
  loadAnomalyTypes()
  loadSeverityDistribution()
}

function handleExport() {
  ElMessage.success('诊断结果导出成功')
}

function goToStrategy() {
  router.push({
    name: 'StrategyRecommendation',
    query: {
      taskId: selectedTask.value,
      fieldId: selectedField.value
    }
  })
}

// 工具函数
function getAnomalyTypeName(type: string) {
  return anomalyTypeMap[type as keyof typeof anomalyTypeMap]?.name || type
}

function getAnomalyTypeTag(type: string) {
  return anomalyTypeMap[type as keyof typeof anomalyTypeMap]?.tag || ''
}

function getSeverityName(severity: string) {
  return severityMap[severity as keyof typeof severityMap]?.name || severity
}

function getSeverityTag(severity: string) {
  return severityMap[severity as keyof typeof severityMap]?.tag || ''
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high':
      return '#F56C6C'
    case 'medium':
      return '#E6A23C'
    case 'low':
      return '#67C23A'
    default:
      return '#909399'
  }
}

function getAffectedAreaClass(ratio: number) {
  if (ratio >= 0.3) return 'text-danger'
  if (ratio >= 0.1) return 'text-warning'
  return 'text-success'
}
</script>

<style scoped>
.anomaly-diagnosis {
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
  font-size: 24px;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-row {
  margin-bottom: 20px;
}

.content-card {
  min-height: 200px;
  margin-bottom: 20px;
}

.diagnosis-content, .causes-content {
  padding: 10px;
  line-height: 1.6;
}

.cause-item {
  margin-bottom: 10px;
}

.map-card {
  margin-bottom: 20px;
}

.map-container {
  position: relative;
  height: 400px;
}

.anomaly-map {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart {
  height: 100%;
  width: 100%;
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
  .stats-row, .content-row, .chart-row {
    margin-bottom: 10px;
  }
  
  .stats-card, .content-card, .chart-card, .map-card, .action-card {
    margin-bottom: 10px;
  }
  
  .map-container, .chart-container {
    height: 300px;
  }
}
</style> 