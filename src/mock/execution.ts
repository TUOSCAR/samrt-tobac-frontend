import { generateRandomId } from '@/utils/helper'
import { 
  ExecutionTask, 
  ExecutionFeedback, 
  ExecutionTaskParams,
  FeedbackReviewData,
  TaskStatusUpdateData,
  ExecutionTaskType,
  ExecutionTaskStatus,
  Priority,
  FeedbackReviewStatus,
  UserAssignmentData,
  User
} from '@/types/execution'

// 执行任务的状态枚举
export const EXECUTION_STATUS = {
  CREATED: 'created' as ExecutionTaskStatus,
  ASSIGNED: 'assigned' as ExecutionTaskStatus,
  NOTIFIED: 'notified' as ExecutionTaskStatus,
  IN_PROGRESS: 'in_progress' as ExecutionTaskStatus,
  FEEDBACK_SUBMITTED: 'feedback_submitted' as ExecutionTaskStatus,
  FEEDBACK_VALIDATED: 'feedback_validated' as ExecutionTaskStatus,
  VERIFIED: 'verified' as ExecutionTaskStatus,
  COMPLETED: 'completed' as ExecutionTaskStatus
}

// 执行任务的优先级枚举
export const PRIORITY = {
  HIGH: 'high' as Priority,
  MEDIUM: 'medium' as Priority,
  LOW: 'low' as Priority
}

// 执行任务类型枚举
export const EXECUTION_TYPES = {
  FERTILIZATION: 'fertilization' as ExecutionTaskType, // 施肥
  PEST_CONTROL: 'pest_control' as ExecutionTaskType, // 病虫害防治
  IRRIGATION: 'irrigation' as ExecutionTaskType, // 灌溉
  TOPPING: 'topping' as ExecutionTaskType, // 打顶
  WEEDING: 'weeding' as ExecutionTaskType, // 除草
  HARVESTING: 'harvesting' as ExecutionTaskType // 采收
}

// 反馈审核状态枚举
export const FEEDBACK_REVIEW_STATUS = {
  PENDING: 'pending' as FeedbackReviewStatus,
  APPROVED: 'approved' as FeedbackReviewStatus,
  REJECTED: 'rejected' as FeedbackReviewStatus
}

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    phone: '13800000000',
    role: 'admin',
    created_at: '2023-04-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'tech1',
    name: '张技术员',
    email: 'tech1@example.com',
    phone: '13811111111',
    role: 'technician',
    created_at: '2023-04-02T00:00:00Z'
  },
  {
    id: 3,
    username: 'farmer1',
    name: '李烟农',
    email: 'farmer1@example.com',
    phone: '13822222222',
    role: 'farmer',
    created_at: '2023-04-03T00:00:00Z'
  },
  {
    id: 4,
    username: 'farmer2',
    name: '王烟农',
    email: 'farmer2@example.com',
    phone: '13833333333',
    role: 'farmer',
    created_at: '2023-04-04T00:00:00Z'
  },
  {
    id: 5,
    username: 'farmer3',
    name: '赵烟农',
    email: 'farmer3@example.com',
    phone: '13844444444',
    role: 'farmer',
    created_at: '2023-04-05T00:00:00Z'
  },
  {
    id: 6,
    username: 'tech2',
    name: '刘技术员',
    email: 'tech2@example.com',
    phone: '13855555555',
    role: 'technician',
    created_at: '2023-04-06T00:00:00Z'
  }
]

