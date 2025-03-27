<template>
  <div class="farmer-dashboard">
    <div class="dashboard-header">
      <h2>我的烟田</h2>
    </div>
    
    <el-row :gutter="20">
      <!-- 欢迎卡片 -->
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <h3>您好，{{ userInfo.username }}</h3>
              <p>今天是 {{ today }}，您有 {{ pendingTasks.length }} 个待处理任务。</p>
            </div>
            <div class="weather-brief">
              <el-icon><el-icon-partly-cloudy /></el-icon>
              <span>{{ weather.temperature }}°C {{ weather.description }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <!-- 我的地块 -->
      <el-col :xs="24" :lg="16">
        <el-card class="field-card">
          <template #header>
            <div class="card-header">
              <span>我的烟田地块</span>
              <el-button type="primary" size="small">查看地图</el-button>
            </div>
          </template>
          
          <div
            v-for="field in myFields"
            :key="field.id"
            class="field-overview"
          >
            <div class="field-header">
              <div class="field-title">
                <h3>{{ field.field_name }}</h3>
                <span class="field-code">编号: {{ field.field_code }}</span>
              </div>
              <StatusTag :status="field.status" :options="fieldStatusOptions" />
            </div>
            
            <el-row :gutter="20" class="field-stats">
              <el-col :span="8">
                <div class="field-stat-item">
                  <div class="stat-value">{{ field.contract_area }}亩</div>
                  <div class="stat-label">合同面积</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="field-stat-item">
                  <div class="stat-value">{{ field.estimated_yield }}kg</div>
                  <div class="stat-label">预计产量</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="field-stat-item">
                  <div class="stat-value">{{ field.last_monitor }}</div>
                  <div class="stat-label">上次监测</div>
                </div>
              </el-col>
            </el-row>
            
            <el-progress 
              :percentage="field.growth_percentage" 
              :color="getGrowthColor(field.growth_percentage)"
              :format="format"
              :stroke-width="10"
              class="growth-progress"
            />
          </div>
        </el-card>
      </el-col>
      
      <!-- 待处理任务与农事日历 -->
      <el-col :xs="24" :lg="8">
        <el-card class="task-card">
          <template #header>
            <div class="card-header">
              <span>待处理任务</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          
          <div v-if="pendingTasks.length === 0" class="no-data">
            暂无待处理任务
          </div>
          <div
            v-for="task in pendingTasks"
            :key="task.id"
            class="task-item"
          >
            <div class="task-item-header">
              <div class="task-title">{{ task.task_name }}</div>
              <StatusTag :status="task.priority" :options="priorityOptions" />
            </div>
            <div class="task-desc">{{ task.description }}</div>
            <div class="task-meta">
              <span>截止日期: {{ formatDate(task.due_date) }}</span>
              <el-button type="primary" size="small">立即处理</el-button>
            </div>
          </div>
        </el-card>
        
        <el-card class="calendar-card">
          <template #header>
            <div class="card-header">
              <span>近期农事安排</span>
              <el-button type="text">查看日历</el-button>
            </div>
          </template>
          
          <div
            v-for="event in farmingEvents"
            :key="event.id"
            class="calendar-event"
          >
            <div class="event-date">
              <div class="date-day">{{ getDayFromDate(event.date) }}</div>
              <div class="date-month">{{ getMonthFromDate(event.date) }}</div>
            </div>
            <div class="event-content">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-desc">{{ event.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { formatDate } from '@/utils/date'
import StatusTag from '@/components/common/StatusTag.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => {
  return userStore.user || { username: '烟农' }
})

// 今天日期
const today = computed(() => {
  return formatDate(new Date(), 'YYYY年MM月DD日')
})

// 天气数据
const weather = reactive({
  temperature: 24,
  description: '多云',
  humidity: 65,
  windSpeed: 10,
  rainfall: 0
})

// 我的地块
const myFields = ref([
  {
    id: 1,
    field_name: '东山1号烟田',
    field_code: 'F2023001',
    contract_area: 8.5,
    actual_area: 8.2,
    estimated_yield: 1750,
    last_monitor: '3天前',
    growth_percentage: 65,
    status: 'normal'
  },
  {
    id: 2,
    field_name: '西峰2号烟田',
    field_code: 'F2023002',
    contract_area: 6.2,
    actual_area: 6.0,
    estimated_yield: 1280,
    last_monitor: '5天前',
    growth_percentage: 78,
    status: 'warning'
  }
])

// 待处理任务
const pendingTasks = ref([
  {
    id: 1,
    task_name: '东山烟田打顶任务',
    description: '根据指导建议，需要对东山1号烟田进行打顶作业',
    due_date: '2023-08-12T17:00:00Z',
    priority: 'high'
  },
  {
    id: 2,
    task_name: '西峰烟田除草任务',
    description: '西峰2号烟田杂草丛生，请及时进行除草',
    due_date: '2023-08-15T17:00:00Z',
    priority: 'medium'
  }
])

// 农事安排
const farmingEvents = ref([
  {
    id: 1,
    title: '化学打顶',
    description: '东山1号烟田进行化学打顶作业',
    date: '2023-08-10T10:00:00Z'
  },
  {
    id: 2,
    title: '追肥',
    description: '西峰2号烟田进行追肥作业',
    date: '2023-08-15T09:00:00Z'
  },
  {
    id: 3,
    title: '病虫害防治',
    description: '全部烟田喷洒防虫药剂',
    date: '2023-08-20T08:00:00Z'
  }
])

// 地块状态选项
const fieldStatusOptions = [
  { value: 'normal', label: '生长正常', type: 'success' },
  { value: 'warning', label: '需要关注', type: 'warning' },
  { value: 'danger', label: '生长异常', type: 'danger' }
]

// 优先级选项
const priorityOptions = [
  { value: 'high', label: '高', type: 'danger' },
  { value: 'medium', label: '中', type: 'warning' },
  { value: 'low', label: '低', type: 'info' }
]

// 获取生长进度条颜色
const getGrowthColor = (percentage: number) => {
  if (percentage < 30) return '#909399'
  if (percentage < 70) return '#409eff'
  return '#67c23a'
}

// 格式化进度条文本
const format = (percentage: number) => {
  return `生长进度 ${percentage}%`
}

// 从日期字符串中获取日
const getDayFromDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.getDate()
}

// 从日期字符串中获取月
const getMonthFromDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  return months[date.getMonth()]
}
</script>

<style scoped>
.farmer-dashboard {
  padding: 16px;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.welcome-card {
  margin-bottom: 20px;
  background-color: #f0f9eb;
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

.weather-brief {
  display: flex;
  align-items: center;
  color: #409eff;
  font-size: 16px;
}

.weather-brief .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.field-card, .task-card, .calendar-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-overview {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.field-overview:last-child {
  margin-bottom: 0;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.field-title h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #303133;
}

.field-code {
  font-size: 12px;
  color: #909399;
}

.field-stats {
  margin-bottom: 16px;
}

.field-stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.growth-progress {
  margin-top: 8px;
}

.task-item {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.task-item:last-child {
  margin-bottom: 0;
}

.task-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.task-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.calendar-event {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.calendar-event:last-child {
  border-bottom: none;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  margin-right: 16px;
}

.date-day {
  font-size: 20px;
  font-weight: bold;
}

.date-month {
  font-size: 12px;
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.event-desc {
  font-size: 14px;
  color: #606266;
}

.no-data {
  padding: 20px;
  text-align: center;
  color: #909399;
}
</style> 