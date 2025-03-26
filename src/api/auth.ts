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