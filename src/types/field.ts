import type { Feature, Polygon } from 'geojson'

// 地块类型
export interface FieldType {
  label: string
  value: string
}

// 地块状态
export enum FieldStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

// 地块信息
export interface Field {
  id: string
  name: string
  type: string
  area: number
  location: string
  status: FieldStatus
  remark?: string
  createTime: string
  updateTime: string
  creator: string
  variety?: string
  plantingDate?: string
  manager?: string
  geometry: Feature<Polygon>
}

// 地块筛选条件
export interface FieldFilter {
  name?: string
  type?: string
  status?: FieldStatus
  minArea?: number | null
  maxArea?: number | null
}

// 地块统计数据
export interface FieldStats {
  total: number
  byType: {
    water: number
    dry: number
    mountain: number
  }
  byStatus: {
    normal: number
    pending: number
    closed: number
  }
  totalArea: number
  averageArea: number
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
} 