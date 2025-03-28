<template>
  <div class="parameter-category">
    <div class="category-title">
      <h4>{{ title }}</h4>
    </div>
    
    <el-table :data="parameters" style="width: 100%">
      <el-table-column prop="key" label="参数键" width="250" />
      <el-table-column prop="description" label="描述" width="200" />
      <el-table-column label="参数值" min-width="200">
        <template #default="{ row }">
          <parameter-input
            :parameter="row"
            @update="handleUpdate"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="() => handleSave(row)"
            :disabled="!isEdited(row)"
          >保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { SystemParameter } from '@/api/system'
import ParameterInput from './ParameterInput.vue'

interface Props {
  title: string;
  parameters: SystemParameter[];
}

const props = defineProps<Props>()
const emit = defineEmits(['update'])

// 保存编辑过的参数
const editedParams = ref<Set<number>>(new Set())
// 原始值
const originalValues = ref<Map<number, string>>(new Map())

// 是否被编辑过
const isEdited = (parameter: SystemParameter) => {
  return editedParams.value.has(parameter.id)
}

// 处理参数更新
const handleUpdate = (parameter: SystemParameter) => {
  // 如果不存在原始值，先保存
  if (!originalValues.value.has(parameter.id)) {
    originalValues.value.set(parameter.id, parameter.value)
  }
  
  // 检查是否与原始值不同
  if (parameter.value !== originalValues.value.get(parameter.id)) {
    editedParams.value.add(parameter.id)
  } else {
    editedParams.value.delete(parameter.id)
  }
}

// 保存参数
const handleSave = (parameter: SystemParameter) => {
  emit('update', parameter)
  editedParams.value.delete(parameter.id)
  originalValues.value.set(parameter.id, parameter.value)
}

onMounted(() => {
  // 初始化原始值
  props.parameters.forEach(param => {
    originalValues.value.set(param.id, param.value)
  })
})
</script>

<style scoped>
.parameter-category {
  margin-bottom: 30px;
}

.category-title {
  margin-bottom: 15px;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.category-title h4 {
  margin: 0;
  font-size: 16px;
}
</style>

<script lang="ts">
export default {
  name: 'ParameterCategory'
}
</script> 