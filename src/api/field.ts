import request from '@/utils/request'
import type { Field, FieldFilter, FieldStats, FieldType, ApiResponse, PaginatedResponse } from '@/types/field'
import { getMockHandler } from '@/mock'

// 获取地块列表
export function getFieldList(params: FieldFilter & { page: number; pageSize: number }) {
  const mockHandler = getMockHandler('/api/fields', 'GET')
  if (mockHandler) {
    return mockHandler({ query: params })
  }
  
  return request<ApiResponse<PaginatedResponse<Field>>>({
    url: '/api/fields',
    method: 'get',
    params
  })
}

// 获取地块详情
export function getFieldDetail(id: string) {
  const mockHandler = getMockHandler(`/api/fields/${id}`, 'GET')
  if (mockHandler) {
    return mockHandler({ params: { id } })
  }
  
  return request<ApiResponse<Field>>({
    url: `/api/fields/${id}`,
    method: 'get'
  })
}

// 新增地块
export function addField(data: Omit<Field, 'id' | 'createTime' | 'updateTime' | 'creator'>) {
  const mockHandler = getMockHandler('/api/fields', 'POST')
  if (mockHandler) {
    return mockHandler({ body: data })
  }
  
  return request<ApiResponse<Field>>({
    url: '/api/fields',
    method: 'post',
    data
  })
}

// 更新地块
export function updateField(id: string, data: Partial<Omit<Field, 'id' | 'createTime' | 'updateTime' | 'creator'>>) {
  const mockHandler = getMockHandler(`/api/fields/${id}`, 'PUT')
  if (mockHandler) {
    return mockHandler({ params: { id }, body: data })
  }
  
  return request<ApiResponse<Field>>({
    url: `/api/fields/${id}`,
    method: 'put',
    data
  })
}

// 删除地块
export function deleteField(id: string) {
  const mockHandler = getMockHandler(`/api/fields/${id}`, 'DELETE')
  if (mockHandler) {
    return mockHandler({ params: { id } })
  }
  
  return request<ApiResponse<null>>({
    url: `/api/fields/${id}`,
    method: 'delete'
  })
}

// 获取地块统计数据
export function getFieldStats() {
  const mockHandler = getMockHandler('/api/fields/stats', 'GET')
  if (mockHandler) {
    return mockHandler({})
  }
  
  return request<ApiResponse<FieldStats>>({
    url: '/api/fields/stats',
    method: 'get'
  })
}

// 获取地块类型列表
export function getFieldTypes() {
  const mockHandler = getMockHandler('/api/fields/types', 'GET')
  if (mockHandler) {
    return mockHandler({})
  }
  
  return request<ApiResponse<FieldType[]>>({
    url: '/api/fields/types',
    method: 'get'
  })
}

// 获取监测任务关联的地块
export function getFieldsByTask(taskId: string) {
  const mockHandler = getMockHandler(`/api/monitoring-tasks/${taskId}/fields`, 'GET')
  if (mockHandler) {
    return mockHandler({ params: { taskId } })
  }
  
  return request<ApiResponse<Field[]>>({
    url: '/api/monitoring-tasks/' + taskId + '/fields',
    method: 'get'
  })
} 