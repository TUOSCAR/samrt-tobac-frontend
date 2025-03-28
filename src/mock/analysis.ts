import { Random } from 'mockjs'

// 随机生成 GeoJSON 数据
const generateRandomGeoJSON = (type: 'Point' | 'Polygon', center: number[], radius: number): any => {
  if (type === 'Point') {
    return {
      type: 'Point',
      coordinates: center
    }
  } else if (type === 'Polygon') {
    // 简单生成一个大致为圆形的多边形
    const points = []
    const sides = 8 // 八边形近似圆形
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides
      const x = center[0] + radius * Math.cos(angle)
      const y = center[1] + radius * Math.sin(angle)
      points.push([x, y])
    }
    // 闭合多边形
    points.push([...points[0]])
    
    return {
      type: 'Polygon',
      coordinates: [points]
    }
  }
  
  return null
}

// 随机生成烟株点位数据
const generatePlantPoints = (count: number, bounds: number[][]): number[][] => {
  const points = []
  for (let i = 0; i < count; i++) {
    const lat = bounds[0][0] + (bounds[1][0] - bounds[0][0]) * Math.random()
    const lng = bounds[0][1] + (bounds[1][1] - bounds[0][1]) * Math.random()
    points.push([lat, lng])
  }
  return points
}

// 生成烟株计数结果
export const generatePlantCountResult = (taskId: string, fieldId: string): any => {
  const plantCount = Random.integer(1800, 2500)
  const fieldArea = Random.float(5, 10, 1, 1) // 5-10亩
  const plantDensity = plantCount / fieldArea
  
  // 生成地块边界
  const center = [26.08 + Random.float(-0.1, 0.1, 3, 3), 119.3 + Random.float(-0.1, 0.1, 3, 3)]
  const bounds = [
    [center[0] - 0.01, center[1] - 0.01],
    [center[0] + 0.01, center[1] + 0.01]
  ]
  
  return {
    id: Random.guid(),
    taskId,
    fieldId,
    plantCount,
    plantDensity,
    geojsonPath: '/mock/plant_points.geojson',
    plantPoints: generatePlantPoints(plantCount, bounds),
    fieldBoundary: generateRandomGeoJSON('Polygon', center, 0.01),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    analysisTime: Random.float(10, 60, 1, 1), // 10-60秒
    status: 'success',
    errorMessage: null,
    sectionData: {
      sections: [
        { name: '东北区', count: Random.integer(400, 600) },
        { name: '东南区', count: Random.integer(400, 600) },
        { name: '西南区', count: Random.integer(400, 600) },
        { name: '西北区', count: Random.integer(400, 600) }
      ]
    },
    densityHeatmapData: Array(9).fill(null).map((_, i) => ({
      range: `${1600 + i * 100}-${1700 + i * 100}`,
      count: Random.integer(0, 100),
      percentage: Random.float(0, 0.3, 1, 2)
    }))
  }
}

// 生成长势分析结果
export const generateGrowthAnalysisResult = (taskId: string, fieldId: string): any => {
  // 随机生成各等级占比，总和为1
  const excellent = Random.float(0.2, 0.4, 1, 2)
  const good = Random.float(0.3, 0.5, 1, 2)
  const medium = Random.float(0.1, 0.2, 1, 2)
  const poor = 1 - excellent - good - medium
  
  // 生成地块边界
  const center = [26.08 + Random.float(-0.1, 0.1, 3, 3), 119.3 + Random.float(-0.1, 0.1, 3, 3)]
  
  // 历史数据
  const historicalData = []
  for (let i = 0; i < 5; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    historicalData.push({
      date: date.toISOString().split('T')[0],
      excellent: Random.float(0.1, 0.4, 1, 2),
      good: Random.float(0.2, 0.5, 1, 2),
      medium: Random.float(0.1, 0.3, 1, 2),
      poor: Random.float(0.05, 0.2, 1, 2)
    })
  }
  
  return {
    id: Random.guid(),
    taskId,
    fieldId,
    tifPath: '/mock/growth_grid.tif',
    excellentAreaRatio: excellent,
    goodAreaRatio: good,
    mediumAreaRatio: medium,
    poorAreaRatio: poor,
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    analysisTime: Random.float(20, 120, 1, 1), // 20-120秒
    status: 'success',
    errorMessage: null,
    fieldBoundary: generateRandomGeoJSON('Polygon', center, 0.01),
    growthGridData: Array(100).fill(null).map(() => ({
      lat: center[0] + Random.float(-0.01, 0.01, 6, 6),
      lng: center[1] + Random.float(-0.01, 0.01, 6, 6),
      value: Random.integer(1, 4) // 1-优秀, 2-良好, 3-中等, 4-较差
    })),
    historicalData
  }
}

