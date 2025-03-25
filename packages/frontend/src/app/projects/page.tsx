import { Badge } from '@/components/ui/badge'
import { queries } from '@life-tracker/db'
import TableHeader from './components/TableHeader'
import { Project } from './projects.type'
import {
  formatTimeEstimate,
  minutesToTimeEstimate,
  sortProjects
} from './projects.util'
import Link from 'next/link'
import { getProjectStateName } from './project.util'

export default async function Projects({
  searchParams
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>
}) {
  const { sort, dir } = await searchParams
  const userId = 100000 // 硬编码的演示用户ID

  const projects: Project[] = await queries.project.getProjectsByUserId(userId)

  // 处理日期字段
  const processedProjects: Project[] = projects.map((project) => ({
    ...project,
    startDate: new Date(project.startDate),
    dueDate: new Date(project.dueDate)
  }))

  // 排序项目
  const sortedProjects = sortProjects(processedProjects, sort, dir)

  return (
    <main className="min-h-screen px-24 py-8">
      {/* 表头 - 使用客户端组件 */}
      <TableHeader currentSort={sort} currentDirection={dir} />

      {/* 项目列表 */}
      <div className="space-y-1">
        {sortedProjects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="flex items-center p-3 bg-white rounded-none border-b last:rounded-b-lg hover:bg-gray-50 transition-colors"
          >
            <Badge
              className="w-6 h-4 mr-6"
              style={{ backgroundColor: project.goalColor || '#808080' }}
            />
            <div className="w-24 font-mono text-sm">{project.code}</div>
            <div className="w-32 text-sm">
              <Badge variant="outline" className="font-normal">
                {project.goalSummary || '无目标'}
              </Badge>
            </div>
            <div className="w-24 text-sm">
              <Badge variant="secondary" className="font-normal">
                {getProjectStateName(
                  project.state.systemDefined,
                  project.state.name
                )}
              </Badge>
            </div>
            <div className="flex-1 font-medium truncate">{project.summary}</div>
            <div className="w-28 text-sm text-gray-500 px-1">
              {project.startDate.toLocaleDateString()}
            </div>
            <div className="w-28 text-sm text-gray-500 px-1">
              {project.dueDate.toLocaleDateString()}
            </div>
            <div className="w-24 text-sm text-gray-500 px-1">
              {formatTimeEstimate(
                minutesToTimeEstimate(project.originalEstimate)
              )}
            </div>
            <div className="w-24 text-sm text-gray-500 px-1">
              {formatTimeEstimate(minutesToTimeEstimate(project.timeSpent))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
