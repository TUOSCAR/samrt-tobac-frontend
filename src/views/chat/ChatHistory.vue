<template>
  <div class="chat-history">
    <div class="page-header">
      <h2>会话历史记录</h2>
    </div>
    
    <el-card v-loading="loading">
      <template v-if="sessions.length > 0">
        <el-table :data="sessions" style="width: 100%">
          <el-table-column label="会话时间" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.createdAt) }}
            </template>
          </el-table-column>
          
          <el-table-column label="最后更新" width="180">
            <template #default="{ row }">
              {{ formatDateTime(row.lastUpdatedAt) }}
            </template>
          </el-table-column>
          
          <el-table-column label="关联地块" width="180">
            <template #default="{ row }">
              <el-tag v-if="row.relatedFieldId" size="small">
                {{ getFieldName(row.relatedFieldId) }}
              </el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          
          <el-table-column label="最后消息" min-width="300" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.lastMessage }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button 
                size="small" 
                type="primary" 
                link
                @click="viewSession(row.sessionId)"
              >
                查看
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                link
                @click="confirmDeleteSession(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      
      <el-empty v-else description="暂无会话记录" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserChatSessions } from '@/api/chat'
import { getAllFields } from '@/api/field'

// 状态变量
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const sessions = ref([])
const fields = ref([])

// 获取当前用户ID
const currentUserId = ref(userStore.user?.id || 0)

// 格式化日期时间
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 获取地块名称
const getFieldName = (fieldId) => {
  if (!fieldId) return '未关联地块'
  const field = fields.value.find(f => f.id === fieldId)
  return field ? field.field_name : `地块 #${fieldId}`
}

// 加载会话历史
const loadSessions = async () => {
  if (!currentUserId.value) return
  
  try {
    loading.value = true
    const res = await getUserChatSessions(Number(currentUserId.value))
    
    if (res && res.success) {
      sessions.value = res.data || []
    } else {
      ElMessage.error('获取会话历史记录失败')
    }
  } catch (error) {
    console.error('加载会话历史记录出错', error)
    ElMessage.error('加载会话历史记录出错')
  } finally {
    loading.value = false
  }
}

// 加载地块列表
const loadFields = async () => {
  try {
    const res = await getAllFields()
    if (res && res.success) {
      fields.value = res.data || []
    }
  } catch (error) {
    console.error('加载地块列表出错', error)
  }
}

// 查看会话详情
const viewSession = (sessionId) => {
  router.push({
    path: '/chat',
    query: { session: sessionId }
  })
}

// 确认删除会话
const confirmDeleteSession = (session) => {
  ElMessageBox.confirm(
    '确定要删除此会话记录吗？此操作不可恢复。',
    '删除确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 实际项目中会调用删除会话的API，此处模拟成功后移除本地数据
    sessions.value = sessions.value.filter(s => s.sessionId !== session.sessionId)
  }).catch(() => {})
}

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadFields(),
    loadSessions()
  ])
})
</script>

<style scoped>
.chat-history {
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
</style> 