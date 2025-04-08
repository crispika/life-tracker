import { NextResponse } from 'next/server'
import { mutations } from '@life-tracker/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { summary, sidenote } = body

    const userId = Number(request.headers.get('x-user-id') || '100000')

    if (!summary) {
      return NextResponse.json({ error: '目标概述不能为空' }, { status: 400 })
    }

    const result = await mutations.goal.upsertUltimateGoal(userId, {
      summary,
      sidenote
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('设置人生目标失败:', error)
    return NextResponse.json({ error: '设置人生目标失败' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { summary, sidenote } = body
    const userId = Number(request.headers.get('x-user-id') || '100000')
    if (!summary) {
      return NextResponse.json({ error: '目标概述不能为空' }, { status: 400 })
    }

    const result = await mutations.goal.upsertUltimateGoal(userId, {
      summary,
      sidenote
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('更新人生目标失败:', error)
  }
}
