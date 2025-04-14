export interface Goal {
  id: number;
  summary: string;
  description: string | null;
  parentId: number | null;
  color: string;
  isFirstLevel: boolean;
  code: number | null;
  prefix: GoalPrefix;
  state: GoalState;
  children: Goal[];
}

export interface GoalState {
  id: number;
  name: string;
}

export interface GoalPrefix {
  id: number;
  name: string;
}

export type LifeGoal = {
  id: number;
  summary: string;
  sidenote: string | null;
};
