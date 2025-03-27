import { TaskStatus, TaskPriority, GrowingPhase } from '@/types/task'
import { Random } from 'mockjs'

// 生成随机ID
const generateId = () => {
  return Random.guid().substring(0, 8)
}

// 监测任务类型列表
export const taskTypes = [
  {
    id: '1',
    code: 'regular',
    name: '常规监测',
    description: '按照烟叶生长周期的常规监测任务',
    requiredAnalysis: ['plant_count', 'growth', 'yield']
  },
  {
    id: '2',
    code: 'emergency',
    name: '紧急监测',
    description: '应对突发情况的紧急监测任务',
    requiredAnalysis: ['plant_count', 'growth']
  },
  {
    id: '3',
    code: 'special',
    name: '专项监测',
    description: '针对特定问题的专项监测任务',
    requiredAnalysis: ['growth']
  }
]

// 生成监测任务列表
export const generateTaskList = (count = 30) => {
  const tasks = []
  const statusList = Object.values(TaskStatus)
  const priorityList = Object.values(TaskPriority)
  const phaseList = Object.values(GrowingPhase)

  for (let i = 0; i < count; i++) {
    const id = generateId()
    const taskType = taskTypes[Random.integer(0, 2)]
    const createdAt = Random.datetime('yyyy-MM-dd HH:mm:ss')
    const scheduledStartDate = Random.datetime('yyyy-MM-dd')
    
    const task = {
      id,
      code: `MT${Random.date('yyyyMMdd')}${Random.integer(100, 999)}`,
      name: `${Random.datetime('yyyy年第')}${Random.cword('一二三四')}季度烟田${Random.cword('生长监测,长势评估,产量评估,健康检查')}`,
      type: taskType.code,
      typeObj: taskType,
      growingPhase: phaseList[Random.integer(0, phaseList.length - 1)],
      scheduledStartDate,
      scheduledEndDate: Random.datetime('yyyy-MM-dd'),
      actualStartDate: Random.boolean() ? Random.datetime('yyyy-MM-dd') : null,
      actualEndDate: Random.boolean() ? Random.datetime('yyyy-MM-dd') : null,
      status: statusList[Random.integer(0, statusList.length - 1)],
      createdBy: {
        id: Random.integer(1, 10).toString(),
        username: Random.cname(),
        avatar: Random.image('100x100')
      },
      createdAt,
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      description: Random.cparagraph(1, 3),
      priority: priorityList[Random.integer(0, priorityList.length - 1)],
      previousTaskId: Random.boolean() ? generateId() : null,
      fields: Array(Random.integer(1, 5)).fill().map(() => ({
        id: Random.integer(1, 20).toString(),
        name: `${Random.cword(2, 4)}烟田`,
        area: Random.float(5, 20, 1, 1),
        status: Random.pick(['normal', 'warning', 'offline'])
      }))
    }
    
    tasks.push(task)
  }
  
  return tasks
}

// 生成任务列表
export const taskList = generateTaskList()

interface MockQueryParams {
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  growingPhase?: string;
  priority?: string;
  dateRange?: string;
  page?: string;
  pageSize?: string;
  [key: string]: any;
}

interface MockParams {
  id?: string;
  [key: string]: any;
}

