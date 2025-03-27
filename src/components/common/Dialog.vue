<template>
  <el-dialog
    :title="title"
    :width="width"
    :top="top"
    :modal="modal"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :center="center"
    :destroy-on-close="destroyOnClose"
    v-model="dialogVisible"
    @closed="onClosed"
  >
    <div class="dialog-content">
      <slot></slot>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <slot name="footer">
          <el-button @click="cancel">{{ cancelText }}</el-button>
          <el-button type="primary" :loading="loading" @click="confirm">
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: String,
    default: '500px'
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'closed'])

// 控制对话框显示状态
const dialogVisible = ref(props.modelValue)

// 监听外部控制的变化
watch(
  () => props.modelValue,
  val => {
    dialogVisible.value = val
  }
)

// 监听内部变化并向外传递
watch(
  () => dialogVisible.value,
  val => {
    emit('update:modelValue', val)
  }
)

// 确认按钮回调
const confirm = () => {
  emit('confirm')
}

// 取消按钮回调
const cancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

// 对话框关闭回调
const onClosed = () => {
  emit('closed')
}
</script>

<style scoped>
.dialog-content {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style> 