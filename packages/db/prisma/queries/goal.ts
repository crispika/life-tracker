import { prisma } from '../../index'

// 递归构建树形结构的辅助函数
function buildGoalTree(goals: any[], parentId: number | null = null): any[] {
  return goals
    .filter((goal) => goal.parentId === parentId)
    .map((goal) => ({
      ...goal,
      children: buildGoalTree(goals, goal.id)
    }))
}

// 获取用户的目标树形结构
async function getUserGoalTree(userId: number) {
  try {
    const goals = await prisma.uC_GOAL.findMany({
      where: {
        user_id: userId
      },
      select: {
        goal_id: true,
        summary: true,
        description: true,
        parent_id: true,
        GOAL_STATE: {
          select: {
            name: true,
            state_id: true
          }
        },
        UC_GOAL_PREFIX: {
          select: {
            prefix: true,
            prefix_id: true
          }
        }
      }
    })

    return buildGoalTree(
      goals.map((g) => ({
        id: g.goal_id,
        summary: g.summary,
        description: g.description,
        parentId: g.parent_id,
        prefix: {
          id: g.UC_GOAL_PREFIX.prefix_id,
          name: g.UC_GOAL_PREFIX.prefix
        },
        state: {
          id: g.GOAL_STATE.state_id,
          name: g.GOAL_STATE.name
        }
      }))
    )
  } catch (error) {
    console.error('Error fetching goal tree:', error)
    throw error
  }
}

// 获取单个目标及其子目标
async function getGoalWithChildren(goalId: number) {
  try {
    const goal = await prisma.uC_GOAL.findUnique({
      where: {
        goal_id: goalId
      },
      include: {
        GOAL_STATE: true,
        other_UC_GOAL: {
          include: {
            GOAL_STATE: true
          }
        }
      }
    })

    if (!goal) {
      return null
    }

    // 构建树形结构
    const goalTree = {
      ...goal,
      children: goal.other_UC_GOAL
    }

    return goalTree
  } catch (error) {
    console.error('Error fetching goal with children:', error)
    throw error
  }
}

// 获取用户的终极目标
async function getUserUltimateGoal(userId: number) {
  try {
    const lifeGoal = await prisma.uC_ULTIMATE_GOAL.findUnique({
      where: {
        user_id: userId
      },
      select: {
        goal_id: true,
        summary: true,
        sidenote: true
      }
    })
    return lifeGoal
      ? {
          id: lifeGoal.goal_id,
          summary: lifeGoal.summary,
          sidenote: lifeGoal.sidenote
        }
      : null
  } catch (error) {
    throw new Error(
      '获取终极目标失败: ' +
        (error instanceof Error ? error.message : String(error))
    )
  }
}

export const goalQueries = {
  getUserGoalTree,
  getGoalWithChildren,
  getUserUltimateGoal
}
