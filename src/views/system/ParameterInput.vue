<template>
  <div class="parameter-input">
    <!-- 字符串类型 -->
    <el-input
      v-if="inputType === 'text'"
      v-model="inputValue"
      @input="handleInput"
      placeholder="请输入参数值"
      clearable
    />
    
    <!-- 数字类型 -->
    <el-input-number
      v-else-if="inputType === 'number'"
      v-model="numberValue"
      @change="handleInput"
      :min="0"
      :controls-position="'right'"
    />
    
    <!-- 布尔类型 -->
    <el-switch
      v-else-if="inputType === 'boolean'"
      v-model="booleanValue"
      @change="handleBooleanChange"
      active-text="开启"
      inactive-text="关闭"
      :active-value="true"
      :inactive-value="false"
    />
    
    <!-- 选择类型 -->
    <el-select
      v-else-if="inputType === 'select'"
      v-model="inputValue"
      @change="handleInput"
      placeholder="请选择"
      style="width: 100%"
    >
      <el-option
        v-for="option in selectOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    
    <!-- 默认文本类型 -->
    <el-input
      v-else
      v-model="inputValue"
      @input="handleInput"
      placeholder="请输入参数值"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits, onMounted } from 'vue'
import { SystemParameter } from '@/api/system'

const props = defineProps<{
  parameter: SystemParameter
}>()

const emit = defineEmits(['update'])

// 输入值
const inputValue = ref(props.parameter.value)
// 数字类型的值
const numberValue = ref<number>(0)
// 布尔类型的值
const booleanValue = ref<boolean>(false)

// 根据参数键确定输入类型
const inputType = computed(() => {
  const key = props.parameter.key
  
  // 如果明确是数字类型
  if (
    key.includes('minLength') ||
    key.includes('maxLength') ||
    key.includes('timeout') ||
    key.includes('attempts') ||
    key.includes('interval') ||
    key.includes('limit')
  ) {
    return 'number'
  }
  
  // 如果明确是布尔类型
  if (
    key.includes('enable') ||
    key.includes('disabled') ||
    key.includes('active') ||
    key.includes('show')
  ) {
    return 'boolean'
  }
  
  // 如果是选择类型
  if (key === 'system.defaultLanguage') {
    return 'select'
  }
  
  // 默认作为文本处理
  return 'text'
})

// 选择类型的选项
const selectOptions = computed(() => {
  const key = props.parameter.key
  
  if (key === 'system.defaultLanguage') {
    return [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: '英文' }
    ]
  }
  
  return []
})

// 初始化数值
onMounted(() => {
  if (inputType.value === 'number') {
    numberValue.value = parseInt(props.parameter.value) || 0
  } else if (inputType.value === 'boolean') {
    booleanValue.value = props.parameter.value === 'true'
  }
})

// 监听参数变化
watch(() => props.parameter, (newVal) => {
  inputValue.value = newVal.value
  
  if (inputType.value === 'number') {
    numberValue.value = parseInt(newVal.value) || 0
  } else if (inputType.value === 'boolean') {
    booleanValue.value = newVal.value === 'true'
  }
}, { deep: true })

// 普通输入处理
const handleInput = () => {
  if (inputType.value === 'number') {
    emit('update', { ...props.parameter, value: numberValue.value.toString() })
  } else {
    emit('update', { ...props.parameter, value: inputValue.value })
  }
}

// 布尔值变化处理
const handleBooleanChange = (val: boolean) => {
  emit('update', { ...props.parameter, value: val.toString() })
}
</script>

<style scoped>
.parameter-input {
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
export default {
  name: 'ParameterInput'
}
</script> 