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
  // 由于调用存储过程，需要格式化日期为MySQL可接受的格式
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'NULL'
    const date = new Date(dateStr)
    return `'${date.toISOString().slice(0, 19).replace('T', ' ')}'`
  }

  try {
    const [result] = await prisma.$queryRawUnsafe<
      [{ task_id: number; code: number }]
    >(
      `CALL create_task(${userId}, '${summary}', '${description}', ${formatDate(startDate)}, ${formatDate(dueDate)}, ${originalEstimateMinutes ?? 'NULL'}, ${goalId})`
    )
    return result.task_id
  } catch (error) {
    console.error('创建任务失败:', error)
    throw new Error(
      '创建任务失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

const updateTaskStateByStateId = async (taskId: number, newStateId: number) => {
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

  try {
    await prisma.uC_TASK.update({
      where: { task_id: taskId },
      data: { state_id: state.state_id }
    })
  } catch (error) {
    console.error('更新任务状态失败:', error)
    throw new Error(
      '更新任务状态失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

const updateTaskStateByName = async (taskId: number, newStateName: string) => {
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
      name: newStateName
    },
    select: { state_id: true }
  })

  if (!state) {
    throw new Error('State not found')
  }

  try {
    await prisma.uC_TASK.update({
      where: { task_id: taskId },
      data: { state_id: state.state_id }
    })
  } catch (error) {
    console.error('更新任务状态失败:', error)
    throw new Error(
      '更新任务状态失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
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

  try {
    await prisma.uC_TASK.update({
      where: { task_id: taskId, user_id: userId },
      data
    })
  } catch (error) {
    console.error('更新任务失败:', error)
    throw new Error(
      '更新任务失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

const deleteTask = async (taskId: number, userId: number) => {
  try {
    await prisma.uC_TASK.delete({
      where: { task_id: taskId, user_id: userId }
    })
  } catch (error) {
    console.error('删除任务失败:', error)
    throw new Error(
      '删除任务失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

export default {
  createTask,
  updateTaskStateByStateId,
  updateTaskStateByName,
  updateTask,
  deleteTask
}
