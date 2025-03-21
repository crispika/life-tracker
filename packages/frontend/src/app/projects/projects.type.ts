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
