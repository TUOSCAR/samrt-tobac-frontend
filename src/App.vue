<template>
  <div class="app-container">
    <el-config-provider :locale="locale">
      <router-view v-if="!loading" />
      <div v-else class="loading-container">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span class="loading-text">加载中...</span>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = zhCn
const loading = ref(true)
const userStore = useUserStore()

// 恢复用户会话
async function restoreUserSession() {
  try {
    if (userStore.token && !userStore.user) {
      console.log('正在恢复用户会话...')
      const result = await userStore.getUserInfo()
      if (result && !result.success) {
        ElMessage.warning('会话已过期，请重新登录')
      } else if (result && result.success) {
        console.log('用户会话恢复成功')
      }
    }
  } catch (error) {
    console.error('恢复会话出错', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  restoreUserSession()
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  height: 100%;
}

.app-container {
  height: 100%;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-icon {
  font-size: 48px;
  color: #409eff;
  animation: rotating 2s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 18px;
  color: #606266;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 