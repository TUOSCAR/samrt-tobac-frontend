import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'

// 布局组件
import AppLayout from '@/layouts/AppLayout.vue'

// 页面组件 - 通用
const Login = () => import('@/views/auth/Login.vue')
const NotFound = () => import('@/views/error/NotFound.vue')

// 页面组件 - 管理员
const AdminDashboard = () => import('@/views/dashboard/AdminDashboard.vue')

// 页面组件 - 烟技人员
const TechnicianWorkbench = () => import('@/views/dashboard/TechnicianWorkbench.vue')

// 页面组件 - 烟农
const FarmerDashboard = () => import('@/views/dashboard/FarmerDashboard.vue')

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
      }
    ]
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
    if (to.meta.roles && !to.meta.roles.includes(userStore.user?.role)) {
      // 如果用户没有所需角色，根据其实际角色重定向到相应页面
      switch (userStore.user?.role) {
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
    switch (userStore.user?.role) {
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
    return
  }
  
  next()
})

export default router 