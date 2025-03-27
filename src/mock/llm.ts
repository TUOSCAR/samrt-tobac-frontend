import { formatDate } from '@/utils/index'

// 异常诊断数据
export function getAnomalyDiagnosis() {
  const data = [
    {
      id: 1,
      task_id: 101,
      field_id: 1,
      diagnosis_date: formatDate(new Date('2023-07-15')),
      anomaly_type: 'disease',
      severity: 'high',
      affected_area_ratio: 0.35,
      diagnosis_content: '烟草黑胫病(Phytophthora nicotianae)感染，主要分布在田块东北部，覆盖面积约35%。症状表现为茎基部出现水浸状暗褐色病斑，叶片黄化萎蔫。',
      possible_causes: '近期连续降雨导致土壤过湿；田间排水不良；前茬作物管理不当可能有病原残留。',
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 2,
      task_id: 101,
      field_id: 2,
      diagnosis_date: formatDate(new Date('2023-07-15')),
      anomaly_type: 'pest',
      severity: 'medium',
      affected_area_ratio: 0.25,
      diagnosis_content: '烟青虫(Helicoverpa assulta)侵害，主要分布在田块中部和南部区域，约25%的植株受到不同程度危害。叶片出现不规则孔洞和缺刻。',
      possible_causes: '周边杂草管理不及时，为害虫提供栖息场所；天敌较少；近期温度适宜虫卵孵化。',
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 3,
      task_id: 102,
      field_id: 3,
      diagnosis_date: formatDate(new Date('2023-07-18')),
      anomaly_type: 'nutrition',
      severity: 'low',
      affected_area_ratio: 0.15,
      diagnosis_content: '氮素缺乏症状，主要分布在田块西南角区域。下部叶片出现均匀黄化，生长缓慢，植株矮小。',
      possible_causes: '施肥不均匀；土壤板结导致养分吸收不良；灌溉不足导致养分利用率降低。',
      created_at: formatDate(new Date('2023-07-19')),
      updated_at: formatDate(new Date('2023-07-19'))
    }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 获取异常类型分布
export function getAnomalyTypes() {
  const data = [
    { type: 'disease', count: 42, percentage: 0.42 },
    { type: 'pest', count: 28, percentage: 0.28 },
    { type: 'nutrition', count: 15, percentage: 0.15 },
    { type: 'growth', count: 10, percentage: 0.10 },
    { type: 'environment', count: 5, percentage: 0.05 }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 获取严重性分布
export function getSeverityDistribution() {
  const data = [
    { severity: 'low', count: 25, percentage: 0.25 },
    { severity: 'medium', count: 45, percentage: 0.45 },
    { severity: 'high', count: 20, percentage: 0.20 },
    { severity: 'critical', count: 10, percentage: 0.10 }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 获取异常区域
export function getAnomalyAreas(options: any) {
  const data = [
    {
      id: 1,
      field_id: 1,
      center: [120.124, 30.282],
      radius: 50,
      anomaly_type: 'disease',
      severity: 'high',
      description: '烟草黑胫病高发区域，超过80%的植株受感染'
    },
    {
      id: 2,
      field_id: 1,
      center: [120.128, 30.287],
      radius: 30,
      anomaly_type: 'pest',
      severity: 'medium',
      description: '烟青虫危害区域，叶片被害率约60%'
    },
    {
      id: 3,
      field_id: 1,
      center: [120.132, 30.292],
      radius: 20,
      anomaly_type: 'nutrition',
      severity: 'low',
      description: '轻微氮素缺乏区域，下部叶片出现黄化'
    }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 策略推演数据
export function getStrategyRecommendations() {
  const data = [
    {
      id: 1,
      task_id: 101,
      field_id: 1,
      recommendation_type: 'disease_control',
      priority: 'high',
      recommendation_content: '1. 立即使用72%农用链霉素可溶性粉剂500倍液喷施，覆盖全田，重点加强东北部感病区域\n2. 3-5天后使用25%嘧菌酯悬浮剂1000倍液再次喷施\n3. 改进排水系统，降低田间湿度\n4. 清除病株并集中处理，避免病害扩散',
      execution_deadline: formatDate(new Date('2023-07-20')),
      confidence_score: 0.86,
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 2,
      task_id: 101,
      field_id: 2,
      recommendation_type: 'pest_control',
      priority: 'medium',
      recommendation_content: '1. 使用4.5%高效氯氟氰菊酯乳油3000倍液喷施，重点覆盖田块中部和南部区域\n2. 安装黑光灯诱虫器，每亩设置1-2盏\n3. 清除田间和周边杂草，减少虫源\n4. 7天后检查防治效果，必要时进行第二次喷药',
      execution_deadline: formatDate(new Date('2023-07-22')),
      confidence_score: 0.82,
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 3,
      task_id: 102,
      field_id: 3,
      recommendation_type: 'fertilization',
      priority: 'low',
      recommendation_content: '1. 针对西南角区域追施尿素5kg/亩\n2. 全田叶面喷施0.3%尿素溶液，提高氮素吸收效率\n3. 适当增加灌溉次数，确保养分充分溶解吸收\n4. 两周后再次检测植株生长状况',
      execution_deadline: formatDate(new Date('2023-07-25')),
      confidence_score: 0.90,
      created_at: formatDate(new Date('2023-07-19')),
      updated_at: formatDate(new Date('2023-07-19'))
    }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 分析报告数据
export function getAnalysisReports() {
  const data = [
    {
      id: 1,
      task_id: 101,
      field_id: null,
      report_title: '2023年第二季度烟田生长监测综合分析报告',
      report_content: generateReportContent(),
      generated_by: 'GPT-4',
      status: 'published',
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 2,
      task_id: 101,
      field_id: 1,
      report_title: '东山1号烟田黑胫病诊断与防治分析报告',
      report_content: generateReportContent(),
      generated_by: 'Claude 3 Opus',
      status: 'published',
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 3,
      task_id: 102,
      field_id: 3,
      report_title: '西区3号烟田营养状况分析报告',
      report_content: generateReportContent(),
      generated_by: 'Llama 3',
      status: 'draft',
      created_at: formatDate(new Date('2023-07-19')),
      updated_at: formatDate(new Date('2023-07-19'))
    }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 生成报告内容
function generateReportContent() {
  return `
<div class="report-container">
  <h1 class="report-title">烟田生长状况分析报告</h1>
  <div class="report-meta">
    <p>生成日期: ${formatDate(new Date('2023-07-15'))}</p>
    <p>分析模型: GPT-4</p>
  </div>
  
  <div class="report-summary">
    <h2>摘要</h2>
    <p>本次监测覆盖10个烟田地块，总面积68.3亩。监测内容包括烟株计数、长势分析和估产分析。整体烟株数量符合标准，但部分地块存在病虫害和营养问题，需要及时防治。预计总产量可达6820kg，略高于去年同期。</p>
  </div>
  
  <div class="report-section">
    <h2>1. 生长状况分析</h2>
    <p>根据多光谱影像分析，本次监测的10个地块中，烟株长势总体良好，平均株高92.6cm，符合本生长阶段的标准。叶片发育正常，平均叶面积指数(LAI)为3.2，处于健康范围。</p>
    <p>通过植被指数(NDVI)分析，发现80%的监测区域NDVI值在0.65以上，表明植被生长状况良好。但东山1号和西区3号地块存在局部NDVI值偏低的情况，分别是由于病害和营养缺乏引起。</p>
    <div class="chart-placeholder">生长曲线图表</div>
  </div>
  
  <div class="report-section">
    <h2>2. 异常识别</h2>
    <p>通过深度学习模型分析，识别出以下主要异常情况：</p>
    <ul>
      <li>东山1号地块东北部约2亩区域发生烟草黑胫病，症状明显，需立即处理</li>
      <li>南湾2号地块中部和南部区域发生烟青虫危害，受影响面积约1.5亩</li>
      <li>西区3号地块西南角约0.8亩区域出现氮素缺乏症状，表现为下部叶片黄化</li>
    </ul>
  </div>
  
  <div class="report-section">
    <h2>3. 管理建议</h2>
    <p>针对发现的问题，建议采取以下管理措施：</p>
    <ol>
      <li>东山1号地块：立即使用72%农用链霉素可溶性粉剂500倍液喷施，3-5天后使用25%嘧菌酯悬浮剂1000倍液再次喷施；同时改进排水系统，降低田间湿度</li>
      <li>南湾2号地块：使用4.5%高效氯氟氰菊酯乳油3000倍液喷施；安装黑光灯诱虫器；清除田间和周边杂草</li>
      <li>西区3号地块：追施尿素5kg/亩；叶面喷施0.3%尿素溶液；适当增加灌溉次数</li>
      <li>其他地块：按计划进行常规管理，注意观察病虫害预警信息</li>
    </ol>
  </div>
  
  <div class="report-section">
    <h2>4. 未来趋势预测</h2>
    <p>根据当前生长状况和气象预报，预计7月下旬至8月上旬将是病虫害高发期，尤其需要关注斜纹夜蛾和烟草花叶病毒病的风险。建议加强监测频次，提前做好防控准备。预计8月中下旬烟叶将逐步成熟，可适时安排采收。</p>
    <div class="chart-placeholder">趋势预测图表</div>
  </div>
</div>
  `
}

// 监测规划数据
export function getMonitoringPlans() {
  const data = [
    {
      id: 1,
      task_id: 101,
      suggested_start_date: formatDate(new Date('2023-08-01')),
      suggested_end_date: formatDate(new Date('2023-08-07')),
      suggested_type: 'regular',
      suggested_fields: [1, 2, 3, 4, 5],
      focus_areas: '重点关注病虫害防治效果和打顶后的生长情况',
      reason: '根据当前生长阶段和已发现的病虫害问题，建议在防治措施实施3周后进行跟踪监测，以评估防治效果并为下一步管理提供依据。',
      status: 'pending',
      created_at: formatDate(new Date('2023-07-16')),
      updated_at: formatDate(new Date('2023-07-16'))
    },
    {
      id: 2,
      task_id: 102,
      suggested_start_date: formatDate(new Date('2023-08-15')),
      suggested_end_date: formatDate(new Date('2023-08-21')),
      suggested_type: 'harvest_assessment',
      suggested_fields: [1, 2, 3, 4, 5, 6, 7, 8],
      focus_areas: '重点关注烟叶成熟度和采收适期判断',
      reason: '根据当前生长情况和天气预测，预计8月中下旬大部分烟叶将达到成熟采收期，需进行采前监测以确定最佳采收时间。',
      status: 'pending',
      created_at: formatDate(new Date('2023-07-19')),
      updated_at: formatDate(new Date('2023-07-19'))
    }
  ]
  
  return {
    code: 200,
    data,
    message: 'success'
  }
}

// 更新监测规划状态
export function updateMonitoringPlanStatus() {
  return {
    code: 200,
    data: {
      success: true,
      message: '状态更新成功'
    },
    message: 'success'
  }
}

// 创建任务
export function createTaskFromPlan() {
  return {
    code: 200,
    data: {
      success: true,
      message: '任务创建成功',
      data: {
        taskId: 201
      }
    },
    message: 'success'
  }
} 