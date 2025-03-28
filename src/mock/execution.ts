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
  FeedbackReviewStatus
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

// 模拟执行任务数据
export const executionTasks: ExecutionTask[] = [
  {
    id: 1,
    task_code: 'ET202401',
    recommendation_id: 101,
    field_id: 1,
    task_type: EXECUTION_TYPES.FERTILIZATION,
    task_content: '按照推荐剂量对东山1号烟田进行氮肥补充，每亩施加尿素5kg，覆盖全区域均匀施肥。',
    assigned_to: 3, // farmer_id
    assigned_by: 2, // technician_id
    assigned_at: '2024-03-15T09:00:00Z',
    due_date: '2024-03-20T17:00:00Z',
    priority: PRIORITY.HIGH,
    status: EXECUTION_STATUS.FEEDBACK_SUBMITTED,
    completion_percentage: 100,
    notification_sent: true
  },
  {
    id: 2,
    task_code: 'ET202402',
    recommendation_id: 102,
    field_id: 2,
    task_type: EXECUTION_TYPES.PEST_CONTROL,
    task_content: '西峰2号烟田局部发现烟青虫危害，需及时使用0.5%阿维菌素乳剂1500倍液进行喷施防治，重点关注东南角区域。',
    assigned_to: 4, // farmer_id
    assigned_by: 2, // technician_id
    assigned_at: '2024-03-16T10:30:00Z',
    due_date: '2024-03-19T17:00:00Z',
    priority: PRIORITY.HIGH,
    status: EXECUTION_STATUS.IN_PROGRESS,
    completion_percentage: 50,
    notification_sent: true
  },
  {
    id: 3,
    task_code: 'ET202403',
    recommendation_id: 103,
    field_id: 1,
    task_type: EXECUTION_TYPES.IRRIGATION,
    task_content: '东山1号烟田因近期少雨，监测到土壤水分不足，请于近三天内进行灌溉，每亩灌水量不少于30立方米。',
    assigned_to: 3, // farmer_id
    assigned_by: 2, // technician_id
    assigned_at: '2024-03-17T09:00:00Z',
    due_date: '2024-03-22T17:00:00Z',
    priority: PRIORITY.MEDIUM,
    status: EXECUTION_STATUS.ASSIGNED,
    completion_percentage: 0,
    notification_sent: true
  },
  {
    id: 4,
    task_code: 'ET202404',
    recommendation_id: 104,
    field_id: 3,
    task_type: EXECUTION_TYPES.TOPPING,
    task_content: '北畈3号烟田烟株已进入开花期，需进行及时打顶，留叶18-20片，并喷施抹芽剂防止腋芽生长。',
    assigned_to: 5, // farmer_id
    assigned_by: 2, // technician_id
    assigned_at: '2024-03-18T11:00:00Z',
    due_date: '2024-03-23T17:00:00Z',
    priority: PRIORITY.HIGH,
    status: EXECUTION_STATUS.COMPLETED,
    completion_percentage: 100,
    notification_sent: true
  },
  {
    id: 5,
    task_code: 'ET202405',
    recommendation_id: 105,
    field_id: 3,
    task_type: EXECUTION_TYPES.WEEDING,
    task_content: '北畈3号烟田局部杂草较多，影响烟草生长，请进行人工除草或使用推荐除草剂进行处理。',
    assigned_to: 5, // farmer_id
    assigned_by: 2, // technician_id
    assigned_at: '2024-03-19T14:00:00Z',
    due_date: '2024-03-25T17:00:00Z',
    priority: PRIORITY.LOW,
    status: EXECUTION_STATUS.NOTIFIED,
    completion_percentage: 0,
    notification_sent: true
  }
];

// 模拟执行反馈数据
export const executionFeedbacks: ExecutionFeedback[] = [
  {
    id: 1,
    execution_task_id: 1,
    feedback_content: '已按照推荐剂量完成施肥，全地块均匀撒施尿素5kg/亩，并进行了轻度耕翻。',
    completion_date: '2024-03-19T16:30:00Z',
    actual_operation: '使用撒肥器均匀撒施尿素，然后用小型旋耕机进行浅耕，确保肥料与土壤充分混合。',
    effectiveness_rating: 4,
    difficulties_encountered: '东南角地势较低，土壤湿度大，施肥难度较大。',
    submitted_by: 3, // farmer_id
    submitted_at: '2024-03-19T17:00:00Z',
    media_urls: [
      '/mock/feedback/images/fertilization_1.jpg',
      '/mock/feedback/images/fertilization_2.jpg'
    ],
    reviewer_id: 2, // technician_id
    review_status: FEEDBACK_REVIEW_STATUS.PENDING,
    review_comments: ''
  },
  {
    id: 2,
    execution_task_id: 4,
    feedback_content: '已完成北畈3号烟田的打顶作业，平均每株留叶19片，并喷施了抹芽剂。',
    completion_date: '2024-03-22T15:00:00Z',
    actual_operation: '手工打顶，使用120ml/亩浓度的抹芽剂均匀喷洒烟株，特别是打顶部位和腋芽位置。',
    effectiveness_rating: 5,
    difficulties_encountered: '无特别困难，天气晴好，打顶作业顺利完成。',
    submitted_by: 5, // farmer_id
    submitted_at: '2024-03-22T15:30:00Z',
    media_urls: [
      '/mock/feedback/images/topping_1.jpg',
      '/mock/feedback/images/topping_2.jpg',
      '/mock/feedback/videos/topping_process.mp4'
    ],
    reviewer_id: 2, // technician_id
    review_status: FEEDBACK_REVIEW_STATUS.APPROVED,
    review_comments: '打顶质量良好，留叶数符合要求，抹芽剂使用方法正确。'
  }
];

