import { MockMethod } from 'vite-plugin-mock'

// 地块列表数据
const fieldList = [
  {
    id: 'F001',
    code: 'F001',
    name: '示范地块1',
    area: 10.5,
    variety: '云烟87',
    plantingDate: '2024-03-01',
    expectedHarvestDate: '2024-07-01',
    manager: '张三',
    phone: '13800138000',
    status: 'normal',
    location: {
      lat: 24.8,
      lng: 102.8,
      bounds: [
        [24.79, 102.79],
        [24.81, 102.81]
      ]
    }
  },
  {
    id: 'F002',
    code: 'F002',
    name: '示范地块2',
    area: 15.2,
    variety: '红大',
    plantingDate: '2024-03-05',
    expectedHarvestDate: '2024-07-05',
    manager: '李四',
    phone: '13800138001',
    status: 'pending',
    location: {
      lat: 24.85,
      lng: 102.85,
      bounds: [
        [24.84, 102.84],
        [24.86, 102.86]
      ]
    }
  }
]

// 地块环境数据
const environmentData = {
  temperature: 25.6,
  temperatureTrend: 2.5,
  humidity: 65,
  humidityTrend: -1.2,
  light: 12000,
  lightTrend: 5.8,
  soilMoisture: 45,
  soilMoistureTrend: 0,
  history: [
    {
      time: '2024-03-15 14:30',
      temperature: 25.6,
      humidity: 65,
      light: 12000,
      soilMoisture: 45
    },
    {
      time: '2024-03-15 13:30',
      temperature: 25.2,
      humidity: 66,
      light: 11500,
      soilMoisture: 46
    }
  ]
}

// 地块监测数据
const monitoringData = [
  {
    id: 'M001',
    date: '2024-03-15 14:30',
    growthStage: '生长期',
    plantHeight: 45.5,
    leafCount: 12,
    pestStatus: '正常',
    notes: '生长良好'
  },
  {
    id: 'M002',
    date: '2024-03-10 10:00',
    growthStage: '生长期',
    plantHeight: 40.2,
    leafCount: 10,
    pestStatus: '正常',
    notes: '生长正常'
  }
]

export default [
  // 获取地块列表
  {
    url: '/api/field/list',
    method: 'get',
    response: ({ query }) => {
      const { keyword, status, variety, minArea, maxArea, plantingDateRange, manager } = query
      let filteredList = [...fieldList]

      // 关键词搜索
      if (keyword) {
        filteredList = filteredList.filter(item => 
          item.name.includes(keyword) || item.code.includes(keyword)
        )
      }

      // 状态筛选
      if (status) {
        filteredList = filteredList.filter(item => item.status === status)
      }

      // 品种筛选
      if (variety) {
        filteredList = filteredList.filter(item => item.variety === variety)
      }

      // 面积范围筛选
      if (minArea) {
        filteredList = filteredList.filter(item => item.area >= Number(minArea))
      }
      if (maxArea) {
        filteredList = filteredList.filter(item => item.area <= Number(maxArea))
      }

      // 种植时间范围筛选
      if (plantingDateRange) {
        const [startDate, endDate] = plantingDateRange.split(',')
        filteredList = filteredList.filter(item => 
          item.plantingDate >= startDate && item.plantingDate <= endDate
        )
      }

      // 负责人筛选
      if (manager) {
        filteredList = filteredList.filter(item => item.manager.includes(manager))
      }

      return {
        code: 200,
        data: {
          list: filteredList,
          total: filteredList.length
        }
      }
    }
  },

  // 获取地块详情
  {
    url: '/api/field/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      return {
        code: 200,
        data: field
      }
    }
  },

  // 创建地块
  {
    url: '/api/field/create',
    method: 'post',
    response: ({ body }) => {
      const newField = {
        id: `F${String(fieldList.length + 1).padStart(3, '0')}`,
        ...body,
        status: 'normal'
      }
      fieldList.push(newField)
      
      return {
        code: 200,
        data: newField
      }
    }
  },

  // 更新地块
  {
    url: '/api/field/update',
    method: 'put',
    response: ({ query, body }) => {
      const { id } = query
      const index = fieldList.findIndex(item => item.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      fieldList[index] = {
        ...fieldList[index],
        ...body
      }

      return {
        code: 200,
        data: fieldList[index]
      }
    }
  },

  // 删除地块
  {
    url: '/api/field/delete',
    method: 'delete',
    response: ({ query }) => {
      const { id } = query
      const index = fieldList.findIndex(item => item.id === id)
      
      if (index === -1) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      fieldList.splice(index, 1)

      return {
        code: 200,
        message: '删除成功'
      }
    }
  },

  // 获取地块环境数据
  {
    url: '/api/field/environment',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      return {
        code: 200,
        data: environmentData
      }
    }
  },

  // 获取地块监测数据
  {
    url: '/api/field/monitoring',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      return {
        code: 200,
        data: monitoringData
      }
    }
  },

  // 添加监测记录
  {
    url: '/api/field/monitoring/add',
    method: 'post',
    response: ({ query, body }) => {
      const { id } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      const newRecord = {
        id: `M${String(monitoringData.length + 1).padStart(3, '0')}`,
        ...body
      }
      monitoringData.unshift(newRecord)

      return {
        code: 200,
        data: newRecord
      }
    }
  },

  // 更新监测记录
  {
    url: '/api/field/monitoring/update',
    method: 'put',
    response: ({ query, body }) => {
      const { id, recordId } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      const index = monitoringData.findIndex(item => item.id === recordId)
      if (index === -1) {
        return {
          code: 404,
          message: '监测记录不存在'
        }
      }

      monitoringData[index] = {
        ...monitoringData[index],
        ...body
      }

      return {
        code: 200,
        data: monitoringData[index]
      }
    }
  },

  // 删除监测记录
  {
    url: '/api/field/monitoring/delete',
    method: 'delete',
    response: ({ query }) => {
      const { id, recordId } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      const index = monitoringData.findIndex(item => item.id === recordId)
      if (index === -1) {
        return {
          code: 404,
          message: '监测记录不存在'
        }
      }

      monitoringData.splice(index, 1)

      return {
        code: 200,
        message: '删除成功'
      }
    }
  },

  // 导出地块数据
  {
    url: '/api/field/export',
    method: 'get',
    response: ({ query }) => {
      const { id } = query
      const field = fieldList.find(item => item.id === id)
      
      if (!field) {
        return {
          code: 404,
          message: '地块不存在'
        }
      }

      // 模拟导出数据
      const exportData = {
        field: field,
        environment: environmentData,
        monitoring: monitoringData
      }

      return {
        code: 200,
        data: JSON.stringify(exportData, null, 2)
      }
    }
  }
] as MockMethod[] 