import type { User } from './user'
import type { Field } from './field'

// 监测任务状态
export enum TaskStatus {
  CREATED = 'created',
  DATA_COLLECTING = 'data_collecting',
  DATA_VALIDATING = 'data_validating',
  BASIC_ANALYZING = 'basic_analyzing',
  LLM_ANALYZING = 'llm_analyzing',
  DECISION_MAKING = 'decision_making',
  EXECUTING = 'executing',
  FEEDBACK_COLLECTING = 'feedback_collecting',
  COMPLETED = 'completed',
  PLANNING_NEXT = 'planning_next'
}

// 监测任务优先级
export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// 作物生长阶段
export enum GrowingPhase {
  TRANSPLANTING = 'transplanting', // 移栽期
  GROWING = 'growing',            // 旺长期
  TOPPING = 'topping',            // 打顶期
  HARVESTING = 'harvesting'       // 成熟采收期
}

// 任务类型
export interface TaskType {
  id: string
  code: string
  name: string
  description?: string
  requiredAnalysis: string[]
}

// 监测任务
export interface Task {
  id: string
  code: string
  name: string
  type: string
  typeObj?: TaskType
  growingPhase: GrowingPhase
  scheduledStartDate: string
  scheduledEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  status: TaskStatus
  createdBy?: User
  createdAt: string
  updatedAt: string
  description?: string
  priority: TaskPriority
  previousTaskId?: string
  fields?: Field[]
}

// 任务列表查询条件
export interface TaskFilter {
  code?: string
  name?: string
  type?: string
  status?: TaskStatus
  growingPhase?: GrowingPhase
  priority?: TaskPriority
  dateRange?: [string, string]
  createdBy?: string
}

// API返回类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页数据结构
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
} 