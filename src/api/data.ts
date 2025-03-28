import request from '@/utils/request'

// 无人机影像数据相关API
export interface DroneImage {
  id: number
  fieldId: number
  imageUrl: string
  captureTime: string
  resolution: string
  type: string
  fileSize?: string
}

export interface DroneImageQuery {
  page?: number
  pageSize?: number
  fieldId?: number
  type?: string
  startDate?: string
  endDate?: string
}

// 获取无人机影像列表
export function getDroneImages(params?: DroneImageQuery) {
  return request({
    url: '/api/data/drone-images',
    method: 'get',
    params
  })
}

// 获取指定地块的无人机影像
export function getFieldDroneImages(fieldId: number) {
  return request({
    url: `/api/data/drone-images/${fieldId}`,
    method: 'get'
  })
}

// 上传无人机影像
export function uploadDroneImage(data: any) {
  return request({
    url: `/api/data/drone-images/${data.fieldId}`,
    method: 'post',
    data
  })
}

// 删除无人机影像
export function deleteDroneImage(id: number) {
  return request({
    url: `/api/data/drone-images/${id}`,
    method: 'delete'
  })
}

// 气象数据相关API
export interface WeatherData {
  id: number
  fieldId: number
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  windDirection?: string
  timestamp: string
  pressure?: number
  visibility?: number
  dataSource?: string
}

export interface WeatherDataQuery {
  page?: number
  pageSize?: number
  fieldId?: number
  startTime?: string
  endTime?: string
}

// 获取气象数据列表
export function getWeatherData(params?: WeatherDataQuery) {
  return request({
    url: '/api/data/weather',
    method: 'get',
    params
  })
}

// 获取指定地块的气象数据
export function getFieldWeatherData(fieldId: number, params?: { startTime?: string, endTime?: string }) {
  return request({
    url: `/api/data/weather/${fieldId}`,
    method: 'get',
    params
  })
}

// 获取最新气象数据
export function fetchLatestWeatherData(fieldId: number) {
  return request({
    url: `/api/data/weather/${fieldId}/latest`,
    method: 'get'
  })
}

// 种植参数相关API
export interface PlantingParameter {
  id: number
  fieldId: number
  parameterName: string
  value: string
  unit: string
  updateTime: string
  remarks?: string
}

// 获取种植参数列表
export function getPlantingParameters(fieldId?: number) {
  const params = fieldId ? { fieldId } : {}
  return request({
    url: '/api/data/parameters',
    method: 'get',
    params
  })
}

// 获取指定地块的种植参数
export function getFieldPlantingParameters(fieldId: number) {
  return request({
    url: `/api/data/parameters/${fieldId}`,
    method: 'get'
  })
}

// 添加种植参数
export function addPlantingParameter(data: Omit<PlantingParameter, 'id' | 'updateTime'>) {
  return request({
    url: `/api/data/parameters/${data.fieldId}`,
    method: 'post',
    data
  })
}

// 更新种植参数
export function updatePlantingParameter(id: number, data: Partial<PlantingParameter>) {
  return request({
    url: `/api/data/parameters/${id}`,
    method: 'put',
    data
  })
}

// 删除种植参数
export function deletePlantingParameter(id: number) {
  return request({
    url: `/api/data/parameters/${id}`,
    method: 'delete'
  })
} 