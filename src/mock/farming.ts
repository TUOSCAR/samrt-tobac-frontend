// 农事管理模块模拟数据

export const farmingOperationTypes = [
  {
    id: 1,
    type_code: 'transplanting',
    type_name: '移栽',
    description: '将烟苗从苗床移植到烟田',
    season_applicable: ['transplanting'],
    created_at: '2023-01-10T09:00:00Z'
  },
  {
    id: 2,
    type_code: 'fertilizing',
    type_name: '施肥',
    description: '向烟田施加肥料',
    season_applicable: ['transplanting', 'growing', 'topping'],
    created_at: '2023-01-10T09:05:00Z'
  },
  {
    id: 3,
    type_code: 'watering',
    type_name: '灌溉',
    description: '为烟田提供水分',
    season_applicable: ['transplanting', 'growing', 'topping'],
    created_at: '2023-01-10T09:10:00Z'
  },
  {
    id: 4,
    type_code: 'pest_control',
    type_name: '病虫害防治',
    description: '预防和治疗病虫害',
    season_applicable: ['transplanting', 'growing', 'topping'],
    created_at: '2023-01-10T09:15:00Z'
  },
  {
    id: 5,
    type_code: 'topping',
    type_name: '打顶',
    description: '去除烟株顶端以促进叶片生长',
    season_applicable: ['topping'],
    created_at: '2023-01-10T09:20:00Z'
  },
  {
    id: 6,
    type_code: 'harvesting',
    type_name: '采收',
    description: '收获成熟烟叶',
    season_applicable: ['harvesting'],
    created_at: '2023-01-10T09:25:00Z'
  },
  {
    id: 7,
    type_code: 'weeding',
    type_name: '除草',
    description: '清除田间杂草',
    season_applicable: ['transplanting', 'growing'],
    created_at: '2023-01-10T09:30:00Z'
  }
];

export const farmingOperations = [
  {
    id: 1,
    field_id: 1,
    operation_type: 'transplanting',
    operation_date: '2023-04-10T08:00:00Z',
    operation_details: '完成第一批烟苗移栽，株距45cm，行距120cm',
    operation_area: 3.5,
    materials_used: '优质烟苗',
    dosage: '每亩2000株',
    weather_condition: '晴朗，气温22℃',
    performed_by: 3, // farmer user_id
    recorded_by: 3,
    recorded_at: '2023-04-10T16:00:00Z',
    execution_task_id: 5, 
    cost: 1200,
    notes: '移栽过程顺利，预计成活率95%以上'
  },
  {
    id: 2,
    field_id: 1,
    operation_type: 'fertilizing',
    operation_date: '2023-04-15T07:30:00Z',
    operation_details: '施用复合肥',
    operation_area: 8.2,
    materials_used: '16-16-16复合肥',
    dosage: '每亩20kg',
    weather_condition: '多云，气温20℃',
    performed_by: 3,
    recorded_by: 3,
    recorded_at: '2023-04-15T12:00:00Z',
    execution_task_id: 6,
    cost: 800,
    notes: '肥料分布均匀'
  },
  {
    id: 3,
    field_id: 2,
    operation_type: 'watering',
    operation_date: '2023-04-18T06:00:00Z',
    operation_details: '使用喷灌系统灌溉',
    operation_area: 6.0,
    materials_used: '清水',
    dosage: '每亩30m³',
    weather_condition: '晴朗，气温24℃',
    performed_by: 4,
    recorded_by: 4,
    recorded_at: '2023-04-18T10:30:00Z',
    execution_task_id: null,
    cost: 300,
    notes: '墒情恢复良好'
  },
  {
    id: 4,
    field_id: 1,
    operation_type: 'pest_control',
    operation_date: '2023-05-10T08:00:00Z',
    operation_details: '喷洒杀虫剂防治蚜虫',
    operation_area: 8.2,
    materials_used: '阿维菌素',
    dosage: '每亩50ml',
    weather_condition: '阴天，气温19℃',
    performed_by: 3,
    recorded_by: 2,
    recorded_at: '2023-05-10T11:00:00Z',
    execution_task_id: 8,
    cost: 500,
    notes: '发现轻微蚜虫危害，及时处理'
  },
  {
    id: 5,
    field_id: 1,
    operation_type: 'weeding',
    operation_date: '2023-05-15T07:00:00Z',
    operation_details: '人工除草',
    operation_area: 8.2,
    materials_used: '无',
    dosage: '无',
    weather_condition: '晴朗，气温25℃',
    performed_by: 3,
    recorded_by: 3,
    recorded_at: '2023-05-15T14:00:00Z',
    execution_task_id: null,
    cost: 600,
    notes: '清除杂草，保持田间整洁'
  },
  {
    id: 6,
    field_id: 2,
    operation_type: 'topping',
    operation_date: '2023-06-20T07:30:00Z',
    operation_details: '手工打顶，去除烟株顶芽',
    operation_area: 6.0,
    materials_used: '无',
    dosage: '无',
    weather_condition: '多云，气温27℃',
    performed_by: 4,
    recorded_by: 2,
    recorded_at: '2023-06-20T15:00:00Z',
    execution_task_id: 10,
    cost: 900,
    notes: '打顶高度合适，去除顶芽后植株生长良好'
  },
  {
    id: 7,
    field_id: 2,
    operation_type: 'harvesting',
    operation_date: '2023-08-05T06:00:00Z',
    operation_details: '采收中部叶片',
    operation_area: 6.0,
    materials_used: '无',
    dosage: '无',
    weather_condition: '晴朗，气温28℃',
    performed_by: 4,
    recorded_by: 4,
    recorded_at: '2023-08-05T16:00:00Z',
    execution_task_id: 12,
    cost: 1500,
    notes: '烟叶成熟度好，色泽均匀'
  }
];

