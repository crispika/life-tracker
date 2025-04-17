import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { TimeProgressBar } from '@/components/ui/progress-bar';
import { queries } from '@life-tracker/db';
import { format } from 'date-fns';
import { Calendar, Clock, Target } from 'lucide-react';
import { Task, WorkLog } from '../tasks.type';
import { formatTimeEstimate, minutesToTimeEstimate } from '../tasks.util';
import { TaskStateDropdown } from './components/TaskStateDropdown/TaskStateDropdown';
import { WorkLogs } from './components/WorkLogs';

export default async function TaskDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const taskId = Number((await params).id);
  const task: Task = await queries.task.getTaskDetailById(taskId);
  const workLogs: WorkLog[] = await queries.task.getTaskWorklogs(
    taskId,
    100000
  );

  // 计算时间进度
  const timeProgress = task.originalEstimate
    ? Math.round((task.timeSpent / task.originalEstimate) * 100)
    : 100;

  // 获取prefix的第一个字符（支持中文）
  const firstChar = Array.from(task.prefix)[0] || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/tasks"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Tasks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-64 text-gray-900">
                  {task.summary}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* 任务标识和状态 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: task.goalColor,
                      fontSize: firstChar.match(/[\u4e00-\u9fa5]/)
                        ? '0.875rem'
                        : '1rem'
                    }}
                  >
                    <span className="font-medium text-white">{firstChar}</span>
                  </Badge>
                  <div className="text-sm font-medium text-gray-600">
                    {`${task.prefix} - ${task.code}`}
                  </div>
                </div>
                <TaskStateDropdown taskId={taskId} />
              </div>

              {/* 任务标题和描述 */}
              <div>
                <h2 className="text-xl font-semibold my-4">{task.summary}</h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {task.description || '暂无描述'}
                </p>
              </div>
            </div>

            {/* 次要信息 */}
            <div
              className="grid grid-cols-2 md:grid-cols-12 gap-6 py-4 px-6 bg-gray-50 rounded-lg mt-8"
              style={{ backgroundColor: `${task.goalColor}07` }}
            >
              <div className="col-span-2 md:col-span-6">
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  所属目标
                </div>
                <div className="truncate" title={task.goalSummary}>
                  {task.goalSummary}
                </div>
              </div>
              <div className="md:col-span-3 md:border-l md:pl-6">
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>开始时间</span>
                </div>
                <div className="font-mono">
                  {task.startDate
                    ? format(new Date(task.startDate), 'yyyy/MM/dd')
                    : ' - '}
                </div>
              </div>
              <div className="md:col-span-3 md:border-l md:pl-6">
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>截止时间</span>
                </div>
                <div className="font-mono">
                  {task.dueDate
                    ? format(new Date(task.dueDate), 'yyyy/MM/dd')
                    : '-'}
                </div>
              </div>
            </div>

            {/* 任务进度 */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">预计耗时</span>
                  <span className="font-medium">
                    {task.originalEstimate
                      ? formatTimeEstimate(
                          minutesToTimeEstimate(task.originalEstimate)
                        )
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">已用时间</span>
                  <span className="font-medium">
                    {formatTimeEstimate(minutesToTimeEstimate(task.timeSpent))}
                  </span>
                </div>
              </div>
              <div>
                <TimeProgressBar
                  timeSpent={task.timeSpent}
                  originalEstimate={task.originalEstimate}
                  showTooltip={false}
                  width={'full'}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {timeProgress}%
                </div>
              </div>
            </div>

            {/* 工作日志区域 */}
            <WorkLogs taskId={taskId} workLogs={workLogs} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
