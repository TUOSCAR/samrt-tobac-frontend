import { login, register, logout, getUserInfo } from './auth'
import { getFields, getFieldById, createField, updateField, deleteField } from './fields'
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from './notification'

// 注册所有mock API
const mockApis = {
  // 认证相关
  'POST /api/auth/login': login,
  'POST /api/auth/register': register,
  'POST /api/auth/logout': logout,
  'GET /api/auth/user-info': getUserInfo,
  
  // 地块相关
  'GET /api/fields': getFields,
  'GET /api/fields/:id': getFieldById,
  'POST /api/fields': createField,
  'PUT /api/fields/:id': updateField,
  'DELETE /api/fields/:id': deleteField,
  
  // 通知相关
  'GET /api/notifications': getNotifications,
  'PUT /api/notifications/:id/read': markAsRead,
  'PUT /api/notifications/mark-all-read': markAllAsRead,
  'DELETE /api/notifications': clearNotifications
}

// 判断是否使用Mock数据
const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

// 启动mock服务
export function setupMock() {
  console.log('Mock服务已禁用')
}

// 根据请求路径和方法获取对应的mock处理函数
export function getMockHandler() {
  return null
} 