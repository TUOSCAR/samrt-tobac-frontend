<template>
  <div class="map-toolbar">
    <el-tooltip content="测量距离" placement="left">
      <el-button
        :type="activeTool === 'measure' ? 'primary' : 'default'"
        @click="toggleTool('measure')"
        circle
      >
        <el-icon><Measure /></el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip content="绘制多边形" placement="left">
      <el-button
        :type="activeTool === 'draw' ? 'primary' : 'default'"
        @click="toggleTool('draw')"
        circle
      >
        <el-icon><Edit /></el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip content="编辑图层" placement="left">
      <el-button
        :type="activeTool === 'edit' ? 'primary' : 'default'"
        @click="toggleTool('edit')"
        circle
      >
        <el-icon><EditPen /></el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip content="清除绘制" placement="left">
      <el-button
        :type="activeTool === 'clear' ? 'primary' : 'default'"
        @click="clearDrawings"
        circle
      >
        <el-icon><Delete /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MapToolbar'
}
</script>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'tool-change', tool: string): void
  (e: 'clear'): void
}>()

const activeTool = ref<string>('')

const toggleTool = (tool: string) => {
  if (activeTool.value === tool) {
    activeTool.value = ''
    emit('tool-change', '')
  } else {
    activeTool.value = tool
    emit('tool-change', tool)
  }
}

const clearDrawings = () => {
  activeTool.value = ''
  emit('clear')
}

defineExpose({
  activeTool
})
</script>

<style scoped>
.map-toolbar {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.el-button {
  margin: 0;
}
</style> 