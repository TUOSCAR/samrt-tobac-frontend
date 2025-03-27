<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="100px"
    class="field-form"
  >
    <el-form-item label="地块名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入地块名称" />
    </el-form-item>
    
    <el-form-item label="地块类型" prop="type">
      <el-select v-model="form.type" placeholder="请选择地块类型">
        <el-option
          v-for="item in fieldTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="面积(亩)" prop="area">
      <el-input-number v-model="form.area" :min="0" :precision="2" />
    </el-form-item>
    
    <el-form-item label="位置" prop="location">
      <el-input v-model="form.location" placeholder="请输入地块位置" />
    </el-form-item>
    
    <el-form-item label="状态" prop="status">
      <el-select v-model="form.status" placeholder="请选择状态">
        <el-option label="正常" value="normal" />
        <el-option label="待处理" value="pending" />
        <el-option label="已关闭" value="closed" />
      </el-select>
    </el-form-item>
    
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="form.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注信息"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addField, updateField, getFieldTypes } from '@/api/field'
import type { Field, FieldType } from '@/types/field'

const props = defineProps<{
  fieldData?: Field
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const formRef = ref<FormInstance>()

// 地块类型选项
const fieldTypes = ref<FieldType[]>([
  { label: '水田', value: 'water' },
  { label: '旱地', value: 'dry' },
  { label: '山地', value: 'mountain' }
])

// 表单数据
const form = reactive<Omit<Field, 'id' | 'createTime' | 'updateTime' | 'creator'>>({
  name: '',
  type: '',
  area: 0,
  location: '',
  status: 'normal',
  remark: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入地块名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择地块类型', trigger: 'change' }],
  area: [{ required: true, message: '请输入地块面积', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地块位置', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 获取地块类型列表
const loadFieldTypes = async () => {
  try {
    const { data } = await getFieldTypes()
    if (data.success) {
      fieldTypes.value = data.data
    }
  } catch (error) {
    console.error('获取地块类型失败:', error)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (props.fieldData?.id) {
          await updateField(props.fieldData.id, form)
          ElMessage.success('更新成功')
        } else {
          await addField(form)
          ElMessage.success('新增成功')
        }
        emit('submit')
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

// 初始化表单数据
onMounted(() => {
  loadFieldTypes()
  if (props.fieldData) {
    Object.assign(form, props.fieldData)
  }
})
</script>

<style scoped>
.field-form {
  padding: 20px;
}
</style> 