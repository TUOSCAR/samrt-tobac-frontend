<template>
  <div class="land-page">
    <el-container>
      <el-aside width="300px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="地块列表" name="list">
            <LandManagement />
          </el-tab-pane>
          <el-tab-pane label="地块统计" name="stats">
            <LandStats />
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main>
        <LandMap />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'

const LandManagement = defineAsyncComponent(() => import('@/components/land/LandManagement.vue'))
const LandStats = defineAsyncComponent(() => import('@/components/land/LandStats.vue'))
const LandMap = defineAsyncComponent(() => import('@/components/land/LandMap.vue'))

const activeTab = ref('list')
</script>

<style scoped>
.land-page {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #dcdfe6;
  padding: 20px;
}

.el-main {
  padding: 0;
  background-color: #f5f7fa;
}
</style> 