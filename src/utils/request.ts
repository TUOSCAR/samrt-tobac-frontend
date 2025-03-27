import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const userStore = useUserStore()
    
    // 如果有token则添加到请求头
    if (userStore.token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    
    return config
  },
  (error) => {
    console.error('请求错误', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    
    // 如果返回的状态码不是200，说明接口请求失败
    if (data.code !== 200) {
      ElMessage({
        message: data.message || '系统错误',
        type: 'error',
        duration: 5 * 1000
      })
      
      // 如果是未授权，登出并跳转到登录页
      if (data.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
      }
      
      return Promise.reject(new Error(data.message || '系统错误'))
    }
    
    return data
  },
  (error) => {
    console.error('响应错误', error)
    
    let message = '连接服务器失败'
    if (error.response) {
      message = error.response.data?.message || `请求错误(${error.response.status})`
      
      // 如果是未授权，登出并跳转到登录页
      if (error.response.status === 401) {
        const userStore = useUserStore()
        userStore.logout()
      }
    }
    
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    })
    
    return Promise.reject(error)
  }
)

export default service 