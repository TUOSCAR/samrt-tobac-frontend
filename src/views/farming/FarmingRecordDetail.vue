<template>
  <div class="farming-record-detail" v-loading="loading">
    <div class="page-header">
      <div class="title-container">
        <el-page-header @back="goBack" />
        <h2>农事记录详情</h2>
      </div>
      <div class="actions">
        <el-button @click="editRecord" type="primary">编辑记录</el-button>
        <el-button @click="confirmDelete" type="danger">删除记录</el-button>
      </div>
    </div>
    
    <el-card v-if="record">
      <div class="detail-header">
        <div class="operation-type">
          <el-tag :type="getOperationTypeColor(record.operation_type)" size="large">
            {{ getOperationTypeName(record.operation_type) }}
          </el-tag>
        </div>
        <div class="operation-date">
          <el-icon><Calendar /></el-icon>
          <span>{{ formatDate(record.operation_date) }}</span>
        </div>
      </div>
      
      <el-divider />
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="记录ID">{{ record.id }}</el-descriptions-item>
        <el-descriptions-item label="地块">{{ getFieldName(record.field_id) }}</el-descriptions-item>
        <el-descriptions-item label="作业面积">{{ record.operation_area }} 亩</el-descriptions-item>
        <el-descriptions-item label="作业费用">{{ record.cost ? `¥${record.cost}` : '无' }}</el-descriptions-item>
        <el-descriptions-item label="使用物料">{{ record.materials_used || '无' }}</el-descriptions-item>
        <el-descriptions-item label="使用剂量">{{ record.dosage || '无' }}</el-descriptions-item>
        <el-descriptions-item label="天气条件">{{ record.weather_condition || '无记录' }}</el-descriptions-item>
        <el-descriptions-item label="执行人">{{ getPerformerName(record.performed_by) }}</el-descriptions-item>
        <el-descriptions-item label="记录人">{{ getRecorderName(record.recorded_by) }}</el-descriptions-item>
        <el-descriptions-item label="记录时间">{{ formatDate(record.recorded_at) }}</el-descriptions-item>
        <el-descriptions-item label="相关任务">
          <template v-if="record.execution_task_id">
            <el-link type="primary" @click="viewTask(record.execution_task_id)">
              查看任务 #{{ record.execution_task_id }}
            </el-link>
          </template>
          <template v-else>无关联任务</template>
        </el-descriptions-item>
      </el-descriptions>
      
      <el-divider>操作详情</el-divider>
      
      <div class="details-content">
        {{ record.operation_details }}
      </div>
      
      <el-divider v-if="record.notes">备注</el-divider>
      
      <div class="notes-content" v-if="record.notes">
        {{ record.notes }}
      </div>
    </el-card>
    
    <el-empty v-else description="未找到记录" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'
import { getFarmingOperationById, deleteFarmingOperationRecord } from '@/api/farming'
import { getAllFields } from '@/api/field'
import { getUserList } from '@/api/system'
import { farmingOperationTypes } from '@/mock/farming'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const record = ref<any>(null)
const fields = ref<any[]>([])
const users = ref<any[]>([])

// 获取操作类型名称
const getOperationTypeName = (typeCode: string): string => {
  const type = farmingOperationTypes.find(t => t.type_code === typeCode)
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

// 获取执行人姓名
const getPerformerName = (userId: number): string => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : `用户#${userId}`
}

// 获取记录人姓名
const getRecorderName = (userId: number): string => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : `用户#${userId}`
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 加载农事记录详情
const loadRecord = async () => {
  const id = parseInt(route.params.id as string)
  if (!id) return
  
  try {
    loading.value = true
    const res = await getFarmingOperationById(id)
    
    if (res.success) {
      record.value = res.data
    } else {
      ElMessage.error('获取农事记录详情失败')
    }
  } catch (error) {
    console.error('加载农事记录详情出错', error)
    ElMessage.error('加载农事记录详情出错')
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

// 加载用户列表
const loadUsers = async () => {
  try {
    const res = await getUserList()
    if (res.success) {
      users.value = res.data
    }
  } catch (error) {
    console.error('加载用户列表出错', error)
  }
}

// 编辑记录
const editRecord = () => {
  if (record.value) {
    router.push(`/farming/records/edit/${record.value.id}`)
  }
}

// 确认删除记录
const confirmDelete = () => {
  if (!record.value) return
  
  ElMessageBox.confirm(`确定要删除这条农事记录吗？此操作不可恢复。`, '删除确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteFarmingOperationRecord(record.value.id)
      if (res.success) {
        ElMessage.success('删除成功')
        router.push('/farming/records')
      } else {
        ElMessage.error(`删除失败: ${res.message}`)
      }
    } catch (error) {
      console.error('删除记录出错', error)
      ElMessage.error('删除记录出错')
    }
  }).catch(() => {})
}

// 查看相关任务
const viewTask = (taskId: number) => {
  router.push(`/execution/tasks/${taskId}`)
}

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadFields(),
    loadUsers()
  ])
  
  // 加载记录详情
  loadRecord()
})
</script>

<style scoped>
.farming-record-detail {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-container {
  display: flex;
  align-items: center;
}

.title-container h2 {
  margin: 0 0 0 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.operation-type {
  font-size: 16px;
}

.operation-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

.details-content, .notes-content {
  margin: 20px 0;
  line-height: 1.6;
  white-space: pre-line;
}
</style> 