// 模拟接口数据
export default [
  // 获取任务列表
  {
    url: '/api/monitoring-tasks',
    method: 'get',
    response: ({ query }: { query: MockQueryParams }) => {
      const { code, name, type, status, growingPhase, priority, dateRange, page = '1', pageSize = '10' } = query
      let filteredList = [...taskList]

      // 任务编号筛选
      if (code) {
        filteredList = filteredList.filter(task => task.code.includes(code))
      }

      // 任务名称筛选
      if (name) {
        filteredList = filteredList.filter(task => task.name.includes(name))
      }

      // 任务类型筛选
      if (type) {
        filteredList = filteredList.filter(task => task.type === type)
      }

      // 任务状态筛选
      if (status) {
        filteredList = filteredList.filter(task => task.status === status)
      }

      // 生长阶段筛选
      if (growingPhase) {
        filteredList = filteredList.filter(task => task.growingPhase === growingPhase)
      }

      // 优先级筛选
      if (priority) {
        filteredList = filteredList.filter(task => task.priority === priority)
      }

      // 日期范围筛选
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(',')
        filteredList = filteredList.filter(task => 
          task.scheduledStartDate >= startDate && task.scheduledEndDate <= endDate
        )
      }

      // 分页处理
      const start = (parseInt(page) - 1) * parseInt(pageSize)
      const end = start + parseInt(pageSize)
      const pagedList = filteredList.slice(start, end)

      return {
        code: 200,
        message: '获取任务列表成功',
        data: {
          list: pagedList,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      }
    }
  },

  // 获取任务详情
  {
    url: '/api/monitoring-tasks/:id',
    method: 'get',
    response: ({ params }: { params: MockParams }) => {
      const { id } = params
      const task = taskList.find(item => item.id === id)
      
      if (!task) {
        return {
          code: 404,
          message: '任务不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取任务详情成功',
        data: task
      }
    }
  },

  // 创建任务
  {
    url: '/api/monitoring-tasks',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newTask = {
        id: generateId(),
        code: `MT${Random.date('yyyyMMdd')}${Random.integer(100, 999)}`,
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        status: TaskStatus.CREATED,
        createdBy: {
          id: '1',
          username: 'admin',
          avatar: Random.image('100x100')
        },
        fields: [],
        ...body
      }
      
      taskList.unshift(newTask)
      
      return {
        code: 200,
        message: '创建任务成功',
        data: newTask
      }
    }
  },

  // 更新任务
  {
    url: '/api/monitoring-tasks/:id',
    method: 'put',
    response: ({ params, body }: { params: MockParams; body: any }) => {
      const { id } = params
      const taskIndex = taskList.findIndex(task => task.id === id)
      
      if (taskIndex === -1) {
        return {
          code: 404,
          message: '任务不存在',
          data: null
        }
      }
      
      const updatedTask = {
        ...taskList[taskIndex],
        ...body,
        updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
      }
      
      taskList[taskIndex] = updatedTask
      
      return {
        code: 200,
        message: '更新任务成功',
        data: updatedTask
      }
    }
  },

  // 删除任务
  {
    url: '/api/monitoring-tasks/:id',
    method: 'delete',
    response: ({ params }: { params: MockParams }) => {
      const { id } = params
      const taskIndex = taskList.findIndex(task => task.id === id)
      
      if (taskIndex === -1) {
        return {
          code: 404,
          message: '任务不存在',
          data: null
        }
      }
      
      taskList.splice(taskIndex, 1)
      
      return {
        code: 200,
        message: '删除任务成功',
        data: null
      }
    }
  },

  // 获取任务类型列表
  {
    url: '/api/config/monitoring-task-types',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取任务类型列表成功',
        data: taskTypes
      }
    }
  },

  // 获取任务日历数据
  {
    url: '/api/monitoring-tasks/calendar',
    method: 'get',
    response: ({ query }: { query: { start?: string; end?: string } }) => {
      const { start, end } = query
      let filteredList = [...taskList]
      
      if (start && end) {
        filteredList = filteredList.filter(task => 
          (task.scheduledStartDate >= start && task.scheduledStartDate <= end) ||
          (task.scheduledEndDate >= start && task.scheduledEndDate <= end) ||
          (task.scheduledStartDate <= start && task.scheduledEndDate >= end)
        )
      }
      
      return {
        code: 200,
        message: '获取任务日历数据成功',
        data: filteredList
      }
    }
  },

  // 更新任务状态
  {
    url: '/api/monitoring-tasks/:id/status',
    method: 'put',
    response: ({ params, body }: { params: MockParams; body: { status: string } }) => {
      const { id } = params
      const { status } = body
      const taskIndex = taskList.findIndex(task => task.id === id)
      
      if (taskIndex === -1) {
        return {
          code: 404,
          message: '任务不存在',
          data: null
        }
      }
      
      taskList[taskIndex].status = status as TaskStatus
      taskList[taskIndex].updatedAt = Random.datetime('yyyy-MM-dd HH:mm:ss')
      
      return {
        code: 200,
        message: '更新任务状态成功',
        data: taskList[taskIndex]
      }
    }
  }
] 