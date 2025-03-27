import { defineStore } from 'pinia'
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '@/api/notification'

interface Notification {
  id: number
  title: string
  content: string
  type: string
  priority: string
  isRead: boolean
  createdAt: string
  relatedTaskId?: number
}

interface NotificationState {
  notifications: Notification[]
  isPanelVisible: boolean
  isLoading: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    isPanelVisible: false,
    isLoading: false
  }),
  
  getters: {
    unreadCount(): number {
      return this.notifications.filter(item => !item.isRead).length
    }
  },
  
  actions: {
    // 切换通知面板显示状态
    togglePanel() {
      this.isPanelVisible = !this.isPanelVisible
      if (this.isPanelVisible) {
        this.fetchNotifications()
      }
    },
    
    // 获取通知列表
    async fetchNotifications() {
      try {
        this.isLoading = true
        const response = await getNotifications()
        
        if (response.success) {
          this.notifications = response.data
        }
      } catch (error) {
        console.error('获取通知失败', error)
      } finally {
        this.isLoading = false
      }
    },
    
    // 标记通知为已读
    async markAsRead(id: number) {
      try {
        const response = await markAsRead(id)
        
        if (response.success) {
          const index = this.notifications.findIndex(item => item.id === id)
          if (index !== -1) {
            this.notifications[index].isRead = true
          }
        }
      } catch (error) {
        console.error('标记通知已读失败', error)
      }
    },
    
    // 标记所有通知为已读
    async markAllAsRead() {
      try {
        const response = await markAllAsRead()
        
        if (response.success) {
          this.notifications.forEach(item => {
            item.isRead = true
          })
        }
      } catch (error) {
        console.error('标记所有通知已读失败', error)
      }
    },
    
    // 清空所有通知
    async clearAll() {
      try {
        const response = await clearNotifications()
        
        if (response.success) {
          this.notifications = []
        }
      } catch (error) {
        console.error('清空通知失败', error)
      }
    }
  }
}) 