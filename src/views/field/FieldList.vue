<template>
  <div class="field-list">
    <!-- 搜索和过滤区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="地块编号">
          <el-input
            v-model="searchForm.code"
            placeholder="请输入地块编号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="地块名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入地块名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-select v-model="searchForm.variety" placeholder="请选择品种" clearable>
            <el-option label="云烟87" value="云烟87" />
            <el-option label="云烟85" value="云烟85" />
            <el-option label="云烟97" value="云烟97" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="异常" value="warning" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item label="种植日期">
          <el-date-picker
            v-model="searchForm.plantingDate"
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

    <!-- 地块列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="card-header">
          <span>地块列表</span>
          <div class="header-buttons">
            <el-upload
              class="upload-button"
              action="/api/fields/import"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <el-button type="success">
                <el-icon><Upload /></el-icon>导入地块
              </el-button>
            </el-upload>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>新增地块
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="fieldList"
        border
        style="width: 100%"
      >
        <el-table-column prop="code" label="地块编号" width="120" />
        <el-table-column prop="name" label="地块名称" width="150" />
        <el-table-column prop="area" label="面积(亩)" width="100" />
        <el-table-column prop="variety" label="品种" width="120" />
        <el-table-column prop="plantingDate" label="种植日期" width="120" />
        <el-table-column prop="expectedHarvestDate" label="预计收获日期" width="120" />
        <el-table-column prop="manager" label="负责人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleView(row)">
                <el-icon><View /></el-icon>查看
              </el-button>
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button type="success" link @click="handleUpload(row)">
                <el-icon><Upload /></el-icon>上传
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增地块' : '编辑地块'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="地块编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入地块编号" />
        </el-form-item>
        <el-form-item label="地块名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入地块名称" />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input-number v-model="form.area" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="品种" prop="variety">
          <el-select v-model="form.variety" placeholder="请选择品种">
            <el-option label="云烟87" value="云烟87" />
            <el-option label="云烟85" value="云烟85" />
            <el-option label="云烟97" value="云烟97" />
          </el-select>
        </el-form-item>
        <el-form-item label="种植日期" prop="plantingDate">
          <el-date-picker
            v-model="form.plantingDate"
            type="date"
            placeholder="选择种植日期"
          />
        </el-form-item>
        <el-form-item label="预计收获日期" prop="expectedHarvestDate">
          <el-date-picker
            v-model="form.expectedHarvestDate"
            type="date"
            placeholder="选择预计收获日期"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="form.manager" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地块文件" prop="file">
          <el-upload
            class="upload-demo"
            action="/api/fields/upload"
            :on-success="handleFileSuccess"
            :on-error="handleFileError"
            :before-upload="beforeFileUpload"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 .shp, .dbf, .shx 格式文件
              </div>
            </template>
          </el-upload>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  View,
  Edit,
  Delete,
  Upload
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const fieldList = ref([])

// 搜索表单
const searchForm = reactive({
  code: '',
  name: '',
  variety: '',
  status: '',
  plantingDate: []
})

// 表单数据
const form = reactive({
  code: '',
  name: '',
  area: 0,
  variety: '',
  plantingDate: '',
  expectedHarvestDate: '',
  manager: '',
  phone: '',
  file: null
})

// 表单验证规则
const rules = {
  code: [{ required: true, message: '请输入地块编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入地块名称', trigger: 'blur' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  variety: [{ required: true, message: '请选择品种', trigger: 'change' }],
  plantingDate: [{ required: true, message: '请选择种植日期', trigger: 'change' }],
  expectedHarvestDate: [{ required: true, message: '请选择预计收获日期', trigger: 'change' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    normal: 'success',
    warning: 'warning',
    offline: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    normal: '正常',
    warning: '异常',
    offline: '离线'
  }
  return texts[status] || '未知'
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    if (key === 'plantingDate') {
      searchForm[key] = []
    } else {
      searchForm[key as keyof typeof searchForm] = ''
    }
  })
  handleSearch()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // const res = await getFields({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })
    // fieldList.value = res.data.list
    // total.value = res.data.total
  } catch (error) {
    console.error('获取地块列表失败:', error)
    ElMessage.error('获取地块列表失败')
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(form).forEach(key => {
    if (key === 'area') {
      form[key] = 0
    } else {
      form[key as keyof typeof form] = ''
    }
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    form[key as keyof typeof form] = row[key]
  })
  dialogVisible.value = true
}

// 查看
const handleView = (row: any) => {
  router.push(`/fields/${row.id}`)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该地块吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用删除API
      // await deleteField(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('删除地块失败:', error)
      ElMessage.error('删除地块失败')
    }
  })
}

// 上传地块文件
const handleUpload = (row: any) => {
  // TODO: 实现地块文件上传功能
}

// 上传成功回调
const handleUploadSuccess = (response: any) => {
  ElMessage.success('导入成功')
  fetchData()
}

// 上传失败回调
const handleUploadError = (error: any) => {
  console.error('导入失败:', error)
  ElMessage.error('导入失败')
}

// 上传前校验
const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!')
    return false
  }
  return true
}

// 文件上传成功回调
const handleFileSuccess = (response: any) => {
  form.file = response.data
  ElMessage.success('文件上传成功')
}

// 文件上传失败回调
const handleFileError = (error: any) => {
  console.error('文件上传失败:', error)
  ElMessage.error('文件上传失败')
}

// 文件上传前校验
const beforeFileUpload = (file: File) => {
  const isShapefile = file.name.endsWith('.shp') || 
                      file.name.endsWith('.dbf') || 
                      file.name.endsWith('.shx')
  if (!isShapefile) {
    ElMessage.error('只能上传 Shapefile 格式文件!')
    return false
  }
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用保存API
        // if (dialogType.value === 'add') {
        //   await createField(form)
        // } else {
        //   await updateField(form.id, form)
        // }
        ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存地块失败:', error)
        ElMessage.error('保存地块失败')
      }
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.field-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-input-number) {
  width: 180px;
}

:deep(.el-date-picker) {
  width: 180px;
}

:deep(.el-select) {
  width: 180px;
}

.upload-demo {
  width: 100%;
}
</style> 