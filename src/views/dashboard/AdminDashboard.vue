<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h2>管理员仪表盘</h2>
      <div class="time-range">
        <el-select v-model="timeRange" placeholder="选择时间范围">
          <el-option label="今天" value="today" />
          <el-option label="本周" value="thisWeek" />
          <el-option label="本月" value="thisMonth" />
        </el-select>
      </div>
    </div>
    
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><el-icon-monitor /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.taskTotal }}</div>
              <div class="stat-label">监测任务总数</div>
            </div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <el-icon class="trend-icon"><el-icon-arrow-up /></el-icon>
              <span>{{ stats.taskTrend }}%</span>
            </div>
            <div class="time-period">与上周相比</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon warning"><el-icon-message-box /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingTasks }}</div>
              <div class="stat-label">待处理任务</div>
            </div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend down">
              <el-icon class="trend-icon"><el-icon-arrow-down /></el-icon>
              <span>{{ stats.pendingTrend }}%</span>
            </div>
            <div class="time-period">与昨日相比</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon success"><el-icon-check /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completedTasks }}</div>
              <div class="stat-label">已完成任务</div>
            </div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <el-icon class="trend-icon"><el-icon-arrow-up /></el-icon>
              <span>{{ stats.completedTrend }}%</span>
            </div>
            <div class="time-period">与上周相比</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon info"><el-icon-location /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalFields }}</div>
              <div class="stat-label">烟田地块总数</div>
            </div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend flat">
              <el-icon class="trend-icon"><el-icon-minus /></el-icon>
              <span>0%</span>
            </div>
            <div class="time-period">与上月相比</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="dashboard-content">
      <!-- 最近任务列表 -->
      <el-col :xs="24" :lg="16">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>近期监测任务</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="recentTasks" style="width: 100%" :max-height="400">
            <el-table-column prop="task_code" label="任务编号" width="120" />
            <el-table-column prop="task_name" label="任务名称" />
            <el-table-column prop="growing_phase" label="生长阶段" width="120">
              <template #default="scope">
                <StatusTag :status="scope.row.growing_phase" :options="growingPhaseOptions" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <StatusTag :status="scope.row.status" :options="taskStatusOptions" />
              </template>
            </el-table-column>
            <el-table-column prop="scheduled_start_date" label="计划开始时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.scheduled_start_date) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default>
                <el-button type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <!-- 天气信息卡片 -->
      <el-col :xs="24" :lg="8">
        <el-card class="dashboard-card weather-card">
          <template #header>
            <div class="card-header">
              <span>气象信息</span>
              <el-button type="text">查看预报</el-button>
            </div>
          </template>
          
          <div class="weather-content">
            <div class="current-weather">
              <div class="weather-location">
                <el-icon><el-icon-location-information /></el-icon>
                <span>{{weather.location}}</span>
              </div>
              <div class="weather-main">
                <div class="weather-temp">{{weather.temperature}}°C</div>
                <div class="weather-desc">{{weather.description}}</div>
              </div>
              <div class="weather-details">
                <div class="weather-detail-item">
                  <span class="detail-label">湿度</span>
                  <span class="detail-value">{{weather.humidity}}%</span>
                </div>
                <div class="weather-detail-item">
                  <span class="detail-label">风速</span>
                  <span class="detail-value">{{weather.windSpeed}} km/h</span>
                </div>
                <div class="weather-detail-item">
                  <span class="detail-label">降雨</span>
                  <span class="detail-value">{{weather.rainfall}} mm</span>
                </div>
              </div>
            </div>
            
            <div class="weather-forecast">
              <div class="forecast-title">未来三天</div>
              <div class="forecast-list">
                <div 
                  v-for="(day, index) in weather.forecast" 
                  :key="index" 
                  class="forecast-item"
                >
                  <div class="forecast-day">{{day.date}}</div>
                  <div class="forecast-temp">
                    <span class="high-temp">{{day.highTemp}}°</span>
                    <span class="low-temp">{{day.lowTemp}}°</span>
                  </div>
                  <div class="forecast-desc">{{day.description}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { formatDate } from '@/utils/date'

// 时间范围
const timeRange = ref('thisWeek')

// 统计数据
const stats = reactive({
  taskTotal: 58,
  taskTrend: 12,
  pendingTasks: 8,
  pendingTrend: 5,
  completedTasks: 45,
  completedTrend: 18,
  totalFields: 120
})

// 近期任务数据
const recentTasks = ref([
  {
    id: 1,
    task_code: 'MT202301',
    task_name: '2023年第一季度烟田生长监测',
    growing_phase: 'transplanting',
    status: 'completed',
    scheduled_start_date: '2023-04-01T08:30:00Z'
  },
  {
    id: 2,
    task_code: 'MT202302',
    task_name: '2023年第二季度烟田生长监测',
    growing_phase: 'growing',
    status: 'data_collecting',
    scheduled_start_date: '2023-06-02T09:00:00Z'
  },
  {
    id: 3,
    task_code: 'MT202303',
    task_name: '2023年第三季度烟田生长监测',
    growing_phase: 'topping',
    status: 'created',
    scheduled_start_date: '2023-08-15T10:00:00Z'
  }
])

// 生长阶段选项
const growingPhaseOptions = [
  { value: 'transplanting', label: '移栽期', type: 'info' },
  { value: 'growing', label: '旺长期', type: 'success' },
  { value: 'topping', label: '打顶期', type: 'warning' },
  { value: 'harvesting', label: '成熟采收期', type: 'danger' }
]

// 任务状态选项
const taskStatusOptions = [
  { value: 'created', label: '已创建', type: 'info' },
  { value: 'data_collecting', label: '数据采集中', type: 'warning' },
  { value: 'basic_analyzing', label: '基础分析中', type: 'warning' },
  { value: 'llm_analyzing', label: '智能分析中', type: 'warning' },
  { value: 'decision_making', label: '决策制定中', type: 'warning' },
  { value: 'executing', label: '执行中', type: 'primary' },
  { value: 'feedback_collecting', label: '反馈收集中', type: 'primary' },
  { value: 'completed', label: '已完成', type: 'success' },
  { value: 'planning_next', label: '规划下次', type: 'info' }
]

// 天气数据
const weather = reactive({
  location: '云南省玉溪市',
  temperature: 24,
  description: '多云',
  humidity: 65,
  windSpeed: 10,
  rainfall: 0,
  forecast: [
    { date: '明天', highTemp: 26, lowTemp: 18, description: '晴' },
    { date: '后天', highTemp: 27, lowTemp: 19, description: '晴' },
    { date: '大后天', highTemp: 25, lowTemp: 17, description: '小雨' }
  ]
})

onMounted(() => {
  // 加载仪表盘数据
  // 实际项目中这里应调用API获取数据
})
</script>

<style scoped>
.admin-dashboard {
  padding: 16px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 36px;
  color: #409eff;
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

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}

.stat-trend {
  display: flex;
  align-items: center;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.stat-trend.flat {
  color: #909399;
}

.trend-icon {
  margin-right: 4px;
}

.time-period {
  color: #909399;
}

.dashboard-content {
  margin-top: 20px;
}

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-card {
  height: 100%;
}

.weather-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.current-weather {
  margin-bottom: 20px;
}

.weather-location {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #606266;
}

.weather-location .el-icon {
  margin-right: 5px;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.weather-temp {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
}

.weather-desc {
  font-size: 16px;
  color: #606266;
}

.weather-details {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.weather-detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: bold;
}

.weather-forecast {
  flex: 1;
}

.forecast-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  margin-top: 15px;
}

.forecast-list {
  display: flex;
  justify-content: space-between;
}

.forecast-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.forecast-day {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.forecast-temp {
  margin-bottom: 5px;
}

.high-temp {
  font-size: 14px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 5px;
}

.low-temp {
  font-size: 14px;
  color: #409eff;
}

.forecast-desc {
  font-size: 12px;
  color: #606266;
}
</style> 