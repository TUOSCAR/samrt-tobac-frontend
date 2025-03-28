<template>
  <div class="execution-task-detail">
    <div class="header">
      <div class="back-button">
        <el-button icon="ArrowLeft" @click="goBack">返回</el-button>
      </div>
      <h2>执行任务详情</h2>
    </div>

    <div v-loading="loading">
      <el-card v-if="taskDetail" class="detail-card">
        <template #header>
          <div class="card-header">
            <span>{{ taskDetail.task_code }}</span>
            <el-tag :type="getStatusType(taskDetail.status)">
              {{ getStatusLabel(taskDetail.status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions border :column="2">
          <el-descriptions-item label="任务类型">
            {{ getTaskTypeName(taskDetail.task_type) }}
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(taskDetail.priority)">
              {{ getPriorityLabel(taskDetail.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="相关地块">
            {{ getFieldName(taskDetail.field_id) }}
          </el-descriptions-item>
          <el-descriptions-item label="截止日期">
            {{ formatDate(taskDetail.due_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="分配时间">
            {{ formatDate(taskDetail.assigned_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="完成进度">
            <el-progress :percentage="taskDetail.completion_percentage" />
          </el-descriptions-item>
          <el-descriptions-item label="任务内容" :span="2">
            {{ taskDetail.task_content }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="action-buttons">
          <el-button 
            v-if="canSubmitFeedback(taskDetail.status)" 
            type="primary" 
            @click="submitFeedback"
          >
            提交反馈
          </el-button>
          <el-button 
            v-if="canReviewFeedback(taskDetail.status)" 
            type="success" 
            @click="reviewFeedback"
          >
            审核反馈
          </el-button>
          <el-button 
            v-if="taskDetail.status !== 'completed'" 
            type="warning" 
            @click="updateStatus"
          >
            更新状态
          </el-button>
        </div>
      </el-card>

      <!-- 执行反馈部分 -->
      <el-card v-if="feedbackDetail" class="feedback-card">
        <template #header>
          <div class="card-header">
            <span>执行反馈信息</span>
            <el-tag :type="getFeedbackStatusType(feedbackDetail.review_status)">
              {{ getFeedbackStatusLabel(feedbackDetail.review_status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions border :column="2">
          <el-descriptions-item label="完成时间">
            {{ formatDate(feedbackDetail.completion_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="有效性评价">
            <el-rate 
              v-model="feedbackDetail.effectiveness_rating" 
              disabled 
              show-score 
              text-color="#ff9900"
            />
          </el-descriptions-item>
          <el-descriptions-item label="实际操作" :span="2">
            {{ feedbackDetail.actual_operation }}
          </el-descriptions-item>
          <el-descriptions-item label="执行反馈内容" :span="2">
            {{ feedbackDetail.feedback_content }}
          </el-descriptions-item>
          <el-descriptions-item label="遇到的困难" :span="2">
            {{ feedbackDetail.difficulties_encountered || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="审核意见" :span="2" v-if="feedbackDetail.review_comments">
            {{ feedbackDetail.review_comments }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 图片展示 -->
        <div v-if="feedbackDetail.media_urls && feedbackDetail.media_urls.length > 0" class="feedback-media">
          <h3>反馈图片/视频</h3>
          <el-image
            v-for="(url, index) in feedbackImagesOnly"
            :key="index"
            :src="url"
            fit="cover"
            :preview-src-list="feedbackImagesOnly"
            class="feedback-image"
          />
          <div v-for="(url, index) in feedbackVideosOnly" :key="`video-${index}`" class="feedback-video">
            <video controls :src="url" width="100%"></video>
          </div>
        </div>
      </el-card>

      <!-- 状态更新对话框 -->
      <el-dialog
        v-model="statusDialogVisible"
        title="更新任务状态"
        width="500px"
      >
        <el-form :model="statusForm" label-width="120px">
          <el-form-item label="任务状态">
            <el-select v-model="statusForm.status">
              <el-option
                v-for="(value, key) in statusOptions"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="完成百分比">
            <el-slider
              v-model="statusForm.completion_percentage"
              :min="0"
              :max="100"
              :step="5"
              show-input
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUpdateStatus">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchExecutionTaskDetail, fetchExecutionFeedback, updateTaskStatus } from '@/api/execution'
import { EXECUTION_STATUS, PRIORITY, EXECUTION_TYPES, FEEDBACK_REVIEW_STATUS } from '@/mock/execution'
import type { ExecutionTask, ExecutionFeedback, ExecutionTaskStatus, Priority } from '@/types/execution'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const taskDetail = ref<ExecutionTask | null>(null)
const feedbackDetail = ref<ExecutionFeedback | null>(null)
const statusDialogVisible = ref(false)

// 状态更新表单
const statusForm = reactive({
  status: '' as ExecutionTaskStatus,
  completion_percentage: 0
})

// 状态和优先级选项
const statusOptions = {
  [EXECUTION_STATUS.CREATED]: '已创建',
  [EXECUTION_STATUS.ASSIGNED]: '已分配',
  [EXECUTION_STATUS.NOTIFIED]: '已通知',
  [EXECUTION_STATUS.IN_PROGRESS]: '进行中',
  [EXECUTION_STATUS.FEEDBACK_SUBMITTED]: '已提交反馈',
  [EXECUTION_STATUS.FEEDBACK_VALIDATED]: '反馈已审核',
  [EXECUTION_STATUS.VERIFIED]: '已验证',
  [EXECUTION_STATUS.COMPLETED]: '已完成'
}

const priorityOptions = {
  [PRIORITY.HIGH]: '高',
  [PRIORITY.MEDIUM]: '中',
  [PRIORITY.LOW]: '低'
}

const taskTypeOptions = {
  [EXECUTION_TYPES.FERTILIZATION]: '施肥',
  [EXECUTION_TYPES.PEST_CONTROL]: '病虫害防治',
  [EXECUTION_TYPES.IRRIGATION]: '灌溉',
  [EXECUTION_TYPES.TOPPING]: '打顶',
  [EXECUTION_TYPES.WEEDING]: '除草',
  [EXECUTION_TYPES.HARVESTING]: '采收'
}

const feedbackStatusOptions = {
  [FEEDBACK_REVIEW_STATUS.PENDING]: '待审核',
  [FEEDBACK_REVIEW_STATUS.APPROVED]: '已通过',
  [FEEDBACK_REVIEW_STATUS.REJECTED]: '已拒绝'
}

// 获取状态标签
const getStatusLabel = (status: ExecutionTaskStatus) => {
  return statusOptions[status] || status
}

// 获取状态类型
const getStatusType = (status: ExecutionTaskStatus) => {
  const typeMap = {
    [EXECUTION_STATUS.CREATED]: 'info',
    [EXECUTION_STATUS.ASSIGNED]: 'info',
    [EXECUTION_STATUS.NOTIFIED]: 'warning',
    [EXECUTION_STATUS.IN_PROGRESS]: 'warning',
    [EXECUTION_STATUS.FEEDBACK_SUBMITTED]: 'success',
    [EXECUTION_STATUS.FEEDBACK_VALIDATED]: 'success',
    [EXECUTION_STATUS.VERIFIED]: 'success',
    [EXECUTION_STATUS.COMPLETED]: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority: Priority) => {
  return priorityOptions[priority] || priority
}

// 获取优先级类型
const getPriorityType = (priority: Priority) => {
  const typeMap = {
    [PRIORITY.HIGH]: 'danger',
    [PRIORITY.MEDIUM]: 'warning',
    [PRIORITY.LOW]: 'info'
  }
  return typeMap[priority] || 'info'
}

// 获取任务类型名称
const getTaskTypeName = (type: string) => {
  return taskTypeOptions[type] || type
}

// 获取反馈状态标签
const getFeedbackStatusLabel = (status: string) => {
  return feedbackStatusOptions[status] || status
}

// 获取反馈状态类型
const getFeedbackStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    [FEEDBACK_REVIEW_STATUS.PENDING]: 'warning',
    [FEEDBACK_REVIEW_STATUS.APPROVED]: 'success',
    [FEEDBACK_REVIEW_STATUS.REJECTED]: 'danger'
  }
  return typeMap[status] || 'info'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 模拟获取地块名称
const getFieldName = (fieldId: number) => {
  const fieldMap: Record<number, string> = {
    1: '东山1号烟田',
    2: '西峰2号烟田',
    3: '北畈3号烟田'
  }
  return fieldMap[fieldId] || `地块 ${fieldId}`
}

// 只显示图片
const feedbackImagesOnly = computed(() => {
  if (!feedbackDetail.value || !feedbackDetail.value.media_urls) return []
  return feedbackDetail.value.media_urls.filter(url => 
    url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')
  )
})

// 只显示视频
const feedbackVideosOnly = computed(() => {
  if (!feedbackDetail.value || !feedbackDetail.value.media_urls) return []
  return feedbackDetail.value.media_urls.filter(url => 
    url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
  )
})

// 是否可以提交反馈
const canSubmitFeedback = (status: ExecutionTaskStatus) => {
  return [
    EXECUTION_STATUS.ASSIGNED,
    EXECUTION_STATUS.NOTIFIED,
    EXECUTION_STATUS.IN_PROGRESS
  ].includes(status)
}

// 是否可以审核反馈
const canReviewFeedback = (status: ExecutionTaskStatus) => {
  return status === EXECUTION_STATUS.FEEDBACK_SUBMITTED
}

// 获取任务详情
const fetchTaskDetail = async () => {
  const taskId = route.params.id as string
  if (!taskId) return
  
  loading.value = true
  try {
    const res = await fetchExecutionTaskDetail(taskId)
    if (res.success && res.data) {
      taskDetail.value = res.data
      // 初始化状态表单
      statusForm.status = res.data.status
      statusForm.completion_percentage = res.data.completion_percentage
      // 获取反馈详情
      fetchFeedback()
    } else {
      ElMessage.error(res.message || '获取任务详情失败')
    }
  } catch (error) {
    console.error('获取任务详情出错:', error)
    ElMessage.error('获取任务详情出错')
  } finally {
    loading.value = false
  }
}

// 获取反馈详情
const fetchFeedback = async () => {
  const taskId = route.params.id as string
  if (!taskId) return
  
  try {
    const res = await fetchExecutionFeedback(taskId)
    if (res.success) {
      feedbackDetail.value = res.data
    }
  } catch (error) {
    console.error('获取反馈详情出错:', error)
  }
}

// 提交反馈
const submitFeedback = () => {
  router.push(`/execution/tasks/${route.params.id}/feedback`)
}

// 审核反馈
const reviewFeedback = () => {
  router.push(`/execution/tasks/${route.params.id}/review`)
}

// 更新状态
const updateStatus = () => {
  if (taskDetail.value) {
    statusForm.status = taskDetail.value.status
    statusForm.completion_percentage = taskDetail.value.completion_percentage
  }
  statusDialogVisible.value = true
}

// 确认更新状态
const confirmUpdateStatus = async () => {
  const taskId = route.params.id as string
  if (!taskId) return
  
  try {
    const res = await updateTaskStatus(taskId, {
      status: statusForm.status,
      completion_percentage: statusForm.completion_percentage
    })
    
    if (res.success) {
      ElMessage.success('更新任务状态成功')
      statusDialogVisible.value = false
      fetchTaskDetail() // 刷新任务详情
    } else {
      ElMessage.error(res.message || '更新任务状态失败')
    }
  } catch (error) {
    console.error('更新任务状态出错:', error)
    ElMessage.error('更新任务状态出错')
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchTaskDetail()
})
</script>

<style scoped>
.execution-task-detail {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 16px;
}

.header h2 {
  margin: 0;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.feedback-card {
  margin-top: 20px;
}

.feedback-media {
  margin-top: 20px;
}

.feedback-image {
  width: 150px;
  height: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  object-fit: cover;
}

.feedback-video {
  margin-top: 10px;
  max-width: 500px;
}
</style> 