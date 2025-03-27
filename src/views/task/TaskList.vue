<template>
  <div class="task-list">
    <!-- 搜索和过滤区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="任务编号">
          <el-input
            v-model="searchForm.code"
            placeholder="请输入任务编号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="searchForm.type" placeholder="请选择任务类型" clearable>
            <el-option
              v-for="item in taskTypes"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生长阶段">
          <el-select v-model="searchForm.growingPhase" placeholder="请选择生长阶段" clearable>
            <el-option label="移栽期" value="transplanting" />
            <el-option label="旺长期" value="growing" />
            <el-option label="打顶期" value="topping" />
            <el-option label="成熟采收期" value="harvesting" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchForm.status" placeholder="请选择任务状态" clearable>
            <el-option label="已创建" value="created" />
            <el-option label="数据采集中" value="data_collecting" />
            <el-option label="数据验证中" value="data_validating" />
            <el-option label="基础分析中" value="basic_analyzing" />
            <el-option label="智能分析中" value="llm_analyzing" />
            <el-option label="决策制定中" value="decision_making" />
            <el-option label="执行中" value="executing" />
            <el-option label="反馈收集中" value="feedback_collecting" />
            <el-option label="已完成" value="completed" />
            <el-option label="规划下次监测" value="planning_next" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="searchForm.priority" placeholder="请选择优先级" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作区域 -->
    <el-card class="operation-card">
      <div class="operation-container">
        <div class="left-operations">
          <el-button type="primary" @click="handleCreateTask">
            <el-icon><Plus /></el-icon>创建监测任务
          </el-button>
          <el-button @click="handleViewCalendar">
            <el-icon><Calendar /></el-icon>日历视图
          </el-button>
        </div>
        <div class="right-operations">
          <el-button-group>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>导出
            </el-button>
            <el-button @click="handleRefresh">
              <el-icon><Refresh /></el-icon>刷新
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>

    <!-- 任务列表 -->
    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="taskList"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="任务编号" min-width="120" />
        <el-table-column prop="name" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="任务类型" min-width="120">
          <template #default="{ row }">
            {{ getTaskTypeName(row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="生长阶段" min-width="120">
          <template #default="{ row }">
            <el-tag v-if="row.growingPhase === 'transplanting'" type="success">移栽期</el-tag>
            <el-tag v-else-if="row.growingPhase === 'growing'" type="primary">旺长期</el-tag>
            <el-tag v-else-if="row.growingPhase === 'topping'" type="warning">打顶期</el-tag>
            <el-tag v-else-if="row.growingPhase === 'harvesting'" type="danger">成熟采收期</el-tag>
            <span v-else>{{ row.growingPhase }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优先级" min-width="80">
          <template #default="{ row }">
            <el-tag v-if="row.priority === 'high'" type="danger">高</el-tag>
            <el-tag v-else-if="row.priority === 'medium'" type="warning">中</el-tag>
            <el-tag v-else-if="row.priority === 'low'" type="info">低</el-tag>
            <span v-else>{{ row.priority }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划时间" min-width="180">
          <template #default="{ row }">
            {{ row.scheduledStartDate }} 至 {{ row.scheduledEndDate }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
        <el-table-column label="相关地块" min-width="100">
          <template #default="{ row }">
            <el-popover
              placement="bottom"
              :width="200"
              trigger="hover"
            >
              <template #reference>
                <el-button text>{{ row.fields ? row.fields.length : 0 }} 个地块</el-button>
              </template>
              <div v-if="row.fields && row.fields.length > 0">
                <div v-for="field in row.fields" :key="field.id" class="field-item">
                  <span>{{ field.name }}</span>
                  <span>{{ field.area }} 亩</span>
                </div>
              </div>
              <div v-else>暂无相关地块</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="220">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.status !== 'created'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '创建监测任务' : '编辑监测任务'"
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="task-form"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择任务类型" style="width: 100%">
            <el-option
              v-for="item in taskTypes"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生长阶段" prop="growingPhase">
          <el-select v-model="form.growingPhase" placeholder="请选择生长阶段" style="width: 100%">
            <el-option label="移栽期" value="transplanting" />
            <el-option label="旺长期" value="growing" />
            <el-option label="打顶期" value="topping" />
            <el-option label="成熟采收期" value="harvesting" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级" style="width: 100%">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间" prop="scheduledDate">
          <el-date-picker
            v-model="form.scheduledDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>
        <el-form-item label="选择地块" prop="fields">
          <el-select
            v-model="form.fields"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择地块"
            style="width: 100%"
          >
            <el-option
              v-for="item in fieldOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Refresh, Plus, Calendar, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTaskList, getTaskTypes, createTask, updateTask, deleteTask } from '@/api/task'
import type { TaskStatus, TaskPriority, GrowingPhase, TaskType, Task } from '@/types/task'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 任务类型列表
const taskTypes = ref<TaskType[]>([])

// 地块选项
const fieldOptions = ref<any[]>([
  { id: '1', name: '东山1号烟田' },
  { id: '2', name: '西峰2号烟田' },
  { id: '3', name: '北湖3号烟田' },
  { id: '4', name: '南坡4号烟田' },
  { id: '5', name: '中心5号烟田' }
])

// 搜索表单类型
interface SearchForm {
  code: string
  name: string
  type: string
  growingPhase: string
  status: string
  priority: string
  dateRange: string[] | null
}

// 搜索表单
const searchForm = reactive<SearchForm>({
  code: '',
  name: '',
  type: '',
  growingPhase: '',
  status: '',
  priority: '',
  dateRange: null
})

// 任务列表
const taskList = ref<Task[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 任务表单类型
interface TaskForm {
  id: string
  name: string
  type: string
  growingPhase: string
  priority: string
  scheduledDate: string[] | null
  description: string
  fields: string[]
}

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const formRef = ref()
const form = reactive<TaskForm>({
  id: '',
  name: '',
  type: '',
  growingPhase: '',
  priority: 'medium',
  scheduledDate: null,
  description: '',
  fields: []
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  growingPhase: [{ required: true, message: '请选择生长阶段', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  scheduledDate: [{ required: true, message: '请选择计划时间', trigger: 'change' }],
  fields: [{ required: true, message: '请选择地块', trigger: 'change' }]
}

// 获取任务类型名称
const getTaskTypeName = (typeCode: string) => {
  const type = taskTypes.value.find(item => item.code === typeCode)
  return type ? type.name : typeCode
}

// 获取状态类型
const getStatusType = (status: TaskStatus) => {
  const statusMap: Record<string, string> = {
    created: 'info',
    data_collecting: 'warning',
    data_validating: 'warning',
    basic_analyzing: 'primary',
    llm_analyzing: 'primary',
    decision_making: 'primary',
    executing: 'success',
    feedback_collecting: 'success',
    completed: 'success',
    planning_next: 'info'
  }
  return statusMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: TaskStatus) => {
  const statusMap: Record<string, string> = {
    created: '已创建',
    data_collecting: '数据采集中',
    data_validating: '数据验证中',
    basic_analyzing: '基础分析中',
    llm_analyzing: '智能分析中',
    decision_making: '决策制定中',
    executing: '执行中',
    feedback_collecting: '反馈收集中',
    completed: '已完成',
    planning_next: '规划下次监测'
  }
  return statusMap[status] || status
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  // 重置搜索表单
  searchForm.code = ''
  searchForm.name = ''
  searchForm.type = ''
  searchForm.growingPhase = ''
  searchForm.status = ''
  searchForm.priority = ''
  searchForm.dateRange = null
  handleSearch()
}

// 刷新
const handleRefresh = () => {
  fetchData()
}

// 分页事件
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    }

    // 处理日期范围
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.dateRange = searchForm.dateRange.join(',')
      delete params.dateRange
    }

    const res = await getTaskList(params)
    taskList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取任务列表失败:', error)
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 创建任务
const handleCreateTask = () => {
  dialogType.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 编辑任务
const handleEdit = (row: Task) => {
  dialogType.value = 'edit'
  resetForm()
  form.id = row.id
  form.name = row.name
  form.type = row.type
  form.growingPhase = row.growingPhase
  form.priority = row.priority
  form.scheduledDate = [row.scheduledStartDate, row.scheduledEndDate]
  form.description = row.description || ''
  form.fields = row.fields ? row.fields.map((field) => field.id) : []
  dialogVisible.value = true
}

// 查看任务
const handleView = (row: Task) => {
  router.push(`/tasks/${row.id}`)
}

// 删除任务
const handleDelete = (row: Task) => {
  ElMessageBox.confirm('确认删除该任务吗？删除后无法恢复！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTask(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 查看日历视图
const handleViewCalendar = () => {
  router.push('/tasks/calendar')
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.type = ''
  form.growingPhase = ''
  form.priority = 'medium'
  form.scheduledDate = null
  form.description = ''
  form.fields = []
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 准备提交的数据
        const submitData: any = {
          name: form.name,
          type: form.type,
          growingPhase: form.growingPhase,
          priority: form.priority,
          description: form.description,
          fields: form.fields
        }

        // 处理日期
        if (form.scheduledDate && form.scheduledDate.length === 2) {
          submitData.scheduledStartDate = form.scheduledDate[0]
          submitData.scheduledEndDate = form.scheduledDate[1]
        }

        if (dialogType.value === 'create') {
          await createTask(submitData)
          ElMessage.success('创建成功')
        } else {
          await updateTask(form.id, submitData)
          ElMessage.success('更新成功')
        }
        
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    } else {
      return false
    }
  })
}

// 获取任务类型列表
const loadTaskTypes = async () => {
  try {
    const res = await getTaskTypes()
    taskTypes.value = res.data
  } catch (error) {
    console.error('获取任务类型失败:', error)
    ElMessage.error('获取任务类型失败')
  }
}

// 生命周期钩子
onMounted(() => {
  loadTaskTypes()
  fetchData()
})
</script>

<style scoped>
.task-list {
  padding: 20px;
}

.search-card,
.operation-card,
.list-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.operation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.task-form {
  max-width: 100%;
}

.field-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px dashed #eee;
}

.field-item:last-child {
  border-bottom: none;
}

:deep(.el-tag) {
  margin-right: 5px;
}
</style> 