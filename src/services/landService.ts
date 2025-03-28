import axios from 'axios'

// 类型定义
export interface Land {
  id: string
  name: string
  area: number
  crop: string
  status: 'idle' | 'planting' | 'harvesting'
  coordinates?: [number, number][]
  created_at: string
  updated_at: string
}

export interface CreateLandDto {
  name: string
  area: number
  crop: string
  status: Land['status']
  coordinates?: [number, number][]
}

export interface UpdateLandDto extends CreateLandDto {
  id: string
}

export interface LandStats {
  totalArea: number
  plantingArea: number
  idleArea: number
  harvestingArea: number
  cropDistribution: Record<string, number>
}

// Mock数据（用于开发测试）
const mockLands: Land[] = [
  {
    id: '1',
    name: '东山1号烟田',
    area: 8.5,
    crop: 'tobacco',
    status: 'planting',
    coordinates: [
      [24.8, 102.8],
      [24.81, 102.8],
      [24.81, 102.81],
      [24.8, 102.81],
      [24.8, 102.8]
    ],
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-03-10T10:30:00Z'
  },
  {
    id: '2',
    name: '西峰2号烟田',
    area: 6.2,
    crop: 'tobacco',
    status: 'idle',
    coordinates: [
      [24.82, 102.82],
      [24.83, 102.82],
      [24.83, 102.83],
      [24.82, 102.83],
      [24.82, 102.82]
    ],
    created_at: '2023-02-05T09:15:00Z',
    updated_at: '2023-03-12T14:20:00Z'
  }
]

const mockStats: LandStats = {
  totalArea: 14.7,
  plantingArea: 8.5,
  idleArea: 6.2,
  harvestingArea: 0,
  cropDistribution: {
    tobacco: 14.7
  }
}

// API服务
const API_BASE_URL = '/api/lands'

const isDevelopment = import.meta.env.DEV

export const getLands = async (): Promise<Land[]> => {
  if (isDevelopment) {
    return mockLands
  }
  const response = await axios.get(API_BASE_URL)
  return response.data
}

export const getLand = async (id: string): Promise<Land> => {
  if (isDevelopment) {
    const land = mockLands.find(l => l.id === id)
    if (!land) throw new Error('Land not found')
    return land
  }
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

export const createLand = async (data: CreateLandDto): Promise<Land> => {
  if (isDevelopment) {
    const newLand: Land = {
      ...data,
      id: String(mockLands.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockLands.push(newLand)
    return newLand
  }
  const response = await axios.post(API_BASE_URL, data)
  return response.data
}

export const updateLand = async (data: UpdateLandDto): Promise<Land> => {
  if (isDevelopment) {
    const index = mockLands.findIndex(l => l.id === data.id)
    if (index === -1) throw new Error('Land not found')
    
    const updatedLand: Land = {
      ...mockLands[index],
      ...data,
      updated_at: new Date().toISOString()
    }
    mockLands[index] = updatedLand
    return updatedLand
  }
  const response = await axios.put(`${API_BASE_URL}/${data.id}`, data)
  return response.data
}

export const deleteLand = async (id: string): Promise<void> => {
  if (isDevelopment) {
    const index = mockLands.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Land not found')
    mockLands.splice(index, 1)
    return
  }
  await axios.delete(`${API_BASE_URL}/${id}`)
}

export const getLandStats = async (): Promise<LandStats> => {
  if (isDevelopment) {
    return mockStats
  }
  const response = await axios.get(`${API_BASE_URL}/stats`)
  return response.data
} 