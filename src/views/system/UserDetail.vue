<template>
  <div class="user-detail-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>用户详情</h3>
          <div>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </div>
      </template>

      <el-descriptions
        :column="2"
        border
        v-loading="loading"
      >
        <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag :type="getRoleType(user.role)">{{ getRoleLabel(user.role) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="user.status === 'active' ? 'success' : 'danger'">
            {{ user.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ user.createTime }}</el-descriptions-item>
      </el-descriptions>

      <div class="section-title">
        <h4>权限信息</h4>
      </div>

      <el-table :data="userPermissions" style="width: 100%" v-loading="permissionLoading">
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="code" label="权限代码" />
        <el-table-column prop="description" label="权限描述" />
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑用户"
      width="500px"
      destroy-on-close
    >
      <user-form
        :user="user"
        :is-edit="true"
        @submit="handleSubmit"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUsers, User, getPermissions, Permission } from '@/api/system'
import UserForm from './UserForm.vue'

const route = useRoute()
const router = useRouter()

const user = ref<User>({
  id: 0,
  username: '',
  role: '',
  status: '',
  createTime: ''
})
const loading = ref(false)
const permissionLoading = ref(false)
const userPermissions = ref<Permission[]>([])
const dialogVisible = ref(false)

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

// 获取用户信息
const fetchUserDetail = async () => {
  const userId = parseInt(route.params.id as string)
  if (!userId) {
    ElMessage.error('用户ID无效')
    return
  }

  loading.value = true
  try {
    const res = await getUsers()
    const users = res.data || []
    const userDetail = users.find(u => u.id === userId)
    if (userDetail) {
      user.value = userDetail
    } else {
      ElMessage.warning('未找到该用户')
      router.push('/system/users')
    }
  } catch (error) {
    console.error('获取用户详情失败', error)
    ElMessage.error('获取用户详情失败')
  } finally {
    loading.value = false
  }
}

// 获取用户权限
const fetchUserPermissions = async () => {
  permissionLoading.value = true
  try {
    const res = await getPermissions()
    // 这里模拟一下筛选出用户的权限，实际应该根据用户ID获取
    // 管理员拥有所有权限，技术员有部分权限，烟农只有查看权限
    const allPermissions = res.data || []
    if (user.value.role === 'admin') {
      userPermissions.value = allPermissions
    } else if (user.value.role === 'technician') {
      userPermissions.value = allPermissions.filter(p => !p.code.includes('user:manage'))
    } else {
      userPermissions.value = allPermissions.filter(p => p.code.includes('view'))
    }
  } catch (error) {
    console.error('获取用户权限失败', error)
    ElMessage.error('获取用户权限失败')
  } finally {
    permissionLoading.value = false
  }
}

// 编辑用户
const handleEdit = () => {
  dialogVisible.value = true
}

// 处理表单提交
const handleSubmit = () => {
  dialogVisible.value = false
  fetchUserDetail() // 重新加载用户详情
}

// 返回用户列表
const goBack = () => {
  router.push('/system/users')
}

onMounted(() => {
  fetchUserDetail()
  fetchUserPermissions()
})
</script>

<style scoped>
.user-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin-top: 30px;
  margin-bottom: 10px;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}
</style> 