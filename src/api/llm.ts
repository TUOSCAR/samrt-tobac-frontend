import request from '@/utils/request';

/**
 * 获取异常诊断列表
 */
export function getAnomalyDiagnosis() {
  return request({
    url: '/api/llm/anomaly-diagnosis',
    method: 'GET'
  });
}

/**
 * 获取特定异常诊断详情
 * @param id 异常诊断ID
 */
export function getAnomalyDiagnosisById(id: number) {
  return request({
    url: `/api/llm/anomaly-diagnosis/${id}`,
    method: 'GET'
  });
}

/**
 * 获取任务相关异常诊断
 * @param taskId 任务ID
 */
export function getTaskAnomalyDiagnosis(taskId: number) {
  return request({
    url: `/api/llm/anomaly-diagnosis/task/${taskId}`,
    method: 'GET'
  });
}

/**
 * 获取地块相关异常诊断
 * @param fieldId 地块ID
 */
export function getFieldAnomalyDiagnosis(fieldId: number) {
  return request({
    url: `/api/llm/anomaly-diagnosis/field/${fieldId}`,
    method: 'GET'
  });
}

/**
 * 获取异常类型分布统计
 */
export function getAnomalyTypeDistribution() {
  return request({
    url: '/api/llm/anomaly-diagnosis/type-distribution',
    method: 'GET'
  });
}

/**
 * 获取严重性分布统计
 */
export function getAnomalySeverityDistribution() {
  return request({
    url: '/api/llm/anomaly-diagnosis/severity-distribution',
    method: 'GET'
  });
}

/**
 * 获取特定地块的异常区域
 * @param fieldId 地块ID
 */
export function getFieldAnomalyAreas(fieldId: number) {
  return request({
    url: `/api/llm/anomaly-diagnosis/field/${fieldId}/areas`,
    method: 'GET'
  });
}

/**
 * 获取策略推演列表
 */
export function getStrategyRecommendations() {
  return request({
    url: '/api/llm/strategy-recommendations',
    method: 'GET'
  });
}

/**
 * 获取特定策略推演详情
 * @param id 策略ID
 */
export function getStrategyRecommendationById(id: number) {
  return request({
    url: `/api/llm/strategy-recommendations/${id}`,
    method: 'GET'
  });
}

/**
 * 获取任务相关策略推演
 * @param taskId 任务ID
 */
export function getTaskStrategyRecommendations(taskId: number) {
  return request({
    url: `/api/llm/strategy-recommendations?taskId=${taskId}`,
    method: 'GET'
  });
}

/**
 * 获取地块相关策略推演
 * @param fieldId 地块ID
 */
export function getFieldStrategyRecommendations(fieldId: number) {
  return request({
    url: `/api/llm/strategy-recommendations?fieldId=${fieldId}`,
    method: 'GET'
  });
}

/**
 * 获取分析报告列表
 */
export function getAnalysisReports() {
  return request({
    url: '/api/llm/reports',
    method: 'GET'
  });
}

/**
 * 获取特定分析报告详情
 * @param id 报告ID
 */
export function getAnalysisReportDetail(id: number) {
  return request({
    url: `/api/llm/reports/${id}`,
    method: 'GET'
  });
}

/**
 * 获取任务相关分析报告
 * @param taskId 任务ID
 */
export function getTaskAnalysisReports(taskId: number) {
  return request({
    url: `/api/llm/reports?taskId=${taskId}`,
    method: 'GET'
  });
}

/**
 * 获取地块相关分析报告
 * @param fieldId 地块ID
 */
export function getFieldAnalysisReports(fieldId: number) {
  return request({
    url: `/api/llm/reports?fieldId=${fieldId}`,
    method: 'GET'
  });
}

/**
 * 导出分析报告
 * @param id 报告ID
 * @param format 导出格式 (pdf/word)
 */
export function exportAnalysisReport(id: number, format: string) {
  return request({
    url: `/api/llm/reports/${id}/export?format=${format}`,
    method: 'GET',
    responseType: 'blob'
  });
}

/**
 * 获取监测规划列表
 */
export function getMonitoringPlans() {
  return request({
    url: '/api/llm/next-monitoring/plan',
    method: 'GET'
  });
}

/**
 * 获取特定任务的监测规划
 * @param taskId 任务ID
 */
export function getTaskMonitoringPlan(taskId: number) {
  return request({
    url: `/api/llm/next-monitoring/plan?taskId=${taskId}`,
    method: 'GET'
  });
}

/**
 * 更新监测规划状态
 * @param id 规划ID
 * @param status 状态 (approved/rejected)
 */
export function updateMonitoringPlanStatus(id: number, status: string) {
  return request({
    url: `/api/llm/next-monitoring/plan/${id}/status`,
    method: 'PUT',
    data: { status }
  });
}

/**
 * 基于监测规划创建任务
 * @param id 规划ID
 */
export function createTaskFromPlan(id: number) {
  return request({
    url: `/api/llm/next-monitoring/plan/${id}/create-task`,
    method: 'POST'
  });
} 