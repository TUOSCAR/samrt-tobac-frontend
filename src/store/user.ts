import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/auth'
import router from '@/router'

interface UserState {
  token: string | null
  user: any | null
  isLoading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    user: null,
    isLoading: false
  }),
  
  getters: {
    isLoggedIn(): boolean {
      return !!this.token
    }
  },
  
  actions: {
    // 保存token到本地存储
    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    
    // 登录操作
    async login(username: string, password: string) {
      try {
        this.isLoading = true
        console.log('Store: 调用登录API')
        const response = await login(username, password)
        console.log('Store: 登录API响应', response)
        
        if (response.success) {
          this.setToken(response.data.token)
          this.user = response.data.user
          console.log('Store: 登录成功，用户信息已保存', this.user)
          return { success: true }
        }
        
        return { success: false, message: response.message }
      } catch (error) {
        console.error('Store: 登录过程出错', error)
        return { success: false, message: '登录失败，请稍后重试' }
      } finally {
        this.isLoading = false
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      if (!this.token) return
      
      try {
        this.isLoading = true
        const response = await getUserInfo()
        
        if (response.success) {
          this.user = response.data
          return { success: true }
        }
        
        this.logout()
        return { success: false, message: response.message }
      } catch (error) {
        this.logout()
        return { success: false, message: '获取用户信息失败' }
      } finally {
        this.isLoading = false
      }
    },
    
    // 登出操作
    async logout() {
      try {
        this.isLoading = true
        if (this.token) {
          await logout()
        }
      } catch (error) {
        // 即使API调用失败也继续清除状态
      } finally {
        this.setToken(null)
        this.user = null
        this.isLoading = false
        router.push('/login')
      }
    }
  }
}) 