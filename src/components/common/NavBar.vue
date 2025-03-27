<template>
  <div class="nav-bar">
    <div class="nav-left">
      <div class="logo">
        <img src="@/assets/logo.png" alt="智慧烟田" />
        <span>智慧烟田监测与决策支持系统</span>
      </div>
      <el-icon class="toggle-icon" @click="$emit('toggle-menu')">
        <el-icon-menu />
      </el-icon>
    </div>
    <div class="nav-right">
      <el-tooltip content="天气预报" placement="bottom">
        <el-button icon="el-icon-cloudy" circle></el-button>
      </el-tooltip>
      
      <el-badge :value="unreadNotifications" :max="99" class="notification-badge">
        <el-tooltip content="通知" placement="bottom">
          <el-button icon="el-icon-bell" circle @click="toggleNotificationPanel"></el-button>
        </el-tooltip>
      </el-badge>
      
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="user?.avatar || defaultAvatar"></el-avatar>
          <span>{{ user?.username || '未登录' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/default-avatar.png'
import { useNotificationStore } from '@/store/notification'

const props = defineProps({
  user: {
    type: Object,
    default: () => null
  }
})

const emits = defineEmits(['toggle-menu', 'logout'])

const router = useRouter()
const notificationStore = useNotificationStore()

// 计算未读通知数量
const unreadNotifications = computed(() => {
  return notificationStore.unreadCount
})

// 切换通知面板显示状态
const toggleNotificationPanel = () => {
  notificationStore.togglePanel()
}

// 下拉菜单操作处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      emits('logout')
      break
  }
}
</script>

<style scoped>
.nav-bar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.logo img {
  height: 36px;
  margin-right: 8px;
}

.logo span {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.toggle-icon {
  font-size: 24px;
  cursor: pointer;
  color: #606266;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 8px;
  color: #303133;
}

.notification-badge {
  margin-right: 8px;
}
</style> 