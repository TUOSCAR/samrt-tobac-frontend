/**
 * 格式化日期
 * @param date 日期对象、时间戳或日期字符串
 * @param format 格式化模板
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''
  
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  
  return format
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, month.toString().padStart(2, '0'))
    .replace(/DD/g, day.toString().padStart(2, '0'))
    .replace(/HH/g, hour.toString().padStart(2, '0'))
    .replace(/mm/g, minute.toString().padStart(2, '0'))
    .replace(/ss/g, second.toString().padStart(2, '0'))
}

/**
 * 获取日期范围
 * @param type 范围类型：today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth
 * @returns 开始日期和结束日期
 */
export function getDateRange(type: string): [Date, Date] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (type) {
    case 'today':
      return [today, new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)]
      
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      return [yesterday, new Date(today.getTime() - 1)]
      
    case 'thisWeek': {
      const day = today.getDay() || 7
      const startDate = new Date(today.getTime() - (day - 1) * 24 * 60 * 60 * 1000)
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      return [startDate, endDate]
    }
      
    case 'lastWeek': {
      const day = today.getDay() || 7
      const startDate = new Date(today.getTime() - (day - 1 + 7) * 24 * 60 * 60 * 1000)
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      return [startDate, endDate]
    }
      
    case 'thisMonth': {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      return [startDate, endDate]
    }
      
    case 'lastMonth': {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
      return [startDate, endDate]
    }
      
    default:
      return [today, new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)]
  }
} 