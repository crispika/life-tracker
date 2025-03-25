import { ProjectState } from '@/app/projects/projects.type'

export async function fetchCurrentState(
  projectId: number
): Promise<ProjectState> {
  const response = await fetch(`/api/projects/${projectId}/current-state`, {
    headers: {
      'x-user-id': '100000'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch current state')
  }
  return response.json()
}

export async function updateProjectState(
  projectId: number,
  stateId: number
): Promise<ProjectState> {
  const response = await fetch(`/api/projects/${projectId}/current-state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': '100000'
    },
    body: JSON.stringify({ stateId })
  })
  if (!response.ok) {
    throw new Error('Failed to update project state')
  }
  return response.json()
}

export async function fetchUserProjectStates(): Promise<ProjectState[]> {
  const response = await fetch('/api/projects/available-states', {
    headers: {
      'x-user-id': '100000'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch states')
  }
  return response.json()
}
