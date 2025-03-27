import request from '@/utils/request'
import type { Field, FieldFilter, FieldStats, FieldType, ApiResponse, PaginatedResponse } from '@/types/field'

// 获取地块列表
export function getFieldList(params: FieldFilter & { page: number; pageSize: number }) {
  return request<ApiResponse<PaginatedResponse<Field>>>({
    url: '/api/fields',
    method: 'get',
    params
  })
}

// 获取地块详情
export function getFieldDetail(id: string) {
  return request<ApiResponse<Field>>({
    url: `/api/fields/${id}`,
    method: 'get'
  })
}

// 新增地块
export function addField(data: Omit<Field, 'id' | 'createTime' | 'updateTime' | 'creator'>) {
  return request<ApiResponse<Field>>({
    url: '/api/fields',
    method: 'post',
    data
  })
}

// 更新地块
export function updateField(id: string, data: Partial<Omit<Field, 'id' | 'createTime' | 'updateTime' | 'creator'>>) {
  return request<ApiResponse<Field>>({
    url: `/api/fields/${id}`,
    method: 'put',
    data
  })
}

// 删除地块
export function deleteField(id: string) {
  return request<ApiResponse<null>>({
    url: `/api/fields/${id}`,
    method: 'delete'
  })
}

// 获取地块统计数据
export function getFieldStats() {
  return request<ApiResponse<FieldStats>>({
    url: '/api/fields/stats',
    method: 'get'
  })
}

// 获取地块类型列表
export function getFieldTypes() {
  return request<ApiResponse<FieldType[]>>({
    url: '/api/fields/types',
    method: 'get'
  })
}

// 获取监测任务关联的地块
export function getFieldsByTask(taskId: string) {
  return request<ApiResponse<Field[]>>({
    url: '/api/monitoring-tasks/' + taskId + '/fields',
    method: 'get'
  })
} 