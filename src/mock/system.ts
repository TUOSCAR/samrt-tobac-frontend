import { MockMethod } from 'vite-plugin-mock'

export const users = [
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
  },
  {
    id: 4,
    username: 'technician2',
    role: 'technician',
    status: 'active',
    createTime: '2024-01-04 00:00:00'
  },
  {
    id: 5,
    username: 'farmer2',
    role: 'farmer',
    status: 'active',
    createTime: '2024-01-05 00:00:00'
  },
  {
    id: 6,
    username: 'visitor',
    role: 'visitor',
    status: 'active',
    createTime: '2024-01-06 00:00:00'
  }
]

export const permissions = [
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
  },
  {
    id: 4,
    name: '任务创建',
    code: 'task:create',
    description: '创建监测任务'
  },
  {
    id: 5,
    name: '任务编辑',
    code: 'task:edit',
    description: '编辑监测任务'
  },
  {
    id: 6,
    name: '任务删除',
    code: 'task:delete',
    description: '删除监测任务'
  },
  {
    id: 7,
    name: '任务查看',
    code: 'task:view',
    description: '查看监测任务'
  },
  {
    id: 8,
    name: '执行任务管理',
    code: 'execution:manage',
    description: '管理执行任务'
  },
  {
    id: 9,
    name: '农事记录管理',
    code: 'farming:manage',
    description: '管理农事记录'
  },
  {
    id: 10,
    name: '数据分析',
    code: 'analysis:perform',
    description: '执行数据分析'
  },
  {
    id: 11,
    name: '系统配置',
    code: 'system:config',
    description: '配置系统参数'
  },
  {
    id: 12,
    name: '角色管理',
    code: 'role:manage',
    description: '管理系统角色'
  }
]

export const systemParameters = [
  {
    id: 1,
    key: 'system.name',
    value: '智慧烟田监测与决策支持系统',
    description: '系统名称'
  },
  {
    id: 2,
    key: 'system.version',
    value: '1.0.0',
    description: '系统版本'
  },
  {
    id: 3,
    key: 'system.copyright',
    value: '© 2023-2024 智慧烟田',
    description: '版权信息'
  },
  {
    id: 4,
    key: 'system.defaultLanguage',
    value: 'zh-CN',
    description: '默认语言'
  },
  {
    id: 5,
    key: 'notification.enableEmail',
    value: 'true',
    description: '启用邮件通知'
  },
  {
    id: 6,
    key: 'notification.enableSMS',
    value: 'false',
    description: '启用短信通知'
  },
  {
    id: 7,
    key: 'notification.emailSender',
    value: 'noreply@smarttobacco.com',
    description: '通知邮件发送者'
  },
  {
    id: 8,
    key: 'security.passwordMinLength',
    value: '6',
    description: '密码最小长度'
  },
  {
    id: 9,
    key: 'security.loginAttempts',
    value: '5',
    description: '最大登录尝试次数'
  },
  {
    id: 10,
    key: 'security.sessionTimeout',
    value: '120',
    description: '会话超时时间(分钟)'
  },
  {
    id: 11,
    key: 'integration.weatherApiKey',
    value: 'abcdef123456',
    description: '天气API密钥'
  },
  {
    id: 12,
    key: 'integration.llmApiEndpoint',
    value: 'https://api.dify.ai/v1',
    description: '大模型API地址'
  },
  {
    id: 13,
    key: 'integration.mapProvider',
    value: 'leaflet',
    description: '地图服务提供商'
  }
]

