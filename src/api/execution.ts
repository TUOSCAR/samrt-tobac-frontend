import request from '@/utils/request'
import { 
  getExecutionTasks, 
  getExecutionTaskDetail, 
  getExecutionFeedback, 
  submitExecutionFeedback,
  reviewExecutionFeedback,
  updateExecutionTaskStatus
} from '@/mock/execution'
import type { 
  ExecutionTaskParams, 
  FeedbackSubmitData, 
  FeedbackReviewData,
  TaskStatusUpdateData 
} from '@/types/execution'

/**
 * 获取执行任务列表
 * @param params 查询参数
 * @returns Promise
 */
export function fetchExecutionTasks(params: ExecutionTaskParams = {}) {
  // 使用模拟数据
  return Promise.resolve(getExecutionTasks(params))
  
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
  return Promise.resolve(getExecutionTaskDetail(id))
  
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
  return Promise.resolve(getExecutionFeedback(taskId))
  
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
  return Promise.resolve(submitExecutionFeedback(data))
  
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
  return Promise.resolve(reviewExecutionFeedback(feedbackId, data))
  
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
  return Promise.resolve(updateExecutionTaskStatus(taskId, data))
  
  // 实际API调用
  // return request({
  //   url: `/api/execution-tasks/${taskId}/status`,
  //   method: 'put',
  //   data
  // })
} 