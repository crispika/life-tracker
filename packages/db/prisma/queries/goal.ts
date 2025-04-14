import { prisma } from '../../index';

// 递归构建树形结构的辅助函数
function buildGoalTree(goals: any[], parentId: number | null = null): any[] {
  return goals
    .filter((goal) => goal.parentId === parentId)
    .map((goal) => ({
      ...goal,
      children: buildGoalTree(goals, goal.id)
    }));
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
        color: true,
        is_first_level: true,
        code: true,
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
    });

    return buildGoalTree(
      goals.map((g) => ({
        id: g.goal_id,
        summary: g.summary,
        description: g.description,
        parentId: g.parent_id,
        color: g.color,
        isFirstLevel: !!g.is_first_level,
        code: g.code,
        prefix: {
          id: g.UC_GOAL_PREFIX.prefix_id,
          name: g.UC_GOAL_PREFIX.prefix
        },
        state: {
          id: g.GOAL_STATE.state_id,
          name: g.GOAL_STATE.name
        }
      }))
    );
  } catch (error) {
    console.error('Error fetching goal tree:', error);
    throw error;
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
    });
    return lifeGoal
      ? {
          id: lifeGoal.goal_id,
          summary: lifeGoal.summary,
          sidenote: lifeGoal.sidenote
        }
      : null;
  } catch (error) {
    throw new Error(
      '获取终极目标失败: ' +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

async function getGoalById(goalId: number) {
  try {
    const goal = await prisma.uC_GOAL.findUnique({
      where: {
        goal_id: goalId
      },
      include: {
        GOAL_STATE: true,
        UC_GOAL_PREFIX: true
      }
    });

    if (!goal) {
      return null;
    }

    return {
      id: goal.goal_id,
      summary: goal.summary,
      description: goal.description,
      parentId: goal.parent_id,
      color: goal.color,
      isFirstLevel: goal.is_first_level,
      prefix: {
        id: goal.UC_GOAL_PREFIX.prefix_id,
        name: goal.UC_GOAL_PREFIX.prefix
      },
      state: {
        id: goal.GOAL_STATE.state_id,
        name: goal.GOAL_STATE.name
      }
    };
  } catch (error) {
    console.error('Error fetching goal:', error);
    throw error;
  }
}

export const goalQueries = {
  getUserGoalTree,
  getUserUltimateGoal,
  getGoalById
};
