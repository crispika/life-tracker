import { mutations } from '@life-tracker/db'
import { NextResponse } from 'next/server'
import { TaskErrorCode } from '../error.types'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const taskId = Number((await params).id)
  const { summary, description, startDate, dueDate, originalEstimateMinutes } =
    await request.json()
  const userId = Number(request.headers.get('x-user-id') || '100000')

  try {
    await mutations.task.updateTask(taskId, userId, {
      summary,
      description,
      startDate,
      dueDate,
      originalEstimateMinutes
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json(
      { error: 'Failed to update task', code: TaskErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const taskId = Number((await params).id)
  const userId = Number(request.headers.get('x-user-id') || '100000')
  const data: Partial<{
    summary: string
    description: string
    startDate: string | null
    dueDate: string | null
    originalEstimateMinutes: number | null
  }> = await request.json()

  try {
    await mutations.task.updateTask(taskId, userId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json(
      { error: 'Failed to update task', code: TaskErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const taskId = Number((await params).id)
  const userId = Number(request.headers.get('x-user-id') || '100000')

  try {
    await mutations.task.deleteTask(taskId, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task', code: TaskErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
