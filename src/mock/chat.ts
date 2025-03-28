// 智能体交互模块模拟数据

// 预设的问题模板
export const questionTemplates = [
  {
    id: 1,
    category: 'disease',
    title: '病害诊断',
    content: '我的烟田出现了黄叶现象，叶片边缘有褐色斑点，可能是什么病害？'
  },
  {
    id: 2,
    category: 'pest',
    title: '虫害防治',
    content: '烟叶上发现有小虫咬食痕迹，如何识别和防治？'
  },
  {
    id: 3,
    category: 'fertilizer',
    title: '施肥建议',
    content: '当前生长期应该使用什么肥料配方，用量是多少？'
  },
  {
    id: 4,
    category: 'growth',
    title: '长势评估',
    content: '如何评估当前烟株的长势情况？有哪些关键指标需要关注？'
  },
  {
    id: 5,
    category: 'weather',
    title: '天气应对',
    content: '预计未来三天有强降雨，我应该采取哪些防护措施？'
  }
];

// 历史会话记录
export const chatHistory = [
  {
    id: 1,
    userId: 3, // 烟农
    sessionId: 'session-001',
    messages: [
      {
        id: 101,
        role: 'user',
        content: '我的烟田东边区域烟叶出现了黄化现象，是什么原因？',
        timestamp: '2023-06-10T09:15:00Z'
      },
      {
        id: 102,
        role: 'assistant',
        content: '烟叶黄化可能有多种原因，例如养分不足、病虫害或者浇水不当。根据您描述的情况，建议检查以下几点：\n\n1. 氮肥是否不足，烟叶缺氮会出现整体黄化\n2. 查看叶片是否有病斑或虫害痕迹\n3. 检查土壤湿度，过湿或过干都可能导致黄化\n4. 查看是否有根部病害\n\n建议您上传一张烟叶照片，以便我更准确地诊断问题。',
        timestamp: '2023-06-10T09:15:30Z'
      },
      {
        id: 103,
        role: 'user',
        content: '叶片边缘有一些褐色斑点，土壤偏湿。',
        timestamp: '2023-06-10T09:16:45Z'
      },
      {
        id: 104,
        role: 'assistant',
        content: '根据您的描述，叶片边缘有褐色斑点且土壤偏湿，这种情况很可能是烟草赤星病的早期症状。赤星病通常在高湿环境下容易发生。\n\n建议采取以下措施：\n\n1. 改善排水条件，避免田间积水\n2. 喷施75%百菌清可湿性粉剂600-800倍液或50%敌力脱可湿性粉剂500-600倍液\n3. 增加通风，避免烟株过于密集\n4. 摘除并销毁已感染的叶片，避免病害扩散\n\n建议您尽快处理，防止病害扩散。',
        timestamp: '2023-06-10T09:17:30Z'
      }
    ],
    relatedFieldId: 1,
    relatedTaskId: null,
    createdAt: '2023-06-10T09:15:00Z',
    lastUpdatedAt: '2023-06-10T09:17:30Z'
  },
  {
    id: 2,
    userId: 2, // 烟技员
    sessionId: 'session-002',
    messages: [
      {
        id: 201,
        role: 'user',
        content: '今年烟田产量怎么估算更准确？',
        timestamp: '2023-06-15T14:20:00Z'
      },
      {
        id: 202,
        role: 'assistant',
        content: '准确估算烟田产量需要考虑多个因素。推荐以下几种方法结合使用：\n\n1. **面积-单株产量法**：\n   - 计算公式：总产量 = 种植面积 × 每亩株数 × 单株叶片数 × 单叶干重 × 成活率\n   - 需要田间随机抽样测量单株叶片数和单叶干重\n\n2. **采样法**：\n   - 在田间均匀选取多个样点（至少5-10个点）\n   - 每个样点收获全部烟叶并烘烤后称重\n   - 计算平均值后推算总产量\n\n3. **历史数据对比法**：\n   - 参考往年相似种植条件下的产量数据\n   - 结合当年长势、天气等因素进行调整\n\n4. **利用本系统的无人机影像分析**：\n   - 使用监测任务中的估产分析功能\n   - 系统会基于无人机影像、株数和生长指标自动计算预估产量\n\n建议您综合使用这几种方法，特别是在不同生长阶段使用不同方法，以得到最准确的结果。',
        timestamp: '2023-06-15T14:21:15Z'
      }
    ],
    relatedFieldId: null,
    relatedTaskId: null,
    createdAt: '2023-06-15T14:20:00Z',
    lastUpdatedAt: '2023-06-15T14:21:15Z'
  },
  {
    id: 3,
    userId: 3, // 烟农
    sessionId: 'session-003',
    messages: [
      {
        id: 301,
        role: 'user',
        content: '最近天气干旱，我应该如何浇水？',
        timestamp: '2023-07-05T08:30:00Z'
      },
      {
        id: 302,
        role: 'assistant',
        content: '在干旱天气条件下，烟草灌溉需要特别注意方法和时机。以下是建议：\n\n**灌溉方法**：\n- 采用滴灌或微喷灌方式最为理想，可节约用水并减少叶片受潮\n- 如使用沟灌，应控制水流缓慢，避免根系暴露\n\n**灌溉时机**：\n- 选择早晨或傍晚进行，避开中午高温时段\n- 建议在土壤含水量降至田间持水量的60-70%时及时灌溉\n\n**灌溉量**：\n- 旺长期每次灌水深度控制在30-40mm\n- 干旱严重时，可适当增加灌溉频次，但单次水量不宜过大\n\n**注意事项**：\n- 灌溉后注意田间通风，避免湿度过大引发病害\n- 灌溉与追肥结合，可提高肥料利用率\n- 持续干旱条件下，可在株间覆盖秸秆等减少水分蒸发\n\n同时建议您查看气象预报，如预计近期有降雨，可适当调整灌溉计划。',
        timestamp: '2023-07-05T08:31:40Z'
      }
    ],
    relatedFieldId: 1,
    relatedTaskId: null,
    createdAt: '2023-07-05T08:30:00Z',
    lastUpdatedAt: '2023-07-05T08:31:40Z'
  }
];

