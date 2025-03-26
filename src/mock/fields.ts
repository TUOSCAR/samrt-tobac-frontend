import { fields } from './data'

// 获取地块列表
export function getFields(params = {}) {
  let result = [...fields]
  
  // 模拟筛选
  if (params.farmer_id) {
    result = result.filter(f => f.farmer_id === parseInt(params.farmer_id))
  }
  
  // 模拟分页
  const page = params.page || 1
  const page_size = params.page_size || 10
  const start = (page - 1) * page_size
  const end = start + page_size
  const paginatedResult = result.slice(start, end)
  
  return {
    success: true,
    code: 200,
    message: '获取地块列表成功',
    data: paginatedResult,
    meta: {
      page,
      page_size,
      total: result.length
    }
  }
}

// 获取地块详情
export function getFieldById(id) {
  const field = fields.find(f => f.id === parseInt(id))
  
  if (field) {
    return {
      success: true,
      code: 200,
      message: '获取地块详情成功',
      data: field
    }
  }
  
  return {
    success: false,
    code: 404,
    message: '地块不存在',
    data: null
  }
}

// 创建地块
export function createField(fieldData) {
  // 检查地块编码是否已存在
  if (fields.some(f => f.field_code === fieldData.field_code)) {
    return {
      success: false,
      code: 400,
      message: '地块编码已存在',
      data: null
    }
  }
  
  // 创建新地块
  const newField = {
    id: fields.length + 1,
    ...fieldData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  fields.push(newField)
  
  return {
    success: true,
    code: 200,
    message: '创建地块成功',
    data: newField
  }
}

// 更新地块
export function updateField(id, fieldData) {
  const index = fields.findIndex(f => f.id === parseInt(id))
  
  if (index === -1) {
    return {
      success: false,
      code: 404,
      message: '地块不存在',
      data: null
    }
  }
  
  // 检查地块编码是否与其他地块冲突
  if (fieldData.field_code && fields.some(f => f.id !== parseInt(id) && f.field_code === fieldData.field_code)) {
    return {
      success: false,
      code: 400,
      message: '地块编码已存在',
      data: null
    }
  }
  
  // 更新地块数据
  const updatedField = {
    ...fields[index],
    ...fieldData,
    updated_at: new Date().toISOString()
  }
  
  fields[index] = updatedField
  
  return {
    success: true,
    code: 200,
    message: '更新地块成功',
    data: updatedField
  }
}

// 删除地块
export function deleteField(id) {
  const index = fields.findIndex(f => f.id === parseInt(id))
  
  if (index === -1) {
    return {
      success: false,
      code: 404,
      message: '地块不存在',
      data: null
    }
  }
  
  fields.splice(index, 1)
  
  return {
    success: true,
    code: 200,
    message: '删除地块成功',
    data: null
  }
} 