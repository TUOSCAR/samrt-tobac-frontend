<template>
  <div class="loading-wrapper" :class="{ 'fullscreen': fullscreen, 'overlay': overlay }">
    <div class="loading-content">
      <el-icon class="loading-icon" :size="size"><loading /></el-icon>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 是否全屏显示
  fullscreen: {
    type: Boolean,
    default: false
  },
  // 是否显示遮罩层
  overlay: {
    type: Boolean,
    default: true
  },
  // 加载图标大小
  size: {
    type: Number,
    default: 32
  },
  // 加载文本
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.loading-wrapper.overlay {
  background-color: rgba(255, 255, 255, 0.8);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-icon {
  animation: rotating 2s linear infinite;
  color: #409eff;
}

.loading-text {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 