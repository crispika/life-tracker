import { NextResponse } from 'next/server'
import { mutations } from '@life-tracker/db'
import { GoalErrorCode } from '../error.types'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const goalId = Number((await params).goalId)
    const userId = Number(request.headers.get('x-user-id') || '100000')

    if (isNaN(goalId)) {
      return NextResponse.json(
        { error: '无效的目标ID', code: GoalErrorCode.INVALID_INPUT },
        { status: 400 }
      )
    }

    console.log(`API: 尝试删除目标: userId=${userId}, goalId=${goalId}`)

    await mutations.goal.deleteGoalWithAllChildren(userId, goalId)
    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('删除目标失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '删除目标失败',
        code: GoalErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    )
  }
}
