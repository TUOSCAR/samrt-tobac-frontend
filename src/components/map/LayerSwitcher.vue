<template>
  <div class="layer-switcher">
    <el-card class="layer-card">
      <template #header>
        <div class="card-header">
          <span>图层控制</span>
        </div>
      </template>
      
      <div class="layer-list">
        <div v-for="layer in layers" :key="layer.id" class="layer-item">
          <el-checkbox
            v-model="layer.visible"
            @change="handleVisibilityChange(layer)"
          >
            {{ layer.name }}
          </el-checkbox>
          <el-slider
            v-if="layer.visible"
            v-model="layer.opacity"
            :min="0"
            :max="1"
            :step="0.1"
            @change="handleOpacityChange(layer)"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LayerSwitcher'
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Map, Layer, TileLayer } from 'leaflet'
import L from 'leaflet'

interface LayerInfo {
  id: string
  name: string
  layer: Layer
  visible: boolean
  opacity: number
}

const props = defineProps<{
  map: Map | null
  layers: LayerInfo[]
}>()

const emit = defineEmits<{
  (e: 'layer-visibility-change', layer: LayerInfo, visible: boolean): void
  (e: 'layer-opacity-change', layer: LayerInfo, opacity: number): void
}>()

// 监听图层可见性变化
const handleVisibilityChange = (layer: LayerInfo) => {
  if (props.map) {
    if (layer.visible) {
      layer.layer.addTo(props.map)
    } else {
      props.map.removeLayer(layer.layer)
    }
    emit('layer-visibility-change', layer, layer.visible)
  }
}

// 监听图层透明度变化
const handleOpacityChange = (layer: LayerInfo) => {
  if (layer.layer instanceof L.TileLayer) {
    layer.layer.setOpacity(layer.opacity)
  }
  emit('layer-opacity-change', layer, layer.opacity)
}

// 监听地图变化
watch(() => props.map, (newMap) => {
  if (newMap) {
    props.layers.forEach(layer => {
      if (layer.visible) {
        layer.layer.addTo(newMap)
      }
    })
  }
})
</script>

<style scoped>
.layer-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 250px;
  pointer-events: auto;
}

.layer-card {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

:deep(.el-slider) {
  margin: 0 10px;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-card__header) {
  padding: 0;
  border-bottom: 1px solid #ebeef5;
}
</style> 