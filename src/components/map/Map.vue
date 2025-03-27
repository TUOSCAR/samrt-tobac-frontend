<template>
  <div class="map-container" ref="mapContainer">
    <MapControls
      :map="map"
      :layers="layers"
      @tool-change="handleToolChange"
      @clear="handleClear"
    />
    <LayerSwitcher
      :map="map"
      :layers="layers"
      @layer-change="handleLayerChange"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Map'
}
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-measure/dist/leaflet-measure.css'
import 'leaflet-draw'
import 'leaflet-measure'
import MapControls from './MapControls.vue'
import LayerSwitcher from './LayerSwitcher.vue'
import type { MapLayer } from '@/types/leaflet'

// 地图实例
const map = ref<L.Map | null>(null)
const mapContainer = ref<HTMLElement | null>(null)

// 绘制控件
const drawControl = ref<L.Control.Draw | null>(null)
const measureControl = ref<any>(null)

// 选中的要素
const selectedFeature = ref<any>(null)

// 图层管理
const featureGroup = ref<L.FeatureGroup | null>(null)
const layers = ref<MapLayer[]>([])

// 初始化地图
const initMap = () => {
  if (!mapContainer.value) return

  // 创建地图实例
  const mapInstance = L.map(mapContainer.value, {
    center: [24.8, 102.8], // 昆明市坐标
    zoom: 13,
    zoomControl: false // 禁用默认缩放控件
  })

  // 添加底图
  const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  })
  baseLayer.addTo(mapInstance)
  layers.value.push({
    id: 'base',
    name: '底图',
    layer: baseLayer,
    visible: true
  })

  // 添加卫星图
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  })
  layers.value.push({
    id: 'satellite',
    name: '卫星图',
    layer: satelliteLayer,
    visible: false
  })

  // 添加地形图
  const terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  })
  layers.value.push({
    id: 'terrain',
    name: '地形图',
    layer: terrainLayer,
    visible: false
  })

  // 初始化要素组
  const featureGroupInstance = L.featureGroup()
  featureGroupInstance.addTo(mapInstance)
  featureGroup.value = featureGroupInstance

  // 初始化绘制控件
  const drawControlInstance = new L.Control.Draw({
    position: 'topright',
    draw: {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: '#e1e100',
          message: '<strong>错误!</strong> 多边形不能相交!'
        },
        shapeOptions: {
          color: '#97009c'
        }
      },
      circle: false,
      circlemarker: false,
      marker: false,
      polyline: false,
      rectangle: {
        shapeOptions: {
          color: '#97009c'
        }
      }
    },
    edit: {
      featureGroup: featureGroupInstance,
      remove: true
    }
  })
  drawControlInstance.addTo(mapInstance)
  drawControl.value = drawControlInstance

  // 添加事件监听
  mapInstance.on('click', handleMapClick)
  mapInstance.on('draw:created', handleDrawCreated)
  mapInstance.on('draw:edited', handleDrawEdited)
  mapInstance.on('draw:deleted', handleDrawDeleted)

  map.value = mapInstance
}

// 地图点击事件处理
const handleMapClick = (e: L.LeafletMouseEvent) => {
  if (!map.value || !featureGroup.value) return

  const clickedFeature = featureGroup.value.getLayers().find(layer => {
    if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      return layer.getBounds().contains(e.latlng)
    }
    return false
  })

  if (clickedFeature) {
    selectedFeature.value = clickedFeature
    // 高亮显示选中的要素
    featureGroup.value.getLayers().forEach(layer => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        layer.setStyle({
          weight: layer === clickedFeature ? 3 : 1,
          color: layer === clickedFeature ? '#ff0000' : '#97009c'
        })
      }
    })
  } else {
    selectedFeature.value = null
    // 恢复默认样式
    featureGroup.value.getLayers().forEach(layer => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        layer.setStyle({
          weight: 1,
          color: '#97009c'
        })
      }
    })
  }
}

// 绘制完成事件处理
const handleDrawCreated = (e: any) => {
  if (!featureGroup.value) return
  const layer = e.layer
  featureGroup.value.addLayer(layer)
  selectedFeature.value = layer
}

// 编辑完成事件处理
const handleDrawEdited = (e: any) => {
  if (!featureGroup.value) return
  const layers = e.layers
  layers.eachLayer((layer: L.Layer) => {
    // 更新要素数据
    console.log('编辑完成:', layer)
  })
}

// 删除完成事件处理
const handleDrawDeleted = (e: any) => {
  if (!featureGroup.value) return
  const layers = e.layers
  layers.eachLayer((layer: L.Layer) => {
    // 删除要素数据
    console.log('删除完成:', layer)
  })
}

// 工具切换事件处理
const handleToolChange = (tool: string) => {
  if (!map.value) return

  // 清除所有绘制控件
  if (drawControl.value) {
    map.value.removeControl(drawControl.value)
  }
  if (measureControl.value) {
    map.value.removeControl(measureControl.value)
  }

  switch (tool) {
    case 'measure':
      // 添加测量控件
      const measureControlInstance = new (L.Control as any).Measure({
        position: 'topleft',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares',
        activeColor: '#db4a29',
        completedColor: '#9b2d14'
      })
      measureControlInstance.addTo(map.value)
      measureControl.value = measureControlInstance
      break
    case 'draw':
      // 添加绘制控件
      if (drawControl.value) {
        map.value.addControl(drawControl.value)
      }
      break
    case 'edit':
      // 添加编辑控件
      if (drawControl.value) {
        map.value.addControl(drawControl.value)
      }
      break
    case 'clear':
      // 清除所有绘制
      if (featureGroup.value) {
        featureGroup.value.clearLayers()
      }
      break
  }
}

// 清除绘制事件处理
const handleClear = () => {
  if (map.value) {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.FeatureGroup) {
        layer.clearLayers()
      }
    })
  }
}

// 图层变化事件处理
const handleLayerChange = (layer: L.Layer) => {
  console.log('图层变化:', layer)
  // TODO: 实现图层变化处理逻辑
}

// 组件挂载时初始化地图
onMounted(() => {
  initMap()
})

// 组件卸载时清理地图
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

defineExpose({
  map
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 