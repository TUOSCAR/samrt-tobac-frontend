<template>
  <div class="technician-workbench">
    <div class="workbench-header">
      <h2>技术员工作台</h2>
    </div>
    
    <el-row :gutter="20">
      <!-- 欢迎卡片 -->
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <h3>您好，{{ userInfo.username }}</h3>
              <p>欢迎回到工作台，今天是 {{ today }}，您有 {{ pendingTasks.length }} 个待处理任务。</p>
            </div>
            <el-button type="primary">查看待办</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="workbench-stats">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon warning"><el-icon-info-filled /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingTasks }}</div>
              <div class="stat-label">待处理任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon info"><el-icon-location /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalFields }}</div>
              <div class="stat-label">管辖地块</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon success"><el-icon-check /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completedTasks }}</div>
              <div class="stat-label">本月已完成任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="workbench-content">
      <!-- 待处理任务 -->
      <el-col :xs="24" :lg="14">
        <el-card class="workbench-card">
          <template #header>
            <div class="card-header">
              <span>待处理任务</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          
          <div class="task-list">
            <div v-if="pendingTasks.length === 0" class="no-data">
              暂无待处理任务
            </div>
            <div
              v-for="task in pendingTasks"
              :key="task.id"
              class="task-item"
            >
              <div class="task-icon">
                <el-icon :class="getTaskIconClass(task.task_type)">
                  <component :is="getTaskIcon(task.task_type)" />
                </el-icon>
              </div>
              <div class="task-content">
                <div class="task-title">{{ task.task_name }}</div>
                <div class="task-desc">{{ task.description }}</div>
                <div class="task-meta">
                  <span class="task-date">截止日期: {{ formatDate(task.due_date) }}</span>
                  <StatusTag :status="task.priority" :options="priorityOptions" />
                </div>
              </div>
              <div class="task-actions">
                <el-button type="primary" size="small">处理</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 近期地块概览 -->
      <el-col :xs="24" :lg="10">
        <el-card class="workbench-card">
          <template #header>
            <div class="card-header">
              <span>管辖地块概览</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          
          <div class="field-list">
            <div
              v-for="field in fields"
              :key="field.id"
              class="field-item"
            >
              <div class="field-info">
                <div class="field-name">{{ field.field_name }}</div>
                <div class="field-code">编号: {{ field.field_code }}</div>
                <div class="field-area">
                  <span>合同面积: {{ field.contract_area }}亩</span>
                  <span>实际面积: {{ field.actual_area }}亩</span>
                </div>
              </div>
              <div class="field-status">
                <StatusTag 
                  :status="field.status" 
                  :options="fieldStatusOptions"
                  show-icon
                />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { formatDate } from '@/utils/date'
import StatusTag from '@/components/common/StatusTag.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => {
  return userStore.user || { username: '技术员' }
})

// 今天日期
const today = computed(() => {
  return formatDate(new Date(), 'YYYY年MM月DD日')
})

// 统计数据
const stats = reactive({
  pendingTasks: 5,
  totalFields: 12,
  completedTasks: 8
})

// 待处理任务
const pendingTasks = ref([
  {
    id: 1,
    task_name: '东山地块异常诊断',
    description: '请查看东山1号烟田异常诊断结果，并制定防治策略',
    task_type: 'diagnosis',
    due_date: '2023-08-10T17:00:00Z',
    priority: 'high'
  },
  {
    id: 2,
    task_name: '西峰烟田施肥指导',
    description: '根据土壤检测结果，制定西峰2号烟田的施肥方案',
    task_type: 'fertilizer',
    due_date: '2023-08-12T17:00:00Z',
    priority: 'medium'
  },
  {
    id: 3,
    task_name: '南坡烟田灌溉检查',
    description: '检查南坡烟田的灌溉系统是否正常工作',
    task_type: 'irrigation',
    due_date: '2023-08-08T17:00:00Z',
    priority: 'low'
  }
])

// 地块数据
const fields = ref([
  {
    id: 1,
    field_name: '东山1号烟田',
    field_code: 'F2023001',
    contract_area: 8.5,
    actual_area: 8.2,
    status: 'normal'
  },
  {
    id: 2,
    field_name: '西峰2号烟田',
    field_code: 'F2023002',
    contract_area: 6.2,
    actual_area: 6.0,
    status: 'warning'
  },
  {
    id: 3,
    field_name: '南坡3号烟田',
    field_code: 'F2023003',
    contract_area: 5.8,
    actual_area: 5.5,
    status: 'danger'
  }
])

// 优先级选项
const priorityOptions = [
  { value: 'high', label: '高', type: 'danger' },
  { value: 'medium', label: '中', type: 'warning' },
  { value: 'low', label: '低', type: 'info' }
]

// 地块状态选项
const fieldStatusOptions = [
  { value: 'normal', label: '正常', type: 'success', icon: 'el-icon-check' },
  { value: 'warning', label: '需关注', type: 'warning', icon: 'el-icon-warning' },
  { value: 'danger', label: '异常', type: 'danger', icon: 'el-icon-error' }
]

// 获取任务图标
const getTaskIcon = (type: string) => {
  switch (type) {
    case 'diagnosis':
      return 'el-icon-warning'
    case 'fertilizer':
      return 'el-icon-box'
    case 'irrigation':
      return 'el-icon-umbrella'
    default:
      return 'el-icon-document'
  }
}

// 获取任务图标样式类
const getTaskIconClass = (type: string) => {
  switch (type) {
    case 'diagnosis':
      return 'task-icon-warning'
    case 'fertilizer':
      return 'task-icon-info'
    case 'irrigation':
      return 'task-icon-primary'
    default:
      return ''
  }
}

onMounted(() => {
  // 加载工作台数据
  // 实际项目中这里应调用API获取数据
})
</script>

<style scoped>
.technician-workbench {
  padding: 16px;
}

.workbench-header {
  margin-bottom: 24px;
}

.workbench-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.welcome-card {
  margin-bottom: 20px;
  background-color: #ecf5ff;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
}

.welcome-text p {
  margin: 0;
  color: #606266;
}

.workbench-stats {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-icon.success {
  color: #67c23a;
}

.stat-icon.warning {
  color: #e6a23c;
}

.stat-icon.info {
  color: #909399;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.workbench-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #909399;
}

.task-item {
  display: flex;
  padding: 16px;
  border-radius: 4px;
  background-color: #f5f7fa;
  transition: background-color 0.3s;
}

.task-item:hover {
  background-color: #edf2fc;
}

.task-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ecf5ff;
  color: #409eff;
  margin-right: 16px;
}

.task-icon-warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.task-icon-info {
  background-color: #f4f4f5;
  color: #909399;
}

.task-icon-primary {
  background-color: #ecf5ff;
  color: #409eff;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.task-date {
  color: #909399;
}

.task-actions {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  background-color: #f5f7fa;
  transition: background-color 0.3s;
}

.field-item:hover {
  background-color: #edf2fc;
}

.field-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.field-code {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.field-area {
  font-size: 12px;
  color: #606266;
  display: flex;
  gap: 16px;
}
</style> 