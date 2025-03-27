<template>
  <div class="weather-layer">
    <el-popover
      placement="left"
      :width="300"
      trigger="click"
    >
      <template #reference>
        <el-button>
          <el-icon><Sunny /></el-icon>
        </el-button>
      </template>

      <div class="weather-content">
        <!-- 当前天气 -->
        <div class="current-weather">
          <div class="weather-main">
            <div class="temperature">{{ currentWeather.temperature }}°C</div>
            <div class="weather-icon">
              <el-icon :size="48"><component :is="getWeatherIcon(currentWeather.condition)" /></el-icon>
            </div>
            <div class="condition">{{ currentWeather.condition }}</div>
          </div>
          <div class="weather-details">
            <div class="detail-item">
              <el-icon><WindPower /></el-icon>
              <span>风速: {{ currentWeather.windSpeed }}m/s</span>
            </div>
            <div class="detail-item">
              <el-icon><Monitor /></el-icon>
              <span>湿度: {{ currentWeather.humidity }}%</span>
            </div>
            <div class="detail-item">
              <el-icon><Sunrise /></el-icon>
              <span>气压: {{ currentWeather.pressure }}hPa</span>
            </div>
          </div>
        </div>

        <!-- 天气预报 -->
        <div class="forecast">
          <div class="forecast-title">未来3天预报</div>
          <div class="forecast-list">
            <div v-for="(day, index) in forecast" :key="index" class="forecast-item">
              <div class="date">{{ day.date }}</div>
              <el-icon :size="24"><component :is="getWeatherIcon(day.condition)" /></el-icon>
              <div class="temp-range">
                <span class="max">{{ day.maxTemp }}°</span>
                <span class="min">{{ day.minTemp }}°</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 天气预警 -->
        <div v-if="alerts.length > 0" class="alerts">
          <div class="alerts-title">天气预警</div>
          <div class="alerts-list">
            <div v-for="(alert, index) in alerts" :key="index" class="alert-item" :class="alert.level">
              <el-icon><Warning /></el-icon>
              <span>{{ alert.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Sunny,
  Cloudy,
  Lightning,
  Umbrella,
  IceCream,
  WindPower,
  Monitor,
  Sunrise,
  Warning
} from '@element-plus/icons-vue'

interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  pressure: number
}

interface ForecastData {
  date: string
  condition: string
  maxTemp: number
  minTemp: number
}

interface AlertData {
  level: 'warning' | 'danger'
  message: string
}

// 当前天气数据
const currentWeather = ref<WeatherData>({
  temperature: 25.6,
  condition: 'sunny',
  windSpeed: 3.2,
  humidity: 65,
  pressure: 1013
})

// 天气预报数据
const forecast = ref<ForecastData[]>([
  {
    date: '今天',
    condition: 'sunny',
    maxTemp: 28,
    minTemp: 20
  },
  {
    date: '明天',
    condition: 'cloudy',
    maxTemp: 26,
    minTemp: 18
  },
  {
    date: '后天',
    condition: 'rain',
    maxTemp: 24,
    minTemp: 16
  }
])

// 天气预警数据
const alerts = ref<AlertData[]>([
  {
    level: 'warning',
    message: '预计明天有强降雨，请注意防范'
  }
])

// 获取天气图标
const getWeatherIcon = (condition: string) => {
  const icons: Record<string, any> = {
    sunny: Sunny,
    cloudy: Cloudy,
    lightning: Lightning,
    rain: Umbrella,
    snow: IceCream
  }
  return icons[condition] || Sunny
}

// 初始化天气数据
const initWeatherData = async () => {
  try {
    // TODO: 调用天气API获取实时数据
    // const response = await getWeatherData()
    // currentWeather.value = response.current
    // forecast.value = response.forecast
    // alerts.value = response.alerts
  } catch (error) {
    console.error('获取天气数据失败:', error)
  }
}

onMounted(() => {
  initWeatherData()
})
</script>

<script lang="ts">
export default {
  name: 'WeatherLayer'
}
</script>

<style scoped>
.weather-layer {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.weather-content {
  padding: 16px;
}

.current-weather {
  text-align: center;
  margin-bottom: 20px;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.temperature {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.condition {
  font-size: 16px;
  color: #606266;
  margin-top: 8px;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 14px;
}

.forecast {
  margin-bottom: 20px;
}

.forecast-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #606266;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.date {
  font-size: 14px;
  color: #606266;
}

.temp-range {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.max {
  color: #f56c6c;
}

.min {
  color: #409eff;
}

.alerts {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
}

.alerts-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #606266;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

.alert-item.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.alert-item.danger {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style> 