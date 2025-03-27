import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { setupMock } from './mock' // 取消注释

// 引入并全局注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 启动Mock服务
setupMock() // 取消注释

// 创建应用实例
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn, // 使用中文语言
  size: 'default' // 组件默认尺寸
})

app.mount('#app') 