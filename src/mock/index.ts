import {
  login,
  register,
  logout,
  getUserInfo,
  sendVerificationCode,
  verifyResetCode,
  resetPassword
} from './auth'
import { getFields, getFieldById, createField, updateField, deleteField } from './fields'
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from './notification'

// 注册所有mock API
const mockApis: Record<string, any> = {
  // 认证相关
  'POST /api/auth/login': login,
  'POST /api/auth/register': register,
  'POST /api/auth/logout': logout,
  'GET /api/auth/user-info': getUserInfo,
  'POST /api/auth/send-verification-code': sendVerificationCode,
  'POST /api/auth/verify-reset-code': verifyResetCode,
  'POST /api/auth/reset-password': resetPassword,
  
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
  if (isMock) {
    console.log('Mock服务已启用')
  } else {
    console.log('Mock服务已禁用')
  }
}

// 根据请求路径和方法获取对应的mock处理函数
export function getMockHandler(url: string, method: string) {
  if (!isMock) return null
  
  // 构造完整的路由键 METHOD /path
  const key = `${method.toUpperCase()} ${url}`
  
  // 匹配完全相同的路由
  if (mockApis[key]) {
    return mockApis[key]
  }
  
  // 匹配带参数的路由 如 /api/fields/:id
  for (const apiPattern in mockApis) {
    if (isMatchPattern(apiPattern, key)) {
      return mockApis[apiPattern]
    }
  }
  
  console.warn(`未找到匹配的Mock API: ${key}`)
  return null
}

// 判断请求是否匹配模式
function isMatchPattern(pattern: string, actual: string) {
  // 如果模式和实际路径完全匹配，返回true
  if (pattern === actual) return true
  
  // 分解模式和实际路径
  const [patternMethod, patternPath] = pattern.split(' ')
  const [actualMethod, actualPath] = actual.split(' ')
  
  // 如果方法不同，返回false
  if (patternMethod !== actualMethod) return false
  
  // 分解路径段
  const patternSegments = patternPath.split('/')
  const actualSegments = actualPath.split('/')
  
  // 如果路径段数量不同，返回false
  if (patternSegments.length !== actualSegments.length) return false
  
  // 逐段比较
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i]
    const actualSeg = actualSegments[i]
    
    // 如果是参数段(以:开头)，跳过比较
    if (patternSeg.startsWith(':')) continue
    
    // 否则段必须完全匹配
    if (patternSeg !== actualSeg) return false
  }
  
  return true
} 