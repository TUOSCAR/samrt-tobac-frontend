<template>
  <div class="land-stats">
    <el-row :gutter="20">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>作物分布</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import * as landService from '@/services/landService'
import { ElMessage } from 'element-plus'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// 统计数据
const stats = ref([
  { title: '总面积(亩)', value: 0 },
  { title: '种植面积(亩)', value: 0 },
  { title: '空闲面积(亩)', value: 0 },
  { title: '收获面积(亩)', value: 0 }
])

// 作物分布数据
const cropDistribution = ref<Record<string, number>>({})

// 获取统计数据
const fetchStats = async () => {
  try {
    const data = await landService.getLandStats()
    stats.value = [
      { title: '总面积(亩)', value: data.totalArea.toFixed(2) },
      { title: '种植面积(亩)', value: data.plantingArea.toFixed(2) },
      { title: '空闲面积(亩)', value: data.idleArea.toFixed(2) },
      { title: '收获面积(亩)', value: data.harvestingArea.toFixed(2) }
    ]
    cropDistribution.value = data.cropDistribution
    updateChart()
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

// 更新图表
const updateChart = () => {
  if (!chartRef.value || !chart) return

  const cropNames: Record<string, string> = {
    tobacco: '烟草',
    corn: '玉米',
    rice: '水稻'
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}亩 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: Object.entries(cropDistribution.value).map(([crop, area]) => ({
          name: cropNames[crop] || crop,
          value: area
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  updateChart()
}

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

// 生命周期钩子
onMounted(() => {
  initChart()
  fetchStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.land-stats {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-card {
  margin-top: 20px;
}

.chart-container {
  height: 400px;
}
</style> 