import request from './index'
import { ApiResponse } from '@/types/api'
import { 
  getFarmingOperationTypes, 
  getFarmingOperations, 
  getFarmingOperationDetail,
  createFarmingOperation, 
  updateFarmingOperation,
  deleteFarmingOperation,
  getFarmingCalendar
} from '@/mock/farming'

// 获取农事操作类型列表
export const getFarmingOperationTypeList = () => {
  // 直接使用模拟数据
  return Promise.resolve(getFarmingOperationTypes())
}

// 获取农事操作列表
export const getFarmingOperationList = (params: any) => {
  // 直接使用模拟数据
  return Promise.resolve(getFarmingOperations(params))
}

// 获取农事操作详情
export const getFarmingOperationById = (id: number) => {
  // 直接使用模拟数据
  return Promise.resolve(getFarmingOperationDetail(id))
}

// 创建农事操作
export const createFarmingOperationRecord = (data: any) => {
  // 直接使用模拟数据
  return Promise.resolve(createFarmingOperation(data))
}

// 更新农事操作
export const updateFarmingOperationRecord = (id: number, data: any) => {
  // 直接使用模拟数据
  return Promise.resolve(updateFarmingOperation(id, data))
}

// 删除农事操作
export const deleteFarmingOperationRecord = (id: number) => {
  // 直接使用模拟数据
  return Promise.resolve(deleteFarmingOperation(id))
}

// 获取日历格式农事操作
export const getFarmingCalendarEvents = (params: any) => {
  // 直接使用模拟数据
  return Promise.resolve(getFarmingCalendar(params))
}

// 实际项目中，上述API会改为调用后端接口，例如：
/*
// 获取农事操作类型列表
export const getFarmingOperationTypeList = () => {
  return request.get<ApiResponse>('/api/config/farming-operation-types/')
}

// 获取农事操作列表
export const getFarmingOperationList = (params: any) => {
  return request.get<ApiResponse>('/api/farming-operations/', { params })
}

// 获取农事操作详情
export const getFarmingOperationById = (id: number) => {
  return request.get<ApiResponse>(`/api/farming-operations/${id}/`)
}

// 创建农事操作
export const createFarmingOperationRecord = (data: any) => {
  return request.post<ApiResponse>('/api/farming-operations/', data)
}

// 更新农事操作
export const updateFarmingOperationRecord = (id: number, data: any) => {
  return request.put<ApiResponse>(`/api/farming-operations/${id}/`, data)
}

// 删除农事操作
export const deleteFarmingOperationRecord = (id: number) => {
  return request.delete<ApiResponse>(`/api/farming-operations/${id}/`)
}

// 获取日历格式农事操作
export const getFarmingCalendarEvents = (params: any) => {
  return request.get<ApiResponse>('/api/farming-operations/calendar/', { params })
}
*/ 