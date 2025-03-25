const DEFAULT_PROJECT_STATE = {
  ABORTED: 'Aborted',
  ARCHIVED: 'Archived',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  OPEN: 'Open'
} as const

type DefaultProjectStateKey = keyof typeof DEFAULT_PROJECT_STATE

export const getProjectStateName = (systemDefined: boolean, name: string) => {
  return systemDefined
    ? DEFAULT_PROJECT_STATE[name as DefaultProjectStateKey]
    : name
}
