<template>
  <div class="field-detail">
    <!-- 页面标题和操作栏 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
        <h2>地块详情</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>编辑
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-tag :type="getStatusType(fieldInfo.status)">
            {{ getStatusText(fieldInfo.status) }}
          </el-tag>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="地块编号">{{ fieldInfo.code }}</el-descriptions-item>
        <el-descriptions-item label="地块名称">{{ fieldInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ fieldInfo.area }}亩</el-descriptions-item>
        <el-descriptions-item label="种植品种">{{ fieldInfo.variety }}</el-descriptions-item>
        <el-descriptions-item label="种植时间">{{ fieldInfo.plantingDate }}</el-descriptions-item>
        <el-descriptions-item label="预计收获时间">{{ fieldInfo.expectedHarvestDate }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ fieldInfo.manager }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ fieldInfo.phone }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 环境数据卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>环境数据</span>
          <el-button-group>
            <el-button size="small" @click="handleRefreshEnvData">
              <el-icon><Refresh /></el-icon>刷新
            </el-button>
            <el-button size="small" @click="handleViewEnvHistory">
              <el-icon><DataLine /></el-icon>历史数据
            </el-button>
          </el-button-group>
        </div>
      </template>
      <div class="env-data-grid">
        <div class="env-data-item">
          <div class="data-label">温度</div>
          <div class="data-value">{{ envData.temperature }}°C</div>
          <div class="data-trend" :class="getTrendClass(envData.temperatureTrend)">
            <el-icon><component :is="getTrendIcon(envData.temperatureTrend)" /></el-icon>
            {{ envData.temperatureTrend }}%
          </div>
        </div>
        <div class="env-data-item">
          <div class="data-label">湿度</div>
          <div class="data-value">{{ envData.humidity }}%</div>
          <div class="data-trend" :class="getTrendClass(envData.humidityTrend)">
            <el-icon><component :is="getTrendIcon(envData.humidityTrend)" /></el-icon>
            {{ envData.humidityTrend }}%
          </div>
        </div>
        <div class="env-data-item">
          <div class="data-label">光照</div>
          <div class="data-value">{{ envData.light }}lux</div>
          <div class="data-trend" :class="getTrendClass(envData.lightTrend)">
            <el-icon><component :is="getTrendIcon(envData.lightTrend)" /></el-icon>
            {{ envData.lightTrend }}%
          </div>
        </div>
        <div class="env-data-item">
          <div class="data-label">土壤湿度</div>
          <div class="data-value">{{ envData.soilMoisture }}%</div>
          <div class="data-trend" :class="getTrendClass(envData.soilMoistureTrend)">
            <el-icon><component :is="getTrendIcon(envData.soilMoistureTrend)" /></el-icon>
            {{ envData.soilMoistureTrend }}%
          </div>
        </div>
      </div>
    </el-card>

    <!-- 监测数据卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>监测数据</span>
          <el-button-group>
            <el-button size="small" @click="handleAddMonitoring">
              <el-icon><Plus /></el-icon>添加记录
            </el-button>
            <el-button size="small" @click="handleViewMonitoringHistory">
              <el-icon><DataLine /></el-icon>历史记录
            </el-button>
          </el-button-group>
        </div>
      </template>
      <el-table :data="monitoringData" border style="width: 100%">
        <el-table-column prop="date" label="监测时间" width="180" />
        <el-table-column prop="growthStage" label="生长阶段" width="120" />
        <el-table-column prop="plantHeight" label="植株高度(cm)" width="120" />
        <el-table-column prop="leafCount" label="叶片数" width="100" />
        <el-table-column prop="pestStatus" label="病虫害情况" />
        <el-table-column prop="notes" label="备注" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="handleEditMonitoring(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleDeleteMonitoring(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑地块' : '添加监测记录'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <template v-if="dialogType === 'edit'">
          <el-form-item label="地块名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入地块名称" />
          </el-form-item>
          <el-form-item label="面积" prop="area">
            <el-input-number v-model="form.area" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="种植品种" prop="variety">
            <el-select v-model="form.variety" placeholder="请选择种植品种">
              <el-option label="云烟87" value="yunyan87" />
              <el-option label="红大" value="hongda" />
              <el-option label="K326" value="k326" />
            </el-select>
          </el-form-item>
          <el-form-item label="种植时间" prop="plantingDate">
            <el-date-picker
              v-model="form.plantingDate"
              type="date"
              placeholder="选择种植时间"
            />
          </el-form-item>
          <el-form-item label="预计收获时间" prop="expectedHarvestDate">
            <el-date-picker
              v-model="form.expectedHarvestDate"
              type="date"
              placeholder="选择预计收获时间"
            />
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="form.manager" placeholder="请输入负责人姓名" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="监测时间" prop="date">
            <el-date-picker
              v-model="form.date"
              type="datetime"
              placeholder="选择监测时间"
            />
          </el-form-item>
          <el-form-item label="生长阶段" prop="growthStage">
            <el-select v-model="form.growthStage" placeholder="请选择生长阶段">
              <el-option label="育苗期" value="seedling" />
              <el-option label="生长期" value="growing" />
              <el-option label="成熟期" value="mature" />
              <el-option label="收获期" value="harvest" />
            </el-select>
          </el-form-item>
          <el-form-item label="植株高度" prop="plantHeight">
            <el-input-number v-model="form.plantHeight" :min="0" :precision="1" />
          </el-form-item>
          <el-form-item label="叶片数" prop="leafCount">
            <el-input-number v-model="form.leafCount" :min="0" />
          </el-form-item>
          <el-form-item label="病虫害情况" prop="pestStatus">
            <el-input
              v-model="form.pestStatus"
              type="textarea"
              placeholder="请输入病虫害情况"
            />
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <el-input
              v-model="form.notes"
              type="textarea"
              placeholder="请输入备注信息"
            />
          </el-form-item>
        </template>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Edit,
  Download,
  Refresh,
  DataLine,
  Plus,
  Delete,
  ArrowUp,
  ArrowDown,
  Minus
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

