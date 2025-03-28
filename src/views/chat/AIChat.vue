<template>
  <div class="chat-container">
    <div class="page-header">
      <h2>智能助手对话</h2>
      <div class="actions">
        <el-select 
          v-model="currentField" 
          clearable 
          placeholder="关联地块" 
          style="width: 200px; margin-right: 10px;"
        >
          <el-option 
            v-for="field in fields" 
            :key="field.id" 
            :label="field.field_name" 
            :value="field.id" 
          />
        </el-select>
        <el-button type="primary" @click="startNewSession">
          <el-icon><Plus /></el-icon>新对话
        </el-button>
      </div>
    </div>
    
    <el-container class="main-container">
      <el-aside width="280px" class="session-list">
        <div class="session-header">
          <h3>会话列表</h3>
        </div>
        <div v-if="loadingList" class="session-loading">
          <el-skeleton :rows="5" animated />
        </div>
        <div v-else-if="sessions.length === 0" class="empty-list">
          <el-empty description="暂无会话记录" />
        </div>
        <div v-else class="session-items">
          <div 
            v-for="session in sessions" 
            :key="session.sessionId" 
            :class="['session-item', { active: session.sessionId === currentSessionId }]"
            @click="selectSession(session.sessionId)"
          >
            <div class="session-content">
              <div class="session-title">
                <el-tag size="small" v-if="session.relatedFieldId">
                  {{ getFieldName(session.relatedFieldId) }}
                </el-tag>
                <span class="session-time">{{ formatTime(session.lastUpdatedAt) }}</span>
              </div>
              <p class="session-preview">{{ session.lastMessage }}</p>
            </div>
          </div>
        </div>
      </el-aside>
      
      <el-main class="chat-main">
        <template v-if="currentSessionId">
          <message-list 
            :messages="currentMessages" 
            :loading="loadingMessages" 
          />
          <chat-input 
            v-model="currentMessage" 
            :disabled="loadingMessages || sendingMessage" 
            :loading="sendingMessage"
            @send="handleSendMessage" 
            @select-template="selectTemplate"
          />
        </template>
        <div v-else class="empty-chat">
          <div class="welcome-container">
            <img src="@/assets/ai-assistant.png" alt="AI助手" class="assistant-image">
            <h2>烟草种植智能助手</h2>
            <p>我可以帮助您解答关于烟草种植、病虫害防治、田间管理等问题</p>
            <div class="template-buttons">
              <h4>推荐问题:</h4>
              <div class="templates-grid">
                <el-button 
                  v-for="template in questionTemplates" 
                  :key="template.id" 
                  @click="useTemplate(template.content)"
                >
                  {{ template.title }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { 
  getUserChatSessions, 
  getChatSession, 
  sendMessage as apiSendMessage, 
  getTemplates 
} from '@/api/chat'
import { getAllFields } from '@/api/field'
import { defineAsyncComponent } from 'vue'

// 动态导入组件
const MessageList = defineAsyncComponent(() => import('@/components/chat/MessageList.vue'))
const ChatInput = defineAsyncComponent(() => import('@/components/chat/ChatInput.vue'))

// 状态管理
const userStore = useUserStore()
const sessions = ref<any[]>([])
const currentSessionId = ref<string>('')
const currentField = ref<number | null>(null)
const currentMessage = ref('')
const fields = ref<any[]>([])
const questionTemplates = ref<any[]>([])
const currentMessages = ref<any[]>([])
const loadingList = ref(false)
const loadingMessages = ref(false)
const sendingMessage = ref(false)

// 获取当前用户ID
const currentUserId = computed(() => userStore.user?.id || 0)

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  
  // 当天的消息只显示时间
  if (date.toDateString() === now.toDateString()) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  // 本年的消息显示月日
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  // 其他情况显示年月日
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

// 获取地块名称
const getFieldName = (fieldId: number | null) => {
  if (!fieldId) return '未关联地块'
  const field = fields.value.find(f => f.id === fieldId)
  return field ? field.field_name : `地块 #${fieldId}`
}

// 加载会话列表
const loadSessions = async () => {
  if (!currentUserId.value) return
  
  try {
    loadingList.value = true
    const res = await getUserChatSessions(Number(currentUserId.value))
    
    if (res && res.success) {
      sessions.value = res.data || []
    } else {
      ElMessage.error('获取会话列表失败')
    }
  } catch (error) {
    console.error('加载会话列表出错', error)
    ElMessage.error('加载会话列表出错')
  } finally {
    loadingList.value = false
  }
}

// 加载当前会话消息
const loadSessionMessages = async (sessionId: string) => {
  try {
    loadingMessages.value = true
    const res = await getChatSession(sessionId)
    
    if (res && res.success && res.data) {
      currentMessages.value = res.data.messages || []
      
      // 如果有关联地块，自动选择
      if (res.data.relatedFieldId && !currentField.value) {
        currentField.value = res.data.relatedFieldId
      }
    } else {
      ElMessage.error('获取会话消息失败')
      currentMessages.value = []
    }
  } catch (error) {
    console.error('加载会话消息出错', error)
    ElMessage.error('加载会话消息出错')
    currentMessages.value = []
  } finally {
    loadingMessages.value = false
  }
}

// 选择会话
const selectSession = (sessionId: string) => {
  currentSessionId.value = sessionId
  loadSessionMessages(sessionId)
}

// 开始新会话
const startNewSession = () => {
  currentSessionId.value = `session-${Date.now()}`
  currentMessages.value = []
}

// 发送消息
const handleSendMessage = async () => {
  if (!currentMessage.value.trim() || !currentSessionId.value || !currentUserId.value) return
  
  const messageToSend = currentMessage.value
  currentMessage.value = ''
  
  try {
    sendingMessage.value = true
    
    // 提前显示自己发送的消息，提升用户体验
    const now = new Date().toISOString()
    currentMessages.value.push({
      id: Date.now(),
      role: 'user',
      content: messageToSend,
      timestamp: now
    })
    
    // 发送消息
    const res = await apiSendMessage(
      currentSessionId.value,
      messageToSend,
      Number(currentUserId.value),
      currentField.value || undefined
    )
    
    if (res && res.success && res.data) {
      // 添加AI回复到消息列表
      if (res.data.aiMessage) {
        currentMessages.value.push(res.data.aiMessage)
      }
      
      // 刷新会话列表，确保新会话被显示
      loadSessions()
    } else {
      ElMessage.error('发送消息失败')
    }
  } catch (error) {
    console.error('发送消息出错', error)
    ElMessage.error('发送消息出错')
  } finally {
    sendingMessage.value = false
  }
}

// 加载问题模板
const loadQuestionTemplates = async () => {
  try {
    const res = await getTemplates()
    if (res && res.success) {
      questionTemplates.value = res.data || []
    }
  } catch (error) {
    console.error('加载问题模板出错', error)
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

// 使用问题模板
const useTemplate = (content: string) => {
  currentMessage.value = content
  
  // 如果尚未创建会话，自动创建一个
  if (!currentSessionId.value) {
    startNewSession()
  }
}

// 从输入组件中选择模板
const selectTemplate = (template: any) => {
  useTemplate(template.content)
}

// 监视选定的地块变化
watch(currentField, (newValue) => {
  // 当选择了新的地块，且已有会话时，可以在这里添加相关逻辑
  console.log('选择了新地块:', newValue)
})

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadQuestionTemplates(),
    loadFields(),
    loadSessions()
  ])
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
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

.main-container {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.session-list {
  border-right: 1px solid #e0e0e0;
  background-color: #f5f7fa;
  overflow-y: auto;
}

.session-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f0f2f5;
}

.session-header h3 {
  margin: 0;
  font-size: 16px;
}

.session-items {
  overflow-y: auto;
}

.session-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.session-item:hover {
  background-color: #ecf5ff;
}

.session-item.active {
  background-color: #e6f1fc;
}

.session-content {
  display: flex;
  flex-direction: column;
}

.session-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.session-time {
  font-size: 12px;
  color: #909399;
}

.session-preview {
  font-size: 13px;
  color: #606266;
  margin: 5px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  background-color: #f9f9f9;
}

.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.welcome-container {
  max-width: 600px;
  text-align: center;
}

.assistant-image {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
}

.template-buttons {
  margin-top: 30px;
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 8px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.session-loading {
  padding: 15px;
}

.empty-list {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style> 