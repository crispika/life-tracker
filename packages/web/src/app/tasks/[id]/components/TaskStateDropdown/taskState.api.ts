import { TaskState } from '@/app/tasks/tasks.type'

export async function fetchCurrentState(taskId: number): Promise<TaskState> {
  const response = await fetch(`/api/tasks/${taskId}/current-state`, {
    headers: {
      'x-user-id': '100000'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch current state')
  }
  return response.json()
}

export async function updateTaskState(
  taskId: number,
  stateId: number
): Promise<TaskState> {
  const response = await fetch(`/api/tasks/${taskId}/current-state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': '100000'
    },
    body: JSON.stringify({ stateId })
  })
  if (!response.ok) {
    throw new Error('Failed to update task state')
  }
  return response.json()
}

export async function fetchUserTaskStates(): Promise<TaskState[]> {
  const response = await fetch('/api/tasks/available-states', {
    headers: {
      'x-user-id': '100000'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch states')
  }
  return response.json()
}
