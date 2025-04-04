import { prisma } from '../../index'

async function upsertUltimateGoal(
  userId: number,
  data: {
    summary: string
    sidenote?: string | null
  }
) {
  try {
    return await prisma.uC_ULTIMATE_GOAL.upsert({
      where: {
        user_id: userId
      },
      create: {
        user_id: userId,
        summary: data.summary,
        sidenote: data.sidenote
      },
      update: {
        summary: data.summary,
        sidenote: data.sidenote
      }
    })
  } catch (error) {
    throw new Error(
      '创建或更新终极目标失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

async function createGoal(
  userId: number,
  data: {
    color: string
    summary: string
    description?: string | null
    parentId?: number | null
    prefix: string
  }
) {
  try {
    const result = await prisma.$queryRaw`
      CALL create_goal(
        ${userId},
        ${data.color},
        ${data.summary},
        ${data.description},
        ${data.parentId},
        ${data.prefix},
        @goal_id,
        @prefix_id
      )
    `
    return result
  } catch (error) {
    throw new Error(
      '创建目标失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

export const goalMutations = {
  upsertUltimateGoal,
  createGoal
}
