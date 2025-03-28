<template>
  <div class="analysis-report">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h3>分析报告</h3>
          <div class="operations">
            <el-dropdown @command="exportReport" split-button type="primary">
              导出
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="pdf">导出为PDF</el-dropdown-item>
                  <el-dropdown-item command="word">导出为Word</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="handleRefresh" class="ml-2">
              <el-icon><Refresh /></el-icon>刷新
            </el-button>
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

    <!-- 报告列表和详情视图 -->
    <div class="report-container">
      <!-- 左侧列表 -->
      <div class="report-list-container" :class="{ collapsed: isReportExpanded }">
        <el-card class="report-list-card">
          <template #header>
            <div class="card-header">
              <h4>报告列表</h4>
              <span class="report-count" v-if="reportList.length">{{ reportList.length }}份报告</span>
            </div>
          </template>
          
          <div v-if="loading" class="loading-container">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else-if="reportList.length === 0" class="no-data">
            暂无分析报告
          </div>
          <div v-else class="report-list">
            <div 
              v-for="report in reportList" 
              :key="report.id" 
              class="report-item"
              :class="{ active: selectedReport && selectedReport.id === report.id }"
              @click="selectReport(report)"
            >
              <div class="report-item-header">
                <h5 class="report-title" :title="report.report_title">{{ report.report_title }}</h5>
                <el-tag 
                  size="small" 
                  :type="report.field_id ? 'success' : 'primary'"
                >
                  {{ report.field_id ? '地块报告' : '综合报告' }}
                </el-tag>
              </div>
              <div class="report-meta">
                <div class="report-date">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ formatDate(report.created_at) }}</span>
                </div>
                <div class="report-ai">
                  <el-icon><Connection /></el-icon>
                  <span>{{ report.generated_by }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 右侧详情 -->
      <div class="report-detail-container" :class="{ expanded: isReportExpanded }">
        <el-card class="report-detail-card" v-if="selectedReport">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-button 
                  v-if="isReportExpanded" 
                  @click="toggleReportExpand" 
                  class="back-button"
                  icon="ArrowLeft"
                  circle
                />
                <h4>{{ selectedReport.report_title }}</h4>
              </div>
              <div class="header-actions">
                <el-button-group>
                  <el-tooltip content="切换全屏查看" placement="top">
                    <el-button @click="toggleReportExpand" icon="FullScreen" circle />
                  </el-tooltip>
                  <el-tooltip content="导出PDF" placement="top">
                    <el-button @click="exportReport('pdf')" icon="Document" circle />
                  </el-tooltip>
                  <el-tooltip content="导出Word" placement="top">
                    <el-button @click="exportReport('word')" icon="DocumentCopy" circle />
                  </el-tooltip>
                  <el-tooltip content="打印" placement="top">
                    <el-button @click="handlePrint" icon="Printer" circle />
                  </el-tooltip>
                </el-button-group>
              </div>
            </div>
          </template>
          
          <div v-if="loading" class="loading-container centered">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
          <div v-else class="report-detail">
            <div class="report-info">
              <div class="report-info-item">
                <span class="label">生成时间：</span>
                <span class="value">{{ formatDate(selectedReport.created_at) }}</span>
              </div>
              <div class="report-info-item">
                <span class="label">大模型：</span>
                <span class="value">{{ selectedReport.generated_by }}</span>
              </div>
              <div class="report-info-item">
                <span class="label">状态：</span>
                <span class="value">
                  <el-tag :type="selectedReport.status === 'published' ? 'success' : 'warning'">
                    {{ selectedReport.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </span>
              </div>
            </div>
            
            <!-- 报告内容 -->
            <div class="report-content">
              <div id="report-html-content" ref="reportContent" v-html="selectedReport.report_content"></div>
            </div>
          </div>
        </el-card>
        
        <el-empty 
          v-else 
          description="请选择报告进行查看" 
          :image-size="200"
        >
          <template #image>
            <el-icon style="font-size: 100px; color: #909399;"><Document /></el-icon>
          </template>
        </el-empty>
      </div>
    </div>
    
    <!-- 相关操作 -->
    <el-card class="action-card" v-if="selectedReport">
      <div class="action-content">
        <el-alert
          title="您可以根据分析报告结果，进行后续决策操作"
          type="success"
          show-icon
        >
          <template #default>
            <p>通过分析报告可了解烟田的整体状况，结合异常诊断和策略推演，制定合理的管理计划。</p>
          </template>
        </el-alert>
        <div class="action-buttons">
          <el-button type="primary" @click="viewStrategy">查看策略推演</el-button>
          <el-button @click="viewMonitoringPlan">查看监测规划</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTaskList } from '@/api/task'
import { getFieldsByTask } from '@/api/field'
import {
  getAnalysisReports,
  getAnalysisReportDetail,
  getTaskAnalysisReports,
  getFieldAnalysisReports,
  exportAnalysisReport
} from '@/api/llm'

// 定义数据
const taskList = ref<any[]>([])
const fieldList = ref<any[]>([])
const selectedTask = ref('')
const selectedField = ref('')
const reportList = ref<any[]>([])
const selectedReport = ref<any>(null)
const isReportExpanded = ref(false)
const loading = ref(false)
const reportContent = ref<HTMLElement | null>(null)

// 路由
const route = useRoute()
const router = useRouter()

// 初始化
onMounted(async () => {
  // 获取URL参数
  const taskId = route.query.taskId as string
  const fieldId = route.query.fieldId as string
  const reportId = route.query.reportId as string
  
  if (taskId) {
    selectedTask.value = taskId
  }
  
  await loadTasks()
  
  if (selectedTask.value) {
    await loadFields(selectedTask.value)
    
    if (fieldId) {
      selectedField.value = fieldId
    }
    
    await loadReports()
    
    if (reportId && reportList.value.length > 0) {
      const report = reportList.value.find(r => r.id.toString() === reportId)
      if (report) {
        selectedReport.value = report
        isReportExpanded.value = true
      }
    } else if (reportList.value.length > 0) {
      selectedReport.value = reportList.value[0]
    }
  } else {
    await loadReports()
    if (reportList.value.length > 0) {
      selectedReport.value = reportList.value[0]
    }
  }
})

// 加载任务列表
async function loadTasks() {
  try {
    loading.value = true
    const res = await getTaskList({ page: 1, pageSize: 100 })
    taskList.value = res.data.list || []
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

// 加载报告列表
async function loadReports() {
  try {
    loading.value = true
    
    let res: any
    
    if (selectedField.value) {
      res = await getFieldAnalysisReports(parseInt(selectedField.value))
    } else if (selectedTask.value) {
      res = await getTaskAnalysisReports(parseInt(selectedTask.value))
    } else {
      res = await getAnalysisReports()
    }
    
    reportList.value = Array.isArray(res.data) ? res.data : []
    
    // 更新URL参数
    router.push({
      query: {
        ...route.query,
        taskId: selectedTask.value,
        fieldId: selectedField.value,
        reportId: selectedReport.value?.id
      }
    })
    
    loading.value = false
  } catch (error) {
    console.error('加载报告列表失败', error)
    ElMessage.error('加载报告列表失败')
    loading.value = false
  }
}

// 选择报告
async function selectReport(report: any) {
  try {
    loading.value = true
    
    // 获取报告详情
    const res = await getAnalysisReportDetail(report.id)
    selectedReport.value = res.data
    isReportExpanded.value = true
    
    // 更新URL参数
    router.push({
      query: {
        ...route.query,
        reportId: report.id
      }
    })
    
    loading.value = false
  } catch (error) {
    console.error('加载报告详情失败', error)
    ElMessage.error('加载报告详情失败')
    loading.value = false
  }
}

// 处理任务变化
function handleTaskChange() {
  // 由watch监听器处理
}

// 处理地块变化
function handleFieldChange() {
  // 由watch监听器处理
}

// 处理刷新
function handleRefresh() {
  loadReports()
}

// 监听任务变化
watch(selectedTask, async (newValue) => {
  if (newValue) {
    await loadFields(newValue)
    selectedField.value = ''
    await loadReports()
    
    if (reportList.value.length > 0) {
      selectedReport.value = reportList.value[0]
      isReportExpanded.value = false
    } else {
      selectedReport.value = null
    }
  }
})

// 监听地块变化
watch(selectedField, async (newValue) => {
  if (newValue || selectedTask.value) {
    await loadReports()
    
    if (reportList.value.length > 0) {
      selectedReport.value = reportList.value[0]
      isReportExpanded.value = false
    } else {
      selectedReport.value = null
    }
  }
})

// 导出报告
function exportReport(format: string) {
  if (!selectedReport.value) return
  
  try {
    exportAnalysisReport(selectedReport.value.id, format)
    ElMessage.success(`报告已导出为${format.toUpperCase()}格式`)
  } catch (error) {
    console.error('导出报告失败', error)
    ElMessage.error('导出报告失败')
  }
}

// 格式化时间
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

// 查看策略推荐
function viewStrategy() {
  if (!selectedReport.value) return
  
  router.push({
    name: 'StrategyRecommendation',
    query: {
      taskId: selectedTask.value,
      fieldId: selectedReport.value.field_id,
      reportId: selectedReport.value.id
    }
  })
}

// 查看监测规划
function viewMonitoringPlan() {
  if (!selectedReport.value) return
  
  router.push({
    name: 'MonitoringPlan',
    query: {
      taskId: selectedTask.value,
      reportId: selectedReport.value.id
    }
  })
}

// 切换报告展开状态
function toggleReportExpand() {
  isReportExpanded.value = !isReportExpanded.value
}

// 打印报告
function handlePrint() {
  if (!selectedReport.value) return
  
  const printContent = document.getElementById('report-html-content')
  if (!printContent) return
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    ElMessage.error('无法打开打印窗口，请检查浏览器设置')
    return
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>${selectedReport.value.report_title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
          }
          .report-title {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .report-meta {
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .report-section {
            margin-bottom: 30px;
          }
          h1, h2, h3 {
            color: #333;
          }
          h2 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 20px;">
          <button onclick="window.print()">打印</button>
        </div>
        ${printContent.innerHTML}
      </body>
    </html>
  `)
  
  printWindow.document.close()
}
</script>

<style scoped>
.analysis-report {
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

.report-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  min-height: 600px;
}

.report-list-container {
  width: 30%;
  transition: all 0.3s ease;
}

.report-list-container.collapsed {
  width: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.report-detail-container {
  flex: 1;
  transition: all 0.3s ease;
}

.report-detail-container.expanded {
  width: 100%;
}

.report-list-card {
  height: 100%;
}

.report-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.report-list {
  max-height: 550px;
  overflow-y: auto;
}

.report-item {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.report-item:hover {
  background-color: #f5f7fa;
}

.report-item.active {
  background-color: #ecf5ff;
}

.report-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.report-title {
  margin: 0;
  font-size: 16px;
  width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 13px;
}

.report-date, .report-ai {
  display: flex;
  align-items: center;
  gap: 5px;
}

.report-detail-card {
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button {
  margin-right: 10px;
}

.report-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.report-info-item {
  display: flex;
  align-items: center;
}

.report-info-item .label {
  font-weight: bold;
  margin-right: 5px;
  color: #606266;
}

.report-content {
  padding: 20px 10px;
}

/* 报告HTML内容样式 */
:deep(.report-container) {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

:deep(.report-title) {
  font-size: 24px;
  margin: 20px 0;
  text-align: center;
}

:deep(.report-meta) {
  margin: 20px 0;
  font-size: 14px;
  color: #666;
}

:deep(.report-summary) {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}

:deep(.report-section) {
  margin: 30px 0;
}

:deep(.report-section h2) {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

:deep(.chart-placeholder) {
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  padding: 20px;
  text-align: center;
  margin: 15px 0;
  border-radius: 4px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-container.centered {
  min-height: 300px;
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

@media (max-width: 768px) {
  .report-container {
    flex-direction: column;
  }
  
  .report-list-container {
    width: 100% !important;
  }
  
  .report-list-container.collapsed {
    display: none;
  }
  
  .report-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 