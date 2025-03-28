import { prisma } from '../../index'

const getProjectsByUserId = async (userId: number) => {
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
          name: true,
          state_id: true,
          system_defined: true
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
    state: {
      name: p.UC_PROJECT_STATE.name,
      id: p.UC_PROJECT_STATE.state_id,
      systemDefined: p.UC_PROJECT_STATE.system_defined
    }
  }))
}

const getProjectDetailById = async (projectId: number) => {
  const project = await prisma.uC_PROJECT.findUnique({
    where: {
      project_id: projectId
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
      UC_PROJECT_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  })
  if (!project) {
    throw new Error('Project not found')
  }
  return {
    id: project.project_id,
    code: project.code,
    summary: project.summary,
    description: project.description,
    startDate: project.start_date,
    dueDate: project.due_date,
    originalEstimate: project.original_estimate_minutes,
    timeSpent: project.time_spent_minutes,
    state: {
      name: project.UC_PROJECT_STATE.name,
      id: project.UC_PROJECT_STATE.state_id,
      systemDefined: project.UC_PROJECT_STATE.system_defined
    }
  }
}

const getProjectStatesByUserId = async (userId: number) => {
  const states = await prisma.uC_PROJECT_STATE.findMany({
    where: {
      user_id: userId
    },
    select: {
      name: true,
      state_id: true,
      system_defined: true
    }
  })
  return states.map((state) => ({
    name: state.name,
    id: state.state_id,
    systemDefined: state.system_defined
  }))
}

const getProjectCurrentState = async (projectId: number) => {
  const currentState = await prisma.uC_PROJECT.findUnique({
    where: {
      project_id: projectId
    },
    select: {
      UC_PROJECT_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  })

  if (!currentState) {
    throw new Error('Project state not found')
  }

  return {
    name: currentState.UC_PROJECT_STATE.name,
    id: currentState.UC_PROJECT_STATE.state_id,
    systemDefined: currentState.UC_PROJECT_STATE.system_defined
  }
}

export default {
  getProjectsByUserId,
  getProjectDetailById,
  getProjectStatesByUserId,
  getProjectCurrentState
}
