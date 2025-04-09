import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { queries } from '@life-tracker/db'
import Link from 'next/link'
import TableHeader from './components/TableHeader'
import { Task } from './tasks.type'
import {
  formatTimeEstimate,
  getTaskStateName,
  minutesToTimeEstimate,
  sortTasks
} from './tasks.util'

export default async function Tasks({
  searchParams
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>
}) {
  const { sort, dir } = await searchParams
  const userId = 100000 // 硬编码的演示用户ID

  const tasks: Task[] = await queries.task.getTasksByUserId(userId)

  // 处理日期字段
  const processedTasks: Task[] = tasks.map((task) => ({
    ...task,
    startDate: new Date(task.startDate),
    dueDate: new Date(task.dueDate)
  }))

  // 排序任务
  const sortedTasks = sortTasks(processedTasks, sort, dir)

  return (
    <>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Tasks</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="min-h-screen px-24 py-8">
        {/* 表头 - 使用客户端组件 */}
        <TableHeader currentSort={sort} currentDirection={dir} />

        {/* 任务列表 */}
        <div className="space-y-1">
          {sortedTasks.map((task) => (
            <Link
              href={`/tasks/${task.id}`}
              key={task.id}
              className="flex items-center p-3 bg-white rounded-none border-b last:rounded-b-lg hover:bg-gray-50 transition-colors"
            >
              <Badge
                className="w-6 h-4 mr-6"
                style={{ backgroundColor: task.goalColor || '#808080' }}
              />
              <div className="w-24 font-mono text-sm">{`${task.prefix}-${task.code}`}</div>
              <div className="w-32 text-sm">
                <Badge variant="outline" className="font-normal">
                  {task.goalSummary || '无目标'}
                </Badge>
              </div>
              <div className="w-24 text-sm">
                <Badge variant="secondary" className="font-normal">
                  {getTaskStateName(task.state.systemDefined, task.state.name)}
                </Badge>
              </div>
              <div className="flex-1 font-medium truncate">{task.summary}</div>
              <div className="w-28 text-sm text-gray-500 px-1">
                {task.startDate.toLocaleDateString()}
              </div>
              <div className="w-28 text-sm text-gray-500 px-1">
                {task.dueDate.toLocaleDateString()}
              </div>
              <div className="w-24 text-sm text-gray-500 px-1">
                {formatTimeEstimate(
                  minutesToTimeEstimate(task.originalEstimate)
                )}
              </div>
              <div className="w-24 text-sm text-gray-500 px-1">
                {formatTimeEstimate(minutesToTimeEstimate(task.timeSpent))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
