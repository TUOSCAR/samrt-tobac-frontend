<template>
  <div class="drone-image-list">
    <div class="page-header">
      <h2>无人机影像管理</h2>
      <el-button type="primary" @click="showUploadDialog">上传新影像</el-button>
    </div>

    <el-card class="filter-card">
      <div class="filter-form">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="地块">
            <el-select v-model="filterForm.fieldId" placeholder="选择地块" clearable @change="handleFieldChange">
              <el-option
                v-for="field in fields"
                :key="field.id"
                :label="field.field_name"
                :value="field.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="影像类型">
            <el-select v-model="filterForm.type" placeholder="选择类型" clearable>
              <el-option label="RGB" value="RGB" />
              <el-option label="多光谱" value="Multispectral" />
              <el-option label="热红外" value="Thermal" />
            </el-select>
          </el-form-item>
          <el-form-item label="拍摄日期">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="list-card">
      <div class="data-grid">
        <el-table
          v-loading="loading"
          :data="imageList"
          border
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="fieldName" label="地块名称" width="180" />
          <el-table-column label="缩略图" width="150">
            <template #default="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.imageUrl"
                fit="cover"
                :preview-src-list="[scope.row.imageUrl]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="影像类型" width="120" />
          <el-table-column prop="resolution" label="分辨率" width="120" />
          <el-table-column prop="captureTime" label="拍摄时间" width="180" />
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewImage(scope.row)" plain>
                查看
              </el-button>
              <el-button type="danger" size="small" @click="deleteImage(scope.row)" plain>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 上传影像对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传新影像"
      width="500px"
    >
      <el-form :model="uploadForm" label-width="100px" :rules="uploadRules" ref="uploadFormRef">
        <el-form-item label="地块" prop="fieldId">
          <el-select v-model="uploadForm.fieldId" placeholder="选择地块">
            <el-option
              v-for="field in fields"
              :key="field.id"
              :label="field.field_name"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="影像类型" prop="type">
          <el-select v-model="uploadForm.type" placeholder="选择类型">
            <el-option label="RGB" value="RGB" />
            <el-option label="多光谱" value="Multispectral" />
            <el-option label="热红外" value="Thermal" />
          </el-select>
        </el-form-item>
        <el-form-item label="分辨率" prop="resolution">
          <el-select v-model="uploadForm.resolution" placeholder="选择分辨率">
            <el-option label="2K" value="2K" />
            <el-option label="4K" value="4K" />
            <el-option label="8K" value="8K" />
          </el-select>
        </el-form-item>
        <el-form-item label="拍摄日期" prop="captureTime">
          <el-date-picker
            v-model="uploadForm.captureTime"
            type="datetime"
            placeholder="选择拍摄日期时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="影像文件" prop="file">
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">支持jpg、png、tif格式，最大100MB</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload" :loading="uploading">上传</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看影像对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="影像详情"
      width="800px"
    >
      <div class="image-detail">
        <div class="image-preview">
          <el-image
            style="width: 100%; max-height: 400px;"
            :src="currentImage.imageUrl"
            fit="contain"
          />
        </div>
        <div class="image-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="ID">{{ currentImage.id }}</el-descriptions-item>
            <el-descriptions-item label="地块名称">{{ currentImage.fieldName }}</el-descriptions-item>
            <el-descriptions-item label="影像类型">{{ currentImage.type }}</el-descriptions-item>
            <el-descriptions-item label="分辨率">{{ currentImage.resolution }}</el-descriptions-item>
            <el-descriptions-item label="拍摄时间">{{ currentImage.captureTime }}</el-descriptions-item>
            <el-descriptions-item label="文件大小">{{ currentImage.fileSize || '未知' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDroneImages, deleteDroneImage, uploadDroneImage } from '@/api/data'
import { getFields } from '@/api/field'

const imageList = ref([])
const fields = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const uploadDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentImage = ref({})
const uploading = ref(false)

// 筛选表单
const filterForm = reactive({
  fieldId: '',
  type: '',
  dateRange: []
})

// 上传表单
const uploadForm = reactive({
  fieldId: '',
  type: 'RGB',
  resolution: '4K',
  captureTime: '',
  file: null
})

// 上传表单验证规则
const uploadRules = {
  fieldId: [{ required: true, message: '请选择地块', trigger: 'change' }],
  type: [{ required: true, message: '请选择影像类型', trigger: 'change' }],
  resolution: [{ required: true, message: '请选择分辨率', trigger: 'change' }],
  captureTime: [{ required: true, message: '请选择拍摄日期时间', trigger: 'change' }],
  file: [{ required: true, message: '请上传影像文件', trigger: 'change' }]
}

const uploadFormRef = ref(null)

// 初始化数据
onMounted(async () => {
  await fetchFields()
  await fetchData()
})

// 获取地块列表
const fetchFields = async () => {
  try {
    const response = await getFields()
    fields.value = response.data
  } catch (error) {
    ElMessage.error('获取地块列表失败')
  }
}

// 获取影像列表
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      fieldId: filterForm.fieldId || undefined,
      type: filterForm.type || undefined,
      startDate: filterForm.dateRange?.[0] || undefined,
      endDate: filterForm.dateRange?.[1] || undefined
    }
    
    const response = await getDroneImages(params)
    
    // 转换数据，添加地块名称
    imageList.value = response.data.map(image => {
      const field = fields.value.find(f => f.id === image.fieldId)
      return {
        ...image,
        fieldName: field ? field.field_name : '未知地块'
      }
    })
    
    total.value = response.meta?.total || imageList.value.length
  } catch (error) {
    ElMessage.error('获取影像列表失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  fetchData()
}

const resetFilter = () => {
  filterForm.fieldId = ''
  filterForm.type = ''
  filterForm.dateRange = []
  currentPage.value = 1
  fetchData()
}

const handleFieldChange = (fieldId) => {
  filterForm.fieldId = fieldId
}

// 上传处理
const showUploadDialog = () => {
  uploadDialogVisible.value = true
  uploadForm.fieldId = ''
  uploadForm.type = 'RGB'
  uploadForm.resolution = '4K'
  uploadForm.captureTime = ''
  uploadForm.file = null
}

const handleFileChange = (file) => {
  uploadForm.file = file
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传1个文件')
}

const handleRemove = () => {
  uploadForm.file = null
}

const submitUpload = async () => {
  if (!uploadFormRef.value) return
  
  uploadFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    uploading.value = true
    try {
      // 在真实环境下，这里会上传文件到服务器
      // 这里模拟上传过程
      const field = fields.value.find(f => f.id === uploadForm.fieldId)
      
      const newImage = {
        fieldId: uploadForm.fieldId,
        type: uploadForm.type,
        resolution: uploadForm.resolution,
        captureTime: uploadForm.captureTime,
        imageUrl: '/mock/drone-images/new.jpg', // 模拟新图片URL
        fileSize: '20MB'
      }
      
      await uploadDroneImage(newImage)
      
      ElMessage.success('上传成功')
      uploadDialogVisible.value = false
      fetchData() // 刷新数据
    } catch (error) {
      ElMessage.error('上传失败')
    } finally {
      uploading.value = false
    }
  })
}

// 查看和删除影像
const viewImage = (row) => {
  currentImage.value = row
  viewDialogVisible.value = true
}

const deleteImage = (row) => {
  ElMessageBox.confirm(
    '确定要删除这张影像吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteDroneImage(row.id)
      ElMessage.success('删除成功')
      fetchData() // 刷新数据
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.drone-image-list {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-card {
  margin-bottom: 16px;
}

.list-card {
  margin-bottom: 16px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.image-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-preview {
  width: 100%;
  display: flex;
  justify-content: center;
}

.image-info {
  width: 100%;
}
</style> 