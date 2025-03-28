<template>
  <div class="field-map">
    <BaseMap
      ref="mapRef"
      :center="mapCenter"
      :zoom="mapZoom"
      @map-ready="handleMapReady"
      @map-click="handleMapClick"
    />
    
    <!-- 地图控件 -->
    <MapControls
      v-if="map"
      :map="map"
      @layer-change="handleLayerChange"
      @tool-change="handleToolChange"
    />
    
    <!-- 图层切换器 -->
    <LayerSwitcher
      v-if="map"
      :map="map"
      :layers="layers"
      @layer-visibility-change="handleLayerVisibilityChange"
      @layer-opacity-change="handleLayerOpacityChange"
    />
    
    <!-- 天气图层 -->
    <WeatherLayer />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Map as LeafletMap, Layer } from 'leaflet'
import BaseMap from './BaseMap.vue'
import MapControls from './MapControls.vue'
import LayerSwitcher from './LayerSwitcher.vue'
import WeatherLayer from '../weather/WeatherLayer.vue'

interface Field {
  id: string
  code: string
  name: string
  area: number
  variety: string
  plantingDate: string
  expectedHarvestDate: string
  manager: string
  phone: string
  status: 'normal' | 'warning' | 'offline'
  location?: {
    type: string
    coordinates: number[][]
  }
}

interface LayerInfo {
  id: string
  name: string
  layer: Layer
  visible: boolean
  opacity: number
}

const props = defineProps<{
  fields: Field[]
}>()

const emit = defineEmits<{
  (e: 'field-click', field: Field): void
}>()

const mapRef = ref()
const map = ref<LeafletMap | null>(null)
const mapCenter: [number, number] = [24.8, 102.8] // 昆明市中心坐标
const mapZoom = 13
const fieldLayers = ref<Map<string, Layer>>(new Map())
const layers = ref<LayerInfo[]>([])

// 地图加载完成
const handleMapReady = (mapInstance: LeafletMap) => {
  map.value = mapInstance
  updateFieldLayers()
}

// 地图点击事件
const handleMapClick = (latlng: any) => {
  // TODO: 处理地图点击事件
}

// 图层切换
const handleLayerChange = (layer: string) => {
  // TODO: 处理图层切换
}

// 工具切换
const handleToolChange = (tool: string) => {
  // TODO: 处理工具切换
}

// 图层可见性变化
const handleLayerVisibilityChange = (layer: LayerInfo, visible: boolean) => {
  // TODO: 处理图层可见性变化
}

// 图层透明度变化
const handleLayerOpacityChange = (layer: LayerInfo, opacity: number) => {
  // TODO: 处理图层透明度变化
}

// 更新地块图层
const updateFieldLayers = () => {
  // 清除现有图层
  fieldLayers.value.forEach(layer => {
    if (map.value) {
      map.value.removeLayer(layer)
    }
  })
  fieldLayers.value.clear()

  // 添加新图层
  props.fields.forEach(field => {
    if (map.value && field.location) {
      // TODO: 创建地块图层
    }
  })
}

// 监听地块数据变化
watch(() => props.fields, () => {
  updateFieldLayers()
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  updateFieldLayers
})
</script>

<style scoped>
.field-map {
  width: 100%;
  height: 100%;
  position: relative;
}

:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  z-index: 1;
}

:deep(.leaflet-control-container) {
  z-index: 2;
}

:deep(.leaflet-popup-pane) {
  z-index: 3;
}

:deep(.leaflet-tooltip-pane) {
  z-index: 4;
}

:deep(.leaflet-overlay-pane) {
  z-index: 5;
}

:deep(.leaflet-shadow-pane) {
  z-index: 6;
}

:deep(.leaflet-marker-pane) {
  z-index: 7;
}

:deep(.leaflet-tile-pane) {
  z-index: 8;
}

:deep(.leaflet-bottom) {
  z-index: 9;
}

:deep(.leaflet-top) {
  z-index: 10;
}

:deep(.leaflet-control-zoom) {
  margin-bottom: 20px !important;
}

:deep(.leaflet-control-scale) {
  margin-bottom: 10px !important;
}

:deep(.leaflet-control-layers) {
  margin-bottom: 10px !important;
}

:deep(.leaflet-control-attribution) {
  margin-bottom: 10px !important;
}
</style> 