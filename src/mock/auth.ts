import { users } from './data'

// 定义用户接口
interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  last_login: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// 登录
export function login(username: string, password: string) {
  console.log('Mock login called with:', username, password)
  
  const user = users.find(u => u.username === username && u.password === password)
  
  if (user) {
    console.log('Mock login: 用户验证成功')
    // 更新最后登录时间
    user.last_login = new Date().toISOString()
    
    return {
      success: true,
      code: 200,
      message: '登录成功',
      data: {
        token: `mock-jwt-token-${user.id}`,
        user: { ...user, password: undefined }
      }
    }
  }
  
  console.log('Mock login: 用户验证失败')
  return {
    success: false,
    code: 401,
    message: '用户名或密码错误',
    data: null
  }
}

// 获取用户信息
export function getUserInfo(token: string) {
  // 从token中提取用户ID
  const userId = parseInt(token.split('-').pop() || '0')
  const user = users.find(u => u.id === userId)
  
  if (user) {
    return {
      success: true,
      code: 200,
      message: '获取用户信息成功',
      data: { ...user, password: undefined }
    }
  }
  
  return {
    success: false,
    code: 401,
    message: '获取用户信息失败',
    data: null
  }
}

// 退出登录
export function logout() {
  return {
    success: true,
    code: 200,
    message: '退出登录成功',
    data: null
  }
}

// 注册
export function register(userData: any) {
  // 检查用户名是否已存在
  if (users.some(u => u.username === userData.username)) {
    return {
      success: false,
      code: 400,
      message: '用户名已存在',
      data: null
    }
  }
  
  // 创建新用户
  const newUser: User = {
    id: users.length + 1,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    phone: userData.phone,
    role: userData.role || 'farmer', // 默认为烟农
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: null,
    is_active: true
  }
  
  users.push(newUser as any)
  
  return {
    success: true,
    code: 200,
    message: '注册成功',
    data: { ...newUser, password: undefined }
  }
}

// 模拟验证码存储
const verificationCodes: Record<string, { code: string; expiry: number }> = {}

// 生成随机验证码
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送验证码
export function sendVerificationCode(data: { username: string; email: string }) {
  const user = users.find(u => u.username === data.username && u.email === data.email)
  
  if (!user) {
    return {
      success: false,
      code: 404,
      message: '用户不存在或邮箱不匹配',
      data: null
    }
  }
  
  // 生成6位验证码
  const code = generateVerificationCode()
  
  // 存储验证码，并设置10分钟有效期
  const expiry = Date.now() + 10 * 60 * 1000
  verificationCodes[data.username] = { code, expiry }
  
  console.log(`Mock: 发送验证码 ${code} 到邮箱 ${data.email}`)
  
  return {
    success: true,
    code: 200,
    message: '验证码已发送，请查看邮箱',
    data: null
  }
}

// 验证重置密码的验证码
export function verifyResetCode(data: { username: string; email: string; code: string }) {
  const user = users.find(u => u.username === data.username && u.email === data.email)
  
  if (!user) {
    return {
      success: false,
      code: 404,
      message: '用户不存在或邮箱不匹配',
      data: null
    }
  }
  
  const verificationData = verificationCodes[data.username]
  
  if (!verificationData) {
    return {
      success: false,
      code: 400,
      message: '请先获取验证码',
      data: null
    }
  }
  
  if (Date.now() > verificationData.expiry) {
    return {
      success: false,
      code: 400,
      message: '验证码已过期，请重新获取',
      data: null
    }
  }
  
  if (verificationData.code !== data.code) {
    return {
      success: false,
      code: 400,
      message: '验证码错误',
      data: null
    }
  }
  
  return {
    success: true,
    code: 200,
    message: '验证成功',
    data: null
  }
}

// 重置密码
export function resetPassword(data: { username: string; code: string; password: string }) {
  const user = users.find(u => u.username === data.username) as User
  
  if (!user) {
    return {
      success: false,
      code: 404,
      message: '用户不存在',
      data: null
    }
  }
  
  const verificationData = verificationCodes[data.username]
  
  if (!verificationData || verificationData.code !== data.code) {
    return {
      success: false,
      code: 400,
      message: '验证码错误或已过期',
      data: null
    }
  }
  
  // 更新密码
  user.password = data.password
  // 兼容测试数据，判断是否存在updated_at字段
  if ('updated_at' in user) {
    user.updated_at = new Date().toISOString()
  }
  
  // 清除验证码
  delete verificationCodes[data.username]
  
  return {
    success: true,
    code: 200,
    message: '密码重置成功',
    data: null
  }
} 