import request from '@/utils/request'
import { getMockHandler } from '@/mock'

// 获取通知列表
export function getNotifications(params = {}) {
  const mockHandler = getMockHandler('/api/notifications', 'GET')
  if (mockHandler) {
    return mockHandler(params)
  }
  
  return request({
    url: '/api/notifications',
    method: 'get',
    params
  })
}

// 标记通知为已读
export function markAsRead(id: number) {
  const mockHandler = getMockHandler(`/api/notifications/${id}/read`, 'PUT')
  if (mockHandler) {
    return mockHandler(id)
  }
  
  return request({
    url: `/api/notifications/${id}/read`,
    method: 'put'
  })
}

// 标记所有通知为已读
export function markAllAsRead() {
  const mockHandler = getMockHandler('/api/notifications/mark-all-read', 'PUT')
  if (mockHandler) {
    return mockHandler()
  }
  
  return request({
    url: '/api/notifications/mark-all-read',
    method: 'put'
  })
}

// 清空所有通知
export function clearNotifications() {
  const mockHandler = getMockHandler('/api/notifications', 'DELETE')
  if (mockHandler) {
    return mockHandler()
  }
  
  return request({
    url: '/api/notifications',
    method: 'delete'
  })
} 