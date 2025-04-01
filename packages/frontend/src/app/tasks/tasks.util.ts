import { Project } from 'next/dist/build/swc/types'
import { TimeEstimate } from './tasks.type'
import { Task } from './tasks.type'

const DEFAULT_TASK_STATE = {
  OPEN: '未开始',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  ON_HOLD: '已暂停',
  ABORTED: '已中止',
  ARCHIVED: '已归档'
} as const

type DefaultTaskStateKey = keyof typeof DEFAULT_TASK_STATE

export const getTaskStateName = (systemDefined: boolean, name: string) => {
  return systemDefined ? DEFAULT_TASK_STATE[name as DefaultTaskStateKey] : name
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

export function sortTasks(
  tasks: Task[],
  sortBy: string | null | undefined,
  direction: string | null | undefined
): Task[] {
  if (!sortBy || !direction) return tasks

  return [...tasks].sort((a, b) => {
    const factor = direction === 'asc' ? 1 : -1

    switch (sortBy) {
      case 'goal':
        return factor * (a.summary || '').localeCompare(b.summary || '')
      case 'state':
        return factor * (a.state.name || '').localeCompare(b.state.name || '')
      case 'startDate':
        return factor * (a.startDate.getTime() - b.startDate.getTime())
      case 'dueDate':
        return factor * (a.dueDate.getTime() - b.dueDate.getTime())
      case 'estimate':
        return factor * (a.originalEstimate - b.originalEstimate)
      case 'timeSpent':
        return factor * (a.timeSpent - b.timeSpent)
      case 'summary':
        return factor * a.summary.localeCompare(b.summary)
      default:
        return 0
    }
  })
}

export const formatTaskDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes}分钟`
  } else if (remainingMinutes === 0) {
    return `${hours}小时`
  } else {
    return `${hours}小时${remainingMinutes}分钟`
  }
}

export const formatTaskProgress = (
  timeSpent: number,
  originalEstimate: number
) => {
  if (originalEstimate === 0) return '0%'
  const progress = (timeSpent / originalEstimate) * 100
  return `${Math.min(Math.round(progress), 100)}%`
}

export const getTaskStateDisplayName = (task: Task) => {
  return getTaskStateName(task.state.systemDefined, task.state.name)
}

export const getTaskStatusColor = (task: Task) => {
  switch (task.state.name) {
    case 'OPEN':
      return 'bg-gray-100 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800'
    case 'ABORTED':
      return 'bg-red-100 text-red-800'
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getTaskPriorityColor = (task: Task) => {
  const now = new Date()
  const dueDate = new Date(task.dueDate)
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilDue < 0) {
    return 'text-red-600'
  } else if (daysUntilDue <= 3) {
    return 'text-orange-600'
  } else if (daysUntilDue <= 7) {
    return 'text-yellow-600'
  } else {
    return 'text-green-600'
  }
}
