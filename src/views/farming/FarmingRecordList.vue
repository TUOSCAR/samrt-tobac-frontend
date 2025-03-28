<template>
  <div class="farming-record-list">
    <div class="page-header">
      <h2>农事记录</h2>
      <div class="actions">
        <el-button type="success" @click="showStatistics">
          <el-icon><DataAnalysis /></el-icon>统计分析
        </el-button>
        <el-button type="primary" @click="createRecord">
          <el-icon><Plus /></el-icon>添加农事记录
        </el-button>
      </div>
    </div>
    
    <el-card>
      <div class="filter-container">
        <el-form :inline="true" :model="filter" class="filter-form">
          <el-form-item label="地块">
            <el-select 
              v-model="filter.field_id" 
              placeholder="选择地块" 
              clearable 
              style="width: 220px"
            >
              <el-option 
                v-for="field in fields" 
                :key="field.id" 
                :label="field.field_name" 
                :value="field.id">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="操作类型">
            <el-select 
              v-model="filter.operation_type" 
              placeholder="选择操作类型" 
              clearable
              style="width: 180px"
            >
              <el-option 
                v-for="type in operationTypes" 
                :key="type.type_code" 
                :label="type.type_name" 
                :value="type.type_code">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 350px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table 
        v-loading="loading" 
        :data="records" 
        style="width: 100%" 
        border 
        @row-click="handleRowClick" 
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operation_type" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeColor(row.operation_type)">
              {{ getOperationTypeName(row.operation_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation_date" label="操作日期" width="160">
          <template #default="{ row }">
            {{ formatDate(row.operation_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="field_id" label="地块" width="180">
          <template #default="{ row }">
            {{ getFieldName(row.field_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="operation_details" label="操作详情" min-width="250" show-overflow-tooltip />
        <el-table-column prop="operation_area" label="作业面积(亩)" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              link
              @click.stop="viewRecord(row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              link
              @click.stop="editRecord(row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              link
              @click.stop="confirmDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 统计分析对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      title="农事记录统计分析"
      width="800px"
      destroy-on-close
    >
      <div class="statistics-container" v-loading="loadingStats">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="操作类型统计" name="type">
            <div class="chart-container">
              <div ref="typeChartRef" style="width: 100%; height: 400px;"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="地块作业统计" name="field">
            <div class="chart-container">
              <div ref="fieldChartRef" style="width: 100%; height: 400px;"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="时间趋势分析" name="time">
            <div class="chart-container">
              <div ref="timeChartRef" style="width: 100%; height: 400px;"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, DataAnalysis } from '@element-plus/icons-vue'
import * as echarts from 'echarts/core'
import { BarChart, PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  getFarmingOperationList, 
  getFarmingOperationTypeList,
  deleteFarmingOperationRecord
} from '@/api/farming'
import { getAllFields } from '@/api/field'
import { farmingOperationTypes } from '@/mock/farming'

// 注册echarts组件
echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
])

// 定义状态变量
const router = useRouter()
const loading = ref(false)
const records = ref<any[]>([])
const fields = ref<any[]>([])
const operationTypes = ref<any[]>([])
const dateRange = ref<[string, string] | null>(null)

// 统计分析相关
const statisticsDialogVisible = ref(false)
const loadingStats = ref(false)
const activeTab = ref('type')
const typeChartRef = ref<HTMLElement | null>(null)
const fieldChartRef = ref<HTMLElement | null>(null)
const timeChartRef = ref<HTMLElement | null>(null)
// 使用any类型暂时绕过类型检查问题
const typeChart = ref<any>(null)
const fieldChart = ref<any>(null)
const timeChart = ref<any>(null)

// 筛选条件
const filter = reactive({
  field_id: '',
  operation_type: '',
  start_date: '',
  end_date: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取操作类型名称
const getOperationTypeName = (typeCode: string): string => {
  const type = operationTypes.value.find(t => t.type_code === typeCode)
  return type ? type.type_name : typeCode
}

// 获取操作类型标签颜色
const getOperationTypeColor = (typeCode: string): string => {
  const colorMap: Record<string, string> = {
    transplanting: 'success',
    fertilizing: 'primary',
    watering: 'info',
    pest_control: 'danger',
    topping: 'warning',
    harvesting: '',
    weeding: ''
  }
  
  return colorMap[typeCode] || ''
}

// 获取地块名称
const getFieldName = (fieldId: number): string => {
  const field = fields.value.find(f => f.id === fieldId)
  return field ? field.field_name : `地块#${fieldId}`
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 加载农事记录列表
const loadRecords = async () => {
  try {
    loading.value = true
    
    // 准备请求参数
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filter
    }
    
    // 从日期范围中提取开始和结束日期
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    
    const res = await getFarmingOperationList(params)
    
    if (res.code === 200) {
      records.value = res.data
      pagination.total = res.meta.total
    } else {
      ElMessage.error('获取农事记录失败')
    }
  } catch (error) {
    console.error('加载农事记录出错', error)
    ElMessage.error('加载农事记录出错')
  } finally {
    loading.value = false
  }
}

// 加载地块列表
const loadFields = async () => {
  try {
    const res = await getAllFields()
    if (res.success) {
      fields.value = res.data
    }
  } catch (error) {
    console.error('加载地块列表出错', error)
  }
}

// 加载操作类型列表
const loadOperationTypes = async () => {
  try {
    const res = await getFarmingOperationTypeList()
    if (res.success) {
      operationTypes.value = res.data
    }
  } catch (error) {
    console.error('加载操作类型列表出错', error)
  }
}

// 处理筛选
const handleFilter = () => {
  pagination.page = 1
  loadRecords()
}

// 重置筛选
const resetFilter = () => {
  filter.field_id = ''
  filter.operation_type = ''
  dateRange.value = null
  handleFilter()
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  loadRecords()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadRecords()
}

// 行点击事件
const handleRowClick = (row: any) => {
  viewRecord(row)
}

// 查看记录详情
const viewRecord = (row: any) => {
  router.push(`/farming/records/${row.id}`)
}

// 创建新记录
const createRecord = () => {
  router.push('/farming/records/create')
}

// 编辑记录
const editRecord = (row: any) => {
  router.push(`/farming/records/edit/${row.id}`)
}

// 确认删除记录
const confirmDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除ID为 ${row.id} 的农事记录吗？`, '删除确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteFarmingOperationRecord(row.id)
      if (res.success) {
        ElMessage.success('删除成功')
        loadRecords()
      } else {
        ElMessage.error(`删除失败: ${res.message}`)
      }
    } catch (error) {
      console.error('删除记录出错', error)
      ElMessage.error('删除记录出错')
    }
  }).catch(() => {})
}

// 显示统计分析对话框
const showStatistics = () => {
  statisticsDialogVisible.value = true
  generateStatistics()
}

// 生成统计分析图表
const generateStatistics = async () => {
  loadingStats.value = true
  
  try {
    // 加载所有记录用于统计
    const params = {
      pageSize: 1000, // 加载大量数据用于统计
      ...filter
    }
    
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    
    const res = await getFarmingOperationList(params)
    
    if (res.success) {
      const allRecords = res.data
      
      // 初始化图表
      if (typeChartRef.value && !typeChart.value) {
        typeChart.value = echarts.init(typeChartRef.value)
      }
      
      if (fieldChartRef.value && !fieldChart.value) {
        fieldChart.value = echarts.init(fieldChartRef.value)
      }
      
      if (timeChartRef.value && !timeChart.value) {
        timeChart.value = echarts.init(timeChartRef.value)
      }
      
      // 操作类型统计
      if (typeChart.value) {
        renderTypeChart(allRecords, typeChart.value)
      }
      
      // 地块统计
      if (fieldChart.value) {
        renderFieldChart(allRecords, fieldChart.value)
      }
      
      // 时间趋势分析
      if (timeChart.value) {
        renderTimeChart(allRecords, timeChart.value)
      }
    }
  } catch (error) {
    console.error('加载统计数据出错', error)
    ElMessage.error('加载统计数据出错')
  } finally {
    loadingStats.value = false
  }
}

// 渲染操作类型统计图表
const renderTypeChart = (records: any[], chart: echarts.ECharts) => {
  // 按操作类型分组统计
  const typeStats = {} as Record<string, number>
  
  records.forEach(record => {
    const type = record.operation_type
    typeStats[type] = (typeStats[type] || 0) + 1
  })
  
  // 转换为饼图数据
  const pieData = Object.keys(typeStats).map(type => {
    const typeName = getOperationTypeName(type)
    return { value: typeStats[type], name: typeName }
  })
  
  chart.setOption({
    title: {
      text: '农事操作类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: pieData.map(item => item.name)
    },
    series: [
      {
        name: '操作类型',
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {c} ({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        data: pieData
      }
    ]
  })
}

// 渲染地块作业统计图表
const renderFieldChart = (records: any[], chart: echarts.ECharts) => {
  // 按地块分组统计
  const fieldStats = {} as Record<number, { count: number, area: number }>
  
  records.forEach(record => {
    const fieldId = record.field_id
    
    if (!fieldStats[fieldId]) {
      fieldStats[fieldId] = { count: 0, area: 0 }
    }
    
    fieldStats[fieldId].count += 1
    fieldStats[fieldId].area += record.operation_area || 0
  })
  
  // 转换为柱状图数据
  const fieldNames = Object.keys(fieldStats).map(id => getFieldName(parseInt(id)))
  const counts = Object.values(fieldStats).map(stat => stat.count)
  const areas = Object.values(fieldStats).map(stat => parseFloat(stat.area.toFixed(2)))
  
  chart.setOption({
    title: {
      text: '地块作业统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['作业次数', '作业面积(亩)'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: fieldNames,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '次数',
        position: 'left'
      },
      {
        type: 'value',
        name: '面积(亩)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '作业次数',
        type: 'bar',
        data: counts
      },
      {
        name: '作业面积(亩)',
        type: 'bar',
        yAxisIndex: 1,
        data: areas
      }
    ]
  })
}

// 渲染时间趋势分析图表
const renderTimeChart = (records: any[], chart: echarts.ECharts) => {
  // 按月份分组统计
  const monthStats = {} as Record<string, number>
  
  records.forEach(record => {
    const date = new Date(record.operation_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    monthStats[monthKey] = (monthStats[monthKey] || 0) + 1
  })
  
  // 按日期排序
  const sortedMonths = Object.keys(monthStats).sort()
  const counts = sortedMonths.map(month => monthStats[month])
  
  chart.setOption({
    title: {
      text: '农事操作时间趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: sortedMonths,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '操作次数'
    },
    series: [
      {
        name: '操作次数',
        type: 'line',
        data: counts,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        smooth: true
      }
    ]
  })
}

// 监听窗口大小变化，重绘图表
const handleResize = () => {
  if (typeChart.value) {
    typeChart.value.resize()
  }
  if (fieldChart.value) {
    fieldChart.value.resize()
  }
  if (timeChart.value) {
    timeChart.value.resize()
  }
}

// 监听标签页切换，重绘当前图表
const handleTabChange = (tab: string) => {
  setTimeout(() => {
    if (tab === 'type' && typeChart.value) {
      typeChart.value.resize()
    } else if (tab === 'field' && fieldChart.value) {
      fieldChart.value.resize()
    } else if (tab === 'time' && timeChart.value) {
      timeChart.value.resize()
    }
  }, 50)
}

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadFields(),
    loadOperationTypes()
  ])
  
  // 加载记录列表
  loadRecords()
  
  // 添加窗口大小调整监听器
  window.addEventListener('resize', handleResize)
})

// 组件销毁前清理
onBeforeUnmount(() => {
  // 移除窗口大小调整监听器
  window.removeEventListener('resize', handleResize)
  
  // 销毁图表实例
  if (typeChart.value) {
    typeChart.value.dispose()
  }
  if (fieldChart.value) {
    fieldChart.value.dispose()
  }
  if (timeChart.value) {
    timeChart.value.dispose()
  }
})
</script>

<style scoped>
.farming-record-list {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
}

.filter-container {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

.statistics-container {
  min-height: 450px;
}

.chart-container {
  padding: 10px;
}
</style> 