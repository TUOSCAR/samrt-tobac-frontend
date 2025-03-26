<template>
  <el-card class="filter-card">
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="地块名称">
        <el-input v-model="filterForm.name" placeholder="请输入地块名称" clearable />
      </el-form-item>
      
      <el-form-item label="地块类型">
        <el-select v-model="filterForm.type" placeholder="请选择地块类型" clearable>
          <el-option
            v-for="item in fieldTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="状态">
        <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="normal" />
          <el-option label="待处理" value="pending" />
          <el-option label="已关闭" value="closed" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="面积范围">
        <el-input-number
          v-model="filterForm.minArea"
          :min="0"
          :precision="2"
          placeholder="最小值"
          class="area-input"
        />
        <span class="area-separator">-</span>
        <el-input-number
          v-model="filterForm.maxArea"
          :min="0"
          :precision="2"
          placeholder="最大值"
          class="area-input"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getFieldTypes } from '@/api/field'

interface FieldType {
  label: string
  value: string
}

interface FilterForm {
  name: string
  type: string
  status: string
  minArea: number | null
  maxArea: number | null
}

const props = defineProps<{
  modelValue: FilterForm
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterForm): void
  (e: 'search'): void
}>()

// 地块类型选项
const fieldTypes = ref<FieldType[]>([
  { label: '水田', value: 'water' },
  { label: '旱地', value: 'dry' },
  { label: '山地', value: 'mountain' }
])

// 筛选表单
const filterForm = reactive<FilterForm>({
  name: '',
  type: '',
  status: '',
  minArea: null,
  maxArea: null
})

// 获取地块类型列表
const loadFieldTypes = async () => {
  try {
    const res = await getFieldTypes()
    fieldTypes.value = res.data
  } catch (error) {
    console.error('获取地块类型失败:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  emit('update:modelValue', { ...filterForm })
  emit('search')
}

// 处理重置
const handleReset = () => {
  const keys: (keyof FilterForm)[] = ['name', 'type', 'status', 'minArea', 'maxArea']
  keys.forEach(key => {
    if (key === 'minArea' || key === 'maxArea') {
      filterForm[key] = null
    } else {
      filterForm[key] = ''
    }
  })
  handleSearch()
}

// 初始化
onMounted(() => {
  loadFieldTypes()
  if (props.modelValue) {
    Object.assign(filterForm, props.modelValue)
  }
})
</script>

<style scoped>
.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.area-input {
  width: 120px;
}

.area-separator {
  margin: 0 8px;
  color: #909399;
}
</style> 