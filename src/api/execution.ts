import request from '@/utils/request'
import { 
  fetchExecutionTasks as mockFetchExecutionTasks, 
  fetchExecutionTaskDetail as mockFetchTaskDetail, 
  fetchExecutionFeedback as mockFetchFeedback, 
  submitFeedback as mockSubmitFeedback,
  reviewFeedback as mockReviewFeedback,
  updateTaskStatus as mockUpdateTaskStatus,
  createExecutionTask as mockCreateTask,
  updateExecutionTask as mockUpdateTask,
  assignTasks as mockAssignTasks,
  getExecutionUsers as mockGetUsers,
  getExecutionEvaluationData as mockGetEvaluationData
} from '@/mock/execution'
import type { 
  ExecutionTaskParams, 
  FeedbackSubmitData, 
  FeedbackReviewData,
  TaskStatusUpdateData,
  ExecutionTask,
  UserAssignmentData
} from '@/types/execution'

/**
 * 获取执行任务列表
 * @param params 查询参数
 * @returns Promise
 */
export function fetchExecutionTasks(params: ExecutionTaskParams = {}) {
  // 使用模拟数据
  return mockFetchExecutionTasks(params)
  
  // 实际API调用
  // return request({
  //   url: '/api/execution-tasks',
  //   method: 'get',
  //   params
  // })
}

/**
 * 获取执行任务详情
 * @param id 任务ID
 * @returns Promise
 */
export function fetchExecutionTaskDetail(id: number | string) {
  // 使用模拟数据
  return mockFetchTaskDetail(id)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${id}`,
  //   method: 'get'
  // })
}

/**
 * 获取执行反馈
 * @param taskId 任务ID
 * @returns Promise
 */
export function fetchExecutionFeedback(taskId: number | string) {
  // 使用模拟数据
  return mockFetchFeedback(taskId)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${taskId}/feedback`,
  //   method: 'get'
  // })
}

/**
 * 提交执行反馈
 * @param data 反馈数据
 * @returns Promise
 */
export function submitFeedback(data: FeedbackSubmitData) {
  // 使用模拟数据
  return mockSubmitFeedback(data)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${data.execution_task_id}/feedback`,
  //   method: 'post',
  //   data
  // })
}

/**
 * 审核执行反馈
 * @param feedbackId 反馈ID
 * @param data 审核数据
 * @returns Promise
 */
export function reviewFeedback(feedbackId: number | string, data: FeedbackReviewData) {
  // 使用模拟数据
  return mockReviewFeedback(Number(feedbackId), data)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/feedback/${feedbackId}/review`,
  //   method: 'put',
  //   data
  // })
}

/**
 * 更新执行任务状态
 * @param taskId 任务ID
 * @param data 状态数据
 * @returns Promise
 */
export function updateTaskStatus(taskId: number | string, data: TaskStatusUpdateData) {
  // 使用模拟数据
  return mockUpdateTaskStatus(taskId, data)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${taskId}/status`,
  //   method: 'put',
  //   data
  // })
}

/**
 * 创建执行任务
 * @param data 任务数据
 * @returns Promise
 */
export function createExecutionTask(data: any) {
  // 使用模拟数据
  return mockCreateTask(data)
  
  // 实际API调用
  // return request({
  //   url: '/api/execution-tasks',
  //   method: 'post',
  //   data
  // })
}

/**
 * 更新执行任务
 * @param taskId 任务ID
 * @param data 任务数据
 * @returns Promise
 */
export function updateExecutionTask(taskId: number | string, data: any) {
  // 使用模拟数据
  return mockUpdateTask(taskId, data)
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${taskId}`,
  //   method: 'put',
  //   data
  // })
}

/**
 * 分配任务给用户
 * @param data 分配数据
 * @returns Promise
 */
export function assignTasks(data: UserAssignmentData) {
  // 使用模拟数据
  return Promise.resolve(mockAssignTasks(data))
  
  // 实际API调用
  // return request({
  //   url: '/api/execution-tasks/assign',
  //   method: 'post',
  //   data
  // })
}

/**
 * 获取用户列表
 * @param role 用户角色
 * @returns Promise
 */
export function getExecutionUsers(role?: string) {
  // 使用模拟数据
  return Promise.resolve(mockGetUsers(role))
  
  // 实际API调用
  // return request({
  //   url: '/api/users',
  //   method: 'get',
  //   params: { role }
  // })
}

/**
 * 获取执行评估数据
 * @returns Promise
 */
export function getExecutionEvaluationData() {
  // 使用模拟数据
  return Promise.resolve(mockGetEvaluationData())
  
  // 实际API调用
  // return request({
  //   url: '/api/execution-tasks/evaluation',
  //   method: 'get'
  // })
} 