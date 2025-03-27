<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>您访问的页面可能已被删除、移动或暂时不可用</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const goHome = () => {
  // 根据用户角色跳转到相应首页
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  switch (userStore.user?.role) {
    case 'admin':
      router.push('/dashboard')
      break
    case 'technician':
      router.push('/workbench')
      break
    case 'farmer':
      router.push('/my-fields')
      break
    default:
      router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.content {
  text-align: center;
  padding: 40px;
}

h1 {
  font-size: 120px;
  margin: 0;
  color: #409eff;
}

h2 {
  font-size: 30px;
  margin: 10px 0;
  color: #303133;
}

p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}
</style> 