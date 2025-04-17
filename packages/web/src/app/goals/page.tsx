import { queries } from '@life-tracker/db';
import { GoalsTree } from './components/GoalTree';
import { SetLifeGoalDialog } from './components/SetLifeGoalDialog';

export default async function Goals() {
  const lifeGoal = await queries.goal.getUserUltimateGoal(100000);
  const goals = await queries.goal.getUserGoalTree(100000);
  const tasks = await queries.task.getTasksByUserId(100000);
  return (
    <>
      <main className=" bg-gray-50">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] max-w-[105rem] mx-auto">
          {lifeGoal ? (
            <GoalsTree lifeGoal={lifeGoal} goals={goals} tasks={tasks} />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold">你还没有设置人生目标</h2>
              <p className="text-muted-foreground">
                请先设置你的人生目标，然后才能开始规划具体的子目标
              </p>
              <SetLifeGoalDialog />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
