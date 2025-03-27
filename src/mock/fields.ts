import mockField from './field'

// 包装 API 函数
export const getFields = (params: any) => {
  const handler = mockField.find(item => item.url === '/api/field/list' && item.method === 'get')
  return handler?.response({ query: params })
}

export const getFieldById = (id: string) => {
  const handler = mockField.find(item => item.url === '/api/field/detail' && item.method === 'get')
  return handler?.response({ query: { id } })
}

export const createField = (data: any) => {
  const handler = mockField.find(item => item.url === '/api/field/create' && item.method === 'post')
  return handler?.response({ body: data })
}

export const updateField = (id: string, data: any) => {
  const handler = mockField.find(item => item.url === '/api/field/update' && item.method === 'put')
  return handler?.response({ query: { id }, body: data })
}

export const deleteField = (id: string) => {
  const handler = mockField.find(item => item.url === '/api/field/delete' && item.method === 'delete')
  return handler?.response({ query: { id } })
} 