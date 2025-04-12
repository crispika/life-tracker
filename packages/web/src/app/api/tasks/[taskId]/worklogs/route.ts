import { mutations, queries } from '@life-tracker/db';
import { NextResponse } from 'next/server';
import { TaskErrorCode } from '../../error.types';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) => {
  const taskId = Number((await params).taskId);
  const userId = Number(request.headers.get('x-user-id') || '100000');

  try {
    const worklogs = await queries.task.getTaskWorklogs(taskId, userId);
    return NextResponse.json(worklogs);
  } catch (error) {
    console.error('Failed to get task worklogs:', error);
    return NextResponse.json(
      {
        error: 'Failed to get task worklogs',
        code: TaskErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    );
  }
};

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) => {
  const taskId = Number((await params).taskId);
  const userId = Number(request.headers.get('x-user-id') || '100000');

  const { timeSpent, note, logDate } = await request.json();

  if (!timeSpent || !logDate) {
    return NextResponse.json(
      { error: 'Missing required fields', code: TaskErrorCode.INVALID_INPUT },
      { status: 400 }
    );
  }

  try {
    await mutations.task.addTaskWorklog(
      taskId,
      userId,
      timeSpent,
      note,
      logDate
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to add task worklog:', error);
    return NextResponse.json(
      {
        error: 'Failed to add task worklog',
        code: TaskErrorCode.INTERNAL_ERROR
      },
      { status: 500 }
    );
  }
};
