<template>
  <div
    class="notification-panel"
    :class="{ 'notification-panel-visible': store.isPanelVisible }"
  >
    <div class="notification-header">
      <div class="notification-title">
        <span>通知中心</span>
        <el-badge :value="store.unreadCount" :max="99" class="badge" type="danger" />
      </div>
      <div class="notification-actions">
        <el-button type="text" @click="store.markAllAsRead">全部已读</el-button>
        <el-button type="text" @click="store.clearAll">清空通知</el-button>
      </div>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="任务通知" name="task">
        <div v-if="taskNotifications.length > 0" class="notification-list">
          <div
            v-for="notification in taskNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'notification-unread': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <el-icon class="notification-icon" :class="`icon-${notification.priority}`">
              <el-icon-message />
            </el-icon>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-desc">{{ notification.content }}</div>
              <div class="notification-time">{{ formatDate(notification.createdAt) }}</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无任务通知" />
      </el-tab-pane>
      
      <el-tab-pane label="系统通知" name="system">
        <div v-if="systemNotifications.length > 0" class="notification-list">
          <div
            v-for="notification in systemNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'notification-unread': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <el-icon class="notification-icon" :class="`icon-${notification.priority}`">
              <el-icon-bell />
            </el-icon>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-desc">{{ notification.content }}</div>
              <div class="notification-time">{{ formatDate(notification.createdAt) }}</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无系统通知" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/store/notification'
import { formatDate } from '@/utils/date'

const store = useNotificationStore()
const activeTab = ref('task')

// 按类型筛选任务通知
const taskNotifications = computed(() => {
  return store.notifications.filter(item => item.type === 'task')
})

// 按类型筛选系统通知
const systemNotifications = computed(() => {
  return store.notifications.filter(item => item.type === 'system')
})

// 处理通知点击事件
const handleNotificationClick = (notification: any) => {
  store.markAsRead(notification.id)
  
  // 如果有关联任务，跳转到对应任务页面
  if (notification.relatedTaskId) {
    // router.push()跳转逻辑
  }
}
</script>

<style scoped>
.notification-panel {
  position: fixed;
  top: 60px;
  right: 0;
  width: 360px;
  height: calc(100vh - 60px);
  background-color: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  transform: translateX(100%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.notification-panel-visible {
  transform: translateX(0);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.notification-title {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.badge {
  margin-left: 8px;
}

.notification-list {
  overflow-y: auto;
  padding: 8px 0;
}

.notification-item {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-unread {
  background-color: #f0f9ff;
}

.notification-icon {
  font-size: 20px;
  margin-right: 12px;
  color: #909399;
}

.icon-high {
  color: #f56c6c;
}

.icon-medium {
  color: #e6a23c;
}

.icon-low {
  color: #409eff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.notification-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 4px;
}

.notification-time {
  color: #909399;
  font-size: 12px;
}
</style> 