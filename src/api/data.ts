import request from '@/utils/request'

export interface DroneImage {
  id: number
  fieldId: number
  imageUrl: string
  captureTime: string
  resolution: string
  type: string
}

export interface WeatherData {
  id: number
  fieldId: number
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  timestamp: string
}

export interface PlantingParameter {
  id: number
  fieldId: number
  parameterName: string
  value: string
  unit: string
  updateTime: string
}

export const getDroneImages = (fieldId: number) => {
  return request<DroneImage[]>({
    url: `/api/data/drone-images/${fieldId}`,
    method: 'get'
  })
}

export const uploadDroneImage = (fieldId: number, data: FormData) => {
  return request<DroneImage>({
    url: `/api/data/drone-images/${fieldId}`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getWeatherData = (fieldId: number, startTime: string, endTime: string) => {
  return request<WeatherData[]>({
    url: `/api/data/weather/${fieldId}`,
    method: 'get',
    params: { startTime, endTime }
  })
}

export const getPlantingParameters = (fieldId: number) => {
  return request<PlantingParameter[]>({
    url: `/api/data/parameters/${fieldId}`,
    method: 'get'
  })
}

export const updatePlantingParameter = (fieldId: number, data: Partial<PlantingParameter>) => {
  return request<PlantingParameter>({
    url: `/api/data/parameters/${fieldId}`,
    method: 'put',
    data
  })
} 