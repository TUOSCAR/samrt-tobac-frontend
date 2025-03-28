import request from '@/utils/request'
import type { Task, TaskFilter, TaskType, ApiResponse, PaginatedResponse } from '@/types/task'
import { getMockHandler } from '@/mock'

// 获取任务列表
export function getTaskList(params: TaskFilter & { page: number; pageSize: number }) {
  const mockHandler = getMockHandler('/api/monitoring-tasks', 'GET')
  if (mockHandler) {
    return mockHandler({ query: params })
  }
  
  return request<PaginatedResponse<Task>>({
    url: '/api/monitoring-tasks',
    method: 'get',
    params
  })
}

// 获取任务详情
export function getTaskDetail(id: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${id}`, 'GET')
  if (mockHandler) {
    return mockHandler({ params: { id } })
  }
  
  return request<Task>({
    url: `/api/monitoring-tasks/${id}`,
    method: 'get'
  })
}

// 创建任务
export function createTask(data: Partial<Task>) {
  const mockHandler = getMockHandler('/api/monitoring-tasks', 'POST')
  if (mockHandler) {
    return mockHandler({ body: data })
  }
  
  return request<Task>({
    url: '/api/monitoring-tasks',
    method: 'post',
    data
  })
}

// 更新任务
export function updateTask(id: string, data: Partial<Task>) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${id}`, 'PUT')
  if (mockHandler) {
    return mockHandler({ params: { id }, body: data })
  }
  
  return request<Task>({
    url: `/api/monitoring-tasks/${id}`,
    method: 'put',
    data
  })
}

// 删除任务
export function deleteTask(id: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${id}`, 'DELETE')
  if (mockHandler) {
    return mockHandler({ params: { id } })
  }
  
  return request<null>({
    url: `/api/monitoring-tasks/${id}`,
    method: 'delete'
  })
}

// 获取任务类型列表
export function getTaskTypes() {
  const mockHandler = getMockHandler('/api/config/monitoring-task-types', 'GET')
  if (mockHandler) {
    return mockHandler({})
  }
  
  return request<TaskType[]>({
    url: '/api/config/monitoring-task-types',
    method: 'get'
  })
}

// 获取任务日历数据
export function getTaskCalendar(params: { start?: string; end?: string }) {
  const mockHandler = getMockHandler('/api/monitoring-tasks/calendar', 'GET')
  if (mockHandler) {
    return mockHandler({ query: params })
  }
  
  return request<Task[]>({
    url: '/api/monitoring-tasks/calendar',
    method: 'get',
    params
  })
}

// 更新任务状态
export function updateTaskStatus(id: string, status: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${id}/status`, 'PUT')
  if (mockHandler) {
    return mockHandler({ params: { id }, body: { status } })
  }
  
  return request<Task>({
    url: `/api/monitoring-tasks/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 获取任务相关地块
export function getTaskFields(id: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${id}/fields`, 'GET')
  if (mockHandler) {
    return mockHandler({ params: { id } })
  }
  
  return request<any[]>({
    url: `/api/monitoring-tasks/${id}/fields`,
    method: 'get'
  })
}

// 添加地块到任务
export function addFieldToTask(taskId: string, fieldId: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${taskId}/fields`, 'POST')
  if (mockHandler) {
    return mockHandler({ params: { taskId }, body: { fieldId } })
  }
  
  return request<any>({
    url: `/api/monitoring-tasks/${taskId}/fields`,
    method: 'post',
    data: { fieldId }
  })
}

// 从任务移除地块
export function removeFieldFromTask(taskId: string, fieldId: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${taskId}/fields/${fieldId}`, 'DELETE')
  if (mockHandler) {
    return mockHandler({ params: { taskId, fieldId } })
  }
  
  return request<null>({
    url: `/api/monitoring-tasks/${taskId}/fields/${fieldId}`,
    method: 'delete'
  })
} 