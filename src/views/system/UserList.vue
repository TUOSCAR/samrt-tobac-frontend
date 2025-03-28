<template>
  <div class="user-list-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      
      <el-table v-loading="loading" :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="handlePermission(row)">权限</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              v-if="row.username !== 'admin'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
      destroy-on-close
    >
      <user-form
        :user="currentUser"
        :is-edit="isEdit"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, deleteUser, User } from '@/api/system'
import UserForm from '@/views/system/UserForm.vue'

const users = ref<User[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentUser = ref<Partial<User>>({})

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

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await getUsers()
    users.value = res.data || []
  } catch (error) {
    console.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  currentUser.value = {}
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: User) => {
  isEdit.value = true
  currentUser.value = { ...row }
  dialogVisible.value = true
}

// 设置权限
const handlePermission = (row: User) => {
  // 跳转到权限设置页或打开权限设置对话框
  console.log('设置权限', row)
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      fetchUsers()
    } catch (error) {
      console.error('删除用户失败', error)
      ElMessage.error('删除用户失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 表单提交
const handleSubmit = () => {
  dialogVisible.value = false
  fetchUsers() // 重新加载用户列表
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 