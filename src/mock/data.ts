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