// 地块基本信息
const fieldInfo = reactive({
  code: 'F001',
  name: '示范地块1',
  area: 10.5,
  variety: '云烟87',
  plantingDate: '2024-03-01',
  expectedHarvestDate: '2024-07-01',
  manager: '张三',
  phone: '13800138000',
  status: 'normal'
})

// 环境数据
const envData = reactive({
  temperature: 25.6,
  temperatureTrend: 2.5,
  humidity: 65,
  humidityTrend: -1.2,
  light: 12000,
  lightTrend: 5.8,
  soilMoisture: 45,
  soilMoistureTrend: 0
})

// 监测数据
const monitoringData = ref([
  {
    date: '2024-03-15 14:30',
    growthStage: '生长期',
    plantHeight: 45.5,
    leafCount: 12,
    pestStatus: '正常',
    notes: '生长良好'
  },
  // 更多数据...
])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'edit' | 'monitoring'>('edit')
const formRef = ref<FormInstance>()
const form = reactive({
  // 地块信息
  name: '',
  area: 0,
  variety: '',
  plantingDate: '',
  expectedHarvestDate: '',
  manager: '',
  phone: '',
  // 监测信息
  date: '',
  growthStage: '',
  plantHeight: 0,
  leafCount: 0,
  pestStatus: '',
  notes: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入地块名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  area: [
    { required: true, message: '请输入面积', trigger: 'blur' }
  ],
  variety: [
    { required: true, message: '请选择种植品种', trigger: 'change' }
  ],
  plantingDate: [
    { required: true, message: '请选择种植时间', trigger: 'change' }
  ],
  expectedHarvestDate: [
    { required: true, message: '请选择预计收获时间', trigger: 'change' }
  ],
  manager: [
    { required: true, message: '请输入负责人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择监测时间', trigger: 'change' }
  ],
  growthStage: [
    { required: true, message: '请选择生长阶段', trigger: 'change' }
  ],
  plantHeight: [
    { required: true, message: '请输入植株高度', trigger: 'blur' }
  ],
  leafCount: [
    { required: true, message: '请输入叶片数', trigger: 'blur' }
  ]
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    normal: 'success',
    pending: 'warning',
    archived: 'info'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    normal: '正常',
    pending: '待处理',
    archived: '已归档'
  }
  return texts[status] || status
}

// 获取趋势类型
const getTrendClass = (trend: number) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return 'trend-stable'
}

// 获取趋势图标
const getTrendIcon = (trend: number) => {
  if (trend > 0) return ArrowUp
  if (trend < 0) return ArrowDown
  return Minus
}

// 编辑地块
const handleEdit = () => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, fieldInfo)
}

// 导出数据
const handleExport = () => {
  // TODO: 实现导出逻辑
}

// 刷新环境数据
const handleRefreshEnvData = () => {
  // TODO: 实现刷新逻辑
}

// 查看环境数据历史
const handleViewEnvHistory = () => {
  // TODO: 实现查看历史逻辑
}

// 添加监测记录
const handleAddMonitoring = () => {
  dialogType.value = 'monitoring'
  dialogVisible.value = true
  Object.assign(form, {
    date: '',
    growthStage: '',
    plantHeight: 0,
    leafCount: 0,
    pestStatus: '',
    notes: ''
  })
}

// 查看监测历史
const handleViewMonitoringHistory = () => {
  // TODO: 实现查看历史逻辑
}

// 编辑监测记录
const handleEditMonitoring = (row: any) => {
  dialogType.value = 'monitoring'
  dialogVisible.value = true
  Object.assign(form, row)
}

// 删除监测记录
const handleDeleteMonitoring = (row: any) => {
  // TODO: 实现删除逻辑
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // TODO: 实现提交逻辑
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.field-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.info-card {
  margin-bottom: 20px;
}

.info-card:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.env-data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.env-data-item {
  text-align: center;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.data-label {
  color: #606266;
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.data-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.trend-stable {
  color: #909399;
}

:deep(.el-button-group) {
  display: flex;
  gap: 4px;
}
</style> 