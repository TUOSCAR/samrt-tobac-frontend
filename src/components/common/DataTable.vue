<template>
  <div class="data-table">
    <div class="table-header">
      <div class="table-title" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <el-table
      v-loading="loading"
      :data="data"
      :border="border"
      :stripe="stripe"
      :row-key="rowKey"
      :height="height"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      
      <el-table-column
        v-if="showIndex"
        type="index"
        width="60"
        label="序号"
        align="center"
      ></el-table-column>
      
      <template v-for="column in columns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'left'"
          :sortable="column.sortable"
        >
          <template #default="scope">
            <!-- 使用自定义渲染函数 -->
            <template v-if="column.render">
              <component
                :is="column.render"
                :row="scope.row"
                :column="column"
                :index="scope.$index"
              ></component>
            </template>
            
            <!-- 使用固定的格式化方式 -->
            <template v-else-if="column.type">
              <template v-if="column.type === 'date'">
                {{ formatDate(scope.row[column.prop], column.format) }}
              </template>
              
              <template v-else-if="column.type === 'status'">
                <el-tag :type="getStatusType(scope.row[column.prop], column.options)">
                  {{ getStatusText(scope.row[column.prop], column.options) }}
                </el-tag>
              </template>
            </template>
            
            <!-- 默认显示 -->
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
      
      <el-table-column
        v-if="operations && operations.length > 0"
        :label="operationLabel || '操作'"
        :width="operationWidth"
        :fixed="operationFixed"
        align="center"
      >
        <template #default="scope">
          <div class="operation-buttons">
            <template v-for="(operation, index) in operations" :key="index">
              <el-button
                v-if="!operation.show || operation.show(scope.row)"
                :type="operation.type || 'text'"
                :size="operation.size || 'small'"
                :disabled="operation.disabled && operation.disabled(scope.row)"
                @click.stop="operation.handler(scope.row, scope.$index)"
              >
                {{ operation.label }}
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="table-footer" v-if="showPagination">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/date'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  operations: {
    type: Array,
    default: () => []
  },
  operationLabel: {
    type: String,
    default: '操作'
  },
  operationWidth: {
    type: String,
    default: 'auto'
  },
  operationFixed: {
    type: String,
    default: 'right'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  title: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  showSelection: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100]
    })
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'row-click',
  'selection-change',
  'page-change',
  'size-change'
])

// 获取状态类型
const getStatusType = (value: any, options: any[]) => {
  if (!options) return ''
  const option = options.find(opt => opt.value === value)
  return option ? option.type : ''
}

// 获取状态文本
const getStatusText = (value: any, options: any[]) => {
  if (!options) return value
  const option = options.find(opt => opt.value === value)
  return option ? option.label : value
}

// 处理行点击
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event)
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  emit('selection-change', selection)
}

// 处理页码变化
const handleCurrentChange = (page: number) => {
  emit('page-change', page)
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  emit('size-change', size)
}
</script>

<style scoped>
.data-table {
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.table-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.operation-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style> 