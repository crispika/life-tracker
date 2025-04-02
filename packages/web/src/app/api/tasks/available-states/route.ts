import { queries } from '@life-tracker/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const userId = Number(request.headers.get('x-user-id') || '100000')
    const states = await queries.task.getTaskStatesByUserId(userId)
    return NextResponse.json(states)
  } catch (error) {
    console.error('Failed to fetch task states by user id:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task states by user id' },
      { status: 500 }
    )
  }
}