// 生成估产分析结果
export const generateYieldEstimationResult = (taskId: string, fieldId: string): any => {
  const fieldArea = Random.float(5, 10, 1, 1) // 5-10亩
  const yieldPerMu = Random.float(180, 250, 1, 1) // 180-250kg/亩
  const estimatedYield = fieldArea * yieldPerMu
  
  // 生成地块边界
  const center = [26.08 + Random.float(-0.1, 0.1, 3, 3), 119.3 + Random.float(-0.1, 0.1, 3, 3)]
  
  // 产量趋势数据
  const trendData = []
  for (let i = 0; i < 5; i++) {
    const year = new Date().getFullYear() - i
    trendData.push({
      year,
      actual: i === 0 ? null : Random.float(180, 250, 1, 1) * fieldArea,
      estimated: Random.float(180, 250, 1, 1) * fieldArea
    })
  }
  
  // 地块分区产量
  const sectionYields = [
    { name: '东北区', area: fieldArea * 0.25, yield: Random.float(170, 260, 1, 1) },
    { name: '东南区', area: fieldArea * 0.25, yield: Random.float(170, 260, 1, 1) },
    { name: '西南区', area: fieldArea * 0.25, yield: Random.float(170, 260, 1, 1) },
    { name: '西北区', area: fieldArea * 0.25, yield: Random.float(170, 260, 1, 1) }
  ]
  
  return {
    id: Random.guid(),
    taskId,
    fieldId,
    estimatedYield,
    yieldPerMu,
    confidenceLevel: Random.float(0.8, 0.95, 1, 2),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    analysisTime: Random.float(15, 90, 1, 1), // 15-90秒
    status: 'success',
    errorMessage: null,
    fieldBoundary: generateRandomGeoJSON('Polygon', center, 0.01),
    fieldArea,
    contractYield: fieldArea * Random.float(190, 230, 1, 1), // 合同产量
    yieldTrendData: trendData,
    sectionYields,
    yieldMapData: Array(100).fill(null).map(() => ({
      lat: center[0] + Random.float(-0.01, 0.01, 6, 6),
      lng: center[1] + Random.float(-0.01, 0.01, 6, 6),
      yield: Random.float(150, 280, 1, 1) // 150-280kg/亩
    }))
  }
}

// 模拟API响应函数
// 获取烟株计数结果
export const getPlantCountResults = (taskId: string, fieldId: string): any => {
  const result = generatePlantCountResult(taskId, fieldId)
  return {
    code: 200,
    message: '获取烟株计数结果成功',
    data: result
  }
}

// 获取长势分析结果
export const getGrowthAnalysisResults = (taskId: string, fieldId: string): any => {
  const result = generateGrowthAnalysisResult(taskId, fieldId)
  return {
    code: 200,
    message: '获取长势分析结果成功',
    data: result
  }
}

// 获取估产分析结果
export const getYieldEstimationResults = (taskId: string, fieldId: string): any => {
  const result = generateYieldEstimationResult(taskId, fieldId)
  return {
    code: 200,
    message: '获取估产分析结果成功',
    data: result
  }
}

// 执行烟株计数分析
export const runPlantCountAnalysis = (taskId: string, fieldId: string): any => {
  return {
    code: 200,
    message: '烟株计数分析任务已提交',
    data: {
      jobId: Random.guid(),
      status: 'submitted',
      message: '分析任务已提交，正在处理中...'
    }
  }
}

// 执行长势分析
export const runGrowthAnalysis = (taskId: string, fieldId: string): any => {
  return {
    code: 200,
    message: '长势分析任务已提交',
    data: {
      jobId: Random.guid(),
      status: 'submitted',
      message: '分析任务已提交，正在处理中...'
    }
  }
}

// 执行估产分析
export const runYieldEstimation = (taskId: string, fieldId: string): any => {
  return {
    code: 200,
    message: '估产分析任务已提交',
    data: {
      jobId: Random.guid(),
      status: 'submitted',
      message: '分析任务已提交，正在处理中...'
    }
  }
}

// 导出Mock API
export default [
  // 获取烟株计数结果
  {
    url: '/api/analysis/plant-count/results',
    method: 'get',
    response: ({ query }: { query: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = query
      return getPlantCountResults(taskId, fieldId)
    }
  },
  
  // 获取长势分析结果
  {
    url: '/api/analysis/growth/results',
    method: 'get',
    response: ({ query }: { query: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = query
      return getGrowthAnalysisResults(taskId, fieldId)
    }
  },
  
  // 获取估产分析结果
  {
    url: '/api/analysis/yield-estimation/results',
    method: 'get',
    response: ({ query }: { query: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = query
      return getYieldEstimationResults(taskId, fieldId)
    }
  },
  
  // 执行烟株计数分析
  {
    url: '/api/analysis/plant-count',
    method: 'post',
    response: ({ body }: { body: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = body
      return runPlantCountAnalysis(taskId, fieldId)
    }
  },
  
  // 执行长势分析
  {
    url: '/api/analysis/growth',
    method: 'post',
    response: ({ body }: { body: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = body
      return runGrowthAnalysis(taskId, fieldId)
    }
  },
  
  // 执行估产分析
  {
    url: '/api/analysis/yield-estimation',
    method: 'post',
    response: ({ body }: { body: { taskId: string; fieldId: string } }) => {
      const { taskId, fieldId } = body
      return runYieldEstimation(taskId, fieldId)
    }
  }
] 