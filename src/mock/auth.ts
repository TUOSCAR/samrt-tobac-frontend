import { users } from './data'

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
  const newUser = {
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
  
  users.push(newUser)
  
  return {
    success: true,
    code: 200,
    message: '注册成功',
    data: { ...newUser, password: undefined }
  }
} 