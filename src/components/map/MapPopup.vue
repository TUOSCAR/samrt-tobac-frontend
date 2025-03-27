<template>
  <div class="map-popup">
    <div class="popup-header">
      <span class="popup-title">{{ title }}</span>
      <el-button
        v-if="showClose"
        class="close-button"
        :icon="Close"
        circle
        @click="$emit('close')"
      />
    </div>
    <div class="popup-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'

defineProps<{
  title: string
  showClose?: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.map-popup {
  min-width: 200px;
  max-width: 300px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.popup-title {
  font-weight: bold;
  font-size: 14px;
}

.close-button {
  padding: 4px;
  margin: 0;
}

.popup-content {
  font-size: 13px;
  line-height: 1.5;
}

:deep(.leaflet-popup-content-wrapper) {
  padding: 8px 12px;
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style> 