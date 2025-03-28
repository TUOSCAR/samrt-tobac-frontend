<template>
  <div class="system-parameter-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>系统参数设置</h3>
        </div>
      </template>
      
      <parameter-category 
        v-for="category in categories" 
        :key="category.id"
        :title="category.title"
        :parameters="filterParametersByCategory(category.id)"
        @update="handleParameterUpdate"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSystemParameters, updateSystemParameter, SystemParameter } from '@/api/system'
import ParameterCategory from './ParameterCategory.vue'

// 参数分类
interface Category {
  id: string;
  title: string;
}

// 参数分类列表
const categories = ref<Category[]>([
  { id: 'system', title: '系统基础设置' },
  { id: 'notification', title: '通知设置' },
  { id: 'security', title: '安全设置' },
  { id: 'integration', title: '集成服务设置' }
])

// 系统参数
const parameters = ref<SystemParameter[]>([])
const loading = ref(false)

// 根据类别筛选参数
const filterParametersByCategory = (categoryId: string) => {
  return parameters.value.filter(p => p.key.startsWith(categoryId + '.'))
}

// 获取系统参数
const fetchParameters = async () => {
  loading.value = true
  try {
    const res = await getSystemParameters()
    parameters.value = res.data || []
  } catch (error) {
    console.error('获取系统参数失败', error)
    ElMessage.error('获取系统参数失败')
  } finally {
    loading.value = false
  }
}

// 更新参数
const handleParameterUpdate = async (parameter: SystemParameter) => {
  try {
    await updateSystemParameter(parameter.id, { value: parameter.value })
    ElMessage.success('参数更新成功')
    
    // 更新本地参数
    const index = parameters.value.findIndex(p => p.id === parameter.id)
    if (index !== -1) {
      parameters.value[index].value = parameter.value
    }
  } catch (error) {
    console.error('更新参数失败', error)
    ElMessage.error('更新参数失败')
  }
}

// 如果系统参数为空，则添加一些模拟数据
const initMockData = () => {
  if (parameters.value.length === 0) {
    // 系统基础设置
    parameters.value.push(
      { id: 1, key: 'system.name', value: '智慧烟田监测与决策支持系统', description: '系统名称' },
      { id: 2, key: 'system.version', value: '1.0.0', description: '系统版本' },
      { id: 3, key: 'system.copyright', value: '© 2023 智慧烟田', description: '版权信息' },
      { id: 4, key: 'system.defaultLanguage', value: 'zh-CN', description: '默认语言' }
    )
    
    // 通知设置
    parameters.value.push(
      { id: 5, key: 'notification.enableEmail', value: 'true', description: '启用邮件通知' },
      { id: 6, key: 'notification.enableSMS', value: 'false', description: '启用短信通知' },
      { id: 7, key: 'notification.emailSender', value: 'noreply@smarttobacco.com', description: '通知邮件发送者' }
    )
    
    // 安全设置
    parameters.value.push(
      { id: 8, key: 'security.passwordMinLength', value: '6', description: '密码最小长度' },
      { id: 9, key: 'security.loginAttempts', value: '5', description: '最大登录尝试次数' },
      { id: 10, key: 'security.sessionTimeout', value: '120', description: '会话超时时间(分钟)' }
    )
    
    // 集成服务设置
    parameters.value.push(
      { id: 11, key: 'integration.weatherApiKey', value: 'abcdef123456', description: '天气API密钥' },
      { id: 12, key: 'integration.llmApiEndpoint', value: 'https://api.dify.ai/v1', description: '大模型API地址' },
      { id: 13, key: 'integration.mapProvider', value: 'leaflet', description: '地图服务提供商' }
    )
  }
}

onMounted(async () => {
  await fetchParameters()
  // 如果API没有返回数据，使用模拟数据
  if (parameters.value.length === 0) {
    initMockData()
  }
})
</script>

<style scoped>
.system-parameter-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.system-info {
  margin-bottom: 30px;
}
</style> 