import { mutations } from '@life-tracker/db'
import { NextRequest, NextResponse } from 'next/server'
import { GoalErrorCode } from '../../error.types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const goalId = Number((await params).id)
  const userId = Number(request.headers.get('x-user-id') || '100000')

  const { state } = await request.json()

  if (!state) {
    return NextResponse.json(
      { error: '待被更新的状态不能为空' },
      { status: 400 }
    )
  }
  try {
    await mutations.goal.updateGoalState(userId, goalId, state)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新目标状态失败:', error)
    return NextResponse.json(
      { error: '更新目标状态失败', code: GoalErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
