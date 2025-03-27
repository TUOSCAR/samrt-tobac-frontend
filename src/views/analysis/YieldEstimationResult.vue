<template>
  <div class="yield-estimation-result">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>估产分析结果</h3>
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

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ yieldResult.estimatedYield?.toFixed(2) || 0 }}kg</div>
          <div class="stats-title">预计总产量</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ yieldResult.yieldPerMu?.toFixed(2) || 0 }}kg/亩</div>
          <div class="stats-title">预计单产</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ (yieldResult.confidenceLevel * 100)?.toFixed(2) || 0 }}%</div>
          <div class="stats-title">预测置信度</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产量预测柱状图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <h4>产量预测柱状图</h4>
        </div>
      </template>
      <div class="chart-container">
        <div id="yield-bar-chart" class="chart"></div>
      </div>
    </el-card>

    <!-- 单位面积产量地图 -->
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <h4>单位面积产量分布图</h4>
          <div class="map-legend">
            <div class="legend-item">
              <span class="color-block high"></span>
              <span>高产区</span>
            </div>
            <div class="legend-item">
              <span class="color-block medium"></span>
              <span>中产区</span>
            </div>
            <div class="legend-item">
              <span class="color-block low"></span>
              <span>低产区</span>
            </div>
          </div>
        </div>
      </template>
      <div class="map-container">
        <div v-if="loading" class="loading-overlay">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div id="yield-map" class="yield-map"></div>
      </div>
    </el-card>

    <!-- 产量趋势折线图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <h4>产量趋势折线图</h4>
        </div>
      </template>
      <div class="chart-container">
        <div id="yield-trend-chart" class="chart"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getTaskList } from '@/api/task'
import { getFieldsByTask } from '@/api/field'
import { getYieldEstimationResults } from '@/api/analysis'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const yieldResult = ref<any>({})
const loading = ref(false)

// 产量等级对应的颜色
const yieldColors = {
  high: '#22c55e',   // 高产 - 绿色
  medium: '#f59e0b', // 中产 - 橙色
  low: '#ef4444'     // 低产 - 红色
}

// 图表实例
let map: any = null
let barChart: any = null
let trendChart: any = null

// 初始化
onMounted(async () => {
  // 获取URL参数
  const taskId = route.query.taskId as string
  const fieldId = route.query.fieldId as string
  
  if (taskId) {
    selectedTask.value = taskId
  }
  
  await loadTasks()
  
  initMap()
  initCharts()
  
  if (selectedTask.value) {
    await loadFields(selectedTask.value)
    
    if (fieldId) {
      selectedField.value = fieldId
      await loadResults(selectedTask.value, fieldId)
    } else if (fieldList.value.length > 0) {
      selectedField.value = fieldList.value[0].id
      await loadResults(selectedTask.value, fieldList.value[0].id)
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

// 加载分析结果
async function loadResults(taskId: string, fieldId: string) {
  try {
    loading.value = true
    const res = await getYieldEstimationResults(taskId, fieldId)
    yieldResult.value = res.data
    
    // 更新URL参数
    router.push({
      query: {
        ...route.query,
        taskId,
        fieldId
      }
    })
    
    // 更新地图和图表
    updateMap()
    updateCharts()
    
    loading.value = false
  } catch (error) {
    console.error('加载分析结果失败', error)
    ElMessage.error('加载分析结果失败')
    loading.value = false
  }
}

// 初始化地图
function initMap() {
  if (map) {
    map.remove()
  }
  
  map = L.map('yield-map', {
    center: [30.279, 120.165],
    zoom: 14
  })
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
}

// 更新地图
function updateMap() {
  if (!map) {
    return
  }
  
  // 清除现有图层
  map.eachLayer((layer: any) => {
    if (layer instanceof L.TileLayer) return // 保留底图
    map.removeLayer(layer)
  })
  
  // 模拟数据
  const polygons = generateMockYieldPolygons()
  
  // 绘制产量区域
  polygons.forEach(poly => {
    L.polygon(poly.coordinates as L.LatLngExpression[], {
      color: getYieldLevelColor(poly.level),
      fillColor: getYieldLevelColor(poly.level),
      fillOpacity: 0.6,
      weight: 1
    }).addTo(map)
      .bindPopup(`预计单产: ${poly.yieldPerMu} kg/亩`)
  })
  
  // 设置地图视图范围
  if (polygons.length > 0) {
    const bounds = getBoundsFromPolygons(polygons)
    map.fitBounds(bounds)
  }
}

// 初始化图表
function initCharts() {
  // 初始化柱状图
  const barDom = document.getElementById('yield-bar-chart')
  if (barDom) {
    barChart = echarts.init(barDom)
  }
  
  // 初始化趋势图
  const trendDom = document.getElementById('yield-trend-chart')
  if (trendDom) {
    trendChart = echarts.init(trendDom)
  }
}

// 更新图表
function updateCharts() {
  // 更新柱状图
  if (barChart) {
    const contractYield = 200 * (yieldResult.value.fieldArea || 1) // 假设每亩的合同产量为200kg
    
    const barOption = {
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
        type: 'category',
        data: ['合同产量', '预估产量', '差异']
      },
      yAxis: {
        type: 'value',
        name: '产量(kg)'
      },
      series: [{
        name: '产量',
        type: 'bar',
        data: [
          { 
            value: contractYield, 
            itemStyle: { color: '#3b82f6' }
          },
          { 
            value: yieldResult.value.estimatedYield || 0, 
            itemStyle: { color: '#10b981' }
          },
          { 
            value: (yieldResult.value.estimatedYield || 0) - contractYield,
            itemStyle: { 
              color: ((yieldResult.value.estimatedYield || 0) > contractYield) ? '#10b981' : '#ef4444'
            }
          }
        ],
        label: {
          show: true,
          position: 'top'
        }
      }]
    }
    
    barChart.setOption(barOption)
  }
  
  // 更新趋势图
  if (trendChart) {
    // 模拟历史数据
    const historicalData = generateMockHistoricalData()
    
    const trendOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['实际产量', '合同产量', '预测产量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: historicalData.years
      },
      yAxis: {
        type: 'value',
        name: '产量(kg)'
      },
      series: [
        {
          name: '实际产量',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          symbol: 'circle',
          symbolSize: 8,
          data: historicalData.actual
        },
        {
          name: '合同产量',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#6b7280'
          },
          symbol: 'square',
          symbolSize: 6,
          data: historicalData.contract
        },
        {
          name: '预测产量',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#10b981'
          },
          symbol: 'diamond',
          symbolSize: 8,
          data: historicalData.predicted
        }
      ]
    }
    
    trendChart.setOption(trendOption)
  }
}

