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

/**
 * 获取地块列表
 * @param params 查询参数
 */
export function getFields(params?: any) {
  return request({
    url: '/api/fields',
    method: 'GET',
    params
  });
}

/**
 * 获取所有地块
 */
export function getAllFields() {
  return request({
    url: '/api/fields',
    method: 'GET',
    params: {
      page: 1,
      pageSize: 100
    }
  });
}

/**
 * 获取地块详情
 * @param id 地块ID
 */
export function getFieldById(id: number) {
  return request({
    url: `/api/fields/${id}`,
    method: 'GET'
  });
}

/**
 * 获取任务相关地块
 * @param taskId 任务ID
 */
export function getFieldsByTask(taskId: string) {
  return request({
    url: `/api/monitoring-tasks/${taskId}/fields`,
    method: 'GET'
  });
}

/**
 * 创建地块
 * @param data 地块数据
 */
export function createField(data: any) {
  return request({
    url: '/api/fields',
    method: 'POST',
    data
  });
}

/**
 * 更新地块
 * @param id 地块ID
 * @param data 地块数据
 */
export function updateField(id: number, data: any) {
  return request({
    url: `/api/fields/${id}`,
    method: 'PUT',
    data
  });
}

/**
 * 删除地块
 * @param id 地块ID
 */
export function deleteField(id: number) {
  return request({
    url: `/api/fields/${id}`,
    method: 'DELETE'
  });
} 