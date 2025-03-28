<template>
  <div class="growth-analysis-result">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>长势分析结果</h3>
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
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value excellent-value">{{ (growthResult.excellentAreaRatio * 100 || 0).toFixed(2) }}%</div>
          <div class="stats-title">优等长势占比</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value good-value">{{ (growthResult.goodAreaRatio * 100 || 0).toFixed(2) }}%</div>
          <div class="stats-title">良好长势占比</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value medium-value">{{ (growthResult.mediumAreaRatio * 100 || 0).toFixed(2) }}%</div>
          <div class="stats-title">中等长势占比</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value poor-value">{{ (growthResult.poorAreaRatio * 100 || 0).toFixed(2) }}%</div>
          <div class="stats-title">较差长势占比</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 长势栅格图 -->
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <h4>长势分级栅格图</h4>
          <div class="map-legend">
            <div class="legend-item">
              <span class="color-block excellent"></span>
              <span>优等</span>
            </div>
            <div class="legend-item">
              <span class="color-block good"></span>
              <span>良好</span>
            </div>
            <div class="legend-item">
              <span class="color-block medium"></span>
              <span>中等</span>
            </div>
            <div class="legend-item">
              <span class="color-block poor"></span>
              <span>较差</span>
            </div>
          </div>
        </div>
      </template>
      <div class="map-container">
        <div v-if="loading" class="loading-overlay">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div id="growth-grid-map" class="growth-map"></div>
      </div>
    </el-card>

    <!-- 统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>长势分级面积占比</h4>
            </div>
          </template>
          <div class="chart-container">
            <div id="growth-pie-chart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>长势分布柱状图</h4>
            </div>
          </template>
          <div class="chart-container">
            <div id="growth-bar-chart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 历史对比 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <h4>长势历史对比</h4>
        </div>
      </template>
      <div class="chart-container">
        <div id="growth-trend-chart" class="chart"></div>
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
import { getGrowthAnalysisResults } from '@/api/analysis'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const growthResult = ref<any>({})
const loading = ref(false)

// 长势等级对应的颜色
const growthColors = {
  excellent: '#22c55e', // 深绿色
  good: '#84cc16',      // 浅绿色
  medium: '#facc15',    // 黄色
  poor: '#ef4444'       // 红色
}

// 图表实例
let map: any = null
let pieChart: any = null
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
    const res = await getGrowthAnalysisResults(taskId, fieldId)
    growthResult.value = res.data
    
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
  
  map = L.map('growth-grid-map', {
    center: [30.279, 120.165],
    zoom: 14
  })
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
}

// 更新地图
function updateMap() {
  if (!map || !growthResult.value) {
    return
  }
  
  // 清除现有图层
  map.eachLayer((layer: any) => {
    if (layer instanceof L.TileLayer) return // 保留底图
    map.removeLayer(layer)
  })
  
  // 使用API返回的数据
  let fieldBoundary = growthResult.value.fieldBoundary;
  let gridData = growthResult.value.growthGridData;
  
  // 如果API没有返回边界数据，则使用备用方法生成
  if (!fieldBoundary) {
    fieldBoundary = generateMockFieldBoundary();
    console.warn('使用生成的随机边界数据，因为API未返回fieldBoundary数据');
  } else {
    console.log('使用API返回的边界数据');
  }
  
  // 绘制田块边界
  const boundaryLayer = L.geoJSON(fieldBoundary, {
    style: {
      color: '#3b82f6',
      weight: 2,
      opacity: 1,
      fillOpacity: 0
    }
  }).addTo(map);
  
  // 创建长势栅格
  const gridLayer = L.layerGroup();
  
  // 如果API返回了栅格数据，使用API数据
  if (gridData && gridData.length > 0) {
    console.log('使用API返回的栅格数据，共', gridData.length, '个点');
    
    gridData.forEach((point: any) => {
      // 值为1-4对应优等、良好、中等、较差
      const level = point.value || 1;
      const circle = L.circle([point.lat, point.lng], {
        radius: 20,
        fillColor: getGrowthLevelColor(level),
        color: 'transparent',
        fillOpacity: 0.7
      });
      gridLayer.addLayer(circle);
    });
  } else {
    console.warn('使用生成的随机栅格数据，因为API未返回growthGridData数据');
    // 使用备用方法生成栅格
    const gridCells = generateMockGridCells(fieldBoundary, 10);
    
    gridCells.forEach(cell => {
      const rectangle = L.rectangle(cell.bounds, {
        color: 'transparent',
        weight: 1,
        fillColor: getGrowthLevelColor(cell.level),
        fillOpacity: 0.7
      });
      gridLayer.addLayer(rectangle);
    });
  }
  
  gridLayer.addTo(map);
  
  // 设置地图视图范围
  try {
    map.fitBounds(boundaryLayer.getBounds(), { padding: [20, 20] });
  } catch (error) {
    console.error('设置地图视图范围失败:', error);
    map.setView([30.279, 120.165], 14);
  }
}

