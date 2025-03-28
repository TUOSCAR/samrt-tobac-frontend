import request from '@/utils/request'

export interface User {
  id: number
  username: string
  role: string
  status: string
  createTime: string
}

export interface Permission {
  id: number
  name: string
  code: string
  description: string
}

export interface SystemParameter {
  id: number
  key: string
  value: string
  description: string
}

export interface AnalysisParameter {
  id: number
  group: string
  name: string
  key: string
  value: string
  defaultValue: string
  description: string
  type: 'text' | 'number' | 'boolean' | 'select'
  options?: { label: string; value: string }[]
}

export const getUsers = () => {
  return request<User[]>({
    url: '/api/system/users',
    method: 'get'
  })
}

export const createUser = (data: Partial<User>) => {
  return request<User>({
    url: '/api/system/users',
    method: 'post',
    data
  })
}

export const updateUser = (id: number, data: Partial<User>) => {
  return request<User>({
    url: `/api/system/users/${id}`,
    method: 'put',
    data
  })
}

export const deleteUser = (id: number) => {
  return request({
    url: `/api/system/users/${id}`,
    method: 'delete'
  })
}

export const getPermissions = () => {
  return request<Permission[]>({
    url: '/api/system/permissions',
    method: 'get'
  })
}

export const getSystemParameters = () => {
  return request<SystemParameter[]>({
    url: '/api/system/parameters',
    method: 'get'
  })
}

export const updateSystemParameter = (id: number, data: Partial<SystemParameter>) => {
  return request<SystemParameter>({
    url: `/api/system/parameters/${id}`,
    method: 'put',
    data
  })
}

export const getAnalysisParameters = (group?: string) => {
  return request<AnalysisParameter[]>({
    url: '/api/system/analysis-parameters',
    method: 'get',
    params: { group }
  })
}

export const updateAnalysisParameter = (id: number, data: Partial<AnalysisParameter>) => {
  return request<AnalysisParameter>({
    url: `/api/system/analysis-parameters/${id}`,
    method: 'put',
    data
  })
}

export const testAnalysisParameter = (id: number) => {
  return request({
    url: `/api/system/analysis-parameters/${id}/test`,
    method: 'post'
  })
} 