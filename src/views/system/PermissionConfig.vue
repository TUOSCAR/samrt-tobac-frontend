<template>
  <div class="permission-config-container">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="角色管理" name="role">
        <role-manager />
      </el-tab-pane>
      <el-tab-pane label="权限分配" name="permission">
        <permission-assignment />
      </el-tab-pane>
      <el-tab-pane label="地块权限" name="field">
        <field-permission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RoleManager from './RoleManager.vue';
import PermissionAssignment from './PermissionAssignment.vue';
import FieldPermission from './FieldPermission.vue';

const activeTab = ref('role');
</script>

<style scoped>
.permission-config-container {
  padding: 20px;
}
</style> 