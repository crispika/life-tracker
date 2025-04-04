import { NextResponse } from 'next/server'
import { mutations, queries } from '@life-tracker/db'
import { GoalErrorCode } from './error.types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { summary, description, parentId } = body

    const userId = Number(request.headers.get('x-user-id') || '100000')

    if (!summary) {
      return NextResponse.json(
        { error: '目标名称不能为空', code: GoalErrorCode.INVALID_INPUT },
        { status: 400 }
      )
    }

    if (!parentId) {
      return NextResponse.json(
        { error: '父目标ID不能为空', code: GoalErrorCode.INVALID_INPUT },
        { status: 400 }
      )
    }

    // TODO: 如何继承父目标的颜色？
    // 获取父目标信息，以继承其颜色和前缀
    const parentGoal = await queries.goal.getGoalById(parentId)
    if (!parentGoal) {
      return NextResponse.json(
        { error: '父目标不存在', code: GoalErrorCode.INVALID_INPUT },
        { status: 400 }
      )
    }

    // 创建子目标，继承父目标的颜色和前缀
    const result = await mutations.goal.createGoal(userId, {
      color: parentGoal.color,
      summary,
      description,
      parentId,
      isFirstLevel: false
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('创建子目标失败:', error)
    return NextResponse.json(
      { error: '创建子目标失败', code: GoalErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
