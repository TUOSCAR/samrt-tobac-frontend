<template>
  <div class="weather-panel">
    <el-card class="weather-card">
      <template #header>
        <div class="card-header">
          <span>气象数据</span>
          <el-button
            v-if="showRefresh"
            :icon="Refresh"
            circle
            @click="handleRefresh"
          />
        </div>
      </template>
      
      <div class="weather-content">
        <template v-if="weatherData">
          <div class="weather-grid">
            <div class="weather-item">
              <el-icon class="weather-icon"><Sunny /></el-icon>
              <div class="weather-info">
                <div class="weather-label">温度</div>
                <div class="weather-value">{{ weatherData.temperature }}°C</div>
              </div>
            </div>
            <div class="weather-item">
              <el-icon class="weather-icon"><Umbrella /></el-icon>
              <div class="weather-info">
                <div class="weather-label">湿度</div>
                <div class="weather-value">{{ weatherData.humidity }}%</div>
              </div>
            </div>
            <div class="weather-item">
              <el-icon class="weather-icon"><WindPower /></el-icon>
              <div class="weather-info">
                <div class="weather-label">风速</div>
                <div class="weather-value">{{ weatherData.windSpeed }}m/s</div>
              </div>
            </div>
            <div class="weather-item">
              <el-icon class="weather-icon"><Cloudy /></el-icon>
              <div class="weather-info">
                <div class="weather-label">降水量</div>
                <div class="weather-value">{{ weatherData.precipitation }}mm</div>
              </div>
            </div>
          </div>

          <div class="weather-chart">
            <div class="chart-header">
              <span>24小时趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="temperature">温度</el-radio-button>
                <el-radio-button label="humidity">湿度</el-radio-button>
                <el-radio-button label="windSpeed">风速</el-radio-button>
                <el-radio-button label="precipitation">降水量</el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart-container" ref="chartRef"></div>
          </div>
        </template>
        <el-empty v-else description="暂无气象数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Sunny, Umbrella, WindPower, Cloudy, Refresh } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  precipitation: number
  history: {
    time: string
    temperature: number
    humidity: number
    windSpeed: number
    precipitation: number
  }[]
}

const props = defineProps<{
  weatherData: WeatherData | null
  showRefresh?: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const chartRef = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)
const chartType = ref<'temperature' | 'humidity' | 'windSpeed' | 'precipitation'>('temperature')

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表数据
const updateChart = () => {
  if (!chart.value || !props.weatherData) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.weatherData.history.map(item => item.time)
    },
    yAxis: {
      type: 'value',
      name: getYAxisName()
    },
    series: [
      {
        name: getSeriesName(),
        type: 'line',
        smooth: true,
        data: props.weatherData.history.map(item => item[chartType.value])
      }
    ]
  }

  chart.value.setOption(option)
}

// 获取Y轴名称
const getYAxisName = () => {
  switch (chartType.value) {
    case 'temperature':
      return '温度(°C)'
    case 'humidity':
      return '湿度(%)'
    case 'windSpeed':
      return '风速(m/s)'
    case 'precipitation':
      return '降水量(mm)'
    default:
      return ''
  }
}

// 获取系列名称
const getSeriesName = () => {
  switch (chartType.value) {
    case 'temperature':
      return '温度'
    case 'humidity':
      return '湿度'
    case 'windSpeed':
      return '风速'
    case 'precipitation':
      return '降水量'
    default:
      return ''
  }
}

// 处理刷新
const handleRefresh = () => {
  emit('refresh')
}

// 监听图表类型变化
watch(chartType, () => {
  updateChart()
})

// 监听数据变化
watch(() => props.weatherData, () => {
  updateChart()
})

// 监听窗口大小变化
const handleResize = () => {
  chart.value?.resize()
}

// 生命周期钩子
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart.value?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.weather-panel {
  width: 100%;
  height: 100%;
}

.weather-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-content {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.weather-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.weather-icon {
  font-size: 24px;
  color: #409eff;
}

.weather-info {
  flex: 1;
}

.weather-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.weather-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.weather-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  flex: 1;
  min-height: 200px;
}
</style> 