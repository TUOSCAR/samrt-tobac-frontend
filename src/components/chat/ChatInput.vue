<template>
  <div class="chat-input-container">
    <div class="input-toolbar">
      <el-tooltip content="选择问题模板">
        <el-dropdown trigger="click" @command="onSelectTemplate">
          <el-button circle>
            <el-icon><QuestionFilled /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="template in questionTemplates" 
                :key="template.id" 
                :command="template"
              >
                {{ template.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-tooltip>
    </div>
    
    <div class="input-area">
      <el-input
        v-model="inputValue"
        type="textarea"
        :rows="3"
        :placeholder="placeholder"
        resize="none"
        :disabled="disabled"
        @keydown.enter.prevent="onKeyEnter"
      />
    </div>
    
    <div class="input-actions">
      <el-button 
        type="primary" 
        :loading="loading" 
        :disabled="isButtonDisabled" 
        @click="sendMessage"
      >
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup name="ChatInput" lang="ts">
import { ref, computed, onMounted } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { getTemplates } from '@/api/chat'

// 定义组件属性
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入您的问题，按Enter键发送',
  disabled: false,
  loading: false
})

// 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'select-template', template: any): void
}>()

// 状态变量
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const questionTemplates = ref<any[]>([])

// 判断按钮是否禁用
const isButtonDisabled = computed(() => {
  return props.disabled || !inputValue.value.trim()
})

// 按Enter键发送消息
const onKeyEnter = (e: KeyboardEvent) => {
  // 如果按住Shift键，则插入换行而不发送
  if (e.shiftKey) return
  
  // 否则发送消息
  if (!isButtonDisabled.value) {
    sendMessage()
  }
}

// 发送消息
const sendMessage = () => {
  if (isButtonDisabled.value) return
  emit('send')
}

// 选择问题模板
const onSelectTemplate = (template: any) => {
  emit('select-template', template)
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

// 组件挂载时加载问题模板
onMounted(() => {
  loadQuestionTemplates()
})
</script>

<style scoped>
.chat-input-container {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.input-toolbar {
  display: flex;
  margin-bottom: 10px;
}

.input-area {
  margin-bottom: 10px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-textarea__inner) {
  resize: none;
  font-family: inherit;
  padding: 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.el-textarea__inner:focus) {
  border-color: #95d475;
  box-shadow: 0 0 0 2px rgba(149, 212, 117, 0.2);
}
</style> 