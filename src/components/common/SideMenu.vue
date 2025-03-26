<template>
  <el-menu
    class="side-menu"
    :collapse="collapse"
    :default-active="activeMenu"
    router
    unique-opened
    background-color="#001529"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <template v-for="menu in menus" :key="menu.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
        <template #title>
          <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
          <span>{{ menu.title }}</span>
        </template>
        
        <el-menu-item
          v-for="subMenu in menu.children"
          :key="subMenu.path"
          :index="subMenu.path"
        >
          <el-icon v-if="subMenu.icon"><component :is="subMenu.icon" /></el-icon>
          <span>{{ subMenu.title }}</span>
        </el-menu-item>
      </el-sub-menu>
      
      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="menu.path">
        <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
        <span>{{ menu.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  menus: {
    type: Array,
    default: () => []
  },
  collapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

// 计算当前活动菜单
const activeMenu = computed(() => {
  // 根据当前路由路径找到匹配的菜单项
  const { path } = route
  
  // 查找直接匹配的菜单
  const findMatchMenu = (menus: any[]) => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu.path
      }
      
      if (menu.children) {
        for (const child of menu.children) {
          if (child.path === path) {
            return child.path
          }
        }
      }
    }
    
    // 如果没有精确匹配，返回第一级匹配
    for (const menu of menus) {
      if (path.startsWith(menu.path) && menu.path !== '/') {
        return menu.path
      }
    }
    
    return ''
  }
  
  return findMatchMenu(props.menus)
})
</script>

<style scoped>
.side-menu {
  height: 100%;
  border-right: none;
}

.side-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style> 