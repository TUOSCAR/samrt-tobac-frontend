import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          totalFields: 156,
          activeFields: 89,
          totalUsers: 45,
          recentActivities: 12
        }
      }
    }
  },
  {
    url: '/api/workbench/data',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          assignedFields: 8,
          pendingTasks: 5,
          recentNotifications: 3
        }
      }
    }
  },
  {
    url: '/api/farmer/dashboard',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          myFields: 3,
          cropStatus: '生长良好',
          nextTasks: 2
        }
      }
    }
  }
] as MockMethod[] 