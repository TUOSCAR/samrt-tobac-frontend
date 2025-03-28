import { notifications } from './data'
import { useUserStore } from '@/store/user'

// 获取通知列表
export function getNotifications(params = {}) {
  let result = [...notifications]
  
  // 根据当前用户过滤
  try {
    const userStore = useUserStore()
    if (userStore.user && userStore.user.id) {
      result = result.filter(n => n.user_id === userStore.user.id)
    }
  } catch (error) {
    // 如果在非组件上下文调用可能会失败，忽略错误
  }
  
  // 模拟分页
  const page = params.page || 1
  const page_size = params.page_size || 10
  const start = (page - 1) * page_size
  const end = start + page_size
  const paginatedResult = result.slice(start, end)
  
  return {
    success: true,
    code: 200,
    message: '获取通知列表成功',
    data: paginatedResult,
    meta: {
      page,
      page_size,
      total: result.length
    }
  }
}

// 标记通知为已读
export function markAsRead(id) {
  const notification = notifications.find(n => n.id === parseInt(id))
  
  if (!notification) {
    return {
      success: false,
      code: 404,
      message: '通知不存在',
      data: null
    }
  }
  
  notification.isRead = true
  
  return {
    success: true,
    code: 200,
    message: '标记通知为已读成功',
    data: notification
  }
}

// 标记所有通知为已读
export function markAllAsRead() {
  let userNotifications = [...notifications]
  
  // 根据当前用户过滤
  try {
    const userStore = useUserStore()
    if (userStore.user && userStore.user.id) {
      userNotifications = userNotifications.filter(n => n.user_id === userStore.user.id)
    }
  } catch (error) {
    // 如果在非组件上下文调用可能会失败，忽略错误
  }
  
  // 标记已读
  userNotifications.forEach(n => {
    n.isRead = true
  })
  
  return {
    success: true,
    code: 200,
    message: '标记所有通知为已读成功',
    data: null
  }
}

// 清空所有通知
export function clearNotifications() {
  try {
    const userStore = useUserStore()
    if (userStore.user && userStore.user.id) {
      const userIndex = notifications.findIndex(n => n.user_id === userStore.user.id)
      if (userIndex !== -1) {
        notifications.splice(userIndex, 1)
      }
    }
  } catch (error) {
    // 如果在非组件上下文调用可能会失败，忽略错误
  }
  
  return {
    success: true,
    code: 200,
    message: '清空通知成功',
    data: null
  }
} 