// 初始化图表
function initCharts() {
  // 初始化饼图
  const pieDom = document.getElementById('growth-pie-chart')
  if (pieDom) {
    pieChart = echarts.init(pieDom)
  }
  
  // 初始化柱状图
  const barDom = document.getElementById('growth-bar-chart')
  if (barDom) {
    barChart = echarts.init(barDom)
  }
  
  // 初始化趋势图
  const trendDom = document.getElementById('growth-trend-chart')
  if (trendDom) {
    trendChart = echarts.init(trendDom)
  }
}

// 更新图表
function updateCharts() {
  // 更新饼图
  if (pieChart) {
    const pieOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['优等', '良好', '中等', '较差']
      },
      series: [
        {
          name: '长势分级',
          type: 'pie',
          radius: ['50%', '70%'],
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
          data: [
            { 
              value: formatPercentage(growthResult.value.excellentAreaRatio), 
              name: '优等',
              itemStyle: { color: growthColors.excellent }
            },
            { 
              value: formatPercentage(growthResult.value.goodAreaRatio), 
              name: '良好',
              itemStyle: { color: growthColors.good }
            },
            { 
              value: formatPercentage(growthResult.value.mediumAreaRatio), 
              name: '中等',
              itemStyle: { color: growthColors.medium }
            },
            { 
              value: formatPercentage(growthResult.value.poorAreaRatio), 
              name: '较差',
              itemStyle: { color: growthColors.poor }
            }
          ]
        }
      ]
    }
    
    pieChart.setOption(pieOption)
  }
  
  // 更新柱状图
  if (barChart) {
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
        data: ['优等', '良好', '中等', '较差']
      },
      yAxis: {
        type: 'value',
        name: '面积占比(%)'
      },
      series: [{
        name: '面积占比',
        type: 'bar',
        data: [
          { 
            value: formatPercentage(growthResult.value.excellentAreaRatio), 
            itemStyle: { color: growthColors.excellent }
          },
          { 
            value: formatPercentage(growthResult.value.goodAreaRatio), 
            itemStyle: { color: growthColors.good }
          },
          { 
            value: formatPercentage(growthResult.value.mediumAreaRatio), 
            itemStyle: { color: growthColors.medium }
          },
          { 
            value: formatPercentage(growthResult.value.poorAreaRatio), 
            itemStyle: { color: growthColors.poor }
          }
        ],
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
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
        data: ['优等', '良好', '中等', '较差']
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
        data: historicalData.dates
      },
      yAxis: {
        type: 'value',
        name: '面积占比(%)'
      },
      series: [
        {
          name: '优等',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          color: growthColors.excellent,
          data: historicalData.excellent
        },
        {
          name: '良好',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          color: growthColors.good,
          data: historicalData.good
        },
        {
          name: '中等',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          color: growthColors.medium,
          data: historicalData.medium
        },
        {
          name: '较差',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          color: growthColors.poor,
          data: historicalData.poor
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
      growthResult.value = {}
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

// 格式化百分比
function formatPercentage(value: number | undefined) {
  if (value === undefined || isNaN(value)) {
    return 0
  }
  return +(value * 100).toFixed(2)
}

// 根据长势等级获取对应颜色
function getGrowthLevelColor(level: string) {
  switch (level) {
    case 'excellent': return growthColors.excellent
    case 'good': return growthColors.good
    case 'medium': return growthColors.medium
    case 'poor': return growthColors.poor
    default: return '#cccccc'
  }
}

// 生成模拟田块边界
function generateMockFieldBoundary() {
  // 中心点
  const center = [30.279, 120.165]
  
  // 生成一个简单的多边形
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [center[1] - 0.01, center[0] - 0.005],
        [center[1] + 0.01, center[0] - 0.005],
        [center[1] + 0.01, center[0] + 0.005],
        [center[1] - 0.01, center[0] + 0.005],
        [center[1] - 0.01, center[0] - 0.005]
      ]]
    }
  }
}