// 根据用户ID获取会话列表
export const getChatSessions = (userId: number) => {
  const userSessions = chatHistory.filter(session => session.userId === userId);
  
  return {
    success: true,
    code: 200,
    message: '获取会话列表成功',
    data: userSessions.map(session => ({
      id: session.id,
      sessionId: session.sessionId,
      messages: [], // 添加messages字段以满足ChatSession类型要求
      lastMessage: session.messages[session.messages.length - 1].content.substring(0, 50) + '...',
      createdAt: session.createdAt,
      lastUpdatedAt: session.lastUpdatedAt,
      relatedFieldId: session.relatedFieldId,
      relatedTaskId: session.relatedTaskId
    }))
  };
};

// 获取会话详情
export const getChatSessionDetail = (sessionId: string) => {
  const session = chatHistory.find(s => s.sessionId === sessionId);
  
  if (session) {
    return {
      success: true,
      code: 200,
      message: '获取会话详情成功',
      data: session
    };
  } else {
    return {
      success: false,
      code: 404,
      message: '未找到该会话',
      data: null
    };
  }
};

// 发送消息
export const sendChatMessage = (sessionId: string, message: string, userId: number, fieldId?: number, taskId?: number) => {
  // 查找已有会话或创建新会话
  let session = chatHistory.find(s => s.sessionId === sessionId);
  const now = new Date().toISOString();
  
  if (!session) {
    // 创建新会话
    const newSessionId = sessionId || `session-${Date.now()}`;
    const newSession = {
      id: chatHistory.length + 1,
      userId: userId,
      sessionId: newSessionId,
      messages: [],
      relatedFieldId: fieldId || null,
      relatedTaskId: taskId || null,
      createdAt: now,
      lastUpdatedAt: now
    };
    
    // 将新会话添加到历史记录中
    chatHistory.push(newSession as any);
    session = newSession as any;
  }
  
  if (!session) {
    return {
      success: false,
      code: 500,
      message: '创建会话失败',
      data: null
    };
  }
  
  // 生成用户消息ID
  const userMessageId = Date.now();
  
  // 添加用户消息
  session.messages.push({
    id: userMessageId,
    role: 'user',
    content: message,
    timestamp: now
  });
  
  // 模拟AI回复
  const aiResponse = generateAIResponse(message, fieldId, taskId);
  const aiMessageId = userMessageId + 1;
  
  // 添加AI回复
  session.messages.push({
    id: aiMessageId,
    role: 'assistant',
    content: aiResponse,
    timestamp: new Date(Date.now() + 2000).toISOString() // 模拟AI回复时间延迟
  });
  
  // 更新会话时间
  session.lastUpdatedAt = new Date(Date.now() + 2000).toISOString();
  
  return {
    success: true,
    code: 200,
    message: '发送消息成功',
    data: {
      userMessage: {
        id: userMessageId,
        role: 'user',
        content: message,
        timestamp: now
      },
      aiMessage: {
        id: aiMessageId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(Date.now() + 2000).toISOString()
      }
    }
  };
};

// 获取问题模板
export const getQuestionTemplates = () => {
  return {
    success: true,
    code: 200,
    message: '获取问题模板成功',
    data: questionTemplates
  };
};

