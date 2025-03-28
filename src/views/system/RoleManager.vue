<template>
  <div class="role-manager">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>角色管理</h3>
          <el-button type="primary" @click="handleAddRole">添加角色</el-button>
        </div>
      </template>
      
      <el-table :data="roles" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色代码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="userCount" label="用户数量" width="100" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleEditRole(row)"
              :disabled="row.isSystem"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteRole(row)"
              :disabled="row.isSystem"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '添加角色'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        style="margin: 10px 0"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色代码" :disabled="isEdit" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入角色描述"
            rows="3"
          />
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

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  userCount: number;
  isSystem: boolean;
}

// 模拟角色数据
const roles = ref<Role[]>([
  {
    id: 1,
    name: '系统管理员',
    code: 'admin',
    description: '拥有系统所有权限，可进行全局管理。',
    userCount: 1,
    isSystem: true
  },
  {
    id: 2,
    name: '烟技人员',
    code: 'technician',
    description: '负责烟田监测、数据分析和技术指导。',
    userCount: 5,
    isSystem: true
  },
  {
    id: 3,
    name: '烟农',
    code: 'farmer',
    description: '种植烟草，执行农事任务和反馈。',
    userCount: 10,
    isSystem: true
  },
  {
    id: 4,
    name: '访客',
    code: 'visitor',
    description: '只有查看权限，无法编辑任何内容。',
    userCount: 2,
    isSystem: false
  }
])

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  id: 0,
  name: '',
  code: '',
  description: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度应在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    { pattern: /^[a-z0-9_]+$/, message: '只能包含小写字母、数字和下划线', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过 200 个字符', trigger: 'blur' }
  ]
})

// 添加角色
const handleAddRole = () => {
  isEdit.value = false
  form.id = 0
  form.name = ''
  form.code = ''
  form.description = ''
  dialogVisible.value = true
}

// 编辑角色
const handleEditRole = (row: Role) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.description = row.description
  dialogVisible.value = true
}

// 删除角色
const handleDeleteRole = (row: Role) => {
  ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用API删除角色
    const index = roles.value.findIndex(r => r.id === row.id)
    if (index !== -1) {
      roles.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      // 编辑现有角色
      const index = roles.value.findIndex(r => r.id === form.id)
      if (index !== -1) {
        roles.value[index] = {
          ...roles.value[index],
          name: form.name,
          description: form.description
        }
        ElMessage.success('角色更新成功')
      }
    } else {
      // 添加新角色
      const newRole: Role = {
        id: Math.max(...roles.value.map(r => r.id)) + 1,
        name: form.name,
        code: form.code,
        description: form.description,
        userCount: 0,
        isSystem: false
      }
      roles.value.push(newRole)
      ElMessage.success('角色添加成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 获取角色列表
const fetchRoles = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.role-manager {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<script lang="ts">
export default {
  name: 'RoleManager'
}
</script> 