// 处理任务变更
async function handleTaskChange() {
  if (selectedTask.value) {
    await loadFields(selectedTask.value)
    if (fieldList.value.length > 0) {
      selectedField.value = fieldList.value[0].id
      await loadResults(selectedTask.value, selectedField.value)
    } else {
      selectedField.value = ''
      yieldResult.value = {}
      updateMap()
      updateCharts()
    }
  }
}

// 处理地块变更
async function handleFieldChange() {
  if (selectedTask.value && selectedField.value) {
    await loadResults(selectedTask.value, selectedField.value)
  }
}

// 处理导出
function handleExport() {
  ElMessage.success('导出成功')
}

// 处理刷新
async function handleRefresh() {
  if (selectedTask.value && selectedField.value) {
    await loadResults(selectedTask.value, selectedField.value)
  }
}

// 根据产量等级获取对应颜色
function getYieldLevelColor(level: string) {
  switch (level) {
    case 'high': return yieldColors.high
    case 'medium': return yieldColors.medium
    case 'low': return yieldColors.low
    default: return '#cccccc'
  }
}

// 生成模拟产量多边形
function generateMockYieldPolygons() {
  // 中心点
  const center = [30.279, 120.165]
  const baseYield = yieldResult.value.yieldPerMu || 200
  
  // 生成高产区
  const highYieldCoords = [
    [center[0] - 0.002, center[1] - 0.002],
    [center[0] - 0.002, center[1] + 0.002],
    [center[0] + 0.002, center[1] + 0.002],
    [center[0] + 0.002, center[1] - 0.002]
  ]
  
  // 生成中产区
  const mediumYieldCoords = [
    [center[0] - 0.004, center[1] - 0.004],
    [center[0] - 0.004, center[1] + 0.004],
    [center[0] + 0.004, center[1] + 0.004],
    [center[0] + 0.004, center[1] - 0.004]
  ]
  
  // 生成低产区
  const lowYieldCoords = [
    [center[0] - 0.006, center[1] - 0.006],
    [center[0] - 0.006, center[1] + 0.006],
    [center[0] + 0.006, center[1] + 0.006],
    [center[0] + 0.006, center[1] - 0.006]
  ]
  
  return [
    {
      level: 'high',
      coordinates: highYieldCoords,
      yieldPerMu: Math.round(baseYield * 1.2)
    },
    {
      level: 'medium',
      coordinates: mediumYieldCoords,
      yieldPerMu: Math.round(baseYield)
    },
    {
      level: 'low',
      coordinates: lowYieldCoords,
      yieldPerMu: Math.round(baseYield * 0.8)
    }
  ]
}

// 获取多边形的边界
function getBoundsFromPolygons(polygons: any[]) {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  
  polygons.forEach(poly => {
    poly.coordinates.forEach((coord: number[]) => {
      minLat = Math.min(minLat, coord[0])
      maxLat = Math.max(maxLat, coord[0])
      minLng = Math.min(minLng, coord[1])
      maxLng = Math.max(maxLng, coord[1])
    })
  })
  
  return [[minLat, minLng], [maxLat, maxLng]] as L.LatLngBoundsExpression
}

// 生成模拟历史数据
function generateMockHistoricalData() {
  // 最近5年的数据
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString())
  
  // 今年的预测产量
  const predictedYield = yieldResult.value.estimatedYield || 0
  
  // 合同产量（假设每年相同）
  const contractYield = 200 * (yieldResult.value.fieldArea || 1)
  
  // 生成历史实际产量（略有波动）
  const actual = years.map((_, i) => {
    if (i < years.length - 1) {
      // 历史数据
      return Math.round(contractYield * (0.9 + Math.random() * 0.3))
    } else {
      // 今年的预测
      return null
    }
  })
  
  // 生成合同产量（一条直线）
  const contract = years.map(() => contractYield)
  
  // 生成预测产量（只有今年有）
  const predicted = years.map((_, i) => {
    if (i === years.length - 1) {
      return predictedYield
    } else {
      return null
    }
  })
  
  return { years, actual, contract, predicted }
}

// 监听窗口大小变化，重新渲染图表
window.addEventListener('resize', () => {
  if (barChart) barChart.resize()
  if (trendChart) trendChart.resize()
})
</script>

<style scoped>
.yield-estimation-result {
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
  text-align: center;
  padding: 10px;
  margin-bottom: 20px;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stats-title {
  font-size: 14px;
  color: #999;
}

.map-card {
  margin-bottom: 20px;
}

.map-container {
  position: relative;
  height: 400px;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.yield-map {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.map-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.color-block {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.color-block.high {
  background-color: #22c55e;
}

.color-block.medium {
  background-color: #f59e0b;
}

.color-block.low {
  background-color: #ef4444;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 350px;
}

.chart {
  height: 100%;
  width: 100%;
}
</style> 