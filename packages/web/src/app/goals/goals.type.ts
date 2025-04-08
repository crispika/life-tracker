export type Goal = {
  id: number
  summary: string
  description: string
  parentId: number | null
  color: string
  isFirstLevel: boolean
  code: number | null
  prefix: {
    id: number
    name: string
  }
  state: GoalState
  children: Goal[]
}

export type GoalState = {
  id: number
  name: string
}

export type LifeGoal = {
  id: number
  summary: string
  sidenote: string | null
}