// 模拟执行任务数据
export const executionTasks: ExecutionTask[] = [
  {
    id: 1,
    task_code: 'ET2023001',
    recommendation_id: 1,
    field_id: 1,
    task_type: EXECUTION_TYPES.FERTILIZATION,
    task_content: '对东山1号烟田进行氮磷钾复合肥施用，每亩用量15kg',
    assigned_to: 3,
    assigned_by: 2,
    assigned_at: '2023-04-10T09:00:00Z',
    due_date: '2023-04-15T18:00:00Z',
    priority: PRIORITY.HIGH,
    status: EXECUTION_STATUS.COMPLETED,
    completion_percentage: 100,
    notification_sent: true
  },
  {
    id: 2,
    task_code: 'ET2023002',
    recommendation_id: 2,
    field_id: 2,
    task_type: EXECUTION_TYPES.PEST_CONTROL,
    task_content: '对西峰2号烟田进行蓟马防治，使用指定药剂按说明稀释后喷洒',
    assigned_to: 4,
    assigned_by: 2,
    assigned_at: '2023-04-12T10:30:00Z',
    due_date: '2023-04-18T18:00:00Z',
    priority: PRIORITY.HIGH,
    status: EXECUTION_STATUS.FEEDBACK_SUBMITTED,
    completion_percentage: 100,
    notification_sent: true
  },
  {
    id: 3,
    task_code: 'ET2023003',
    recommendation_id: 3,
    field_id: 1,
    task_type: EXECUTION_TYPES.IRRIGATION,
    task_content: '对东山1号烟田进行灌溉，每亩用水20m³',
    assigned_to: 3,
    assigned_by: 6,
    assigned_at: '2023-04-15T08:45:00Z',
    due_date: '2023-04-16T18:00:00Z',
    priority: PRIORITY.MEDIUM,
    status: EXECUTION_STATUS.IN_PROGRESS,
    completion_percentage: 50,
    notification_sent: true
  },
  {
    id: 4,
    task_code: 'ET2023004',
    recommendation_id: 4,
    field_id: 3,
    task_type: EXECUTION_TYPES.WEEDING,
    task_content: '对北畈3号烟田进行人工除草，重点清除田埂和行间杂草',
    assigned_to: 5,
    assigned_by: 6,
    assigned_at: '2023-04-20T14:00:00Z',
    due_date: '2023-04-25T18:00:00Z',
    priority: PRIORITY.LOW,
    status: EXECUTION_STATUS.ASSIGNED,
    completion_percentage: 0,
    notification_sent: true
  },
  {
    id: 5,
    task_code: 'ET2023005',
    recommendation_id: 5,
    field_id: 2,
    task_type: EXECUTION_TYPES.TOPPING,
    task_content: '对西峰2号烟田的烟草进行打顶，按照技术员指导的高度进行',
    assigned_to: 4,
    assigned_by: 2,
    assigned_at: '2023-05-05T09:30:00Z',
    due_date: '2023-05-10T18:00:00Z',
    priority: PRIORITY.MEDIUM,
    status: EXECUTION_STATUS.NOTIFIED,
    completion_percentage: 0,
    notification_sent: true
  },
  {
    id: 6,
    task_code: 'ET2023006',
    recommendation_id: 6,
    field_id: 3,
    task_type: EXECUTION_TYPES.FERTILIZATION,
    task_content: '对北畈3号烟田喷施叶面肥，注意避开中午高温时段',
    assigned_to: 0,
    assigned_by: 0,
    assigned_at: '',
    due_date: '2023-05-15T18:00:00Z',
    priority: PRIORITY.MEDIUM,
    status: EXECUTION_STATUS.CREATED,
    completion_percentage: 0,
    notification_sent: false
  }
]

// 模拟执行反馈数据
const executionFeedbacks: Record<number, ExecutionFeedback> = {
  1: {
    id: 1,
    execution_task_id: 1,
    feedback_content: '已按要求完成施肥任务，覆盖全部区域，土壤湿度适宜，施肥效果良好',
    completion_date: '2023-04-14T16:30:00Z',
    actual_operation: '使用了15kg/亩的复合肥，采用撒施法均匀施用后进行了浅耕掩埋',
    effectiveness_rating: 5,
    difficulties_encountered: '部分区域土壤较硬，施肥后进行了灌溉以帮助肥料溶解',
    submitted_by: 3,
    submitted_at: '2023-04-14T17:00:00Z',
    media_urls: [
      '/mock/feedback/images/fertilizer1.jpg',
      '/mock/feedback/images/fertilizer2.jpg',
      '/mock/feedback/videos/fertilizer_process.mp4'
    ],
    reviewer_id: 2,
    review_status: FEEDBACK_REVIEW_STATUS.APPROVED,
    review_comments: '执行情况良好，施肥方法正确，下次可以考虑在施肥前一天灌溉，以提高肥效'
  },
  2: {
    id: 2,
    execution_task_id: 2,
    feedback_content: '已完成病虫害防治任务，按照要求喷洒了药剂，覆盖了所有发现病虫害的区域',
    completion_date: '2023-04-17T15:45:00Z',
    actual_operation: '使用背负式喷雾器进行药剂喷洒，重点加强了田块边缘和发现虫害较多的区域',
    effectiveness_rating: 4,
    difficulties_encountered: '风力较大，影响了喷洒均匀性，增加了药剂用量',
    submitted_by: 4,
    submitted_at: '2023-04-17T16:15:00Z',
    media_urls: [
      '/mock/feedback/images/pest_control1.jpg',
      '/mock/feedback/images/pest_control2.jpg'
    ],
    reviewer_id: 0,
    review_status: FEEDBACK_REVIEW_STATUS.PENDING,
    review_comments: ''
  }
}

