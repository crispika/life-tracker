// 目标类型
export type Goal = {
  id: string
  name: string
  key: string // 8字符缩写，如 WK, HT, RX
  color: string
  sequence: number // 当前序列号，用于生成项目编号
}

// 项目类型
export type Project = {
  id: number
  code: string
  summary: string
  description: string | null
  startDate: Date
  dueDate: Date
  originalEstimate: number
  timeSpent: number
  goalSummary?: string
  goalColor?: string
  state: string
}

// 时间估计类型（UI 显示用）
export type TimeEstimate = {
  weeks: number
  days: number
  hours: number
  minutes: number
}

// 辅助函数：将分钟转换为 TimeEstimate 对象
export function minutesToTimeEstimate(minutes: number): TimeEstimate {
  const weeks = Math.floor(minutes / (7 * 24 * 60))
  let remainingMinutes = minutes - weeks * 7 * 24 * 60

  const days = Math.floor(remainingMinutes / (24 * 60))
  remainingMinutes -= days * 24 * 60

  const hours = Math.floor(remainingMinutes / 60)
  remainingMinutes -= hours * 60

  return {
    weeks,
    days,
    hours,
    minutes: remainingMinutes
  }
}

// 辅助函数：格式化 TimeEstimate 为字符串显示
export function formatTimeEstimate(estimate: TimeEstimate): string {
  const parts: string[] = []

  if (estimate.weeks > 0) parts.push(`${estimate.weeks}w`)
  if (estimate.days > 0) parts.push(`${estimate.days}d`)
  if (estimate.hours > 0) parts.push(`${estimate.hours}h`)
  if (estimate.minutes > 0) parts.push(`${estimate.minutes}m`)

  return parts.join(' ') || '0m'
}

// 辅助函数：将分钟直接格式化为字符串
export function formatMinutesToTimeString(minutes: number): string {
  return formatTimeEstimate(minutesToTimeEstimate(minutes))
}
