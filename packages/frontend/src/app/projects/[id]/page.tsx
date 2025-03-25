import { queries, mutations } from '@life-tracker/db'
import { formatTimeEstimate } from '../projects.util'
import { minutesToTimeEstimate } from '../projects.util'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProjectStateDropdown } from './components/ProjectStateDropdown/ProjectStateDropdown'

export default async function ProjectDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const projectId = Number((await params).id)
  const project = await queries.project.getProjectDetailById(projectId)
  return (
    <main className="min-h-72 px-80 py-8 flex justify-between">
      <div className="flex-1 mr-16">
        <div className="flex flex-col gap-4 min-w-80">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">{project.code}</h1>
            <ProjectStateDropdown projectId={projectId} />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">
              <Plus /> {'task'}
            </Button>
            <Button variant="outline" size="sm">
              <Plus /> {'work log'}
            </Button>
          </div>
          <h2 className="text-2xl font-bold">{project.summary}</h2>
          <p className="text-gray-500">{project.description}</p>
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
            {project.dueDate.toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {project.startDate.toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {formatTimeEstimate(
              minutesToTimeEstimate(project.originalEstimate)
            )}
          </div>
          <div className="text-gray-500">
            {formatTimeEstimate(minutesToTimeEstimate(project.timeSpent))}
          </div>
        </div>
      </div>
    </main>
  )
}
