// 用户数据
export const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    phone: '13800000000',
    role: 'admin',
    last_login: '2023-08-01T10:30:00Z',
    is_active: true
  },
  {
    id: 2,
    username: 'technician',
    password: 'tech123',
    email: 'tech@example.com',
    phone: '13811111111',
    role: 'technician',
    last_login: '2023-07-30T08:45:00Z',
    is_active: true
  },
  {
    id: 3,
    username: 'farmer',
    password: 'farmer123',
    email: 'farmer@example.com',
    phone: '13822222222',
    role: 'farmer',
    last_login: '2023-07-28T16:20:00Z',
    is_active: true
  }
]

// 地块数据
export const fields = [
  {
    id: 1,
    field_code: 'F2023001',
    field_name: '东山1号烟田',
    contract_area: 8.5,
    actual_area: 8.2,
    location: '数据略',
    boundary: {
      type: 'Polygon',
      coordinates: [[[120.12, 30.28], [120.13, 30.28], [120.13, 30.29], [120.12, 30.29], [120.12, 30.28]]]
    },
    farmer_id: 3,
    technician_id: 2,
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-03-10T10:30:00Z'
  },
  {
    id: 2,
    field_code: 'F2023002',
    field_name: '西峰2号烟田',
    contract_area: 6.2,
    actual_area: 6.0,
    location: '数据略',
    boundary: {
      type: 'Polygon',
      coordinates: [[[120.14, 30.30], [120.15, 30.30], [120.15, 30.31], [120.14, 30.31], [120.14, 30.30]]]
    },
    farmer_id: 3,
    technician_id: 2,
    created_at: '2023-02-05T09:15:00Z',
    updated_at: '2023-03-12T14:20:00Z'
  }
]

// 通知数据
export const notifications = [
  {
    id: 1,
    user_id: 1,
    title: '监测任务创建成功',
    content: '2023年第三季度烟田生长监测任务已成功创建',
    type: 'task',
    priority: 'medium',
    isRead: false,
    createdAt: '2023-08-02T09:30:00Z',
    relatedTaskId: 3
  },
  {
    id: 2,
    user_id: 1,
    title: '分析完成通知',
    content: '地块F2023001的基础分析已完成，请查看结果',
    type: 'task',
    priority: 'high',
    isRead: true,
    createdAt: '2023-08-01T14:20:00Z',
    relatedTaskId: 2
  },
  {
    id: 3,
    user_id: 1,
    title: '系统更新通知',
    content: '系统将于2023-08-05 23:00进行维护更新，预计持续1小时',
    type: 'system',
    priority: 'low',
    isRead: false,
    createdAt: '2023-08-01T10:00:00Z'
  }
]

import { MockMethod } from 'vite-plugin-mock'

const droneImages = [
  {
    id: 1,
    fieldId: 1,
    imageUrl: '/mock/drone-images/1.jpg',
    captureTime: '2024-03-26 10:00:00',
    resolution: '4K',
    type: 'RGB'
  },
  {
    id: 2,
    fieldId: 1,
    imageUrl: '/mock/drone-images/2.jpg',
    captureTime: '2024-03-26 11:00:00',
    resolution: '4K',
    type: 'Multispectral'
  }
]

const weatherData = [
  {
    id: 1,
    fieldId: 1,
    temperature: 25.5,
    humidity: 65,
    rainfall: 0,
    windSpeed: 3.2,
    timestamp: '2024-03-26 10:00:00'
  },
  {
    id: 2,
    fieldId: 1,
    temperature: 26.8,
    humidity: 62,
    rainfall: 0,
    windSpeed: 3.5,
    timestamp: '2024-03-26 11:00:00'
  }
]

const plantingParameters = [
  {
    id: 1,
    fieldId: 1,
    parameterName: '土壤湿度',
    value: '65',
    unit: '%',
    updateTime: '2024-03-26 10:00:00'
  },
  {
    id: 2,
    fieldId: 1,
    parameterName: '土壤pH值',
    value: '6.5',
    unit: 'pH',
    updateTime: '2024-03-26 10:00:00'
  }
]

// 烟田列表
export const fieldList = [
  { id: 1, name: '东山1号烟田', area: 10.5, address: '山东省烟台市东山区' },
  { id: 2, name: '西峰2号烟田', area: 8.2, address: '山东省烟台市西峰区' },
  { id: 3, name: '北畈3号烟田', area: 12.0, address: '山东省烟台市北畈区' },
  { id: 4, name: '南坡4号烟田', area: 9.7, address: '山东省烟台市南坡区' },
  { id: 5, name: '中心5号烟田', area: 11.3, address: '山东省烟台市中心区' }
]

// 获取字段列表
export function fetchFieldList() {
  return {
    success: true,
    code: 200,
    message: '获取烟田列表成功',
    data: fieldList
  }
}

