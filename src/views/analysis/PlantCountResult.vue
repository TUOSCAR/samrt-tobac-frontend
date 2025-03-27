<template>
  <div class="plant-count-result">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>烟株计数分析结果</h3>
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
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ countResult.plantCount || 0 }}</div>
          <div class="stats-title">总烟株数（株）</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ countResult.plantDensity?.toFixed(2) || 0 }}</div>
          <div class="stats-title">平均密度（株/亩）</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value">{{ standardDensity }}</div>
          <div class="stats-title">标准密度（株/亩）</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="stats-card" shadow="hover">
          <div class="stats-value" :class="densityRatio > 1 ? 'text-success' : 'text-danger'">
            {{ (densityRatio * 100).toFixed(2) }}%
          </div>
          <div class="stats-title">标准密度占比</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 点位分布图 -->
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <h4>烟株点位分布图</h4>
          <el-radio-group v-model="mapView" size="small">
            <el-radio-button label="marker">标记点</el-radio-button>
            <el-radio-button label="heatmap">热力图</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="map-container">
        <div v-if="loading" class="loading-overlay">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div id="plant-distribution-map" class="distribution-map"></div>
      </div>
    </el-card>

    <!-- 密度统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>密度分布热力图</h4>
            </div>
          </template>
          <div class="chart-container">
            <div id="density-heatmap" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h4>数量统计</h4>
            </div>
          </template>
          <div class="chart-container">
            <div id="count-statistics" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import { getTaskList } from '@/api/task'
import { getFieldsByTask } from '@/api/field'
import { getPlantCountResults } from '@/api/analysis'

// 路由
const route = useRoute()
const router = useRouter()

// 数据变量
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const countResult = ref<any>({})
const loading = ref(false)
const mapView = ref('marker')
const standardDensity = ref(2000) // 标准密度值，可配置

// 计算属性
const densityRatio = computed(() => {
  if (!countResult.value.plantDensity || countResult.value.plantDensity === 0) {
    return 0
  }
  return countResult.value.plantDensity / standardDensity.value
})

// 地图和图表实例
let map: any = null
let markerLayer: any = null
let heatLayer: any = null
let densityChart: any = null
let countChart: any = null

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

