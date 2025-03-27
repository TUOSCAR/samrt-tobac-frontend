import request from '@/utils/request'

/**
 * 获取烟株计数分析结果
 */
export function getPlantCountResults(taskId: string, fieldId: string) {
  return request({
    url: `/api/analysis/plant-count/results`,
    method: 'get',
    params: { taskId, fieldId }
  })
}

/**
 * 获取长势分析结果
 */
export function getGrowthAnalysisResults(taskId: string, fieldId: string) {
  return request({
    url: `/api/analysis/growth/results`,
    method: 'get',
    params: { taskId, fieldId }
  })
}

/**
 * 获取估产分析结果
 */
export function getYieldEstimationResults(taskId: string, fieldId: string) {
  return request({
    url: `/api/analysis/yield-estimation/results`,
    method: 'get',
    params: { taskId, fieldId }
  })
}

/**
 * 执行烟株计数分析
 */
export function runPlantCountAnalysis(data: { taskId: string; fieldId: string }) {
  return request({
    url: `/api/analysis/plant-count`,
    method: 'post',
    data
  })
}

/**
 * 执行长势分析
 */
export function runGrowthAnalysis(data: { taskId: string; fieldId: string }) {
  return request({
    url: `/api/analysis/growth`,
    method: 'post',
    data
  })
}

/**
 * 执行估产分析
 */
export function runYieldEstimation(data: { taskId: string; fieldId: string }) {
  return request({
    url: `/api/analysis/yield-estimation`,
    method: 'post',
    data
  })
} 