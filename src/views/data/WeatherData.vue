<template>
  <div class="weather-data">
    <div class="page-header">
      <h2>气象数据管理</h2>
      <el-button type="primary" @click="fetchLatestWeather">获取最新气象数据</el-button>
    </div>

    <el-card class="filter-card">
      <div class="filter-form">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="地块">
            <el-select v-model="filterForm.fieldId" placeholder="选择地块" clearable>
              <el-option
                v-for="field in fields"
                :key="field.id"
                :label="field.field_name"
                :value="field.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="data-card">
      <div class="data-view">
        <el-tabs v-model="activeTab" class="weather-tabs">
          <el-tab-pane label="表格视图" name="table">
            <el-table
              v-loading="loading"
              :data="weatherData"
              border
              style="width: 100%"
            >
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="fieldName" label="地块名称" width="150" />
              <el-table-column prop="timestamp" label="时间" width="180" />
              <el-table-column prop="temperature" label="温度(°C)" width="100" />
              <el-table-column prop="humidity" label="湿度(%)" width="100" />
              <el-table-column prop="rainfall" label="降水量(mm)" width="120" />
              <el-table-column prop="windSpeed" label="风速(m/s)" width="100" />
              <el-table-column prop="windDirection" label="风向" width="100" />
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewDetails(scope.row)" plain>
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="pagination-container">
              <el-pagination
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="图表视图" name="chart">
            <div class="chart-container">
              <div class="chart-filters">
                <el-select v-model="chartDataType" placeholder="选择数据类型" @change="updateChart">
                  <el-option label="温度" value="temperature" />
                  <el-option label="湿度" value="humidity" />
                  <el-option label="降水量" value="rainfall" />
                  <el-option label="风速" value="windSpeed" />
                </el-select>
              </div>
              
              <div ref="chartRef" class="chart-view"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailsDialogVisible"
      title="气象数据详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="ID">{{ currentWeatherData.id }}</el-descriptions-item>
        <el-descriptions-item label="地块名称">{{ currentWeatherData.fieldName }}</el-descriptions-item>
        <el-descriptions-item label="时间">{{ currentWeatherData.timestamp }}</el-descriptions-item>
        <el-descriptions-item label="温度">{{ currentWeatherData.temperature }}°C</el-descriptions-item>
        <el-descriptions-item label="湿度">{{ currentWeatherData.humidity }}%</el-descriptions-item>
        <el-descriptions-item label="降水量">{{ currentWeatherData.rainfall }}mm</el-descriptions-item>
        <el-descriptions-item label="风速">{{ currentWeatherData.windSpeed }}m/s</el-descriptions-item>
        <el-descriptions-item label="风向">{{ currentWeatherData.windDirection || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="大气压" :span="2">{{ currentWeatherData.pressure || '未知' }}hPa</el-descriptions-item>
        <el-descriptions-item label="能见度" :span="2">{{ currentWeatherData.visibility || '未知' }}km</el-descriptions-item>
        <el-descriptions-item label="数据来源" :span="2">{{ currentWeatherData.dataSource || '环境云API' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getWeatherData, fetchLatestWeatherData } from '@/api/data'
import { getFields } from '@/api/field'

const weatherData = ref([])
const fields = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const detailsDialogVisible = ref(false)
const currentWeatherData = ref({})
const activeTab = ref('table')
const chartDataType = ref('temperature')
const chartRef = ref(null)
let chartInstance = null

// 筛选表单
const filterForm = reactive({
  fieldId: '',
  dateRange: []
})

// 初始化数据
onMounted(async () => {
  await fetchFields()
  await fetchData()
})

// 获取地块列表
const fetchFields = async () => {
  try {
    const response = await getFields()
    fields.value = response.data
  } catch (error) {
    ElMessage.error('获取地块列表失败')
  }
}

// 获取气象数据列表
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      fieldId: filterForm.fieldId || undefined,
      startTime: filterForm.dateRange?.[0] || undefined,
      endTime: filterForm.dateRange?.[1] || undefined
    }
    
    const response = await getWeatherData(params)
    
    // 转换数据，添加地块名称
    weatherData.value = response.data.map(item => {
      const field = fields.value.find(f => f.id === item.fieldId)
      return {
        ...item,
        fieldName: field ? field.field_name : '未知地块'
      }
    })
    
    total.value = response.meta?.total || weatherData.value.length
    
    // 如果当前是图表视图，则更新图表
    if (activeTab.value === 'chart') {
      nextTick(() => {
        initChart()
      })
    }
  } catch (error) {
    ElMessage.error('获取气象数据失败')
  } finally {
    loading.value = false
  }
}

// 获取最新气象数据
const fetchLatestWeather = async () => {
  try {
    const fieldId = filterForm.fieldId || fields.value[0]?.id
    
    if (!fieldId) {
      ElMessage.warning('请选择地块')
      return
    }
    
    loading.value = true
    await fetchLatestWeatherData(fieldId)
    ElMessage.success('获取最新气象数据成功')
    await fetchData() // 刷新数据
  } catch (error) {
    ElMessage.error('获取最新气象数据失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  fetchData()
}

const resetFilter = () => {
  filterForm.fieldId = ''
  filterForm.dateRange = []
  currentPage.value = 1
  fetchData()
}

// 查看详情
const viewDetails = (row) => {
  currentWeatherData.value = row
  detailsDialogVisible.value = true
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) {
    nextTick(() => {
      initChart()
    })
    return
  }
  
  // 准备图表数据
  const dataType = chartDataType.value
  const titleMap = {
    temperature: '温度(°C)',
    humidity: '湿度(%)',
    rainfall: '降水量(mm)',
    windSpeed: '风速(m/s)'
  }
  
  const chartData = weatherData.value.map(item => ({
    name: item.timestamp,
    value: [item.timestamp, item[dataType]]
  }))
  
  // 排序时间
  chartData.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  
  const option = {
    title: {
      text: `气象数据 - ${titleMap[dataType]}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0].data
        return `${data.name}<br/>${titleMap[dataType]}: ${data.value[1]}`
      }
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: titleMap[dataType],
      nameLocation: 'end'
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: titleMap[dataType],
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        sampling: 'average',
        itemStyle: {
          color: '#91cc75'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(145, 204, 117, 0.5)'
            },
            {
              offset: 1,
              color: 'rgba(145, 204, 117, 0.1)'
            }
          ])
        },
        data: chartData
      }
    ]
  }
  
  chartInstance.setOption(option)
}

// 监听标签页变化
const handleTabChange = (tab) => {
  if (tab.name === 'chart') {
    nextTick(() => {
      initChart()
    })
  }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (chartInstance) {
    chartInstance.resize()
  }
})
</script>

<style scoped>
.weather-data {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-card {
  margin-bottom: 16px;
}

.data-card {
  margin-bottom: 16px;
}

.data-view {
  width: 100%;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.chart-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chart-filters {
  margin-bottom: 16px;
}

.chart-view {
  flex: 1;
  min-height: 400px;
}

.weather-tabs :deep(.el-tabs__content) {
  overflow: visible;
}
</style> 