<template>
  <div class="message-list" ref="messageListRef">
    <div v-if="loading" class="message-loading">
      <el-skeleton :rows="3" animated style="width: 80%" />
      <el-skeleton :rows="2" animated style="width: 60%; margin-left: auto; margin-top: 20px;" />
      <el-skeleton :rows="3" animated style="width: 80%" />
    </div>
    <template v-else>
      <div v-if="messages.length === 0" class="empty-messages">
        <p>开始提问吧，智能助手将为您解答疑问</p>
      </div>
      <div v-else class="message-container">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.role === 'user' ? 'message-user' : 'message-assistant']"
        >
          <div class="avatar">
            <el-avatar 
              :size="40" 
              :src="message.role === 'user' ? userAvatar : assistantAvatar"
              :icon="message.role === 'user' ? 'UserFilled' : 'Service'"
            />
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
            </div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup name="MessageList" lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useUserStore } from '@/store/user'

// 定义组件属性
interface Props {
  messages: any[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  loading: false
})

// 状态变量
const messageListRef = ref<HTMLElement | null>(null)
const userStore = useUserStore()
const userAvatar = ref(userStore.user?.avatar || '')
const assistantAvatar = ref('/img/ai-avatar.png')

// 格式化消息内容，支持简单的Markdown语法
const formatMessage = (content: string): string => {
  // 替换换行符为<br>
  let formattedContent = content.replace(/\n/g, '<br>')
  
  // 处理加粗文本 **text**
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 处理列表
  formattedContent = formattedContent.replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>')
  formattedContent = formattedContent.replace(/^-\s(.*)$/gm, '<li>$1</li>')
  
  // 在有<li>的段落前后添加<ul>或<ol>
  if (formattedContent.includes('<li>')) {
    formattedContent = '<ul>' + formattedContent + '</ul>'
  }
  
  return formattedContent
}

// 格式化时间
const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 监听消息变化，自动滚动到底部
watch(() => props.messages.length, async () => {
  await nextTick()
  scrollToBottom()
})

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.message-loading {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
  font-size: 16px;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-assistant {
  align-self: flex-start;
}

.avatar {
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 10px;
  max-width: 100%;
  word-break: break-word;
}

.message-user .message-bubble {
  background-color: #95d475;
  color: #fff;
  border-top-right-radius: 0;
}

.message-assistant .message-bubble {
  background-color: #ffffff;
  color: #333;
  border-top-left-radius: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.message-user .message-time {
  text-align: right;
}

.message-text {
  line-height: 1.5;
}

:deep(.message-text ul) {
  padding-left: 20px;
  margin: 8px 0;
}

:deep(.message-text li) {
  margin-bottom: 5px;
}
</style> 