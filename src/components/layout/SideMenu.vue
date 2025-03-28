<template>
  <el-menu
    :default-active="activeMenu"
    class="side-menu"
    :collapse="isCollapse"
    @select="handleSelect"
  >
    <!-- 管理员菜单 -->
    <template v-if="userStore.user?.role === 'admin'">
      <el-menu-item index="/dashboard">
        <el-icon><DataLine /></el-icon>
        <template #title>管理员仪表盘</template>
      </el-menu-item>
      
      <el-sub-menu index="field">
        <template #title>
          <el-icon><MapLocation /></el-icon>
          <span>地块管理</span>
        </template>
        <el-menu-item index="/fields">地块列表</el-menu-item>
        <el-menu-item index="/fields/map">地块地图</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="task">
        <template #title>
          <el-icon><List /></el-icon>
          <span>监测任务</span>
        </template>
        <el-menu-item index="/tasks">任务列表</el-menu-item>
        <el-menu-item index="/tasks/calendar">任务日历</el-menu-item>
        <el-menu-item index="/tasks/create">创建任务</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="execution">
        <template #title>
          <el-icon><SetUp /></el-icon>
          <span>执行任务</span>
        </template>
        <el-menu-item index="/execution/tasks">任务列表</el-menu-item>
        <el-menu-item index="/execution/tasks/create">创建任务</el-menu-item>
        <el-menu-item index="/execution/tasks/assign">任务分配</el-menu-item>
        <el-menu-item index="/execution/evaluation">执行情况分析</el-menu-item>
      </el-sub-menu>
    </template>

    <!-- 烟技人员菜单 -->
    <template v-if="userStore.user?.role === 'technician'">
      <el-menu-item index="/workbench">
        <el-icon><Monitor /></el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      
      <el-sub-menu index="field">
        <template #title>
          <el-icon><MapLocation /></el-icon>
          <span>地块管理</span>
        </template>
        <el-menu-item index="/fields">地块列表</el-menu-item>
        <el-menu-item index="/fields/map">地块地图</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="task">
        <template #title>
          <el-icon><List /></el-icon>
          <span>监测任务</span>
        </template>
        <el-menu-item index="/tasks">任务列表</el-menu-item>
        <el-menu-item index="/tasks/calendar">任务日历</el-menu-item>
        <el-menu-item index="/tasks/create">创建任务</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="execution">
        <template #title>
          <el-icon><SetUp /></el-icon>
          <span>执行任务</span>
        </template>
        <el-menu-item index="/execution/tasks">任务列表</el-menu-item>
        <el-menu-item index="/execution/tasks/create">创建任务</el-menu-item>
        <el-menu-item index="/execution/tasks/assign">任务分配</el-menu-item>
        <el-menu-item index="/execution/evaluation">执行情况分析</el-menu-item>
      </el-sub-menu>
    </template>

    <!-- 烟农菜单 -->
    <template v-if="userStore.user?.role === 'farmer'">
      <el-menu-item index="/my-fields">
        <el-icon><House /></el-icon>
        <template #title>我的烟田</template>
      </el-menu-item>
      
      <el-sub-menu index="execution">
        <template #title>
          <el-icon><SetUp /></el-icon>
          <span>执行任务</span>
        </template>
        <el-menu-item index="/execution/tasks">我的任务</el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  DataLine,
  Monitor,
  House,
  MapLocation,
  List,
  SetUp
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = computed(() => route.path)

const handleSelect = (index: string) => {
  router.push(index)
}
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