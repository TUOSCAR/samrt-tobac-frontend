import {
  login,
  register,
  logout,
  getUserInfo,
  sendVerificationCode,
  verifyResetCode,
  resetPassword
} from './auth'
import { getFields, getFieldById, createField, updateField, deleteField } from './fields'
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from './notification'
import { 
  getPlantCountResults, 
  getGrowthAnalysisResults, 
  getYieldEstimationResults,
  runPlantCountAnalysis,
  runGrowthAnalysis,
  runYieldEstimation
} from './analysis'
import { taskList, taskTypes } from './task'
import {
  getAnomalyDiagnosis,
  getAnomalyTypes,
  getSeverityDistribution,
  getAnomalyAreas,
  getStrategyRecommendations,
  getAnalysisReports,
  getMonitoringPlans,
  updateMonitoringPlanStatus
} from './llm'

// 生成简单的字段数据
const generateFieldsByTaskId = (taskId: string) => {
  const count = Math.floor(Math.random() * 5) + 1
  return Array(count).fill(0).map((_, index) => ({
    id: `field_${taskId}_${index}`,
    name: `烟田 ${index + 1}`,
    code: `F${100 + index}`,
    area: Math.round(Math.random() * 10 + 5),
    status: ['normal', 'warning', 'offline'][Math.floor(Math.random() * 3)],
    location: {
      lat: 30.279 + (Math.random() - 0.5) * 0.1,
      lng: 120.165 + (Math.random() - 0.5) * 0.1
    }
  }))
}

// 注册所有mock API
const mockApis: Record<string, any> = {
  // 认证相关
  'POST /api/auth/login': login,
  'POST /api/auth/register': register,
  'POST /api/auth/logout': logout,
  'GET /api/auth/user-info': getUserInfo,
  'POST /api/auth/send-verification-code': sendVerificationCode,
  'POST /api/auth/verify-reset-code': verifyResetCode,
  'POST /api/auth/reset-password': resetPassword,
  
  // 地块相关
  'GET /api/fields': getFields,
  'GET /api/fields/:id': getFieldById,
  'POST /api/fields': createField,
  'PUT /api/fields/:id': updateField,
  'DELETE /api/fields/:id': deleteField,
  
  // 通知相关
  'GET /api/notifications': getNotifications,
  'PUT /api/notifications/:id/read': markAsRead,
  'PUT /api/notifications/mark-all-read': markAllAsRead,
  'DELETE /api/notifications': clearNotifications,
  
  // 分析结果相关
  'GET /api/analysis/plant-count/results': getPlantCountResults,
  'GET /api/analysis/growth/results': getGrowthAnalysisResults,
  'GET /api/analysis/yield-estimation/results': getYieldEstimationResults,
  'POST /api/analysis/plant-count': runPlantCountAnalysis,
  'POST /api/analysis/growth': runGrowthAnalysis,
  'POST /api/analysis/yield-estimation': runYieldEstimation,
  
  // 任务相关
  'GET /api/monitoring-tasks': ({ query }: { query: any }) => {
    // 简单的分页逻辑
    const page = parseInt(query.page) || 1
    const pageSize = parseInt(query.pageSize) || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '获取任务列表成功',
      data: {
        list: taskList.slice(start, end),
        total: taskList.length,
        page,
        pageSize
      }
    }
  },
  'GET /api/config/monitoring-task-types': () => {
    return {
      code: 200,
      message: '获取任务类型成功',
      data: taskTypes
    }
  },
  'GET /api/monitoring-tasks/:id/fields': ({ params }: { params: any }) => {
    const { id } = params
    const fields = generateFieldsByTaskId(id)
    
    return {
      code: 200,
      message: '获取任务地块成功',
      data: fields
    }
  },
  
  // 大模型分析相关
  // 异常诊断
  'GET /api/llm/anomaly-diagnosis/': ({ query }: { query: any }) => getAnomalyDiagnosis(query),
  'GET /api/llm/anomaly-diagnosis/:id/': ({ params }: { params: any }) => {
    const result = getAnomalyDiagnosis({}).data.find(item => item.id === parseInt(params.id));
    return {
      success: true,
      code: 200,
      message: '获取异常诊断详情成功',
      data: result
    };
  },
  'GET /api/llm/anomaly-diagnosis/task/:taskId/': ({ params }: { params: any }) => 
    getAnomalyDiagnosis({ monitoring_task_id: params.taskId }),
  'GET /api/llm/anomaly-diagnosis/field/:fieldId/': ({ params }: { params: any }) => 
    getAnomalyDiagnosis({ field_id: params.fieldId }),
  'GET /api/llm/anomaly-diagnosis/type-distribution/': getAnomalyTypes,
  'GET /api/llm/anomaly-diagnosis/severity-distribution/': getSeverityDistribution,
  'GET /api/llm/anomaly-diagnosis/field/:fieldId/areas/': ({ params }: { params: any }) => 
    getAnomalyAreas({ field_id: params.fieldId }),
  
  // 策略推演
  'GET /api/llm/strategy-recommendations/': ({ query }: { query: any }) => getStrategyRecommendations(query),
  'GET /api/llm/strategy-recommendations/:id/': ({ params }: { params: any }) => {
    const result = getStrategyRecommendations({}).data.find(item => item.id === parseInt(params.id));
    return {
      success: true,
      code: 200,
      message: '获取策略推演详情成功',
      data: result
    };
  },
  'GET /api/llm/strategy-recommendations/task/:taskId/': ({ params }: { params: any }) => 
    getStrategyRecommendations({ monitoring_task_id: params.taskId }),
  'GET /api/llm/strategy-recommendations/field/:fieldId/': ({ params }: { params: any }) => 
    getStrategyRecommendations({ field_id: params.fieldId }),
  
  // 分析报告
  'GET /api/llm/reports/': ({ query }: { query: any }) => getAnalysisReports(query),
  'GET /api/llm/reports/:id/': ({ params }: { params: any }) => {
    const result = getAnalysisReports({}).data.find(item => item.id === parseInt(params.id));
    return {
      success: true,
      code: 200,
      message: '获取分析报告详情成功',
      data: result
    };
  },
  'GET /api/llm/reports/task/:taskId/': ({ params }: { params: any }) => 
    getAnalysisReports({ monitoring_task_id: params.taskId }),
  'GET /api/llm/reports/field/:fieldId/': ({ params }: { params: any }) => 
    getAnalysisReports({ field_id: params.fieldId }),
  'GET /api/llm/reports/:id/export/': ({ params }: { params: any }) => {
    // 实际导出操作由前端处理
    return {
      success: true,
      code: 200,
      message: '导出报告请求成功',
      data: { id: params.id }
    };
  },
  
  // 下次监测规划
  'GET /api/llm/next-monitoring/plan/': ({ query }: { query: any }) => getMonitoringPlans(query),
  'GET /api/llm/next-monitoring/plan/task/:taskId/': ({ params }: { params: any }) => 
    getMonitoringPlans({ monitoring_task_id: params.taskId }),
  'PUT /api/llm/next-monitoring/plan/:id/status/': ({ params, body }: { params: any, body: any }) => 
    updateMonitoringPlanStatus(parseInt(params.id), body.status),
  'POST /api/llm/next-monitoring/plan/:id/create-task/': ({ params }: { params: any }) => {
    return {
      success: true,
      code: 200,
      message: '创建新监测任务成功',
      data: {
        taskId: new Date().getTime(),
        planId: params.id
      }
    };
  }
}

