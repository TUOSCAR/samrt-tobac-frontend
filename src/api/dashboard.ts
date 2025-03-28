import request from '@/utils/request'

export interface DashboardStats {
  totalFields: number
  activeFields: number
  totalUsers: number
  recentActivities: number
}

export interface WorkbenchData {
  assignedFields: number
  pendingTasks: number
  recentNotifications: number
}

export interface FarmerDashboard {
  myFields: number
  cropStatus: string
  nextTasks: number
}

export const getDashboardStats = () => {
  return request<DashboardStats>({
    url: '/api/dashboard/stats',
    method: 'get'
  })
}

export const getWorkbenchData = () => {
  return request<WorkbenchData>({
    url: '/api/workbench/data',
    method: 'get'
  })
}

export const getFarmerDashboard = () => {
  return request<FarmerDashboard>({
    url: '/api/farmer/dashboard',
    method: 'get'
  })
} 