<template>
  <div class="feedback-review">
    <div class="header">
      <div class="back-button">
        <el-button icon="ArrowLeft" @click="goBack">返回</el-button>
      </div>
      <h2>审核执行反馈</h2>
    </div>

    <div v-loading="loading">
      <el-card v-if="taskDetail" class="task-info-card">
        <template #header>
          <div class="card-header">
            <span>任务信息</span>
            <el-tag :type="getStatusType(taskDetail.status)">
              {{ getStatusLabel(taskDetail.status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions border :column="2">
          <el-descriptions-item label="任务编号">
            {{ taskDetail.task_code }}
          </el-descriptions-item>
          <el-descriptions-item label="任务类型">
            {{ getTaskTypeName(taskDetail.task_type) }}
          </el-descriptions-item>
          <el-descriptions-item label="相关地块">
            {{ getFieldName(taskDetail.field_id) }}
          </el-descriptions-item>
          <el-descriptions-item label="截止日期">
            {{ formatDate(taskDetail.due_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="任务内容" :span="2">
            {{ taskDetail.task_content }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 反馈信息展示 -->
      <el-card v-if="feedbackDetail" class="feedback-card">
        <template #header>
          <div class="card-header">
            <span>反馈信息</span>
            <el-tag :type="getFeedbackStatusType(feedbackDetail.review_status)">
              {{ getFeedbackStatusLabel(feedbackDetail.review_status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions border :column="2">
          <el-descriptions-item label="完成时间">
            {{ formatDate(feedbackDetail.completion_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="提交人">
            {{ getUserName(feedbackDetail.submitted_by) }}
          </el-descriptions-item>
          <el-descriptions-item label="有效性评价">
            <el-rate 
              v-model="feedbackDetail.effectiveness_rating" 
              disabled 
              show-score 
              text-color="#ff9900"
            />
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ formatDate(feedbackDetail.submitted_at) }}
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

        <!-- 审核表单 -->
        <div class="review-form">
          <h3>审核意见</h3>
          <el-form 
            ref="reviewFormRef" 
            :model="reviewForm" 
            :rules="reviewRules" 
            label-width="120px"
          >
            <el-form-item label="审核结果" prop="review_status">
              <el-radio-group v-model="reviewForm.review_status">
                <el-radio :label="FEEDBACK_REVIEW_STATUS.APPROVED">通过</el-radio>
                <el-radio :label="FEEDBACK_REVIEW_STATUS.REJECTED">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="review_comments">
              <el-input
                v-model="reviewForm.review_comments"
                type="textarea"
                :rows="3"
                placeholder="请输入审核意见"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitReview">提交审核</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-empty v-if="!feedbackDetail && !loading" description="未找到相关反馈信息" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { 
  fetchExecutionTaskDetail, 
  fetchExecutionFeedback, 
  reviewFeedback 
} from '@/api/execution'
import { 
  EXECUTION_STATUS, 
  EXECUTION_TYPES, 
  FEEDBACK_REVIEW_STATUS 
} from '@/mock/execution'
import type { 
  ExecutionTask, 
  ExecutionFeedback, 
  ExecutionTaskStatus, 
  FeedbackReviewStatus,
  FeedbackReviewData
} from '@/types/execution'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const taskDetail = ref<ExecutionTask | null>(null)
const feedbackDetail = ref<ExecutionFeedback | null>(null)
const reviewFormRef = ref<FormInstance | null>(null)

// 审核表单
const reviewForm = reactive<FeedbackReviewData>({
  review_status: FEEDBACK_REVIEW_STATUS.APPROVED as FeedbackReviewStatus,
  review_comments: '',
  reviewer_id: Number(userStore.user?.id) || 0
})

// 表单验证规则
const reviewRules = {
  review_status: [
    { required: true, message: '请选择审核结果', trigger: 'change' }
  ],
  review_comments: [
    { required: true, message: '请填写审核意见', trigger: 'blur' },
    { min: 5, max: 500, message: '长度应在5到500个字符之间', trigger: 'blur' }
  ]
}

// 状态和反馈状态选项
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

const statusTypes = {
  [EXECUTION_STATUS.CREATED]: 'info',
  [EXECUTION_STATUS.ASSIGNED]: 'info',
  [EXECUTION_STATUS.NOTIFIED]: 'warning',
  [EXECUTION_STATUS.IN_PROGRESS]: 'warning',
  [EXECUTION_STATUS.FEEDBACK_SUBMITTED]: 'success',
  [EXECUTION_STATUS.FEEDBACK_VALIDATED]: 'success',
  [EXECUTION_STATUS.VERIFIED]: 'success',
  [EXECUTION_STATUS.COMPLETED]: 'success'
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
  return statusTypes[status] || 'info'
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

// 模拟获取用户名称
const getUserName = (userId: number) => {
  const userMap: Record<number, string> = {
    1: '管理员',
    2: '烟技员张三',
    3: '烟农李四',
    4: '烟农王五',
    5: '烟农赵六'
  }
  return userMap[userId] || `用户 ${userId}`
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

// 获取任务和反馈详情
const fetchTaskDetail = async () => {
  const taskId = route.params.id as string
  if (!taskId) return
  
  loading.value = true
  try {
    const res = await fetchExecutionTaskDetail(taskId)
    if (res.success && res.data) {
      taskDetail.value = res.data
      fetchFeedback(taskId)
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
const fetchFeedback = async (taskId: string | number) => {
  try {
    const res = await fetchExecutionFeedback(taskId)
    if (res.success && res.data) {
      feedbackDetail.value = res.data
      
      // 如果已经审核过，初始化表单
      if (res.data.review_status !== FEEDBACK_REVIEW_STATUS.PENDING) {
        reviewForm.review_status = res.data.review_status as FeedbackReviewStatus
        reviewForm.review_comments = res.data.review_comments
      }
    } else if (res.success) {
      ElMessage.warning('未找到相关反馈信息')
    } else {
      ElMessage.error(res.message || '获取反馈详情失败')
    }
  } catch (error) {
    console.error('获取反馈详情出错:', error)
    ElMessage.error('获取反馈详情出错')
  }
}

// 提交审核
const submitReview = async () => {
  if (!reviewFormRef.value || !feedbackDetail.value) return
  
  await reviewFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (!feedbackDetail.value) {
          ElMessage.error('没有反馈信息可供审核')
          loading.value = false
          return
        }
        
        const res = await reviewFeedback(feedbackDetail.value.id, reviewForm)
        if (res.success) {
          ElMessage.success('审核提交成功')
          // 返回到任务详情页
          router.push(`/execution/tasks/${route.params.id}`)
        } else {
          ElMessage.error(res.message || '审核提交失败')
        }
      } catch (error) {
        console.error('审核提交出错:', error)
        ElMessage.error('审核提交出错')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请完善审核信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (reviewFormRef.value) {
    reviewFormRef.value.resetFields()
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
.feedback-review {
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

.task-info-card {
  margin-bottom: 20px;
}

.feedback-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-media {
  margin: 20px 0;
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

.review-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}
</style> 