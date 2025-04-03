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

export const goalMutations = {
  upsertUltimateGoal
}