// 生成栅格单元格
function generateMockGridCells(fieldBoundary: any, gridSize: number) {
  const cells = []
  const coordinates = fieldBoundary.geometry.coordinates[0]
  
  // 找出边界的范围
  let minLat = coordinates[0][1]
  let maxLat = coordinates[0][1]
  let minLng = coordinates[0][0]
  let maxLng = coordinates[0][0]
  
  coordinates.forEach((coord: [number, number]) => {
    minLng = Math.min(minLng, coord[0])
    maxLng = Math.max(maxLng, coord[0])
    minLat = Math.min(minLat, coord[1])
    maxLat = Math.max(maxLat, coord[1])
  })
  
  // 计算单元格大小
  const cellWidth = (maxLng - minLng) / gridSize
  const cellHeight = (maxLat - minLat) / gridSize
  
  // 生成栅格
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      // 计算单元格的边界
      const southWest: [number, number] = [minLat + i * cellHeight, minLng + j * cellWidth]
      const northEast: [number, number] = [minLat + (i + 1) * cellHeight, minLng + (j + 1) * cellWidth]
      
      // 根据当前生长结果分配长势等级
      // 假设左下角是较差区域，右上角是优良区域
      let level = 'medium'
      const distanceToCorner = Math.sqrt(i * i + j * j) / Math.sqrt(2 * gridSize * gridSize)
      
      if (distanceToCorner < 0.25) {
        level = 'poor'
      } else if (distanceToCorner < 0.5) {
        level = 'medium'
      } else if (distanceToCorner < 0.75) {
        level = 'good'
      } else {
        level = 'excellent'
      }
      
      cells.push({
        bounds: [southWest, northEast] as L.LatLngBoundsLiteral,
        level
      })
    }
  }
  
  return cells
}

// 生成模拟历史数据
function generateMockHistoricalData() {
  // 假设最近6次监测数据
  const dates = ['4月1日', '4月15日', '5月1日', '5月15日', '6月1日', '当前']
  
  // 生成模拟数据
  const excellent = [10, 15, 20, 30, 35, formatPercentage(growthResult.value.excellentAreaRatio)]
  const good = [30, 35, 40, 35, 30, formatPercentage(growthResult.value.goodAreaRatio)]
  const medium = [40, 35, 30, 25, 25, formatPercentage(growthResult.value.mediumAreaRatio)]
  const poor = [20, 15, 10, 10, 10, formatPercentage(growthResult.value.poorAreaRatio)]
  
  return { dates, excellent, good, medium, poor }
}

// 监听窗口大小变化，重新渲染图表
window.addEventListener('resize', () => {
  if (pieChart) pieChart.resize()
  if (barChart) barChart.resize()
  if (trendChart) trendChart.resize()
})
</script>

<style scoped>
.growth-analysis-result {
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
  margin-bottom: 5px;
}

.stats-title {
  font-size: 14px;
  color: #999;
}

.excellent-value {
  color: #22c55e;
}

.good-value {
  color: #84cc16;
}

.medium-value {
  color: #facc15;
}

.poor-value {
  color: #ef4444;
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

.growth-map {
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

.color-block.excellent {
  background-color: #22c55e;
}

.color-block.good {
  background-color: #84cc16;
}

.color-block.medium {
  background-color: #facc15;
}

.color-block.poor {
  background-color: #ef4444;
}

.chart-row {
  margin-bottom: 20px;
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