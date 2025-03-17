import { PrismaClient } from '@prisma/client'

export const projectQueries = {
  getProjectsByUserId: async (prisma: PrismaClient, userId: number) => {
    const projects = await prisma.uC_PROJECT.findMany({
      where: {
        user_id: userId
      },
      select: {
        project_id: true,
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

    return projects.map((project) => ({
      ...project,
      goalSummary: project.UC_GOAL?.summary,
      goalColor: project.UC_GOAL?.color,
      state: project.UC_PROJECT_STATE.name
    }))
  }
}
