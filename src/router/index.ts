import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'

// 布局组件
import AppLayout from '@/layouts/AppLayout.vue'

// 页面组件 - 通用
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const ResetPassword = () => import('@/views/auth/ResetPassword.vue')
const NotFound = () => import('@/views/error/NotFound.vue')

// 页面组件 - 管理员
const AdminDashboard = () => import('@/views/dashboard/AdminDashboard.vue')

// 页面组件 - 烟技人员
const TechnicianWorkbench = () => import('@/views/dashboard/TechnicianWorkbench.vue')

// 页面组件 - 烟农
const FarmerDashboard = () => import('@/views/dashboard/FarmerDashboard.vue')

// 页面组件 - 任务管理
const TaskList = () => import('@/views/task/TaskList.vue')
const TaskDetail = () => import('@/views/task/TaskDetail.vue')
const TaskEdit = () => import('@/views/task/TaskEdit.vue')
const TaskCalendar = () => import('@/views/task/TaskCalendar.vue')

// 页面组件 - 分析结果
const PlantCountResult = () => import('@/views/analysis/PlantCountResult.vue')
const GrowthAnalysisResult = () => import('@/views/analysis/GrowthAnalysisResult.vue')
const YieldEstimationResult = () => import('@/views/analysis/YieldEstimationResult.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册',
      requiresAuth: false
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      title: '重置密码',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      // 管理员路由
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
          title: '管理员仪表盘',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      
      // 烟技人员路由
      {
        path: 'workbench',
        name: 'TechnicianWorkbench',
        component: TechnicianWorkbench,
        meta: {
          title: '工作台',
          requiresAuth: true,
          roles: ['technician']
        }
      },
      
      // 烟农路由
      {
        path: 'my-fields',
        name: 'FarmerDashboard',
        component: FarmerDashboard,
        meta: {
          title: '我的烟田',
          requiresAuth: true,
          roles: ['farmer']
        }
      },
      
      // 地块管理路由
      {
        path: 'fields',
        name: 'FieldList',
        component: () => import('@/views/field/FieldList.vue'),
        meta: {
          title: '地块列表',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'fields/map',
        name: 'FieldMap',
        component: () => import('@/views/field/FieldMap.vue'),
        meta: {
          title: '地块地图',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'fields/:id',
        name: 'FieldDetail',
        component: () => import('@/views/field/FieldDetail.vue'),
        meta: {
          title: '地块详情',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      
      // 监测任务管理路由
      {
        path: 'tasks',
        name: 'TaskList',
        component: TaskList,
        meta: {
          title: '监测任务列表',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'tasks/calendar',
        name: 'TaskCalendar',
        component: TaskCalendar,
        meta: {
          title: '任务日历',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'tasks/create',
        name: 'TaskCreate',
        component: TaskEdit,
        meta: {
          title: '创建监测任务',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'tasks/edit/:id',
        name: 'TaskEdit',
        component: TaskEdit,
        meta: {
          title: '编辑监测任务',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        meta: {
          title: '监测任务详情',
          requiresAuth: true,
          roles: ['admin', 'technician', 'farmer']
        }
      },
      
      // 分析结果路由
      {
        path: 'analysis/plant-count',
        name: 'PlantCountResult',
        component: PlantCountResult,
        meta: {
          title: '株数分析结果',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'analysis/growth',
        name: 'GrowthAnalysisResult',
        component: GrowthAnalysisResult,
        meta: {
          title: '生长分析结果',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      },
      {
        path: 'analysis/yield',
        name: 'YieldEstimationResult',
        component: YieldEstimationResult,
        meta: {
          title: '估产分析结果',
          requiresAuth: true,
          roles: ['admin', 'technician']
        }
      }
    ]
  },
  {
    path: '/land',
    name: 'Land',
    component: () => import('@/views/LandPage.vue'),
    meta: {
      title: '地块管理',
      requiresAuth: true,
      roles: ['admin', 'technician']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 更新页面标题
  document.title = `${to.meta.title ? to.meta.title : '智慧烟田'} - 智慧烟田监测与决策支持系统`
  
  const userStore = useUserStore()
  
  // 检查是否需要身份验证
  if (to.meta.requiresAuth) {
    // 如果需要登录但未登录，重定向到登录页
    if (!userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    
    // 检查角色权限
    const roles = to.meta.roles as string[] | undefined
    if (roles && userStore.user && !roles.includes(userStore.user.role)) {
      // 如果用户没有所需角色，根据其实际角色重定向到相应页面
      switch (userStore.user.role) {
        case 'admin':
          next({ name: 'AdminDashboard' })
          break
        case 'technician':
          next({ name: 'TechnicianWorkbench' })
          break
        case 'farmer':
          next({ name: 'FarmerDashboard' })
          break
        default:
          next({ name: 'Login' })
      }
      return
    }
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    // 已登录用户访问登录页，重定向到相应首页
    if (userStore.user) {
      switch (userStore.user.role) {
        case 'admin':
          next({ name: 'AdminDashboard' })
          break
        case 'technician':
          next({ name: 'TechnicianWorkbench' })
          break
        case 'farmer':
          next({ name: 'FarmerDashboard' })
          break
        default:
          next()
      }
    } else {
      next()
    }
    return
  }
  
  next()
})

export default router 