// 判断是否使用Mock数据
const isMock = import.meta.env.VITE_USE_MOCK !== 'false'

// 启动mock服务
export function setupMock() {
  if (isMock) {
    console.log('Mock服务已启用')
  } else {
    console.log('Mock服务已禁用')
  }
}

// 根据请求路径和方法获取对应的mock处理函数
export function getMockHandler(url: string, method: string) {
  if (!isMock) return null
  
  // 构造完整的路由键 METHOD /path
  const key = `${method.toUpperCase()} ${url}`
  
  // 匹配完全相同的路由
  if (mockApis[key]) {
    return mockApis[key]
  }
  
  // 匹配带参数的路由 如 /api/fields/:id
  for (const apiPattern in mockApis) {
    if (isMatchPattern(apiPattern, key)) {
      return mockApis[apiPattern]
    }
  }
  
  console.warn(`未找到匹配的Mock API: ${key}`)
  return null
}

// 判断请求是否匹配模式
function isMatchPattern(pattern: string, actual: string) {
  // 如果模式和实际路径完全匹配，返回true
  if (pattern === actual) return true
  
  // 分解模式和实际路径
  const [patternMethod, patternPath] = pattern.split(' ')
  const [actualMethod, actualPath] = actual.split(' ')
  
  // 如果方法不同，返回false
  if (patternMethod !== actualMethod) return false
  
  // 分解路径段
  const patternSegments = patternPath.split('/')
  const actualSegments = actualPath.split('/')
  
  // 如果路径段数量不同，返回false
  if (patternSegments.length !== actualSegments.length) return false
  
  // 逐段比较
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i]
    const actualSeg = actualSegments[i]
    
    // 如果是参数段(以:开头)，跳过比较
    if (patternSeg.startsWith(':')) continue
    
    // 否则段必须完全匹配
    if (patternSeg !== actualSeg) return false
  }
  
  return true
} 