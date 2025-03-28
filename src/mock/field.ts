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

// 地块管理模拟数据

// 地块列表数据
const fieldData = [
  {
    id: 1,
    field_name: '东区1号地块',
    area: 15.8,
    location: '东区',
    crop_variety: 'K326',
    planting_date: '2023-04-15',
    expected_harvest_date: '2023-08-20',
    responsible_person: 3,
    status: 'active'
  },
  {
    id: 2,
    field_name: '东区2号地块',
    area: 12.3,
    location: '东区',
    crop_variety: 'NC297',
    planting_date: '2023-04-18',
    expected_harvest_date: '2023-08-25',
    responsible_person: 3,
    status: 'active'
  },
  {
    id: 3,
    field_name: '西区1号地块',
    area: 18.6,
    location: '西区',
    crop_variety: 'K326',
    planting_date: '2023-04-10',
    expected_harvest_date: '2023-08-15',
    responsible_person: 4,
    status: 'active'
  },
  {
    id: 4,
    field_name: '北区试验地块',
    area: 5.2,
    location: '北区',
    crop_variety: '试验品种ABC',
    planting_date: '2023-04-05',
    expected_harvest_date: '2023-08-10',
    responsible_person: 2,
    status: 'active'
  },
  {
    id: 5,
    field_name: '南区示范地块',
    area: 20.5,
    location: '南区',
    crop_variety: 'NC297',
    planting_date: '2023-04-20',
    expected_harvest_date: '2023-08-30',
    responsible_person: 2,
    status: 'active'
  }
];

// 获取所有地块
export const getAllFields = () => {
  return {
    success: true,
    code: 200,
    message: '获取地块列表成功',
    data: fieldData
  };
};

// 根据ID获取地块详情
export const getFieldById = (id: number) => {
  const field = fieldData.find(f => f.id === id);
  
  if (field) {
    return {
      success: true,
      code: 200,
      message: '获取地块详情成功',
      data: field
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '地块不存在',
      data: null
    };
  }
};

// 获取地块相关统计信息
export const getFieldStats = () => {
  return {
    success: true,
    code: 200,
    message: '获取地块统计信息成功',
    data: {
      total_fields: fieldData.length,
      total_area: fieldData.reduce((sum, field) => sum + field.area, 0).toFixed(1),
      avg_area: (fieldData.reduce((sum, field) => sum + field.area, 0) / fieldData.length).toFixed(1),
      variety_distribution: {
        'K326': fieldData.filter(f => f.crop_variety === 'K326').length,
        'NC297': fieldData.filter(f => f.crop_variety === 'NC297').length,
        'Other': fieldData.filter(f => f.crop_variety !== 'K326' && f.crop_variety !== 'NC297').length
      }
    }
  };
};

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