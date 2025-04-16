import { queries } from '@life-tracker/db';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SetLifeGoalDialog } from './components/SetLifeGoalDialog';
import { GoalsTree } from './components/GoalTree';

export default async function Goals() {
  const lifeGoal = await queries.goal.getUserUltimateGoal(100000);
  const goals = await queries.goal.getUserGoalTree(100000);
  const tasks = await queries.task.getTasksByUserId(100000);
  return (
    <>
      <header className="flex bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Goals</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
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
    </>
  );
}
