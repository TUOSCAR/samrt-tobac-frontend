<template>
  <div class="task-calendar">
    <div class="calendar-header">
      <div class="left-section">
        <el-page-header @back="goBack" title="任务日历"></el-page-header>
      </div>
      <div class="right-section">
        <el-radio-group v-model="calendarView" size="small">
          <el-radio-button label="month">月视图</el-radio-button>
          <el-radio-button label="week">周视图</el-radio-button>
          <el-radio-button label="day">日视图</el-radio-button>
        </el-radio-group>
        <el-button-group style="margin-left: 16px;">
          <el-button size="small" @click="handlePrev">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button size="small" @click="gotoToday">今天</el-button>
          <el-button size="small" @click="handleNext">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
        <el-date-picker
          v-model="selectedDate"
          :type="datePickerType"
          size="small"
          format="YYYY年M月D日"
          style="margin-left: 16px; width: 150px;"
          @change="handleDateChange"
        />
      </div>
    </div>

    <el-card v-loading="loading" class="calendar-container">
      <full-calendar
        ref="calendarRef"
        :options="calendarOptions"
        class="task-full-calendar"
      />
    </el-card>

    <!-- 任务详情弹窗 -->
    <el-dialog
      v-model="eventDialogVisible"
      :title="currentEvent?.title || '任务详情'"
      width="600px"
      top="5vh"
      :close-on-click-modal="false"
    >
      <template v-if="currentEvent">
        <el-descriptions border :column="1" class="task-descriptions">
          <el-descriptions-item label="任务编号">{{ currentEvent.extendedProps.code }}</el-descriptions-item>
          <el-descriptions-item label="任务名称">{{ currentEvent.title }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">{{ getTaskTypeName(currentEvent.extendedProps.type) }}</el-descriptions-item>
          <el-descriptions-item label="生长阶段">
            <el-tag :type="getGrowingPhaseType(currentEvent.extendedProps.growingPhase)">
              {{ getGrowingPhaseLabel(currentEvent.extendedProps.growingPhase) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentEvent.extendedProps.status)">
              {{ getStatusLabel(currentEvent.extendedProps.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(currentEvent.extendedProps.priority)">
              {{ getPriorityLabel(currentEvent.extendedProps.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计划时间">
            {{ formatDate(currentEvent.start) }} 至 {{ formatDate(currentEvent.end) }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述">
            {{ currentEvent.extendedProps.description || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="相关地块">
            <div v-if="currentEvent.extendedProps.fields && currentEvent.extendedProps.fields.length > 0">
              <el-tag 
                v-for="field in currentEvent.extendedProps.fields" 
                :key="field.id"
                style="margin-right: 5px; margin-bottom: 5px;"
              >
                {{ field.name }}
              </el-tag>
            </div>
            <span v-else>无关联地块</span>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="eventDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="viewTaskDetail">
            查看详情
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import FullCalendar from '@fullcalendar/vue3'
import { getTaskCalendar, getTaskTypes } from '@/api/task'
import { TaskStatus, GrowingPhase, TaskPriority } from '@/types/task'
import dayjs from 'dayjs'

// 路由
const router = useRouter()

// 任务类型列表
const taskTypes = ref<any[]>([])

// 日历视图类型
const calendarView = ref('month')
const selectedDate = ref(new Date())

// 日历引用
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

// 加载状态
const loading = ref(false)

// 当前事件
const currentEvent = ref<any>(null)
const eventDialogVisible = ref(false)

// 根据当前视图获取日期选择器类型
const datePickerType = computed(() => {
  switch (calendarView.value) {
    case 'day':
      return 'date'
    case 'week':
      return 'week'
    case 'month':
    default:
      return 'month'
  }
})

// 日历配置
const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: false,
  locale: zhCnLocale,
  firstDay: 0, // 星期日开始一周
  height: 'auto',
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  events: [] as any[],
  eventClick: (info: any) => {
    currentEvent.value = info.event
    eventDialogVisible.value = true
  },
  editable: false, // 目前不支持拖拽编辑
  selectable: false,
  dayMaxEvents: true, // 当一天的事件过多时显示+更多
  eventClassNames: (arg: any) => {
    const status = arg.event.extendedProps.status
    const priority = arg.event.extendedProps.priority
    const classes = ['task-event']
    
    // 根据任务状态添加样式
    if (status) {
      classes.push(`status-${status}`)
    }
    
    // 根据优先级添加样式
    if (priority) {
      classes.push(`priority-${priority}`)
    }
    
    return classes
  }
})

// 获取任务类型名称
const getTaskTypeName = (typeCode: string) => {
  const type = taskTypes.value.find(item => item.code === typeCode)
  return type ? type.name : typeCode
}

// 获取生长阶段类型
const getGrowingPhaseType = (phase: string) => {
  const typeMap: Record<string, string> = {
    [GrowingPhase.TRANSPLANTING]: 'success',
    [GrowingPhase.GROWING]: 'primary',
    [GrowingPhase.TOPPING]: 'warning',
    [GrowingPhase.HARVESTING]: 'danger'
  }
  return typeMap[phase] || 'info'
}

// 获取生长阶段标签
const getGrowingPhaseLabel = (phase: string) => {
  const labelMap: Record<string, string> = {
    [GrowingPhase.TRANSPLANTING]: '移栽期',
    [GrowingPhase.GROWING]: '旺长期',
    [GrowingPhase.TOPPING]: '打顶期',
    [GrowingPhase.HARVESTING]: '成熟采收期'
  }
  return labelMap[phase] || phase
}

// 获取状态类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    [TaskStatus.CREATED]: 'info',
    [TaskStatus.DATA_COLLECTING]: 'warning',
    [TaskStatus.DATA_VALIDATING]: 'warning',
    [TaskStatus.BASIC_ANALYZING]: 'primary',
    [TaskStatus.LLM_ANALYZING]: 'primary',
    [TaskStatus.DECISION_MAKING]: 'primary',
    [TaskStatus.EXECUTING]: 'success',
    [TaskStatus.FEEDBACK_COLLECTING]: 'success',
    [TaskStatus.COMPLETED]: 'success',
    [TaskStatus.PLANNING_NEXT]: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    [TaskStatus.CREATED]: '已创建',
    [TaskStatus.DATA_COLLECTING]: '数据采集中',
    [TaskStatus.DATA_VALIDATING]: '数据验证中',
    [TaskStatus.BASIC_ANALYZING]: '基础分析中',
    [TaskStatus.LLM_ANALYZING]: '智能分析中',
    [TaskStatus.DECISION_MAKING]: '决策制定中',
    [TaskStatus.EXECUTING]: '执行中',
    [TaskStatus.FEEDBACK_COLLECTING]: '反馈收集中',
    [TaskStatus.COMPLETED]: '已完成',
    [TaskStatus.PLANNING_NEXT]: '规划下次监测'
  }
  return statusMap[status] || status
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap: Record<string, string> = {
    [TaskPriority.HIGH]: 'danger',
    [TaskPriority.MEDIUM]: 'warning',
    [TaskPriority.LOW]: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labelMap: Record<string, string> = {
    [TaskPriority.HIGH]: '高',
    [TaskPriority.MEDIUM]: '中',
    [TaskPriority.LOW]: '低'
  }
  return labelMap[priority] || priority
}

// 格式化日期
const formatDate = (date: Date | null | undefined) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

// 切换日历视图
const changeCalendarView = () => {
  if (!calendarRef.value) return

  switch (calendarView.value) {
    case 'day':
      calendarRef.value.getApi().changeView('timeGridDay')
      break
    case 'week':
      calendarRef.value.getApi().changeView('timeGridWeek')
      break
    case 'month':
    default:
      calendarRef.value.getApi().changeView('dayGridMonth')
      break
  }
}

// 返回上一页
const goBack = () => {
  router.push('/tasks')
}

// 切换到上一个时间段
const handlePrev = () => {
  if (!calendarRef.value) return
  calendarRef.value.getApi().prev()
  updateSelectedDate()
}

// 切换到下一个时间段
const handleNext = () => {
  if (!calendarRef.value) return
  calendarRef.value.getApi().next()
  updateSelectedDate()
}

// 跳转到今天
const gotoToday = () => {
  if (!calendarRef.value) return
  calendarRef.value.getApi().today()
  updateSelectedDate()
}

// 日期变更处理
const handleDateChange = () => {
  if (!calendarRef.value || !selectedDate.value) return
  calendarRef.value.getApi().gotoDate(selectedDate.value)
}

// 更新选中日期
const updateSelectedDate = () => {
  if (!calendarRef.value) return
  selectedDate.value = calendarRef.value.getApi().getDate()
}

// 转到任务详情页
const viewTaskDetail = () => {
  if (!currentEvent.value) return
  const taskId = currentEvent.value.extendedProps.id
  router.push(`/tasks/${taskId}`)
}

// 获取任务日历数据
const fetchCalendarEvents = async () => {
  if (!calendarRef.value) return
  
  loading.value = true
  
  try {
    const calendarApi = calendarRef.value.getApi()
    const viewRange = {
      start: formatDate(calendarApi.view.activeStart),
      end: formatDate(calendarApi.view.activeEnd)
    }
    
    // 获取日历范围内的任务数据
    const res = await getTaskCalendar(viewRange)
    const tasks = res.data || res
    
    // 转换为日历事件格式
    const events = tasks.map((task: any) => ({
      id: task.id,
      title: task.name,
      start: task.scheduledStartDate,
      end: task.scheduledEndDate ? new Date(task.scheduledEndDate + 'T23:59:59') : undefined, // 结束日期默认为当天结束
      allDay: true,
      backgroundColor: getEventColor(task.status, task.priority),
      borderColor: getEventBorderColor(task.status),
      textColor: '#ffffff',
      extendedProps: {
        id: task.id,
        code: task.code,
        type: task.type,
        growingPhase: task.growingPhase,
        status: task.status,
        priority: task.priority,
        description: task.description,
        fields: task.fields
      }
    }))
    
    // 更新日历事件
    calendarOptions.events = events
  } catch (error) {
    console.error('获取任务日历数据失败:', error)
    ElMessage.error('获取任务日历数据失败')
  } finally {
    loading.value = false
  }
}

// 获取事件颜色
const getEventColor = (status: string, priority: string) => {
  // 状态优先级高于任务优先级
  if (status === TaskStatus.COMPLETED) {
    return '#909399' // 灰色，已完成
  }
  
  if (status === TaskStatus.CREATED) {
    return '#909399' // 灰色，未开始
  }
  
  // 进行中的任务，根据优先级着色
  switch (priority) {
    case TaskPriority.HIGH:
      return '#F56C6C' // 红色，高优先级
    case TaskPriority.MEDIUM:
      return '#E6A23C' // 橙色，中优先级
    case TaskPriority.LOW:
      return '#67C23A' // 绿色，低优先级
    default:
      return '#409EFF' // 蓝色，默认
  }
}

// 获取事件边框颜色
const getEventBorderColor = (status: string) => {
  if (status === TaskStatus.COMPLETED) {
    return '#606266'
  }
  
  if (status === TaskStatus.CREATED) {
    return '#606266'
  }
  
  return '#409EFF'
}

// 加载任务类型列表
const loadTaskTypes = async () => {
  try {
    const res = await getTaskTypes()
    taskTypes.value = res.data || res
  } catch (error) {
    console.error('获取任务类型失败:', error)
  }
}

// 监听视图变化
watch(calendarView, () => {
  changeCalendarView()
  fetchCalendarEvents()
})

// 生命周期钩子
onMounted(async () => {
  await loadTaskTypes()
  
  // 设置初始视图
  changeCalendarView()
  
  // 加载任务数据
  fetchCalendarEvents()
})
</script>

<style>
.task-calendar {
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-container {
  min-height: 600px;
}

.task-full-calendar {
  height: 100%;
}

/* 任务事件样式 */
.task-event {
  border-radius: 4px;
  cursor: pointer;
}

/* 根据状态设置样式 */
.task-event.status-completed {
  opacity: 0.7;
}

.task-event.status-created {
  border-style: dashed !important;
}

/* 根据优先级设置样式 */
.task-event.priority-high {
  border-left: 4px solid #F56C6C !important;
}

.task-event.priority-medium {
  border-left: 4px solid #E6A23C !important;
}

.task-event.priority-low {
  border-left: 4px solid #67C23A !important;
}

.task-descriptions {
  margin-top: 10px;
}

/* FullCalendar 自定义样式 */
.fc-daygrid-event {
  white-space: normal !important;
}

.fc-event-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fc-toolbar-title {
  font-size: 1.2rem !important;
}

.fc-col-header-cell {
  background-color: #f5f7fa;
}

.fc .fc-daygrid-day.fc-day-today {
  background-color: rgba(64, 158, 255, 0.1);
}
</style> 