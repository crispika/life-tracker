import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { queries } from '@life-tracker/db';
import { CheckCircle2, NotebookPenIcon, Target } from 'lucide-react';
import Link from 'next/link';
import { Goal } from '../goals/goals.type';
import { TaskCard } from './components/TaskCard';
import { ActiveTask } from './tasks.type';

interface GroupedTask {
  goal: Pick<Goal, 'id' | 'summary' | 'color'>;
  taskGroups: Record<string, ActiveTask[]>;
}

export default async function Tasks() {
  const userId = 100000; // 硬编码的演示用户ID

  const activeTasks: ActiveTask[] =
    await queries.task.getActiveTasksWithGoalPath(userId);

  const firstLevelGoalMap = new Map<
    number,
    Pick<Goal, 'id' | 'summary' | 'color'>
  >();

  const tasksGroupByFirstLevelGoal = activeTasks.reduce<
    Record<string, ActiveTask[]>
  >((acc, task) => {
    if (!acc[task.rootGoal.id]) {
      acc[task.rootGoal.id] = [];
      firstLevelGoalMap.set(task.rootGoal.id, task.rootGoal);
    }
    acc[task.rootGoal.id].push(task);
    return acc;
  }, {});

  const groupedTasks = Object.entries(tasksGroupByFirstLevelGoal)
    .map(([goalId, tasks]): GroupedTask | null => {
      const firstLevelGoal = firstLevelGoalMap.get(Number(goalId));
      if (!firstLevelGoal) return null;

      const taskWithSamePath = tasks.reduce<Record<string, ActiveTask[]>>(
        (acc, task) => {
          const path = task.goalPath;
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(task);
          return acc;
        },
        {}
      );

      return {
        goal: firstLevelGoal,
        taskGroups: taskWithSamePath
      };
    })
    .filter((group): group is GroupedTask => group !== null);

  return (
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">今日任务</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">进行中的任务</h1>
            <p className="text-gray-500">
              显示进行中或开始日期在今天之前的任务
            </p>
          </div>

          {groupedTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border">
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-gray-300" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-700">
                    没有进行中的任务
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    所有任务都已完成或尚未开始。你可以去规划页面创建或开始一个任务。
                  </p>
                </div>
                <div className="flex gap-4 mt-4">
                  <Link
                    href="/goals"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <NotebookPenIcon className="w-4 h-4" />
                    <span>去规划</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedTasks.map(({ goal, taskGroups }) => (
                <div
                  key={goal.id}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                  style={{
                    borderLeftColor: goal.color,
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">{goal.summary}</span>
                  </div>

                  <div className="mt-4 space-y-6">
                    {Object.entries(taskGroups).map(([path, tasks]) => (
                      <div key={path} className="space-y-4">
                        {path && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {tasks[0].pathedGoals.map(
                              (
                                g: Pick<Goal, 'id' | 'summary' | 'color'>,
                                index: number
                              ) => (
                                <span key={g.id} className="flex items-center">
                                  {index > 0 && <span className="mx-2">/</span>}
                                  <span>{g.summary}</span>
                                </span>
                              )
                            )}
                          </div>
                        )}
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                          {tasks.map((task: ActiveTask) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
