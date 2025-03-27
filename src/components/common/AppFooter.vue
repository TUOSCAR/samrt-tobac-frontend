<template>
  <div class="app-footer">
    <div class="footer-content">
      <div class="copyright">
        &copy; {{ currentYear }} 智慧烟田监测与决策支持系统
      </div>
      <div class="links">
        <a href="#">帮助中心</a>
        <a href="#">使用手册</a>
        <a href="#">关于我们</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 计算当前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style scoped>
.app-footer {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e6e6e6;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.links {
  display: flex;
  gap: 16px;
}

.links a {
  color: #409eff;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style> 