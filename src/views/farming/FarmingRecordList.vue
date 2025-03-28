<template>
  <div class="farming-record-list">
    <div class="page-header">
      <h2>农事记录</h2>
      <el-button type="primary" @click="createRecord">
        <el-icon><Plus /></el-icon>添加农事记录
      </el-button>
    </div>
    
    <el-card>
      <div class="filter-container">
        <el-form :inline="true" :model="filter" class="filter-form">
          <el-form-item label="地块">
            <el-select 
              v-model="filter.field_id" 
              placeholder="选择地块" 
              clearable 
              style="width: 220px"
            >
              <el-option 
                v-for="field in fields" 
                :key="field.id" 
                :label="field.field_name" 
                :value="field.id">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="操作类型">
            <el-select 
              v-model="filter.operation_type" 
              placeholder="选择操作类型" 
              clearable
              style="width: 180px"
            >
              <el-option 
                v-for="type in operationTypes" 
                :key="type.type_code" 
                :label="type.type_name" 
                :value="type.type_code">
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 350px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table 
        v-loading="loading" 
        :data="records" 
        style="width: 100%" 
        border 
        @row-click="handleRowClick" 
        row-key="id"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operation_type" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeColor(row.operation_type)">
              {{ getOperationTypeName(row.operation_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation_date" label="操作日期" width="160">
          <template #default="{ row }">
            {{ formatDate(row.operation_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="field_id" label="地块" width="180">
          <template #default="{ row }">
            {{ getFieldName(row.field_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="operation_details" label="操作详情" min-width="250" show-overflow-tooltip />
        <el-table-column prop="operation_area" label="作业面积(亩)" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small" 
              type="primary" 
              link
              @click.stop="viewRecord(row)"
            >
              查看
            </el-button>
            <el-button 
              size="small" 
              type="primary" 
              link
              @click.stop="editRecord(row)"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              link
              @click.stop="confirmDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { 
  getFarmingOperationList, 
  getFarmingOperationTypeList,
  deleteFarmingOperationRecord
} from '@/api/farming'
import { getAllFields } from '@/api/field'
import { farmingOperationTypes } from '@/mock/farming'

// 定义状态变量
const router = useRouter()
const loading = ref(false)
const records = ref<any[]>([])
const fields = ref<any[]>([])
const operationTypes = ref<any[]>([])
const dateRange = ref<[string, string] | null>(null)

// 筛选条件
const filter = reactive({
  field_id: '',
  operation_type: '',
  start_date: '',
  end_date: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取操作类型名称
const getOperationTypeName = (typeCode: string): string => {
  const type = operationTypes.value.find(t => t.type_code === typeCode)
  return type ? type.type_name : typeCode
}

// 获取操作类型标签颜色
const getOperationTypeColor = (typeCode: string): string => {
  const colorMap: Record<string, string> = {
    transplanting: 'success',
    fertilizing: 'primary',
    watering: 'info',
    pest_control: 'danger',
    topping: 'warning',
    harvesting: '',
    weeding: ''
  }
  
  return colorMap[typeCode] || ''
}

// 获取地块名称
const getFieldName = (fieldId: number): string => {
  const field = fields.value.find(f => f.id === fieldId)
  return field ? field.field_name : `地块#${fieldId}`
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 加载农事记录列表
const loadRecords = async () => {
  try {
    loading.value = true
    
    // 准备请求参数
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filter
    }
    
    // 从日期范围中提取开始和结束日期
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_date = dateRange.value[0]
      params.end_date = dateRange.value[1]
    }
    
    const res = await getFarmingOperationList(params)
    
    if (res.success) {
      records.value = res.data
      pagination.total = res.meta.total
    } else {
      ElMessage.error('获取农事记录失败')
    }
  } catch (error) {
    console.error('加载农事记录出错', error)
    ElMessage.error('加载农事记录出错')
  } finally {
    loading.value = false
  }
}

// 加载地块列表
const loadFields = async () => {
  try {
    const res = await getAllFields()
    if (res.success) {
      fields.value = res.data
    }
  } catch (error) {
    console.error('加载地块列表出错', error)
  }
}

// 加载操作类型列表
const loadOperationTypes = async () => {
  try {
    const res = await getFarmingOperationTypeList()
    if (res.success) {
      operationTypes.value = res.data
    }
  } catch (error) {
    console.error('加载操作类型列表出错', error)
  }
}

// 处理筛选
const handleFilter = () => {
  pagination.page = 1
  loadRecords()
}

// 重置筛选
const resetFilter = () => {
  filter.field_id = ''
  filter.operation_type = ''
  dateRange.value = null
  handleFilter()
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  loadRecords()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  pagination.page = val
  loadRecords()
}

// 行点击事件
const handleRowClick = (row: any) => {
  viewRecord(row)
}

// 查看记录详情
const viewRecord = (row: any) => {
  router.push(`/farming/records/${row.id}`)
}

// 创建新记录
const createRecord = () => {
  router.push('/farming/records/create')
}

// 编辑记录
const editRecord = (row: any) => {
  router.push(`/farming/records/edit/${row.id}`)
}

// 确认删除记录
const confirmDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除ID为 ${row.id} 的农事记录吗？`, '删除确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteFarmingOperationRecord(row.id)
      if (res.success) {
        ElMessage.success('删除成功')
        loadRecords()
      } else {
        ElMessage.error(`删除失败: ${res.message}`)
      }
    } catch (error) {
      console.error('删除记录出错', error)
      ElMessage.error('删除记录出错')
    }
  }).catch(() => {})
}

// 初始化加载数据
onMounted(async () => {
  // 并行加载资源
  await Promise.all([
    loadFields(),
    loadOperationTypes()
  ])
  
  // 加载记录列表
  loadRecords()
})
</script>

<style scoped>
.farming-record-list {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.filter-container {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style> 