// 获取执行任务列表
export const getExecutionTasks = (params: ExecutionTaskParams = {}) => {
  let result = [...executionTasks];
  
  // 模拟筛选
  if (params.field_id) {
    result = result.filter(t => t.field_id === parseInt(String(params.field_id)));
  }
  
  if (params.status) {
    result = result.filter(t => t.status === params.status);
  }
  
  if (params.assigned_to) {
    result = result.filter(t => t.assigned_to === parseInt(String(params.assigned_to)));
  }
  
  if (params.priority) {
    result = result.filter(t => t.priority === params.priority);
  }
  
  // 模拟排序
  if (params.sort_by === 'due_date') {
    result.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }
  
  // 模拟分页
  const page = params.page || 1;
  const page_size = params.page_size || 10;
  const start = (page - 1) * page_size;
  const end = start + page_size;
  const paginatedResult = result.slice(start, end);
  
  return {
    success: true,
    code: 200,
    message: '获取执行任务列表成功',
    data: paginatedResult,
    meta: {
      page,
      page_size,
      total: result.length
    }
  };
};

// 获取执行任务详情
export const getExecutionTaskDetail = (id: number | string) => {
  const task = executionTasks.find(t => t.id === parseInt(String(id)));
  
  if (task) {
    return {
      success: true,
      code: 200,
      message: '获取执行任务详情成功',
      data: task
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到执行任务',
      data: null
    };
  }
};

// 获取执行反馈
export const getExecutionFeedback = (taskId: number | string) => {
  const feedback = executionFeedbacks.find(f => f.execution_task_id === parseInt(String(taskId)));
  
  if (feedback) {
    return {
      success: true,
      code: 200,
      message: '获取执行反馈成功',
      data: feedback
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到执行反馈',
      data: null
    };
  }
};

// 提交执行反馈
export const submitExecutionFeedback = (data: any) => {
  const newFeedback = {
    id: generateRandomId(),
    ...data,
    submitted_at: new Date().toISOString(),
    review_status: FEEDBACK_REVIEW_STATUS.PENDING,
    review_comments: ''
  };
  
  // 在实际应用中这里会将数据保存到数据库
  executionFeedbacks.push(newFeedback as ExecutionFeedback);
  
  // 更新任务状态
  const task = executionTasks.find(t => t.id === parseInt(String(data.execution_task_id)));
  if (task) {
    task.status = EXECUTION_STATUS.FEEDBACK_SUBMITTED;
    task.completion_percentage = 100;
  }
  
  return {
    success: true,
    code: 200,
    message: '提交执行反馈成功',
    data: newFeedback
  };
};

// 审核执行反馈
export const reviewExecutionFeedback = (feedbackId: number | string, reviewData: FeedbackReviewData) => {
  const feedback = executionFeedbacks.find(f => f.id === parseInt(String(feedbackId)));
  
  if (feedback) {
    feedback.review_status = reviewData.review_status;
    feedback.review_comments = reviewData.review_comments;
    feedback.reviewer_id = reviewData.reviewer_id;
    
    // 如果审核通过，更新任务状态
    if (reviewData.review_status === FEEDBACK_REVIEW_STATUS.APPROVED) {
      const task = executionTasks.find(t => t.id === feedback.execution_task_id);
      if (task) {
        task.status = EXECUTION_STATUS.FEEDBACK_VALIDATED;
      }
    }
    
    return {
      success: true,
      code: 200,
      message: '审核执行反馈成功',
      data: feedback
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到执行反馈',
      data: null
    };
  }
};

// 更新执行任务状态
export const updateExecutionTaskStatus = (taskId: number | string, statusData: TaskStatusUpdateData) => {
  const task = executionTasks.find(t => t.id === parseInt(String(taskId)));
  
  if (task) {
    task.status = statusData.status;
    task.completion_percentage = statusData.completion_percentage || task.completion_percentage;
    
    return {
      success: true,
      code: 200,
      message: '更新执行任务状态成功',
      data: task
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到执行任务',
      data: null
    };
  }
}; 