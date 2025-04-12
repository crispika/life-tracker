import { NextResponse } from 'next/server';
import { TaskErrorCode } from '../../../error.types';
import { mutations } from '@life-tracker/db';

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ taskId: string; logId: string }> }
) => {
  const { logId } = await params;
  const userId = Number(request.headers.get('x-user-id') || '100000');

  const { timeSpent, note, logDate } = await request.json();

  if (!timeSpent || !logDate) {
    return NextResponse.json(
      { error: 'Missing required fields', code: TaskErrorCode.INVALID_INPUT },
      { status: 400 }
    );
  }

  try {
    await mutations.task.updateTaskWorklog(
      Number(logId),
      userId,
      timeSpent,
      note,
      logDate
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update task worklog:', error);
    return NextResponse.json(
      {
        error: 'Failed to update task worklog',
        code: TaskErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ taskId: string; logId: string }> }
) => {
  const { logId } = await params;
  const userId = Number(request.headers.get('x-user-id') || '100000');

  try {
    await mutations.task.deleteTaskWorklog(Number(logId), userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete task worklog:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete task worklog',
        code: TaskErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    );
  }
};
