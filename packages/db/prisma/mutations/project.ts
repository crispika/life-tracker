import { prisma } from '../../index'

const updateProjectState = async (projectId: number, newStateId: number) => {
  const project = await prisma.uC_PROJECT.findUnique({
    where: { project_id: projectId },
    select: { user_id: true }
  })

  if (!project) {
    throw new Error('Project not found')
  }

  const state = await prisma.uC_PROJECT_STATE.findFirst({
    where: {
      user_id: project.user_id,
      state_id: newStateId
    }
  })

  if (!state) {
    throw new Error('State not found')
  }

  await prisma.uC_PROJECT.update({
    where: { project_id: projectId },
    data: { state_id: state.state_id }
  })
}

export default {
  updateProjectState
}
