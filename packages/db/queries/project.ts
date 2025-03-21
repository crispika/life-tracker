import { prisma } from '../index'

export const projectQueries = {
  getProjectsByUserId: async (userId: number) => {
    const projects = await prisma.uC_PROJECT.findMany({
      where: {
        user_id: userId
      },
      select: {
        project_id: true,
        code: true,
        summary: true,
        description: true,
        start_date: true,
        due_date: true,
        original_estimate_minutes: true,
        time_spent_minutes: true,
        UC_GOAL: {
          select: {
            summary: true,
            color: true
          }
        },
        UC_PROJECT_STATE: {
          select: {
            name: true
          }
        }
      }
    })

    return projects.map((p) => ({
      id: p.project_id,
      code: p.code,
      summary: p.summary,
      description: p.description,
      startDate: p.start_date,
      dueDate: p.due_date,
      originalEstimate: p.original_estimate_minutes,
      timeSpent: p.time_spent_minutes,
      goalSummary: p.UC_GOAL?.summary,
      goalColor: p.UC_GOAL?.color,
      state: p.UC_PROJECT_STATE.name
    }))
  }
}
