<template>
  <div class="farming-calendar">
    <div class="page-header">
      <h2>农事日历</h2>
      <div class="actions">
        <el-select v-model="calendarView" placeholder="日历视图" style="width: 120px; margin-right: 10px;">
          <el-option label="月视图" value="month"></el-option>
          <el-option label="周视图" value="week"></el-option>
          <el-option label="日视图" value="day"></el-option>
        </el-select>
        
        <el-select v-model="selectedField" placeholder="选择地块" style="width: 200px; margin-right: 10px;" clearable>
          <el-option 
            v-for="field in fields" 
            :key="field.id" 
            :label="field.field_name" 
            :value="field.id">
          </el-option>
        </el-select>
        
        <el-button type="primary" @click="addNewRecord">
          <el-icon><Plus /></el-icon>添加农事记录
        </el-button>
      </div>
    </div>
    
    <el-card v-loading="loading" class="calendar-container">
      <div class="toolbar">
        <el-button-group>
          <el-button @click="prev">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button @click="today">今天</el-button>
          <el-button @click="next">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-button-group>
        <span class="current-date">{{ formatDateRange }}</span>
      </div>
      
      <div id="calendar" ref="calendarRef"></div>
    </el-card>
    
    <!-- 点击日历事件弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle" 
      width="600px"
      destroy-on-close>
      <div v-if="selectedEvent">
        <h4>操作类型：{{ getOperationTypeName(selectedEvent.operation_type) }}</h4>
        <p><strong>日期：</strong> {{ formatDate(selectedEvent.start) }}</p>
        <p><strong>地块：</strong> {{ getFieldName(selectedEvent.field_id) }}</p>
        <p><strong>详情：</strong> {{ selectedEvent.details }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="viewDetails">查看详情</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import { ArrowLeft, ArrowRight, Plus } from '@element-plus/icons-vue'
import { getFarmingCalendarEvents } from '@/api/farming'
import { getAllFields } from '@/api/field'
import { farmingOperationTypes } from '@/mock/farming'

// 定义状态变量
const router = useRouter()
const calendarRef = ref<HTMLElement | null>(null)
const calendar = ref<Calendar | null>(null)
const calendarView = ref('month')
const selectedField = ref('')
const loading = ref(false)
const fields = ref<any[]>([])
const dialogVisible = ref(false)
const selectedEvent = ref<any>(null)
const dialogTitle = ref('农事操作详情')

// 日历显示的日期范围
const currentViewStart = ref(new Date())
const currentViewEnd = ref(new Date())

// 格式化当前显示的日期范围
const formatDateRange = computed(() => {
  const start = currentViewStart.value
  const end = currentViewEnd.value
  
  if (calendarView.value === 'month') {
    return `${start.getFullYear()}年${start.getMonth() + 1}月`
  } else if (calendarView.value === 'week') {
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  } else {
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`
  }
})

// 获取操作类型名称
const getOperationTypeName = (typeCode: string): string => {
  const type = farmingOperationTypes.find(t => t.type_code === typeCode)
  return type ? type.type_name : typeCode
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

// 加载农事日历数据
const loadCalendarEvents = async () => {
  try {
    loading.value = true
    
    const params: any = {
      start_date: calendar.value?.view.activeStart.toISOString(),
      end_date: calendar.value?.view.activeEnd.toISOString()
    }
    
    if (selectedField.value) {
      params.field_id = selectedField.value
    }
    
    const res = await getFarmingCalendarEvents(params)
    
    if (res.code === 200) {
      // 更新日历事件
      calendar.value?.removeAllEvents()
      // 映射id为字符串类型以符合FullCalendar的要求
      const events = res.data.map(event => ({
        ...event,
        id: String(event.id) // 将数字ID转换为字符串
      }))
      calendar.value?.addEventSource(events)
      
      // 更新当前视图的日期范围
      if (calendar.value) {
        currentViewStart.value = calendar.value.view.activeStart
        currentViewEnd.value = calendar.value.view.activeEnd
      }
    } else {
      ElMessage.error('获取农事日历数据失败')
    }
  } catch (error) {
    console.error('加载农事日历数据出错', error)
    ElMessage.error('加载农事日历数据出错')
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

// 点击日历事件
const handleEventClick = (info: any) => {
  selectedEvent.value = info.event.extendedProps
  selectedEvent.value.start = info.event.startStr
  selectedEvent.value.title = info.event.title
  
  dialogTitle.value = `农事操作: ${info.event.title}`
  dialogVisible.value = true
}

// 查看详情
const viewDetails = () => {
  if (selectedEvent.value && selectedEvent.value.id) {
    router.push(`/farming/records/${selectedEvent.value.id}`)
  }
}

// 添加新记录
const addNewRecord = () => {
  router.push('/farming/records/create')
}

// 上一个时间段
const prev = () => {
  calendar.value?.prev()
  loadCalendarEvents()
}

// 今天
const today = () => {
  calendar.value?.today()
  loadCalendarEvents()
}

// 下一个时间段
const next = () => {
  calendar.value?.next()
  loadCalendarEvents()
}

// 监听日历视图变化
watch(calendarView, (newValue) => {
  if (calendar.value) {
    calendar.value.changeView(
      newValue === 'month' ? 'dayGridMonth' : 
      newValue === 'week' ? 'timeGridWeek' : 'timeGridDay'
    )
    loadCalendarEvents()
  }
})

// 监听选择的地块变化
watch(selectedField, () => {
  loadCalendarEvents()
})

// 组件挂载后初始化日历
onMounted(async () => {
  // 加载地块列表
  await loadFields()
  
  // 初始化日历
  if (calendarRef.value) {
    calendar.value = new Calendar(calendarRef.value, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: false, // 使用自定义工具栏
      locale: zhCnLocale,
      dayMaxEvents: true,
      eventClick: handleEventClick,
      height: 'auto',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    })
    
    calendar.value.render()
    
    // 初始化完成后加载数据
    loadCalendarEvents()
  }
})
</script>

<style scoped>
.farming-calendar {
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
  align-items: center;
}

.calendar-container {
  margin-bottom: 20px;
  min-height: 600px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.current-date {
  font-size: 16px;
  margin-left: 15px;
  font-weight: bold;
}

#calendar {
  height: 100%;
}

:deep(.fc-event-time) {
  font-weight: bold;
}

:deep(.fc-event-title) {
  font-weight: normal;
}

:deep(.fc-daygrid-event) {
  cursor: pointer;
}
</style> 