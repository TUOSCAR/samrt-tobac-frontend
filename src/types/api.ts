/**
 * API 响应结构定义
 */
export interface ApiResponse<T = any> {
  success: boolean
  code: number
  message: string
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}

/**
 * 用户类型定义
 */
export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  role: string
  status: number
  created_at: string
  updated_at: string
}

/**
 * 地块类型定义 
 */
export interface Field {
  id: number
  field_name: string
  area: number
  location: string
  crop_variety?: string
  planting_date?: string
  expected_harvest_date?: string
  responsible_person?: number
  status: string
}

/**
 * 聊天消息类型定义
 */
export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

/**
 * 聊天会话类型定义
 */
export interface ChatSession {
  id: number
  sessionId: string
  messages: ChatMessage[]
  relatedFieldId: number | null
  relatedTaskId: number | null
  createdAt: string
  lastUpdatedAt: string
  lastMessage: string
}

/**
 * 问题模板类型定义
 */
export interface QuestionTemplate {
  id: number
  category: string
  title: string
  content: string
}

/**
 * 农事操作类型定义
 */
export interface FarmingOperation {
  id: number
  field_id: number
  operation_type: string
  operation_date: string
  operation_details: string
  operation_area: number
  materials_used?: string
  dosage?: string
  weather_condition?: string
  performed_by: number
  recorded_by: number
  recorded_at: string
  execution_task_id?: number
  cost?: number
  notes?: string
}

/**
 * 农事操作类型定义
 */
export interface FarmingOperationType {
  type_code: string
  type_name: string
  description?: string
}

/**
 * 日历事件类型定义
 */
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  field_id: number
  operation_type: string
  details: string
  color: string
} 