// 根据参数获取任务列表
export async function fetchExecutionTasks(params: ExecutionTaskParams = {}) {
  console.log('Mock API: 获取执行任务列表', params)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  let filtered = [...executionTasks]
  
  // 应用筛选条件
  if (params.field_id) {
    filtered = filtered.filter(task => task.field_id === Number(params.field_id))
  }
  
  if (params.status) {
    filtered = filtered.filter(task => task.status === params.status)
  }
  
  if (params.assigned_to) {
    filtered = filtered.filter(task => task.assignee_id === Number(params.assigned_to))
  }
  
  if (params.priority) {
    filtered = filtered.filter(task => task.priority === params.priority)
  }
  
  // 模拟分页
  const page = params.page || 1
  const pageSize = params.page_size || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedTasks = filtered.slice(start, end)
  
  return {
    success: true,
    code: 200,
    message: '获取执行任务列表成功',
    data: paginatedTasks,
    meta: {
      page,
      page_size: pageSize,
      total: filtered.length
    }
  }
}

// 获取任务详情
export async function fetchExecutionTaskDetail(taskId: string | number) {
  console.log('Mock API: 获取执行任务详情', taskId)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  const id = Number(taskId)
  const task = executionTasks.find(t => t.id === id)
  
  if (task) {
    return {
      success: true,
      code: 200,
      message: '获取执行任务详情成功',
      data: task
    }
  } else {
    return {
      success: false,
      code: 404,
      message: '任务不存在',
      data: null
    }
  }
}

// 获取反馈详情
export async function fetchExecutionFeedback(taskId: string | number) {
  console.log('Mock API: 获取执行任务反馈', taskId)
  
  // 使用模拟数据
  const { taskFeedbacks } = await import('@/mock/data')
  
  const id = Number(taskId)
  const feedback = taskFeedbacks.find((f: any) => f.task_id === id)
  
  if (feedback) {
    return {
      success: true,
      code: 200,
      message: '获取执行反馈成功',
      data: feedback
    }
  } else {
    return {
      success: true,
      code: 200,
      message: '暂无反馈',
      data: null
    }
  }
}

