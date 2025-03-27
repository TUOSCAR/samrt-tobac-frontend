import request from './index'
import type { LoginResponse } from '@/types/user'

// 登录
export function login(username: string, password: string) {
  return request.post<LoginResponse>('/auth/login', { username, password })
}

// 注册
export function register(data: {
  username: string
  password: string
  name: string
  phone: string
  email: string
}) {
  return request.post('/auth/register', data)
}

// 登出
export function logout() {
  return request.post('/auth/logout')
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/auth/user-info')
}

// 发送验证码
export function sendVerificationCode(email: string) {
  return request.post('/auth/send-verification-code', { email })
}

// 验证重置码
export function verifyResetCode(email: string, code: string) {
  return request.post('/auth/verify-reset-code', { email, code })
}

// 重置密码
export function resetPassword(email: string, code: string, newPassword: string) {
  return request.post('/auth/reset-password', { email, code, newPassword })
} 