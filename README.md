# 智能烟草种植管理系统

## 项目简介

智能烟草种植管理系统是一个基于 Vue 3 + TypeScript + Element Plus + Leaflet 开发的现代化 Web 应用，用于管理和监控烟草种植地块。

## 功能特点

- 地块管理：支持地块的增删改查
- 地块统计：展示地块面积、作物分布等统计信息
- 地图展示：在地图上可视化展示地块位置和状态
- 实时监控：监控地块状态变化

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Leaflet
- ECharts
- Axios
- Vite

## 开发环境要求

- Node.js >= 16
- npm >= 8

## 安装和运行

1. 克隆项目
```bash
git clone https://github.com/your-username/smart-tobacco-frontend.git
cd smart-tobacco-frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── components/        # 组件
│   ├── layout/       # 布局组件
│   ├── map/         # 地图相关组件
│   └── land/        # 地块相关组件
├── services/         # API 服务
├── types/           # 类型定义
├── utils/           # 工具函数
├── views/           # 页面
├── router/          # 路由配置
└── App.vue          # 根组件
```

## 开发指南

### 组件开发

- 使用 TypeScript 编写组件
- 遵循 Vue 3 组合式 API 风格
- 使用 Element Plus 组件库
- 保持组件的单一职责

### 地图开发

- 使用 Leaflet 进行地图操作
- 封装地图相关功能为独立组件
- 处理地图事件和状态管理

### API 开发

- 使用 Axios 进行 HTTP 请求
- 统一处理请求和响应
- 使用 TypeScript 定义接口类型

## 部署

1. 构建生产版本
```bash
npm run build
```

2. 部署 `dist` 目录到 Web 服务器

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 