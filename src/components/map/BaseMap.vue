<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap } from 'leaflet'

// 修复Leaflet默认图标路径问题
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const props = defineProps<{
  center?: [number, number]
  zoom?: number
  minZoom?: number
  maxZoom?: number
  maxBounds?: L.LatLngBoundsExpression
  maxBoundsViscosity?: number
}>()

const emit = defineEmits<{
  (e: 'map-ready', map: LeafletMap): void
  (e: 'map-click', latlng: L.LatLng): void
  (e: 'map-move', center: L.LatLng, zoom: number): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<LeafletMap | null>(null)

// 初始化地图
const initMap = () => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value, {
    center: props.center || [30.28, 120.12], // 默认中心点
    zoom: props.zoom || 13,
    minZoom: props.minZoom || 3,
    maxZoom: props.maxZoom || 18,
    maxBounds: props.maxBounds,
    maxBoundsViscosity: props.maxBoundsViscosity || 0.5
  })

  // 添加底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)

  // 事件监听
  map.value.on('click', (e: L.LeafletMouseEvent) => {
    emit('map-click', e.latlng)
  })

  map.value.on('moveend', () => {
    if (map.value) {
      emit('map-move', map.value.getCenter(), map.value.getZoom())
    }
  })

  emit('map-ready', map.value)
}

// 监听属性变化
watch(() => props.center, (newCenter) => {
  if (map.value && newCenter) {
    map.value.setView(newCenter)
  }
})

watch(() => props.zoom, (newZoom) => {
  if (map.value && newZoom) {
    map.value.setZoom(newZoom)
  }
})

// 生命周期钩子
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// 暴露方法给父组件
defineExpose({
  getMap: () => map.value,
  setView: (center: L.LatLngExpression, zoom?: number) => {
    if (map.value) {
      map.value.setView(center, zoom)
    }
  },
  setBounds: (bounds: L.LatLngBoundsExpression) => {
    if (map.value) {
      map.value.fitBounds(bounds)
    }
  },
  addLayer: (layer: L.Layer) => {
    if (map.value) {
      layer.addTo(map.value)
    }
  },
  removeLayer: (layer: L.Layer) => {
    if (map.value) {
      map.value.removeLayer(layer)
    }
  }
})
</script>

<script lang="ts">
export default {
  name: 'BaseMap'
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style> 