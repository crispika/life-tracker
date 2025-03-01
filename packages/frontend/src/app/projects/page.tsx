import {
  ProjectGoal,
  Project,
  generateProjectCode,
  formatTimeEstimate,
  minutesToTimeEstimate
} from './projects.type'

export default async function Projects() {
  return (
    <main className="min-h-screen px-24 pt-8">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">项目列表</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">{project.summary}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {project.startDate.toLocaleDateString()} -{' '}
                  {project.dueDate.toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  {formatTimeEstimate(
                    minutesToTimeEstimate(project.originalEstimateMinutes)
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

// 模拟项目数据
export const mockProjects: Project[] = [
  {
    id: '1',
    goal: ProjectGoal.WORK,
    projectCode: generateProjectCode(ProjectGoal.WORK), // 生成 WK-001
    summary: '开发新的用户管理系统',
    description:
      '设计并实现一个全新的用户管理系统，包括认证、授权和用户资料管理功能。',
    startDate: new Date('2023-11-01'),
    dueDate: new Date('2023-12-15'),
    originalEstimateMinutes: 6960, // 2w 3d 4h 0m
    timeSpentMinutes: 8070, // 2w 5d 6h 30m
    color: '#4A6FDC'
  },
  {
    id: '2',
    goal: ProjectGoal.HEALTH,
    projectCode: generateProjectCode(ProjectGoal.HEALTH), // 生成 HT-001
    summary: '每周跑步计划',
    description: '每周跑步三次，每次至少30分钟，提高心肺功能和身体素质。',
    startDate: new Date('2023-10-15'),
    dueDate: new Date('2024-01-15'),
    originalEstimateMinutes: 360, // 0w 0d 6h 0m
    timeSpentMinutes: 285, // 0w 0d 4h 45m
    color: '#36B37E'
  },
  {
    id: '3',
    goal: ProjectGoal.RELAX,
    projectCode: generateProjectCode(ProjectGoal.RELAX), // 生成 RX-001
    summary: '阅读《三体》三部曲',
    description: '在闲暇时间阅读刘慈欣的科幻小说《三体》三部曲，拓展思维。',
    startDate: new Date('2023-11-10'),
    dueDate: new Date('2024-02-10'),
    originalEstimateMinutes: 7200, // 0w 5d 0h 0m (5天)
    timeSpentMinutes: 4575, // 0w 3d 2h 15m
    color: '#FF8B00'
  },
  {
    id: '4',
    goal: ProjectGoal.WORK,
    projectCode: generateProjectCode(ProjectGoal.WORK), // 生成 WK-002
    summary: '优化网站性能',
    description: '分析并优化公司网站的加载速度和响应时间，提升用户体验。',
    startDate: new Date('2023-12-01'),
    dueDate: new Date('2023-12-20'),
    originalEstimateMinutes: 7200, // 0w 5d 0h 0m (5天)
    timeSpentMinutes: 6200, // 0w 4d 3h 20m
    color: '#6554C0'
  },
  {
    id: '5',
    goal: ProjectGoal.HEALTH,
    projectCode: generateProjectCode(ProjectGoal.HEALTH), // 生成 HT-002
    summary: '健康饮食计划',
    description: '制定并遵循健康饮食计划，减少加工食品摄入，增加蔬果摄入量。',
    startDate: new Date('2023-11-20'),
    dueDate: new Date('2024-02-20'),
    originalEstimateMinutes: 10080, // 1w 0d 0h 0m
    timeSpentMinutes: 7200, // 0w 5d 0h 0m
    color: '#00C7E6'
  },
  {
    id: '6',
    goal: ProjectGoal.RELAX,
    projectCode: generateProjectCode(ProjectGoal.RELAX), // 生成 RX-002
    summary: '学习弹吉他',
    description: '每周练习吉他至少3小时，学习基本和弦和简单歌曲。',
    startDate: new Date('2023-10-01'),
    dueDate: new Date('2024-04-01'),
    originalEstimateMinutes: 2880, // 0w 0d 48h 0m
    timeSpentMinutes: 1935, // 0w 0d 32h 15m
    color: '#FF5630'
  },
  {
    id: '7',
    goal: ProjectGoal.WORK,
    projectCode: generateProjectCode(ProjectGoal.WORK), // 生成 WK-003
    summary: '市场调研报告',
    description: '对竞争对手产品进行全面分析，编写详细的市场调研报告。',
    startDate: new Date('2023-12-05'),
    dueDate: new Date('2024-01-10'),
    originalEstimateMinutes: 12960, // 1w 2d 0h 0m
    timeSpentMinutes: 10350, // 1w 0d 4h 30m
    color: '#8777D9'
  },
  {
    id: '8',
    goal: ProjectGoal.HEALTH,
    projectCode: generateProjectCode(ProjectGoal.HEALTH), // 生成 HT-003
    summary: '冥想练习',
    description: '每天进行15分钟的冥想练习，提高专注力和减轻压力。',
    startDate: new Date('2023-11-15'),
    dueDate: new Date('2024-02-15'),
    originalEstimateMinutes: 900, // 0w 0d 15h 0m
    timeSpentMinutes: 765, // 0w 0d 12h 45m
    color: '#00B8D9'
  },
  {
    id: '9',
    goal: ProjectGoal.RELAX,
    projectCode: generateProjectCode(ProjectGoal.RELAX), // 生成 RX-003
    summary: '周末短途旅行',
    description: '计划并执行三次周末短途旅行，探索周边城市和自然景观。',
    startDate: new Date('2023-12-10'),
    dueDate: new Date('2024-03-10'),
    originalEstimateMinutes: 8640, // 0w 6d 0h 0m
    timeSpentMinutes: 5760, // 0w 4d 0h 0m
    color: '#FFC400'
  },
  {
    id: '10',
    goal: ProjectGoal.WORK,
    projectCode: generateProjectCode(ProjectGoal.WORK), // 生成 WK-004
    summary: '团队建设活动',
    description: '组织并主持团队建设活动，增强团队凝聚力和协作能力。',
    startDate: new Date('2023-12-15'),
    dueDate: new Date('2023-12-16'),
    originalEstimateMinutes: 1680, // 0w 1d 4h 0m
    timeSpentMinutes: 1830, // 0w 1d 6h 30m
    color: '#57D9A3'
  }
]
