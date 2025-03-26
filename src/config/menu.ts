import { MenuItem } from '@/types/menu'

export const menuItems: MenuItem[] = [
  {
    title: '仪表盘',
    icon: 'mdi-view-dashboard',
    path: '/dashboard',
    roles: ['admin', 'technician', 'farmer'],
    children: [
      {
        title: '管理员仪表盘',
        path: '/dashboard',
        icon: 'mdi-monitor-dashboard',
        roles: ['admin']
      },
      {
        title: '工作台',
        path: '/workbench',
        icon: 'mdi-desktop-classic',
        roles: ['technician']
      },
      {
        title: '我的烟田',
        path: '/my-fields',
        icon: 'mdi-farm',
        roles: ['farmer']
      }
    ]
  },
  {
    title: '地块管理',
    icon: 'mdi-map-marker',
    path: '/fields',
    roles: ['admin', 'technician'],
    children: [
      {
        title: '地块列表',
        path: '/fields',
        icon: 'mdi-format-list-bulleted'
      },
      {
        title: '地块地图',
        path: '/fields/map',
        icon: 'mdi-map'
      }
    ]
  },
  {
    title: '数据管理',
    icon: 'mdi-database',
    path: '/data',
    roles: ['admin'],
    children: [
      {
        title: '无人机影像',
        path: '/data/drone-images',
        icon: 'mdi-drone'
      },
      {
        title: '气象数据',
        path: '/data/weather',
        icon: 'mdi-weather-partly-cloudy'
      },
      {
        title: '种植参数',
        path: '/data/parameters',
        icon: 'mdi-cog'
      }
    ]
  },
  {
    title: '系统管理',
    icon: 'mdi-cog',
    path: '/system',
    roles: ['admin'],
    children: [
      {
        title: '用户管理',
        path: '/system/users',
        icon: 'mdi-account-group'
      },
      {
        title: '权限配置',
        path: '/system/permissions',
        icon: 'mdi-shield-lock'
      },
      {
        title: '系统参数',
        path: '/system/parameters',
        icon: 'mdi-tune'
      }
    ]
  }
] 