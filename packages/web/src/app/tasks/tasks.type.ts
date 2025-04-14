import { Goal } from '../goals/goals.type';

export interface TaskState {
  id: number;
  name: string;
  systemDefined: boolean;
}

export interface Task {
  id: number;
  code: number;
  summary: string;
  description: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  originalEstimate: number | null;
  timeSpent: number;
  goalSummary: string;
  goalColor: string;
  prefix: string;
  goalId: number;
  state: TaskState;
}

// 时间估计类型（UI 显示用）
export type TimeEstimate = {
  hours: number;
  minutes: number;
};

export interface TaskState {
  name: string;
  id: number;
  systemDefined: boolean;
}

export interface WorkLog {
  logId: number;
  taskId: number;
  timeSpent: number;
  note: string;
  logDate: Date;
}

export interface ActiveTask extends Task {
  goalPath: string;
  pathedGoals: Pick<Goal, 'id' | 'summary' | 'color'>[];
  rootGoal: Pick<Goal, 'id' | 'summary' | 'color'>;
}
