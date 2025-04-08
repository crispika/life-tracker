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
    prefix?: string
    isFirstLevel: boolean
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
        ${data.isFirstLevel},
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

async function deleteGoalWithAllChildren(userId: number, goalId: number) {
  try {
    console.log(`尝试删除目标: userId=${userId}, goalId=${goalId}`)
    // 使用$queryRawUnsafe来执行存储过程，这样可以捕获所有结果集
    await prisma.$queryRawUnsafe(`
      CALL delete_goal_with_all_children(${userId}, ${goalId})
    `)

    return {
      success: true
    }
  } catch (error) {
    console.error('删除目标失败:', error)
    throw new Error(
      '删除目标失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

async function updateGoalState(userId: number, goalId: number, state: string) {
  try {
    await prisma.$queryRawUnsafe(`
      CALL update_goal_state(${userId}, ${goalId}, ${state})
    `)
  } catch (error) {
    console.error('更新目标状态失败:', error)
    throw new Error(
      '更新目标状态失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

export const goalMutations = {
  upsertUltimateGoal,
  createGoal,
  deleteGoalWithAllChildren,
  updateGoalState
}
