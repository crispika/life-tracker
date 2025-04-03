import { Button } from '@/components/ui/button'
import { queries } from '@life-tracker/db'
import { Plus } from 'lucide-react'
import { formatTimeEstimate, minutesToTimeEstimate } from '../tasks.util'
import { TaskStateDropdown } from './components/TaskStateDropdown/TaskStateDropdown'
import { BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { BreadcrumbItem } from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default async function ProjectDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const taskId = Number((await params).id)
  const task = await queries.task.getTaskDetailById(taskId)
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
      <main className="min-h-72 px-80 py-8 flex justify-between">
        <div className="flex-1 mr-16">
          <div className="flex flex-col gap-4 min-w-80">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">{task.code}</h1>
              <TaskStateDropdown taskId={taskId} />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Plus /> {'task'}
              </Button>
              <Button variant="outline" size="sm">
                <Plus /> {'work log'}
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{task.summary}</h2>
            <p className="text-gray-500">{task.description}</p>
          </div>
          <div className="mt-6 border-b-2 border-gray-200">
            <span className="self-center">Tasks</span>
          </div>
          <div className="mt-6 border-b-2 border-gray-200">
            <span className="self-center">Worklogs</span>
          </div>
        </div>
        <div className="min-w-72 flex-grow-0 bg-slate-100 rounded-lg py-4 px-8 flex gap-6">
          <div>
            <div>Due Date</div>
            <div>Start Date</div>
            <div>Original Estimate</div>
            <div>Time Spent</div>
          </div>
          <div>
            <div className="text-gray-500">
              {task.dueDate.toLocaleDateString()}
            </div>
            <div className="text-gray-500">
              {task.startDate.toLocaleDateString()}
            </div>
            <div className="text-gray-500">
              {formatTimeEstimate(minutesToTimeEstimate(task.originalEstimate))}
            </div>
            <div className="text-gray-500">
              {formatTimeEstimate(minutesToTimeEstimate(task.timeSpent))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
