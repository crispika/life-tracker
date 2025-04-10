import { Task, TimeEstimate } from './tasks.type'

export const DEFAULT_TASK_STATE = {
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
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return {
    hours,
    minutes: remainingMinutes
  }
}

// 辅助函数：格式化 TimeEstimate 为字符串显示
export function formatTimeEstimate(estimate: TimeEstimate): string {
  const parts: string[] = []

  if (estimate.hours > 0) parts.push(`${estimate.hours}h`)
  if (estimate.minutes > 0) parts.push(`${estimate.minutes}m`)

  return parts.join('') || '0m'
}

// 辅助函数：将分钟直接格式化为字符串
export function formatMinutesToTimeString(minutes: number): string {
  return formatTimeEstimate(minutesToTimeEstimate(minutes))
}

// 辅助函数：将时间字符串转换为分钟数
export function timeStringToMinutes(timeString: string): number {
  const hoursMatch = timeString.match(/(\d+)h/)
  const minutesMatch = timeString.match(/(\d+)m/)

  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0

  return hours * 60 + minutes
}

// 辅助函数：验证时间字符串格式
export function isValidTimeString(timeString: string): boolean {
  return /^(\d+h)?(\d+m)?$/.test(timeString)
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
        return (
          factor * (a.startDate?.getTime() || 0 - (b.startDate?.getTime() || 0))
        )
      case 'dueDate':
        return (
          factor * (a.dueDate?.getTime() || 0 - (b.dueDate?.getTime() || 0))
        )
      case 'estimate':
        return factor * (a.originalEstimate || 0 - (b.originalEstimate || 0))
      case 'timeSpent':
        return factor * (a.timeSpent - b.timeSpent)
      case 'summary':
        return factor * a.summary.localeCompare(b.summary)
      default:
        return 0
    }
  })
}