// 执行任务数据
export const executionTasks = [
  {
    id: 1,
    task_code: 'EX2024001',
    task_type: '施肥',
    field_id: 1,
    field_name: '东山1号烟田',
    task_content: '根据土壤检测结果，对东区进行氮肥补充，用量为每亩3kg',
    priority: 'high',
    creator_id: 2,
    creator_name: 'technician',
    assignee_id: 3,
    assignee_name: 'farmer',
    due_date: '2024-04-10T23:59:59Z',
    created_at: '2024-04-01T10:30:00Z',
    status: 'pending',
    updated_at: '2024-04-01T10:30:00Z'
  },
  {
    id: 2,
    task_code: 'EX2024002',
    task_type: '病虫害防治',
    field_id: 1,
    field_name: '东山1号烟田',
    task_content: '发现西区有烟青虫危害迹象，请使用推荐的生物农药进行喷洒防治',
    priority: 'urgent',
    creator_id: 2,
    creator_name: 'technician',
    assignee_id: 3,
    assignee_name: 'farmer',
    due_date: '2024-04-05T23:59:59Z',
    created_at: '2024-04-02T09:15:00Z',
    status: 'in_progress',
    updated_at: '2024-04-03T11:20:00Z'
  },
  {
    id: 3,
    task_code: 'EX2024003',
    task_type: '灌溉',
    field_id: 2,
    field_name: '西峰2号烟田',
    task_content: '土壤湿度低于标准，请进行适量灌溉，注意控制水量',
    priority: 'medium',
    creator_id: 2,
    creator_name: 'technician',
    assignee_id: 3,
    assignee_name: 'farmer',
    due_date: '2024-04-08T23:59:59Z',
    created_at: '2024-04-03T14:20:00Z',
    status: 'pending',
    updated_at: '2024-04-03T14:20:00Z'
  },
  {
    id: 4,
    task_code: 'EX2024004',
    task_type: '采收',
    field_id: 1,
    field_name: '东山1号烟田',
    task_content: '东区烟叶已成熟，请安排采收，注意分级存放',
    priority: 'high',
    creator_id: 2,
    creator_name: 'technician',
    assignee_id: 3,
    assignee_name: 'farmer',
    due_date: '2024-04-15T23:59:59Z',
    created_at: '2024-04-04T09:00:00Z',
    status: 'pending',
    updated_at: '2024-04-04T09:00:00Z'
  }
]

// 执行反馈数据
export const taskFeedbacks = [
  {
    id: 1,
    task_id: 2,
    submitter_id: 3,
    submitter_name: 'farmer',
    completion_date: '2024-04-03T10:30:00Z',
    actual_operation: '按照指示在西区使用了推荐的生物农药进行喷洒，覆盖面积约2亩',
    content: '已完成喷洒作业，发现受害植株约占10%，已全部处理',
    effectiveness: 4,
    difficulties: '部分区域地形不平，喷洒难度较大',
    images: ['/mock/feedback-images/1.jpg', '/mock/feedback-images/2.jpg'],
    videos: [],
    status: 'pending_review',
    created_at: '2024-04-03T11:15:00Z',
    updated_at: '2024-04-03T11:15:00Z'
  }
]

// 反馈审核数据
export const feedbackReviews = [
  {
    id: 1,
    feedback_id: 1,
    reviewer_id: 2,
    reviewer_name: 'technician',
    status: 'approved',
    comments: '执行情况良好，请继续观察后续效果',
    created_at: '2024-04-03T16:30:00Z',
    updated_at: '2024-04-03T16:30:00Z'
  }
]

// 任务类型选项
export const taskTypes = [
  { value: '施肥', label: '施肥' },
  { value: '灌溉', label: '灌溉' },
  { value: '病虫害防治', label: '病虫害防治' },
  { value: '采收', label: '采收' },
  { value: '整地', label: '整地' },
  { value: '移栽', label: '移栽' },
  { value: '打顶', label: '打顶' },
  { value: '除草', label: '除草' }
]

// 任务优先级选项
export const priorityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' }
]

// 任务状态选项
export const taskStatusOptions = [
  { value: 'pending', label: '待执行' },
  { value: 'in_progress', label: '执行中' },
  { value: 'completed', label: '已完成' },
  { value: 'overdue', label: '已逾期' },
  { value: 'cancelled', label: '已取消' }
]

// 反馈审核状态选项
export const reviewStatusOptions = [
  { value: 'pending_review', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'needs_revision', label: '需修改' }
]

export default [
  {
    url: '/api/data/drone-images/:fieldId',
    method: 'get',
    response: ({ query }) => {
      const fieldId = parseInt(query.fieldId)
      const images = droneImages.filter(img => img.fieldId === fieldId)
      return {
        code: 200,
        data: images
      }
    }
  },
  {
    url: '/api/data/drone-images/:fieldId',
    method: 'post',
    response: ({ query, body }) => {
      const fieldId = parseInt(query.fieldId)
      const newImage = {
        id: droneImages.length + 1,
        fieldId,
        ...body,
        captureTime: new Date().toISOString()
      }
      droneImages.push(newImage)
      return {
        code: 200,
        data: newImage
      }
    }
  },
  {
    url: '/api/data/weather/:fieldId',
    method: 'get',
    response: ({ query }) => {
      const fieldId = parseInt(query.fieldId)
      const { startTime, endTime } = query
      const data = weatherData.filter(
        w => w.fieldId === fieldId &&
        w.timestamp >= startTime &&
        w.timestamp <= endTime
      )
      return {
        code: 200,
        data
      }
    }
  },
  {
    url: '/api/data/parameters/:fieldId',
    method: 'get',
    response: ({ query }) => {
      const fieldId = parseInt(query.fieldId)
      const parameters = plantingParameters.filter(p => p.fieldId === fieldId)
      return {
        code: 200,
        data: parameters
      }
    }
  },
  {
    url: '/api/data/parameters/:fieldId',
    method: 'put',
    response: ({ query, body }) => {
      const fieldId = parseInt(query.fieldId)
      const param = plantingParameters.find(p => p.fieldId === fieldId)
      if (param) {
        Object.assign(param, body)
        return {
          code: 200,
          data: param
        }
      }
      return {
        code: 404,
        message: '参数不存在'
      }
    }
  }
] as MockMethod[] 