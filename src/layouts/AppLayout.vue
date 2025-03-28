<template>
  <div class="app-layout">
    <NavBar :user="userStore.user" @logout="handleLogout" />
    <div class="main-container">
      <SideMenu :menus="menus" :collapse="menuCollapse" />
      <div class="content-container">
        <div class="content-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="content-body">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
    <AppFooter />
    <NotificationCenter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
import SideMenu from '@/components/common/SideMenu.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import NotificationCenter from '@/components/common/NotificationCenter.vue'
import { useUserStore } from '@/store/user'

// 使用状态管理
const userStore = useUserStore()
const route = useRoute()

// 控制侧边栏收起状态
const menuCollapse = ref(false)

// 根据用户角色获取对应的菜单
const menus = computed(() => {
  const role = userStore.user?.role || 'guest'
  switch (role) {
    case 'admin':
      return adminMenus
    case 'technician':
      return technicianMenus
    case 'farmer':
      return farmerMenus
    default:
      return []
  }
})

// 计算面包屑导航
const breadcrumbs = computed(() => {
  // 简单实现，实际项目中应根据路由匹配计算面包屑
  return [
    { title: '首页', path: '/' },
    { title: route.meta.title || '当前页面', path: route.path }
  ]
})

// 登出处理
const handleLogout = () => {
  userStore.logout()
}

// 菜单配置
const adminMenus = [
  {
    title: '仪表盘',
    icon: 'el-icon-s-home',
    path: '/dashboard'
  },
  {
    title: '数据管理',
    icon: 'el-icon-s-data',
    children: [
      { title: '无人机影像', path: '/data/drone-images' },
      { title: '气象数据', path: '/data/weather' },
      { title: '种植参数', path: '/data/parameters' },
      { title: '文档管理', path: '/data/documents' },
      { title: '知识库管理', path: '/data/knowledge-base' }
    ]
  },
  // 其他菜单项省略...
]

const technicianMenus = [
  {
    title: '工作台',
    icon: 'el-icon-s-home',
    path: '/workbench'
  },
  // 其他菜单项省略...
]

const farmerMenus = [
  {
    title: '我的烟田',
    icon: 'el-icon-s-home',
    path: '/my-fields'
  },
  // 其他菜单项省略...
]

onMounted(() => {
  // 初始化工作，例如获取用户信息
  if (!userStore.isLoggedIn) {
    userStore.getUserInfo()
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #f5f7fa;
}

.content-header {
  margin-bottom: 16px;
  padding: 8px 0;
}

.content-body {
  flex: 1;
  background-color: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 