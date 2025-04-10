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
  updateData: Partial<{
    summary: string
    description: string
    startDate: string | null
    dueDate: string | null
    originalEstimateMinutes: number | null
  }>
) => {
  const task = await prisma.uC_TASK.findUnique({
    where: { task_id: taskId, user_id: userId }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  // 构建更新数据对象，只包含传入的字段
  const data: Record<string, any> = {}

  if (updateData.summary !== undefined) {
    data.summary = updateData.summary
  }
  if (updateData.description !== undefined) {
    data.description = updateData.description
  }
  if (updateData.startDate !== undefined) {
    // 对于Prisma，我们需要传入Date对象或ISO字符串
    data.start_date = updateData.startDate
      ? new Date(updateData.startDate)
      : null
  }
  if (updateData.dueDate !== undefined) {
    // 对于Prisma，我们需要传入Date对象或ISO字符串
    data.due_date = updateData.dueDate ? new Date(updateData.dueDate) : null
  }
  if (updateData.originalEstimateMinutes !== undefined) {
    data.original_estimate_minutes = updateData.originalEstimateMinutes
  }

  await prisma.uC_TASK.update({
    where: { task_id: taskId, user_id: userId },
    data
  })
}

export default {
  createTask,
  updateTaskState,
  updateTask
}
