export type Goal = {
  id: number
  summary: string
  description: string
  parentId: number | null
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
