<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="system-title">智慧烟田监测与决策支持系统</h1>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-item">
          <label for="username">用户名</label>
          <input 
            id="username"
            v-model="loginForm.username" 
            type="text" 
            placeholder="请输入用户名"
            autocomplete="off"
          />
        </div>
        
        <div class="form-item">
          <label for="password">密码</label>
          <input 
            id="password"
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            autocomplete="off"
          />
        </div>
        
        <div class="remember-forgot">
          <label>
            <input type="checkbox" v-model="loginForm.remember" /> 记住我
          </label>
          <button type="button" @click="forgotPassword">忘记密码？</button>
        </div>
        
        <div class="login-actions">
          <button 
            type="submit" 
            class="login-button" 
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
      
      <div class="login-footer">
        <p>推荐使用Chrome、Edge浏览器访问本系统</p>
        <p>&copy; {{ currentYear }} 智慧烟田监测与决策支持系统</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 路由
const router = useRouter()
const route = useRoute()

// 状态管理
const userStore = useUserStore()

// 加载状态
const loading = ref(false)

// 计算当前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})

// 处理登录
const handleLogin = async () => {
  console.log('登录表单:', loginForm)
  loading.value = true
  
  try {
    // 硬编码验证（临时解决方案）
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      ElMessage.success('登录成功')
      
      // 手动设置用户状态
      userStore.setToken('mock-jwt-token-1')
      userStore.user = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      }
      
      // 跳转到管理员仪表盘
      router.push('/dashboard').catch(err => {
        console.error('路由跳转失败:', err)
      })
    } else if (loginForm.username === 'technician' && loginForm.password === 'tech123') {
      ElMessage.success('登录成功')
      
      // 手动设置用户状态
      userStore.setToken('mock-jwt-token-2')
      userStore.user = {
        id: 2,
        username: 'technician',
        email: 'tech@example.com',
        role: 'technician'
      }
      
      // 跳转到烟技人员工作台
      router.push('/workbench').catch(err => {
        console.error('路由跳转失败:', err)
      })
    } else if (loginForm.username === 'farmer' && loginForm.password === 'farmer123') {
      ElMessage.success('登录成功')
      
      // 手动设置用户状态
      userStore.setToken('mock-jwt-token-3')
      userStore.user = {
        id: 3,
        username: 'farmer',
        email: 'farmer@example.com',
        role: 'farmer'
      }
      
      // 跳转到烟农仪表盘
      router.push('/my-fields').catch(err => {
        console.error('路由跳转失败:', err)
      })
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录出错，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 忘记密码
const forgotPassword = () => {
  ElMessage.info('请联系系统管理员重置密码')
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-container {
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
  background-color: #fff;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.system-title {
  font-size: 22px;
  color: #303133;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #606266;
}

.form-item input {
  width: 100%;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-item input:focus {
  outline: none;
  border-color: #409eff;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-forgot button {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
}

.login-actions {
  margin-top: 30px;
}

.login-button {
  width: 100%;
  height: 44px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #66b1ff;
}

.login-button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  color: #909399;
  font-size: 14px;
  margin-top: 20px;
}

.login-footer p {
  margin: 5px 0;
}
</style> 