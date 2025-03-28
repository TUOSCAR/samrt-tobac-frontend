<template>
  <div class="analysis-parameter-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>分析参数配置</h3>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="烟株计数参数" name="plantCount">
          <parameter-form 
            :parameters="plantCountParameters" 
            @update="handleParameterUpdate"
            @test="handleParameterTest"
          />
        </el-tab-pane>
        
        <el-tab-pane label="长势分析参数" name="growth">
          <parameter-form 
            :parameters="growthParameters" 
            @update="handleParameterUpdate"
            @test="handleParameterTest"
          />
        </el-tab-pane>
        
        <el-tab-pane label="估产分析参数" name="yield">
          <parameter-form 
            :parameters="yieldParameters" 
            @update="handleParameterUpdate"
            @test="handleParameterTest"
          />
        </el-tab-pane>
        
        <el-tab-pane label="大模型参数" name="llm">
          <parameter-form 
            :parameters="llmParameters" 
            @update="handleParameterUpdate"
            @test="handleParameterTest"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 参数测试对话框 -->
    <el-dialog
      v-model="testDialogVisible"
      title="参数测试"
      width="650px"
    >
      <div v-if="testLoading" class="test-loading">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else class="test-result">
        <div class="test-header">
          <el-tag type="success">测试完成</el-tag>
          <div class="test-time">耗时: {{ testResult.time }}ms</div>
        </div>
        
        <div class="section-title">
          <h4>测试结果</h4>
        </div>
        
        <el-descriptions border>
          <el-descriptions-item label="参数组">{{ testResult.group }}</el-descriptions-item>
          <el-descriptions-item label="参数名称">{{ testResult.name }}</el-descriptions-item>
          <el-descriptions-item label="参数值">{{ testResult.value }}</el-descriptions-item>
          <el-descriptions-item label="测试状态">
            <el-tag :type="testResult.status === 'success' ? 'success' : 'danger'">
              {{ testResult.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="section-title">
          <h4>详细信息</h4>
        </div>
        
        <div class="test-details">
          <el-alert
            :title="testResult.details"
            :type="testResult.status === 'success' ? 'success' : 'error'"
            show-icon
          />
        </div>
        
        <div class="test-actions">
          <el-button type="primary" @click="testDialogVisible = false">确定</el-button>
          <el-button v-if="testResult.status !== 'success'" @click="useRecommendedValue">
            使用推荐值
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ParameterForm from './ParameterForm.vue'

// 分析参数接口
interface AnalysisParameter {
  id: number;
  group: string;
  name: string;
  key: string;
  value: string;
  defaultValue: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: { label: string; value: string }[];
}

// 测试结果接口
interface TestResult {
  group: string;
  name: string;
  value: string;
  time: number;
  status: 'success' | 'failure';
  details: string;
  recommendedValue?: string;
}

const activeTab = ref('plantCount')
const testDialogVisible = ref(false)
const testLoading = ref(false)
const testingParameter = ref<AnalysisParameter | null>(null)

// 测试结果
const testResult = reactive<TestResult>({
  group: '',
  name: '',
  value: '',
  time: 0,
  status: 'success',
  details: ''
})

// 烟株计数参数
const plantCountParameters = ref<AnalysisParameter[]>([
  {
    id: 1,
    group: 'plantCount',
    name: '检测阈值',
    key: 'plantCount.detectionThreshold',
    value: '0.75',
    defaultValue: '0.75',
    description: '烟株检测的置信度阈值',
    type: 'number'
  },
  {
    id: 2,
    group: 'plantCount',
    name: '最小目标尺寸',
    key: 'plantCount.minObjectSize',
    value: '10',
    defaultValue: '10',
    description: '最小识别烟株的像素尺寸',
    type: 'number'
  },
  {
    id: 3,
    group: 'plantCount',
    name: '非极大值抑制',
    key: 'plantCount.nmsThreshold',
    value: '0.3',
    defaultValue: '0.3',
    description: '非极大值抑制阈值',
    type: 'number'
  }
])

// 长势分析参数
const growthParameters = ref<AnalysisParameter[]>([
  {
    id: 4,
    group: 'growth',
    name: '植被指数类型',
    key: 'growth.indexType',
    value: 'NDVI',
    defaultValue: 'NDVI',
    description: '使用的植被指数类型',
    type: 'select',
    options: [
      { label: 'NDVI', value: 'NDVI' },
      { label: 'EVI', value: 'EVI' },
      { label: 'SAVI', value: 'SAVI' }
    ]
  },
  {
    id: 5,
    group: 'growth',
    name: '优等长势阈值',
    key: 'growth.excellentThreshold',
    value: '0.7',
    defaultValue: '0.7',
    description: '优等长势的NDVI阈值',
    type: 'number'
  },
  {
    id: 6,
    group: 'growth',
    name: '良好长势阈值',
    key: 'growth.goodThreshold',
    value: '0.5',
    defaultValue: '0.5',
    description: '良好长势的NDVI阈值',
    type: 'number'
  }
])

// 估产分析参数
const yieldParameters = ref<AnalysisParameter[]>([
  {
    id: 7,
    group: 'yield',
    name: '单叶重量模型',
    key: 'yield.leafWeightModel',
    value: 'linear',
    defaultValue: 'linear',
    description: '单叶重量预测模型',
    type: 'select',
    options: [
      { label: '线性模型', value: 'linear' },
      { label: '指数模型', value: 'exponential' },
      { label: '多项式模型', value: 'polynomial' }
    ]
  },
  {
    id: 8,
    group: 'yield',
    name: '校正因子',
    key: 'yield.correctionFactor',
    value: '1.05',
    defaultValue: '1.05',
    description: '估产结果校正因子',
    type: 'number'
  }
])

// 大模型参数
const llmParameters = ref<AnalysisParameter[]>([
  {
    id: 9,
    group: 'llm',
    name: '模型类型',
    key: 'llm.modelType',
    value: 'gpt-3.5-turbo',
    defaultValue: 'gpt-3.5-turbo',
    description: '使用的大模型类型',
    type: 'select',
    options: [
      { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'Claude', value: 'claude' }
    ]
  },
  {
    id: 10,
    group: 'llm',
    name: '温度',
    key: 'llm.temperature',
    value: '0.7',
    defaultValue: '0.7',
    description: '回复的随机性，值越高随机性越大',
    type: 'number'
  },
  {
    id: 11,
    group: 'llm',
    name: '上下文历史长度',
    key: 'llm.contextLength',
    value: '10',
    defaultValue: '10',
    description: '保留的对话轮次',
    type: 'number'
  },
  {
    id: 12,
    group: 'llm',
    name: '启用长期记忆',
    key: 'llm.enableLongTermMemory',
    value: 'true',
    defaultValue: 'true',
    description: '是否启用长期记忆功能',
    type: 'boolean'
  }
])

// 更新参数
const handleParameterUpdate = (parameter: AnalysisParameter) => {
  const { group } = parameter
  
  let paramList: AnalysisParameter[] = []
  
  if (group === 'plantCount') {
    paramList = plantCountParameters.value
  } else if (group === 'growth') {
    paramList = growthParameters.value
  } else if (group === 'yield') {
    paramList = yieldParameters.value
  } else if (group === 'llm') {
    paramList = llmParameters.value
  }
  
  const index = paramList.findIndex(p => p.id === parameter.id)
  if (index !== -1) {
    paramList[index].value = parameter.value
    ElMessage.success(`参数 "${parameter.name}" 已更新`)
  }
}

// 测试参数
const handleParameterTest = (parameter: AnalysisParameter) => {
  testDialogVisible.value = true
  testLoading.value = true
  testingParameter.value = parameter
  
  // 模拟API调用
  setTimeout(() => {
    const isSuccess = Math.random() > 0.3 // 70%概率成功
    
    testResult.group = parameter.group === 'plantCount' ? '烟株计数' : 
                        parameter.group === 'growth' ? '长势分析' :
                        parameter.group === 'yield' ? '估产分析' : '大模型分析'
    testResult.name = parameter.name
    testResult.value = parameter.value
    testResult.time = Math.floor(Math.random() * 1000) + 500 // 500-1500ms
    testResult.status = isSuccess ? 'success' : 'failure'
    
    if (isSuccess) {
      testResult.details = `参数 "${parameter.name}" 测试成功，当前设置值可以正常工作。`
    } else {
      // 生成一个推荐值
      let recommendedValue = ''
      
      if (parameter.type === 'number') {
        const currentValue = parseFloat(parameter.value)
        const variation = currentValue * 0.2 // 20%的变化
        recommendedValue = (currentValue + (Math.random() * variation - variation / 2)).toFixed(2)
      } else if (parameter.type === 'select' && parameter.options) {
        const currentIndex = parameter.options.findIndex(opt => opt.value === parameter.value)
        const newIndex = (currentIndex + 1) % parameter.options.length
        recommendedValue = parameter.options[newIndex].value
      } else if (parameter.type === 'boolean') {
        recommendedValue = parameter.value === 'true' ? 'false' : 'true'
      } else {
        recommendedValue = parameter.defaultValue
      }
      
      testResult.details = `参数 "${parameter.name}" 测试失败，当前值可能不是最优设置。建议使用推荐值: ${recommendedValue}`
      testResult.recommendedValue = recommendedValue
    }
    
    testLoading.value = false
  }, 1500)
}

// 使用推荐值
const useRecommendedValue = () => {
  if (testingParameter.value && testResult.recommendedValue) {
    handleParameterUpdate({
      ...testingParameter.value,
      value: testResult.recommendedValue
    })
    testDialogVisible.value = false
  }
}
</script>

<style scoped>
.analysis-parameter-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-loading {
  padding: 20px;
}

.test-result {
  padding: 10px;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.test-time {
  color: #606266;
  font-size: 14px;
}

.section-title {
  margin: 20px 0 10px;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.section-title h4 {
  margin: 0;
  font-size: 16px;
}

.test-details {
  margin: 20px 0;
}

.test-actions {
  margin-top: 20px;
  text-align: right;
}
</style> 