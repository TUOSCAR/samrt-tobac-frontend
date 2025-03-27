<template>
  <div class="land-map">
    <Map
      ref="mapRef"
      :layers="layers"
      @tool-change="handleToolChange"
      @clear="handleClear"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Map from '@/components/map/Map.vue'
import type { MapLayer } from '@/types/leaflet'
import type { Land } from '@/services/landService'
import * as landService from '@/services/landService'
import { ElMessage } from 'element-plus'
import * as L from 'leaflet'

const mapRef = ref<InstanceType<typeof Map>>()

// 图层列表
const layers = ref<MapLayer[]>([
  {
    id: 'lands',
    name: '地块',
    layer: L.featureGroup(),
    visible: true
  }
])

// 获取地块列表并绘制
const fetchLands = async () => {
  try {
    const lands = await landService.getLands()
    const landLayer = layers.value.find(l => l.id === 'lands')?.layer as L.FeatureGroup
    
    // 清除现有图层
    landLayer.clearLayers()
    
    // 绘制地块
    lands.forEach((land: Land) => {
      if (land.coordinates && land.coordinates.length > 0) {
        const polygon = L.polygon(land.coordinates, {
          color: getLandColor(land.status),
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3
        })
        
        // 添加弹出窗口
        polygon.bindPopup(`
          <div class="land-popup">
            <h3>${land.name}</h3>
            <p>面积: ${land.area}亩</p>
            <p>作物: ${getCropName(land.crop)}</p>
            <p>状态: ${getStatusText(land.status)}</p>
          </div>
        `)
        
        polygon.addTo(landLayer)
      }
    })
  } catch (error) {
    ElMessage.error('获取地块列表失败')
  }
}

// 获取地块颜色
const getLandColor = (status: string) => {
  const colors: Record<string, string> = {
    idle: '#909399',
    planting: '#67C23A',
    harvesting: '#E6A23C'
  }
  return colors[status] || '#909399'
}

// 获取作物名称
const getCropName = (crop: string) => {
  const names: Record<string, string> = {
    tobacco: '烟草',
    corn: '玉米',
    rice: '水稻'
  }
  return names[crop] || crop
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    idle: '空闲',
    planting: '种植中',
    harvesting: '收获中'
  }
  return texts[status] || status
}

// 工具切换处理
const handleToolChange = (tool: string) => {
  // TODO: 实现工具切换逻辑
  console.log('切换工具:', tool)
}

// 清除处理
const handleClear = () => {
  // TODO: 实现清除逻辑
  console.log('清除')
}

// 初始化
onMounted(() => {
  fetchLands()
})
</script>

<style scoped>
.land-map {
  width: 100%;
  height: 100%;
}

.land-popup {
  padding: 10px;
}

.land-popup h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
}

.land-popup p {
  margin: 5px 0;
  font-size: 14px;
  color: #606266;
}
</style> 