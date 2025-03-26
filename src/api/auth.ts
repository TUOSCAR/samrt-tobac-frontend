import request from '@/utils/request'
import { getMockHandler } from '@/mock'

// 登录
export function login(username: string, password: string) {
  console.log('API login called with:', username, password)
  
  const mockHandler = getMockHandler('/api/auth/login', 'POST')
  if (mockHandler) {
    console.log('Using mock handler for login')
    return mockHandler(username, password)
  }
  
  console.log('Using real API for login')
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: { username, password }
  })
}

// 获取用户信息
export function getUserInfo() {
  const mockHandler = getMockHandler('/api/auth/user-info', 'GET')
  if (mockHandler) {
    return mockHandler(localStorage.getItem('token'))
  }
  
  return request({
    url: '/api/auth/user-info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  const mockHandler = getMockHandler('/api/auth/logout', 'POST')
  if (mockHandler) {
    return mockHandler()
  }
  
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 注册
export function register(data: any) {
  const mockHandler = getMockHandler('/api/auth/register', 'POST')
  if (mockHandler) {
    return mockHandler(data)
  }
  
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

// 发送验证码
export function sendVerificationCode(data: { username: string; email: string }) {
  const mockHandler = getMockHandler('/api/auth/send-verification-code', 'POST')
  if (mockHandler) {
    return mockHandler(data)
  }
  
  return request({
    url: '/api/auth/send-verification-code',
    method: 'post',
    data
  })
}

// 验证重置密码的验证码
export function verifyResetCode(data: { username: string; email: string; code: string }) {
  const mockHandler = getMockHandler('/api/auth/verify-reset-code', 'POST')
  if (mockHandler) {
    return mockHandler(data)
  }
  
  return request({
    url: '/api/auth/verify-reset-code',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPassword(data: { username: string; code: string; password: string }) {
  const mockHandler = getMockHandler('/api/auth/reset-password', 'POST')
  if (mockHandler) {
    return mockHandler(data)
  }
  
  return request({
    url: '/api/auth/reset-password',
    method: 'post',
    data
  })
} 