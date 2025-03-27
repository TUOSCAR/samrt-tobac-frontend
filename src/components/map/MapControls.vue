<template>
  <div class="map-controls">
    <div class="control-group">
      <el-button-group>
        <el-button @click="zoomIn" :icon="Plus" circle />
        <el-button @click="zoomOut" :icon="Minus" circle />
      </el-button-group>
    </div>
    <div class="control-group">
      <el-button @click="locateMe" :icon="Location" circle />
    </div>
    <div class="control-group">
      <el-button @click="resetView" :icon="Refresh" circle />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MapControls'
}
</script>

<script setup lang="ts">
import { Plus, Minus, Location, Refresh } from '@element-plus/icons-vue'
import type { Map } from 'leaflet'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  map: Map
  defaultCenter?: [number, number]
  defaultZoom?: number
}>()

// 缩放控制
const zoomIn = () => {
  props.map.zoomIn()
}

const zoomOut = () => {
  props.map.zoomOut()
}

// 定位到当前位置
const locateMe = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        props.map.setView([latitude, longitude], props.defaultZoom || 13)
      },
      (error) => {
        console.error('定位失败:', error)
        ElMessage.error('无法获取当前位置')
      }
    )
  } else {
    ElMessage.warning('您的浏览器不支持地理定位')
  }
}

// 重置视图
const resetView = () => {
  if (props.defaultCenter) {
    props.map.setView(props.defaultCenter, props.defaultZoom || 13)
  }
}
</script>

<style scoped>
.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
  padding: 5px;
}

.control-group {
  margin-bottom: 5px;
}

.control-group:last-child {
  margin-bottom: 0;
}

:deep(.el-button) {
  padding: 8px;
  margin: 0;
}
</style> 