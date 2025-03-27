<template>
  <div class="land-management">
    <el-card class="land-list">
      <template #header>
        <div class="card-header">
          <span>地块列表</span>
          <el-button type="primary" @click="handleAddLand">新增地块</el-button>
        </div>
      </template>
      
      <el-table :data="lands" style="width: 100%">
        <el-table-column prop="name" label="地块名称" />
        <el-table-column prop="area" label="面积(亩)" />
        <el-table-column prop="crop" label="作物" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="handleEditLand(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteLand(row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 地块表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增地块' : '编辑地块'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="landForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="地块名称" prop="name">
          <el-input v-model="landForm.name" />
        </el-form-item>
        <el-form-item label="面积(亩)" prop="area">
          <el-input-number v-model="landForm.area" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="作物" prop="crop">
          <el-select v-model="landForm.crop" placeholder="请选择作物">
            <el-option label="烟草" value="tobacco" />
            <el-option label="玉米" value="corn" />
            <el-option label="水稻" value="rice" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="landForm.status" placeholder="请选择状态">
            <el-option label="空闲" value="idle" />
            <el-option label="种植中" value="planting" />
            <el-option label="收获中" value="harvesting" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Land, CreateLandDto, UpdateLandDto } from '@/services/landService'
import * as landService from '@/services/landService'

// 地块列表数据
const lands = ref<Land[]>([])

// 获取地块列表
const fetchLands = async () => {
  try {
    const data = await landService.getLands()
    lands.value = data
  } catch (error) {
    ElMessage.error('获取地块列表失败')
  }
}

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const landForm = reactive<Land>({
  id: '',
  name: '',
  area: 0,
  crop: '',
  status: 'idle'
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入地块名称', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入地块面积', trigger: 'blur' }
  ],
  crop: [
    { required: true, message: '请选择作物', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 状态相关方法
const getStatusType = (status: Land['status']) => {
  const types: Record<Land['status'], string> = {
    idle: 'info',
    planting: 'success',
    harvesting: 'warning'
  }
  return types[status]
}

const getStatusText = (status: Land['status']) => {
  const texts: Record<Land['status'], string> = {
    idle: '空闲',
    planting: '种植中',
    harvesting: '收获中'
  }
  return texts[status]
}

// 地块操作方法
const handleAddLand = () => {
  dialogType.value = 'add'
  Object.assign(landForm, {
    id: '',
    name: '',
    area: 0,
    crop: '',
    status: 'idle'
  })
  dialogVisible.value = true
}

const handleEditLand = (land: Land) => {
  dialogType.value = 'edit'
  Object.assign(landForm, land)
  dialogVisible.value = true
}

const handleDeleteLand = async (land: Land) => {
  try {
    await ElMessageBox.confirm('确定要删除该地块吗？', '提示', {
      type: 'warning'
    })
    await landService.deleteLand(land.id)
    ElMessage.success('删除成功')
    fetchLands()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          const data: CreateLandDto = {
            name: landForm.name,
            area: landForm.area,
            crop: landForm.crop,
            status: landForm.status
          }
          await landService.createLand(data)
          ElMessage.success('新增成功')
        } else {
          const data: UpdateLandDto = {
            id: landForm.id,
            name: landForm.name,
            area: landForm.area,
            crop: landForm.crop,
            status: landForm.status
          }
          await landService.updateLand(data)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchLands()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '新增失败' : '更新失败')
      }
    }
  })
}

// 初始化
onMounted(() => {
  fetchLands()
})
</script>

<style scoped>
.land-management {
  padding: 20px;
}

.land-list {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 