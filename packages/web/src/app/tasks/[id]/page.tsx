import { Button } from '@/components/ui/button'
import { queries } from '@life-tracker/db'
import { Plus, Clock, Calendar, Target } from 'lucide-react'
import { formatTimeEstimate, minutesToTimeEstimate } from '../tasks.util'
import { TaskStateDropdown } from './components/TaskStateDropdown/TaskStateDropdown'
import {
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { BreadcrumbItem } from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Task } from '../tasks.type'
import { format } from 'date-fns'

export default async function TaskDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const taskId = Number((await params).id)
  const task: Task = await queries.task.getTaskDetailById(taskId)

  // 计算时间进度
  const timeProgress = task.originalEstimate
    ? Math.min(Math.round((task.timeSpent / task.originalEstimate) * 100), 100)
    : 0

  // 获取prefix的第一个字符（支持中文）
  const firstChar = Array.from(task.prefix)[0] || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-64">
                {task.summary}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
            <div className="grid grid-cols-12 gap-6 py-4 px-6 bg-gray-50 rounded-lg mt-8">
              <div className="col-span-6">
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  所属目标
                </div>
                <div className="truncate" title={task.goalSummary}>
                  {task.goalSummary}
                </div>
              </div>
              <div className="col-span-3 border-l pl-6">
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
              <div className="col-span-3 border-l pl-6">
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
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${timeProgress}%`,
                      backgroundColor: task.goalColor || 'rgb(var(--primary))'
                    }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {timeProgress}%
                </div>
              </div>
            </div>

            {/* 工作日志区域 */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-semibold">工作日志</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {/* 暂无数据状态 */}
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>暂无工作日志记录</p>
                  <p className="text-sm mt-1">
                    点击右上角的&quot;+&quot;添加工作日志
                  </p>
                </div>

                {/* 工作日志列表 - 先隐藏，等有数据时再显示 */}
                {/* <div className="relative pl-6 border-l-2 border-gray-200">
                  <div className="mb-6">
                    <div className="absolute -left-2 w-4 h-4 rounded-full bg-white border-2 border-gray-200"></div>
                    <div className="bg-white rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">今天完成了功能开发</div>
                        <div className="text-sm text-gray-500">2h 30m</div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        完成了主要功能的开发和测试工作
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        2024-01-20 14:30
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