export const analysisParameters = [
  // 烟株计数参数
  {
    id: 1,
    group: 'plantCount',
    name: '检测阈值',
    key: 'plantCount.detectionThreshold',
    value: '0.75',
    defaultValue: '0.75',
    description: '烟株检测的置信度阈值',
    type: 'number'
  },
  {
    id: 2,
    group: 'plantCount',
    name: '最小目标尺寸',
    key: 'plantCount.minObjectSize',
    value: '10',
    defaultValue: '10',
    description: '最小识别烟株的像素尺寸',
    type: 'number'
  },
  {
    id: 3,
    group: 'plantCount',
    name: '非极大值抑制',
    key: 'plantCount.nmsThreshold',
    value: '0.3',
    defaultValue: '0.3',
    description: '非极大值抑制阈值',
    type: 'number'
  },
  // 长势分析参数
  {
    id: 4,
    group: 'growth',
    name: '植被指数类型',
    key: 'growth.indexType',
    value: 'NDVI',
    defaultValue: 'NDVI',
    description: '使用的植被指数类型',
    type: 'select',
    options: [
      { label: 'NDVI', value: 'NDVI' },
      { label: 'EVI', value: 'EVI' },
      { label: 'SAVI', value: 'SAVI' }
    ]
  },
  {
    id: 5,
    group: 'growth',
    name: '优等长势阈值',
    key: 'growth.excellentThreshold',
    value: '0.7',
    defaultValue: '0.7',
    description: '优等长势的NDVI阈值',
    type: 'number'
  },
  {
    id: 6,
    group: 'growth',
    name: '良好长势阈值',
    key: 'growth.goodThreshold',
    value: '0.5',
    defaultValue: '0.5',
    description: '良好长势的NDVI阈值',
    type: 'number'
  },
  // 估产分析参数
  {
    id: 7,
    group: 'yield',
    name: '单叶重量模型',
    key: 'yield.leafWeightModel',
    value: 'linear',
    defaultValue: 'linear',
    description: '单叶重量预测模型',
    type: 'select',
    options: [
      { label: '线性模型', value: 'linear' },
      { label: '指数模型', value: 'exponential' },
      { label: '多项式模型', value: 'polynomial' }
    ]
  },
  {
    id: 8,
    group: 'yield',
    name: '校正因子',
    key: 'yield.correctionFactor',
    value: '1.05',
    defaultValue: '1.05',
    description: '估产结果校正因子',
    type: 'number'
  },
  // 大模型参数
  {
    id: 9,
    group: 'llm',
    name: '模型类型',
    key: 'llm.modelType',
    value: 'gpt-3.5-turbo',
    defaultValue: 'gpt-3.5-turbo',
    description: '使用的大模型类型',
    type: 'select',
    options: [
      { label: 'GPT-3.5', value: 'gpt-3.5-turbo' },
      { label: 'GPT-4', value: 'gpt-4' },
      { label: 'Claude', value: 'claude' }
    ]
  },
  {
    id: 10,
    group: 'llm',
    name: '温度',
    key: 'llm.temperature',
    value: '0.7',
    defaultValue: '0.7',
    description: '回复的随机性，值越高随机性越大',
    type: 'number'
  },
  {
    id: 11,
    group: 'llm',
    name: '上下文历史长度',
    key: 'llm.contextLength',
    value: '10',
    defaultValue: '10',
    description: '保留的对话轮次',
    type: 'number'
  },
  {
    id: 12,
    group: 'llm',
    name: '启用长期记忆',
    key: 'llm.enableLongTermMemory',
    value: 'true',
    defaultValue: 'true',
    description: '是否启用长期记忆功能',
    type: 'boolean'
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
  },
  {
    url: '/api/system/analysis-parameters',
    method: 'get',
    response: ({ query }) => {
      let result = [...analysisParameters]
      
      // 如果指定了分组，过滤结果
      if (query.group) {
        result = result.filter(p => p.group === query.group)
      }
      
      return {
        code: 200,
        data: result
      }
    }
  },
  {
    url: '/api/system/analysis-parameters/:id',
    method: 'put',
    response: ({ query, body }) => {
      const param = analysisParameters.find(p => p.id === parseInt(query.id))
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
  },
  {
    url: '/api/system/analysis-parameters/:id/test',
    method: 'post',
    response: ({ query }) => {
      const param = analysisParameters.find(p => p.id === parseInt(query.id))
      if (!param) {
        return {
          code: 404,
          message: '参数不存在'
        }
      }
      
      // 模拟测试结果
      const isSuccess = Math.random() > 0.3 // 70%概率成功
      const testTime = Math.floor(Math.random() * 1000) + 500 // 500-1500ms
      
      let recommendedValue = ''
      if (!isSuccess) {
        // 生成一个推荐值
        if (param.type === 'number') {
          const currentValue = parseFloat(param.value)
          const variation = currentValue * 0.2 // 20%的变化
          recommendedValue = (currentValue + (Math.random() * variation - variation / 2)).toFixed(2)
        } else if (param.type === 'select' && param.options) {
          const currentIndex = param.options.findIndex(opt => opt.value === param.value)
          const newIndex = (currentIndex + 1) % param.options.length
          recommendedValue = param.options[newIndex].value
        } else if (param.type === 'boolean') {
          recommendedValue = param.value === 'true' ? 'false' : 'true'
        } else {
          recommendedValue = param.defaultValue
        }
      }
      
      return {
        code: 200,
        data: {
          group: param.group,
          name: param.name,
          value: param.value,
          time: testTime,
          status: isSuccess ? 'success' : 'failure',
          details: isSuccess 
            ? `参数 "${param.name}" 测试成功，当前设置值可以正常工作。`
            : `参数 "${param.name}" 测试失败，当前值可能不是最优设置。建议使用推荐值: ${recommendedValue}`,
          recommendedValue: isSuccess ? undefined : recommendedValue
        }
      }
    }
  }
] as MockMethod[] 