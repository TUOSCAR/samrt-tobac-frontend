import { MockMethod } from 'vite-plugin-mock'

const users = [
  {
    id: 1,
    username: 'admin',
    role: 'admin',
    status: 'active',
    createTime: '2024-01-01 00:00:00'
  },
  {
    id: 2,
    username: 'technician1',
    role: 'technician',
    status: 'active',
    createTime: '2024-01-02 00:00:00'
  },
  {
    id: 3,
    username: 'farmer1',
    role: 'farmer',
    status: 'active',
    createTime: '2024-01-03 00:00:00'
  }
]

const permissions = [
  {
    id: 1,
    name: '地块管理',
    code: 'field:manage',
    description: '管理地块信息'
  },
  {
    id: 2,
    name: '数据查看',
    code: 'data:view',
    description: '查看系统数据'
  },
  {
    id: 3,
    name: '用户管理',
    code: 'user:manage',
    description: '管理系统用户'
  }
]

const systemParameters = [
  {
    id: 1,
    key: 'system.name',
    value: '智能烟草种植管理系统',
    description: '系统名称'
  },
  {
    id: 2,
    key: 'system.version',
    value: '1.0.0',
    description: '系统版本'
  }
]

export default [
  {
    url: '/api/system/users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: users
      }
    }
  },
  {
    url: '/api/system/users',
    method: 'post',
    response: ({ body }) => {
      const newUser = {
        id: users.length + 1,
        ...body,
        createTime: new Date().toISOString()
      }
      users.push(newUser)
      return {
        code: 200,
        data: newUser
      }
    }
  },
  {
    url: '/api/system/users/:id',
    method: 'put',
    response: ({ query, body }) => {
      const user = users.find(u => u.id === parseInt(query.id))
      if (user) {
        Object.assign(user, body)
        return {
          code: 200,
          data: user
        }
      }
      return {
        code: 404,
        message: '用户不存在'
      }
    }
  },
  {
    url: '/api/system/users/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = users.findIndex(u => u.id === parseInt(query.id))
      if (index > -1) {
        users.splice(index, 1)
        return {
          code: 200,
          message: '删除成功'
        }
      }
      return {
        code: 404,
        message: '用户不存在'
      }
    }
  },
  {
    url: '/api/system/permissions',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: permissions
      }
    }
  },
  {
    url: '/api/system/parameters',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: systemParameters
      }
    }
  },
  {
    url: '/api/system/parameters/:id',
    method: 'put',
    response: ({ query, body }) => {
      const param = systemParameters.find(p => p.id === parseInt(query.id))
      if (param) {
        Object.assign(param, body)
        return {
          code: 200,
          data: param
        }
      }
      return {
        code: 404,
        message: '参数不存在'
      }
    }
  }
] as MockMethod[] 