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