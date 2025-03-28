# 数据管理模块集成指南

## 模块说明

数据管理模块包含三个主要功能页面：

1. **无人机影像管理** - 用于管理烟田监测的无人机影像数据
2. **气象数据管理** - 用于查看和获取烟田气象数据
3. **种植参数管理** - 用于维护烟田的种植技术参数

## 集成步骤

### 1. 引入路由配置

需要在主路由文件 `src/router/index.ts` 中添加数据管理模块的路由。

```javascript
// 在文件顶部导入数据管理路由
import dataRoutes from './data'

// 然后在AppLayout的children数组中添加：
{
  path: '/',
  component: AppLayout,
  redirect: '/dashboard',
  children: [
    // 其他路由...
    
    // 数据管理路由
    ...dataRoutes,
    
    // 其他路由...
  ]
}
```

### 2. API文件

已经在 `src/api/data.ts` 中添加了所有必要的API请求函数，包括：

- 无人机影像相关API
- 气象数据相关API
- 种植参数相关API

### 3. Mock数据

我们使用了 `src/mock/data.ts` 中的Mock数据进行开发，确保其中包含:
- `droneImages` - 无人机影像Mock数据
- `weatherData` - 气象数据Mock数据
- `plantingParameters` - 种植参数Mock数据

### 4. 菜单配置

确保 `src/config/menu.ts` 中已经配置了数据管理模块的菜单项:

```javascript
{
  title: '数据管理',
  icon: 'DataAnalysis',
  path: '/data',
  roles: ['admin'],
  children: [
    {
      title: '无人机影像',
      path: '/data/drone-images',
      icon: 'PictureFilled'
    },
    {
      title: '气象数据',
      path: '/data/weather',
      icon: 'MostlyCloudy'
    },
    {
      title: '种植参数',
      path: '/data/parameters',
      icon: 'Setting'
    }
  ]
}
```

## 功能说明

### 无人机影像管理

- 支持按地块和影像类型筛选
- 提供缩略图预览
- 支持上传新影像
- 支持查看影像详情
- 支持删除不需要的影像

### 气象数据管理

- 支持按地块和时间范围筛选
- 提供表格和图表两种视图
- 支持获取最新气象数据
- 支持查看气象数据详情

### 种植参数管理

- 支持按地块和参数类型筛选
- 支持添加新参数
- 支持编辑现有参数
- 支持删除不需要的参数

## 注意事项

1. 所有三个页面仅对管理员角色可见
2. 气象数据图表使用了ECharts库，确保已正确安装
3. 确保在表单提交前进行数据验证 