// 将农事操作数据转换为日历格式
export const getFarmingCalendarEvents = () => {
  return farmingOperations.map(op => {
    // 获取操作类型的名称
    const operationType = farmingOperationTypes.find(type => type.type_code === op.operation_type);
    const typeName = operationType ? operationType.type_name : op.operation_type;
    
    return {
      id: op.id,
      title: typeName,
      start: op.operation_date,
      end: op.operation_date, // 农事操作通常为单日任务
      field_id: op.field_id,
      operation_type: op.operation_type,
      details: op.operation_details,
      color: getColorByOperationType(op.operation_type)
    };
  });
};

// 根据操作类型返回不同的颜色
function getColorByOperationType(type: string) {
  const colorMap: Record<string, string> = {
    transplanting: '#67C23A', // 绿色
    fertilizing: '#409EFF', // 蓝色
    watering: '#87CEFA', // 淡蓝色
    pest_control: '#F56C6C', // 红色
    topping: '#E6A23C', // 橙色
    harvesting: '#909399', // 灰色
    weeding: '#9370DB'  // 紫色
  };
  
  return colorMap[type] || '#409EFF';
}

// 获取农事操作类型列表
export const getFarmingOperationTypes = (params = {}) => {
  return {
    success: true,
    code: 200,
    message: '获取农事操作类型列表成功',
    data: farmingOperationTypes,
    meta: {
      total: farmingOperationTypes.length
    }
  };
};

// 获取农事操作列表
export const getFarmingOperations = (params: any = {}) => {
  let result = [...farmingOperations];
  
  // 筛选逻辑
  if (params.field_id) {
    result = result.filter(op => op.field_id === parseInt(params.field_id));
  }
  
  if (params.operation_type) {
    result = result.filter(op => op.operation_type === params.operation_type);
  }
  
  if (params.start_date && params.end_date) {
    result = result.filter(op => 
      new Date(op.operation_date) >= new Date(params.start_date) && 
      new Date(op.operation_date) <= new Date(params.end_date)
    );
  }
  
  // 分页逻辑
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedResult = result.slice(start, end);
  
  return {
    success: true,
    code: 200,
    message: '获取农事操作列表成功',
    data: paginatedResult,
    meta: {
      page,
      pageSize,
      total: result.length
    }
  };
};

// 获取单个农事操作详情
export const getFarmingOperationDetail = (id: number) => {
  const operation = farmingOperations.find(op => op.id === id);
  
  if (operation) {
    return {
      success: true,
      code: 200,
      message: '获取农事操作详情成功',
      data: operation
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到该农事操作',
      data: null
    };
  }
};

// 创建农事操作
export const createFarmingOperation = (data: any) => {
  const newId = Math.max(...farmingOperations.map(op => op.id)) + 1;
  const now = new Date().toISOString();
  
  const newOperation = {
    id: newId,
    ...data,
    recorded_at: now
  };
  
  farmingOperations.push(newOperation);
  
  return {
    success: true,
    code: 201,
    message: '创建农事操作成功',
    data: newOperation
  };
};

// 更新农事操作
export const updateFarmingOperation = (id: number, data: any) => {
  const index = farmingOperations.findIndex(op => op.id === id);
  
  if (index !== -1) {
    farmingOperations[index] = {
      ...farmingOperations[index],
      ...data
    };
    
    return {
      success: true,
      code: 200,
      message: '更新农事操作成功',
      data: farmingOperations[index]
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到该农事操作',
      data: null
    };
  }
};

// 删除农事操作
export const deleteFarmingOperation = (id: number) => {
  const index = farmingOperations.findIndex(op => op.id === id);
  
  if (index !== -1) {
    const deleted = farmingOperations.splice(index, 1)[0];
    
    return {
      success: true,
      code: 200,
      message: '删除农事操作成功',
      data: deleted
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到该农事操作',
      data: null
    };
  }
};

// 获取日历格式农事操作
export const getFarmingCalendar = (params: any = {}) => {
  let events = getFarmingCalendarEvents();
  
  // 筛选逻辑
  if (params.field_id) {
    events = events.filter(event => event.field_id === parseInt(params.field_id));
  }
  
  if (params.start_date && params.end_date) {
    events = events.filter(event => 
      new Date(event.start) >= new Date(params.start_date) && 
      new Date(event.start) <= new Date(params.end_date)
    );
  }
  
  return {
    success: true,
    code: 200,
    message: '获取日历格式农事操作成功',
    data: events
  };
}; 