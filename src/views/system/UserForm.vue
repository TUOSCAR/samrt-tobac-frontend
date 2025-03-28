<template>
  <div class="user-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="right"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      
      <el-form-item label="角色" prop="role">
        <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
          <el-option label="管理员" value="admin" />
          <el-option label="烟技人员" value="technician" />
          <el-option label="烟农" value="farmer" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="密码" prop="password" v-if="!isEdit">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword" v-if="!isEdit">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="'active'"
          :inactive-value="'inactive'"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{ isEdit ? '保存' : '创建' }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { createUser, updateUser, User } from '@/api/system'

const props = defineProps<{
  user: Partial<User>
  isEdit: boolean
}>()

const emit = defineEmits(['submit', 'cancel'])

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  username: '',
  role: 'farmer', // 默认角色
  password: '',
  confirmPassword: '',
  status: 'active' // 默认状态
})

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 监听用户属性变化，更新表单
watch(() => props.user, (newUser) => {
  if (newUser) {
    // 复制用户数据到表单
    form.username = newUser.username || ''
    form.role = newUser.role || 'farmer'
    form.status = newUser.status || 'active'
  }
}, { immediate: true })

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 准备提交的数据
    const userData = {
      username: form.username,
      role: form.role,
      status: form.status
    }
    
    // 如果是新建用户，添加密码字段
    if (!props.isEdit) {
      Object.assign(userData, { password: form.password })
    }
    
    // 根据编辑状态选择API
    if (props.isEdit && props.user.id) {
      await updateUser(props.user.id, userData)
      ElMessage.success('用户信息更新成功')
    } else {
      await createUser(userData)
      ElMessage.success('用户创建成功')
    }
    
    emit('submit')
  } catch (error) {
    console.error('表单验证或提交失败', error)
  }
}

// 取消操作
const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.user-form {
  margin: 10px 0;
}
</style>

<script lang="ts">
export default {
  name: 'UserForm'
}
</script> 