<template>
  <div class="map-legend">
    <el-card class="legend-card">
      <template #header>
        <div class="legend-header">
          <span>图例</span>
          <el-button
            type="text"
            @click="toggleCollapse"
            :icon="isCollapsed ? 'ArrowDown' : 'ArrowUp'"
          />
        </div>
      </template>
      
      <el-collapse-transition>
        <div v-show="!isCollapsed" class="legend-content">
          <div v-for="layer in layers" :key="layer.id" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: layer.color }"></div>
            <span class="legend-label">{{ layer.name }}</span>
          </div>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

interface Layer {
  id: string
  name: string
  color: string
}

const isCollapsed = ref(false)
const layers = ref<Layer[]>([
  { id: '1', name: '烟草种植区', color: '#4CAF50' },
  { id: '2', name: '非烟草种植区', color: '#FFC107' },
  { id: '3', name: '保护区', color: '#2196F3' },
  { id: '4', name: '缓冲区', color: '#9C27B0' }
])

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

defineExpose({
  layers,
  isCollapsed
})
</script>

<style scoped>
.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.legend-card {
  width: 200px;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-content {
  padding: 10px 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  color: #606266;
}
</style> 