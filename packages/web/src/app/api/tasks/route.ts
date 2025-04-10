import { NextResponse } from 'next/server'
import { TaskErrorCode } from './error.types'
import { mutations } from '@life-tracker/db'

export async function POST(request: Request) {
  const {
    goalId,
    summary,
    description,
    startDate,
    dueDate,
    originalEstimateMinutes
  } = await request.json()

  const userId = Number(request.headers.get('x-user-id') || '100000')

  if (!goalId || !userId || !summary) {
    return NextResponse.json(
      { error: 'Missing required fields', code: TaskErrorCode.INVALID_INPUT },
      { status: 400 }
    )
  }

  try {
    const taskId = await mutations.task.createTask(
      userId,
      goalId,
      summary,
      description,
      startDate,
      dueDate,
      originalEstimateMinutes
    )
    return NextResponse.json({ taskId })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json(
      { error: 'Failed to create task', code: TaskErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
