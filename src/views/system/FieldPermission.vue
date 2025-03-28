<template>
  <div class="field-permission">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>地块权限管理</h3>
          <el-button type="primary" @click="handleAdd">添加权限</el-button>
        </div>
      </template>
      
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名称">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="地块名称">
          <el-input
            v-model="searchForm.fieldName"
            placeholder="请输入地块名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="权限类型">
          <el-select v-model="searchForm.permissionType" placeholder="请选择" clearable>
            <el-option label="只读" value="read" />
            <el-option label="读写" value="write" />
            <el-option label="管理" value="manage" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table
        :data="fieldPermissions"
        style="width: 100%"
        v-loading="loading"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名称" />
        <el-table-column prop="role" label="用户角色">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fieldName" label="地块名称" />
        <el-table-column prop="fieldCode" label="地块编码" />
        <el-table-column prop="permissionType" label="权限类型">
          <template #default="{ row }">
            <el-tag :type="getPermissionType(row.permissionType)">
              {{ getPermissionLabel(row.permissionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑/添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑地块权限' : '添加地块权限'"
      width="550px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="margin: 10px 0"
      >
        <el-form-item label="用户" prop="userId">
          <el-select
            v-model="form.userId"
            filterable
            placeholder="请选择用户"
            style="width: 100%"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="`${user.username} (${getRoleLabel(user.role)})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="地块" prop="fieldId">
          <el-select
            v-model="form.fieldId"
            filterable
            placeholder="请选择地块"
            style="width: 100%"
          >
            <el-option
              v-for="field in fieldOptions"
              :key="field.id"
              :label="`${field.field_name} (${field.field_code})`"
              :value="field.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="权限类型" prop="permissionType">
          <el-select v-model="form.permissionType" placeholder="请选择权限类型" style="width: 100%">
            <el-option label="只读" value="read" />
            <el-option label="读写" value="write" />
            <el-option label="管理" value="manage" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { users } from '@/mock/data'

// 模拟地块权限数据
interface FieldPermission {
  id: number;
  userId: number;
  username: string;
  role: string;
  fieldId: number;
  fieldName: string;
  fieldCode: string;
  permissionType: string;
  createdAt: string;
}

// 模拟地块数据
const fieldOptions = ref([
  {
    id: 1,
    field_code: 'F2023001',
    field_name: '东山1号烟田',
  },
  {
    id: 2,
    field_code: 'F2023002',
    field_name: '西峰2号烟田',
  },
  {
    id: 3,
    field_code: 'F2023003',
    field_name: '北畈3号烟田',
  }
])

// 模拟用户选项
const userOptions = ref(users.map(user => ({
  id: user.id,
  username: user.username,
  role: user.role
})))

// 模拟地块权限数据
const mockFieldPermissions: FieldPermission[] = [
  {
    id: 1,
    userId: 2,
    username: 'technician',
    role: 'technician',
    fieldId: 1,
    fieldName: '东山1号烟田',
    fieldCode: 'F2023001',
    permissionType: 'manage',
    createdAt: '2023-08-01T10:30:00Z'
  },
  {
    id: 2,
    userId: 3,
    username: 'farmer',
    role: 'farmer',
    fieldId: 1,
    fieldName: '东山1号烟田',
    fieldCode: 'F2023001',
    permissionType: 'write',
    createdAt: '2023-08-01T11:30:00Z'
  },
  {
    id: 3,
    userId: 2,
    username: 'technician',
    role: 'technician',
    fieldId: 2,
    fieldName: '西峰2号烟田',
    fieldCode: 'F2023002',
    permissionType: 'manage',
    createdAt: '2023-08-02T09:30:00Z'
  }
]

const fieldPermissions = ref<FieldPermission[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  username: '',
  fieldName: '',
  permissionType: ''
})

// 编辑表单
const form = reactive({
  id: 0,
  userId: undefined as unknown as number,
  fieldId: undefined as unknown as number,
  permissionType: 'read'
})

// 表单验证规则
const rules = reactive<FormRules>({
  userId: [
    { required: true, message: '请选择用户', trigger: 'change' }
  ],
  fieldId: [
    { required: true, message: '请选择地块', trigger: 'change' }
  ],
  permissionType: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ]
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 角色标签颜色映射
const getRoleType = (role: string) => {
  const map: Record<string, string> = {
    admin: 'danger',
    technician: 'warning',
    farmer: 'success'
  }
  return map[role] || 'info'
}

// 角色名称映射
const getRoleLabel = (role: string) => {
  const map: Record<string, string> = {
    admin: '管理员',
    technician: '烟技人员',
    farmer: '烟农'
  }
  return map[role] || role
}

// 权限类型标签颜色映射
const getPermissionType = (type: string) => {
  const map: Record<string, string> = {
    read: 'info',
    write: 'warning',
    manage: 'danger'
  }
  return map[type] || 'info'
}

// 权限类型名称映射
const getPermissionLabel = (type: string) => {
  const map: Record<string, string> = {
    read: '只读',
    write: '读写',
    manage: '管理'
  }
  return map[type] || type
}

// 搜索
const handleSearch = () => {
  fetchFieldPermissions()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.fieldName = ''
  searchForm.permissionType = ''
  fetchFieldPermissions()
}

// 添加权限
const handleAdd = () => {
  isEdit.value = false
  form.id = 0
  form.userId = undefined as unknown as number
  form.fieldId = undefined as unknown as number
  form.permissionType = 'read'
  dialogVisible.value = true
}

// 编辑权限
const handleEdit = (row: FieldPermission) => {
  isEdit.value = true
  form.id = row.id
  form.userId = row.userId
  form.fieldId = row.fieldId
  form.permissionType = row.permissionType
  dialogVisible.value = true
}

// 删除权限
const handleDelete = (row: FieldPermission) => {
  ElMessageBox.confirm(`确定要删除 ${row.username} 对 ${row.fieldName} 的权限吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟API调用
    const index = fieldPermissions.value.findIndex(p => p.id === row.id)
    if (index !== -1) {
      fieldPermissions.value.splice(index, 1)
      ElMessage.success('删除成功')
      updatePagination()
    }
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 模拟API调用
    if (isEdit.value) {
      // 编辑现有权限
      const index = fieldPermissions.value.findIndex(p => p.id === form.id)
      if (index !== -1) {
        // 查找用户和地块信息
        const user = userOptions.value.find(u => u.id === form.userId)
        const field = fieldOptions.value.find(f => f.id === form.fieldId)
        
        if (user && field) {
          fieldPermissions.value[index] = {
            ...fieldPermissions.value[index],
            userId: form.userId,
            username: user.username,
            role: user.role,
            fieldId: form.fieldId,
            fieldName: field.field_name,
            fieldCode: field.field_code,
            permissionType: form.permissionType
          }
          ElMessage.success('权限更新成功')
        }
      }
    } else {
      // 添加新权限
      // 查找用户和地块信息
      const user = userOptions.value.find(u => u.id === form.userId)
      const field = fieldOptions.value.find(f => f.id === form.fieldId)
      
      if (user && field) {
        const newPermission: FieldPermission = {
          id: Math.max(...fieldPermissions.value.map(p => p.id), 0) + 1,
          userId: form.userId,
          username: user.username,
          role: user.role,
          fieldId: form.fieldId,
          fieldName: field.field_name,
          fieldCode: field.field_code,
          permissionType: form.permissionType,
          createdAt: new Date().toISOString()
        }
        
        fieldPermissions.value.unshift(newPermission)
        ElMessage.success('权限添加成功')
        updatePagination()
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 更新分页信息
const updatePagination = () => {
  pagination.total = fieldPermissions.value.length
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

// 获取地块权限列表
const fetchFieldPermissions = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 过滤
    const filteredPermissions = mockFieldPermissions.filter(p => {
      if (searchForm.username && !p.username.includes(searchForm.username)) {
        return false
      }
      if (searchForm.fieldName && !p.fieldName.includes(searchForm.fieldName)) {
        return false
      }
      if (searchForm.permissionType && p.permissionType !== searchForm.permissionType) {
        return false
      }
      return true
    })
    
    fieldPermissions.value = filteredPermissions
    pagination.total = filteredPermissions.length
    loading.value = false
  }, 300)
}

onMounted(() => {
  fetchFieldPermissions()
})
</script>

<style scoped>
.field-permission {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>

<script lang="ts">
export default {
  name: 'FieldPermission'
}
</script> 