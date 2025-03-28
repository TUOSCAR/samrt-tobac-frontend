<template>
  <div class="planting-parameters">
    <div class="page-header">
      <h2>种植参数管理</h2>
      <el-button type="primary" @click="showAddDialog">添加参数</el-button>
    </div>

    <el-card class="filter-card">
      <div class="filter-form">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="地块">
            <el-select v-model="filterForm.fieldId" placeholder="选择地块" clearable @change="handleFilter">
              <el-option
                v-for="field in fields"
                :key="field.id"
                :label="field.field_name"
                :value="field.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参数类型">
            <el-select v-model="filterForm.paramType" placeholder="选择参数类型" clearable @change="handleFilter">
              <el-option
                v-for="item in paramTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="filteredParameters"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="fieldName" label="地块名称" width="180" />
        <el-table-column prop="parameterName" label="参数名称" width="150" />
        <el-table-column prop="value" label="参数值" width="120" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editParameter(scope.row)" plain>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteParameter(scope.row)" plain>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑参数对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑参数' : '添加参数'"
      width="500px"
    >
      <el-form :model="paramForm" label-width="100px" :rules="formRules" ref="paramFormRef">
        <el-form-item label="地块" prop="fieldId">
          <el-select v-model="paramForm.fieldId" placeholder="选择地块" :disabled="isEdit">
            <el-option
              v-for="field in fields"
              :key="field.id"
              :label="field.field_name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数名称" prop="parameterName">
          <el-select v-model="paramForm.parameterName" placeholder="选择参数名称" :disabled="isEdit">
            <el-option
              v-for="item in paramTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="paramForm.value" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="paramForm.unit" placeholder="选择单位">
            <el-option
              v-for="item in getUnitOptions(paramForm.parameterName)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="paramForm.remarks" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFields } from '@/api/field'
import { getPlantingParameters, addPlantingParameter, updatePlantingParameter, deletePlantingParameter } from '@/api/data'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const fields = ref([])
const parameters = ref([])
const paramFormRef = ref(null)

// 参数类型选项
const paramTypes = [
  { value: '土壤湿度', label: '土壤湿度' },
  { value: '土壤pH值', label: '土壤pH值' },
  { value: '单叶干重', label: '单叶干重' },
  { value: '留叶数', label: '留叶数' },
  { value: '植株密度', label: '植株密度' },
  { value: '株高', label: '株高' },
  { value: '施肥量', label: '施肥量' },
  { value: '光照强度', label: '光照强度' }
]

// 单位选项映射
const unitOptionsMap = {
  '土壤湿度': [{ value: '%', label: '%' }],
  '土壤pH值': [{ value: 'pH', label: 'pH' }],
  '单叶干重': [{ value: 'g', label: 'g' }, { value: 'kg', label: 'kg' }],
  '留叶数': [{ value: '片', label: '片' }],
  '植株密度': [{ value: '株/亩', label: '株/亩' }],
  '株高': [{ value: 'cm', label: 'cm' }, { value: 'm', label: 'm' }],
  '施肥量': [{ value: 'kg/亩', label: 'kg/亩' }],
  '光照强度': [{ value: 'lux', label: 'lux' }]
}

// 筛选表单
const filterForm = reactive({
  fieldId: '',
  paramType: ''
})

// 参数表单
const paramForm = reactive({
  id: 0,
  fieldId: '',
  parameterName: '',
  value: '',
  unit: '',
  remarks: ''
})

// 表单验证规则
const formRules = {
  fieldId: [{ required: true, message: '请选择地块', trigger: 'change' }],
  parameterName: [{ required: true, message: '请选择参数名称', trigger: 'change' }],
  value: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }]
}

// 根据筛选条件过滤参数
const filteredParameters = computed(() => {
  let result = parameters.value
  
  if (filterForm.fieldId) {
    result = result.filter(p => p.fieldId === filterForm.fieldId)
  }
  
  if (filterForm.paramType) {
    result = result.filter(p => p.parameterName === filterForm.paramType)
  }
  
  return result
})

// 获取特定参数名称对应的单位选项
const getUnitOptions = (paramName) => {
  return unitOptionsMap[paramName] || []
}

// 初始化数据
onMounted(async () => {
  await fetchFields()
  await fetchParameters()
})

// 获取地块列表
const fetchFields = async () => {
  try {
    const response = await getFields()
    fields.value = response.data
  } catch (error) {
    ElMessage.error('获取地块列表失败')
  }
}

// 获取参数列表
const fetchParameters = async () => {
  loading.value = true
  try {
    const response = await getPlantingParameters()
    // 转换数据，添加地块名称
    parameters.value = response.data.map(param => {
      const field = fields.value.find(f => f.id === param.fieldId)
      return {
        ...param,
        fieldName: field ? field.field_name : '未知地块'
      }
    })
  } catch (error) {
    ElMessage.error('获取种植参数列表失败')
  } finally {
    loading.value = false
  }
}

// 筛选处理
const handleFilter = () => {
  // 筛选由计算属性完成
}

const resetFilter = () => {
  filterForm.fieldId = ''
  filterForm.paramType = ''
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  paramForm.id = 0
  paramForm.fieldId = ''
  paramForm.parameterName = ''
  paramForm.value = ''
  paramForm.unit = ''
  paramForm.remarks = ''
  dialogVisible.value = true
}

// 显示编辑对话框
const editParameter = (row) => {
  isEdit.value = true
  paramForm.id = row.id
  paramForm.fieldId = row.fieldId
  paramForm.parameterName = row.parameterName
  paramForm.value = row.value
  paramForm.unit = row.unit
  paramForm.remarks = row.remarks || ''
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!paramFormRef.value) return
  
  paramFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      if (isEdit.value) {
        // 更新参数
        await updatePlantingParameter(paramForm.id, {
          value: paramForm.value,
          unit: paramForm.unit,
          remarks: paramForm.remarks
        })
        ElMessage.success('更新参数成功')
      } else {
        // 添加参数
        await addPlantingParameter({
          fieldId: paramForm.fieldId,
          parameterName: paramForm.parameterName,
          value: paramForm.value,
          unit: paramForm.unit,
          remarks: paramForm.remarks
        })
        ElMessage.success('添加参数成功')
      }
      
      dialogVisible.value = false
      fetchParameters() // 刷新数据
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新参数失败' : '添加参数失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除参数
const deleteParameter = (row) => {
  ElMessageBox.confirm(
    '确定要删除此参数吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deletePlantingParameter(row.id)
      ElMessage.success('删除参数成功')
      fetchParameters() // 刷新数据
    } catch (error) {
      ElMessage.error('删除参数失败')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.planting-parameters {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-card {
  margin-bottom: 16px;
}

.list-card {
  margin-bottom: 16px;
}
</style> 