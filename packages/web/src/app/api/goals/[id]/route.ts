import { NextResponse } from 'next/server';
import { mutations } from '@life-tracker/db';
import { GoalErrorCode } from '../error.types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const goalId = Number((await params).id);
  const userId = Number(request.headers.get('x-user-id') || '100000');

  const { summary, description } = await request.json();

  if (!summary && !description) {
    return NextResponse.json(
      {
        error: '待更新的目标摘要或描述不能为空',
        code: GoalErrorCode.INVALID_INPUT
      },
      { status: 400 }
    );
  }
  try {
    await mutations.goal.updateGoalBasicInfo(
      userId,
      goalId,
      summary,
      description
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新目标失败:', error);
    return NextResponse.json(
      { error: '更新目标失败', code: GoalErrorCode.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const goalId = Number((await params).id);
    const userId = Number(request.headers.get('x-user-id') || '100000');

    if (isNaN(goalId)) {
      return NextResponse.json(
        { error: '无效的目标ID', code: GoalErrorCode.INVALID_INPUT },
        { status: 400 }
      );
    }

    console.log(`API: 尝试删除目标: userId=${userId}, goalId=${goalId}`);

    await mutations.goal.deleteGoalWithAllChildren(userId, goalId);
    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('删除目标失败:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '删除目标失败',
        code: GoalErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    );
  }
}
