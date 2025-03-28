<template>
  <div class="parameter-form">
    <el-table :data="parameters" style="width: 100%">
      <el-table-column prop="name" label="参数名称" width="180" />
      <el-table-column prop="description" label="描述" width="220" />
      <el-table-column label="参数值" min-width="200">
        <template #default="{ row }">
          <!-- 字符串类型 -->
          <el-input
            v-if="row.type === 'text'"
            v-model="row.value"
            placeholder="请输入参数值"
            clearable
            @input="() => handleValueChange(row)"
          />
          
          <!-- 数字类型 -->
          <el-input-number
            v-else-if="row.type === 'number'"
            v-model="numberValues[row.id]"
            @change="() => handleNumberChange(row)"
            :min="0"
            :step="0.1"
            :precision="2"
            :controls-position="'right'"
            style="width: 100%"
          />
          
          <!-- 布尔类型 -->
          <el-switch
            v-else-if="row.type === 'boolean'"
            v-model="booleanValues[row.id]"
            @change="() => handleBooleanChange(row)"
            active-text="开启"
            inactive-text="关闭"
            :active-value="true"
            :inactive-value="false"
          />
          
          <!-- 选择类型 -->
          <el-select
            v-else-if="row.type === 'select'"
            v-model="row.value"
            placeholder="请选择"
            style="width: 100%"
            @change="() => handleValueChange(row)"
          >
            <el-option
              v-for="option in row.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button
              type="primary"
              size="small"
              @click="handleUpdate(row)"
              :disabled="!isChanged(row)"
            >保存</el-button>
            
            <el-button
              type="warning"
              size="small"
              @click="handleReset(row)"
              :disabled="!isChanged(row)"
            >重置</el-button>
            
            <el-button
              type="success"
              size="small"
              @click="handleTest(row)"
            >测试</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, reactive } from 'vue'

// 参数接口
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

const props = defineProps<{
  parameters: AnalysisParameter[];
}>()

const emit = defineEmits(['update', 'test'])

// 保存原始值
const originalValues = ref<Map<number, string>>(new Map())
// 数字类型的值
const numberValues = reactive<Record<number, number>>({})
// 布尔类型的值
const booleanValues = reactive<Record<number, boolean>>({})

// 初始化参数值
onMounted(() => {
  props.parameters.forEach(param => {
    // 保存原始值
    originalValues.value.set(param.id, param.value)
    
    // 初始化特殊类型的值
    if (param.type === 'number') {
      numberValues[param.id] = parseFloat(param.value) || 0
    } else if (param.type === 'boolean') {
      booleanValues[param.id] = param.value === 'true'
    }
  })
})

// 检查参数是否已更改
const isChanged = (param: AnalysisParameter) => {
  return originalValues.value.get(param.id) !== param.value
}

// 处理值变更
const handleValueChange = (param: AnalysisParameter) => {
  // 文本和选择类型直接更新
}

// 处理数字类型变更
const handleNumberChange = (param: AnalysisParameter) => {
  param.value = numberValues[param.id].toString()
}

// 处理布尔类型变更
const handleBooleanChange = (param: AnalysisParameter) => {
  param.value = booleanValues[param.id].toString()
}

// 更新参数
const handleUpdate = (param: AnalysisParameter) => {
  emit('update', param)
  originalValues.value.set(param.id, param.value)
}

// 重置参数
const handleReset = (param: AnalysisParameter) => {
  const originalValue = originalValues.value.get(param.id) || param.defaultValue
  param.value = originalValue
  
  // 重置特殊类型的值
  if (param.type === 'number') {
    numberValues[param.id] = parseFloat(originalValue) || 0
  } else if (param.type === 'boolean') {
    booleanValues[param.id] = originalValue === 'true'
  }
}

// 测试参数
const handleTest = (param: AnalysisParameter) => {
  emit('test', param)
}
</script>

<style scoped>
.parameter-form {
  margin: 20px 0;
}

.operation-buttons {
  display: flex;
  gap: 5px;
}
</style>

<script lang="ts">
export default {
  name: 'ParameterForm'
}
</script> 