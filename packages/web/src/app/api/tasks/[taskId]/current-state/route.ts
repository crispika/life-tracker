import { NextResponse } from 'next/server';
import { queries, mutations } from '@life-tracker/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const taskId = Number((await params).taskId);
    const state = await queries.task.getTaskCurrentState(taskId);
    return NextResponse.json(state);
  } catch (error) {
    console.error('Error fetching task current state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task current state' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const taskId = Number((await params).taskId);
    const { stateId, stateName } = await request.json();
    if (stateId) {
      await mutations.task.updateTaskStateByStateId(taskId, stateId);
    } else if (stateName) {
      await mutations.task.updateTaskStateByName(taskId, stateName);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task state:', error);
    return NextResponse.json(
      { error: 'Failed to update task state' },
      { status: 500 }
    );
  }
}