// 生成AI回复的简单逻辑
function generateAIResponse(message: string, fieldId?: number | null, taskId?: number | null): string {
  // 关键词匹配
  const keywords = {
    '病害': '根据您的描述，可能是烟草常见病害。建议检查以下方面：\n\n1. 叶片症状：斑点、坏死、畸形等\n2. 茎部症状：是否有溃疡或褐变\n3. 发病范围：局部或整株\n\n建议采取的措施：\n1. 摘除病叶并集中销毁\n2. 喷施广谱杀菌剂如多菌灵或代森锰锌\n3. 改善田间通风条件\n4. 合理灌溉，避免田间积水\n\n如能提供具体症状图片，我可以给出更精确的诊断。',
    
    '虫害': '烟草常见虫害包括烟青虫、蚜虫、烟蓟马等。建议以下防治措施：\n\n1. 物理防治：设置黄板、灯光诱捕\n2. 生物防治：释放天敌如瓢虫、草蛉\n3. 化学防治：根据虫害类型选择相应农药，如吡虫啉、阿维菌素等\n4. 农业防治：合理轮作，清除田间杂草\n\n喷药建议在早晨或傍晚进行，避开高温时段。注意遵循安全间隔期。',
    
    '施肥': '烟草施肥需根据生长期、土壤情况和目标产量综合考虑。一般建议：\n\n1. 底肥：有机肥+复合肥，注重钾肥比例\n2. 苗期追肥：以氮肥为主，促进生长\n3. 旺长期：适量氮肥+钾肥，控制氮肥用量\n4. 打顶后：以钾肥为主，提高品质\n\n用量建议：\n- 底肥：有机肥2000-3000kg/亩，复合肥30-40kg/亩\n- 追肥：根据长势每次5-10kg/亩\n\n施肥方法建议采用条施或穴施，避免与根系直接接触。',
    
    '浇水': '烟草灌溉应遵循"不干不浇、浇则见湿、湿而不涝"的原则。\n\n不同生长阶段的灌溉要点：\n1. 移栽期：保证成活，浇透水\n2. 旺长期：控制水分，间断灌溉\n3. 打顶期：适当控水，促进成熟\n4. 成熟期：基本停止灌溉\n\n灌溉方法建议：\n- 采用滴灌或沟灌方式\n- 避免水分直接接触叶片\n- 晴天早晚浇水，阴天中午浇水\n- 灌水后及时松土，保持土壤透气性',
    
    '采收': '烟草采收时机至关重要，影响产量和品质。采收要点：\n\n1. 判断成熟度：\n   - 下部叶：叶片由绿转黄，叶尖微下垂\n   - 中部叶：黄绿相间，叶面有光泽\n   - 上部叶：黄中带绿，叶脉变白\n\n2. 采收顺序：由下而上，分批采收\n\n3. 采收方法：\n   - 晴天早晨露水干后进行\n   - 轻拿轻放，避免机械损伤\n   - 按叶位分类堆放\n\n4. 采后处理：\n   - 及时送入烤房，避免日晒\n   - 按叶位分类编挂',
    
    '天气': '针对天气变化，烟草田需采取以下措施：\n\n1. 高温天气：\n   - 适当增加灌溉频次\n   - 进行遮阳或喷施降温剂\n   - 避免中午进行田间管理\n\n2. 暴雨天气：\n   - 提前疏通排水沟渠\n   - 暴雨后及时排水和松土\n   - 喷施杀菌剂预防病害\n\n3. 干旱天气：\n   - 合理安排灌溉\n   - 地表覆盖减少蒸发\n   - 早晚浇水提高效率\n\n4. 寒潮天气：\n   - 烟苗期搭建防寒棚\n   - 增施有机肥提高抗寒性\n   - 喷施叶面肥促进恢复',
    
    '长势': '评估烟草长势需关注以下指标：\n\n1. 株高与节距：健康烟株株高均匀，节间适中\n2. 叶片数量与大小：叶片舒展，大小均匀\n3. 叶色：浓绿有光泽，无黄化现象\n4. 主茎粗细：粗壮且有弹性\n5. 根系发育：白色健康根系发达\n\n改善长势措施：\n- 均衡施肥，特别是氮磷钾配比\n- 适时浇水，保持土壤湿度适宜\n- 及时防治病虫害\n- 适当密度，避免过密或过稀'
  };
  
  // 简单的关键词匹配逻辑
  for (const [keyword, response] of Object.entries(keywords)) {
    if (message.includes(keyword)) {
      return response;
    }
  }
  
  // 默认回复
  return '感谢您的咨询。作为智慧烟田系统的智能助手，我可以帮助您解答关于烟草种植、病虫害防治、田间管理等问题。请详细描述您的问题，以便我提供更准确的建议。您也可以上传照片，这将帮助我更好地分析情况。';
} 