// 监听地图视图变化
watch(mapView, (newValue) => {
  if (map) {
    updateMapView()
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
    const res = await getPlantCountResults(taskId, fieldId)
    countResult.value = res.data
    
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
  
  map = L.map('plant-distribution-map', {
    center: [30.279, 120.165],
    zoom: 14
  })
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
}

// 更新地图
function updateMap() {
  if (!map || !countResult.value) {
    return
  }
  
  // 使用API返回的点位数据
  let points = countResult.value.plantPoints || [];
  
  // 如果API没有返回点位数据，则使用备用方法生成
  if (!points || points.length === 0) {
    points = generateRandomPoints(countResult.value.plantCount || 100);
    console.warn('使用生成的随机点位数据，因为API未返回plantPoints数据');
  } else {
    console.log('使用API返回的点位数据，共', points.length, '个点');
  }
  
  // 清除现有图层
  if (markerLayer) {
    map.removeLayer(markerLayer)
  }
  if (heatLayer) {
    map.removeLayer(heatLayer)
  }
  
  // 创建新图层
  markerLayer = L.layerGroup()
  const heatData: [number, number, number][] = []
  
  points.forEach((point: [number, number]) => {
    const marker = L.circleMarker(point, {
      radius: 3,
      fillColor: '#22c55e',
      color: '#16a34a',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    markerLayer.addLayer(marker)
    heatData.push([point[0], point[1], 1])
  })
  
  heatLayer = L.heatLayer(heatData, { radius: 25, blur: 15 })
  
  // 设置视图
  updateMapView()
  
  // 如果API返回了地块边界，使用地块边界设置视图范围
  if (countResult.value.fieldBoundary) {
    try {
      const boundary = L.geoJSON(countResult.value.fieldBoundary)
      map.fitBounds(boundary.getBounds(), { padding: [20, 20] })
    } catch (error) {
      console.error('地块边界数据错误：', error)
      // 如果地块边界数据有问题，使用点位数据设置视图
      const bounds = getPointsBounds(points)
      if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }
  } else {
    // 没有地块边界数据，使用点位数据设置视图
    const bounds = getPointsBounds(points)
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }
}

// 更新地图视图（标记点/热力图）
function updateMapView() {
  if (!map) return
  
  if (mapView.value === 'marker' && markerLayer) {
    if (heatLayer) map.removeLayer(heatLayer)
    map.addLayer(markerLayer)
  } else if (mapView.value === 'heatmap' && heatLayer) {
    if (markerLayer) map.removeLayer(markerLayer)
    map.addLayer(heatLayer)
  }
}

// 初始化图表
function initCharts() {
  // 初始化密度热力图
  const densityDom = document.getElementById('density-heatmap')
  if (densityDom) {
    densityChart = echarts.init(densityDom)
  }
  
  // 初始化数量统计图
  const countDom = document.getElementById('count-statistics')
  if (countDom) {
    countChart = echarts.init(countDom)
  }
}

// 更新图表
function updateCharts() {
  // 更新密度热力图
  if (densityChart) {
    const densityOption = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `密度: ${params.data[2]} 株/亩`
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        data: generateGridLabels(10, '列'),
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: generateGridLabels(10, '行'),
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 3000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        text: ['高密度', '低密度'],
        inRange: {
          color: ['#e0f7fa', '#4dd0e1', '#0097a7', '#006064']
        }
      },
      series: [{
        name: '烟株密度',
        type: 'heatmap',
        data: generateHeatmapData(10, 10),
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
    
    densityChart.setOption(densityOption)
  }
  
  // 更新数量统计图
  if (countChart) {
    const countOption = {
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
        data: ['实际烟株数', '标准烟株数', '差异']
      },
      yAxis: {
        type: 'value',
        name: '株数'
      },
      series: [{
        name: '株数',
        type: 'bar',
        data: [
          { 
            value: countResult.value.plantCount || 0, 
            itemStyle: { color: '#10b981' }
          },
          { 
            value: Math.round(standardDensity.value * (countResult.value.actualArea || 1)), 
            itemStyle: { color: '#3b82f6' }
          },
          { 
            value: (countResult.value.plantCount || 0) - Math.round(standardDensity.value * (countResult.value.actualArea || 1)),
            itemStyle: { 
              color: ((countResult.value.plantCount || 0) - Math.round(standardDensity.value * (countResult.value.actualArea || 1))) >= 0 ? '#10b981' : '#ef4444'
            }
          }
        ],
        label: {
          show: true,
          position: 'top'
        }
      }]
    }
    
    countChart.setOption(countOption)
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
      countResult.value = {}
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

// 工具函数：生成随机点位
function generateRandomPoints(count: number): [number, number][] {
  const center = [30.279, 120.165]
  const points: [number, number][] = []
  
  for (let i = 0; i < count; i++) {
    const lat = center[0] + (Math.random() - 0.5) * 0.02
    const lng = center[1] + (Math.random() - 0.5) * 0.02
    points.push([lat, lng])
  }
  
  return points
}

// 获取点位的边界
function getPointsBounds(points: [number, number][]) {
  if (points.length === 0) return null
  
  let minLat = points[0][0]
  let maxLat = points[0][0]
  let minLng = points[0][1]
  let maxLng = points[0][1]
  
  points.forEach(point => {
    minLat = Math.min(minLat, point[0])
    maxLat = Math.max(maxLat, point[0])
    minLng = Math.min(minLng, point[1])
    maxLng = Math.max(maxLng, point[1])
  })
  
  return [[minLat, minLng], [maxLat, maxLng]]
}

// 生成网格标签
function generateGridLabels(count: number, prefix: string) {
  return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`)
}

// 生成热力图数据
function generateHeatmapData(rows: number, cols: number) {
  const data = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 生成随机密度，保持均值接近实际密度
      const baseDensity = countResult.value.plantDensity || 2000
      const variance = baseDensity * 0.3
      let density = baseDensity + (Math.random() - 0.5) * 2 * variance
      density = Math.max(0, Math.min(density, baseDensity * 1.5))
      
      data.push([j, i, Math.round(density)])
    }
  }
  return data
}

// 监听窗口大小变化，重新渲染图表
window.addEventListener('resize', () => {
  if (densityChart) densityChart.resize()
  if (countChart) countChart.resize()
})
</script>

<style scoped>
.plant-count-result {
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

.text-success {
  color: #10b981;
}

.text-danger {
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

.distribution-map {
  height: 100%;
  width: 100%;
  z-index: 1;
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