<template>
  <div class="permission-assignment">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h3>权限分配</h3>
        </div>
      </template>

      <div class="permission-container">
        <div class="role-selector">
          <div class="section-title">选择角色</div>
          <el-radio-group v-model="selectedRole" @change="handleRoleChange">
            <div v-for="role in roles" :key="role.code" class="role-item">
              <el-radio :label="role.code">{{ role.name }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        
        <div class="permission-list">
          <div class="section-title">
            <span>权限列表</span>
            <div class="operations">
              <el-button type="primary" size="small" @click="handleSavePermissions">保存</el-button>
              <el-button type="default" size="small" @click="handleResetPermissions">重置</el-button>
            </div>
          </div>
          
          <el-tree
            ref="permissionTree"
            :data="permissionTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedPermissions"
            :props="{ children: 'children', label: 'name' }"
            @check="handleCheckChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'

interface Role {
  code: string;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  code: string;
  parentId?: number;
  children?: Permission[];
}

type PermissionTree = Permission[]

type ElTreeInstance = InstanceType<typeof ElTree>

// 角色列表
const roles = reactive<Role[]>([
  { code: 'admin', name: '系统管理员' },
  { code: 'technician', name: '烟技人员' },
  { code: 'farmer', name: '烟农' },
  { code: 'visitor', name: '访客' }
])

// 权限树数据
const permissionTree = ref<PermissionTree>([
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    children: [
      { id: 11, name: '用户管理', code: 'system:user' },
      { id: 12, name: '角色管理', code: 'system:role' },
      { id: 13, name: '权限管理', code: 'system:permission' }
    ]
  },
  {
    id: 2,
    name: '数据管理',
    code: 'data',
    children: [
      { id: 21, name: '影像管理', code: 'data:image' },
      { id: 22, name: '气象数据', code: 'data:weather' },
      { id: 23, name: '种植参数', code: 'data:parameter' }
    ]
  },
  {
    id: 3,
    name: '监测任务',
    code: 'task',
    children: [
      { id: 31, name: '任务创建', code: 'task:create' },
      { id: 32, name: '任务查看', code: 'task:view' },
      { id: 33, name: '任务编辑', code: 'task:edit' },
      { id: 34, name: '任务删除', code: 'task:delete' }
    ]
  },
  {
    id: 4,
    name: '分析功能',
    code: 'analysis',
    children: [
      { id: 41, name: '基础分析', code: 'analysis:basic' },
      { id: 42, name: '大模型分析', code: 'analysis:llm' },
      { id: 43, name: '报告生成', code: 'analysis:report' }
    ]
  }
])

const permissionTree$ = ref<ElTreeInstance>()
const selectedRole = ref('admin')
const checkedPermissions = ref<number[]>([])
const originalCheckedPermissions = ref<number[]>([])

// 角色权限映射
const rolePermissions = reactive<Record<string, number[]>>({
  admin: [11, 12, 13, 21, 22, 23, 31, 32, 33, 34, 41, 42, 43], // 管理员拥有所有权限
  technician: [21, 22, 23, 31, 32, 33, 41, 42, 43], // 烟技人员
  farmer: [32, 41], // 烟农
  visitor: [32] // 访客
})

// 初始化选中的权限
const initCheckedPermissions = (role: string) => {
  checkedPermissions.value = [...(rolePermissions[role] || [])]
  originalCheckedPermissions.value = [...checkedPermissions.value]
}

// 角色切换
const handleRoleChange = (role: string) => {
  initCheckedPermissions(role)
}

// 保存权限变更
const handleSavePermissions = () => {
  if (!permissionTree$.value) return
  
  const checkedKeys = permissionTree$.value.getCheckedKeys() as number[]
  const halfCheckedKeys = permissionTree$.value.getHalfCheckedKeys() as number[]
  
  // 合并完全选中和半选中的节点
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
  
  // 更新角色权限
  rolePermissions[selectedRole.value] = allCheckedKeys
  
  // 更新原始选中状态，用于重置
  originalCheckedPermissions.value = [...allCheckedKeys]
  
  ElMessage.success('权限保存成功')
}

// 重置权限
const handleResetPermissions = () => {
  checkedPermissions.value = [...originalCheckedPermissions.value]
  
  // 手动刷新选中状态
  if (permissionTree$.value) {
    permissionTree$.value.setCheckedKeys(checkedPermissions.value)
  }
}

// 权限选中变更
const handleCheckChange = () => {
  // 可以在这里添加一些检查逻辑
}

onMounted(() => {
  initCheckedPermissions(selectedRole.value)
})
</script>

<style scoped>
.permission-assignment {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-container {
  display: flex;
  gap: 20px;
}

.role-selector {
  width: 200px;
  border-right: 1px solid #ebeef5;
  padding-right: 20px;
}

.permission-list {
  flex: 1;
}

.section-title {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-item {
  margin-bottom: 10px;
}

.operations {
  display: flex;
  gap: 10px;
}
</style>

<script lang="ts">
export default {
  name: 'PermissionAssignment'
}
</script> 