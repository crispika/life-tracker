export interface TaskState {
  id: number
  name: string
  systemDefined: boolean
}

export interface Task {
  id: number
  code: number
  summary: string
  description: string | null
  startDate: Date
  dueDate: Date
  originalEstimate: number
  timeSpent: number
  goalSummary: string
  goalColor: string
  prefix: string
  state: TaskState
}

// 时间估计类型（UI 显示用）
export type TimeEstimate = {
  weeks: number
  days: number
  hours: number
  minutes: number
}

export interface TaskState {
  name: string
  id: number
  systemDefined: boolean
}
