import { TimeEstimate } from './projects.type'
import { Project } from './projects.type'

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

export function sortProjects(
  projects: Project[],
  sortBy: string | null | undefined,
  direction: string | null | undefined
): Project[] {
  if (!sortBy || !direction) return projects

  return [...projects].sort((a, b) => {
    const factor = direction === 'asc' ? 1 : -1

    switch (sortBy) {
      case 'goal':
        return factor * (a.goalSummary || '').localeCompare(b.goalSummary || '')
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
