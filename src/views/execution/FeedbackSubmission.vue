<template>
  <div class="feedback-submission">
    <div class="header">
      <div class="back-button">
        <el-button icon="ArrowLeft" @click="goBack">返回</el-button>
      </div>
      <h2>提交执行反馈</h2>
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

      <el-card class="feedback-form-card">
        <template #header>
          <div class="card-header">
            <span>反馈信息</span>
          </div>
        </template>

        <el-form 
          ref="feedbackFormRef"
          :model="feedbackForm"
          :rules="feedbackRules"
          label-width="120px"
        >
          <el-form-item label="完成时间" prop="completion_date">
            <el-date-picker
              v-model="feedbackForm.completion_date"
              type="datetime"
              placeholder="选择完成日期时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DDTHH:mm:00Z"
            />
          </el-form-item>

          <el-form-item label="实际操作" prop="actual_operation">
            <el-input
              v-model="feedbackForm.actual_operation"
              type="textarea"
              :rows="3"
              placeholder="请描述您实际执行的操作"
            />
          </el-form-item>

          <el-form-item label="反馈内容" prop="feedback_content">
            <el-input
              v-model="feedbackForm.feedback_content"
              type="textarea"
              :rows="4"
              placeholder="请详细描述执行情况和结果"
            />
          </el-form-item>

          <el-form-item label="有效性评价" prop="effectiveness_rating">
            <el-rate
              v-model="feedbackForm.effectiveness_rating"
              :texts="['很差', '较差', '一般', '良好', '优秀']"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              show-text
              show-score
            />
          </el-form-item>

          <el-form-item label="遇到的困难" prop="difficulties_encountered">
            <el-input
              v-model="feedbackForm.difficulties_encountered"
              type="textarea"
              :rows="3"
              placeholder="请描述执行过程中遇到的困难(可选)"
            />
          </el-form-item>

          <el-form-item label="上传图片/视频" prop="media_urls">
            <el-upload
              :file-list="fileList"
              list-type="picture-card"
              :auto-upload="false"
              :limit="5"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
            >
              <template #default>
                <el-icon><Plus /></el-icon>
              </template>
              <template #file="{ file }">
                <img
                  v-if="file.raw && file.raw.type.includes('image')"
                  :src="file.url"
                  class="el-upload-list__item-thumbnail"
                />
                <video
                  v-else-if="file.raw && file.raw.type.includes('video')"
                  :src="file.url"
                  class="el-upload-list__item-thumbnail"
                  controls
                />
                <div class="el-upload-list__item-actions">
                  <el-icon class="el-icon--delete" @click="handleFileRemove(file)">
                    <Delete />
                  </el-icon>
                </div>
              </template>
            </el-upload>
            <div class="upload-tip">
              支持的文件格式：JPG, PNG, MP4，最大5个文件，每个文件不超过10MB
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">提交反馈</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { fetchExecutionTaskDetail, submitFeedback } from '@/api/execution'
import { EXECUTION_STATUS, EXECUTION_TYPES } from '@/mock/execution'
import type { ExecutionTask, ExecutionTaskStatus, FeedbackSubmitData } from '@/types/execution'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const taskDetail = ref<ExecutionTask | null>(null)
const feedbackFormRef = ref<FormInstance | null>(null)
const fileList = ref<any[]>([])

// 表单数据
const feedbackForm = reactive<FeedbackSubmitData & { execution_task_id: number }>({
  execution_task_id: Number(route.params.id) || 0,
  feedback_content: '',
  completion_date: '',
  actual_operation: '',
  effectiveness_rating: 3,
  difficulties_encountered: '',
  submitted_by: Number(userStore.user?.id) || 0,
  media_urls: []
})

// 表单验证规则
const feedbackRules = {
  completion_date: [
    { required: true, message: '请选择完成时间', trigger: 'change' }
  ],
  actual_operation: [
    { required: true, message: '请描述实际操作', trigger: 'blur' },
    { min: 5, max: 500, message: '长度应在5到500个字符之间', trigger: 'blur' }
  ],
  feedback_content: [
    { required: true, message: '请填写反馈内容', trigger: 'blur' },
    { min: 5, max: 1000, message: '长度应在5到1000个字符之间', trigger: 'blur' }
  ],
  effectiveness_rating: [
    { required: true, type: 'number', message: '请评价执行效果', trigger: 'change' }
  ]
}

// 状态标签和类型映射
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

// 获取任务详情
const fetchTaskDetail = async () => {
  const taskId = route.params.id as string
  if (!taskId) return
  
  loading.value = true
  try {
    const res = await fetchExecutionTaskDetail(taskId)
    if (res.success && res.data) {
      taskDetail.value = res.data
      // 设置默认表单值
      feedbackForm.execution_task_id = res.data.id
      feedbackForm.submitted_by = Number(userStore.user?.id) || 0
      feedbackForm.completion_date = new Date().toISOString()
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

// 文件变更处理
const handleFileChange = (file: any) => {
  // 在真实环境中，这里需要处理文件上传到服务器并获取URL
  // 模拟上传成功后的URL生成
  if (file.status === 'ready') {
    const isImage = file.raw.type.includes('image')
    const isVideo = file.raw.type.includes('video')
    
    if (!isImage && !isVideo) {
      ElMessage.error('只能上传图片或视频文件')
      fileList.value = fileList.value.filter(item => item.uid !== file.uid)
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过10MB')
      fileList.value = fileList.value.filter(item => item.uid !== file.uid)
      return
    }
    
    // 模拟文件上传后获取的URL
    const fileType = isImage ? 'images' : 'videos'
    const fileExt = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`
    const mockUrl = `/mock/feedback/${fileType}/${uniqueName}`
    
    // 在真实环境中，这里会是服务器返回的URL
    feedbackForm.media_urls.push(mockUrl)
  }
}

// 移除文件
const handleFileRemove = (file: any) => {
  const fileIndex = fileList.value.findIndex(item => item.uid === file.uid)
  if (fileIndex !== -1) {
    fileList.value.splice(fileIndex, 1)
    
    // 同时从表单中移除对应的URL
    if (feedbackForm.media_urls.length > fileIndex) {
      feedbackForm.media_urls.splice(fileIndex, 1)
    }
  }
}

// 提交表单
const submitForm = async () => {
  if (!feedbackFormRef.value) return
  
  await feedbackFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await submitFeedback(feedbackForm)
        if (res.success) {
          ElMessage.success('反馈提交成功')
          // 返回到任务详情页
          router.push(`/execution/tasks/${feedbackForm.execution_task_id}`)
        } else {
          ElMessage.error(res.message || '提交反馈失败')
        }
      } catch (error) {
        console.error('提交反馈出错:', error)
        ElMessage.error('提交反馈出错')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请完善表单信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (feedbackFormRef.value) {
    feedbackFormRef.value.resetFields()
  }
  fileList.value = []
  feedbackForm.media_urls = []
}

// 返回上一页
const goBack = () => {
  ElMessageBox.confirm(
    '确定离开此页面？未保存的数据将会丢失',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    router.back()
  }).catch(() => {
    // 取消操作
  })
}

onMounted(() => {
  fetchTaskDetail()
})
</script>

<style scoped>
.feedback-submission {
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

.feedback-form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 10px;
}

.el-upload-list__item-actions {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
</style> 