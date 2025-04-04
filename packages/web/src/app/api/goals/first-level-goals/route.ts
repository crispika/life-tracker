import { NextResponse } from 'next/server'
import { mutations } from '@life-tracker/db'
import { GoalErrorCode } from '../error.types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { color, summary, description, parentId, prefix, isFirstLevel } = body

    const userId = Number(request.headers.get('x-user-id') || '100000')

    if (!summary || !color) {
      return NextResponse.json(
        {
          error: '必填字段不能为空',
          code: GoalErrorCode.INVALID_INPUT
        },
        { status: 400 }
      )
    }

    if (isFirstLevel && !prefix) {
      return NextResponse.json(
        {
          error: '一级目标必须提供前缀',
          code: GoalErrorCode.INVALID_INPUT
        },
        { status: 400 }
      )
    }

    if (!isFirstLevel && !parentId) {
      return NextResponse.json(
        {
          error: '子目标必须提供父目标ID',
          code: GoalErrorCode.INVALID_INPUT
        },
        { status: 400 }
      )
    }

    const result = await mutations.goal.createGoal(userId, {
      color,
      summary,
      description,
      parentId,
      prefix,
      isFirstLevel
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('创建目标失败:', error)
    const errorMessage = error instanceof Error ? error.message : '创建目标失败'

    //TODO 优化DB PROC，是否应该抛出错误码，而非直接用string来判断？
    // 检查是否是前缀已存在的错误
    if (errorMessage.includes('该前缀已被使用')) {
      return NextResponse.json(
        {
          error: '该前缀已被使用',
          code: GoalErrorCode.PREFIX_EXISTS
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: GoalErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    )
  }
}
