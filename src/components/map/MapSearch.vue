<template>
  <div class="map-search">
    <el-autocomplete
      v-model="searchQuery"
      :fetch-suggestions="querySearch"
      placeholder="搜索地点"
      @select="handleSelect"
      class="search-input"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

interface SearchSuggestion {
  value: string
  address: string
  coordinates: [number, number]
}

const emit = defineEmits<{
  (e: 'location-select', coordinates: [number, number]): void
}>()

const searchQuery = ref('')

// 模拟搜索建议数据
const mockSuggestions: SearchSuggestion[] = [
  { value: '云南省昆明市', address: '云南省昆明市', coordinates: [24.880095, 102.832891] },
  { value: '云南省玉溪市', address: '云南省玉溪市', coordinates: [24.352855, 102.543907] },
  { value: '云南省曲靖市', address: '云南省曲靖市', coordinates: [25.501557, 103.797851] }
]

const querySearch = (queryString: string, callback: (suggestions: SearchSuggestion[]) => void) => {
  const results = queryString
    ? mockSuggestions.filter(item => 
        item.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : mockSuggestions

  callback(results)
}

const handleSelect = (item: SearchSuggestion) => {
  emit('location-select', item.coordinates)
}

defineExpose({
  searchQuery
})
</script>

<style scoped>
.map-search {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  width: 300px;
}

.search-input {
  width: 100%;
}

:deep(.el-input__wrapper) {
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style> 