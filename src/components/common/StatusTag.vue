<template>
  <el-tag :type="tagType" :effect="effect" :size="size">
    <template v-if="loading">
      <el-icon class="is-loading"><loading /></el-icon>
      <span>{{ loadingText }}</span>
    </template>
    <template v-else>
      <el-icon v-if="showIcon"><component :is="iconName" /></el-icon>
      <span>{{ displayText }}</span>
    </template>
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  // 状态值
  status: {
    type: [String, Number],
    required: true
  },
  // 状态配置选项
  options: {
    type: Array,
    default: () => []
  },
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false
  },
  // 加载时显示的文本
  loadingText: {
    type: String,
    default: '加载中'
  },
  // 是否显示图标
  showIcon: {
    type: Boolean,
    default: false
  },
  // 标签尺寸
  size: {
    type: String,
    default: 'default'
  },
  // 标签效果
  effect: {
    type: String,
    default: 'light'
  }
})

// 根据状态确定标签类型
const tagType = computed(() => {
  if (props.loading) return 'info'
  
  const option = props.options.find((opt: any) => opt.value === props.status)
  return option ? option.type : 'default'
})

// 根据状态确定显示文本
const displayText = computed(() => {
  const option = props.options.find((opt: any) => opt.value === props.status)
  return option ? option.label : props.status
})

// 根据状态确定图标
const iconName = computed(() => {
  const option = props.options.find((opt: any) => opt.value === props.status)
  return option && option.icon ? option.icon : 'info'
})
</script>

<style scoped>
.el-tag {
  display: inline-flex;
  align-items: center;
}

.el-icon {
  margin-right: 4px;
}

.is-loading {
  animation: rotating 2s linear infinite;
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