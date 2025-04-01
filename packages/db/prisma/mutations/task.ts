import { prisma } from '../../index'

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

export default {
  updateTaskState
}