// 提交反馈
export async function submitFeedback(data: any) {
  console.log('Mock API: 提交执行反馈', data)
  
  // 使用模拟数据
  const { executionTasks, taskFeedbacks } = await import('@/mock/data')
  
  const taskId = data.execution_task_id
  const task = executionTasks.find(t => t.id === taskId)
  
  if (!task) {
    return {
      success: false,
      code: 404,
      message: '任务不存在',
      data: null
    }
  }
  
  // 更新任务状态
  task.status = 'in_progress'
  
  // 创建新的反馈
  const newFeedback = {
    id: taskFeedbacks.length + 1,
    task_id: taskId,
    submitter_id: data.submitted_by,
    submitter_name: '烟农',
    completion_date: data.completion_date,
    actual_operation: data.actual_operation,
    content: data.feedback_content,
    effectiveness: data.effectiveness_rating,
    difficulties: data.difficulties_encountered || '',
    images: data.media_urls?.filter((url: string) => url.includes('.jpg') || url.includes('.png')) || [],
    videos: data.media_urls?.filter((url: string) => url.includes('.mp4')) || [],
    status: 'pending_review',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // 保存反馈
  taskFeedbacks.push(newFeedback)
  
  return {
    success: true,
    code: 200,
    message: '反馈提交成功',
    data: newFeedback
  }
}

// 审核反馈
export async function reviewFeedback(feedbackId: number, data: FeedbackReviewData) {
  console.log('Mock API: 审核执行反馈', feedbackId, data)
  
  // 使用模拟数据
  const { taskFeedbacks, feedbackReviews } = await import('@/mock/data')
  
  // 查找对应的反馈
  const targetFeedback = taskFeedbacks.find((f: any) => f.id === feedbackId)
  
  if (!targetFeedback) {
    return {
      success: false,
      code: 404,
      message: '反馈不存在',
      data: null
    }
  }
  
  // 更新反馈状态
  targetFeedback.status = data.review_status
  targetFeedback.updated_at = new Date().toISOString()
  
  // 创建审核记录
  const newReview = {
    id: feedbackReviews.length + 1,
    feedback_id: feedbackId,
    reviewer_id: data.reviewer_id,
    reviewer_name: '技术员',
    status: data.review_status,
    comments: data.review_comments,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // 保存审核
  feedbackReviews.push(newReview)
  
  return {
    success: true,
    code: 200,
    message: '反馈审核成功',
    data: targetFeedback
  }
}

// 更新任务状态
export async function updateTaskStatus(taskId: string | number, data: TaskStatusUpdateData) {
  console.log('Mock API: 更新任务状态', taskId, data)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  const id = Number(taskId)
  const task = executionTasks.find(t => t.id === id)
  
  if (!task) {
    return {
      success: false,
      code: 404,
      message: '任务不存在',
      data: null
    }
  }
  
  // 更新任务状态
  task.status = data.status
  
  return {
    success: true,
    code: 200,
    message: '任务状态更新成功',
    data: task
  }
}

// 创建执行任务
export async function createExecutionTask(taskData: any) {
  console.log('Mock API: 创建执行任务', taskData)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  const newTask = {
    id: executionTasks.length + 1,
    task_code: `EX${new Date().getFullYear()}${String(executionTasks.length + 1).padStart(3, '0')}`,
    task_type: taskData.task_type || '施肥',
    field_id: taskData.field_id || 1,
    field_name: taskData.field_id === 1 ? '东山1号烟田' : '西峰2号烟田',
    task_content: taskData.task_content || '',
    priority: taskData.priority || 'medium',
    creator_id: taskData.creator_id || 2,
    creator_name: 'technician',
    assignee_id: taskData.assignee_id || 0,
    assignee_name: '',
    due_date: taskData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    status: 'pending',
    updated_at: new Date().toISOString()
  }
  
  // 如果指定了执行者，设置执行者姓名
  if (newTask.assignee_id === 3) {
    newTask.assignee_name = 'farmer'
  }
  
  executionTasks.push(newTask)
  
  return {
    success: true,
    code: 200,
    message: '执行任务创建成功',
    data: newTask
  }
}

// 更新执行任务
export async function updateExecutionTask(taskId: string | number, taskData: any) {
  console.log('Mock API: 更新执行任务', taskId, taskData)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  const id = Number(taskId)
  const task = executionTasks.find((t: any) => t.id === id)
  
  if (!task) {
    return {
      success: false,
      code: 404,
      message: '任务不存在',
      data: null
    }
  }
  
  // 更新任务数据
  Object.assign(task, taskData)
  task.updated_at = new Date().toISOString()
  
  // 如果指定了执行者，设置执行者姓名
  if (taskData.assignee_id === 3) {
    task.assignee_name = 'farmer'
  }
  
  return {
    success: true,
    code: 200,
    message: '执行任务更新成功',
    data: task
  }
}

// 批量分配任务
export async function assignTasks(assignmentData: UserAssignmentData) {
  console.log('Mock API: 批量分配任务', assignmentData)
  
  // 使用模拟数据
  const { executionTasks } = await import('@/mock/data')
  
  const { task_ids, user_id } = assignmentData
  
  if (!task_ids.length || !user_id) {
    return {
      success: false,
      code: 400,
      message: '参数错误',
      data: null
    }
  }
  
  const updatedTasks = []
  
  // 更新任务
  for (const id of task_ids) {
    const task = executionTasks.find(t => t.id === id)
    if (task) {
      task.assignee_id = user_id
      task.assignee_name = user_id === 3 ? 'farmer' : 'technician'
      task.status = 'pending'
      task.updated_at = new Date().toISOString()
      updatedTasks.push(task)
    }
  }
  
  return {
    success: true,
    code: 200,
    message: `成功分配${updatedTasks.length}个任务`,
    data: updatedTasks
  }
}

// 获取用户列表（按角色筛选）
export async function getExecutionUsers(role?: string) {
  console.log('Mock API: 获取用户列表', role)
  
  // 使用模拟数据
  const { users } = await import('@/mock/data')
  
  let filteredUsers = [...users]
  
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role)
  }
  
  return {
    success: true,
    code: 200,
    message: '获取用户列表成功',
    data: filteredUsers
  }
}

// 获取执行任务评估数据
export function getExecutionEvaluationData() {
  console.log('Mock API: 获取执行任务评估数据')
  
  // 模拟评估数据
  const evaluationData = {
    completion_rate: 75, // 完成率
    effectiveness: 4.2, // 平均有效性评分
    on_time_rate: 80, // 按时完成率
    task_count: 45, // 总任务数
    task_count_by_type: {
      '施肥': 12,
      '病虫害防治': 8,
      '灌溉': 10,
      '打顶': 5,
      '除草': 7,
      '采收': 3
    },
    task_count_by_status: {
      'pending': 5,
      'in_progress': 8,
      'completed': 32
    },
    task_completion_trends: [
      { month: '1月', completed: 5, total: 8 },
      { month: '2月', completed: 7, total: 10 },
      { month: '3月', completed: 9, total: 12 },
      { month: '4月', completed: 12, total: 15 },
      { month: '5月', completed: 10, total: 14 },
      { month: '6月', completed: 8, total: 12 }
    ],
    farmer_performance: [
      { farmer_id: 3, name: '李烟农', completed: 15, on_time: 12, avg_rating: 4.5, performance_rating: 'A' },
      { farmer_id: 4, name: '王烟农', completed: 12, on_time: 10, avg_rating: 4.2, performance_rating: 'A' },
      { farmer_id: 5, name: '赵烟农', completed: 10, on_time: 7, avg_rating: 3.8, performance_rating: 'B' }
    ]
  }
  
  return {
    success: true,
    code: 200,
    message: '获取评估数据成功',
    data: evaluationData
  }
} 