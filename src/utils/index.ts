/**
 * 日期格式化函数
 * @param date 日期字符串或日期对象
 * @param format 格式化模式，默认 yyyy-MM-dd HH:mm:ss
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  
  return format
    .replace(/yyyy/g, year.toString())
    .replace(/MM/g, month < 10 ? `0${month}` : month.toString())
    .replace(/dd/g, day < 10 ? `0${day}` : day.toString())
    .replace(/HH/g, hours < 10 ? `0${hours}` : hours.toString())
    .replace(/mm/g, minutes < 10 ? `0${minutes}` : minutes.toString())
    .replace(/ss/g, seconds < 10 ? `0${seconds}` : seconds.toString())
} 