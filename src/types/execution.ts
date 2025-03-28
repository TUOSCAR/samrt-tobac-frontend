// 执行任务的状态类型
export type ExecutionTaskStatus = 
  | 'created'
  | 'assigned'
  | 'notified'
  | 'in_progress'
  | 'feedback_submitted'
  | 'feedback_validated'
  | 'verified'
  | 'completed';

// 执行任务的优先级类型
export type Priority = 'high' | 'medium' | 'low';

// 执行任务类型
export type ExecutionTaskType = 
  | 'fertilization'
  | 'pest_control'
  | 'irrigation'
  | 'topping'
  | 'weeding'
  | 'harvesting';

// 反馈审核状态类型
export type FeedbackReviewStatus = 'pending' | 'approved' | 'rejected';

// 执行任务接口
export interface ExecutionTask {
  id: number;
  task_code: string;
  field_id: number;
  field_name?: string;
  task_content: string;
  due_date: string;
  priority: Priority | string;
  status: ExecutionTaskStatus | string;
  // 兼容新旧字段
  recommendation_id?: number;
  assignee_id?: number;
  assignee_name?: string;
  creator_id?: number;
  creator_name?: string;
  created_at?: string;
  updated_at?: string;
  task_type: ExecutionTaskType | string;
  assigned_to?: number;
  assigned_by?: number;
  assigned_at?: string;
  completion_percentage?: number;
  notification_sent?: boolean;
}

// 执行反馈接口
export interface ExecutionFeedback {
  id: number;
  execution_task_id: number;
  feedback_content: string;
  completion_date: string;
  actual_operation: string;
  effectiveness_rating: number;
  difficulties_encountered: string;
  submitted_by: number;
  submitted_at: string;
  media_urls: string[];
  reviewer_id: number | null;
  review_status: FeedbackReviewStatus;
  review_comments: string;
}

// 执行任务筛选参数
export interface ExecutionTaskParams {
  field_id?: number | string;
  status?: ExecutionTaskStatus;
  assigned_to?: number | string;
  priority?: Priority;
  sort_by?: string;
  page?: number;
  page_size?: number;
}

// 执行反馈审核数据
export interface FeedbackReviewData {
  review_status: FeedbackReviewStatus;
  review_comments: string;
  reviewer_id: number;
}

// 执行任务状态更新数据
export interface TaskStatusUpdateData {
  status: ExecutionTaskStatus;
  completion_percentage?: number;
}

// 执行反馈提交数据
export interface FeedbackSubmitData {
  execution_task_id: number;
  feedback_content: string;
  completion_date: string;
  actual_operation: string;
  effectiveness_rating: number;
  difficulties_encountered: string;
  submitted_by: number;
  media_urls: string[];
}

// 用户分配数据
export interface UserAssignmentData {
  task_ids: number[];
  user_id: number;
  assigned_by: number;
}

// 用户基本信息
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

// 评效数据
export interface EffectivenessEvaluationData {
  completion_rate: number;
  effectiveness: number;
  on_time_rate: number;
  task_count_by_type: Record<ExecutionTaskType, number>;
  task_count_by_status: Record<ExecutionTaskStatus, number>;
  task_completion_trends: Array<{
    month: string;
    completed: number;
    total: number;
  }>;
  farmer_performance: Array<{
    farmer_id: number;
    name: string;
    completed: number;
    on_time: number;
    avg_rating: number;
  }>;
} 