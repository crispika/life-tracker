export type Goal = {
  id: number
  summary: string
  description: string
  parentId: number | null
  color: string
  isFirstLevel: boolean
  prefix: {
    id: number
    name: string
  }
  state: {
    id: number
    name: string
  }
  children: Goal[]
}

export type LifeGoal = {
  id: number
  summary: string
  sidenote: string | null
}
