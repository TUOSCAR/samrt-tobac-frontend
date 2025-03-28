<template>
  <div class="field-chat">
    <div class="page-header">
      <h2>地块相关问答</h2>
      <el-select 
        v-model="selectedField" 
        placeholder="请选择地块" 
        style="width: 240px"
        @change="onFieldChange"
      >
        <el-option 
          v-for="field in fields" 
          :key="field.id" 
          :label="field.field_name" 
          :value="field.id">
        </el-option>
      </el-select>
    </div>
    
    <template v-if="selectedField">
      <el-card class="field-info-card" v-loading="loadingField">
        <div class="field-info" v-if="currentField">
          <div class="field-basic">
            <h3>{{ currentField.field_name }}</h3>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="面积">{{ currentField.area }} 亩</el-descriptions-item>
              <el-descriptions-item label="种植品种">{{ currentField.crop_variety || '-' }}</el-descriptions-item>
              <el-descriptions-item label="种植日期">{{ currentField.planting_date || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-card>
      
      <div class="chat-container">
        <message-list 
          :messages="messages" 
          :loading="loadingMessages" 
        />
        <chat-input 
          v-model="currentMessage" 
          :disabled="loadingMessages || sendingMessage" 
          :loading="sendingMessage"
          placeholder="请输入关于此地块的问题..."
          @send="handleSendMessage" 
          @select-template="selectTemplate"
        />
      </div>
    </template>
    
    <el-empty 
      v-else 
      description="请先选择一个地块进行问答" 
      class="empty-state"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { getAllFields } from '@/api/field'
import { sendMessage as apiSendMessage } from '@/api/chat'

// 动态导入组件
const MessageList = defineAsyncComponent(() => import('@/components/chat/MessageList.vue'))
const ChatInput = defineAsyncComponent(() => import('@/components/chat/ChatInput.vue'))

// 状态变量
const userStore = useUserStore()
const fields = ref([])
const selectedField = ref(null)
const currentField = ref(null)
const messages = ref([])
const currentMessage = ref('')
const sessionId = ref(`field-chat-${Date.now()}`)
const loadingField = ref(false)
const loadingMessages = ref(false)
const sendingMessage = ref(false)

// 获取当前用户ID
const currentUserId = ref(userStore.user?.id || 0)

// 加载地块列表
const loadFields = async () => {
  try {
    const res = await getAllFields()
    if (res && res.success) {
      fields.value = res.data || []
    }
  } catch (error) {
    console.error('加载地块列表出错', error)
    ElMessage.error('加载地块列表出错')
  }
}

// 地块变更时
const onFieldChange = (fieldId) => {
  if (!fieldId) return
  
  // 清空消息
  messages.value = []
  
  // 创建新会话ID
  sessionId.value = `field-chat-${fieldId}-${Date.now()}`
  
  // 加载地块详情
  loadFieldDetail(fieldId)
  
  // 添加系统消息，提示用户
  const now = new Date().toISOString()
  messages.value.push({
    id: Date.now(),
    role: 'assistant',
    content: `您现在正在查询地块"${getFieldName(fieldId)}"的相关信息。请问有什么我可以帮助您的？`,
    timestamp: now
  })
}

// 加载地块详情
const loadFieldDetail = async (fieldId) => {
  try {
    loadingField.value = true
    
    // 在实际项目中，这里会调用获取地块详情的API
    // 此处简单模拟一下
    const field = fields.value.find(f => f.id === fieldId)
    if (field) {
      currentField.value = field
    }
  } catch (error) {
    console.error('加载地块详情出错', error)
    ElMessage.error('加载地块详情出错')
  } finally {
    loadingField.value = false
  }
}

// 获取地块名称
const getFieldName = (fieldId) => {
  const field = fields.value.find(f => f.id === fieldId)
  return field ? field.field_name : `地块 #${fieldId}`
}

// 发送消息
const handleSendMessage = async () => {
  if (!currentMessage.value.trim() || !selectedField.value || !currentUserId.value) return
  
  const messageToSend = currentMessage.value
  currentMessage.value = ''
  
  try {
    sendingMessage.value = true
    
    // 提前显示自己发送的消息，提升用户体验
    const now = new Date().toISOString()
    messages.value.push({
      id: Date.now(),
      role: 'user',
      content: messageToSend,
      timestamp: now
    })
    
    // 发送消息，关联当前地块
    const res = await apiSendMessage(
      sessionId.value,
      messageToSend,
      Number(currentUserId.value),
      selectedField.value
    )
    
    if (res && res.success && res.data) {
      // 添加AI回复到消息列表
      if (res.data.aiMessage) {
        messages.value.push(res.data.aiMessage)
      }
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

// 选择模板
const selectTemplate = (template) => {
  currentMessage.value = template.content
}

// 监听选中的地块变化
watch(selectedField, (newValue) => {
  if (newValue) {
    onFieldChange(newValue)
  } else {
    messages.value = []
    currentField.value = null
  }
})

// 初始化
onMounted(async () => {
  await loadFields()
})
</script>

<style scoped>
.field-chat {
  padding: 0;
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

.field-info-card {
  margin-bottom: 20px;
}

.field-info {
  padding: 10px 0;
}

.field-basic h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #409EFF;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}
</style> 