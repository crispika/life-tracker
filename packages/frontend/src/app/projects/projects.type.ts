// 目标类型
export type Goal = {
  id: string
  name: string
  key: string // 8字符缩写，如 WK, HT, RX
  color: string
  sequence: number // 当前序列号，用于生成项目编号
}

// 时间估计类型（UI 显示用）
export type TimeEstimate = {
  weeks: number
  days: number
  hours: number
  minutes: number
}

// 项目类型
export type Project = {
  id: string
  goal: ProjectGoal
  projectCode: string
  summary: string
  description: string
  startDate: Date
  dueDate: Date
  originalEstimateMinutes: number // 存储为分钟总数
  timeSpentMinutes: number // 存储为分钟总数
  color: string
}

// 目标类型枚举
export enum ProjectGoal {
  HEALTH = 'health',
  WORK = 'work',
  RELAX = 'relax'
}

// 目标映射表
export const goalMap: Record<ProjectGoal, Goal> = {
  [ProjectGoal.WORK]: {
    id: '1',
    name: '工作',
    key: 'WK',
    color: '#4A6FDC',
    sequence: 0
  },
  [ProjectGoal.HEALTH]: {
    id: '2',
    name: '健康',
    key: 'HT',
    color: '#36B37E',
    sequence: 0
  },
  [ProjectGoal.RELAX]: {
    id: '3',
    name: '休闲',
    key: 'RX',
    color: '#FF8B00',
    sequence: 0
  }
}

// 生成项目编号并更新序列
export function generateProjectCode(goal: ProjectGoal): string {
  const goalData = goalMap[goal]
  goalData.sequence += 1
  return `${goalData.key}-${goalData.sequence.toString().padStart(3, '0')}`
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
