<template>
  <div class="field-detail">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="地块名称">
        {{ fieldData.name }}
      </el-descriptions-item>
      
      <el-descriptions-item label="地块类型">
        <el-tag :type="getFieldTypeTag(fieldData.type)">
          {{ getFieldTypeLabel(fieldData.type) }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item label="面积">
        {{ fieldData.area }} 亩
      </el-descriptions-item>
      
      <el-descriptions-item label="位置">
        {{ fieldData.location }}
      </el-descriptions-item>
      
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusType(fieldData.status)">
          {{ getStatusLabel(fieldData.status) }}
        </el-tag>
      </el-descriptions-item>
      
      <el-descriptions-item label="创建时间">
        {{ fieldData.createTime }}
      </el-descriptions-item>
      
      <el-descriptions-item label="更新时间">
        {{ fieldData.updateTime }}
      </el-descriptions-item>
      
      <el-descriptions-item label="创建人">
        {{ fieldData.creator }}
      </el-descriptions-item>
      
      <el-descriptions-item label="备注" :span="2">
        {{ fieldData.remark || '无' }}
      </el-descriptions-item>
    </el-descriptions>
    
    <div class="detail-footer">
      <el-button @click="$emit('cancel')">关闭</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  fieldData: any
}>()

defineEmits<{
  (e: 'cancel'): void
}>()

// 工具函数
const getFieldTypeTag = (type: string) => {
  const map: Record<string, string> = {
    water: 'success',
    dry: 'warning',
    mountain: 'info'
  }
  return map[type] || 'info'
}

const getFieldTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    water: '水田',
    dry: '旱地',
    mountain: '山地'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    normal: 'success',
    pending: 'warning',
    closed: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    normal: '正常',
    pending: '待处理',
    closed: '已关闭'
  }
  return map[status] || status
}
</script>

<style scoped>
.field-detail {
  padding: 20px;
}

.detail-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 