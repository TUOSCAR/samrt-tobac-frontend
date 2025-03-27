import { MenuItem } from '@/types/menu'

export const menuItems: MenuItem[] = [
  {
    title: '仪表盘',
    icon: 'DataBoard',
    path: '/dashboard',
    roles: ['admin', 'technician', 'farmer'],
    children: [
      {
        title: '管理员仪表盘',
        path: '/dashboard',
        icon: 'DataLine',
        roles: ['admin']
      },
      {
        title: '工作台',
        path: '/workbench',
        icon: 'Monitor',
        roles: ['technician']
      },
      {
        title: '我的烟田',
        path: '/my-fields',
        icon: 'House',
        roles: ['farmer']
      }
    ]
  },
  {
    title: '地块管理',
    icon: 'MapLocation',
    path: '/fields',
    roles: ['admin', 'technician'],
    children: [
      {
        title: '地块列表',
        path: '/fields',
        icon: 'Document'
      },
      {
        title: '地块地图',
        path: '/fields/map',
        icon: 'Place'
      }
    ]
  },
  {
    title: '监测任务',
    icon: 'Notebook',
    path: '/tasks',
    roles: ['admin', 'technician'],
    children: [
      {
        title: '任务列表',
        path: '/tasks',
        icon: 'List'
      },
      {
        title: '任务日历',
        path: '/tasks/calendar',
        icon: 'Calendar'
      },
      {
        title: '创建任务',
        path: '/tasks/create',
        icon: 'Plus'
      }
    ]
  },
  {
    title: '数据管理',
    icon: 'DataAnalysis',
    path: '/data',
    roles: ['admin'],
    children: [
      {
        title: '无人机影像',
        path: '/data/drone-images',
        icon: 'PictureFilled'
      },
      {
        title: '气象数据',
        path: '/data/weather',
        icon: 'MostlyCloudy'
      },
      {
        title: '种植参数',
        path: '/data/parameters',
        icon: 'Setting'
      }
    ]
  },
  {
    title: '系统管理',
    icon: 'Setting',
    path: '/system',
    roles: ['admin'],
    children: [
      {
        title: '用户管理',
        path: '/system/users',
        icon: 'User'
      },
      {
        title: '权限配置',
        path: '/system/permissions',
        icon: 'Lock'
      },
      {
        title: '系统参数',
        path: '/system/parameters',
        icon: 'Tools'
      }
    ]
  }
] 