import { prisma } from '../../index'

export const createTask = async (
  userId: number,
  goalId: number,
  summary: string,
  description: string,
  startDate: string | null,
  dueDate: string | null,
  originalEstimateMinutes: number | null
) => {
  // 格式化日期为MySQL可接受的格式
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'NULL'
    const date = new Date(dateStr)
    return `'${date.toISOString().slice(0, 19).replace('T', ' ')}'`
  }

  const [result] = await prisma.$queryRawUnsafe<
    [{ task_id: number; code: number }]
  >(
    `CALL create_task(${userId}, '${summary}', '${description}', ${formatDate(startDate)}, ${formatDate(dueDate)}, ${originalEstimateMinutes ?? 'NULL'}, ${goalId})`
  )
  return result.task_id
}

const updateTaskState = async (taskId: number, newStateId: number) => {
  const task = await prisma.uC_TASK.findUnique({
    where: { task_id: taskId },
    select: { user_id: true }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  const state = await prisma.uC_TASK_STATE.findFirst({
    where: {
      user_id: task.user_id,
      state_id: newStateId
    }
  })

  if (!state) {
    throw new Error('State not found')
  }

  await prisma.uC_TASK.update({
    where: { task_id: taskId },
    data: { state_id: state.state_id }
  })
}

const updateTask = async (
  taskId: number,
  userId: number,
  {
    summary,
    description,
    startDate,
    dueDate,
    originalEstimateMinutes
  }: {
    summary: string
    description: string
    startDate: string | null
    dueDate: string | null
    originalEstimateMinutes: number | null
  }
) => {
  const task = await prisma.uC_TASK.findUnique({
    where: { task_id: taskId, user_id: userId }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  await prisma.uC_TASK.update({
    where: { task_id: taskId, user_id: userId },
    data: {
      summary,
      description,
      start_date: startDate,
      due_date: dueDate,
      original_estimate_minutes: originalEstimateMinutes
    }
  })
}

export default {
  createTask,
  updateTaskState,
  updateTask
}
