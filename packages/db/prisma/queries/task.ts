import { prisma } from '../../index'

const getTasksByUserId = async (userId: number) => {
  const tasks = await prisma.uC_TASK.findMany({
    where: {
      user_id: userId
    },
    select: {
      task_id: true,
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
          color: true,
          UC_GOAL_PREFIX: {
            select: {
              prefix: true
            }
          }
        }
      },
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  })

  return tasks.map((t) => ({
    id: t.task_id,
    code: t.code,
    summary: t.summary,
    description: t.description,
    startDate: t.start_date,
    dueDate: t.due_date,
    originalEstimate: t.original_estimate_minutes,
    timeSpent: t.time_spent_minutes,
    goalSummary: t.UC_GOAL?.summary,
    goalColor: t.UC_GOAL?.color,
    prefix: t.UC_GOAL?.UC_GOAL_PREFIX?.prefix,
    state: {
      name: t.UC_TASK_STATE.name,
      id: t.UC_TASK_STATE.state_id,
      systemDefined: t.UC_TASK_STATE.system_defined
    }
  }))
}

const getTaskDetailById = async (taskId: number) => {
  const task = await prisma.uC_TASK.findUnique({
    where: {
      task_id: taskId
    },
    select: {
      task_id: true,
      code: true,
      summary: true,
      description: true,
      start_date: true,
      due_date: true,
      original_estimate_minutes: true,
      time_spent_minutes: true,
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      },
      UC_GOAL: {
        select: {
          summary: true,
          color: true,
          UC_GOAL_PREFIX: {
            select: {
              prefix: true
            }
          }
        }
      }
    }
  })
  if (!task) {
    throw new Error('Task not found')
  }
  return {
    id: task.task_id,
    code: task.code,
    summary: task.summary,
    description: task.description,
    startDate: task.start_date,
    dueDate: task.due_date,
    originalEstimate: task.original_estimate_minutes,
    timeSpent: task.time_spent_minutes,
    state: {
      name: task.UC_TASK_STATE.name,
      id: task.UC_TASK_STATE.state_id,
      systemDefined: task.UC_TASK_STATE.system_defined
    },
    prefix: task.UC_GOAL?.UC_GOAL_PREFIX.prefix,
    goalSummary: task.UC_GOAL?.summary,
    goalColor: task.UC_GOAL?.color
  }
}

const getTaskStatesByUserId = async (userId: number) => {
  const states = await prisma.uC_TASK_STATE.findMany({
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

const getTaskCurrentState = async (taskId: number) => {
  const currentState = await prisma.uC_TASK.findUnique({
    where: {
      task_id: taskId
    },
    select: {
      UC_TASK_STATE: {
        select: {
          name: true,
          state_id: true,
          system_defined: true
        }
      }
    }
  })

  if (!currentState) {
    throw new Error('Task state not found')
  }

  return {
    name: currentState.UC_TASK_STATE.name,
    id: currentState.UC_TASK_STATE.state_id,
    systemDefined: currentState.UC_TASK_STATE.system_defined
  }
}

export default {
  getTasksByUserId,
  getTaskDetailById,
  getTaskStatesByUserId,
  getTaskCurrentState
}
