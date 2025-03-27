<template>
  <div class="reset-password-container">
    <el-card class="reset-password-card">
      <template #header>
        <div class="card-header">
          <h2>智慧烟田系统 - 重置密码</h2>
        </div>
      </template>
      <el-steps :active="activeStep" finish-status="success" simple>
        <el-step title="身份验证" />
        <el-step title="设置新密码" />
        <el-step title="完成" />
      </el-steps>

      <!-- 第一步：身份验证 -->
      <div v-if="activeStep === 0">
        <el-form
          ref="verifyFormRef"
          :model="verifyForm"
          :rules="verifyRules"
          label-position="top"
          status-icon
          @submit.prevent="handleVerify"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="verifyForm.username"
              prefix-icon="User"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="verifyForm.email"
              prefix-icon="Message"
              placeholder="请输入注册时使用的邮箱"
              type="email"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <div class="verification-code-container">
              <el-input
                v-model="verifyForm.verificationCode"
                placeholder="请输入验证码"
              />
              <el-button
                type="primary"
                :disabled="countdown > 0"
                @click="sendVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="button-group">
              <el-button @click="goToLogin">返回登录</el-button>
              <el-button type="primary" native-type="submit" :loading="loading">下一步</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第二步：设置新密码 -->
      <div v-if="activeStep === 1">
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
          status-icon
          @submit.prevent="handleResetPassword"
        >
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="passwordForm.password"
              prefix-icon="Lock"
              placeholder="请输入新密码"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              prefix-icon="Lock"
              placeholder="请再次输入新密码"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <div class="button-group">
              <el-button @click="activeStep = 0">上一步</el-button>
              <el-button type="primary" native-type="submit" :loading="loading">确认重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- 第三步：完成 -->
      <div v-if="activeStep === 2" class="success-container">
        <el-result
          icon="success"
          title="密码重置成功"
          sub-title="您的密码已经重置成功，请使用新密码登录系统"
        >
          <template #extra>
            <el-button type="primary" @click="goToLogin">返回登录</el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { sendVerificationCode as apiSendCode, verifyResetCode, resetPassword } from '@/api/auth'

const router = useRouter()
const verifyFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const loading = ref(false)
const activeStep = ref(0)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 验证表单数据
const verifyForm = reactive({
  username: '',
  email: '',
  verificationCode: ''
})

// 密码表单数据
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

// 验证表单规则
const verifyRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为6位数字', trigger: 'blur' }
  ]
})

// 密码表单验证规则
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})

// 发送验证码
const sendVerificationCode = async () => {
  if (!verifyForm.username || !verifyForm.email) {
    ElMessage.warning('请先填写用户名和邮箱')
    return
  }
  
  try {
    loading.value = true
    const response = await apiSendCode({
      username: verifyForm.username,
      email: verifyForm.email
    })
    
    if (response.success) {
      ElMessage.success('验证码已发送，请查收邮件')
      // 开始倒计时
      countdown.value = 60
      countdownTimer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          if (countdownTimer) {
            clearInterval(countdownTimer)
            countdownTimer = null
          }
        }
      }, 1000)
    } else {
      ElMessage.error(response.message || '发送验证码失败，请重试')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '发送验证码失败，请重试')
  } finally {
    loading.value = false
  }
}

// 验证身份
const handleVerify = async () => {
  if (!verifyFormRef.value) return
  await verifyFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const response = await verifyResetCode({
          username: verifyForm.username,
          email: verifyForm.email,
          code: verifyForm.verificationCode
        })
        
        if (response.success) {
          ElMessage.success('验证成功')
          activeStep.value = 1 // 进入下一步
        } else {
          ElMessage.error(response.message || '验证失败，请检查信息是否正确')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '验证失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 重置密码
const handleResetPassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const response = await resetPassword({
          username: verifyForm.username,
          code: verifyForm.verificationCode,
          password: passwordForm.password
        })
        
        if (response.success) {
          ElMessage.success('密码重置成功')
          activeStep.value = 2 // 完成
        } else {
          ElMessage.error(response.message || '密码重置失败，请重试')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '密码重置失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 返回登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.reset-password-card {
  width: 500px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.verification-code-container {
  display: flex;
  gap: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.success-container {
  margin: 20px 0;
}

:deep(.el-steps) {
  margin-bottom: 30px;
}
</style> 