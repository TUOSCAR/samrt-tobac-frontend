<template>
  <div class="field-map">
    <el-card class="map-card">
      <template #header>
        <div class="card-header">
          <span>地块地图</span>
          <div class="header-controls">
            <el-button-group>
              <el-button type="primary" @click="handleAddField">
                <el-icon><Plus /></el-icon>新增地块
              </el-button>
              <el-button type="success" @click="handleImportField">
                <el-icon><Upload /></el-icon>导入地块
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>

      <div class="map-container">
        <FieldMap
          ref="fieldMapRef"
          :fields="fields"
          @field-click="handleFieldClick"
        />
      </div>
    </el-card>

    <!-- 地块信息抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="地块信息"
      size="400px"
    >
      <template v-if="selectedField">
        <div class="field-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="地块编号">
              {{ selectedField.code }}
            </el-descriptions-item>
            <el-descriptions-item label="地块名称">
              {{ selectedField.name }}
            </el-descriptions-item>
            <el-descriptions-item label="面积">
              {{ selectedField.area }}亩
            </el-descriptions-item>
            <el-descriptions-item label="品种">
              {{ selectedField.variety }}
            </el-descriptions-item>
            <el-descriptions-item label="种植日期">
              {{ selectedField.plantingDate }}
            </el-descriptions-item>
            <el-descriptions-item label="预计收获日期">
              {{ selectedField.expectedHarvestDate }}
            </el-descriptions-item>
            <el-descriptions-item label="负责人">
              {{ selectedField.manager }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ selectedField.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(selectedField.status)">
                {{ getStatusText(selectedField.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <div class="drawer-footer">
            <el-button-group>
              <el-button type="primary" @click="handleEditField">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button type="danger" @click="handleDeleteField">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import FieldMap from '@/components/map/FieldMap.vue'
import {
  Plus,
  Upload,
  Edit,
  Delete
} from '@element-plus/icons-vue'

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
}

const fieldMapRef = ref()
const fields = ref<Field[]>([])
const drawerVisible = ref(false)
const selectedField = ref<Field | null>(null)

// 获取地块列表
const fetchFields = async () => {
  try {
    // TODO: 调用API获取地块列表
    // const res = await getFields()
    // fields.value = res.data
  } catch (error) {
    console.error('获取地块列表失败:', error)
    ElMessage.error('获取地块列表失败')
  }
}

// 获取状态类型
const getStatusType = (status: Field['status']) => {
  const types: Record<Field['status'], string> = {
    normal: 'success',
    warning: 'warning',
    offline: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: Field['status']) => {
  const texts: Record<Field['status'], string> = {
    normal: '正常',
    warning: '异常',
    offline: '离线'
  }
  return texts[status] || '未知'
}

// 地块点击事件
const handleFieldClick = (field: Field) => {
  selectedField.value = field
  drawerVisible.value = true
}

// 新增地块
const handleAddField = () => {
  // TODO: 实现新增地块功能
}

// 导入地块
const handleImportField = () => {
  // TODO: 实现导入地块功能
}

// 编辑地块
const handleEditField = () => {
  // TODO: 实现编辑地块功能
}

// 删除地块
const handleDeleteField = () => {
  if (!selectedField.value) return

  ElMessageBox.confirm('确认删除该地块吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用删除API
      // await deleteField(selectedField.value.id)
      ElMessage.success('删除成功')
      drawerVisible.value = false
      fetchFields()
    } catch (error) {
      console.error('删除地块失败:', error)
      ElMessage.error('删除地块失败')
    }
  })
}

onMounted(() => {
  fetchFields()
})
</script>

<style scoped>
.field-map {
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-card {
  flex: 1;
  margin: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.map-container {
  flex: 1;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.field-info {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-drawer__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-descriptions) {
  padding: 0 20px;
}
</style> 